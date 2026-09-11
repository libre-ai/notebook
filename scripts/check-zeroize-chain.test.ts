import { describe, expect, test } from "bun:test";

import { type CargoMetadata, evaluateZeroizeChain } from "./check-zeroize-chain.ts";

const FIXTURES = new URL("./fixtures/zeroize-chain/", import.meta.url);

async function fixture(name: string): Promise<CargoMetadata> {
  return (await Bun.file(new URL(name, FIXTURES)).json()) as CargoMetadata;
}

describe("zeroize chain gate", () => {
  test("accepts a graph where zeroize propagates to every crate of the chain", async () => {
    const verdict = evaluateZeroizeChain(await fixture("propagated.json"));
    expect(verdict.ok).toBe(true);
    expect(verdict.lines).toEqual([
      "aes 0.9.3: zeroize on",
      "ghash 0.6.0: zeroize on",
      "polyval 0.7.3: zeroize on",
    ]);
  });

  test("refuses ghash 0.5 not forwarding zeroize to polyval, naming the crate", async () => {
    const verdict = evaluateZeroizeChain(await fixture("unanchored.json"));
    expect(verdict.ok).toBe(false);
    expect(verdict.lines).toContain("polyval 0.6.2: zeroize MISSING (features: [])");
    expect(verdict.lines).toContain("ghash 0.5.1: zeroize on");
  });

  test("refuses a chain crate absent from the graph", async () => {
    const metadata = await fixture("propagated.json");
    const withoutPolyval: CargoMetadata = {
      packages: metadata.packages.filter((pkg) => pkg.name !== "polyval"),
      resolve: metadata.resolve,
    };
    const verdict = evaluateZeroizeChain(withoutPolyval);
    expect(verdict.ok).toBe(false);
    expect(verdict.lines).toContain("polyval: not in the resolved graph");
  });

  test("refuses two resolved versions of one chain crate", async () => {
    const metadata = await fixture("propagated.json");
    const duplicated: CargoMetadata = {
      packages: [
        ...metadata.packages,
        { id: "registry+polyval@0.6.2", name: "polyval", version: "0.6.2" },
      ],
      resolve: {
        nodes: [
          ...(metadata.resolve?.nodes ?? []),
          { id: "registry+polyval@0.6.2", features: ["zeroize"] },
        ],
      },
    };
    const verdict = evaluateZeroizeChain(duplicated);
    expect(verdict.ok).toBe(false);
    expect(verdict.lines).toContain(
      "polyval: 2 versions resolved (0.7.3, 0.6.2); the chain must be unique",
    );
  });

  test("refuses metadata without a resolved graph", () => {
    const verdict = evaluateZeroizeChain({ packages: [], resolve: null });
    expect(verdict.ok).toBe(false);
  });
});
