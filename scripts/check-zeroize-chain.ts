/**
 * Zeroize-chain gate (K4, crypto at rest). Every crate that holds AES-GCM
 * secret state — `aes` (key schedule), `ghash` and `polyval` (authentication
 * key and accumulator) — must resolve with its `zeroize` feature enabled.
 *
 * From aes-gcm 0.11 / ghash 0.6 the feature propagates down the chain
 * (`aes-gcm/zeroize -> aes?/zeroize + ghash/zeroize -> polyval/zeroize`), so
 * the direct feature anchors this workspace carried on 0.10 / 0.5 were
 * retired. This gate is what replaces them: it reads the RESOLVED graph, not
 * the manifests, so a future bump whose `zeroize` feature stops forwarding
 * fails here by crate name instead of silently leaving state in memory.
 */
import { spawnSync } from "node:child_process";

export const ZEROIZE_CHAIN = ["aes", "ghash", "polyval"] as const;

export interface CargoMetadata {
  packages: ReadonlyArray<{ id: string; name: string; version: string }>;
  resolve: { nodes: ReadonlyArray<{ id: string; features: ReadonlyArray<string> }> } | null;
}

export interface ZeroizeChainVerdict {
  ok: boolean;
  lines: string[];
}

export function evaluateZeroizeChain(metadata: CargoMetadata): ZeroizeChainVerdict {
  const lines: string[] = [];
  let ok = true;
  if (metadata.resolve === null) {
    return { ok: false, lines: ["cargo metadata carried no resolved graph (`resolve` is null)"] };
  }
  const featuresById = new Map(metadata.resolve.nodes.map((node) => [node.id, node.features]));
  for (const name of ZEROIZE_CHAIN) {
    const candidates = metadata.packages.filter((pkg) => pkg.name === name);
    if (candidates.length === 0) {
      ok = false;
      lines.push(`${name}: not in the resolved graph`);
      continue;
    }
    if (candidates.length > 1) {
      ok = false;
      const versions = candidates.map((pkg) => pkg.version).join(", ");
      lines.push(
        `${name}: ${candidates.length} versions resolved (${versions}); the chain must be unique`,
      );
      continue;
    }
    const [pkg] = candidates;
    const features = featuresById.get(pkg.id) ?? [];
    if (features.includes("zeroize")) {
      lines.push(`${name} ${pkg.version}: zeroize on`);
    } else {
      ok = false;
      lines.push(`${name} ${pkg.version}: zeroize MISSING (features: [${features.join(", ")}])`);
    }
  }
  return { ok, lines };
}

function readResolvedMetadata(): CargoMetadata {
  const result = spawnSync("cargo", ["metadata", "--format-version", "1"], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (result.status !== 0) {
    throw new Error(`cargo metadata --locked failed (exit ${result.status}):\n${result.stderr}`);
  }
  return JSON.parse(result.stdout) as CargoMetadata;
}

if (import.meta.main) {
  const verdict = evaluateZeroizeChain(readResolvedMetadata());
  for (const line of verdict.lines) console.log(line);
  if (!verdict.ok) {
    console.error(
      "Zeroize chain broken: a crate holding AES-GCM state resolves without `zeroize`.",
    );
    process.exit(1);
  }
  console.log(`Zeroize chain intact (${ZEROIZE_CHAIN.join(", ")})`);
}
