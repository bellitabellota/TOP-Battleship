import { createFleet } from "../../modules/utils/create-fleet";
import { Ship } from "../../modules/ship.js"
jest.mock("../../modules/ship.js")

describe("createFleet()", () => {
  test("creates a fleet with the correct ships", () => {
    const fleet = createFleet();
    expect(fleet.length).toBe(5);
    
    fleet.forEach((ship) => {
      expect(ship).toBeInstanceOf(Ship);
    });
  });
});