function isAdmin(user?: { isAdmin?: boolean }) {
  return !!user && user.isAdmin === true;
}

describe("isAdmin", () => {
  test("retourne true si l'utilisateur est admin", () => {
    expect(isAdmin({ isAdmin: true })).toBe(true);
  });
  test("retourne false sinon", () => {
    expect(isAdmin({ isAdmin: false })).toBe(false);
    expect(isAdmin(undefined)).toBe(false);
  });
});
