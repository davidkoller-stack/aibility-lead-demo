import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Check,
  Flame,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode, RefObject } from 'react'
import heroImage from './assets/dragon-editorial-hero.png'

type BranchId = 'storytelling' | 'visual' | 'video' | 'creative_workflow' | 'team_workflow'
type Level = 'AI Explorer' | 'L1 Operator' | 'L2 Builder' | 'L3 Transformer'

type Option = {
  label: string
  score: number
  barrier?: string
  format?: string
  signal?: string
}

type Question = {
  id: string
  text: string
  options: Option[]
}

type Branch = {
  id: BranchId
  label: string
  intro: string
  questions: Question[]
}

type Answer = {
  questionId: string
  label: string
  score: number
  barrier?: string
  format?: string
  signal?: string
}

type Result = {
  segment: string
  level: Level
  growthEdge: string
  product: string
  productDetail: string
  rationale: string
  barrier: string
  angle: string
}

const firstQuestion = {
  text: 'Co byste si s AI chtěli vyzkoušet jako první?',
  options: [
    { branch: 'storytelling' as BranchId, label: 'Napsat vlastní fantasy scénu nebo příběh' },
    { branch: 'visual' as BranchId, label: 'Vytvořit postavu, erb nebo vizuální koncept' },
    { branch: 'video' as BranchId, label: 'Připravit teaser, trailer nebo video koncept' },
    {
      branch: 'creative_workflow' as BranchId,
      label: 'Proměnit fan nápad v opakovatelný kreativní workflow',
    },
    {
      branch: 'team_workflow' as BranchId,
      label: 'Zjistit, jak by podobný AI postup využil celý tým',
    },
  ],
}

const branches: Record<BranchId, Branch> = {
  storytelling: {
    id: 'storytelling',
    label: 'Příběhy a lore',
    intro: 'Zájem začíná u fikce, ale kvalifikace se děje podle dovednosti: jak člověk zadává, iteruje a převádí nápad do výstupu.',
    questions: [
      {
        id: 'story-output',
        text: 'Jaký výstup by vás nejvíc bavil?',
        options: [
          { label: 'krátká scéna', score: 1, signal: 'rychlý kreativní výstup' },
          { label: 'popis postavy', score: 1, signal: 'charakter a styl' },
          { label: 'rodová historie', score: 2, signal: 'strukturované psaní' },
          { label: 'svět / lore', score: 2, signal: 'práce s kontextem' },
          { label: 'námět na obsahovou sérii', score: 3, signal: 'obsahová série' },
        ],
      },
      {
        id: 'story-usage',
        text: 'Jak dnes AI používáte?',
        options: [
          { label: 'skoro vůbec', score: 0, barrier: 'nejistý start' },
          { label: 'občas ChatGPT', score: 1, barrier: 'nepravidelná praxe' },
          { label: 'pravidelně pro nápady', score: 2 },
          { label: 'zkouším vlastní postupy', score: 3 },
        ],
      },
      {
        id: 'story-barrier',
        text: 'Co vás nejvíc brzdí?',
        options: [
          { label: 'nevím, jak začít', score: 0, barrier: 'neví, jak začít' },
          { label: 'výstupy jsou moc obecné', score: 1, barrier: 'obecné výstupy' },
          { label: 'neumím AI vést dál', score: 2, barrier: 'slabá iterace' },
          { label: 'nevím, jak z nápadu udělat použitelný výstup', score: 2, barrier: 'převod nápadu do výstupu' },
        ],
      },
      {
        id: 'story-format',
        text: 'Jaký formát pomoci by vám nejvíc seděl?',
        options: [
          { label: 'krátký assessment', score: 0, format: 'diagnostika' },
          { label: 'praktický workshop', score: 1, format: 'workshop' },
          { label: 'vedený kurz', score: 2, format: 'kurz' },
          { label: 'chci doporučení', score: 1, format: 'doporučení' },
        ],
      },
    ],
  },
  visual: {
    id: 'visual',
    label: 'Vizuální tvorba',
    intro: 'Vizuální zájem dobře odhalí, jestli uživatel řeší jeden obrázek, konzistenci stylu, nebo celý kreativní systém.',
    questions: [
      {
        id: 'visual-output',
        text: 'Co byste chtěli vytvořit?',
        options: [
          { label: 'postavu', score: 1, signal: 'postava' },
          { label: 'erb / symbol rodu', score: 1, signal: 'symbolika' },
          { label: 'plakát', score: 2, signal: 'publikovatelný výstup' },
          { label: 'moodboard', score: 2, signal: 'směr stylu' },
          { label: 'vizuální koncept kampaně', score: 3, signal: 'kampaňový koncept' },
        ],
      },
      {
        id: 'visual-use',
        text: 'Kde byste výstup použili?',
        options: [
          { label: 'jen pro zábavu', score: 0 },
          { label: 'sociální sítě', score: 1 },
          { label: 'blog / newsletter', score: 2 },
          { label: 'prezentace', score: 2 },
          { label: 'marketingový koncept', score: 3 },
        ],
      },
      {
        id: 'visual-barrier',
        text: 'Co je největší problém?',
        options: [
          { label: 'neumím popsat vizuální zadání', score: 0, barrier: 'slabé zadání' },
          { label: 'výstupy nejsou konzistentní', score: 2, barrier: 'nekonzistentní výstupy' },
          { label: 'nevím, jak iterovat', score: 1, barrier: 'nejistá iterace' },
          { label: 'potřebuji workflow, ne jeden obrázek', score: 3, barrier: 'potřeba workflow' },
        ],
      },
      {
        id: 'visual-depth',
        text: 'Jak moc chcete jít do hloubky?',
        options: [
          { label: 'chci rychlý základ', score: 0, format: 'základy' },
          { label: 'chci praktický workshop', score: 1, format: 'workshop' },
          { label: 'chci stavět vlastní nástroje', score: 3, format: 'builder program' },
          { label: 'chci týmové využití', score: 4, format: 'týmové využití' },
        ],
      },
    ],
  },
  video: {
    id: 'video',
    label: 'Teaser a video',
    intro: 'Video branch přirozeně testuje, jestli člověk hledá inspiraci, produkční zrychlení, nebo opakovatelný proces.',
    questions: [
      {
        id: 'video-output',
        text: 'Co by měl být první výstup?',
        options: [
          { label: 'scénář teaseru', score: 1, signal: 'scénář' },
          { label: 'storyboard', score: 2, signal: 'storyboard' },
          { label: 'voiceover', score: 1, signal: 'voiceover' },
          { label: 'krátké video', score: 3, signal: 'produkční výstup' },
          { label: 'produkční plán', score: 3, signal: 'plán procesu' },
        ],
      },
      {
        id: 'video-barrier',
        text: 'Co je pro vás největší brzda?',
        options: [
          { label: 'nevím, kde začít', score: 0, barrier: 'nejasný start' },
          { label: 'nástroje jsou roztříštěné', score: 2, barrier: 'roztříštěné nástroje' },
          { label: 'výstupy nejsou dost kvalitní', score: 2, barrier: 'kvalita výstupů' },
          { label: 'neumím poskládat celý proces', score: 3, barrier: 'chybí proces' },
        ],
      },
      {
        id: 'video-work',
        text: 'Jak chcete s AI pracovat?',
        options: [
          { label: 'jednorázově si něco zkusit', score: 0 },
          { label: 'zrychlit tvorbu obsahu', score: 1 },
          { label: 'vytvořit opakovatelný proces', score: 3 },
          { label: 'stavět vlastní AI nástroje', score: 4 },
        ],
      },
      {
        id: 'video-proof',
        text: 'Jaký výstup by vás přesvědčil?',
        options: [
          { label: 'první hotový koncept', score: 1, format: 'koncept' },
          { label: 'šablona pro další tvorbu', score: 2, format: 'šablona' },
          { label: 'jednoduchá automatizace', score: 3, format: 'automatizace' },
          { label: 'kurz / workshop s praxí', score: 2, format: 'kurz nebo workshop' },
        ],
      },
    ],
  },
  creative_workflow: {
    id: 'creative_workflow',
    label: 'Kreativní workflow',
    intro: 'Začíná to fan nápadem, ale rychle se ukáže, jestli z něj chcete udělat opakovatelný kreativní workflow použitelný i pro obsah, marketing nebo práci.',
    questions: [
      {
        id: 'workflow-repeat',
        text: 'Když vás napadne nový fantasy svět, co byste chtěli umět opakovaně vytvářet?',
        options: [
          { label: 'nápady na příběhy', score: 1 },
          { label: 'postavy a jejich motivace', score: 1 },
          { label: 'vizuální směry', score: 2 },
          { label: 'texty pro sociální sítě', score: 2 },
          { label: 'celý content plán', score: 3, signal: 'content plán' },
        ],
      },
      {
        id: 'workflow-system',
        text: 'Co by z toho udělalo užitečný systém?',
        options: [
          { label: 'šablona promptů', score: 2, signal: 'promptová šablona' },
          { label: 'vlastní AI asistent', score: 3, signal: 'AI asistent' },
          { label: 'workflow od nápadu k výstupu', score: 3, signal: 'end-to-end workflow' },
          { label: 'knihovna stylu a pravidel', score: 3, signal: 'knihovna pravidel' },
          { label: 'automatizace části tvorby', score: 4, signal: 'automatizace' },
        ],
      },
      {
        id: 'workflow-context',
        text: 'Kde by se vám podobný systém hodil i mimo fan tvorbu?',
        options: [
          { label: 'v práci s obsahem', score: 2 },
          { label: 'v marketingu', score: 3 },
          { label: 'v prezentacích', score: 2 },
          { label: 'v produktivitě', score: 2 },
          { label: 'v interní komunikaci', score: 3 },
        ],
      },
      {
        id: 'workflow-next',
        text: 'Co je váš další krok?',
        options: [
          { label: 'zjistit svůj AI level', score: 0, format: 'assessment' },
          { label: 'naučit se lépe zadávat', score: 1, format: 'foundations' },
          { label: 'postavit si vlastní workflow', score: 3, format: 'workflow builder' },
          { label: 'vytvořit první AI nástroj', score: 4, format: 'tool builder' },
        ],
      },
    ],
  },
  team_workflow: {
    id: 'team_workflow',
    label: 'Týmové využití',
    intro: 'Pořád vycházíme z fantasy/content kontextu: když jednotlivec dokáže s AI tvořit svět, co by stejnou logikou dokázal tým a jak by šla měřit AI readiness?',
    questions: [
      {
        id: 'team-impact',
        text: 'Představte si, že podobné AI workflow používá celý tým. Kde by mělo největší dopad?',
        options: [
          { label: 'obsah a kampaně', score: 3, signal: 'obsah a kampaně' },
          { label: 'interní znalosti', score: 3, signal: 'znalostní práce' },
          { label: 'prezentace a dokumenty', score: 2, signal: 'dokumenty' },
          { label: 'zákaznická komunikace', score: 3, signal: 'komunikace se zákazníky' },
          { label: 'opakující se procesy', score: 4, signal: 'procesní automatizace' },
        ],
      },
      {
        id: 'team-diagnosis',
        text: 'Co by bylo nejtěžší zjistit?',
        options: [
          { label: 'kdo už AI opravdu používá', score: 2, barrier: 'nejasná adopce' },
          { label: 'kdo jen zkouší první prompty', score: 1, barrier: 'povrchní používání' },
          { label: 'kdo umí stavět workflow', score: 3, barrier: 'chybí přehled o builderech' },
          { label: 'kde má tým slepá místa', score: 3, barrier: 'slepá místa týmu' },
          { label: 'jak měřit posun', score: 4, barrier: 'měření posunu' },
        ],
      },
      {
        id: 'team-output',
        text: 'Co by měl tým získat jako výstup?',
        options: [
          { label: 'AI level jednotlivců', score: 2 },
          { label: 'týmový přehled', score: 3 },
          { label: 'doporučený trénink', score: 2 },
          { label: 'seznam příležitostí', score: 3 },
          { label: 're-assessment po čase', score: 4 },
        ],
      },
      {
        id: 'team-solution',
        text: 'Jaký typ řešení by dával smysl?',
        options: [
          { label: 'krátký assessment', score: 2, format: 'assessment' },
          { label: 'týmový dashboard', score: 4, format: 'dashboard' },
          { label: 'workshop pro vybraný tým', score: 3, format: 'workshop' },
          { label: 'dlouhodobější program', score: 4, format: 'program' },
          { label: 'kombinace podle výsledků', score: 4, format: 'kombinace podle dat' },
        ],
      },
    ],
  },
}

const articleBlocks = [
  {
    title: 'Proč fantasy světy znovu fungují',
    body: 'Velké fantasy příběhy se vracejí pokaždé, když publikum hledá víc než jen zápletku. Potřebuje svět, který má pravidla, paměť a dost prázdných míst pro vlastní teorii. Draci, rody a staré přísahy jsou kulisy, ale skutečná přitažlivost leží v otázce, kdo má moc vyprávět dějiny.',
  },
  {
    title: 'Co diváky drží u rodových konfliktů',
    body: 'Rodové intriky fungují jako dobrý produktový systém: každý aktér má motivaci, zdroj napětí a viditelnou cenu rozhodnutí. Publikum se nevrací jen kvůli bitvám, ale kvůli tomu, že dokáže předvídat, pochybovat a přepisovat vlastní hypotézy po každé nové scéně.',
  },
  {
    title: 'Proč fanoušci milují vlastní teorie, postavy a lore',
    body: 'Moderní fan tvorba není pasivní komentování. Lidé si skládají mapy vztahů, píšou alternativní scény, vymýšlejí znaky rodů a sdílejí vlastní výklady. Dobrý obsah dnes často spustí druhou vlnu obsahu: osobní, komunitní a překvapivě systematickou.',
  },
  {
    title: 'Jak AI mění fan tvorbu a kreativní práci',
    body: 'AI zrychluje první verzi, ale největší hodnota vzniká až ve chvíli, kdy člověk umí zadat kontext, iterovat a udělat z nápadu opakovatelný postup. Právě tam se z hravého experimentu může stát dovednost použitelná pro obsah, marketing i týmovou práci.',
  },
]

function App() {
  const [route, setRoute] = useState(() => getRoute())

  useEffect(() => {
    const syncRoute = () => setRoute(getRoute())
    window.addEventListener('hashchange', syncRoute)
    window.addEventListener('popstate', syncRoute)
    return () => {
      window.removeEventListener('hashchange', syncRoute)
      window.removeEventListener('popstate', syncRoute)
    }
  }, [])

  return route === 'campaign' ? <CampaignLandingPage /> : <PublisherPage />
}

function getRoute() {
  const hash = window.location.hash.replace('#', '')
  if (hash === '/ai-skill-finder' || window.location.pathname === '/ai-skill-finder') {
    return 'campaign'
  }
  return 'publisher'
}

const campaignPath = '/ai-skill-finder'

function PublisherPage() {
  const [showStickyAd, setShowStickyAd] = useState(true)

  return (
    <main className="min-h-screen bg-[#efebe3] pb-14 text-ink md:pb-0">
      <header className="border-b border-stone-300 bg-white">
        <div className="border-b border-stone-200 bg-[#191919] px-4 py-2 text-xs text-stone-300 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <span>Středa 1. července 2026</span>
            <span className="hidden sm:inline">Fiktivní popkulturní magazín · demo reklamního placementu</span>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <a href="#/" className="flex items-center gap-3 text-ink">
              <span className="grid size-10 place-items-center rounded bg-[#b22b2b] text-white">
                <Flame className="size-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-3xl font-black tracking-normal">DragonWatch.cz</span>
                <span className="block text-xs uppercase tracking-[0.18em] text-stone-500">fantasy · gaming · lore · popkultura</span>
              </span>
            </a>
            <nav className="flex flex-wrap gap-x-4 gap-y-2 border-t border-stone-200 pt-3 text-sm font-black text-stone-700 lg:border-t-0 lg:pt-0" aria-label="Navigace magazínu">
              <a href="#/" className="text-[#b22b2b] hover:text-ink">Zprávy</a>
              <a href="#/" className="hover:text-ink">Seriály</a>
              <a href="#/" className="hover:text-ink">Fantasy</a>
              <a href="#/" className="hover:text-ink">Gaming</a>
              <a href="#/" className="hover:text-ink">Teorie</a>
              <a href="#/" className="hover:text-ink">Newsletter</a>
            </nav>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1010px] px-4 py-5 sm:px-6 lg:px-8">
        <CampaignAd variant="billboard" />
      </div>

      <article>
        <div className="mx-auto grid max-w-7xl gap-7 px-4 pb-16 sm:px-6 lg:grid-cols-[minmax(0,760px)_330px] lg:px-8">
          <div>
            <div className="overflow-hidden border border-stone-300 bg-white shadow-sm">
              <img
                src={heroImage}
                alt="Fiktivní fantasy citadela s dračí siluetou v mlze"
                className="h-[260px] w-full object-cover sm:h-[390px]"
              />
              <div className="p-5 sm:p-8">
                <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-stone-500">
                  <span className="rounded bg-[#b22b2b] px-3 py-1 font-bold text-white">Seriály</span>
                  <span>Fantasy</span>
                  <span>Fiktivní magazín</span>
                  <span>8 minut čtení</span>
                </div>
                <h1 className="text-balance font-serif text-4xl font-bold leading-tight text-ink sm:text-6xl">
                  Nová dračí série se blíží. Co si připomenout před návratem do světa rodů, intrik a ohně?
                </h1>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-700">
                  Krátký editorial o tom, proč fiktivní fantasy světy znovu přitahují publikum, fan teorie a novou vlnu kreativní práce s AI.
                </p>
                <p className="mt-5 border-t border-stone-200 pt-4 text-sm text-stone-500">
                  Autor: Redakce DragonWatch · aktualizováno 09:20 · ilustrační obrázek vytvořený pro demo
                </p>
              </div>
            </div>

            <div className="article-copy mt-8 space-y-9 bg-white p-5 shadow-sm sm:p-8">
              {articleBlocks.slice(0, 2).map((block) => (
                <section key={block.title}>
                  <h2>{block.title}</h2>
                  <p>{block.body}</p>
                </section>
              ))}

              <CampaignAd variant="native" />
              <div className="md:hidden">
                <CampaignAd variant="mobile-infeed" />
              </div>

              {articleBlocks.slice(2).map((block) => (
                <section key={block.title}>
                  <h2>{block.title}</h2>
                  <p>{block.body}</p>
                </section>
              ))}

              <section className="border-t border-stone-200 pt-8">
                <h2>Související články</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {['Jak se píše dobrá rodová legenda', 'Proč mapy prodlužují život fantasy světa', 'Fan teorie jako nová forma komunitního obsahu'].map((title) => (
                    <a key={title} href="#/" className="block border border-stone-200 bg-[#faf8f4] p-4 text-sm font-bold leading-6 text-stone-800 hover:border-[#9b6636]">
                      {title}
                    </a>
                  ))}
                </div>
              </section>
            </div>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-5 lg:h-fit">
            <CampaignAd variant="sidebar" />
            <div className="border border-stone-300 bg-white p-5">
              <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-stone-500">Dnešní výběr</p>
              <ul className="space-y-4 text-sm font-bold leading-6 text-stone-800">
                <li><a href="#/" className="hover:text-[#8b5a2c]">Sedm motivů, které drží velké fantasy světy pohromadě</a></li>
                <li><a href="#/" className="hover:text-[#8b5a2c]">Vizuální lore: proč fanoušci milují erby a symboly</a></li>
                <li><a href="#/" className="hover:text-[#8b5a2c]">Newsletter: každý pátek nové teorie a čtení</a></li>
              </ul>
            </div>
            <div className="border border-stone-300 bg-white p-5">
              <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-stone-500">Nejčtenější</p>
              <ol className="space-y-4 text-sm font-bold leading-6 text-stone-800">
                {['Které rody by přežily ve světě draků?', 'Nové spekulace kolem návratu velkých fantasy světů', 'Jak AI mění tvorbu fan trailerů'].map((item, index) => (
                  <li key={item} className="flex gap-3">
                    <span className="font-black text-[#b22b2b]">{index + 1}</span>
                    <a href="#/" className="hover:text-[#8b5a2c]">{item}</a>
                  </li>
                ))}
              </ol>
            </div>
            <div className="border border-stone-300 bg-[#17130f] p-5 text-white">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-ember">Newsletter</p>
              <h2 className="mt-2 text-xl font-black">Dračí kronika do e-mailu</h2>
              <p className="mt-2 text-sm leading-6 text-stone-300">Fiktivní box magazínu. Slouží jen k tomu, aby stránka působila jako skutečný publisher.</p>
            </div>
          </aside>
        </div>
      </article>

      {showStickyAd && (
        <div className="fixed inset-x-3 bottom-3 z-20 md:hidden">
          <CampaignAd variant="mobile-sticky" onClose={() => setShowStickyAd(false)} />
        </div>
      )}

      <footer className="border-t border-stone-300 bg-[#ede5da] px-4 py-6 text-center text-sm text-stone-600 sm:px-6 lg:px-8">
        Neoficiální demo vytvořené jako ukázka interaktivního lead flow. Není spojeno s žádnou mediální značkou ani s Aibility.
      </footer>
    </main>
  )
}

type AdVariant = 'billboard' | 'native' | 'sidebar' | 'mobile-infeed' | 'mobile-sticky'

type AdConfig = {
  alt: string
  aspectClass: string
  cta: string
  headline: string
  imageClass: string
  label?: string
  png: string
  subcopy?: string
  textClass: string
  webp: string
}

const adAssets: Record<AdVariant, AdConfig> = {
  billboard: {
    alt: 'Fantasy krajina pro reklamní pozadí',
    aspectClass: 'aspect-[970/250] max-w-[970px]',
    cta: 'Spustit assessment',
    headline: 'Vytvořte si vlastní fantasy svět s AI',
    imageClass: 'object-center',
    label: 'REKLAMA / PARTNER CONTENT',
    png: '/assets/ads/aibility-bg-top-billboard-970x250.png',
    subcopy: 'Zjistěte za 60 sekund, jaký AI další krok pro vás dává smysl.',
    textClass: 'max-w-[70%] gap-[clamp(0.15rem,0.8vw,0.75rem)] p-[clamp(0.45rem,2.6vw,2rem)] sm:max-w-[58%]',
    webp: '/assets/ads/aibility-bg-top-billboard-970x250.webp',
  },
  native: {
    alt: 'Fantasy tvůrčí scéna pro native reklamu',
    aspectClass: 'aspect-[728/250]',
    cta: 'Zjistit doporučení',
    headline: 'Co kdyby váš fan nápad ožil díky AI?',
    imageClass: 'object-center',
    label: 'PARTNER CONTENT',
    png: '/assets/ads/aibility-bg-native-728x250.png',
    subcopy: 'Krátký assessment doporučí, kde začít.',
    textClass: 'max-w-[64%] gap-[clamp(0.25rem,0.9vw,0.55rem)] p-[clamp(1rem,2.7vw,1.6rem)]',
    webp: '/assets/ads/aibility-bg-native-728x250.webp',
  },
  sidebar: {
    alt: 'Fantasy portrétové reklamní pozadí',
    aspectClass: 'aspect-[300/250] max-w-[300px]',
    cta: 'Spustit test',
    headline: 'Jaký jste AI tvůrce?',
    imageClass: 'object-center',
    label: 'REKLAMA',
    png: '/assets/ads/aibility-bg-sidebar-300x250.png',
    subcopy: 'Zjistěte svůj AI level.',
    textClass: 'max-w-[76%] gap-2 p-5',
    webp: '/assets/ads/aibility-bg-sidebar-300x250.webp',
  },
  'mobile-infeed': {
    alt: 'Fantasy mobilní reklamní pozadí',
    aspectClass: 'aspect-[320/100] max-w-[320px]',
    cta: 'Spustit',
    headline: 'Vlastní fantasy svět s AI',
    imageClass: 'object-center',
    label: 'REKLAMA',
    png: '/assets/ads/aibility-bg-mobile-infeed-320x100.png',
    textClass: 'max-w-[68%] gap-1.5 p-3',
    webp: '/assets/ads/aibility-bg-mobile-infeed-320x100.webp',
  },
  'mobile-sticky': {
    alt: 'Tmavé fantasy pozadí pro sticky reklamu',
    aspectClass: 'aspect-[320/50] max-w-[320px]',
    cta: 'Spustit',
    headline: 'Zjistěte svůj AI level',
    imageClass: 'object-center',
    png: '/assets/ads/aibility-bg-mobile-sticky-320x50.png',
    textClass: 'flex-row items-center justify-between gap-2 p-2.5 pr-8',
    webp: '/assets/ads/aibility-bg-mobile-sticky-320x50.webp',
  },
}

function CampaignAd({ onClose, variant }: { onClose?: () => void; variant: AdVariant }) {
  const asset = adAssets[variant]
  const wrapperClass = variant === 'sidebar' ? 'hidden lg:block' : ''
  const headlineClass = variant === 'mobile-sticky'
    ? 'text-[clamp(0.82rem,4.4vw,1rem)] leading-tight'
    : variant === 'mobile-infeed'
      ? 'text-[clamp(1rem,5vw,1.25rem)] leading-[1.05]'
      : variant === 'sidebar'
        ? 'text-[clamp(1.45rem,2.2vw,1.75rem)] leading-[1.02]'
        : variant === 'billboard'
          ? 'text-[clamp(0.92rem,3.4vw,2.5rem)] leading-[1.02]'
          : 'text-[clamp(1rem,3.3vw,2rem)] leading-[1.02]'

  return (
    <div className={`relative ${wrapperClass}`}>
      <a
        href={campaignPath}
        className={`group relative mx-auto block w-full overflow-hidden rounded border border-stone-300 bg-[#121212] shadow-sm transition hover:-translate-y-0.5 hover:border-[#24292f] hover:shadow-lg ${asset.aspectClass}`}
        aria-label={`Reklama: ${asset.headline}. Otevřít landing page AI Skill Finder.`}
      >
        <picture>
          <source srcSet={asset.webp} type="image/webp" />
          <img
            src={asset.png}
            alt={asset.alt}
            className={`absolute inset-0 size-full object-cover ${asset.imageClass}`}
            loading="lazy"
          />
        </picture>
        <span className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,10,0.88)_0%,rgba(5,7,10,0.72)_42%,rgba(5,7,10,0.28)_72%,rgba(5,7,10,0.12)_100%)] transition group-hover:bg-[linear-gradient(90deg,rgba(5,7,10,0.9)_0%,rgba(5,7,10,0.68)_42%,rgba(5,7,10,0.2)_72%,rgba(5,7,10,0.08)_100%)]" aria-hidden="true" />
        <span data-ad-content={variant} className={`relative z-10 flex h-full text-white ${asset.textClass}`}>
          {variant === 'mobile-sticky' ? (
            <>
              <span className={`${headlineClass} min-w-0 flex-1 truncate font-black tracking-normal`}>
                {asset.headline}
              </span>
              <span className="inline-flex shrink-0 items-center rounded bg-[#70f0c8] px-2.5 py-1 text-[0.72rem] font-black leading-none text-[#071016] shadow-sm transition group-hover:bg-white">
                {asset.cta}
              </span>
            </>
          ) : (
            <span className="flex min-w-0 flex-col justify-center">
              {asset.label && (
                <span className="mb-[clamp(0.05rem,0.6vw,0.45rem)] block text-[clamp(0.46rem,1.45vw,0.72rem)] font-black uppercase tracking-[0.14em] text-[#9ff7dc]">
                  {asset.label}
                </span>
              )}
              <span className={`${headlineClass} line-clamp-2 block max-w-full text-balance font-black tracking-normal`}>
                {asset.headline}
              </span>
              {asset.subcopy && (
                <span className="mt-[clamp(0.08rem,0.7vw,0.55rem)] block max-w-[34rem] text-[clamp(0.58rem,1.75vw,1rem)] font-semibold leading-snug text-stone-100">
                  {asset.subcopy}
                </span>
              )}
              <span className="mt-[clamp(0.15rem,0.9vw,0.75rem)] inline-flex w-fit items-center rounded bg-[#70f0c8] px-[clamp(0.5rem,1.7vw,0.95rem)] py-[clamp(0.22rem,0.7vw,0.48rem)] text-[clamp(0.58rem,1.65vw,0.86rem)] font-black leading-none text-[#071016] shadow-sm transition group-hover:bg-white">
                {asset.cta}
              </span>
            </span>
          )}
        </span>
      </a>
      {variant === 'mobile-sticky' && onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute right-1.5 top-1.5 z-20 grid size-5 place-items-center rounded-full bg-black/55 text-[0.8rem] font-bold leading-none text-white/85 transition hover:bg-black hover:text-white"
          aria-label="Zavřít reklamu"
        >
          ×
        </button>
      )}
    </div>
  )
}

function CampaignLandingPage() {
  const [hasStartedAssessment, setHasStartedAssessment] = useState(false)
  const [hasCompletedAssessment, setHasCompletedAssessment] = useState(false)
  const [hasUnlockedDemoCommentary, setHasUnlockedDemoCommentary] = useState(false)
  const [showCommentaryNotice, setShowCommentaryNotice] = useState(false)
  const [branchId, setBranchId] = useState<BranchId | null>(null)
  const [answers, setAnswers] = useState<Answer[]>([])
  const assessmentRef = useRef<HTMLDivElement>(null)
  const aibilityRef = useRef<HTMLElement>(null)

  const branch = branchId ? branches[branchId] : null
  const stepIndex = branch ? answers.length : 0
  const activeQuestion = branch ? branch.questions[stepIndex] : null
  const isComplete = Boolean(branch && stepIndex >= branch.questions.length)
  const totalSteps = branch ? branch.questions.length + 1 : 5
  const currentStep = branch ? Math.min(stepIndex + 2, totalSteps) : 1
  const progress = Math.round((currentStep / totalSteps) * 100)

  const result = useMemo(() => (branch ? buildResult(branch, answers) : null), [branch, answers])

  const openAssessment = () => {
    setHasStartedAssessment(true)
    setShowCommentaryNotice(false)
    window.setTimeout(() => assessmentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  const chooseBranch = (nextBranch: BranchId) => {
    setBranchId(nextBranch)
    setAnswers([])
    setHasCompletedAssessment(false)
    setHasUnlockedDemoCommentary(false)
    setShowCommentaryNotice(false)
  }

  const chooseAnswer = (option: Option) => {
    if (!activeQuestion) return
    const completesAssessment = Boolean(branch && stepIndex === branch.questions.length - 1)
    setHasCompletedAssessment(completesAssessment)
    setHasUnlockedDemoCommentary(false)
    setShowCommentaryNotice(false)
    setAnswers((current) => [
      ...current,
      {
        questionId: activeQuestion.id,
        label: option.label,
        score: option.score,
        barrier: option.barrier,
        format: option.format,
        signal: option.signal,
      },
    ])
  }

  const goBack = () => {
    setHasCompletedAssessment(false)
    setHasUnlockedDemoCommentary(false)
    setShowCommentaryNotice(false)
    if (answers.length > 0) {
      setAnswers((current) => current.slice(0, -1))
      return
    }
    setBranchId(null)
  }

  const restart = () => {
    setBranchId(null)
    setAnswers([])
    setHasCompletedAssessment(false)
    setHasUnlockedDemoCommentary(false)
    setShowCommentaryNotice(false)
  }

  const unlockDemoCommentary = () => {
    setHasUnlockedDemoCommentary(true)
    window.setTimeout(() => aibilityRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  const handleAibilityNav = () => {
    if (hasUnlockedDemoCommentary) {
      aibilityRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    setShowCommentaryNotice(true)
    assessmentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <main className="min-h-screen bg-[#0b1014]">
      <header className="border-b border-white/10 bg-[#081016]/92 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a href={campaignPath} className="flex items-center gap-3 text-white">
            <span className="grid size-10 place-items-center rounded-md bg-[#70f0c8] text-[#081016]">
              <Sparkles className="size-5" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-lg font-black tracking-normal">AI Skill Finder</span>
              <span className="block text-xs uppercase tracking-[0.18em] text-slate-400">Neoficiální demo inspirované nabídkou Aibility</span>
            </span>
          </a>
          <nav className="hidden items-center gap-6 text-sm font-bold text-slate-300 md:flex" aria-label="Navigace landing page">
            <a href="#benefits" className="hover:text-white">Jak to funguje</a>
            <a href="#assessment" className="hover:text-white">Assessment</a>
            <button type="button" onClick={handleAibilityNav} className="font-bold hover:text-white">Pro Aibility</button>
            <a href="https://david-koller-portfolio.vercel.app/" target="_blank" rel="noreferrer" className="hover:text-white">Portfolio Davida</a>
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#081016_0%,#10242b_46%,#2a2016_100%)]" />
        <div className="relative mx-auto min-h-[650px] max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-4xl py-10">
            <a href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-stone-300 hover:text-white">
              <ArrowLeft className="size-4" aria-hidden="true" />
              Zpět na článek
            </a>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#70f0c8]">AI SKILL FINDER</p>
            <h1 className="mt-4 text-balance text-5xl font-black leading-none text-white sm:text-7xl">
              Najděte svůj další AI krok
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-200">
              Odpovězte na 5 krátkých otázek a zjistěte, jaký AI level vám odpovídá, co vás teď nejvíc posune a jaký další krok pro vás dává smysl.
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400">
              Začínáme od kreativního zadání. Výsledek ale míří k praktickému využití AI v tvorbě, práci i týmu.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={openAssessment}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-[#70f0c8] px-5 py-3 font-bold text-[#081016] transition hover:bg-[#9ff7dc]"
              >
                Spustit AI Skill Finder
                <ArrowRight className="size-4" aria-hidden="true" />
              </button>
              <span className="text-sm text-stone-400">5 otázek · výsledek hned · bez registrace</span>
            </div>
          </div>
        </div>
      </section>

      <section id="benefits" className="bg-[#0d1418] px-4 py-14 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-black sm:text-4xl">Co získáte za 60 sekund</h2>
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            <BenefitCard title="AI level" body="Zjistíte, jestli jste spíš Explorer, Operator, Builder nebo Transformer." />
            <BenefitCard title="Growth Edge" body="Pojmenujete, co vás teď nejvíc posune: lepší prompty, workflow, nástroje nebo týmový přístup." />
            <BenefitCard title="Doporučený další krok" body="Dostanete praktické doporučení inspirované nabídkou Aibility." />
          </div>
        </div>
      </section>

      <section
        id="assessment"
        ref={assessmentRef}
        className="bg-[#101114] px-4 py-14 text-white sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-5xl">
          {showCommentaryNotice && !hasUnlockedDemoCommentary && (
            <div className="mb-6 rounded-lg border border-white/10 bg-white/[0.04] p-5">
              <h2 className="text-xl font-black">Demo komentář se zobrazí po dokončení assessmentu</h2>
              <p className="mt-2 text-sm leading-6 text-stone-300">
                Nejdřív projděte uživatelskou částí flow. Pak se ukáže vysvětlení akviziční logiky pro Aibility.
              </p>
            </div>
          )}
          <div className="mb-7">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-ember">AI Skill Finder</p>
            <h2 className="mt-2 text-3xl font-black">Spusťte krátký AI Skill Finder</h2>
            <p className="mt-3 max-w-3xl text-stone-300">
              Odpovězte na pár otázek. Na konci dostanete svůj AI level, hlavní Growth Edge a doporučený další krok.
            </p>
          </div>
          {!hasStartedAssessment ? (
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-8 text-center">
              <Sparkles className="mx-auto mb-4 size-8 text-ember" aria-hidden="true" />
              <h2 className="text-3xl font-black">Spusťte krátký AI Skill Finder</h2>
              <p className="mx-auto mt-3 max-w-2xl text-stone-300">
                Odpovězte na pár otázek. Na konci dostanete svůj AI level, hlavní Growth Edge a doporučený další krok.
              </p>
              <button
                type="button"
                onClick={openAssessment}
                className="mt-6 inline-flex items-center gap-2 rounded-md bg-ember px-5 py-3 font-bold text-ash transition hover:bg-[#efad64]"
              >
                Začít
                <ArrowRight className="size-4" aria-hidden="true" />
              </button>
            </div>
          ) : (
            <div className="soft-enter overflow-hidden rounded-lg border border-white/10 bg-[#17191e] shadow-2xl">
              <div className="border-b border-white/10 p-5 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-ember">AI Skill Finder</p>
                    <h2 className="mt-1 text-2xl font-black">Personalizované doporučení</h2>
                  </div>
                  <div className="text-sm text-stone-300">Krok {currentStep} z {totalSteps}</div>
                </div>
                <div className="mt-5 h-2 rounded-full bg-white/10" aria-label={`Průběh ${progress} procent`}>
                  <div className="h-2 rounded-full bg-ember transition-all" style={{ width: `${progress}%` }} />
                </div>
              </div>

              <div className="p-5 sm:p-8">
                {!branch && (
                  <QuestionPanel
                    title={firstQuestion.text}
                    eyebrow="Start segmentace"
                    options={firstQuestion.options.map((option) => option.label)}
                    onChoose={(label) => chooseBranch(firstQuestion.options.find((option) => option.label === label)!.branch)}
                  />
                )}

                {branch && activeQuestion && (
                  <QuestionPanel
                    title={activeQuestion.text}
                    eyebrow={branch.label}
                    intro={branch.intro}
                    options={activeQuestion.options.map((option) => option.label)}
                    onChoose={(label) => chooseAnswer(activeQuestion.options.find((option) => option.label === label)!)}
                  />
                )}

                {branch && isComplete && result && (
                  <ResultPanel
                    branch={branch}
                    result={result}
                    answers={answers}
                    onUnlockDemoCommentary={unlockDemoCommentary}
                    onRestart={restart}
                  />
                )}

                {(branch || answers.length > 0) && (
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={goBack}
                      className="inline-flex items-center gap-2 rounded-md border border-white/15 px-4 py-2 text-sm font-bold text-stone-200 transition hover:bg-white/10"
                    >
                      <ArrowLeft className="size-4" aria-hidden="true" />
                      Zpět
                    </button>
                    <button
                      type="button"
                      onClick={restart}
                      className="inline-flex items-center gap-2 rounded-md border border-white/15 px-4 py-2 text-sm font-bold text-stone-200 transition hover:bg-white/10"
                    >
                      <RefreshCw className="size-4" aria-hidden="true" />
                      Restart assessmentu
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {hasCompletedAssessment && hasUnlockedDemoCommentary && (
        <>
          <AibilityExplanation sectionRef={aibilityRef} />
          <CandidateBridge />
        </>
      )}

      <footer className="border-t border-white/10 bg-black px-4 py-6 text-center text-sm text-stone-500 sm:px-6 lg:px-8">
        Neoficiální demo vytvořené jako ukázka interaktivního lead flow. Není spojeno s žádnou mediální značkou ani s Aibility.
      </footer>
    </main>
  )
}

function BenefitCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-black/20 p-4">
      <p className="font-black text-white">{title}</p>
      <p className="mt-2 text-sm leading-6 text-stone-300">{body}</p>
    </div>
  )
}

function QuestionPanel({
  eyebrow,
  title,
  intro,
  options,
  onChoose,
}: {
  eyebrow: string
  title: string
  intro?: string
  options: string[]
  onChoose: (label: string) => void
}) {
  return (
    <div className="soft-enter">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-ember">{eyebrow}</p>
      <h3 className="mt-2 text-2xl font-black text-white sm:text-3xl">{title}</h3>
      {intro && <p className="mt-3 max-w-3xl text-stone-300">{intro}</p>}
      <div className="mt-7 grid gap-3">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChoose(option)}
            className="group flex min-h-16 items-center justify-between rounded-md border border-white/12 bg-white/[0.045] px-4 py-4 text-left text-stone-100 transition hover:border-ember/70 hover:bg-ember/10"
          >
            <span>{option}</span>
            <ArrowRight className="size-4 shrink-0 text-stone-500 transition group-hover:text-ember" aria-hidden="true" />
          </button>
        ))}
      </div>
    </div>
  )
}

function ResultPanel({
  branch,
  result,
  answers,
  onUnlockDemoCommentary,
  onRestart,
}: {
  branch: Branch
  result: Result
  answers: Answer[]
  onUnlockDemoCommentary: () => void
  onRestart: () => void
}) {
  return (
    <div className="soft-enter">
      <div className="grid gap-5 lg:grid-cols-[1fr_0.82fr]">
        <section className="rounded-lg border border-ember/35 bg-ember/10 p-6">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-ember">Váš výsledek</p>
          <h3 className="mt-2 text-4xl font-black">{result.level}</h3>
          <p className="mt-4 text-lg leading-8 text-stone-100">{result.rationale}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <InfoBlock icon={<BarChart3 />} label="Growth Edge" value={result.growthEdge} />
            <InfoBlock icon={<ShieldCheck />} label="Doporučení inspirované nabídkou Aibility" value={result.product} />
          </div>
          <p className="mt-5 text-sm leading-6 text-stone-300">
            {result.productDetail}
          </p>
        </section>

        <aside className="rounded-lg border border-white/10 bg-black/22 p-6">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-stone-400">Branching signál</p>
          <h4 className="mt-2 text-xl font-black">{branch.label}</h4>
          <dl className="mt-5 space-y-4 text-sm">
            {answers.map((answer) => (
              <div key={answer.questionId}>
                <dt className="text-stone-500">{answer.questionId}</dt>
                <dd className="mt-1 text-stone-100">{answer.label}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>

      <LeadCaptureDemo result={result} onUnlockDemoCommentary={onUnlockDemoCommentary} />
      <button
        type="button"
        onClick={onRestart}
        className="mt-5 inline-flex items-center gap-2 rounded-md border border-white/15 px-4 py-2 text-sm font-bold text-stone-100 transition hover:bg-white/10"
      >
        <RefreshCw className="size-4" aria-hidden="true" />
        Restart assessmentu
      </button>
    </div>
  )
}

function InfoBlock({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-black/18 p-4">
      <div className="mb-3 text-ember [&_svg]:size-5">{icon}</div>
      <p className="text-sm font-bold uppercase tracking-[0.15em] text-stone-400">{label}</p>
      <p className="mt-2 leading-6 text-white">{value}</p>
    </div>
  )
}

function LeadCaptureDemo({
  result,
  onUnlockDemoCommentary,
}: {
  result: Result
  onUnlockDemoCommentary: () => void
}) {
  return (
    <section className="mt-6 rounded-lg border border-[#70f0c8]/25 bg-[#70f0c8]/8 p-6">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#70f0c8]">LEAD CAPTURE MOMENT</p>
      <h3 className="mt-2 text-2xl font-black">Tady by v reálné kampani vznikl lead</h3>
      <p className="mt-3 max-w-3xl leading-7 text-stone-200">
        V ostré verzi by si uživatel mohl nechat doporučení poslat e-mailem. Marketing by tím získal kontakt i kontext: segment, AI level, hlavní bariéru a doporučený další krok.
      </p>
      <LeadFormMockup />
      <p className="mt-4 text-sm leading-6 text-stone-400">
        V demu formulář neodesíláme. Místo toho rovnou ukazujeme, jaká data by lead nesl.
      </p>
      <LeadPreview result={result} />
      <button
        type="button"
        onClick={onUnlockDemoCommentary}
        className="mt-6 inline-flex items-center gap-2 rounded-md bg-[#70f0c8] px-5 py-3 font-bold text-[#071016] transition hover:bg-white"
      >
        Zobrazit, proč jsem to navrhl takhle
        <ArrowRight className="size-4" aria-hidden="true" />
      </button>
    </section>
  )
}

function LeadFormMockup() {
  const fields = ['Jméno', 'E-mail', 'Role / zaměření', 'Firma / tým, volitelné']

  return (
    <div className="mt-6 rounded-lg border border-white/10 bg-black/20 p-5" aria-label="Vizuální ukázka lead formuláře">
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field} className="grid gap-2 text-sm font-bold text-stone-300">
            <span>{field}</span>
            <span className="block h-12 rounded-md border border-white/12 bg-black/30" aria-hidden="true" />
          </div>
        ))}
      </div>
      <span className="mt-5 inline-flex cursor-not-allowed items-center gap-2 rounded-md bg-stone-500/35 px-5 py-3 font-bold text-stone-300" aria-disabled="true">
        Poslat doporučení
      </span>
    </div>
  )
}

function LeadPreview({ result }: { result: Result }) {
  const rows = [
    ['Segment', result.segment],
    ['AI level', result.level],
    ['Growth Edge', result.growthEdge],
    ['Bariéra', result.barrier],
    ['Doporučený další krok', result.product],
    ['Follow-up angle', result.angle],
  ]

  return (
    <div className="mt-6 rounded-md border border-white/10 bg-black/22 p-4">
      <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-stone-400">Ukázka dat pro marketingový tým</p>
      <dl className="grid gap-3 sm:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label} className="rounded bg-white/[0.04] p-3">
            <dt className="text-xs uppercase tracking-[0.15em] text-stone-500">{label}</dt>
            <dd className="mt-1 text-sm text-stone-100">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

function AibilityExplanation({ sectionRef }: { sectionRef: RefObject<HTMLElement | null> }) {
  return (
    <section ref={sectionRef} id="aibility" className="border-t-4 border-[#70f0c8] bg-[#e9ded0] px-4 py-16 text-ink sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-[#8b5a2c]">DEMO KOMENTÁŘ PRO AIBILITY</p>
        <h2 className="mt-3 text-3xl font-black sm:text-5xl">Co tohle demo ukazuje pro Aibility</h2>
        <p className="mt-5 max-w-4xl text-lg leading-8 text-stone-700">
          Tahle část už není součástí uživatelské landing page. Je to vysvětlení akviziční logiky pro Aibility.
        </p>
        <p className="mt-5 max-w-4xl text-lg leading-8 text-stone-700">
          Klasický banner často posílá uživatele na statickou landing page. Tohle demo ukazuje jiný princip: mediální placement na relevantním obsahovém webu vede do interaktivní segmentace. Uživatel nepřichází rovnou přes potřebu koupit školení, ale přes zájem, který se dá postupně převést na AI level, Growth Edge a doporučený další krok.
        </p>
        <p className="mt-5 max-w-4xl text-lg leading-8 text-stone-700">
          Fantasy, gaming a popkulturní publika jsou dobrý příklad vstupního segmentu: často jde o digitálně přirozené, kreativní a technicky zvídavé lidi, kteří mohou AI používat v tvorbě, marketingu, kancelářské práci i týmových procesech. Stejný princip by šel testovat i na dalších obsahových webech a komunitách.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <ValueList
            icon={<Sparkles />}
            title="Marketing získá:"
            items={[
              'segment zájmu',
              'AI level',
              'hlavní bariéru',
              'preferovaný formát',
              'doporučený další krok',
              'konkrétnější follow-up message',
            ]}
          />
          <ValueList
            icon={<Users />}
            title="Sales / delivery tým získá:"
            items={[
              'kontext před prvním kontaktem',
              'rozdíl mezi individuální a týmovou potřebou',
              'pravděpodobný use-case',
              'signál nákupní připravenosti',
              'lepší vstup pro konzultaci',
            ]}
          />
        </div>

        <p className="mt-8 rounded-lg border border-stone-300 bg-white/45 p-5 leading-7 text-stone-700">
          Toto není finální strategie pro Aibility. Je to funkční prototyp jednoho akvizičního mechanismu. Pro reálný návrh by bylo potřeba znát obchodní cíle, cílové segmenty, strukturu nabídky, funnel, mediální mix, CRM a follow-up proces.
        </p>
      </div>
    </section>
  )
}

function ValueList({ icon, title, items }: { icon: ReactNode; title: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-stone-300 bg-white/55 p-6">
      <div className="mb-4 text-[#8b5a2c] [&_svg]:size-6">{icon}</div>
      <h3 className="text-2xl font-black">{title}</h3>
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-stone-700">
            <Check className="mt-0.5 size-5 shrink-0 text-[#8b5a2c]" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function CandidateBridge() {
  return (
    <section id="portfolio" className="bg-[#101114] px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-ember">KANDIDÁTSKÝ KONTEXT</p>
        <h2 className="mt-3 text-3xl font-black sm:text-5xl">Proč jsem demo navrhl právě takhle</h2>
        <p className="mt-5 text-lg leading-8 text-stone-300">
          Chtěl jsem ukázat způsob práce, který propojuje obsahový placement, reklamní kreativu, akvizici, segmentaci, produktovou nabídku a měřitelný lead. Nejde o jeden banner nebo jeden chatbot, ale o malý marketingový systém: od relevantního zájmu přes interakci až po doporučený další krok.
        </p>
        <p className="mt-5 text-lg leading-8 text-stone-300">
          Přesně v tom je moje síla: převádět business příležitost do konkrétního marketingového systému, který se dá spustit, testovat a zlepšovat.
        </p>
        <a
          href="https://david-koller-portfolio.vercel.app/"
          target="_blank"
          rel="noreferrer"
          className="mt-7 inline-flex items-center gap-2 rounded-md bg-ember px-5 py-3 font-bold text-ash transition hover:bg-[#efad64]"
        >
          Otevřít portfolio Davida Kollera
          <ArrowRight className="size-4" aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}

function buildResult(branch: Branch, answers: Answer[]): Result {
  const score = answers.reduce((sum, answer) => sum + answer.score, 0)
  const barrier = answers.find((answer) => answer.barrier)?.barrier ?? 'potřeba jasnějšího dalšího kroku'
  const format = answers.findLast((answer) => answer.format)?.format ?? 'praktické doporučení'
  const signal = answers.findLast((answer) => answer.signal)?.signal ?? branch.label.toLowerCase()

  if (branch.id === 'team_workflow') {
    return {
      segment: 'Týmový AI readiness lead',
      level: score >= 14 ? 'L3 Transformer' : 'L2 Builder',
      growthEdge: score >= 14 ? 'Měřit posun týmu, ne jen počet absolvovaných školení.' : 'Rozšířit individuální postup na týmový systém.',
      product: 'Týmový AI assessment / firemní program',
      productDetail: 'Doporučení inspirované nabídkou Aibility: začít baseline assessmentem, získat týmový přehled, navázat praktickým programem a po čase ověřit posun re-assessmentem.',
      rationale: 'Přemýšlíte nad tím, co by podobná AI logika znamenala pro celý tým. Největší hodnota není v jednom promptu, ale v baseline, týmovém přehledu a měřitelném posunu.',
      barrier,
      angle: `Navázat zprávou o tom, jak zmapovat ${signal}, AI level týmu a další praktický krok podle výsledků.`,
    }
  }

  if (score <= 3) {
    return {
      segment: branch.label,
      level: 'AI Explorer',
      growthEdge: 'Začít pravidelně používat AI na jeden opakovaný úkol.',
      product: 'Superpowered Assessment',
      productDetail: 'Doporučení inspirované nabídkou Aibility: nejdřív zjistit AI level, styl práce a Growth Edge, teprve potom vybírat trénink nebo workshop.',
      rationale: 'AI je pro vás zatím hlavně prostor k vyzkoušení. Největší posun teď uděláte tím, že získáte jasnou diagnózu a jeden praktický další krok.',
      barrier,
      angle: `Pomoci s bezpečným startem: ${barrier}, první opakovaný úkol a krátké doporučení dalšího kroku.`,
    }
  }

  if (score <= 8) {
    return {
      segment: branch.label,
      level: 'L1 Operator',
      growthEdge: 'Zlepšit práci s kontextem a iterací.',
      product: 'Superpowered Foundations',
      productDetail: `Doporučení inspirované nabídkou Aibility: praktické základy, práce s kontextem, iterací a převodem nápadu do použitelného výstupu. Preferovaný formát: ${format}.`,
      rationale: 'AI už pro vás není jen kuriozita. Potřebujete zlepšit zadání, iteraci a kvalitu výstupů, aby se z nápadu stal spolehlivý pracovní postup.',
      barrier,
      angle: `Ukázat praktický workshop na téma ${signal}: od zadání přes iteraci k použitelnému výstupu.`,
    }
  }

  if (score <= 13) {
    return {
      segment: branch.label,
      level: 'L2 Builder',
      growthEdge: 'Převést nápady do opakovatelného workflow.',
      product: branch.id === 'creative_workflow' || format.includes('builder') || format.includes('automatizace') ? 'Vibe Coding Summer' : 'Superpowered Foundations',
      productDetail: 'Doporučení inspirované nabídkou Aibility: jít za první prompt a stavět šablony, asistenty, jednoduché nástroje nebo workflow, ke kterým se dá vracet.',
      rationale: 'AI pro vás není jen jednorázový nástroj. Největší posun teď uděláte tím, že z nápadů vytvoříte opakovatelný workflow, který se dá zlepšovat a případně rozšířit na tým.',
      barrier,
      angle: `Nabídnout builder cestu: ${signal}, workflow šablona a první nástroj bez zbytečného přepálení.`,
    }
  }

  return {
    segment: branch.label,
    level: 'L3 Transformer',
    growthEdge: 'Rozšířit individuální postup na týmový systém.',
    product: 'Týmový AI assessment / pokročilý builder program',
    productDetail: 'Doporučení inspirované nabídkou Aibility: propojit individuální workflow s týmovým přehledem, baseline a dalšími use-casy, které půjdou měřit.',
    rationale: 'Uvažujete systémově: neřešíte jen výstup, ale opakovatelnost, nástroje a přenos do širšího pracovního kontextu.',
    barrier,
    angle: `Otevřít konzultaci nad tím, jak ${signal} převést do měřitelného týmového systému.`,
  }
}

export default App
