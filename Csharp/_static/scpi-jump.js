window.WEBHELP=["https://www.rohde-schwarz.com/webhelp/FSW_HTML_UserManuals_en/Content/subprojects/fsw_iqanalyzer/","https://www.rohde-schwarz.com/webhelp/FSW_HTML_UserManuals_en/Content/subprojects/fsw_k10/","https://www.rohde-schwarz.com/webhelp/FSW_HTML_UserManuals_en/Content/subprojects/fsw_k149/","https://www.rohde-schwarz.com/webhelp/FSW_HTML_UserManuals_en/Content/subprojects/fsw_k15/","https://www.rohde-schwarz.com/webhelp/FSW_HTML_UserManuals_en/Content/subprojects/fsw_k17/","https://www.rohde-schwarz.com/webhelp/FSW_HTML_UserManuals_en/Content/subprojects/fsw_k18/","https://www.rohde-schwarz.com/webhelp/FSW_HTML_UserManuals_en/Content/subprojects/fsw_k192/","https://www.rohde-schwarz.com/webhelp/FSW_HTML_UserManuals_en/Content/subprojects/fsw_k30/","https://www.rohde-schwarz.com/webhelp/FSW_HTML_UserManuals_en/Content/subprojects/fsw_k40/","https://www.rohde-schwarz.com/webhelp/FSW_HTML_UserManuals_en/Content/subprojects/fsw_k50/","https://www.rohde-schwarz.com/webhelp/FSW_HTML_UserManuals_en/Content/subprojects/fsw_k6/","https://www.rohde-schwarz.com/webhelp/FSW_HTML_UserManuals_en/Content/subprojects/fsw_k60/","https://www.rohde-schwarz.com/webhelp/FSW_HTML_UserManuals_en/Content/subprojects/fsw_k7/","https://www.rohde-schwarz.com/webhelp/FSW_HTML_UserManuals_en/Content/subprojects/fsw_k70/","https://www.rohde-schwarz.com/webhelp/FSW_HTML_UserManuals_en/Content/subprojects/fsw_k72_k73/","https://www.rohde-schwarz.com/webhelp/FSW_HTML_UserManuals_en/Content/subprojects/fsw_k76_k77/","https://www.rohde-schwarz.com/webhelp/FSW_HTML_UserManuals_en/Content/subprojects/fsw_k8/","https://www.rohde-schwarz.com/webhelp/FSW_HTML_UserManuals_en/Content/subprojects/fsw_k91/","https://www.rohde-schwarz.com/webhelp/FSW_HTML_UserManuals_en/Content/subprojects/fsw_k95/","https://www.rohde-schwarz.com/webhelp/FSW_HTML_UserManuals_en/Content/subprojects/fsw_k96/","https://www.rohde-schwarz.com/webhelp/FSW_HTML_UserManuals_en/Content/subprojects/fsw_lte_dl/","https://www.rohde-schwarz.com/webhelp/FSW_HTML_UserManuals_en/Content/subprojects/fsw_lte_ul/","https://www.rohde-schwarz.com/webhelp/FSW_HTML_UserManuals_en/Content/subprojects/fsw_msra_help/","https://www.rohde-schwarz.com/webhelp/FSW_HTML_UserManuals_en/Content/subprojects/fsw_nbiot_dl/","https://www.rohde-schwarz.com/webhelp/FSW_HTML_UserManuals_en/Content/subprojects/fsw_nr_dl/","https://www.rohde-schwarz.com/webhelp/FSW_HTML_UserManuals_en/Content/subprojects/fsw_nr_ul/","https://www.rohde-schwarz.com/webhelp/FSW_HTML_UserManuals_en/Content/subprojects/fsw_oneweb_ul/","https://www.rohde-schwarz.com/webhelp/FSW_HTML_UserManuals_en/Content/subprojects/fsw_real_help/","https://www.rohde-schwarz.com/webhelp/FSW_HTML_UserManuals_en/Content/subprojects/fsw_v5g/","https://www.rohde-schwarz.com/webhelp/FSW_HTML_UserManuals_en/Content/subprojects/hums_html_usermanual_en/"];
(function () {
  function commandOf(block) {
    var pre = block.querySelector("pre");
    if (!pre) return "";
    var lines = (pre.textContent || "").split("\n");
    var i, line;
    for (i = 0; i < lines.length; i++) {
      line = lines[i].trim();
      if (!line) continue;
      if (line.charAt(0) !== "#" && line.indexOf("//") !== 0) return "";
      return line.replace(/^(?:\/\/|#)\s*(?:SCPI:\s*)?/, "").trim();
    }
    return "";
  }

  function linkLists() {
    var lists = document.querySelectorAll("dl.scpi");
    if (!lists.length) return;
    var blocks = document.querySelectorAll("dl.method, dl.property, dl.attribute, dl.function, dl.csharp");
    var byCommand = {};
    var i, cmd, block;
    for (i = 0; i < blocks.length; i++) {
      block = blocks[i];
      cmd = commandOf(block);
      if (cmd && !byCommand[cmd]) byCommand[cmd] = block;
    }
    var serial = 0;
    for (i = 0; i < lists.length; i++) {
      var items = lists[i].children;
      var j;
      for (j = 0; j < items.length; j++) {
        var dt = items[j];
        if (!dt || dt.tagName !== "DT") continue;
        cmd = (dt.textContent || "").replace(/\s+/g, "");
        block = byCommand[cmd];
        if (!block) continue;
        if (!block.id) {
          serial += 1;
          block.id = "scpi-" + serial;
        }
        var link = document.createElement("a");
        link.className = "scpi-jump";
        link.href = "#" + block.id;
        var node = dt.firstChild;
        while (node && node.nodeType === 3) {
          var next = node.nextSibling;
          link.appendChild(node);
          node = next;
        }
        dt.insertBefore(link, dt.firstChild);
      }
    }
  }

  function addWebHelp() {
    var bases = window.WEBHELP;
    if (!bases || !bases.length) return;
    var items = document.querySelectorAll("dl.scpi > dt");
    var i, dt, raw, cut, base, slot;
    for (i = 0; i < items.length; i++) {
      dt = items[i];
      if (dt.querySelector(".instrument-webhelp")) continue;
      raw = dt.getAttribute("data-h") || "";
      cut = raw.indexOf(",");
      slot = null;
      if (cut >= 1 && cut < raw.length - 1) {
        base = bases[raw.slice(0, cut)];
        if (base) {
          if (base.charAt(base.length - 1) !== "/")
            base += "/";
          slot = document.createElement("a");
          slot.href = base + raw.slice(cut + 1) + ".htm";
          slot.target = "_blank";
          slot.rel = "noopener";
          slot.title = "Instrument web help";
          slot.setAttribute("aria-label", "Instrument web help");
        }
      }
      if (!slot) {
        slot = document.createElement("span");
        slot.setAttribute("aria-hidden", "true");
      }
      slot.className = "instrument-webhelp";
      dt.insertBefore(slot, dt.firstChild);
    }
  }

  function start() {
    linkLists();
    addWebHelp();
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", start);
  else
    start();
})();
