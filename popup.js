document.getElementById("fetchButton").addEventListener("click", fetchData);

const visibleTraits = {
  // "parts type": true,
  "maximum number": "top",
  job: "top",
  // specific_skill: "bottom",
  potential_ability: "bottom",
  potential_effect: "bottom",
  potential_activate: "bottom",
  material_exp: "bottom",
  level: "top",
  equipability_level: "top",
  condition: "bottom",
  // cumulative_condition_recovery: true,
  // exp: true,
  hp: "middle",
  mp: "middle",
  attack: "middle",
  defense: "middle",
  magic_attack: "middle",
  atk_spd: "middle",
  str: "middle",
  vit: "middle",
  agi: "middle",
  int: "middle",
  dex: "middle",
  mnd: "middle",
  // effect: "middle",
  physical_cri: "middle",
  physical_cri_multi: "middle",
  magic_cri: "middle",
  magic_cri_multi: "middle",
  cast_spd: "middle",
  def_proficiency: "middle",
  guard: "middle",
  guard_effect: "middle",
  physical_resist: "middle_sub",
  magic_resist: "middle_sub",
  fire_resist: "middle_sub",
  wind_resist: "middle_sub",
  water_resist: "middle_sub",
  earth_resist: "middle_sub",
  holy_resist: "middle_sub",
  dark_resist: "middle_sub",
  critical_resist: "middle_sub",
  sleep_resist: "middle_sub",
  stun_resist: "middle_sub",
  poison_resist: "middle_sub",
  silence_resist: "middle_sub",
  root_resist: "middle_sub",
  snare_resist: "middle_sub",
  item_drop_rate: "bottom",
  limit_level: "bottom",
  max_level: "bottom",
  "release date": "top",
};

const keyMap = {
  // ["部位"]: "parts type",
  ["発行上限数"]: "maximum number",
  ["対象職"]: "job",
  ["特定スキル"]: "specific_skill",
  ["覚醒スキル"]: "potential_ability",
  ["覚醒スキル効果"]: "potential_effect",
  ["覚醒スキルの解放"]: "potential_activate",
  ["素材EXP"]: "material_exp",
  ["装備可能レベル"]: "equipability_level",
  ["CND"]: "condition",
  ["Lv"]: "level",
  ["HP"]: "hp",
  ["MP"]: "mp",
  ["腕力"]: "str",
  ["体力"]: "vit",
  ["速さ"]: "agi",
  ["知力"]: "int",
  ["器用"]: "dex",
  ["精神"]: "mnd",
  ["攻撃力"]: "attack",
  ["防御力"]: "defense",
  ["魔攻"]: "magic_attack",
  ["攻撃速度"]: "atk_spd",
  ["物CRI値"]: "physical_cri",
  ["物CRI倍率"]: "physical_cri_multi",
  ["魔CRI値"]: "magic_cri",
  ["魔CRI倍率"]: "magic_cri_multi",
  ["詠唱速度"]: "cast_spd",
  ["防御効率"]: "def_proficiency",
  ["ガード"]: "guard",
  ["ガード効果"]: "guard_effect",
  ["物理"]: "physical_resist",
  ["魔"]: "magic_resist",
  ["火"]: "fire_resist",
  ["風"]: "wind_resist",
  ["水"]: "water_resist",
  ["土"]: "earth_resist",
  ["光"]: "holy_resist",
  ["闇"]: "dark_resist",
  ["CRI"]: "critical_resist",
  ["眠り"]: "sleep_resist",
  ["麻痺"]: "stun_resist",
  ["毒"]: "poison_resist",
  ["沈黙"]: "silence_resist",
  ["足止め"]: "root_resist",
  ["鈍重"]: "snare_resist",
  ["限界レベル"]: "limit_level",
  ["最大レベル"]: "max_level",
  ["ドロ率"]: "item_drop_rate",
  ["リリース日"]: "release date",
};

const reverseKeyMap = Object.fromEntries(Object.entries(keyMap).map(([key, value]) => [value, key]));
const resultElement = document.getElementById("result");

function fetchData() {
  let url = "";
  const itemId = document.getElementById("itemId").value;
  if (itemId < 1000000003450) {
    url = `https://api01.genso.game/api/metadata/${itemId}`;
  } else {
    url = `https://api01.genso.game/api/genso_v2_metadata/${itemId}`;
  }

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // console.log("Fetched data:", JSON.stringify(data, null, 2));
      displayData(data);
    })
    .catch(error => {
      console.error("Fetch error:", error);
      resultElement.textContent = `Error fetching data: ${error.message}`;
    });
}

function displayData(data) {
  // Empty parent node first
  while (resultElement.firstChild) {
    resultElement.removeChild(resultElement.firstChild);
  }

  const mainInfoContainer = document.createElement("div");
  mainInfoContainer.classList.add("main_info");
  const imageElement = document.createElement("div");
  imageElement.innerHTML = `<img src=${data.image} class="equip_image" />`;
  // mainInfoContainer.appendChild(imageElement);
  const mainInfoTextElement = document.createElement("div");
  mainInfoTextElement.classList.add("main_info__text");
  mainInfoTextElement.innerHTML = `<h1 class="name">${data.name}</h1>`;

  try {
    console.log("Processing data:", JSON.stringify(data, null, 2));

    if (!data || typeof data !== "object") {
      throw new Error("Invalid data format: data is not an object");
    }

    const attributes = data.attributes;
    if (!attributes || !Array.isArray(attributes)) {
      throw new Error("Invalid data format: attributes not found or not an array");
    }

    let attrElement = document.createElement("div");
    attrElement.classList.add("attr_list");
    let attrHTML = "";
    let attrSubHTML = "";
    let attrBottomHTML = "";

    for (const attr of attributes) {
      if (attr && typeof attr === "object" && "trait_type" in attr && "value" in attr) {
        // Item Type
        if (attr.trait_type === "item type") {
          const elem = document.createElement("div");
          elem.classList.add("item_type", "tag");
          elem.innerText = attr.value === "base_equipment" ? "ベース" : "オシャレ";
          mainInfoTextElement.appendChild(elem);
        }
        // Parts Type
        if (attr.trait_type === "parts type") {
          const elem = document.createElement("div");
          elem.classList.add("parts_type", "tag");
          elem.innerText = attr.value;
          mainInfoTextElement.appendChild(elem);
        }
        // Rarity
        if (attr.trait_type === "rarity") {
          const elem = document.createElement("div");
          elem.classList.add("rarity", "tag");
          let rarity = "";
          switch (attr.value) {
            case "legend":
              rarity = "LR";
              break;
            case "super_rare":
              rarity = "SR";
              break;
            case "rare":
              rarity = "R";
              break;
            case "normal":
              rarity = "N";
              break;
          }
          elem.innerText = rarity;
          mainInfoTextElement.appendChild(elem);
        }

        // Numbering
        if (attr.trait_type === "numbering") {
          const elem = document.createElement("div");
          elem.classList.add("numbering");
          elem.innerText = "#" + attr.value;
          mainInfoTextElement.appendChild(elem);
        }

        mainInfoContainer.appendChild(mainInfoTextElement);

        // Main attributes
        if (visibleTraits[attr.trait_type] === "middle") {
          const displayName = reverseKeyMap[attr.trait_type] || attr.trait_type;
          let displayValue = attr.value !== null ? attr.value : "-";
          attrHTML += `<div>${displayName}: <span class="attr_value">${displayValue}</span></div>`;
        }

        // Resist attributes
        if (visibleTraits[attr.trait_type] === "middle_sub") {
          const displayName = reverseKeyMap[attr.trait_type] || attr.trait_type;
          let displayValue = attr.value !== null ? attr.value : "-";
          attrSubHTML += `<div class="attr_resist">${displayName}: <span class="attr_value">${displayValue}</span></div>`;
        }

        // Other attributes
        if (visibleTraits[attr.trait_type] === "bottom") {
          const displayName = reverseKeyMap[attr.trait_type] || attr.trait_type;
          let displayValue = attr.value !== null ? attr.value : "-";

          // Format release date
          if (attr.trait_type === "release date" && attr.value) {
            const date = new Date(attr.value * 1000); // Convert seconds to milliseconds
            displayValue = date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
          }
          attrBottomHTML += `<div>${displayName}: ${displayValue}</div>`;
        }
      } else {
        console.warn("Skipping invalid attribute:", attr);
      }
    }

    attrElement.innerHTML =
      attrHTML +
      `<h4 style="grid-column: span 2; margin-top:10px;">耐性</h4><div style="grid-column: span 2; margin-bottom: 20px">` +
      attrSubHTML +
      "</div>" +
      attrBottomHTML;
    resultElement.appendChild(mainInfoContainer);
    resultElement.appendChild(attrElement);
  } catch (error) {
    console.error("Error in displayData:", error);
    resultElement.textContent = `Error processing data: ${error.message}`;
  }
}

// Log any unhandled errors
window.addEventListener("error", function (event) {
  console.error("Unhandled error:", event.error);
});
