import { getRandomInteger } from "../../modules/utils/random-integer";

test("returns a number between 0 and 9 (both included)", () => { 
  for (let i = 0; i < 100; i++) {
    const randomNumber = getRandomInteger();
    expect(Number.isInteger(randomNumber)).toBe(true);
    
    expect(randomNumber).toBeGreaterThanOrEqual(0);
    expect(randomNumber).toBeLessThanOrEqual(9);
  }
})