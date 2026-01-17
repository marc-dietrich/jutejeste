import { type MouseEvent, useEffect, useMemo, useState } from 'react'
import { Instagram } from 'lucide-react'
import {
  about,
  events,
  impressum,
  navLinks,
  siteMeta,
  socials,
  spacerImage,
  support,
} from './content'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Toaster } from '@/components/ui/toaster'
import { useToast } from '@/hooks/use-toast'

function useActiveSection(ids: string[]) {
  const stableIds = useMemo(() => ids, [ids])
  const [active, setActive] = useState(stableIds[0] ?? '')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(`#${entry.target.id}`)
          }
        })
      },
      { threshold: 0.35 },
    )

    stableIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [stableIds])

  return active
}

function App() {
  const { toast } = useToast()
  const sectionIds = navLinks.map((link) => link.href.replace('#', ''))
  const activeSection = useActiveSection(sectionIds)
  const [navSolid, setNavSolid] = useState(false)

  useEffect(() => {
    const handler = () => setNavSolid(window.scrollY > 48)
    handler()
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const handleNavClick = (href: string) => (event: MouseEvent) => {
    event.preventDefault()
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <div className="sticky top-0 z-30 border-b border-border/50 bg-background/70 backdrop-blur-sm">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
          <div className="flex items-center gap-3">
            <img
              src="/images/jutejesteTitleBadge.webp"
              alt="Jute Jeste"
              className="h-12 w-12 rounded-full border border-border/70 object-cover"
            />
            <div className="leading-tight text-left">
              <div className="font-display text-xl">{siteMeta.title}</div>
              <div className="text-sm text-muted-foreground">{siteMeta.tagline}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href
              return (
                <Button
                  key={link.href}
                  variant={isActive ? 'default' : 'ghost'}
                  onClick={handleNavClick(link.href)}
                  className={`rounded-full px-4 text-sm font-semibold ${
                    navSolid ? 'shadow-sm' : ''
                  }`}
                >
                  {link.label}
                </Button>
              )
            })}

            <Button
              variant="secondary"
              onClick={() => toast({ description: support.toastMessage })}
              className="rounded-full px-4 text-sm font-semibold"
            >
              Mitglied werden
            </Button>
          </div>
        </nav>
      </div>

      <main className="mx-auto max-w-5xl px-5 pb-16 pt-10">
        <header className="flex flex-col items-center gap-4 rounded-2xl bg-primary/5 px-6 pb-10 pt-14 text-center shadow-sm">
          <img
            src="/images/jutejesteTitleBadge.webp"
            alt="Jute Jeste Logo"
            className="h-32 w-32 rounded-full border-[6px] border-primary/80 object-cover shadow"
          />
          <h1 className="font-display text-4xl sm:text-5xl text-primary">{siteMeta.title}</h1>
          <p className="text-lg text-foreground/80">{siteMeta.tagline}</p>
        </header>

        <section
          id="intro"
          className="mt-16 flex flex-col-reverse items-center gap-10 rounded-2xl border border-white/40 bg-white/80 px-8 py-12 shadow-md sm:flex-row"
        >
          <div className="flex-1 space-y-4 text-left">
            <h2 className="font-display text-3xl text-primary">{about.heading}</h2>
            <p className="text-lg leading-relaxed text-foreground/90">{about.body}</p>
          </div>
          <div className="flex flex-1 justify-center sm:justify-end">
            <div className="rounded-full border border-white/60 p-2 shadow">
              <img
                src={about.image}
                alt="Über Uns"
                className="h-64 w-64 rounded-full object-cover sm:h-72 sm:w-72"
              />
            </div>
          </div>
        </section>

        <section id="events" className="mt-16 space-y-8">
          <div className="flex flex-col gap-2 text-center">
            <h2 className="font-display text-3xl text-primary">{events.heading}</h2>
            <p className="text-foreground/75">Aktuelle und kommende Highlights.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {events.tiles.map((tile, idx) => {
              const content = (
                <Card className="group flex w-[280px] flex-col items-center gap-4 rounded-2xl border border-border/60 bg-white/85 p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                  <div className="flex h-40 w-40 items-center justify-center rounded-full border-8 border-text/90 bg-background p-1">
                    <img
                      src={tile.image}
                      alt={tile.title}
                      className="h-full w-full rounded-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{tile.title}</h3>
                </Card>
              )

              if (idx === 2) {
                return (
                  <Popover key={tile.title}>
                    <PopoverTrigger asChild>{content}</PopoverTrigger>
                    <PopoverContent className="w-[min(90vw,720px)] p-0 shadow-lg">
                      <img
                        src={events.overviewImage}
                        alt="Alle Events"
                        className="h-full w-full rounded-xl object-contain"
                      />
                    </PopoverContent>
                  </Popover>
                )
              }

              return <div key={tile.title}>{content}</div>
            })}
          </div>
        </section>

        <section className="mt-16 overflow-hidden rounded-2xl border border-border/40 bg-white/70 shadow-md">
          <img
            src={spacerImage}
            alt="Event Impression"
            className="h-full w-full object-cover"
          />
        </section>

        <section
          id="support"
          className="mt-16 space-y-8 rounded-2xl border border-white/40 bg-white/80 px-8 py-12 shadow-md"
        >
          <div className="text-center">
            <h2 className="font-display text-3xl text-primary">{support.heading}</h2>
            <p className="mt-3 text-lg leading-relaxed text-foreground/90">{support.body}</p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="default" className="rounded-full px-5">
                  Wie funktioniert's?
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[min(90vw,700px)] space-y-4 border border-border/60 bg-white p-4 shadow-lg">
                <img
                  src={support.howToImage}
                  alt="Wie funktioniert's"
                  className="w-full rounded-lg object-contain"
                />
                <ul className="space-y-2 text-sm leading-relaxed text-foreground/90">
                  {support.howToText.map((line) => (
                    <li key={line}>• {line}</li>
                  ))}
                </ul>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="rounded-full px-5">
                  Unsere Supporter
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[min(90vw,700px)] p-2 shadow-lg">
                <img
                  src={support.donatorsImage}
                  alt="Supporter"
                  className="w-full rounded-lg object-contain"
                />
              </PopoverContent>
            </Popover>

            <Button asChild variant="secondary" className="rounded-full px-5">
              <a href={support.statutePdf} download>
                Für Interessierte
              </a>
            </Button>

            <Button
              variant="ghost"
              className="rounded-full px-5"
              onClick={() => toast({ description: support.toastMessage })}
            >
              Mitglied werden
            </Button>
          </div>
        </section>

        <footer className="mt-16 rounded-2xl border border-border/60 bg-white/80 p-8 shadow-md">
          <h2 className="text-center font-display text-3xl text-primary">Impressum</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {impressum.map((item) => (
              <div key={item.title} className="space-y-2 text-foreground/90">
                <h3 className="font-semibold text-primary underline">{item.title}</h3>
                <div className="space-y-1 text-sm font-semibold">
                  {item.lines.map((line) => {
                    const isMail = item.mailto && line.includes(item.mailto)
                    return isMail ? (
                      <div key={line}>
                        <a
                          className="border-b border-dotted border-foreground/60"
                          href={`mailto:${item.mailto}`}
                        >
                          {line}
                        </a>
                      </div>
                    ) : (
                      <div key={line}>{line}</div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center gap-4">
            {socials.map((social) => (
              <a
                key={social.href}
                href={social.href}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-primary transition hover:bg-primary hover:text-primary-foreground"
                aria-label={social.label}
              >
                <Instagram className="h-5 w-5" />
              </a>
            ))}
          </div>
        </footer>
      </main>

      <Toaster />
    </div>
  )
}

export default App
