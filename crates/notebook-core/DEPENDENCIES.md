# Dependency qualification — experimental Notebook Core

All versions are exact workspace pins. `cargo deny check advisories licenses sources` is mandatory.

| Crate | Scope | Features | Licence | Rationale |
| --- | --- | --- | --- | --- |
| `argon2 0.6.0` | runtime | `zeroize`; no defaults/alloc/password-hash/rand | MIT OR Apache-2.0 | RustCrypto Argon2id v19; caller-provided memory via `hash_password_into_with_memory` |
| `aes-gcm 0.11.1` | runtime | `aes`, `zeroize`; no defaults/alloc/getrandom | MIT OR Apache-2.0 | RustCrypto AES-256-GCM, detached 16-byte tag, `AeadInOut` in-place API; `AesGcm: ZeroizeOnDrop` |
| `aes 0.9.3` | runtime, direct | `zeroize`; no defaults | MIT OR Apache-2.0 | registry crate, unpatched; direct pin only for the compile-time `ZeroizeOnDrop` and fixslice-width assertions in `crypto.rs` |
| `cpubits 0.1.1` | runtime, direct | no defaults | MIT OR Apache-2.0 | the word-width selector `aes` uses; evaluated in `crypto.rs` to assert the 64-bit fixsliced backend on wasm32 |
| `ghash 0.6.0`, `polyval 0.7.3` | runtime, transitive | `zeroize` forwarded by `aes-gcm/zeroize` | MIT OR Apache-2.0 | no direct anchor: `scripts/check-zeroize-chain.ts` refuses either resolving without `zeroize` |
| `base64 0.22.1` | runtime | `alloc`; no std default | MIT OR Apache-2.0 | strict RFC 4648 standard alphabet with decode/re-encode check |
| `sha2 0.11.0` | runtime | no defaults | MIT OR Apache-2.0 | SHA-256 envelope and Context digests |
| `subtle 2.6.1` | runtime | no defaults | BSD-3-Clause | constant-time digest comparison |
| `zeroize 1.9.0` | runtime | derive | MIT OR Apache-2.0 | scoped wiping for secret/key/plaintext/Argon2 blocks |
| `serde 1.0.229`, `serde_json 1.0.151` | runtime | workspace | MIT OR Apache-2.0 | strict typed envelope/context parsing with duplicate and unknown-field refusal |
| `serde_jcs 0.2.0` | runtime | defaults | MIT OR Apache-2.0 | RFC 8785 serialization; dependency implementation remains a Gate R audit target |
| `wit-bindgen 0.61.1` | runtime boundary | macros, realloc; no defaults/std/async | Apache-2.0 WITH LLVM-exception OR Apache-2.0 OR MIT | generated Component Model ABI from the locked v2 WIT |
| `wasmparser 0.253.0`, `wit-component 0.253.0` | development only | defaults | Apache-2.0 WITH LLVM-exception OR Apache-2.0 OR MIT | encode and inspect the actual component imports/exports |

No runtime dependency supplies clock, randomness, network, filesystem, storage, environment, logging,
thread pool, PHC string, or external service. The export-scoped id, salt, nonce, and 16-byte recovery secret are explicit host inputs.

## Review notes

- `argon2`'s convenience `hash_password_into` is intentionally not used because it allocates its
  block matrix internally. The engine fallibly preallocates and wraps caller-owned blocks in
  `Zeroizing`.
- Disabling Argon2 `alloc` also removes the `password-hash`/`rand_core` path from this crate's feature
  graph.
- Wipe chain. `aes-gcm 0.11/zeroize` forwards to `aes?/zeroize` and `ghash/zeroize`, and
  `ghash 0.6/zeroize` forwards to `polyval/zeroize`; `AesGcm` implements `ZeroizeOnDrop` through its
  members. Two gates hold this: a compile-time `ZeroizeOnDrop` assertion on `Aes256Gcm` and
  `aes::Aes256` in `crypto.rs`, and `scripts/check-zeroize-chain.ts` (`bun run check`), which reads
  `cargo metadata --locked` and refuses `aes`, `ghash` or `polyval` resolved without `zeroize` or
  resolved twice. Gate B must still verify the exact WASM backend.
- wasm32 word width. aes 0.9 selects its fixsliced backend width with `cpubits!`
  (RustCrypto/block-ciphers#532); `cpubits 0.1.1` promotes wasm32 to 64-bit words, which is the
  constant-time variant this crate was qualified on. `crypto.rs` evaluates the same macro and
  `const`-asserts 64 bits on wasm32, so an upstream heuristic change fails the wasm32 build.
- wasm32 builds require SIMD128 through `.cargo/config.toml`. This activates the pinned `sha2` crate's
  constant-time WebAssembly SHA-256 backend; the artifact inspector requires actual SIMD operators,
  and the three pinned browsers execute the same artifact during qualification.
- The AES-GCM implementation and JCS serializer are third-party cryptographic/canonicalization code;
  golden vectors, component qualification, advisories, source provenance, and Gate R remain required.
- `aes-wasm` was rejected because its bundled implementation explicitly disables side-channel
  mitigations. `ring` was rejected for this boundary because its private expanded AEAD key does not
  expose a zeroizing `Drop`. No alternate crypto service or native host capability is used.
- First-party release code denies unsafe Rust. The sole exception is the `qualification-faults`-and-WASM-only `GlobalAlloc` wrapper used to fail exactly the next dependency allocation; it delegates every other allocation/deallocation to `System`, is absent from normal artifacts, and remains review-only harness code. Generated WIT glue and dependencies are audited separately.

## History — vendored aes fork (retired 2026-09-08)

From the first Gate B input until 2026-09-08 this workspace carried
`third_party/rustcrypto-aes-0.8.4/`, the complete crates.io archive of `aes 0.8.4` (SHA-256
`b169f7a6d4742236a0a00c541b845991d0ac43e546831af1249753ab4c3aa3a0`, upstream commit
`f2dbee516b4d0cf4cb4f3045d09e35b5fd80087b`, MIT OR Apache-2.0 retained beside the source) wired
through `[patch.crates-io]`. Its only cryptographic change was one hunk in `src/soft.rs`: wasm32
selected the upstream `fixslice64.rs` constant-time backend instead of `fixslice32.rs`, because
WebAssembly has deterministic i64 arithmetic even though its pointers are 32-bit. No table lookup,
data-dependent branch, key schedule, unsafe block or zeroization behaviour was touched. `Cargo.toml`
additionally carried Rust `check-cfg` declarations for the three upstream cfg names.

Its `PATCH.md` bound every update to four steps: diff `src/` against the archive and allow only the
selector hunk; run the locked AES-GCM golden vectors and hostile mutations natively and in the three
browser engines; verify zero imports, the 512 MiB maximum, reproducible WASM bytes, strict Clippy,
`cargo deny` and both licences; rerun the 20-iteration browser performance matrix. It also recorded
the rejected alternatives: `aes-wasm` (its bundled Zig sets `side_channels_mitigations = .none`) and
`ring` (private expanded AEAD key without a zeroizing `Drop`) — both rejections still stand.

Retirement condition (ADR-0031 D1 in `libre-ai/governance`, owner decision 2026-09-08): a
vendored patch lives only until a published version carrying the fix is qualified. aes 0.9.3 selects
the 64-bit fixsliced backend on wasm32 through `cpubits` upstream, so the fork, its `PATCH.md`,
`BACKEND.patch`, the `[patch.crates-io]` entry and the `LicenseRef-ThirdParty-Notices` annotation
were removed together with the coordinated aes-gcm 0.11.1 / ghash 0.6.0 / polyval 0.7.3 bump. The
golden seal vector (`tests/golden.rs`, byte-exact canonical envelope) is the proof that the output
format did not move.
