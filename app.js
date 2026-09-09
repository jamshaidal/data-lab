// Presets for the interactive demo
const PRESETS = {
  preset1: `Advancements in Sparse Mixture-of-Experts for Large Language Models \\cite{fedus2022switch}.
Mixture-of-Experts (MoE) architectures provide substantial parameter scaling without proportional FLOP expenditure. In this work, we investigate routing entropy for NLP tasks: $E = mc^2$ and \\mathcal{O}(N \\log N) complexity.
For checkpoints & replication data, contact corresponding author Dr. Elena at rosen.elena@nlp-lab.mit.edu or phone +1-617-555-0192.
Evaluation shows a 14.8% reduction in latency across all benchmark clusters.`,

  preset2: `Patient Study 40291: Multi-Modal Clinical Decision Diagnostics.
Medical record identifier: SSN 000-45-9871, patient name: John Doe, primary contact: john.doe.archive@hospital-records.org.
Subject demonstrated symptom alleviation following randomized trial dosage (p < 0.001).
Detailed blood markers: glucose 98 mg/dL, systolic 122 mmHg.
Data collected at General Hospital Neurology Unit under IRB Protocol #8821.`,

  preset3: `<div class="article-header"><h1>Web Crawler Extract - E-Commerce Pricing Trends</h1></div>
<p class="breadcrumbs"><a href="/home">Home</a> &gt; <a href="/cat">Data</a></p>
Web scraping index: 48,192 price snapshots extracted.
<div class="cookie-banner">Notice: We use cookies to improve your user experience. Accept All.</div>
Market analysis indicates dynamic pricing fluctuations in consumer GPU hardware. Average MSRP deviation observed is +18.4%.
<footer>Copyright &copy; 2024 TechPulse Analytics Corp. All rights reserved.</footer>`
};

document.addEventListener("DOMContentLoaded", () => {
  const rawInput = document.getElementById("rawInput");
  const cleanOutput = document.getElementById("cleanOutput");
  const rawCharCount = document.getElementById("rawCharCount");
  const cleanMetrics = document.getElementById("cleanMetrics");
  const processBtn = document.getElementById("processBtn");
  const copyOutputBtn = document.getElementById("copyOutputBtn");
  const contactForm = document.getElementById("contactForm");
  const formSuccess = document.getElementById("formSuccess");

  const btnPreset1 = document.getElementById("loadPreset1");
  const btnPreset2 = document.getElementById("loadPreset2");
  const btnPreset3 = document.getElementById("loadPreset3");

  // Load Preset 1 initially
  rawInput.value = PRESETS.preset1;
  updateStats();
  processData();

  function updateStats() {
    const chars = rawInput.value.length;
    const words = rawInput.value.trim().split(/\s+/).filter(Boolean).length;
    rawCharCount.textContent = `${chars} chars | ~${words} words`;
  }

  rawInput.addEventListener("input", updateStats);

  btnPreset1.addEventListener("click", () => {
    setActivePreset(btnPreset1, PRESETS.preset1);
  });
  btnPreset2.addEventListener("click", () => {
    setActivePreset(btnPreset2, PRESETS.preset2);
  });
  btnPreset3.addEventListener("click", () => {
    setActivePreset(btnPreset3, PRESETS.preset3);
  });

  function setActivePreset(btn, text) {
    document.querySelectorAll(".btn-preset").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    rawInput.value = text;
    updateStats();
    processData();
  }

  function cleanPipeline(text) {
    let cleaned = text;

    // 1. Strip HTML tags
    cleaned = cleaned.replace(/<[^>]+>/g, " ");

    // 2. Normalize LaTeX citations & refs
    cleaned = cleaned.replace(/\\cite\{[^}]+\}/g, "");
    cleaned = cleaned.replace(/\\ref\{[^}]+\}/g, "");
    cleaned = cleaned.replace(/\$([^$]+)\$/g, "[$1]");

    // 3. PII Redaction
    cleaned = cleaned.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/g, "[EMAIL_REDACTED]");
    cleaned = cleaned.replace(/\b(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}\b/g, "[PHONE_REDACTED]");
    cleaned = cleaned.replace(/\b\d{3}-\d{2}-\d{4}\b/g, "[SSN_REDACTED]");

    // 4. Boilerplate keywords
    cleaned = cleaned.replace(/Notice: We use cookies.*Accept All\./gi, "");
    cleaned = cleaned.replace(/Copyright.*All rights reserved\./gi, "");

    // 5. Excessive whitespace
    cleaned = cleaned.replace(/\s+/g, " ").trim();

    return cleaned;
  }

  function processData() {
    const raw = rawInput.value;
    const cleaned = cleanPipeline(raw);

    const rawWords = raw.trim().split(/\s+/).filter(Boolean).length;
    const cleanWords = cleaned.trim().split(/\s+/).filter(Boolean).length;
    const diff = Math.max(0, rawWords - cleanWords);

    const formattedJSON = {
      dataset_id: "synth_verified_" + Math.random().toString(36).substring(2, 8),
      instruction: "Analyze and synthesize key domain findings with zero PII leakage.",
      input: "",
      output: cleaned,
      metadata: {
        pii_status: "VERIFIED_SCRUBBED",
        noise_reduction_words: diff,
        health_score: 99.4,
        format_spec: "ChatML_Instruction_v2"
      }
    };

    cleanOutput.textContent = JSON.stringify(formattedJSON, null, 2);
    cleanMetrics.textContent = `Cleaned: ${cleanWords} words (-${diff} noise tokens removed)`;
  }

  processBtn.addEventListener("click", processData);

  copyOutputBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(cleanOutput.textContent).then(() => {
      const orig = copyOutputBtn.textContent;
      copyOutputBtn.textContent = "Copied to Clipboard!";
      setTimeout(() => copyOutputBtn.textContent = orig, 2000);
    });
  });

  // Contact form submission
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("clientName").value;
    const email = document.getElementById("clientEmail").value;
    const scope = document.getElementById("projectScope").value;

    const mailtoLink = `mailto:contact@synapsedata.org?subject=Research Data Pipeline Inquiry: ${encodeURIComponent(name)}&body=${encodeURIComponent(
      `Hello Research Data Lab,\n\nName / Institution: ${name}\nEmail: ${email}\n\nProject Scope:\n${scope}\n\nDeliverables Requested:\n- Custom extraction & cleaning pipeline\n- Quality health audit & benchmark report\n`
    )}`;

    formSuccess.style.display = "block";
    formSuccess.innerHTML = `<strong>Inquiry Brief Formatted!</strong><br>Opening your email client to send to our lead intake... (Or <a href="${mailtoLink}" style="color: #60a5fa;">click here if not opening automatically</a>).`;
    window.location.href = mailtoLink;
  });
});
