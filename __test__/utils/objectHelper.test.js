const { flattenObj } = require("../../src/utils/objectHelper");

describe("flattenObj", () => {
  it("should flatten objects and arrays and ignore the rest", () => {
    const data = {
      name: {
        english: "Squirtle",
        japanese: "ゼニガメ",
        chinese: "杰尼龟"
      },
      base: {
        HP: 44,
        Attack: 48,
        Defense: 65,
        SpAttack: 50,
        SpDefence: 64,
        Speed: 43
      },
      type: ["Water"],
      _id: "5cfe022f42b1786675d67e79",
      id: 7
    };

    const result = flattenObj(data);
    expect(result).toEqual({
      "name.english": "Squirtle",
      "name.japanese": "ゼニガメ",
      "name.chinese": "杰尼龟",
      "base.HP": 44,
      "base.Attack": 48,
      "base.Defense": 65,
      "base.SpAttack": 50,
      "base.SpDefence": 64,
      "base.Speed": 43,
      type: ["Water"]
    });
  });

  it("should not include type or fields if not passed in", () => {
    const data = {
      base: {
        Defense: 65
      }
    };

    const result = flattenObj(data);
    expect(result).toEqual({
      "base.Defense": 65
    });
  });

  it("should returns an empty if input is empty", () => {
    expect(flattenObj({})).toEqual({});
  });
});
