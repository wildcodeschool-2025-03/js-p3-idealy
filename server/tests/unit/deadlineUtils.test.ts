import { calculateDeadlineSteps } from "../../../client/src/utils/deadlineUtils";

describe("🧪 calculateDeadlineSteps", () => {
  const format = (d: Date) => d.toISOString().split("T")[0];

  const cases = [
    {
      label: "1. Soumission à 23h59 pour décision à 00h01 le lendemain",
      start: new Date("2025-06-25T23:59:00Z"),
      end: new Date("2025-06-26T00:01:00Z"),
    },
    {
      label: "2. Intervalle d’une journée",
      start: new Date("2025-06-25T00:00:00Z"),
      end: new Date("2025-06-26T00:00:00Z"),
    },
    {
      label: "3. Quelques jours",
      start: new Date("2025-06-01T00:00:00Z"),
      end: new Date("2025-06-04T00:00:00Z"),
    },
    {
      label: "4. Deux semaines",
      start: new Date("2025-06-01T00:00:00Z"),
      end: new Date("2025-06-15T00:00:00Z"),
    },
    {
      label: "5. Chevauchement d’année",
      start: new Date("2025-12-15T00:00:00Z"),
      end: new Date("2026-01-15T00:00:00Z"),
    },
    {
      label:
        "6. Durée longue : décision fixée à plus d'un an après la création",
      start: new Date("2025-06-01T00:00:00Z"),
      end: new Date("2026-09-01T00:00:00Z"),
    },
  ];

  for (const { label, start, end } of cases) {
    test(label, () => {
      const result = calculateDeadlineSteps(start, end);
      expect(result).not.toBeNull();
      if (result) {
        const duration = end.getTime() - start.getTime();
        const expectedComment = new Date(start.getTime() + duration / 3);
        const expectedVote = new Date(start.getTime() + (2 * duration) / 3);

        expect(format(new Date(result.comment))).toBe(format(expectedComment));
        expect(format(new Date(result.vote))).toBe(format(expectedVote));
        expect(format(new Date(result.decision))).toBe(format(end));
      }
    });
  }

  test("7. Cas invalide : date de décision antérieure à la création → doit retourner null", () => {
    const result = calculateDeadlineSteps(
      new Date("2025-06-26T12:00:00Z"),
      new Date("2025-06-25T12:00:00Z"),
    );
    expect(result).toBeNull();
  });
});
