import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const tools = [
  { id: "image-compressor", icon: "image", color: "blue", title: "Image Compressor", short: "Reduce size & convert format", category: "Images", description: "Compress images and convert them to JPG, PNG or WebP." },
  { id: "image-geotagger", icon: "pin", color: "orange", title: "Image Geotagger", short: "Add GPS data with a map", category: "Images", description: "Choose a location and prepare GPS metadata for your photos." },
  { id: "metadata-editor", icon: "sliders", color: "violet", title: "Metadata Editor", short: "View & change image data", category: "Images", description: "Review and update common image metadata in a clean form." },
  { id: "background-remover", icon: "cut", color: "green", title: "Background Remover", short: "Remove image backgrounds", category: "Images", description: "Make simple light image backgrounds transparent in your browser." },
  { id: "gmb-auditor", icon: "store", color: "rose", title: "GMB Auditor", short: "Find local profile weak spots", category: "Business", description: "Score your Google Business Profile and get prioritized improvements." },
  { id: "word-counter", icon: "text", color: "cyan", title: "Word Counter", short: "Count words, chars & more", category: "Writing", description: "Analyze words, characters, sentences, paragraphs and reading time." },
  { id: "markdown-editor", icon: "edit", color: "indigo", title: "Markdown Editor", short: "Write with live preview", category: "Writing", description: "Draft Markdown with a distraction-free live preview." },
  { id: "markdown-to-html", icon: "code", color: "amber", title: "Markdown to HTML", short: "Convert Markdown instantly", category: "Developer", description: "Turn Markdown into clean HTML and copy the result." },
  { id: "seo-checklist", icon: "checklist", color: "emerald", title: "SEO Checklist", short: "Audit your on-page SEO", category: "SEO", description: "Run through a practical checklist and track your SEO score." },
  { id: "image-text-extractor", icon: "scan", color: "purple", title: "Image Text Extractor", short: "Pull text from images", category: "Images", description: "Upload a scan or screenshot and extract its readable text." },
];

const iconPaths = {
  grid: <><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></>,
  image: <><rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="2"/><path d="m21 15-5-5L5 20"/></>,
  pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
  sliders: <><path d="M4 6h7M15 6h5M4 12h2M10 12h10M4 18h9M17 18h3"/><circle cx="13" cy="6" r="2"/><circle cx="8" cy="12" r="2"/><circle cx="15" cy="18" r="2"/></>,
  cut: <><circle cx="6" cy="7" r="3"/><circle cx="6" cy="17" r="3"/><path d="m8.7 8.3 11.3 6.2M8.7 15.7 20 9.5"/></>,
  store: <><path d="M4 10v10h16V10M3 10l2-6h14l2 6"/><path d="M3 10a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0M9 20v-6h6v6"/></>,
  text: <><path d="M4 6V4h16v2M9 20h6M12 4v16"/></>,
  edit: <><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/></>,
  code: <><path d="m8 9-4 3 4 3M16 9l4 3-4 3M14 5l-4 14"/></>,
  checklist: <><path d="M9 6h11M9 12h11M9 18h11M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2"/></>,
  scan: <><path d="M3 8V5a2 2 0 0 1 2-2h3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M8 21H5a2 2 0 0 1-2-2v-3"/><path d="M7 12h10M7 9h10M7 15h7"/></>,
  arrow: <path d="m9 18 6-6-6-6"/>,
  upload: <><path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"/></>,
  download: <><path d="M12 4v12M7 11l5 5 5-5"/><path d="M4 20h16"/></>,
  copy: <><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></>,
  trash: <><path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14M10 11v6M14 11v6"/></>,
  search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
  menu: <><path d="M4 7h16M4 12h16M4 17h16"/></>,
  close: <><path d="m6 6 12 12M18 6 6 18"/></>,
};

function Icon({ name, size = 20 }) {
  return <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{iconPaths[name]}</svg>;
}

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
const useHashRouting = basePath.length > 0;

function currentRoute() {
  if (useHashRouting) return window.location.hash.slice(1) || "/";

  const pathname = window.location.pathname;
  const route = basePath && pathname.startsWith(basePath) ? pathname.slice(basePath.length) : pathname;
  return route || "/";
}

function navigate(path) {
  const url = useHashRouting ? `${basePath}/#${path}` : path;
  window.history.pushState({}, "", url);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function useRoute() {
  const [path, setPath] = useState(currentRoute);
  useEffect(() => {
    const update = () => setPath(currentRoute());
    window.addEventListener("popstate", update);
    return () => window.removeEventListener("popstate", update);
  }, []);
  return path;
}

function Header() {
  const [open, setOpen] = useState(false);
  return <header className="header">
    <button className="brand" onClick={() => navigate("/")} aria-label="ToolKit home">
      <span className="brand-mark"><Icon name="grid" size={19}/></span>
      <span>Tool<span>Kit</span></span>
    </button>
    <nav className={open ? "nav open" : "nav"}>
      <button onClick={() => { navigate("/"); setOpen(false); }}>All tools</button>
      <button onClick={() => { navigate("/about"); setOpen(false); }}>About</button>
      <button onClick={() => { navigate("/#privacy"); setOpen(false); }}>Privacy</button>
    </nav>
    <button className="menu-button" onClick={() => setOpen(!open)}><Icon name={open ? "close" : "menu"}/></button>
  </header>;
}

function App() {
  const path = useRoute();
  const slug = path.split("/tool/")[1];
  const tool = tools.find((item) => item.id === slug);
  return <div className="app">
    <Header />
    <main>{tool ? <ToolPage tool={tool}/> : path === "/about" ? <About/> : <Home/>}</main>
    <Footer />
  </div>;
}

function Home() {
  const [query, setQuery] = useState("");
  const filtered = tools.filter((tool) => `${tool.title} ${tool.short} ${tool.category}`.toLowerCase().includes(query.toLowerCase()));
  return <>
    <section className="hero">
      <div className="eyebrow"><span></span> Your everyday web toolbox</div>
      <h1>Simple tools.<br/><em>Better work.</em></h1>
      <p>Fast, focused utilities for images, content, SEO, and local business. No clutter, no learning curve.</p>
      <div className="search-box">
        <Icon name="search"/>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search for a tool..." aria-label="Search tools"/>
        <kbd>{filtered.length}</kbd>
      </div>
    </section>
    <section className="tools-section">
      <div className="section-heading">
        <div><span className="section-kicker">EXPLORE THE TOOLKIT</span><h2>Everything you need, in one place</h2></div>
        <p>{filtered.length} focused tools</p>
      </div>
      <div className="tool-grid">
        {filtered.map((tool, index) => <ToolCard key={tool.id} tool={tool} number={String(index + 1).padStart(2, "0")}/>)}
      </div>
      {!filtered.length && <div className="empty-state"><h3>No tools found</h3><p>Try a different search term.</p></div>}
    </section>
    <section className="privacy-strip" id="privacy">
      <div className="privacy-icon">✓</div>
      <div><strong>Your work stays yours</strong><p>Most processing happens directly in your browser. Files are not stored by this demo.</p></div>
    </section>
  </>;
}

function ToolCard({ tool, number }) {
  return <button className="tool-card" onClick={() => navigate(`/tool/${tool.id}`)}>
    <div className="card-top"><span className={`tool-icon ${tool.color}`}><Icon name={tool.icon}/></span><span className="card-number">{number}</span></div>
    <div className="card-content"><span className="category">{tool.category}</span><h3>{tool.title}</h3><p>{tool.short}</p></div>
    <span className="card-arrow"><Icon name="arrow" size={17}/></span>
  </button>;
}

function ToolPage({ tool }) {
  return <section className="tool-page">
    <button className="back-link" onClick={() => navigate("/")}><span>←</span> All tools</button>
    <div className="tool-title">
      <span className={`tool-icon large ${tool.color}`}><Icon name={tool.icon} size={27}/></span>
      <div><span className="category">{tool.category}</span><h1>{tool.title}</h1><p>{tool.description}</p></div>
    </div>
    <div className="workspace">{renderTool(tool.id)}</div>
  </section>;
}

function renderTool(id) {
  const components = {
    "image-compressor": <ImageCompressor/>,
    "image-geotagger": <Geotagger/>,
    "metadata-editor": <MetadataEditor/>,
    "background-remover": <BackgroundRemover/>,
    "gmb-auditor": <GmbAuditor/>,
    "word-counter": <WordCounter/>,
    "markdown-editor": <MarkdownEditor/>,
    "markdown-to-html": <MarkdownConverter/>,
    "seo-checklist": <SeoChecklist/>,
    "image-text-extractor": <TextExtractor/>,
  };
  return components[id];
}

function Dropzone({ onFile, accept = "image/*", title = "Drop your image here", hint = "or click to browse from your device" }) {
  const input = useRef();
  const handle = (files) => files?.[0] && onFile(files[0]);
  return <div className="dropzone" onClick={() => input.current.click()} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); handle(e.dataTransfer.files); }}>
    <span className="upload-icon"><Icon name="upload" size={27}/></span>
    <h3>{title}</h3><p>{hint}</p><span className="browse-button">Choose file</span>
    <input ref={input} type="file" accept={accept} onChange={(e) => handle(e.target.files)} hidden/>
  </div>;
}

function fileSize(bytes) {
  if (!bytes) return "0 KB";
  return bytes > 1048576 ? `${(bytes / 1048576).toFixed(2)} MB` : `${(bytes / 1024).toFixed(1)} KB`;
}

function ImageCompressor() {
  const [file, setFile] = useState(null);
  const [quality, setQuality] = useState(75);
  const [format, setFormat] = useState("image/webp");
  const [result, setResult] = useState(null);
  useEffect(() => () => {
    if (result?.url) URL.revokeObjectURL(result.url);
  }, [result]);
  const clearResult = () => setResult(null);
  const process = () => {
    if (!file) return;
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth; canvas.height = image.naturalHeight;
      canvas.getContext("2d").drawImage(image, 0, 0);
      canvas.toBlob((blob) => setResult({ blob, url: URL.createObjectURL(blob) }), format, quality / 100);
    };
    image.src = URL.createObjectURL(file);
  };
  return <div className="split-workspace">
    <div>{!file ? <Dropzone onFile={setFile}/> : result ? <BeforeAfterSlider file={file} resultUrl={result.url} onRemove={() => { setFile(null); clearResult(); }}/> : <ImagePreview file={file} onRemove={() => { setFile(null); clearResult(); }}/>}</div>
    <div className="control-panel">
      <h3>Compression settings</h3>
      <label>Output format<select value={format} onChange={(e) => { setFormat(e.target.value); clearResult(); }}><option value="image/webp">WebP</option><option value="image/jpeg">JPG</option><option value="image/png">PNG</option></select></label>
      <label><span className="label-row">Quality <strong>{quality}%</strong></span><input type="range" min="10" max="100" value={quality} onChange={(e) => { setQuality(e.target.value); clearResult(); }}/></label>
      <button className="primary-button" disabled={!file} onClick={process}>Compress image</button>
      {result && <div className="result-box"><div><small>New file size</small><strong>{fileSize(result.blob.size)}</strong></div><div><small>Saved</small><strong className="success">{Math.max(0, Math.round((1-result.blob.size/file.size)*100))}%</strong></div><a className="icon-button" href={result.url} download={`compressed.${format.split("/")[1]}`}><Icon name="download"/></a></div>}
    </div>
  </div>;
}

function BeforeAfterSlider({ file, resultUrl, onRemove }) {
  const [position, setPosition] = useState(50);
  const originalUrl = useMemo(() => URL.createObjectURL(file), [file]);
  useEffect(() => () => URL.revokeObjectURL(originalUrl), [originalUrl]);
  return <div className="comparison-card">
    <div className="comparison-stage">
      <img src={originalUrl} alt="Original image before compression"/>
      <div className="comparison-after" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        <img src={resultUrl} alt="Compressed image after processing"/>
      </div>
      <span className="comparison-label before-label">Before</span>
      <span className="comparison-label after-label">After</span>
      <div className="comparison-divider" style={{ left: `${position}%` }}>
        <span className="comparison-handle">↔</span>
      </div>
      <input className="comparison-range" type="range" min="0" max="100" value={position} onChange={(e) => setPosition(Number(e.target.value))} aria-label="Move the before and after comparison slider"/>
    </div>
    <div className="file-row"><div><strong>{file.name}</strong><small>Drag the slider to compare image quality</small></div><button onClick={onRemove} aria-label="Remove image"><Icon name="trash"/></button></div>
  </div>;
}

function ImagePreview({ file, onRemove }) {
  const url = useMemo(() => URL.createObjectURL(file), [file]);
  useEffect(() => () => URL.revokeObjectURL(url), [url]);
  return <div className="image-preview"><img src={url} alt="Upload preview"/><div className="file-row"><div><strong>{file.name}</strong><small>{fileSize(file.size)}</small></div><button onClick={onRemove}><Icon name="trash"/></button></div></div>;
}

function Geotagger() {
  const [file, setFile] = useState(null);
  const [lat, setLat] = useState("40.7128");
  const [lng, setLng] = useState("-74.0060");
  const [saved, setSaved] = useState(false);
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${Number(lng)-.05}%2C${Number(lat)-.04}%2C${Number(lng)+.05}%2C${Number(lat)+.04}&layer=mapnik&marker=${lat}%2C${lng}`;
  return <div className="stack">
    {!file ? <Dropzone onFile={setFile}/> : <ImagePreview file={file} onRemove={() => setFile(null)}/>}
    <div className="map-layout">
      <iframe title="Location map" src={mapUrl}></iframe>
      <div className="control-panel"><h3>Photo location</h3><p className="muted">Enter coordinates to update the map marker.</p><div className="two-fields"><label>Latitude<input value={lat} onChange={(e) => setLat(e.target.value)}/></label><label>Longitude<input value={lng} onChange={(e) => setLng(e.target.value)}/></label></div><label>Location label<input placeholder="e.g. Downtown studio"/></label><button className="primary-button" disabled={!file} onClick={() => setSaved(true)}>Apply geotag</button>{saved && <p className="success-note">Location data prepared successfully.</p>}</div>
    </div>
  </div>;
}

function MetadataEditor() {
  const [file, setFile] = useState(null);
  const [saved, setSaved] = useState(false);
  return <div>{!file ? <Dropzone onFile={setFile}/> : <div className="split-workspace"><ImagePreview file={file} onRemove={() => setFile(null)}/><div className="control-panel form-grid"><h3>Edit metadata</h3><label>Image title<input placeholder="Untitled image"/></label><label>Author<input placeholder="Your name"/></label><label>Description<textarea rows="3" placeholder="Describe this image..."/></label><div className="two-fields"><label>Copyright<input placeholder="© 2026"/></label><label>Keywords<input placeholder="photo, project"/></label></div><button className="primary-button" onClick={() => setSaved(true)}>Save metadata</button>{saved && <p className="success-note">Metadata changes are ready for export.</p>}</div></div>}</div>;
}

function BackgroundRemover() {
  const [file, setFile] = useState(null);
  const [threshold, setThreshold] = useState(235);
  const [result, setResult] = useState(null);
  const remove = () => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas"); canvas.width = img.width; canvas.height = img.height;
      const ctx = canvas.getContext("2d"); ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < data.data.length; i += 4) if (data.data[i] > threshold && data.data[i+1] > threshold && data.data[i+2] > threshold) data.data[i+3] = 0;
      ctx.putImageData(data, 0, 0); setResult(canvas.toDataURL("image/png"));
    }; img.src = URL.createObjectURL(file);
  };
  return <div className="split-workspace"><div>{result ? <div className="image-preview checker"><img src={result} alt="Background removed"/></div> : file ? <ImagePreview file={file} onRemove={() => setFile(null)}/> : <Dropzone onFile={setFile}/>}</div><div className="control-panel"><h3>Background settings</h3><p className="muted">Best for product images with a plain white or light background.</p><label><span className="label-row">Light color sensitivity <strong>{threshold}</strong></span><input type="range" min="150" max="254" value={threshold} onChange={(e) => setThreshold(Number(e.target.value))}/></label><button className="primary-button" disabled={!file} onClick={remove}>Remove background</button>{result && <a className="secondary-button" href={result} download="transparent-image.png"><Icon name="download"/> Download PNG</a>}</div></div>;
}

const auditItems = [
  ["Profile is verified", 12], ["Primary category is accurate", 10], ["Business description is complete", 8], ["Hours and holiday hours are current", 10], ["At least 20 recent, high-quality photos", 10], ["Products or services are listed", 10], ["Reviews are answered consistently", 14], ["Business gets new reviews monthly", 12], ["Website and appointment links work", 8], ["Weekly posts are published", 6],
];

function GmbAuditor() {
  const [name, setName] = useState("");
  const [checks, setChecks] = useState({});
  const [audited, setAudited] = useState(false);
  const score = auditItems.reduce((sum, [, points], i) => sum + (checks[i] ? points : 0), 0);
  return <div className="audit-layout"><div className="control-panel"><h3>Business profile details</h3><label>Business name<input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter business name"/></label><div className="audit-list">{auditItems.map(([label], i) => <label className="check-row" key={label}><input type="checkbox" checked={!!checks[i]} onChange={() => setChecks({...checks, [i]: !checks[i]})}/><span>{label}</span></label>)}</div><button className="primary-button" onClick={() => setAudited(true)}>Run profile audit</button></div><div className="score-panel"><span className="score-label">PROFILE SCORE</span><div className="score-ring" style={{"--score": `${score * 3.6}deg`}}><div><strong>{score}</strong><span>/100</span></div></div><h3>{score >= 80 ? "Strong profile" : score >= 50 ? "Good foundation" : "Needs attention"}</h3><p>{audited ? `${name || "Your business"} has ${auditItems.filter((_, i) => !checks[i]).length} improvement opportunities.` : "Complete the checklist to calculate your local profile strength."}</p>{audited && <div className="recommendations">{auditItems.filter((_, i) => !checks[i]).slice(0, 4).map(([label, points]) => <div key={label}><span>+{points}</span><p><strong>{label}</strong><small>Recommended improvement</small></p></div>)}</div>}</div></div>;
}

function getTextStats(text) {
  const words = text.trim() ? text.trim().split(/\s+/) : [];
  const sentences = text.trim() ? text.split(/[.!?]+/).filter((x) => x.trim()).length : 0;
  const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter((x) => x.trim()).length : 0;
  return { words: words.length, chars: text.length, noSpaces: text.replace(/\s/g, "").length, sentences, paragraphs, reading: Math.ceil(words.length / 225) };
}

function WordCounter() {
  const [text, setText] = useState("");
  const s = getTextStats(text);
  return <div className="editor-shell"><div className="stats-bar">{[["Words",s.words],["Characters",s.chars],["Sentences",s.sentences],["Paragraphs",s.paragraphs],["Reading",`${s.reading} min`]].map(([k,v]) => <div key={k}><strong>{v}</strong><span>{k}</span></div>)}</div><textarea className="large-textarea" value={text} onChange={(e) => setText(e.target.value)} placeholder="Start typing or paste your text here..."/><div className="editor-footer"><span>{s.noSpaces} characters without spaces</span><button onClick={() => setText("")}><Icon name="trash" size={16}/> Clear text</button></div></div>;
}

function markdownToHtml(md) {
  let html = md
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/^### (.*$)/gim, "<h3>$1</h3>").replace(/^## (.*$)/gim, "<h2>$1</h2>").replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/^> (.*$)/gim, "<blockquote>$1</blockquote>").replace(/^- (.*$)/gim, "<li>$1</li>")
    .replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br/>");
  return html ? `<p>${html}</p>`.replace(/<p>(<h\d>.*?<\/h\d>)<\/p>/g, "$1") : "";
}

const sampleMarkdown = `# Welcome to your editor

Write **bold ideas**, add *emphasis*, and keep everything clear.

## Quick start

- Type Markdown on the left
- See the preview instantly
- Copy or download when ready

> Simple tools should stay out of your way.`;

function MarkdownEditor() {
  const [text, setText] = useState(sampleMarkdown);
  return <div className="markdown-shell"><div className="pane"><div className="pane-header"><strong>MARKDOWN</strong><span>{getTextStats(text).words} words</span></div><textarea value={text} onChange={(e) => setText(e.target.value)}/></div><div className="pane preview-pane"><div className="pane-header"><strong>PREVIEW</strong><CopyButton text={text}/></div><article dangerouslySetInnerHTML={{__html: markdownToHtml(text)}}/></div></div>;
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  return <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }}><Icon name="copy" size={15}/>{copied ? "Copied" : "Copy"}</button>;
}

function MarkdownConverter() {
  const [text, setText] = useState("## Hello world\n\nConvert **Markdown** into clean HTML.");
  const html = markdownToHtml(text);
  return <div className="markdown-shell"><div className="pane"><div className="pane-header"><strong>MARKDOWN INPUT</strong><button onClick={() => setText("")}>Clear</button></div><textarea value={text} onChange={(e) => setText(e.target.value)}/></div><div className="pane code-pane"><div className="pane-header"><strong>HTML OUTPUT</strong><CopyButton text={html}/></div><pre>{html}</pre></div></div>;
}

const seoGroups = {
  "Content & keywords": ["Primary keyword appears in the title", "One clear H1 heading is used", "Content satisfies the search intent", "Images have descriptive alt text"],
  "Technical basics": ["Page uses HTTPS", "Canonical URL is set", "Page is indexable", "XML sitemap includes this page"],
  "User experience": ["Page works well on mobile", "Core content loads quickly", "Links and buttons are easy to use", "No intrusive popups block content"],
  "Search appearance": ["Title is 50–60 characters", "Meta description is compelling", "URL is short and descriptive", "Relevant structured data is present"],
};

function SeoChecklist() {
  const all = Object.values(seoGroups).flat();
  const [checks, setChecks] = useState({});
  const done = Object.values(checks).filter(Boolean).length;
  const pct = Math.round(done / all.length * 100);
  return <div className="seo-layout"><div className="seo-main">{Object.entries(seoGroups).map(([group, items]) => <section className="check-group" key={group}><div><h3>{group}</h3><span>{items.filter((item) => checks[item]).length}/{items.length}</span></div>{items.map((item) => <label className="check-row" key={item}><input type="checkbox" checked={!!checks[item]} onChange={() => setChecks({...checks, [item]: !checks[item]})}/><span>{item}</span></label>)}</section>)}</div><aside className="progress-card"><span>SEO READINESS</span><strong>{pct}%</strong><div className="progress-track"><i style={{width: `${pct}%`}}></i></div><p>{done} of {all.length} checks complete</p><button className="secondary-button" onClick={() => setChecks({})}>Reset checklist</button></aside></div>;
}

function TextExtractor() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const extract = async () => {
    setLoading(true);
    setError("");
    setProgress(0);
    try {
      const { createWorker } = await import("tesseract.js");
      const worker = await createWorker("eng", 1, {
        logger: (message) => {
          if (message.status === "recognizing text") setProgress(Math.round(message.progress * 100));
        },
      });
      const result = await worker.recognize(file);
      setText(result.data.text.trim());
      await worker.terminate();
    } catch {
      setError("OCR could not finish. Check your connection and try a clearer image.");
    } finally {
      setLoading(false);
    }
  };
  return <div className="split-workspace"><div>{file ? <ImagePreview file={file} onRemove={() => { setFile(null); setText(""); setError(""); }}/> : <Dropzone onFile={setFile} title="Upload an image with text" hint="Supports screenshots, scans, JPG and PNG"/>}<button className="primary-button wide" disabled={!file || loading} onClick={extract}>{loading ? `Reading image... ${progress}%` : "Extract text"}</button>{error && <p className="error-note">{error}</p>}</div><div className="control-panel extracted"><div className="panel-heading"><h3>Extracted text</h3>{text && <CopyButton text={text}/>}</div><textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Extracted text will appear here..."/></div></div>;
}

function About() {
  return <section className="about-page"><span className="section-kicker">ABOUT TOOLKIT</span><h1>Useful tools should feel effortless.</h1><p>ToolKit is a focused collection of browser-based utilities for everyday image, writing, business, and SEO work. Each tool is designed to do one job clearly, with no account required.</p><button className="primary-button" onClick={() => navigate("/")}>Explore all tools</button></section>;
}

function Footer() {
  return <footer><button className="brand" onClick={() => navigate("/")}><span className="brand-mark"><Icon name="grid" size={17}/></span><span>Tool<span>Kit</span></span></button><p>Simple, practical tools for better digital work.</p><span>© 2026 ToolKit</span></footer>;
}

createRoot(document.getElementById("root")).render(<App/>);
