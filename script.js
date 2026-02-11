const ROUTES = {
  "/": "homePanel",
  "/regex": "regexTool",
  "/binary": "binaryTool",
  "/base64": "base64Tool",
  "/hex-ascii": "hexAsciiTool",
  "/bin-hex": "binHexTool",
  "/hidden": "hiddenTool",
  "/newlines": "newlineTool",
  "/json": "jsonTool",
  "/subnet": "subnetTool",
  "/units": "unitTool",
  "/rot": "rotTool",
};

const toolsLayout = document.getElementById("toolsLayout");
const toolPanels = [...document.querySelectorAll("[data-tool-panel]")];
const toolLinks = [...document.querySelectorAll(".tool-link")];

function currentRoute() {
  const hash = window.location.hash || "#/";
  if (!hash.startsWith("#/")) {
    return "/";
  }
  const route = hash.slice(1);
  return ROUTES[route] ? route : "/";
}

function setActiveNav(route) {
  toolLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${route}`;
    link.classList.toggle("active", isActive);
  });
}

function renderRoute() {
  const route = currentRoute();
  const panelId = ROUTES[route];

  toolPanels.forEach((panel) => {
    panel.classList.toggle("active", panel.id === panelId);
  });

  setActiveNav(route);
  toolsLayout.classList.toggle("home-mode", route === "/");

  if (window.location.hash !== `#${route}`) {
    window.location.hash = `#${route}`;
  }
}

window.addEventListener("hashchange", renderRoute);
renderRoute();

const regexPattern = document.getElementById("regexPattern");
const regexFlags = document.getElementById("regexFlags");
const regexText = document.getElementById("regexText");
const regexStatus = document.getElementById("regexStatus");
const regexPreview = document.getElementById("regexPreview");
const runRegex = document.getElementById("runRegex");
const clearRegex = document.getElementById("clearRegex");

const asciiInput = document.getElementById("asciiInput");
const binaryInput = document.getElementById("binaryInput");
const binaryStatus = document.getElementById("binaryStatus");
const asciiToBin = document.getElementById("asciiToBin");
const binToAscii = document.getElementById("binToAscii");

const base64Input = document.getElementById("base64Input");
const base64Output = document.getElementById("base64Output");
const encodeB64 = document.getElementById("encodeB64");
const decodeB64 = document.getElementById("decodeB64");

const hexAsciiText = document.getElementById("hexAsciiText");
const hexAsciiHex = document.getElementById("hexAsciiHex");
const hexAsciiStatus = document.getElementById("hexAsciiStatus");
const asciiToHex = document.getElementById("asciiToHex");
const hexToAscii = document.getElementById("hexToAscii");

const numberInput = document.getElementById("numberInput");
const numberBase = document.getElementById("numberBase");
const numberOutBin = document.getElementById("numberOutBin");
const numberOutOct = document.getElementById("numberOutOct");
const numberOutDec = document.getElementById("numberOutDec");
const numberOutHex = document.getElementById("numberOutHex");
const binHexStatus = document.getElementById("binHexStatus");
const convertNumberBases = document.getElementById("convertNumberBases");

const hiddenInput = document.getElementById("hiddenInput");
const hiddenOutput = document.getElementById("hiddenOutput");
const hiddenStats = document.getElementById("hiddenStats");
const showHidden = document.getElementById("showHidden");

const newlineInput = document.getElementById("newlineInput");
const newlineOutput = document.getElementById("newlineOutput");
const collapseNewlines = document.getElementById("collapseNewlines");

const jsonInput = document.getElementById("jsonInput");
const jsonOutput = document.getElementById("jsonOutput");
const jsonStatus = document.getElementById("jsonStatus");
const formatJson = document.getElementById("formatJson");
const minifyJson = document.getElementById("minifyJson");

const subnetInput = document.getElementById("subnetInput");
const calculateSubnet = document.getElementById("calculateSubnet");
const subnetStatus = document.getElementById("subnetStatus");
const subnetTree = document.getElementById("subnetTree");

const unitValue = document.getElementById("unitValue");
const unitFrom = document.getElementById("unitFrom");
const unitTo = document.getElementById("unitTo");
const convertUnits = document.getElementById("convertUnits");
const unitStatus = document.getElementById("unitStatus");
const unitResult = document.getElementById("unitResult");

const rotInput = document.getElementById("rotInput");
const rotAmount = document.getElementById("rotAmount");
const rotDirection = document.getElementById("rotDirection");
const applyRot = document.getElementById("applyRot");
const rotOutput = document.getElementById("rotOutput");
const rotStatus = document.getElementById("rotStatus");

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function findRegexMatches(pattern, flags, text) {
  const globalFlags = flags.includes("g") ? flags : `${flags}g`;
  const regex = new RegExp(pattern, globalFlags);
  const matches = [];
  let match = regex.exec(text);

  while (match) {
    matches.push({ index: match.index, value: match[0] });

    if (match[0] === "") {
      regex.lastIndex += 1;
    }

    match = regex.exec(text);
  }

  return matches;
}

function runRegexHighlight() {
  const pattern = regexPattern.value;
  const flags = regexFlags.value;
  const text = regexText.value;

  if (!pattern) {
    regexStatus.textContent = "Enter a regex pattern first.";
    regexStatus.className = "small text-danger mt-3";
    regexPreview.textContent = text;
    return;
  }

  try {
    const matches = findRegexMatches(pattern, flags, text);

    if (matches.length === 0) {
      regexStatus.textContent = "No matches found.";
      regexStatus.className = "small text-muted mt-3";
      regexPreview.textContent = text;
      return;
    }

    let html = "";
    let cursor = 0;

    matches.forEach((match) => {
      const start = match.index;
      const end = match.index + match.value.length;
      html += escapeHtml(text.slice(cursor, start));

      if (start === end) {
        html += '<mark class="zero-match">∅</mark>';
      } else {
        html += `<mark>${escapeHtml(text.slice(start, end))}</mark>`;
      }

      cursor = end;
    });

    html += escapeHtml(text.slice(cursor));
    regexPreview.innerHTML = html;
    regexStatus.textContent = `${matches.length} match(es) highlighted.`;
    regexStatus.className = "small text-success mt-3";
  } catch (error) {
    regexStatus.textContent = `Regex error: ${error.message}`;
    regexStatus.className = "small text-danger mt-3";
    regexPreview.textContent = text;
  }
}

function asciiTextToBinary(text) {
  return [...text]
    .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
    .join(" ");
}

function binaryToAsciiText(bits) {
  const chunks = bits.trim().split(/\s+/).filter(Boolean);

  for (const chunk of chunks) {
    if (!/^[01]{8}$/.test(chunk)) {
      throw new Error(`Invalid byte '${chunk}'. Use 8-bit groups separated by spaces.`);
    }
  }

  return chunks.map((chunk) => String.fromCharCode(parseInt(chunk, 2))).join("");
}

function setBinaryStatus(message, isError = false) {
  binaryStatus.textContent = message;
  binaryStatus.className = `small mt-2 ${isError ? "text-danger" : "text-success"}`;
}

function setHexAsciiStatus(message, isError = false) {
  hexAsciiStatus.textContent = message;
  hexAsciiStatus.className = `small mt-2 ${isError ? "text-danger" : "text-success"}`;
}

function setBinHexStatus(message, isError = false) {
  binHexStatus.textContent = message;
  binHexStatus.className = `small mt-2 ${isError ? "text-danger" : "text-success"}`;
}

function asciiTextToHex(text) {
  const bytes = new TextEncoder().encode(text);
  return [...bytes]
    .map((byte) => byte.toString(16).padStart(2, "0").toUpperCase())
    .join(" ");
}

function hexToAsciiText(hexInput) {
  const cleaned = hexInput.replaceAll(/0x/gi, "").replaceAll(/\s+/g, "");
  if (cleaned.length === 0) {
    return "";
  }
  if (cleaned.length % 2 !== 0) {
    throw new Error("Hex input must have an even number of digits.");
  }
  if (!/^[0-9a-fA-F]+$/.test(cleaned)) {
    throw new Error("Hex input can only contain 0-9 and A-F.");
  }

  const bytes = [];
  for (let i = 0; i < cleaned.length; i += 2) {
    bytes.push(parseInt(cleaned.slice(i, i + 2), 16));
  }
  return new TextDecoder().decode(new Uint8Array(bytes));
}

function parseNumberByBase(value, base) {
  const raw = value.trim().replaceAll(/\s+/g, "").replaceAll("_", "");
  if (!raw) {
    throw new Error("Enter a number first.");
  }

  if (base === "bin") {
    if (!/^[01]+$/.test(raw)) {
      throw new Error("Binary input can only contain 0 and 1.");
    }
    return BigInt(`0b${raw}`);
  }

  if (base === "oct") {
    if (!/^[0-7]+$/.test(raw)) {
      throw new Error("Octal input can only contain 0-7.");
    }
    return BigInt(`0o${raw}`);
  }

  if (base === "dec") {
    if (!/^[0-9]+$/.test(raw)) {
      throw new Error("Decimal input can only contain 0-9.");
    }
    return BigInt(raw);
  }

  if (base === "hex") {
    const cleanedHex = raw.replace(/^0x/i, "");
    if (!/^[0-9a-fA-F]+$/.test(cleanedHex)) {
      throw new Error("Hex input can only contain 0-9 and A-F.");
    }
    return BigInt(`0x${cleanedHex}`);
  }

  throw new Error("Unsupported base.");
}

function encodeBase64(input) {
  const bytes = new TextEncoder().encode(input);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function decodeBase64(input) {
  const binary = atob(input);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function visualizeHiddenChars(text) {
  let spaces = 0;
  let tabs = 0;
  let newlines = 0;
  let carriageReturns = 0;
  let visual = "";

  for (const char of text) {
    if (char === " ") {
      spaces += 1;
      visual += "·";
    } else if (char === "\t") {
      tabs += 1;
      visual += "→\t";
    } else if (char === "\n") {
      newlines += 1;
      visual += "↵\n";
    } else if (char === "\r") {
      carriageReturns += 1;
      visual += "␍";
    } else {
      visual += char;
    }
  }

  return { visual, spaces, tabs, newlines, carriageReturns };
}

function ipToInt(ip) {
  const parts = ip.split(".");
  if (parts.length !== 4) {
    throw new Error("IPv4 must have exactly 4 octets.");
  }

  const octets = parts.map((part) => {
    if (!/^\d+$/.test(part)) {
      throw new Error("IPv4 octets must be numeric.");
    }
    const value = Number(part);
    if (value < 0 || value > 255) {
      throw new Error("Each octet must be in the range 0-255.");
    }
    return value;
  });

  return (((octets[0] << 24) >>> 0) | (octets[1] << 16) | (octets[2] << 8) | octets[3]) >>> 0;
}

function intToIp(value) {
  return [
    (value >>> 24) & 255,
    (value >>> 16) & 255,
    (value >>> 8) & 255,
    value & 255,
  ].join(".");
}

function prefixMask(prefix) {
  if (prefix === 0) {
    return 0;
  }
  return (0xffffffff << (32 - prefix)) >>> 0;
}

function parseCidr(input) {
  const trimmed = input.trim();
  const [ip, prefixText] = trimmed.split("/");
  if (!ip || prefixText === undefined) {
    throw new Error("Use CIDR format like 192.168.1.0/24.");
  }

  if (!/^\d+$/.test(prefixText)) {
    throw new Error("Prefix must be a number between 0 and 32.");
  }

  const prefix = Number(prefixText);
  if (prefix < 0 || prefix > 32) {
    throw new Error("Prefix must be between 0 and 32.");
  }

  return { ipInt: ipToInt(ip), prefix };
}

function subnetFrom(ipInt, prefix) {
  const mask = prefixMask(prefix);
  const network = ipInt & mask;
  const hostMask = (~mask) >>> 0;
  const broadcast = (network | hostMask) >>> 0;
  const usableCount = prefix >= 31 ? 0 : Math.max(2 ** (32 - prefix) - 2, 0);
  const firstUsable = usableCount > 0 ? (network + 1) >>> 0 : null;
  const lastUsable = usableCount > 0 ? (broadcast - 1) >>> 0 : null;
  return {
    network,
    prefix,
    broadcast,
    totalIPs: 2 ** (32 - prefix),
    usableCount,
    firstUsable,
    lastUsable,
  };
}

function createSubnetNode(subnet) {
  const node = document.createElement("div");
  node.className = "subnet-node";

  const heading = document.createElement("div");
  heading.className = "subnet-heading";
  heading.textContent = `${intToIp(subnet.network)}/${subnet.prefix}`;
  node.append(heading);

  const meta = document.createElement("div");
  meta.className = "subnet-meta";

  const fields = [
    ["Network", intToIp(subnet.network)],
    ["Broadcast", intToIp(subnet.broadcast)],
    ["Total IPs", String(subnet.totalIPs)],
    ["Usable IPs", String(subnet.usableCount)],
    [
      "Usable Range",
      subnet.firstUsable === null || subnet.lastUsable === null
        ? "N/A"
        : `${intToIp(subnet.firstUsable)} - ${intToIp(subnet.lastUsable)}`,
    ],
  ];

  fields.forEach(([label, value]) => {
    const item = document.createElement("div");
    item.className = "subnet-meta-item";

    const labelEl = document.createElement("span");
    labelEl.className = "subnet-meta-label";
    labelEl.textContent = `${label}:`;

    const valueEl = document.createElement("span");
    valueEl.className = "subnet-meta-value";
    valueEl.textContent = value;

    item.append(labelEl, valueEl);
    meta.append(item);
  });
  node.append(meta);

  const actions = document.createElement("div");
  actions.className = "subnet-actions";

  const splitButton = document.createElement("button");
  splitButton.type = "button";
  splitButton.className = "btn btn-sm btn-outline-primary";
  splitButton.textContent = "Split in half";

  const joinButton = document.createElement("button");
  joinButton.type = "button";
  joinButton.className = "btn btn-sm btn-outline-secondary";
  joinButton.textContent = "Join";
  joinButton.disabled = true;

  actions.append(splitButton, joinButton);
  node.append(actions);

  const children = document.createElement("div");
  children.className = "subnet-children";
  node.append(children);

  const maxSplit = subnet.prefix < 32;
  splitButton.disabled = !maxSplit;
  if (!maxSplit) {
    splitButton.textContent = "Cannot split /32";
  }

  splitButton.addEventListener("click", () => {
    if (children.childElementCount > 0) {
      return;
    }

    const nextPrefix = subnet.prefix + 1;
    const childSize = 2 ** (32 - nextPrefix);
    const left = subnetFrom(subnet.network, nextPrefix);
    const right = subnetFrom((subnet.network + childSize) >>> 0, nextPrefix);
    children.append(createSubnetNode(left), createSubnetNode(right));
    joinButton.disabled = false;
  });

  joinButton.addEventListener("click", () => {
    children.replaceChildren();
    joinButton.disabled = true;
  });

  return node;
}

function setSubnetStatus(message, isError = false) {
  subnetStatus.textContent = message;
  subnetStatus.className = `small mt-2 ${isError ? "text-danger" : "text-success"}`;
}

const DATA_UNITS = {
  b: 1,
  Kb: 1000,
  Mb: 1000 ** 2,
  Gb: 1000 ** 3,
  Tb: 1000 ** 4,
  Kib: 1024,
  Mib: 1024 ** 2,
  Gib: 1024 ** 3,
  Tib: 1024 ** 4,
  B: 8,
  KB: 8 * 1000,
  MB: 8 * (1000 ** 2),
  GB: 8 * (1000 ** 3),
  TB: 8 * (1000 ** 4),
  KiB: 8 * 1024,
  MiB: 8 * (1024 ** 2),
  GiB: 8 * (1024 ** 3),
  TiB: 8 * (1024 ** 4),
};

function setUnitStatus(message, isError = false) {
  unitStatus.textContent = message;
  unitStatus.className = `small mt-2 ${isError ? "text-danger" : "text-success"}`;
}

function rotateText(text, amount) {
  return [...text]
    .map((char) => {
      const code = char.charCodeAt(0);

      if (code >= 65 && code <= 90) {
        return String.fromCharCode(((code - 65 + amount + 26) % 26) + 65);
      }

      if (code >= 97 && code <= 122) {
        return String.fromCharCode(((code - 97 + amount + 26) % 26) + 97);
      }

      return char;
    })
    .join("");
}

for (let i = 1; i <= 25; i += 1) {
  const option = document.createElement("option");
  option.value = String(i);
  option.textContent = i === 13 ? "13 (ROT13)" : String(i);
  if (i === 13) {
    option.selected = true;
  }
  rotAmount.append(option);
}

Object.keys(DATA_UNITS).forEach((unit) => {
  const fromOption = document.createElement("option");
  fromOption.value = unit;
  fromOption.textContent = unit;
  unitFrom.append(fromOption);

  const toOption = document.createElement("option");
  toOption.value = unit;
  toOption.textContent = unit;
  unitTo.append(toOption);
});

unitFrom.value = "MB";
unitTo.value = "Mb";

runRegex.addEventListener("click", runRegexHighlight);

clearRegex.addEventListener("click", () => {
  regexPattern.value = "";
  regexFlags.value = "g";
  regexText.value = "";
  regexPreview.textContent = "";
  regexStatus.textContent = "";
  regexStatus.className = "small text-muted mt-3";
});

asciiToBin.addEventListener("click", () => {
  binaryInput.value = asciiTextToBinary(asciiInput.value);
  setBinaryStatus("Converted ASCII text to binary.");
});

binToAscii.addEventListener("click", () => {
  try {
    asciiInput.value = binaryToAsciiText(binaryInput.value);
    setBinaryStatus("Converted binary to ASCII text.");
  } catch (error) {
    setBinaryStatus(error.message, true);
  }
});

encodeB64.addEventListener("click", () => {
  try {
    base64Output.value = encodeBase64(base64Input.value);
  } catch (error) {
    base64Output.value = `Encoding error: ${error.message}`;
  }
});

decodeB64.addEventListener("click", () => {
  try {
    base64Output.value = decodeBase64(base64Input.value.trim());
  } catch (error) {
    base64Output.value = `Decoding error: ${error.message}`;
  }
});

asciiToHex.addEventListener("click", () => {
  try {
    hexAsciiHex.value = asciiTextToHex(hexAsciiText.value);
    setHexAsciiStatus("Converted ASCII text to hex.");
  } catch (error) {
    setHexAsciiStatus(error.message, true);
  }
});

hexToAscii.addEventListener("click", () => {
  try {
    hexAsciiText.value = hexToAsciiText(hexAsciiHex.value);
    setHexAsciiStatus("Converted hex to ASCII text.");
  } catch (error) {
    setHexAsciiStatus(error.message, true);
  }
});

convertNumberBases.addEventListener("click", () => {
  try {
    const value = parseNumberByBase(numberInput.value, numberBase.value);
    numberOutBin.value = value.toString(2);
    numberOutOct.value = value.toString(8);
    numberOutDec.value = value.toString(10);
    numberOutHex.value = value.toString(16).toUpperCase();
    setBinHexStatus("Converted number to all bases.");
  } catch (error) {
    numberOutBin.value = "";
    numberOutOct.value = "";
    numberOutDec.value = "";
    numberOutHex.value = "";
    setBinHexStatus(error.message, true);
  }
});

showHidden.addEventListener("click", () => {
  const result = visualizeHiddenChars(hiddenInput.value);
  hiddenOutput.textContent = result.visual;
  hiddenStats.textContent = `spaces: ${result.spaces}, tabs: ${result.tabs}, newlines: ${result.newlines}, carriage returns: ${result.carriageReturns}`;
});

collapseNewlines.addEventListener("click", () => {
  const normalized = newlineInput.value.replaceAll("\r\n", "\n");
  newlineOutput.value = normalized.replace(/\n{2,}/g, "\n");
});

function setJsonStatus(message, isError = false) {
  jsonStatus.textContent = message;
  jsonStatus.className = `small mb-2 ${isError ? "text-danger" : "text-success"}`;
}

formatJson.addEventListener("click", () => {
  try {
    const parsed = JSON.parse(jsonInput.value);
    jsonOutput.value = JSON.stringify(parsed, null, 2);
    setJsonStatus("JSON formatted successfully.");
  } catch (error) {
    setJsonStatus(`Invalid JSON: ${error.message}`, true);
  }
});

minifyJson.addEventListener("click", () => {
  try {
    const parsed = JSON.parse(jsonInput.value);
    jsonOutput.value = JSON.stringify(parsed);
    setJsonStatus("JSON minified successfully.");
  } catch (error) {
    setJsonStatus(`Invalid JSON: ${error.message}`, true);
  }
});

calculateSubnet.addEventListener("click", () => {
  try {
    const { ipInt, prefix } = parseCidr(subnetInput.value);
    const rootSubnet = subnetFrom(ipInt, prefix);
    subnetTree.replaceChildren(createSubnetNode(rootSubnet));
    setSubnetStatus("Subnet calculated. Use 'Split in half' and 'Join' to manage subnet branches.");
  } catch (error) {
    subnetTree.replaceChildren();
    setSubnetStatus(error.message, true);
  }
});

convertUnits.addEventListener("click", () => {
  const value = Number(unitValue.value);
  const from = unitFrom.value;
  const to = unitTo.value;

  if (!Number.isFinite(value)) {
    setUnitStatus("Enter a valid numeric value.", true);
    unitResult.value = "";
    return;
  }

  const bits = value * DATA_UNITS[from];
  const converted = bits / DATA_UNITS[to];
  unitResult.value = converted.toLocaleString(undefined, { maximumFractionDigits: 12 });
  setUnitStatus(`Converted ${value} ${from} to ${to}.`);
});

applyRot.addEventListener("click", () => {
  const rawAmount = Number(rotAmount.value || "13");
  const direction = rotDirection.value;
  const signedAmount = direction === "decode" ? -rawAmount : rawAmount;
  rotOutput.value = rotateText(rotInput.value, signedAmount);
  rotStatus.textContent = `Applied ROT${rawAmount} (${direction}).`;
  rotStatus.className = "small text-success mt-2";
});
