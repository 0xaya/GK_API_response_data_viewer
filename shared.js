// shared.js
const visibleTraits = {
  "maximum number": "top",
  job: "top",
  potential_ability: "bottom",
  potential_effect: "bottom",
  potential_activate: "bottom",
  material_exp: "bottom",
  level: "top",
  equipability_level: "top",
  condition: "bottom",
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

function displayData(data, resultElem, modal, priceSold, timeSold) {
  const resultElement = resultElem;
  // empty content
  resultElement.innerHTML = "";

  // if it's a modal add close button
  if (modal) {
    const closeButton = document.createElement("button");
    closeButton.innerHTML = "&times;";
    closeButton.style.cssText = `
    position: absolute;
    top: -15px;
    right: -15px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: #a417fa;
    color: white;
    font-size: 23px;
    border: none;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 0 4px 2px;
  `;
    closeButton.onclick = () => document.body.removeChild(modal);
    resultElement.appendChild(closeButton);
  }

  const mainInfoContainer = document.createElement("div");
  mainInfoContainer.classList.add("main_info");
  const imageElement = document.createElement("div");
  imageElement.innerHTML = `<img src=${data.image} class="equip_image" />`;
  mainInfoContainer.appendChild(imageElement);
  const mainInfoTextElement = document.createElement("div");
  mainInfoTextElement.classList.add("main_info__text");
  mainInfoTextElement.innerHTML = `<h1 class="name">${data.name}</h1><span class="item_id font-xsmall">${data.itemId}</span>`;

  // Sales info
  if (priceSold && timeSold) {
    const elem = document.createElement("div");
    elem.classList.add("sales_info");
    elem.innerHTML = `<span class="font-purple font-smaller">${priceSold}</span> <span class="font-smaller">${timeSold}</span>`;
    mainInfoTextElement.appendChild(elem);
  }

  try {
    // console.log("Processing data:", JSON.stringify(data, null, 2));

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
          let partsType = "";
          switch (attr.value) {
            case "head":
              partsType = "頭";
              break;
            case "body":
              partsType = "体";
              break;
            case "leg":
              partsType = "足";
              break;
            case "r_hand":
              partsType = "右手";
              break;
            case "l_hand":
              partsType = "左手";
              break;
            case "shoulder":
              partsType = "肩";
              break;
            case "back":
              partsType = "背中";
              break;
            case "ring":
              partsType = "リング";
              break;
            case "setup":
              partsType = "セットアップ";
              break;
          }
          elem.innerText = partsType;
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
        // Level
        if (attr.trait_type === "level") {
          const elem = document.createElement("div");
          elem.classList.add("level", "tag");
          elem.innerText = "Lv" + attr.value;
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
          attrHTML += `<div>${displayName}: <span class="attr_value font-purple">${displayValue}</span></div>`;
        }

        // Resist attributes
        if (visibleTraits[attr.trait_type] === "middle_sub") {
          const displayName = reverseKeyMap[attr.trait_type] || attr.trait_type;
          let displayValue = attr.value !== null ? attr.value : "-";
          attrSubHTML += `<div class="attr_resist">${displayName}: <span class="attr_value font-purple">${displayValue}</span></div>`;
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
          attrBottomHTML += `<div class="grid_span2"><span class="attr_semibold">${displayName}</span>: ${displayValue}</div>`;
        }
      } else {
        console.warn("Skipping invalid attribute:", attr);
      }
    }

    attrElement.innerHTML =
      attrHTML +
      `<h4 class="grid_span2" style="margin-top:10px;">耐性</h4><div class="grid_span2" style="margin-bottom: 20px">` +
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

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "pm" : "am";

  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  hours = String(hours).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes} ${ampm}`;
}