import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { contactEmail, releases, socials, videos } from './content'

const routes = ['home','music','videos','artist','about','explore','contact']
const currentYear = new Date().getFullYear()
const getRoute = () => {
  const hash = window.location.hash.replace(/^#\/?/, '')
  const [page] = hash.split('/')
  return routes.includes(page) ? page : 'home'
}

function Logo({compact=false}) {
  return <span className={`logo-mark ${compact?'compact':''}`}><span className="logo-ring"/><span className="logo-core">O</span></span>
}

function Header({route,navigate}) {
  const [open,setOpen] = useState(false)
  const labels={home:'Home',music:'Music',videos:'Videos',artist:'Artist',about:'About',explore:'Explore',contact:'Contact'}
  const closeAndNavigate=(item)=>{setOpen(false);navigate(item)}
  return <header className="site-header">
    <button className="brand" onClick={()=>navigate('home')} aria-label="Oopy Studios home"><Logo compact/><span>OOPY STUDIOS</span></button>
    <nav className={open?'nav open':'nav'} aria-label="Main navigation">
      {routes.map(item=><button key={item} className={route===item?'active':''} onClick={()=>closeAndNavigate(item)}>{labels[item]}</button>)}
    </nav>
    <button className={`menu-button ${open?'open':''}`} onClick={()=>setOpen(!open)} aria-expanded={open} aria-label="Toggle navigation"><span/><span/></button>
  </header>
}

function Footer({navigate}) {
  return <footer>
    <button className="brand footer-brand" onClick={()=>navigate('home')}><Logo compact/><span>OOPY STUDIOS</span></button>
    <p>Independent music, moving image and sonic worlds.</p>
    <div className="footer-links"><a href={socials.youtube} target="_blank" rel="noreferrer">YouTube ↗</a><a href={socials.instagram} target="_blank" rel="noreferrer">Instagram ↗</a><button onClick={()=>navigate('contact')}>Contact</button></div>
    <small>© {currentYear} Oopy Studios</small>
  </footer>
}

function PageHeading({eyebrow,title,copy}) {
  return <header className="page-heading"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1>{copy&&<p className="heading-copy">{copy}</p>}</header>
}

function Home({navigate}) {
  return <>
    <section className="hero">
      <div className="hero-grain"/>
      <div className="orbital-stage" aria-hidden="true"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="emblem"><span>O</span><i/></div><div className="floating-disc disc-one"/><div className="floating-disc disc-two"/></div>
      <div className="hero-copy"><p className="eyebrow">Independent sound & vision</p><h1>OOPY<br/><em>STUDIOS</em></h1><p className="hero-line">Music for elsewhere.</p><div className="hero-actions"><a className="button primary" href={socials.youtube} target="_blank" rel="noreferrer">Watch on YouTube <span>↗</span></a><button className="button ghost" onClick={()=>navigate('music')}>Explore releases <span>↓</span></button></div></div>
      <div className="hero-index"><span>01</span><i/><span>07</span></div>
    </section>
    <section className="featured-strip">
      <div className="featured-art"><img src={releases[0].artwork} alt="Midnight Frequency artwork"/><button onClick={()=>navigate(`music/${releases[0].id}`)} aria-label="View featured release">↗</button></div>
      <div><p className="eyebrow">Featured release · 2026</p><h2>{releases[0].title}</h2><p>{releases[0].description}</p><button className="text-link" onClick={()=>navigate(`music/${releases[0].id}`)}>Discover release →</button></div>
    </section>
    <section className="editorial-section">
      <div className="section-title"><p className="eyebrow">Selected releases</p><button onClick={()=>navigate('music')}>View all →</button></div>
      <div className="release-grid">{releases.slice(1).map((release,index)=><article className="release-card" key={release.id} onClick={()=>navigate(`music/${release.id}`)}><div className="cover"><img src={release.artwork} alt={`${release.title} artwork`} loading="lazy"/><span>0{index+2}</span></div><h3>{release.title}</h3><p>{release.type} · {release.year}</p></article>)}</div>
    </section>
    <section className="video-feature"><div className="video-frame" onClick={()=>navigate('videos')}><img src={videos[0].image} alt="" loading="lazy"/><button aria-label="Play featured video">▶</button></div><div className="video-feature-copy"><p className="eyebrow">Latest from YouTube</p><h2>Inside the<br/><em>studio</em></h2><button className="text-link" onClick={()=>navigate('videos')}>Watch the films →</button></div></section>
    <section className="artist-teaser"><div className="artist-portrait"><img src="https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=1100&q=85" alt="Artist portrait placeholder" loading="lazy"/></div><div><p className="eyebrow">The artist</p><h2>Prasiddha<br/><em>Subedi</em></h2><p>Music, moving image and a visual language shaped through curiosity.</p><button className="text-link" onClick={()=>navigate('artist')}>Enter the artist world →</button></div></section>
  </>
}

function Music({navigate,routeParts}) {
  const [query,setQuery]=useState('')
  const [filter,setFilter]=useState('All')
  const filtered=useMemo(()=>releases.filter(item=>(filter==='All'||item.type===filter)&&item.title.toLowerCase().includes(query.toLowerCase())),[query,filter])
  const release=releases.find(item=>item.id===routeParts[1])
  if(release) return <ReleaseDetail release={release} navigate={navigate}/>
  return <main className="inner-page music-page">
    <PageHeading eyebrow="The catalogue" title="Music" copy="A growing collection of releases, experiments and visual sound."/>
    <div className="catalog-controls"><label>Search <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Title"/></label><div className="filters">{['All','Single','EP'].map(item=><button key={item} className={filter===item?'active':''} onClick={()=>setFilter(item)}>{item}</button>)}</div></div>
    <div className="catalog-grid">{filtered.map((item,index)=><article className="catalog-card" key={item.id} onClick={()=>navigate(`music/${item.id}`)}><div className="vinyl-wrap"><div className="vinyl"/><img src={item.artwork} alt={`${item.title} cover`} loading="lazy"/></div><div><p>0{index+1} / {item.type}</p><h2>{item.title}</h2><span>{item.year} · {item.mood}</span></div></article>)}</div>
    {filtered.length===0&&<p className="empty-state">No releases match this search.</p>}
  </main>
}

function ReleaseDetail({release,navigate}) {
  return <main className="inner-page release-detail"><button className="back-link" onClick={()=>navigate('music')}>← Back to music</button>
    <div className="release-hero"><div className="release-art"><img src={release.artwork} alt={`${release.title} artwork`}/><div className="large-vinyl"/></div><div className="release-copy"><p className="eyebrow">{release.type} · {release.year}</p><h1>{release.title}</h1><p className="artist-name">Prasiddha Subedi</p><p>{release.description}</p><p className="release-date">{release.date}</p><div className="release-actions"><a className="button primary" href={release.video} target="_blank" rel="noreferrer">Watch video ↗</a><a className="button ghost" href={socials.spotify} target="_blank" rel="noreferrer">Streaming links ↗</a></div></div></div>
    <section className="release-notes"><div><p className="eyebrow">About</p><p>{release.description}</p></div><div><p className="eyebrow">Credits</p><p>Artist: Prasiddha Subedi<br/>Release details to be updated.</p></div></section>
  </main>
}

function Videos() {
  const [query,setQuery]=useState('')
  const [category,setCategory]=useState('All')
  const filtered=videos.filter(video=>(category==='All'||video.category===category)&&video.title.toLowerCase().includes(query.toLowerCase()))
  return <main className="inner-page videos-page">
    <PageHeading eyebrow="The screen" title="Videos" copy="Films, live moments and visual studies from the Oopy Studios world."/>
    <button className="featured-video" onClick={()=>window.open(videos[0].url,'_blank','noopener,noreferrer')}><img src={videos[0].image} alt="" loading="lazy"/><span className="play">▶</span><div><p>Featured film</p><h2>{videos[0].title}</h2></div></button>
    <div className="catalog-controls"><label>Search <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Video title"/></label><div className="filters">{['All','Studio','Visual','Live'].map(item=><button key={item} className={category===item?'active':''} onClick={()=>setCategory(item)}>{item}</button>)}</div></div>
    <div className="video-grid">{filtered.map(video=><article key={video.id}><button onClick={()=>window.open(video.url,'_blank','noopener,noreferrer')}><img src={video.image} alt={`${video.title} thumbnail`} loading="lazy"/><span>▶</span></button><p>{video.category} · {video.date}</p><h3>{video.title}</h3></article>)}</div>
  </main>
}

function Artist({navigate}) {
  return <main className="inner-page artist-page">
    <PageHeading eyebrow="The artist" title="Prasiddha Subedi"/>
    <section className="artist-layout"><div className="artist-main-image"><img src="https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=1400&q=85" alt="Artist portrait placeholder" loading="lazy"/><p>Prasiddha Subedi</p></div><div className="artist-bio"><p className="eyebrow">Profile</p><h2>Making work that lives between sound and image.</h2><p>Prasiddha Subedi is the artist behind Oopy Studios—a creative practice centred on music, visual storytelling and independent experimentation.</p><div className="platform-list"><a href={socials.youtube} target="_blank" rel="noreferrer">YouTube <span>↗</span></a><a href={socials.spotify} target="_blank" rel="noreferrer">Spotify <span>↗</span></a><a href={socials.apple} target="_blank" rel="noreferrer">Apple Music <span>↗</span></a><a href={socials.instagram} target="_blank" rel="noreferrer">Instagram <span>↗</span></a></div></div></section>
    <section className="selected-works"><div className="section-title"><p className="eyebrow">Selected works</p><button onClick={()=>navigate('music')}>Discography →</button></div><div>{releases.slice(0,3).map(release=><button key={release.id} onClick={()=>navigate(`music/${release.id}`)}><img src={release.artwork} alt="" loading="lazy"/><span>{release.title}</span></button>)}</div></section>
  </main>
}

function About() {
  return <main className="inner-page about-page">
    <PageHeading eyebrow="The studio" title="About Oopy" copy="A creative identity built around independent music and the worlds it can open."/>
    <section className="manifesto"><p className="eyebrow">01 / What we represent</p><h2>Oopy Studios is a space for sound, moving image and ideas that do not need to explain themselves before they begin.</h2></section>
    <section className="about-grid"><div><img src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=85" alt="Recording studio" loading="lazy"/></div><article><p className="eyebrow">Creative philosophy</p><h3>Listen closely.</h3><p>We begin with feeling. Texture, tone and atmosphere are treated as story; every release is an invitation to notice something more deeply.</p></article><article><p className="eyebrow">Artistic vision</p><h3>Make it personal.</h3><p>Our work is independent by nature—personal in scale, cinematic in ambition and always open to surprise.</p></article></section>
  </main>
}

function Explore() {
  const [active,setActive]=useState(null)
  const objects=[
    {name:'Resonance',className:'object-a',text:'A low frequency can change the shape of a room.'},
    {name:'Frame',className:'object-b',text:'Every visual study begins as a sequence of light.'},
    {name:'Memory',className:'object-c',text:'Music remembers what words leave behind.'},
  ]
  return <main className="explore-page">
    <PageHeading eyebrow="Experimental world" title="Explore"/>
    <div className="universe" onMouseMove={(e)=>e.currentTarget.style.setProperty('--mx',`${(e.clientX/window.innerWidth-.5)*12}deg`)}>
      <div className="universe-glow"/>
      {objects.map((object,index)=><button key={object.name} className={`floating-object ${object.className}`} onClick={()=>setActive(index===active?null:index)} aria-label={`Explore ${object.name}`}><span>{String(index+1).padStart(2,'0')}</span><strong>{object.name}</strong></button>)}
      {active!==null&&<aside className="discovery"><button onClick={()=>setActive(null)} aria-label="Close">×</button><p className="eyebrow">Hidden detail · 0{active+1}</p><h2>{objects[active].name}</h2><p>{objects[active].text}</p></aside>}
    </div>
  </main>
}

function Contact() {
  const [status,setStatus]=useState('')
  function submit(e){
    e.preventDefault()
    const data=new FormData(e.currentTarget)
    const subject=encodeURIComponent(data.get('subject'))
    const body=encodeURIComponent(`Name: ${data.get('name')}\nEmail: ${data.get('email')}\n\n${data.get('message')}`)
    setStatus('Opening your email app…')
    window.location.href=`mailto:${contactEmail}?subject=${subject}&body=${body}`
  }
  return <main className="inner-page contact-page">
    <PageHeading eyebrow="Get in touch" title="Contact" copy="For music, visual projects and creative collaborations."/>
    <div className="contact-layout"><form onSubmit={submit}>
      <label>Name<input name="name" required placeholder="Your name"/></label>
      <label>Email<input name="email" type="email" required placeholder="you@example.com"/></label>
      <label>Subject<input name="subject" required placeholder="What is this about?"/></label>
      <label>Message<textarea name="message" required rows="6" placeholder="Tell us a little about the project."/></label>
      <button className="button primary" type="submit">Send message <span>↗</span></button>
      {status&&<p className="form-status" role="status">{status}</p>}
    </form><aside><p className="eyebrow">Direct</p>{contactEmail?<a href={`mailto:${contactEmail}`}>{contactEmail}</a>:<p>Email address setup required.</p>}<p className="eyebrow">Social</p><a href={socials.youtube} target="_blank" rel="noreferrer">YouTube ↗</a><a href={socials.instagram} target="_blank" rel="noreferrer">Instagram ↗</a></aside></div>
  </main>
}

function App() {
  const [route,setRoute]=useState(getRoute())
  const [loading,setLoading]=useState(true)
  useEffect(()=>{
    const onHash=()=>{setRoute(getRoute());window.scrollTo({top:0,behavior:'instant'})}
    window.addEventListener('hashchange',onHash)
    const timer=setTimeout(()=>setLoading(false),900)
    return()=>{window.removeEventListener('hashchange',onHash);clearTimeout(timer)}
  },[])
  const navigate=(page)=>{window.location.hash=`/${page}`;setRoute(page)}
  const hashParts=window.location.hash.replace(/^#\/?/,'').split('/')
  const routeParts=hashParts[0]?hashParts:['home']
  let page
  if(route==='music') page=<Music navigate={navigate} routeParts={routeParts}/>
  else if(route==='videos') page=<Videos navigate={navigate}/>
  else if(route==='artist') page=<Artist navigate={navigate}/>
  else if(route==='about') page=<About/>
  else if(route==='explore') page=<Explore/>
  else if(route==='contact') page=<Contact/>
  else page=<Home navigate={navigate}/>
  return <>
    {loading&&<div className="loader" onClick={()=>setLoading(false)}><Logo/><p>OOPY STUDIOS</p><div className="loader-line"/></div>}
    <Header route={route} navigate={navigate}/>
    <main className="route-wrap" key={route}>{page}</main>
    <Footer navigate={navigate}/>
  </>
}

export default App
