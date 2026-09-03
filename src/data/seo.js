/**
 * Per-route titles and descriptions, plus the JSON-LD the site publishes.
 *
 * Read by the prerenderer at build time (so the tags ship in the served HTML)
 * and by the client router on navigation (so they stay correct after a
 * client-side page change). Keeping both on one source avoids the classic
 * mismatch where the crawler and the browser see different metadata.
 */

import { NOT_FOUND, SITE_URL, urlFor } from './routes'

export const ORG_NAME = 'TE Labs'
export const ORG_EMAIL = 'tahinaelisa@telabs.fr'
export const ORG_PHONE = '+33613344339'
export const ORG_LOGO = `${SITE_URL}/assets/telabs-logo-purple.png`
export const OG_IMAGE = `${SITE_URL}/assets/telabs-og.png`
export const FOUNDING_YEAR = '2024'

export const META = {
  fr: {
    home: {
      title: 'TE Labs — Studio créatif & digital à Paris | Web, IA, Social',
      description:
        "Studio de création et de technologie à Paris. Identité de marque, sites web, films sublimés par l'IA et réseaux sociaux — une seule équipe pour tous vos points de contact.",
    },
    services: {
      title: 'Services : web, apps, logiciels, social & vidéo IA | TE Labs',
      description:
        "Sites web, applications mobiles, logiciels sur mesure, réseaux sociaux et films produits par IA. Une équipe bilingue FR / EN basée à Paris.",
    },
    work: {
      title: 'Créatif — films IA & contenus sociaux | TE Labs',
      description:
        "Nos réalisations créatives récentes : films de marque produits par IA et contenus pour les réseaux sociaux. Découvrez le travail livré par le studio TE Labs.",
    },
    tech: {
      title: 'Tech — sites web, applications & logiciels | TE Labs',
      description:
        "Découvrez les sites web, applications, logiciels et études de cas de TE Labs : des expériences rapides, soignées et pensées pour convertir.",
    },
    conektAds: {
      title: "ConektAds — logiciel de gestion d'affichage extérieur | TE Labs",
      description:
        "Découvrez ConektAds, une plateforme qui centralise l'inventaire de panneaux, la recherche cartographique, les demandes clients, les devis et les plans média.",
    },
    taqtona: {
      title: "Taqtona — l'IA pour la production industrielle | TE Labs",
      description:
        "Découvrez Taqtona, une suite IA qui automatise l'inspection des plans, le pilotage de production, la programmation CNC et bientôt le chiffrage DFM.",
    },
    globalScholarship: {
      title: 'The Global Scholarship — recherche et alertes de bourses | TE Labs',
      description:
        "Découvrez une plateforme qui centralise les opportunités étudiantes, les rapproche du profil de chacun et envoie des alertes pour agir avant les échéances.",
    },
    contact: {
      title: 'Contact — parlez-nous de votre marque | TE Labs',
      description:
        "Quelques lignes suffisent. Écrivez à tahinaelisa@telabs.fr ou au +33 6 13 34 43 39 — une vraie personne vous répond, souvent le jour même. Studio basé à Paris.",
    },
    notfound: {
      title: 'Page introuvable (404) | TE Labs',
      description:
        "Cette page n'existe pas ou a été déplacée. Retrouvez les services, les réalisations et le contact du studio TE Labs.",
    },
  },
  en: {
    home: {
      title: 'TE Labs — Paris Creative & Digital Studio | Web, AI, Social',
      description:
        'A Paris-based creative technology studio building brands that get noticed, content that is remembered and digital experiences that convert. One team, every touchpoint.',
    },
    services: {
      title: 'Services: Web, Apps, Software, Social & AI Video | TE Labs',
      description:
        'Websites, mobile apps, custom software, social media and AI-produced films from one bilingual creative technology team based in Paris.',
    },
    work: {
      title: 'Creative — AI Films & Social Content | TE Labs',
      description:
        'Recent creative work grouped by service: AI-produced brand films and social content. See what the TE Labs studio has delivered for ambitious brands.',
    },
    tech: {
      title: 'Tech — Websites, Apps & Software | TE Labs',
      description:
        'Explore websites, apps, software and case studies from TE Labs: fast, polished digital products shaped around users and business results.',
    },
    conektAds: {
      title: 'ConektAds — Outdoor Advertising Management Software | TE Labs',
      description:
        'Discover ConektAds, a platform that brings billboard inventory, map discovery, customer inquiries, quotes and media plans into one connected workflow.',
    },
    taqtona: {
      title: 'Taqtona — AI for Manufacturing | TE Labs',
      description:
        'Discover Taqtona, an AI manufacturing suite for automated drawing inspection, production and inventory control, CNC programming and upcoming DFM costing.',
    },
    globalScholarship: {
      title: 'The Global Scholarship — Opportunity Matching Platform | TE Labs',
      description:
        'Discover a platform that brings student opportunities into one place, matches them to each profile and sends timely alerts before application deadlines.',
    },
    contact: {
      title: 'Contact — Tell Us About Your Brand | TE Labs',
      description:
        'A few lines is plenty. Email tahinaelisa@telabs.fr or call +33 6 13 34 43 39 — a real person replies, usually the same day. Creative studio based in Paris.',
    },
    notfound: {
      title: 'Page Not Found (404) | TE Labs',
      description:
        'This page does not exist or has moved. Find the services, the work and the contact details of the TE Labs studio.',
    },
  },
}

const DEFAULT_META_LANG = 'fr'

export function metaFor(page, lang) {
  return META[lang]?.[page] || META[DEFAULT_META_LANG][page] || META[DEFAULT_META_LANG].home
}

/**
 * The brand entity, declared once in machine-readable form.
 *
 * ProfessionalService rather than plain Organization: it inherits LocalBusiness,
 * so the Paris location and the contact details carry local weight. `sameAs` is
 * deliberately absent until real social profile URLs exist — an empty or guessed
 * sameAs is worse than none.
 */
export function organizationSchema(lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${SITE_URL}/#organization`,
    name: ORG_NAME,
    url: `${SITE_URL}/`,
    logo: ORG_LOGO,
    image: ORG_LOGO,
    email: ORG_EMAIL,
    telephone: ORG_PHONE,
    foundingDate: FOUNDING_YEAR,
    description: META[lang].home.description,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Paris',
      addressCountry: 'FR',
    },
    areaServed: [
      { '@type': 'Country', name: 'France' },
      { '@type': 'City', name: 'Paris' },
    ],
    knowsLanguage: ['fr-FR', 'en'],
    priceRange: '€€€',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: lang === 'fr' ? 'Services TE Labs' : 'TE Labs services',
      itemListElement: [
        lang === 'fr' ? 'Gestion des réseaux sociaux' : 'Social media management',
        lang === 'fr' ? 'Création de sites web' : 'Website development',
        lang === 'fr' ? "Développement d'applications" : 'App development',
        lang === 'fr' ? 'Développement logiciel sur mesure' : 'Custom software development',
        lang === 'fr' ? 'Vidéo IA' : 'AI video production',
      ].map((name) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name, provider: { '@id': `${SITE_URL}/#organization` } },
      })),
    },
  }
}

export function websiteSchema(lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: `${SITE_URL}/`,
    name: ORG_NAME,
    inLanguage: lang === 'fr' ? 'fr-FR' : 'en',
    publisher: { '@id': `${SITE_URL}/#organization` },
  }
}

/** The five Q&As already written in copy.js, marked up so they can win snippets. */
export function faqSchema(t, lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: lang === 'fr' ? 'fr-FR' : 'en',
    mainEntity: [
      [t.tQ1, t.tA1],
      [t.tQ2, t.tA2],
      [t.tQ3, t.tA3],
      [t.tQ4, t.tA4],
      [t.tQ5, t.tA5],
    ].map(([q, a]) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }
}

/** The four-step process section, which was already structured for HowTo. */
export function howToSchema(t, lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `${t.tProcessTitleA} ${t.tProcessTitleB}`,
    inLanguage: lang === 'fr' ? 'fr-FR' : 'en',
    step: [
      [t.tStep1, t.tStep1Body],
      [t.tStep2, t.tStep2Body],
      [t.tStep3, t.tStep3Body],
      [t.tStep4, t.tStep4Body],
    ].map(([name, text], i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name,
      text,
      url: `${urlFor('home', lang)}#process`,
    })),
  }
}

export function breadcrumbSchema(page, lang, t) {
  const labels = {
    services: t.tServices,
    work: t.tCreative,
    tech: t.tTech,
    conektAds: 'ConektAds',
    taqtona: 'Taqtona',
    globalScholarship: 'The Global Scholarship',
    contact: t.tContact,
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: t.tHome, item: urlFor('home', lang) },
      { '@type': 'ListItem', position: 2, name: labels[page], item: urlFor(page, lang) },
    ],
  }
}

/** Everything a given route should publish, as an array of JSON-LD objects. */
export function schemasFor(page, lang, t) {
  // The error page asserts nothing. It has no canonical URL for an @id to point
  // at and no place in a breadcrumb trail, and it ships noindex anyway.
  if (page === NOT_FOUND) return []
  const base = [organizationSchema(lang), websiteSchema(lang)]
  if (page === 'home') return [...base, faqSchema(t, lang), howToSchema(t, lang)]
  return [...base, breadcrumbSchema(page, lang, t)]
}
