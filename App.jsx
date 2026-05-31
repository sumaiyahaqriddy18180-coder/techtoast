import { useState, useEffect, useRef } from "react";

const LOGO_URL = "/logo.jpg";

const defaultData = {
  hero: {
    tagline: "Toast Up Your Tech Life",
    subtitle: "Premium earbuds, headphones & more — engineered for the bold.",
    cta: "Shop Now",
  },
  about: {
    title: "About Tech Toast",
    body: "Tech Toast — টেক টোস্ট — is your go-to destination for premium audio and electronics. We bring you the hottest tech gear at unbeatable prices. From crystal-clear earbuds to immersive headphones, we toast up your tech life every single day.",
    highlights: ["Top Brands", "Best Prices", "Fast Delivery", "Trusted Quality"],
  },
  products: [
    { id: 1, name: "ProBass Earbuds X1", price: "৳ 1,299", tag: "Best Seller", desc: "40hr battery · Active Noise Cancellation · IPX5" },
    { id: 2, name: "FireAudio Over-Ear Pro", price: "৳ 3,499", tag: "Premium", desc: "Hi-Fi Sound · Foldable · Plush Ear Cushions" },
    { id: 3, name: "ToastBuds Lite", price: "৳ 699", tag: "Budget Pick", desc: "True Wireless · 20hr total · Touch Controls" },
    { id: 4, name: "BlastWave Neckband", price: "৳ 999", tag: "New", desc: "Magnetic Tips · Voice Assist · 18hr Playback" },
    { id: 5, name: "CrispSound TWS Pro", price: "৳ 1,899", tag: "Hot", desc: "6-Mic ENC · Gaming Mode · Fast Charge" },
    { id: 6, name: "DeepBass Studio Headset", price: "৳ 2,799", tag: "Studio", desc: "50mm Drivers · Wired · Zero Latency" },
  ],
  gallery: [
    { id: 1, label: "New Collection Drop" },
    { id: 2, label: "ProBass Series" },
    { id: 3, label: "Unboxing Experience" },
    { id: 4, label: "Studio Grade Audio" },
  ],
  faq: [
    { q: "Do you offer warranty?", a: "Yes! All products come with a minimum 6-month warranty. Premium products include 1 year." },
    { q: "How can I place an order?", a: "Message us on our contact number +880 1410-018220 or fill the contact form below." },
    { q: "Do you deliver nationwide?", a: "Yes, we deliver all across Bangladesh with reliable courier services." },
    { q: "Can I return a product?", a: "We accept returns within 7 days if the product is unused and in original packaging." },
    { q: "Do you have physical stores?", a: "Currently we operate online. Stay tuned for our store launch announcement!" },
  ],
  contact: {
    phone: "+880 1410-018220",
    email: "techtoast@example.com",
    address: "Dhaka, Bangladesh",
  },
  social: {
    facebook: "",
    instagram: "",
    whatsapp: "",
  },
};

function EditableText({ value, onChange, className, tag: Tag = "span", multiline = false, style }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value);
  const ref = useRef();

  useEffect(() => { setVal(value); }, [value]);
  useEffect(() => { if (editing && ref.current) ref.current.focus(); }, [editing]);

  const save = () => { setEditing(false); onChange(val); };

  if (editing) {
    return multiline ? (
      <textarea
        ref={ref}
        value={val}
        onChange={e => setVal(e.target.value)}
        onBlur={save}
        className={className}
        style={{ background: "rgba(255,200,0,0.08)", border: "1.5px solid #f5c200", borderRadius: 6, color: "inherit", font: "inherit", resize: "vertical", width: "100%", padding: "6px 10px", outline: "none", ...style }}
      />
    ) : (
      <input
        ref={ref}
        value={val}
        onChange={e => setVal(e.target.value)}
        onBlur={save}
        onKeyDown={e => e.key === "Enter" && save()}
        className={className}
        style={{ background: "rgba(255,200,0,0.08)", border: "1.5px solid #f5c200", borderRadius: 6, color: "inherit", font: "inherit", width: "100%", padding: "4px 8px", outline: "none", ...style }}
      />
    );
  }

  return (
    <Tag
      className={className}
      style={{ cursor: "pointer", borderBottom: "1.5px dashed rgba(245,194,0,0.35)", transition: "border-color 0.2s", ...style }}
      title="Click to edit"
      onClick={() => setEditing(true)}
    >
      {val}
    </Tag>
  );
}

const TAG_COLORS = {
  "Best Seller": "#f5c200",
  "Premium": "#e87040",
  "Budget Pick": "#50e8a0",
  "New": "#60c8ff",
  "Hot": "#ff5050",
  "Studio": "#c880ff",
};

const GALLERY_COLORS = [
  "linear-gradient(135deg,#1a1a1a 0%,#2a1800 100%)",
  "linear-gradient(135deg,#0d0d0d 0%,#1a1000 100%)",
  "linear-gradient(135deg,#1a0800 0%,#2a1a00 100%)",
  "linear-gradient(135deg,#0a0a0a 0%,#1a1500 100%)",
];

export default function TechToast() {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem("techtoast_data");
      return saved ? JSON.parse(saved) : defaultData;
    } catch { return defaultData; }
  });
  const [editMode, setEditMode] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const OWNER_PASSWORD = "20techtoast25";

  const handleEditClick = () => {
    if (editMode) { setEditMode(false); return; }
    setShowPasswordModal(true);
    setPasswordInput("");
    setPasswordError(false);
  };
  const handlePasswordSubmit = () => {
    if (passwordInput === OWNER_PASSWORD) {
      setEditMode(true);
      setShowPasswordModal(false);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };
  const [activeNav, setActiveNav] = useState("home");
  const [faqOpen, setFaqOpen] = useState(null);
  const [formData, setFormData] = useState({ name: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [addingProduct, setAddingProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", tag: "New", desc: "" });

  const save = (newData) => {
    setData(newData);
    try { localStorage.setItem("techtoast_data", JSON.stringify(newData)); } catch {}
  };

  const updateHero = (field, val) => save({ ...data, hero: { ...data.hero, [field]: val } });
  const updateAbout = (field, val) => save({ ...data, about: { ...data.about, [field]: val } });
  const updateContact = (field, val) => save({ ...data, contact: { ...data.contact, [field]: val } });
  const updateSocial = (field, val) => save({ ...data, social: { ...data.social, [field]: val } });
  const updateProduct = (id, field, val) => save({ ...data, products: data.products.map(p => p.id === id ? { ...p, [field]: val } : p) });
  const deleteProduct = (id) => save({ ...data, products: data.products.filter(p => p.id !== id) });
  const addProduct = () => {
    if (!newProduct.name) return;
    const p = { ...newProduct, id: Date.now() };
    save({ ...data, products: [...data.products, p] });
    setNewProduct({ name: "", price: "", tag: "New", desc: "" });
    setAddingProduct(false);
  };
  const updateFaq = (i, field, val) => {
    const faqs = data.faq.map((f, idx) => idx === i ? { ...f, [field]: val } : f);
    save({ ...data, faq: faqs });
  };
  const deleteFaq = (i) => save({ ...data, faq: data.faq.filter((_, idx) => idx !== i) });
  const addFaq = () => save({ ...data, faq: [...data.faq, { q: "New Question?", a: "Answer here." }] });
  const updateHighlight = (i, val) => {
    const h = data.about.highlights.map((x, idx) => idx === i ? val : x);
    save({ ...data, about: { ...data.about, highlights: h } });
  };
  const updateGallery = (id, val) => save({ ...data, gallery: data.gallery.map(g => g.id === id ? { ...g, label: val } : g) });

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setActiveNav(id);
  };

  const styles = {
    root: { background: "#0a0a0a", color: "#f0f0f0", fontFamily: "'Barlow Condensed', 'Impact', sans-serif", minHeight: "100vh", position: "relative" },
    nav: { position: "sticky", top: 0, zIndex: 100, background: "rgba(10,10,10,0.97)", borderBottom: "2px solid #f5c200", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 2rem", backdropFilter: "blur(10px)" },
    navLogo: { display: "flex", alignItems: "center", gap: "0.7rem", padding: "0.5rem 0" },
    navLogoImg: { height: 44, width: 44, objectFit: "cover", borderRadius: 8 },
    navLogoText: { fontSize: "1.4rem", fontWeight: 900, letterSpacing: "0.05em", color: "#fff" },
    navLinks: { display: "flex", gap: "0.2rem", alignItems: "center" }, // tt-nav-links
    navLink: (active) => ({ background: "none", border: "none", color: active ? "#f5c200" : "#aaa", fontFamily: "inherit", fontSize: "1rem", fontWeight: 700, padding: "1.1rem 0.9rem", cursor: "pointer", letterSpacing: "0.08em", borderBottom: active ? "2px solid #f5c200" : "2px solid transparent", transition: "all 0.2s", textTransform: "uppercase" }),
    editToggle: { background: editMode ? "#f5c200" : "transparent", color: editMode ? "#000" : "#f5c200", border: "2px solid #f5c200", borderRadius: 6, padding: "0.4rem 1rem", fontFamily: "inherit", fontWeight: 800, fontSize: "0.85rem", cursor: "pointer", letterSpacing: "0.1em", transition: "all 0.2s" },
    hero: { position: "relative", minHeight: "92vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", overflow: "hidden", padding: "4rem 2rem" },
    heroBg: { position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 60%, rgba(245,120,0,0.12) 0%, transparent 70%), radial-gradient(ellipse at 80% 20%, rgba(245,194,0,0.07) 0%, transparent 50%)", pointerEvents: "none" },
    heroLogo: { width: 140, height: 140, objectFit: "cover", borderRadius: 20, marginBottom: "1.5rem", boxShadow: "0 0 60px rgba(245,194,0,0.3), 0 0 120px rgba(245,100,0,0.15)", border: "3px solid rgba(245,194,0,0.3)" },
    heroName: { fontSize: "clamp(2.5rem, 8vw, 6rem)", fontWeight: 900, lineHeight: 1, letterSpacing: "0.05em", color: "#fff", textShadow: "0 0 40px rgba(245,194,0,0.4)", marginBottom: "0.2rem" },
    heroBengali: { fontSize: "clamp(1.2rem, 3vw, 2rem)", color: "#f5c200", fontFamily: "sans-serif", marginBottom: "1rem", opacity: 0.9 },
    heroTagline: { fontSize: "clamp(1rem, 2.5vw, 1.5rem)", color: "#f5c200", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1rem" },
    heroSub: { fontSize: "clamp(0.95rem, 2vw, 1.15rem)", color: "#bbb", maxWidth: 520, lineHeight: 1.6, marginBottom: "2rem", fontFamily: "Georgia, serif", fontWeight: 400 },
    heroCta: { background: "#f5c200", color: "#000", border: "none", padding: "0.9rem 2.8rem", fontSize: "1.2rem", fontWeight: 900, letterSpacing: "0.15em", borderRadius: 4, cursor: "pointer", textTransform: "uppercase", boxShadow: "0 4px 30px rgba(245,194,0,0.4)", transition: "all 0.2s" },
    section: { padding: "5rem 2rem", maxWidth: 1100, margin: "0 auto" },
    sectionTitle: { fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase", color: "#fff", marginBottom: "0.5rem" },
    sectionAccent: { width: 60, height: 4, background: "#f5c200", marginBottom: "2.5rem", borderRadius: 2 },
    aboutGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "start" },
    aboutBody: { fontSize: "1.1rem", lineHeight: 1.8, color: "#ccc", fontFamily: "Georgia, serif", fontWeight: 400 },
    highlightGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1.5rem" },
    highlightItem: { background: "rgba(245,194,0,0.08)", border: "1.5px solid rgba(245,194,0,0.25)", borderRadius: 8, padding: "1rem 1.2rem", textAlign: "center", fontSize: "1rem", fontWeight: 800, color: "#f5c200", letterSpacing: "0.1em", textTransform: "uppercase" },
    productsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" },
    productCard: { background: "rgba(20,15,0,0.8)", border: "1.5px solid rgba(245,194,0,0.15)", borderRadius: 12, padding: "1.5rem", position: "relative", transition: "border-color 0.3s, transform 0.2s", cursor: "default" },
    productTag: (tag) => ({ position: "absolute", top: 12, right: 12, background: TAG_COLORS[tag] || "#f5c200", color: "#000", fontSize: "0.7rem", fontWeight: 900, padding: "3px 10px", borderRadius: 20, letterSpacing: "0.08em", textTransform: "uppercase" }),
    productName: { fontSize: "1.25rem", fontWeight: 900, color: "#fff", marginBottom: "0.4rem", marginTop: "0.5rem" },
    productDesc: { fontSize: "0.9rem", color: "#888", marginBottom: "0.8rem", lineHeight: 1.5, fontFamily: "Georgia, serif" },
    productPrice: { fontSize: "1.4rem", fontWeight: 900, color: "#f5c200" },
    deleteBtn: { background: "rgba(255,80,80,0.12)", border: "1px solid rgba(255,80,80,0.3)", color: "#ff6060", borderRadius: 4, padding: "0.3rem 0.8rem", fontSize: "0.75rem", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, marginTop: "0.8rem" },
    addBtn: { background: "rgba(245,194,0,0.1)", border: "2px dashed rgba(245,194,0,0.4)", color: "#f5c200", borderRadius: 12, padding: "1.5rem", fontSize: "1rem", fontWeight: 800, cursor: "pointer", width: "100%", fontFamily: "inherit", letterSpacing: "0.1em" },
    galleryGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1.2rem" },
    galleryCard: (i) => ({ background: GALLERY_COLORS[i % 4], border: "1.5px solid rgba(245,194,0,0.18)", borderRadius: 10, aspectRatio: "4/3", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.6rem", padding: "1rem" }),
    galleryIcon: { fontSize: "2.5rem" },
    galleryLabel: { fontSize: "1rem", fontWeight: 800, color: "#f5c200", textAlign: "center", letterSpacing: "0.05em" },
    faqList: { display: "flex", flexDirection: "column", gap: "0.8rem" },
    faqItem: { background: "rgba(20,15,0,0.7)", border: "1.5px solid rgba(245,194,0,0.15)", borderRadius: 8, overflow: "hidden" },
    faqQ: { padding: "1.1rem 1.4rem", fontSize: "1.05rem", fontWeight: 800, color: "#fff", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", letterSpacing: "0.03em" },
    faqA: (open) => ({ maxHeight: open ? 200 : 0, overflow: "hidden", transition: "max-height 0.35s ease", padding: open ? "0 1.4rem 1.1rem" : "0 1.4rem", fontSize: "0.95rem", color: "#aaa", fontFamily: "Georgia, serif", lineHeight: 1.7 }),
    contactGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "start" },
    contactInfo: { display: "flex", flexDirection: "column", gap: "1.2rem" },
    contactRow: { display: "flex", alignItems: "center", gap: "1rem", fontSize: "1.05rem", color: "#ccc" },
    contactIcon: { fontSize: "1.4rem", minWidth: 32 },
    inputStyle: { background: "rgba(255,255,255,0.04)", border: "1.5px solid rgba(245,194,0,0.2)", borderRadius: 6, color: "#f0f0f0", padding: "0.8rem 1rem", fontSize: "1rem", fontFamily: "Georgia, serif", outline: "none", width: "100%", boxSizing: "border-box" },
    submitBtn: { background: "#f5c200", color: "#000", border: "none", padding: "0.85rem 2.5rem", fontSize: "1.05rem", fontWeight: 900, letterSpacing: "0.12em", borderRadius: 4, cursor: "pointer", textTransform: "uppercase", marginTop: "0.5rem" },
    footer: { borderTop: "2px solid rgba(245,194,0,0.2)", padding: "2rem", textAlign: "center", color: "#555", fontSize: "0.9rem", marginTop: "2rem" },
    divider: { height: 2, background: "linear-gradient(90deg, transparent, rgba(245,194,0,0.3), transparent)", margin: "0 2rem" },
  };

  return (
    <div style={styles.root}>
      <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;700;900&display=swap" rel="stylesheet" />

      {/* NAV */}
      <nav style={styles.nav}>
        <div style={styles.navLogo}>
          <img src={LOGO_URL} alt="Tech Toast" style={styles.navLogoImg} onError={e => e.target.style.display = "none"} />
          <span style={styles.navLogoText}>TECH TOAST</span>
        </div>
        <div style={styles.navLinks} className="tt-nav-links">
          {[["home","Home"],["about","About"],["products","Shop"],["gallery","Gallery"],["faq","FAQ"],["contact","Contact"]].map(([id, label]) => (
            <button key={id} style={styles.navLink(activeNav === id)} onClick={() => scrollTo(id)}>{label}</button>
          ))}
        </div>
        <button style={styles.editToggle} onClick={handleEditClick}>
          {editMode ? "✓ Done Editing" : "✏ Edit"}
        </button>
      </nav>

      {showPasswordModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#111", border: "2px solid #f5c200", borderRadius: 14, padding: "2.5rem 2rem", minWidth: 320, textAlign: "center", boxShadow: "0 0 60px rgba(245,194,0,0.2)" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🔐</div>
            <div style={{ fontSize: "1.3rem", fontWeight: 900, color: "#fff", letterSpacing: "0.08em", marginBottom: "0.3rem" }}>OWNER ACCESS</div>
            <div style={{ fontSize: "0.9rem", color: "#777", marginBottom: "1.5rem", fontFamily: "Georgia,serif" }}>Enter your password to edit the website</div>
            <input
              type="password"
              placeholder="Enter password"
              value={passwordInput}
              onChange={e => { setPasswordInput(e.target.value); setPasswordError(false); }}
              onKeyDown={e => e.key === "Enter" && handlePasswordSubmit()}
              autoFocus
              style={{ background: "rgba(255,255,255,0.05)", border: `1.5px solid ${passwordError ? "#ff5050" : "rgba(245,194,0,0.3)"}`, borderRadius: 6, color: "#f0f0f0", padding: "0.75rem 1rem", fontSize: "1rem", width: "100%", boxSizing: "border-box", outline: "none", marginBottom: "0.5rem", fontFamily: "monospace" }}
            />
            {passwordError && <div style={{ color: "#ff5050", fontSize: "0.85rem", marginBottom: "0.8rem" }}>❌ Wrong password. Try again.</div>}
            <div style={{ display: "flex", gap: "0.8rem", marginTop: "0.8rem" }}>
              <button onClick={() => setShowPasswordModal(false)} style={{ flex: 1, background: "transparent", border: "1.5px solid #333", color: "#888", borderRadius: 6, padding: "0.7rem", fontFamily: "inherit", fontWeight: 700, cursor: "pointer", fontSize: "0.95rem" }}>Cancel</button>
              <button onClick={handlePasswordSubmit} style={{ flex: 1, background: "#f5c200", border: "none", color: "#000", borderRadius: 6, padding: "0.7rem", fontFamily: "inherit", fontWeight: 900, cursor: "pointer", fontSize: "0.95rem", letterSpacing: "0.05em" }}>Unlock 🔥</button>
            </div>
          </div>
        </div>
      )}

      {editMode && (
        <div style={{ background: "rgba(245,194,0,0.08)", borderBottom: "1px solid rgba(245,194,0,0.2)", padding: "0.6rem 2rem", fontSize: "0.85rem", color: "#f5c200", textAlign: "center", letterSpacing: "0.05em" }}>
          ✏ Edit mode ON — click any text to edit it. Changes save automatically.
        </div>
      )}

      {/* HERO */}
      <section id="home" style={styles.hero}>
        <div style={styles.heroBg} />
        <img src={LOGO_URL} alt="Tech Toast Logo" style={styles.heroLogo} onError={e => e.target.style.display = "none"} />
        <div style={styles.heroName}>TECH TOAST</div>
        <div style={styles.heroBengali}>টেক টোস্ট</div>
        <div style={styles.heroTagline}>
          {editMode
            ? <EditableText value={data.hero.tagline} onChange={v => updateHero("tagline", v)} style={{ fontSize: "clamp(1rem, 2.5vw, 1.5rem)", color: "#f5c200", fontWeight: 700, letterSpacing: "0.2em" }} />
            : data.hero.tagline}
        </div>
        <p style={styles.heroSub}>
          {editMode
            ? <EditableText value={data.hero.subtitle} onChange={v => updateHero("subtitle", v)} multiline style={{ fontSize: "1.1rem", color: "#bbb" }} />
            : data.hero.subtitle}
        </p>
        <button style={styles.heroCta} onClick={() => scrollTo("products")}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
          {editMode
            ? <EditableText value={data.hero.cta} onChange={v => updateHero("cta", v)} style={{ background: "transparent", color: "#000", fontWeight: 900 }} />
            : data.hero.cta}
        </button>
      </section>

      <div style={styles.divider} />

      {/* ABOUT */}
      <section id="about" style={styles.section}>
        <div style={styles.sectionTitle}>
          {editMode
            ? <EditableText value={data.about.title} onChange={v => updateAbout("title", v)} style={{ fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 900, color: "#fff" }} />
            : data.about.title}
        </div>
        <div style={styles.sectionAccent} />
        <div style={styles.aboutGrid} className="tt-about-grid">
          <div style={styles.aboutBody}>
            {editMode
              ? <EditableText value={data.about.body} onChange={v => updateAbout("body", v)} multiline style={{ fontSize: "1.05rem", color: "#ccc", fontFamily: "Georgia,serif" }} />
              : data.about.body}
          </div>
          <div style={styles.highlightGrid} className="tt-highlight-grid">
            {data.about.highlights.map((h, i) => (
              <div key={i} style={styles.highlightItem}>
                {editMode
                  ? <EditableText value={h} onChange={v => updateHighlight(i, v)} style={{ fontWeight: 800, color: "#f5c200", fontSize: "1rem" }} />
                  : h}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={styles.divider} />

      {/* PRODUCTS */}
      <section id="products" style={styles.section}>
        <div style={styles.sectionTitle}>Our Products</div>
        <div style={styles.sectionAccent} />
        <div style={styles.productsGrid} className="tt-products-grid">
          {data.products.map(p => (
            <div key={p.id} style={styles.productCard}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(245,194,0,0.5)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(245,194,0,0.15)"; e.currentTarget.style.transform = "translateY(0)"; }}>
              <span style={styles.productTag(p.tag)}>{p.tag}</span>
              <div style={styles.productName}>
                {editMode
                  ? <EditableText value={p.name} onChange={v => updateProduct(p.id, "name", v)} style={{ fontSize: "1.2rem", fontWeight: 900, color: "#fff" }} />
                  : p.name}
              </div>
              <div style={styles.productDesc}>
                {editMode
                  ? <EditableText value={p.desc} onChange={v => updateProduct(p.id, "desc", v)} multiline style={{ fontSize: "0.9rem", color: "#888", fontFamily: "Georgia,serif" }} />
                  : p.desc}
              </div>
              <div style={styles.productPrice}>
                {editMode
                  ? <EditableText value={p.price} onChange={v => updateProduct(p.id, "price", v)} style={{ fontSize: "1.3rem", fontWeight: 900, color: "#f5c200" }} />
                  : p.price}
              </div>
              {!editMode && data.social?.whatsapp && (
                <a
                  href={"https://wa.me/" + data.social.whatsapp.replace(/[^0-9]/g,"") + "?text=" + encodeURIComponent("Hi! I want to order: " + p.name + " (" + p.price + ")")}
                  target="_blank" rel="noopener noreferrer"
                  style={{ display: "inline-block", marginTop: "0.8rem", background: "#25d366", color: "#fff", padding: "0.45rem 1.1rem", borderRadius: 5, fontSize: "0.85rem", fontWeight: 800, textDecoration: "none", letterSpacing: "0.05em" }}
                >
                  💬 Order on WhatsApp
                </a>
              )}
              {editMode && <button style={styles.deleteBtn} onClick={() => deleteProduct(p.id)}>✕ Remove</button>}
            </div>
          ))}

          {editMode && !addingProduct && (
            <button style={styles.addBtn} onClick={() => setAddingProduct(true)}>+ Add Product</button>
          )}

          {editMode && addingProduct && (
            <div style={{ ...styles.productCard, border: "2px dashed rgba(245,194,0,0.5)" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                <input placeholder="Product Name" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} style={styles.inputStyle} />
                <input placeholder="Price e.g. ৳ 1,299" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} style={styles.inputStyle} />
                <input placeholder="Short description" value={newProduct.desc} onChange={e => setNewProduct({ ...newProduct, desc: e.target.value })} style={styles.inputStyle} />
                <select value={newProduct.tag} onChange={e => setNewProduct({ ...newProduct, tag: e.target.value })} style={styles.inputStyle}>
                  {Object.keys(TAG_COLORS).map(t => <option key={t}>{t}</option>)}
                </select>
                <div style={{ display: "flex", gap: "0.6rem" }}>
                  <button style={styles.submitBtn} onClick={addProduct}>Add</button>
                  <button style={{ ...styles.deleteBtn, marginTop: 0 }} onClick={() => setAddingProduct(false)}>Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <div style={styles.divider} />

      {/* GALLERY */}
      <section id="gallery" style={styles.section}>
        <div style={styles.sectionTitle}>Gallery</div>
        <div style={styles.sectionAccent} />
        <div style={styles.galleryGrid} className="tt-gallery-grid">
          {data.gallery.map((g, i) => (
            <div key={g.id} style={styles.galleryCard(i)}>
              <div style={styles.galleryIcon}>🎧</div>
              <div style={styles.galleryLabel}>
                {editMode
                  ? <EditableText value={g.label} onChange={v => updateGallery(g.id, v)} style={{ fontWeight: 800, color: "#f5c200", textAlign: "center", fontSize: "1rem" }} />
                  : g.label}
              </div>
              <div style={{ fontSize: "0.75rem", color: "#555", marginTop: "0.3rem" }}>Upload coming soon</div>
            </div>
          ))}
        </div>
      </section>

      <div style={styles.divider} />

      {/* FAQ */}
      <section id="faq" style={styles.section}>
        <div style={styles.sectionTitle}>FAQ</div>
        <div style={styles.sectionAccent} />
        <div style={styles.faqList}>
          {data.faq.map((f, i) => (
            <div key={i} style={styles.faqItem}>
              <div style={styles.faqQ} onClick={() => setFaqOpen(faqOpen === i ? null : i)}>
                <span>
                  {editMode
                    ? <EditableText value={f.q} onChange={v => updateFaq(i, "q", v)} style={{ fontWeight: 800, color: "#fff", fontSize: "1rem" }} />
                    : f.q}
                </span>
                <span style={{ color: "#f5c200", fontSize: "1.2rem" }}>{faqOpen === i ? "−" : "+"}</span>
              </div>
              <div style={styles.faqA(faqOpen === i)}>
                {editMode
                  ? <EditableText value={f.a} onChange={v => updateFaq(i, "a", v)} multiline style={{ fontSize: "0.95rem", color: "#aaa", fontFamily: "Georgia,serif" }} />
                  : f.a}
                {editMode && <button style={{ ...styles.deleteBtn, marginTop: "0.5rem", display: "block" }} onClick={() => deleteFaq(i)}>✕ Delete FAQ</button>}
              </div>
            </div>
          ))}
          {editMode && (
            <button style={{ ...styles.addBtn, borderRadius: 8 }} onClick={addFaq}>+ Add FAQ</button>
          )}
        </div>
      </section>

      <div style={styles.divider} />

      {/* CONTACT */}
      <section id="contact" style={styles.section}>
        <div style={styles.sectionTitle}>Contact Us</div>
        <div style={styles.sectionAccent} />
        <div style={styles.contactGrid} className="tt-contact-grid">
          <div style={styles.contactInfo}>
            <div style={styles.contactRow}>
              <span style={styles.contactIcon}>📞</span>
              <span>
                {editMode
                  ? <EditableText value={data.contact.phone} onChange={v => updateContact("phone", v)} style={{ color: "#f5c200", fontWeight: 700 }} />
                  : <a href={`tel:${data.contact.phone}`} style={{ color: "#f5c200", textDecoration: "none", fontWeight: 700 }}>{data.contact.phone}</a>}
              </span>
            </div>
            <div style={styles.contactRow}>
              <span style={styles.contactIcon}>✉️</span>
              <span>
                {editMode
                  ? <EditableText value={data.contact.email} onChange={v => updateContact("email", v)} style={{ color: "#ccc" }} />
                  : data.contact.email}
              </span>
            </div>
            <div style={styles.contactRow}>
              <span style={styles.contactIcon}>📍</span>
              <span>
                {editMode
                  ? <EditableText value={data.contact.address} onChange={v => updateContact("address", v)} style={{ color: "#ccc" }} />
                  : data.contact.address}
              </span>
            </div>
            <div style={{ marginTop: "1rem", padding: "1.2rem", background: "rgba(245,194,0,0.06)", border: "1.5px solid rgba(245,194,0,0.2)", borderRadius: 10, fontSize: "0.95rem", color: "#bbb", fontFamily: "Georgia,serif", lineHeight: 1.7 }}>
              🔥 We're available on WhatsApp & call. Message us for orders, queries, or after-sales support!
            </div>
          </div>
          <div>
            {submitted ? (
              <div style={{ textAlign: "center", padding: "3rem", color: "#f5c200", fontSize: "1.3rem", fontWeight: 800 }}>
                🔥 WhatsApp খুলছে! আমরা শীঘ্রই reply করব।
                <div style={{ marginTop: "1rem" }}>
                  <button onClick={() => setSubmitted(false)} style={{ background: "transparent", border: "1.5px solid #f5c200", color: "#f5c200", borderRadius: 6, padding: "0.5rem 1.2rem", fontFamily: "inherit", fontWeight: 700, cursor: "pointer", fontSize: "0.9rem" }}>আবার পাঠান</button>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <input placeholder="আপনার নাম" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={styles.inputStyle} />
                <input placeholder="আপনার ফোন নম্বর" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} style={styles.inputStyle} />
                <textarea placeholder="আপনার মেসেজ" rows={4} value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} style={{ ...styles.inputStyle, resize: "vertical" }} />
                {!data.social?.whatsapp && (
                  <div style={{ fontSize: "0.82rem", color: "#ff6060", fontFamily: "Georgia,serif" }}>⚠️ WhatsApp number এখনো দেওয়া নেই। Edit mode এ footer এ গিয়ে number দিন।</div>
                )}
                <button style={{ ...styles.submitBtn, background: data.social?.whatsapp ? "#25d366" : "#555", cursor: data.social?.whatsapp ? "pointer" : "not-allowed" }}
                  onClick={() => {
                    if (!formData.name || !formData.message) return;
                    if (!data.social?.whatsapp) return;
                    const num = data.social.whatsapp.replace(/[^0-9]/g, "");
                    const msg = "নাম: " + formData.name + "\nফোন: " + (formData.phone || "দেওয়া হয়নি") + "\nমেসেজ: " + formData.message;
                    window.open("https://wa.me/" + num + "?text=" + encodeURIComponent(msg), "_blank");
                    setSubmitted(true);
                    setFormData({ name: "", phone: "", message: "" });
                  }}>
                  💬 WhatsApp এ পাঠান
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#f5c200", marginBottom: "0.4rem", letterSpacing: "0.1em" }}>TECH TOAST — টেক টোস্ট</div>
        <div>Toast Up Your Tech Life 🔥</div>

        {(data.social?.facebook || data.social?.instagram || data.social?.whatsapp) && <div style={{ display: "flex", justifyContent: "center", gap: "1rem", margin: "1rem 0", flexWrap: "wrap" }}>
          {data.social?.facebook && (
            <a href={data.social.facebook} target="_blank" rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "#1877f2", color: "#fff", padding: "0.5rem 1.2rem", borderRadius: 6, fontFamily: "inherit", fontWeight: 800, fontSize: "0.95rem", textDecoration: "none" }}>
              📘 Facebook
            </a>
          )}
          {data.social?.instagram && (
            <a href={data.social.instagram} target="_blank" rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)", color: "#fff", padding: "0.5rem 1.2rem", borderRadius: 6, fontFamily: "inherit", fontWeight: 800, fontSize: "0.95rem", textDecoration: "none" }}>
              📷 Instagram
            </a>
          )}
          {data.social?.whatsapp && (
            <a href={"https://wa.me/" + data.social.whatsapp.replace(/[^0-9]/g,"")} target="_blank" rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "#25d366", color: "#fff", padding: "0.5rem 1.2rem", borderRadius: 6, fontFamily: "inherit", fontWeight: 800, fontSize: "0.95rem", textDecoration: "none" }}>
              💬 WhatsApp
            </a>
          )}
        </div>}

        {editMode && (
          <div style={{ maxWidth: 420, margin: "0.8rem auto", display: "flex", flexDirection: "column", gap: "0.6rem", padding: "1.2rem", background: "rgba(245,194,0,0.06)", border: "1.5px dashed rgba(245,194,0,0.3)", borderRadius: 10 }}>
            <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "#f5c200", letterSpacing: "0.08em", marginBottom: "0.2rem" }}>📱 SOCIAL MEDIA LINKS</div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <span>📘</span>
              <input
                placeholder="Facebook URL (https://facebook.com/yourpage)"
                value={data.social?.facebook || ""}
                onChange={e => updateSocial("facebook", e.target.value)}
                style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1.5px solid rgba(245,194,0,0.2)", borderRadius: 6, color: "#f0f0f0", padding: "0.6rem 0.8rem", fontSize: "0.85rem", fontFamily: "monospace", outline: "none" }}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <span>📷</span>
              <input
                placeholder="Instagram URL (https://instagram.com/yourpage)"
                value={data.social?.instagram || ""}
                onChange={e => updateSocial("instagram", e.target.value)}
                style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1.5px solid rgba(245,194,0,0.2)", borderRadius: 6, color: "#f0f0f0", padding: "0.6rem 0.8rem", fontSize: "0.85rem", fontFamily: "monospace", outline: "none" }}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <span>💬</span>
              <input
                placeholder="WhatsApp Number (e.g. 8801410018220)"
                value={data.social?.whatsapp || ""}
                onChange={e => updateSocial("whatsapp", e.target.value)}
                style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1.5px solid rgba(245,194,0,0.2)", borderRadius: 6, color: "#f0f0f0", padding: "0.6rem 0.8rem", fontSize: "0.85rem", fontFamily: "monospace", outline: "none" }}
              />
            </div>
            <div style={{ fontSize: "0.78rem", color: "#777", fontFamily: "Georgia,serif" }}>সঠিক URL/Number দিলে উপরে button দেখাবে। Automatically save হয়।</div>
          </div>
        )}

        <div style={{ marginTop: "0.5rem" }}>© {new Date().getFullYear()} Tech Toast. All rights reserved.</div>
      </footer>
      {/* WHATSAPP FLOATING BUTTON */}
      {data.social?.whatsapp && (
        <a
          href={"https://wa.me/" + data.social.whatsapp.replace(/[^0-9]/g,"")}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: "fixed", bottom: 28, right: 28, zIndex: 9998,
            background: "#25d366", color: "#fff", borderRadius: "50%",
            width: 60, height: 60, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.8rem", boxShadow: "0 4px 20px rgba(37,211,102,0.5)",
            textDecoration: "none", transition: "transform 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.12)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          title="Chat on WhatsApp"
        >
          💬
        </a>
      )}

      {/* MOBILE RESPONSIVE STYLES */}
      <style>{`
        @media (max-width: 768px) {
          .tt-nav-links { display: none !important; }
          .tt-about-grid { grid-template-columns: 1fr !important; gap: 1.5rem !important; }
          .tt-contact-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
          .tt-highlight-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .tt-products-grid { grid-template-columns: 1fr !important; }
          .tt-gallery-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  );
}
