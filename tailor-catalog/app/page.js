"use client";

import { useState, useMemo, useEffect } from "react";
import { supabase } from "./supabase";

// ── Constants ────────────────────────────────────────────────────────────────
const WHATSAPP    = "919448686569";
const NECK_TYPES  = ["Boat Neck","V-Neck","Round Neck","Square Neck","Sweetheart","High Neck","Halter Neck","Off Shoulder","Deep Neck","Lotus Neck","Collar Neck","Peter Pan"];
const SLEEVE_TYPES= ["Sleeveless","Cap Sleeve","Short Sleeve","Elbow Sleeve","Full Sleeve","Cold Shoulder","Off Shoulder","Puff Sleeve","Bell Sleeve"];
const OCCASIONS   = ["Bridal","Wedding","Festival","Party","Daily Wear","Reception","Mehendi"];
const WORK_TYPES  = ["Maggam Work","Aari Work","Zardozi","Embroidery","Cutwork","Sequence","Patch Work","Zari Work","Mirror Work","Simple","Thread Work","Stone Work"];
const FABRICS     = ["Silk","Kanchipuram Silk","Cotton","Cotton Silk","Velvet","Net","Georgette","Banarasi","Chanderi","Raw Silk","Crepe","Organza"];
const SEED_ADMINS = [{ id:1, username:"suresh", passwordHash:"StyleNFashion@2025", name:"Suresh", role:"Owner" }];
const INVITE_KEY  = "SNF-ADMIN-2025";

const wa   = (msg)   => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
const slug = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");

// ── Palette ──────────────────────────────────────────────────────────────────
const P = {
  bg:"#fdf6f8", surface:"#fff", border:"#f0dde4",
  rose:"#c4556d", roseDark:"#9e3450", roseSoft:"#f7e6ea",
  mauve:"#9b7494", text:"#3a1828", muted:"#8a607a",
  tag:"#fbeef2", tagText:"#a0405a", whatsapp:"#25D366",
  heroBg:"linear-gradient(135deg, #9e3450 0%, #c4556d 45%, #d4849a 100%)",
  errorBg:"#fff0f3", errorText:"#b0203a",
};

// ── Tiny helpers ─────────────────────────────────────────────────────────────
const Tag = ({children}) => (
  <span style={{fontSize:10,background:P.tag,color:P.tagText,padding:"2px 8px",borderRadius:20,fontWeight:600,whiteSpace:"nowrap"}}>{children}</span>
);
const Btn = ({children,style={},disabled,...rest}) => (
  <button disabled={disabled} style={{cursor:disabled?"not-allowed":"pointer",fontFamily:"inherit",border:"none",opacity:disabled?0.55:1,...style}} {...rest}>{children}</button>
);
const Inp = ({label,type="text",value,onChange,placeholder,error,icon}) => (
  <div style={{marginBottom:16}}>
    {label && <label style={{fontSize:11,color:P.roseDark,fontWeight:700,display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:0.6}}>{label}</label>}
    <div style={{position:"relative"}}>
      {icon && <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:16,color:P.mauve}}>{icon}</span>}
      <input type={type} value={value} onChange={onChange} placeholder={placeholder}
        style={{width:"100%",padding:`10px 12px 10px ${icon?"38px":"12px"}`,borderRadius:10,
          border:`1.5px solid ${error?P.rose:P.border}`,fontSize:14,boxSizing:"border-box",
          fontFamily:"inherit",color:P.text,background:P.bg,outline:"none"}}/>
    </div>
    {error && <div style={{fontSize:11,color:P.errorText,marginTop:4}}>⚠ {error}</div>}
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// AUTH MODAL
// ═══════════════════════════════════════════════════════════════════════════════
function AuthModal({admins,setAdmins,onSuccess,onClose}) {
  const [tab,setTab]         = useState("login");
  const [showPwd,setShowPwd] = useState(false);
  const [loading,setLoading] = useState(false);
  const [lUser,setLUser]     = useState("");
  const [lPass,setLPass]     = useState("");
  const [lErr,setLErr]       = useState({});
  const [rName,setRName]     = useState("");
  const [rUser,setRUser]     = useState("");
  const [rPass,setRPass]     = useState("");
  const [rPass2,setRPass2]   = useState("");
  const [rKey,setRKey]       = useState("");
  const [rErr,setRErr]       = useState({});

  const handleLogin = () => {
    const errs = {};
    if (!lUser.trim()) errs.user="Username is required";
    if (!lPass.trim()) errs.pass="Password is required";
    if (Object.keys(errs).length) { setLErr(errs); return; }
    setLoading(true);
    setTimeout(()=>{
      const found = admins.find(a=>a.username===lUser.trim().toLowerCase()&&a.passwordHash===lPass);
      if (!found) { setLErr({general:"Invalid username or password"}); setLoading(false); return; }
      setLoading(false); onSuccess(found);
    },700);
  };

  const handleRegister = () => {
    const errs = {};
    if (!rName.trim())  errs.name ="Full name is required";
    if (!rUser.trim())  errs.user ="Username is required";
    else if (admins.find(a=>a.username===rUser.trim().toLowerCase())) errs.user="Username already taken";
    if (!rPass)         errs.pass ="Password is required";
    else if (rPass.length<8) errs.pass="Min 8 characters";
    if (rPass!==rPass2) errs.pass2="Passwords do not match";
    if (rKey.trim()!==INVITE_KEY) errs.key="Invalid invite key";
    if (Object.keys(errs).length) { setRErr(errs); return; }
    setLoading(true);
    setTimeout(()=>{
      const newAdmin={id:admins.length+1,username:rUser.trim().toLowerCase(),passwordHash:rPass,name:rName.trim(),role:"Admin"};
      setAdmins(prev=>[...prev,newAdmin]); setLoading(false); onSuccess(newAdmin);
    },700);
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(40,10,20,0.82)",zIndex:3000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={onClose}>
      <div style={{background:P.surface,borderRadius:24,width:"100%",maxWidth:420,boxShadow:"0 24px 80px rgba(0,0,0,0.35)",overflow:"hidden"}} onClick={e=>e.stopPropagation()}>
        <div style={{background:P.heroBg,padding:"28px 32px 24px",textAlign:"center",position:"relative"}}>
          <Btn onClick={onClose} style={{position:"absolute",top:14,right:14,background:"rgba(255,255,255,0.18)",borderRadius:"50%",width:30,height:30,color:"#fff",fontSize:15}}>✕</Btn>
          <div style={{fontSize:32,marginBottom:8}}>🔐</div>
          <div style={{color:"rgba(255,220,230,0.85)",fontSize:10,fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:4}}>Admin Access</div>
          <div style={{color:"#fff",fontSize:20,fontFamily:"Georgia,serif",fontWeight:700}}>Style N Fashion</div>
        </div>
        <div style={{display:"flex",borderBottom:`1px solid ${P.border}`}}>
          {[["login","🔑 Login"],["register","✨ Register"]].map(([t,l])=>(
            <Btn key={t} onClick={()=>{setTab(t);setLErr({});setRErr({});}}
              style={{flex:1,padding:"13px",border:"none",background:"none",borderBottom:`2.5px solid ${tab===t?P.rose:"transparent"}`,color:tab===t?P.rose:P.muted,fontSize:13,fontWeight:700}}>
              {l}
            </Btn>
          ))}
        </div>
        <div style={{padding:"24px 28px 28px"}}>
          {tab==="login" && (
            <>
              {lErr.general && <div style={{background:P.errorBg,border:"1px solid #ffc0cc",borderRadius:10,padding:"10px 14px",marginBottom:16,fontSize:13,color:P.errorText,fontWeight:600}}>❌ {lErr.general}</div>}
              <Inp label="Username" value={lUser} onChange={e=>{setLUser(e.target.value);setLErr({});}} placeholder="Enter username" icon="👤" error={lErr.user}/>
              <Inp label="Password" type={showPwd?"text":"password"} value={lPass} onChange={e=>{setLPass(e.target.value);setLErr({});}} placeholder="Enter password" icon="🔒" error={lErr.pass}/>
              <label style={{display:"flex",alignItems:"center",gap:8,fontSize:13,color:P.muted,cursor:"pointer",marginBottom:20}}>
                <input type="checkbox" checked={showPwd} onChange={e=>setShowPwd(e.target.checked)} style={{accentColor:P.rose}}/> Show password
              </label>
              <Btn onClick={handleLogin} disabled={loading} style={{width:"100%",padding:"13px",borderRadius:12,background:P.rose,color:"#fff",fontSize:15,fontWeight:700}}>
                {loading?"Signing in…":"Sign In →"}
              </Btn>
              <div style={{marginTop:18,background:P.bg,borderRadius:10,padding:"10px 14px",fontSize:11,color:P.mauve,border:`1px solid ${P.border}`}}>
                <b>Login:</b> username <code>suresh</code> · password <code>StyleNFashion@2025</code>
              </div>
            </>
          )}
          {tab==="register" && (
            <>
              <div style={{background:"#f0f8ff",border:"1px solid #c0d8f0",borderRadius:10,padding:"10px 14px",marginBottom:16,fontSize:12,color:"#2a5080"}}>
                📩 Needs invite key from Suresh
              </div>
              <Inp label="Full Name"        value={rName}  onChange={e=>{setRName(e.target.value);setRErr({});}}  placeholder="Your name"         icon="👤" error={rErr.name}/>
              <Inp label="Username"         value={rUser}  onChange={e=>{setRUser(e.target.value);setRErr({});}}  placeholder="Choose username"    icon="🏷" error={rErr.user}/>
              <Inp label="Password"         type={showPwd?"text":"password"} value={rPass}  onChange={e=>{setRPass(e.target.value);setRErr({});}}  placeholder="Min 8 chars" icon="🔒" error={rErr.pass}/>
              <Inp label="Confirm Password" type={showPwd?"text":"password"} value={rPass2} onChange={e=>{setRPass2(e.target.value);setRErr({});}} placeholder="Re-enter"    icon="🔒" error={rErr.pass2}/>
              <Inp label="Invite Key"       value={rKey}   onChange={e=>{setRKey(e.target.value);setRErr({});}}   placeholder="Ask Suresh"        icon="🗝" error={rErr.key}/>
              <label style={{display:"flex",alignItems:"center",gap:8,fontSize:13,color:P.muted,cursor:"pointer",marginBottom:20}}>
                <input type="checkbox" checked={showPwd} onChange={e=>setShowPwd(e.target.checked)} style={{accentColor:P.rose}}/> Show passwords
              </label>
              <Btn onClick={handleRegister} disabled={loading} style={{width:"100%",padding:"13px",borderRadius:12,background:P.rose,color:"#fff",fontSize:15,fontWeight:700}}>
                {loading?"Creating…":"Create Admin Account →"}
              </Btn>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SEARCH PANEL
// ═══════════════════════════════════════════════════════════════════════════════
function ChipRow({label,icon,options,active,onSelect}) {
  return (
    <div style={{marginBottom:14}}>
      <div style={{fontSize:11,color:P.mauve,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:7,display:"flex",alignItems:"center",gap:5}}>
        <span>{icon}</span>{label}
      </div>
      <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:4,WebkitOverflowScrolling:"touch"}}>
        {options.map(o=>{
          const on=active===o;
          return (
            <Btn key={o} onClick={()=>onSelect(o===active?"All":o)}
              style={{padding:"6px 13px",borderRadius:20,whiteSpace:"nowrap",fontSize:12,fontWeight:600,flexShrink:0,
                background:on?P.rose:P.surface,color:on?"#fff":P.muted,
                border:`1.5px solid ${on?P.rose:P.border}`,transition:"all 0.15s"}}>
              {o}
            </Btn>
          );
        })}
      </div>
    </div>
  );
}

function SearchPanel({filters,setFilters,searchQ,setSearchQ,total,found,hasDesigns}) {
  const [expanded,setExpanded]=useState(false);
  const active=Object.values(filters).filter(v=>v!=="All").length;
  const anyFilter=active>0||searchQ.trim().length>0;
  const suggestions=["Boat Neck","Bridal","Maggam Work","Sleeveless","Silk","V-Neck","Full Sleeve","Festival","Aari Work"];
  const clearAll=()=>{setFilters({neck:"All",sleeve:"All",occasion:"All",work:"All",fabric:"All"});setSearchQ("");};

  return (
    <div style={{background:P.surface,borderRadius:20,boxShadow:"0 4px 24px rgba(196,85,109,0.10)",marginBottom:24,border:`1px solid ${P.border}`,overflow:"hidden"}}>
      <div style={{padding:"18px 20px 14px",borderBottom:expanded?`1px solid ${P.border}`:"none"}}>
        <div style={{fontSize:13,color:P.muted,fontWeight:600,marginBottom:10,display:"flex",alignItems:"center",gap:6}}>
          <span>🔍</span> What blouse design are you looking for?
        </div>
        <div style={{position:"relative"}}>
          <input value={searchQ} onChange={e=>setSearchQ(e.target.value)} onFocus={()=>setExpanded(true)}
            placeholder="e.g. boat neck bridal silk, maggam work, sleeveless..."
            style={{width:"100%",padding:"13px 46px 13px 16px",borderRadius:12,
              border:`2px solid ${searchQ?P.rose:P.border}`,fontSize:14,outline:"none",
              boxSizing:"border-box",fontFamily:"inherit",color:P.text,background:P.bg,transition:"border-color 0.2s"}}/>
          {searchQ
            ? <Btn onClick={()=>setSearchQ("")} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",color:P.mauve,fontSize:18,padding:4}}>✕</Btn>
            : <span style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",color:P.mauve,fontSize:18}}>🔍</span>
          }
        </div>
        {!searchQ && (
          <div style={{marginTop:10}}>
            <div style={{fontSize:10,color:P.mauve,fontWeight:600,marginBottom:6,textTransform:"uppercase",letterSpacing:0.8}}>Popular searches</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {suggestions.map(s=>(
                <Btn key={s} onClick={()=>setSearchQ(s)} style={{padding:"5px 12px",borderRadius:20,fontSize:12,fontWeight:600,background:P.roseSoft,color:P.rose,border:`1px solid ${P.border}`}}>{s}</Btn>
              ))}
            </div>
          </div>
        )}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:12}}>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {active>0&&Object.entries(filters).filter(([,v])=>v!=="All").map(([k,v])=>(
              <span key={k} style={{display:"inline-flex",alignItems:"center",gap:4,background:P.roseSoft,color:P.rose,borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:700,border:`1px solid ${P.border}`}}>
                {v}
                <Btn onClick={()=>setFilters(p=>({...p,[k]:"All"}))} style={{background:"none",color:P.rose,fontSize:13,padding:0,lineHeight:1}}>×</Btn>
              </span>
            ))}
            {anyFilter&&<Btn onClick={clearAll} style={{background:"none",color:P.mauve,fontSize:11,fontWeight:600,padding:"3px 6px",border:`1px dashed ${P.border}`,borderRadius:20}}>Clear all</Btn>}
          </div>
          <Btn onClick={()=>setExpanded(p=>!p)}
            style={{fontSize:12,fontWeight:700,color:P.rose,background:expanded?P.roseSoft:"none",border:`1.5px solid ${expanded?P.rose:P.border}`,borderRadius:10,padding:"5px 12px",display:"flex",alignItems:"center",gap:5}}>
            {active>0&&<span style={{background:P.rose,color:"#fff",borderRadius:"50%",width:16,height:16,fontSize:9,display:"inline-flex",alignItems:"center",justifyContent:"center",fontWeight:800}}>{active}</span>}
            Filters {expanded?"▲":"▼"}
          </Btn>
        </div>
      </div>
      {expanded&&(
        <div style={{padding:"16px 20px 10px"}}>
          <ChipRow label="Neck Style"  icon="👗" options={NECK_TYPES}   active={filters.neck}     onSelect={v=>setFilters(p=>({...p,neck:v}))}/>
          <ChipRow label="Sleeve Type" icon="💪" options={SLEEVE_TYPES} active={filters.sleeve}   onSelect={v=>setFilters(p=>({...p,sleeve:v}))}/>
          <ChipRow label="Occasion"    icon="🎉" options={OCCASIONS}    active={filters.occasion}  onSelect={v=>setFilters(p=>({...p,occasion:v}))}/>
          <ChipRow label="Work Type"   icon="🪡" options={WORK_TYPES}   active={filters.work}     onSelect={v=>setFilters(p=>({...p,work:v}))}/>
          <ChipRow label="Fabric"      icon="✨" options={FABRICS}      active={filters.fabric}   onSelect={v=>setFilters(p=>({...p,fabric:v}))}/>
        </div>
      )}
      {hasDesigns&&(
        <div style={{padding:"8px 20px",background:anyFilter?P.roseSoft:P.bg,borderTop:`1px solid ${P.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{fontSize:12,color:anyFilter?P.rose:P.muted,fontWeight:anyFilter?700:400}}>
            {anyFilter ? (found===0?"No designs match — try different filters":`✓ ${found} design${found!==1?"s":""} match`) : `${total} design${total!==1?"s":""} in archive`}
          </div>
          {anyFilter&&found>0&&<div style={{fontSize:11,color:P.mauve}}>Scroll down ↓</div>}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DESIGN CARD
// ═══════════════════════════════════════════════════════════════════════════════
function DesignCard({design,onClick}) {
  const [hovered,setHovered]=useState(false);
  return (
    <div onClick={()=>onClick(design)} onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}
      style={{cursor:"pointer",borderRadius:16,overflow:"hidden",background:P.surface,
        boxShadow:hovered?"0 10px 36px rgba(196,85,109,0.18)":"0 2px 10px rgba(0,0,0,0.07)",
        transform:hovered?"translateY(-3px)":"none",transition:"all 0.22s",position:"relative"}}>
      <div style={{position:"relative",paddingTop:"130%",background:P.roseSoft}}>
        {design.img_url
          ? <img src={design.img_url} alt={design.title} style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}}/>
          : <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6}}>
              <span style={{fontSize:40,opacity:0.3}}>🎀</span>
              <span style={{fontSize:11,color:P.mauve,opacity:0.6}}>No image</span>
            </div>
        }
        {design.featured&&<div style={{position:"absolute",top:10,left:10,background:P.rose,color:"#fff",fontSize:9,fontWeight:700,letterSpacing:1.2,padding:"3px 9px",borderRadius:20,textTransform:"uppercase"}}>Featured</div>}
        {hovered&&(
          <div style={{position:"absolute",inset:0,background:"rgba(120,30,55,0.55)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10}}>
            <div style={{color:"#fff",fontFamily:"Georgia,serif",fontSize:13,fontStyle:"italic",textAlign:"center",padding:"0 18px",lineHeight:1.4}}>{design.title}</div>
            <a href={wa(`Hello! I'm interested in Design #${design.id} - "${design.title}". Please share stitching details and pricing.`)}
              target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()}
              style={{background:P.whatsapp,color:"#fff",borderRadius:24,padding:"8px 20px",fontSize:13,fontWeight:700,display:"flex",alignItems:"center",gap:6,textDecoration:"none"}}>
              💬 Get Stitched
            </a>
          </div>
        )}
      </div>
      <div style={{padding:"12px 14px"}}>
        <div style={{fontSize:13,fontWeight:700,color:P.text,lineHeight:1.35,marginBottom:7,fontFamily:"Georgia,serif"}}>{design.title}</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:8}}>
          {[design.neck,design.occasion,design.work].filter(Boolean).map(t=><Tag key={t}>{t}</Tag>)}
        </div>
        <div style={{fontSize:11,color:P.mauve}}>{design.fabric}{design.sleeve?` · ${design.sleeve}`:""}</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DESIGN MODAL
// ═══════════════════════════════════════════════════════════════════════════════
function DesignModal({design,designs,onClose,onSelect}) {
  const related=designs.filter(d=>d.id!==design.id&&(d.occasion===design.occasion||d.neck===design.neck)).slice(0,4);

  // Track WhatsApp click
  const handleWaClick = async () => {
    await supabase.from("designs").update({inquiries:(design.inquiries||0)+1}).eq("id",design.id);
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(40,10,20,0.78)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16,overflowY:"auto"}} onClick={onClose}>
      <div style={{background:P.surface,borderRadius:20,maxWidth:860,width:"100%",display:"flex",flexWrap:"wrap",boxShadow:"0 24px 80px rgba(0,0,0,0.35)",maxHeight:"90vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
        <div style={{flex:"1 1 300px",minHeight:380,background:P.roseSoft,borderRadius:"20px 0 0 20px",overflow:"hidden",position:"relative"}}>
          {design.img_url
            ? <img src={design.img_url} alt={design.title} style={{width:"100%",height:"100%",objectFit:"cover",minHeight:380}}/>
            : <div style={{width:"100%",minHeight:380,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:10}}>
                <span style={{fontSize:56,opacity:0.25}}>🎀</span>
              </div>
          }
          <Btn onClick={onClose} style={{position:"absolute",top:14,right:14,width:32,height:32,borderRadius:"50%",background:"rgba(255,255,255,0.92)",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",color:P.text}}>✕</Btn>
        </div>
        <div style={{flex:"1 1 280px",padding:28,overflowY:"auto"}}>
          <div style={{fontSize:10,color:P.rose,fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>Design #{design.id}</div>
          <h2 style={{fontSize:20,fontFamily:"Georgia,serif",color:P.text,lineHeight:1.3,margin:"0 0 18px"}}>{design.title}</h2>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:22}}>
            {[["Neck Type",design.neck],["Sleeve",design.sleeve],["Occasion",design.occasion],["Work Type",design.work],["Fabric",design.fabric]].filter(([,v])=>v).map(([l,v])=>(
              <div key={l} style={{background:P.bg,borderRadius:10,padding:"10px 13px",border:`1px solid ${P.border}`}}>
                <div style={{fontSize:9,color:P.mauve,fontWeight:700,textTransform:"uppercase",letterSpacing:0.8,marginBottom:3}}>{l}</div>
                <div style={{fontSize:13,color:P.text,fontWeight:700}}>{v}</div>
              </div>
            ))}
          </div>
          <a href={wa(`Hello! I'm interested in Design #${design.id} - "${design.title}". Please share stitching details and pricing.`)}
            target="_blank" rel="noopener noreferrer" onClick={handleWaClick}
            style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,background:P.whatsapp,color:"#fff",borderRadius:14,padding:"14px",textDecoration:"none",fontSize:15,fontWeight:700,marginBottom:10}}>
            💬 Get This Design Stitched
          </a>
          <Btn onClick={()=>{navigator.clipboard?.writeText(window.location.href);alert("Link copied!");}}
            style={{width:"100%",padding:"11px",borderRadius:14,border:`1.5px solid ${P.border}`,background:P.surface,color:P.muted,fontSize:13,fontWeight:600}}>
            🔗 Share Design
          </Btn>
          {related.length>0&&(
            <div style={{marginTop:22,paddingTop:18,borderTop:`1px solid ${P.border}`}}>
              <div style={{fontSize:11,color:P.mauve,fontWeight:700,textTransform:"uppercase",letterSpacing:0.8,marginBottom:10}}>Related Designs</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {related.map(r=>(
                  <div key={r.id} onClick={()=>onSelect(r)} style={{borderRadius:10,overflow:"hidden",cursor:"pointer",background:P.roseSoft}}>
                    {r.img_url?<img src={r.img_url} alt={r.title} style={{width:"100%",height:72,objectFit:"cover"}}/>
                      :<div style={{width:"100%",height:72,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,opacity:0.3}}>🎀</div>}
                    <div style={{padding:"5px 8px",fontSize:10,color:P.roseDark,fontWeight:600,lineHeight:1.3}}>{r.title.split(" ").slice(0,4).join(" ")}…</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN PANEL
// ═══════════════════════════════════════════════════════════════════════════════
function AdminPanel({designs,setDesigns,currentUser,onLogout,onClose}) {
  const [tab,setTab]           = useState("list");
  const [form,setForm]         = useState({title:"",neck:"",sleeve:"",occasion:"",work:"",fabric:"",featured:false});
  const [imgFile,setImgFile]   = useState(null);
  const [imgPreview,setImgPreview] = useState(null);
  const [editId,setEditId]     = useState(null);
  const [toast,setToast]       = useState(null);
  const [saving,setSaving]     = useState(false);

  const showToast=(msg,ok=true)=>{setToast({msg,ok});setTimeout(()=>setToast(null),3000);};

  const handleImage=(e)=>{
    const file=e.target.files[0]; if(!file) return;
    setImgFile(file);
    const reader=new FileReader();
    reader.onload=(ev)=>setImgPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const resetForm=()=>{setForm({title:"",neck:"",sleeve:"",occasion:"",work:"",fabric:"",featured:false});setImgPreview(null);setImgFile(null);setEditId(null);};

  const handlePublish=async()=>{
    if(!form.title.trim()){showToast("⚠️ Title is required",false);return;}
    setSaving(true);
    try {
      let img_url = editId!==null ? designs.find(d=>d.id===editId)?.img_url || null : null;

      // Upload image to Supabase Storage if new file selected
      if (imgFile) {
        const ext  = imgFile.name.split(".").pop();
        const name = `${Date.now()}-${slug(form.title)}.${ext}`;
        const { error: uploadErr } = await supabase.storage.from("designs").upload(name, imgFile, {contentType: imgFile.type});
        if (uploadErr) { showToast("❌ Image upload failed: "+uploadErr.message,false); setSaving(false); return; }
        const { data: urlData } = supabase.storage.from("designs").getPublicUrl(name);
        img_url = urlData.publicUrl;
      }

      if (editId!==null) {
        // Update existing
        const { error } = await supabase.from("designs").update({...form, img_url, slug:slug(form.title)}).eq("id",editId);
        if (error) { showToast("❌ Update failed: "+error.message,false); setSaving(false); return; }
        setDesigns(prev=>prev.map(d=>d.id===editId?{...d,...form,img_url,slug:slug(form.title)}:d));
        showToast("✅ Design updated!");
      } else {
        // Insert new
        const { data, error } = await supabase.from("designs").insert({...form, img_url, slug:slug(form.title), views:0, inquiries:0}).select();
        if (error) { showToast("❌ Save failed: "+error.message,false); setSaving(false); return; }
        setDesigns(prev=>[data[0],...prev]);
        showToast("✅ Design published!");
      }
      resetForm(); setTab("list");
    } catch(err) {
      showToast("❌ Error: "+err.message,false);
    }
    setSaving(false);
  };

  const handleDelete=async(id)=>{
    if(!window.confirm("Delete this design?")) return;
    const { error } = await supabase.from("designs").delete().eq("id",id);
    if (error) { showToast("❌ Delete failed: "+error.message,false); return; }
    setDesigns(prev=>prev.filter(x=>x.id!==id));
    showToast("🗑 Design deleted");
  };

  const startEdit=(d)=>{
    setForm({title:d.title,neck:d.neck||"",sleeve:d.sleeve||"",occasion:d.occasion||"",work:d.work||"",fabric:d.fabric||"",featured:d.featured||false});
    setImgPreview(d.img_url||null); setEditId(d.id); setTab("add");
  };

  const fld=(label,key,opts=null)=>(
    <div>
      <label style={{fontSize:11,color:P.roseDark,fontWeight:700,display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:0.6}}>{label}</label>
      {opts
        ? <select value={form[key]} onChange={e=>setForm(p=>({...p,[key]:e.target.value}))}
            style={{width:"100%",padding:"9px 12px",borderRadius:10,border:`1.5px solid ${P.border}`,fontSize:13,boxSizing:"border-box",fontFamily:"inherit",color:P.text,background:P.bg}}>
            <option value="">— select —</option>
            {opts.map(o=><option key={o}>{o}</option>)}
          </select>
        : <input value={form[key]} onChange={e=>setForm(p=>({...p,[key]:e.target.value}))} placeholder={`Enter ${label.toLowerCase()}`}
            style={{width:"100%",padding:"9px 12px",borderRadius:10,border:`1.5px solid ${P.border}`,fontSize:13,boxSizing:"border-box",fontFamily:"inherit",color:P.text,background:P.bg}}/>
      }
    </div>
  );

  const stats={total:designs.length,views:designs.reduce((s,d)=>s+d.views,0),inquiries:designs.reduce((s,d)=>s+d.inquiries,0)};

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(40,10,20,0.82)",zIndex:2000,display:"flex",alignItems:"flex-start",justifyContent:"center",padding:16,overflowY:"auto"}} onClick={onClose}>
      <div style={{background:P.surface,borderRadius:20,width:"100%",maxWidth:940,marginTop:16,marginBottom:16,boxShadow:"0 24px 80px rgba(0,0,0,0.3)"}} onClick={e=>e.stopPropagation()}>
        <div style={{background:P.heroBg,borderRadius:"20px 20px 0 0",padding:"18px 28px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{color:"rgba(255,220,230,0.85)",fontSize:10,fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:3}}>Admin Dashboard</div>
            <div style={{color:"#fff",fontSize:20,fontFamily:"Georgia,serif",fontWeight:700}}>Style N Fashion</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{background:"rgba(255,255,255,0.15)",borderRadius:12,padding:"6px 14px",display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:28,height:28,borderRadius:"50%",background:"rgba(255,255,255,0.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>
                {currentUser.name[0].toUpperCase()}
              </div>
              <div>
                <div style={{fontSize:12,color:"#fff",fontWeight:700}}>{currentUser.name}</div>
                <div style={{fontSize:9,color:"rgba(255,220,230,0.7)",textTransform:"uppercase",letterSpacing:0.8}}>{currentUser.role}</div>
              </div>
            </div>
            <Btn onClick={onLogout} style={{background:"rgba(255,255,255,0.15)",borderRadius:10,padding:"7px 13px",color:"#fff",fontSize:12,fontWeight:600}}>Sign Out</Btn>
            <Btn onClick={onClose}  style={{background:"rgba(255,255,255,0.18)",borderRadius:"50%",width:32,height:32,color:"#fff",fontSize:16}}>✕</Btn>
          </div>
        </div>

        <div style={{display:"flex",borderBottom:`1px solid ${P.border}`,padding:"0 28px"}}>
          {[["list","📋 Designs"],["add",editId!==null?"✏️ Edit":"➕ Add Design"],["analytics","📊 Analytics"]].map(([t,l])=>(
            <Btn key={t} onClick={()=>{if(t!=="add")resetForm();setTab(t);}}
              style={{padding:"13px 18px",border:"none",background:"none",borderBottom:`2.5px solid ${tab===t?P.rose:"transparent"}`,color:tab===t?P.rose:P.muted,fontSize:13,fontWeight:600}}>
              {l}
            </Btn>
          ))}
        </div>

        <div style={{padding:28}}>
          {/* LIST */}
          {tab==="list"&&(
            <div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
                <h3 style={{margin:0,fontSize:18,color:P.text,fontFamily:"Georgia,serif"}}>All Designs ({designs.length})</h3>
                <Btn onClick={()=>{resetForm();setTab("add");}} style={{background:P.rose,color:"#fff",borderRadius:10,padding:"9px 18px",fontSize:13,fontWeight:700}}>+ Add New Design</Btn>
              </div>
              {designs.length===0
                ? <div style={{textAlign:"center",padding:"48px 20px",color:P.mauve}}>
                    <div style={{fontSize:40,marginBottom:10,opacity:0.3}}>🎀</div>
                    <div style={{fontSize:15,marginBottom:8}}>No designs yet</div>
                    <Btn onClick={()=>{resetForm();setTab("add");}} style={{background:P.roseSoft,color:P.rose,borderRadius:10,padding:"10px 20px",fontSize:13,fontWeight:700,border:`1.5px solid ${P.border}`}}>Add First Design</Btn>
                  </div>
                : <div style={{overflowX:"auto"}}>
                    <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                      <thead>
                        <tr style={{background:P.bg}}>
                          {["#","Image","Title","Neck","Occasion","Work","Fabric","Actions"].map(h=>(
                            <th key={h} style={{padding:"9px 11px",textAlign:"left",color:P.roseDark,fontWeight:700,fontSize:10,textTransform:"uppercase",letterSpacing:0.6,borderBottom:`1px solid ${P.border}`}}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {designs.map(d=>(
                          <tr key={d.id} style={{borderBottom:`1px solid ${P.bg}`}}>
                            <td style={{padding:"9px 11px",color:P.mauve,fontSize:12}}>#{d.id}</td>
                            <td style={{padding:"9px 11px"}}>
                              {d.img_url?<img src={d.img_url} style={{width:42,height:42,borderRadius:8,objectFit:"cover"}} alt=""/>
                                :<div style={{width:42,height:42,borderRadius:8,background:P.roseSoft,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,opacity:0.4}}>🎀</div>}
                            </td>
                            <td style={{padding:"9px 11px",color:P.text,fontWeight:600,maxWidth:180,fontSize:12}}>{d.title}</td>
                            <td style={{padding:"9px 11px",color:P.muted,fontSize:12}}>{d.neck}</td>
                            <td style={{padding:"9px 11px",color:P.muted,fontSize:12}}>{d.occasion}</td>
                            <td style={{padding:"9px 11px",color:P.muted,fontSize:12}}>{d.work}</td>
                            <td style={{padding:"9px 11px",color:P.muted,fontSize:12}}>{d.fabric}</td>
                            <td style={{padding:"9px 11px"}}>
                              <div style={{display:"flex",gap:6}}>
                                <Btn onClick={()=>startEdit(d)} style={{padding:"5px 10px",borderRadius:7,border:`1px solid ${P.border}`,background:P.surface,color:P.mauve,fontSize:11,fontWeight:600}}>Edit</Btn>
                                <Btn onClick={()=>handleDelete(d.id)} style={{padding:"5px 10px",borderRadius:7,border:"1px solid #f8c0cc",background:P.surface,color:P.rose,fontSize:11,fontWeight:600}}>Delete</Btn>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
              }
            </div>
          )}

          {/* ADD / EDIT */}
          {tab==="add"&&(
            <div style={{maxWidth:620}}>
              <h3 style={{margin:"0 0 22px",fontSize:18,color:P.text,fontFamily:"Georgia,serif"}}>{editId!==null?"Edit Design":"Add New Design"}</h3>
              <div style={{marginBottom:22}}>
                <label style={{fontSize:11,color:P.roseDark,fontWeight:700,display:"block",marginBottom:8,textTransform:"uppercase",letterSpacing:0.6}}>Design Image</label>
                <div style={{border:`2px dashed ${P.border}`,borderRadius:14,overflow:"hidden",background:P.bg,textAlign:"center",padding:imgPreview?0:28}}>
                  {imgPreview
                    ? <div style={{position:"relative"}}>
                        <img src={imgPreview} alt="preview" style={{width:"100%",maxHeight:260,objectFit:"cover",display:"block"}}/>
                        <Btn onClick={()=>{setImgPreview(null);setImgFile(null);}} style={{position:"absolute",top:10,right:10,background:"rgba(255,255,255,0.9)",borderRadius:"50%",width:30,height:30,fontSize:14,color:P.text}}>✕</Btn>
                      </div>
                    : <>
                        <div style={{fontSize:36,marginBottom:8,opacity:0.35}}>📷</div>
                        <div style={{fontSize:13,color:P.muted,marginBottom:12}}>Upload a design photo</div>
                        <label htmlFor="imgInput" style={{background:P.rose,color:"#fff",borderRadius:10,padding:"9px 20px",cursor:"pointer",fontSize:13,fontWeight:600}}>Choose Image</label>
                      </>
                  }
                  <input id="imgInput" type="file" accept="image/*" style={{display:"none"}} onChange={handleImage}/>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16}}>
                <div style={{gridColumn:"1/-1"}}>{fld("Design Title","title")}</div>
                {fld("Neck Type","neck",NECK_TYPES)}
                {fld("Sleeve Type","sleeve",SLEEVE_TYPES)}
                {fld("Occasion","occasion",OCCASIONS)}
                {fld("Work Type","work",WORK_TYPES)}
                {fld("Fabric","fabric",FABRICS)}
              </div>
              <label style={{display:"flex",alignItems:"center",gap:10,marginBottom:20,cursor:"pointer",fontSize:14,color:P.text}}>
                <input type="checkbox" checked={form.featured} onChange={e=>setForm(p=>({...p,featured:e.target.checked}))} style={{width:16,height:16,accentColor:P.rose}}/>
                Mark as Featured Design
              </label>
              <div style={{display:"flex",gap:12}}>
                <Btn onClick={()=>{resetForm();setTab("list");}} style={{flex:1,padding:"12px",borderRadius:12,border:`1.5px solid ${P.border}`,background:P.surface,color:P.muted,fontSize:14,fontWeight:600}}>Cancel</Btn>
                <Btn onClick={handlePublish} disabled={saving} style={{flex:2,padding:"12px",borderRadius:12,background:P.rose,color:"#fff",fontSize:14,fontWeight:700}}>
                  {saving?"Saving…":editId!==null?"💾 Save Changes":"🚀 Publish Design"}
                </Btn>
              </div>
            </div>
          )}

          {/* ANALYTICS */}
          {tab==="analytics"&&(
            <div>
              <h3 style={{margin:"0 0 20px",fontSize:18,color:P.text,fontFamily:"Georgia,serif"}}>Analytics Overview</h3>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:14,marginBottom:28}}>
                {[
                  {l:"Designs Live",  v:stats.total,    c:"#fbeef2",tc:P.roseDark,icon:"🎀"},
                  {l:"Total Views",   v:stats.views,    c:"#eef0fb",tc:"#3a40a0", icon:"👁"},
                  {l:"WA Leads",      v:stats.inquiries,c:"#e8f8ef",tc:"#1a7a40", icon:"💬"},
                  {l:"Conversion",    v:stats.views?((stats.inquiries/stats.views)*100).toFixed(1)+"%":"—",c:"#fdf3e8",tc:"#8a5000",icon:"📈"},
                ].map(s=>(
                  <div key={s.l} style={{background:s.c,borderRadius:14,padding:"18px 20px"}}>
                    <div style={{fontSize:26,marginBottom:8}}>{s.icon}</div>
                    <div style={{fontSize:26,fontWeight:800,color:s.tc,fontFamily:"Georgia,serif"}}>{s.v}</div>
                    <div style={{fontSize:11,color:s.tc,opacity:0.75,fontWeight:600,marginTop:4}}>{s.l}</div>
                  </div>
                ))}
              </div>
              {designs.length>0&&(
                <>
                  <h4 style={{color:P.roseDark,marginBottom:12,fontFamily:"Georgia,serif"}}>Top Designs by Inquiries</h4>
                  {[...designs].sort((a,b)=>b.inquiries-a.inquiries).slice(0,5).map((d,i)=>(
                    <div key={d.id} style={{display:"flex",alignItems:"center",gap:12,background:P.bg,borderRadius:12,padding:"11px 15px",marginBottom:8}}>
                      <div style={{fontSize:16,fontWeight:800,color:i===0?"#c9a000":P.mauve,minWidth:26}}>#{i+1}</div>
                      {d.img_url?<img src={d.img_url} style={{width:40,height:40,borderRadius:8,objectFit:"cover"}} alt=""/>
                        :<div style={{width:40,height:40,borderRadius:8,background:P.roseSoft,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,opacity:0.3}}>🎀</div>}
                      <div style={{flex:1}}>
                        <div style={{fontSize:13,fontWeight:700,color:P.text}}>{d.title}</div>
                        <div style={{fontSize:11,color:P.mauve}}>{d.occasion} · {d.work}</div>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontSize:14,fontWeight:800,color:"#1a7a40"}}>{d.inquiries} 💬</div>
                        <div style={{fontSize:11,color:P.mauve}}>{d.views} views</div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>

        {toast&&(
          <div style={{position:"sticky",bottom:0,background:toast.ok?P.roseDark:"#b0203a",color:"#fff",textAlign:"center",padding:"12px 20px",borderRadius:"0 0 20px 20px",fontSize:14,fontWeight:600}}>
            {toast.msg}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════════
export default function StyleNFashion() {
  const [designs,        setDesigns]        = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [admins,         setAdmins]         = useState(SEED_ADMINS);
  const [currentUser,    setCurrentUser]    = useState(null);
  const [showAuth,       setShowAuth]       = useState(false);
  const [showAdmin,      setShowAdmin]      = useState(false);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [searchQ,        setSearchQ]        = useState("");
  const [filters,        setFilters]        = useState({neck:"All",sleeve:"All",occasion:"All",work:"All",fabric:"All"});
  const [activeCat,      setActiveCat]      = useState("All");
  const [sortBy,         setSortBy]         = useState("newest");
  const [page,           setPage]           = useState(1);
  const PER_PAGE = 12;

  // ── Load designs from Supabase on mount ──────────────────────────────────────
  useEffect(()=>{
    async function loadDesigns() {
      setLoading(true);
      const { data, error } = await supabase
        .from("designs")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) setDesigns(data);
      setLoading(false);
    }
    loadDesigns();
  },[]);

  const handleAdminClick=()=>{ if(currentUser) setShowAdmin(true); else setShowAuth(true); };
  const handleLoginSuccess=(user)=>{ setCurrentUser(user); setShowAuth(false); setShowAdmin(true); };
  const handleLogout=()=>{ setCurrentUser(null); setShowAdmin(false); };

  const filtered=useMemo(()=>{
    let r=designs;
    if(searchQ){const q=searchQ.toLowerCase();r=r.filter(d=>[d.title,d.neck,d.sleeve,d.occasion,d.work,d.fabric].some(v=>v&&v.toLowerCase().includes(q)));}
    if(filters.neck!=="All")      r=r.filter(d=>d.neck===filters.neck);
    if(filters.sleeve!=="All")    r=r.filter(d=>d.sleeve===filters.sleeve);
    if(filters.occasion!=="All")  r=r.filter(d=>d.occasion===filters.occasion);
    if(filters.work!=="All")      r=r.filter(d=>d.work===filters.work);
    if(filters.fabric!=="All")    r=r.filter(d=>d.fabric===filters.fabric);
    if(activeCat!=="All")         r=r.filter(d=>d.occasion===activeCat);
    if(sortBy==="newest")   r=[...r].sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));
    if(sortBy==="popular")  r=[...r].sort((a,b)=>b.views-a.views);
    if(sortBy==="inquiries")r=[...r].sort((a,b)=>b.inquiries-a.inquiries);
    return r;
  },[designs,searchQ,filters,activeCat,sortBy]);

  const paged=filtered.slice(0,page*PER_PAGE);
  const resetFilters=(f)=>{setFilters(f);setPage(1);};
  const cats=["All","Bridal","Wedding","Festival","Party","Daily Wear"];

  return (
    <div style={{minHeight:"100vh",background:P.bg,fontFamily:"'Segoe UI',sans-serif"}}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
        @keyframes spin{to{transform:rotate(360deg)}}
        *{box-sizing:border-box} a{text-decoration:none}
        ::-webkit-scrollbar{width:5px} ::-webkit-scrollbar-thumb{background:#e0b0c0;border-radius:3px}
      `}</style>

      {/* HEADER */}
      <header style={{background:P.surface,borderBottom:`1px solid ${P.border}`,position:"sticky",top:0,zIndex:500,boxShadow:"0 2px 12px rgba(180,80,100,0.07)"}}>
        <div style={{maxWidth:1200,margin:"0 auto",padding:"0 20px",display:"flex",alignItems:"center",justifyContent:"space-between",height:64}}>
          <div>
            <div style={{fontSize:21,fontFamily:"Georgia,serif",color:P.roseDark,fontWeight:700}}>✿ Style <em>N</em> Fashion</div>
            <div style={{fontSize:9,color:P.mauve,letterSpacing:2.5,textTransform:"uppercase",fontWeight:600}}>Boutique · Blouse Design Archive</div>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <a href={wa("Hello! I visited Style N Fashion and want to inquire about custom blouse stitching.")} target="_blank" rel="noopener noreferrer"
              style={{background:P.whatsapp,color:"#fff",borderRadius:10,padding:"8px 15px",fontSize:13,fontWeight:700,display:"flex",alignItems:"center",gap:6}}>
              💬 WhatsApp
            </a>
            <Btn onClick={handleAdminClick}
              style={{background:currentUser?P.roseSoft:P.bg,border:`1.5px solid ${P.border}`,borderRadius:10,padding:"8px 14px",fontSize:12,color:P.roseDark,fontWeight:700,display:"flex",alignItems:"center",gap:6}}>
              {currentUser
                ? <><span style={{width:20,height:20,borderRadius:"50%",background:P.rose,color:"#fff",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700}}>{currentUser.name[0]}</span>{currentUser.name}</>
                : "⚙ Admin"
              }
            </Btn>
          </div>
        </div>
      </header>

      {/* HERO */}
      <div style={{background:P.heroBg,padding:"46px 20px 52px",textAlign:"center",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle at 15% 60%, rgba(255,220,230,0.12) 0%, transparent 50%)"}}/>
        <div style={{position:"relative",maxWidth:680,margin:"0 auto"}}>
          <div style={{fontSize:10,color:"rgba(255,220,230,0.85)",letterSpacing:3,fontWeight:700,textTransform:"uppercase",marginBottom:10}}>Blouse Design Inspiration</div>
          <h1 style={{fontSize:"clamp(26px,5vw,46px)",fontFamily:"Georgia,serif",color:"#fff",margin:"0 0 14px",lineHeight:1.2,fontWeight:700}}>
            Find Your Perfect<br/><span style={{color:"#ffd6e0"}}>Blouse Design</span>
          </h1>
          <p style={{color:"rgba(255,235,240,0.85)",fontSize:15,margin:"0 0 28px",lineHeight:1.65}}>
            Curated designs for bridal, festival &amp; daily wear blouses.<br/>Get yours stitched by expert tailor Suresh.
          </p>
          <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
            <a href={wa("Hello! I want to book a free design consultation with Suresh.")} target="_blank" rel="noopener noreferrer"
              style={{background:P.whatsapp,color:"#fff",borderRadius:14,padding:"13px 26px",fontSize:15,fontWeight:700,display:"flex",alignItems:"center",gap:8}}>
              💬 Book Free Consultation
            </a>
            <Btn onClick={()=>document.getElementById("gallery").scrollIntoView({behavior:"smooth"})}
              style={{background:"rgba(255,255,255,0.15)",color:"#fff",border:"1.5px solid rgba(255,255,255,0.3)",borderRadius:14,padding:"13px 26px",fontSize:15,fontWeight:600}}>
              Browse Designs ↓
            </Btn>
          </div>
        </div>
      </div>

      {/* CATEGORY PILLS */}
      <div style={{background:P.surface,borderBottom:`1px solid ${P.border}`,overflowX:"auto"}}>
        <div style={{maxWidth:1200,margin:"0 auto",padding:"11px 20px",display:"flex",gap:8}}>
          {cats.map(cat=>(
            <Btn key={cat} onClick={()=>{setActiveCat(cat);setPage(1);}}
              style={{padding:"7px 18px",borderRadius:24,border:`1.5px solid ${activeCat===cat?P.rose:P.border}`,background:activeCat===cat?P.rose:P.surface,color:activeCat===cat?"#fff":P.muted,fontSize:13,fontWeight:600,whiteSpace:"nowrap",transition:"all 0.2s"}}>
              {cat}
            </Btn>
          ))}
        </div>
      </div>

      {/* GALLERY */}
      <main id="gallery" style={{maxWidth:1200,margin:"0 auto",padding:"26px 20px"}}>
        <SearchPanel filters={filters} setFilters={resetFilters} searchQ={searchQ} setSearchQ={q=>{setSearchQ(q);setPage(1);}} total={designs.length} found={filtered.length} hasDesigns={designs.length>0}/>

        {/* Loading spinner */}
        {loading && (
          <div style={{textAlign:"center",padding:"60px 20px"}}>
            <div style={{width:40,height:40,borderRadius:"50%",border:`3px solid ${P.roseSoft}`,borderTopColor:P.rose,animation:"spin 0.8s linear infinite",margin:"0 auto 16px"}}/>
            <div style={{fontSize:14,color:P.muted}}>Loading designs…</div>
          </div>
        )}

        {!loading && designs.length>0 && (
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18,flexWrap:"wrap",gap:10}}>
            <div style={{fontSize:13,color:P.muted}}>
              {filtered.length===0?"No designs match":""}
              {filtered.length>0&&<><b style={{color:P.text}}>{filtered.length}</b> design{filtered.length!==1?"s":""} found</>}
            </div>
            <select value={sortBy} onChange={e=>setSortBy(e.target.value)}
              style={{padding:"7px 13px",borderRadius:10,border:`1.5px solid ${P.border}`,fontSize:13,color:P.text,background:P.surface,cursor:"pointer",fontFamily:"inherit"}}>
              <option value="newest">Newest First</option>
              <option value="popular">Most Viewed</option>
              <option value="inquiries">Most Inquired</option>
            </select>
          </div>
        )}

        {!loading && designs.length===0 && (
          <div style={{textAlign:"center",padding:"72px 20px",color:P.muted}}>
            <div style={{fontSize:64,marginBottom:16,opacity:0.4}}>🎀</div>
            <div style={{fontSize:22,fontFamily:"Georgia,serif",color:P.roseDark,marginBottom:10,fontWeight:700}}>Designs Coming Soon</div>
            <div style={{fontSize:15,lineHeight:1.7,maxWidth:380,margin:"0 auto 28px"}}>Our collection is being curated. Meanwhile reach out on WhatsApp — Suresh will help you find the perfect design.</div>
            <a href={wa("Hello! I visited Style N Fashion and want to inquire about custom blouse stitching.")} target="_blank" rel="noopener noreferrer"
              style={{display:"inline-flex",alignItems:"center",gap:8,background:P.whatsapp,color:"#fff",borderRadius:14,padding:"13px 28px",fontSize:15,fontWeight:700}}>
              💬 Chat with Suresh
            </a>
          </div>
        )}

        {!loading && filtered.length===0 && designs.length>0 && (
          <div style={{textAlign:"center",padding:"60px 20px",color:P.mauve}}>
            <div style={{fontSize:44,marginBottom:12,opacity:0.35}}>🔍</div>
            <div style={{fontSize:17,fontFamily:"Georgia,serif",color:P.roseDark,marginBottom:8}}>No designs found</div>
            <div style={{fontSize:14,marginBottom:20}}>Try different filters or clear all</div>
            <Btn onClick={()=>{setSearchQ("");resetFilters({neck:"All",sleeve:"All",occasion:"All",work:"All",fabric:"All"});}}
              style={{background:P.roseSoft,color:P.rose,borderRadius:10,padding:"10px 22px",fontSize:13,fontWeight:700,border:`1.5px solid ${P.border}`}}>
              Clear All Filters
            </Btn>
          </div>
        )}

        {!loading && paged.length>0 && (
          <>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:18}}>
              {paged.map((d,i)=>(
                <div key={d.id} style={{animation:"fadeUp 0.35s ease both",animationDelay:`${(i%PER_PAGE)*35}ms`}}>
                  <DesignCard design={d} onClick={setSelectedDesign}/>
                </div>
              ))}
            </div>
            {paged.length<filtered.length&&(
              <div style={{textAlign:"center",marginTop:32}}>
                <Btn onClick={()=>setPage(p=>p+1)} style={{padding:"13px 40px",borderRadius:14,border:`1.5px solid ${P.border}`,background:P.surface,color:P.roseDark,fontSize:15,fontWeight:600}}>
                  Load More ({filtered.length-paged.length} remaining)
                </Btn>
              </div>
            )}
          </>
        )}
      </main>

      {/* WHY US */}
      <section style={{background:P.surface,borderTop:`1px solid ${P.border}`,padding:"44px 20px"}}>
        <div style={{maxWidth:1000,margin:"0 auto"}}>
          <h2 style={{fontFamily:"Georgia,serif",color:P.roseDark,fontSize:24,textAlign:"center",marginBottom:6}}>Why Choose Style N Fashion?</h2>
          <p style={{color:P.muted,textAlign:"center",marginBottom:36,fontSize:14}}>Expert stitching · Perfect fit · On-time delivery</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))",gap:18}}>
            {[{icon:"✂️",t:"Expert Tailoring",d:"Suresh brings 15+ years of expertise in bridal and designer blouse stitching"},
              {icon:"🪡",t:"Maggam & Aari Work",d:"Intricate hand embroidery by skilled artisans for every occasion"},
              {icon:"📏",t:"Perfect Fit Guaranteed",d:"Custom measurements and trial fittings included with every blouse"},
              {icon:"💬",t:"WhatsApp Booking",d:"Easy inquiry and appointment booking directly with Suresh"},
            ].map(f=>(
              <div key={f.t} style={{background:P.bg,borderRadius:14,padding:"20px 22px",border:`1px solid ${P.border}`}}>
                <div style={{fontSize:26,marginBottom:10}}>{f.icon}</div>
                <div style={{fontSize:14,fontWeight:700,color:P.text,marginBottom:6,fontFamily:"Georgia,serif"}}>{f.t}</div>
                <div style={{fontSize:13,color:P.muted,lineHeight:1.6}}>{f.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FLOATING WHATSAPP */}
      <a href={wa("Hello! I found Style N Fashion and want to inquire about blouse stitching.")} target="_blank" rel="noopener noreferrer"
        style={{position:"fixed",bottom:22,right:22,background:P.whatsapp,color:"#fff",borderRadius:"50%",width:54,height:54,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,boxShadow:"0 4px 18px rgba(37,211,102,0.45)",zIndex:900}}>
        💬
      </a>

      {/* FOOTER */}
      <footer style={{background:"#2a0d1a",color:"rgba(255,220,230,0.75)",padding:"26px 20px",textAlign:"center"}}>
        <div style={{maxWidth:900,margin:"0 auto"}}>
          <div style={{fontSize:17,fontFamily:"Georgia,serif",color:"#ffd6e0",marginBottom:5}}>✿ Style N Fashion</div>
          <div style={{fontSize:12,marginBottom:12}}>Custom Blouse Stitching · WhatsApp: +91 94486 86569 · Suresh</div>
          <div style={{display:"flex",justifyContent:"center",gap:20,flexWrap:"wrap",fontSize:12,marginBottom:14}}>
            {["Bridal Blouses","Maggam Work","Aari Work","Festival Wear","Custom Designs"].map(l=>(
              <span key={l} style={{color:"#e0a0b8",cursor:"pointer"}}>{l}</span>
            ))}
          </div>
          <div style={{fontSize:11,color:"rgba(255,220,230,0.3)"}}>© 2025 Style N Fashion · Design Archive</div>
        </div>
      </footer>

      {/* MODALS */}
      {selectedDesign&&<DesignModal design={selectedDesign} designs={designs} onClose={()=>setSelectedDesign(null)} onSelect={setSelectedDesign}/>}
      {showAuth&&<AuthModal admins={admins} setAdmins={setAdmins} onSuccess={handleLoginSuccess} onClose={()=>setShowAuth(false)}/>}
      {showAdmin&&currentUser&&<AdminPanel designs={designs} setDesigns={setDesigns} currentUser={currentUser} onLogout={handleLogout} onClose={()=>setShowAdmin(false)}/>}
    </div>
  );
}