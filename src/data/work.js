/**
 * The films are served from this repo, not from a CDN.
 *
 * They used to come from Cloudinary under a `w_540,q_auto` transformation —
 * that account was suspended and took every URL down with it, so the same
 * resize now happens once, ahead of time, in scripts/encode-videos.mjs. The
 * reasoning it encoded is unchanged: no grid shows a film wider than ~380 CSS
 * px, so 540 keeps it 1.5x oversampled. All sixteen land at 19 MB together.
 *
 * Anything still hosted elsewhere (the Framer social reels) passes through
 * untouched and simply has no poster, exactly as before.
 */
const LOCAL = '/assets/video/';

/** Local files are already at delivery size, so there is nothing to rewrite. */
export const videoSrc = (src) => src;

/**
 * A still of the first frame, so a tile paints before a byte of video moves.
 * Every local film has a `.jpg` sibling written by the encode script; the
 * remote ones have none, and undefined is what <AutoVideo> expects for those.
 */
export const videoPoster = (src) =>
  src && src.startsWith(LOCAL) ? src.replace(/\.mp4$/, '.jpg') : undefined;

/** Portfolio items — swap `src` when you have real stills / films. */
export const SOCIAL_WORK = [
  { id: 's1', title: 'Maison Lumière', videoSrc: 'https://framerusercontent.com/assets/e0TRcv0MravqhUJet44NouVkos.mp4' },
  { id: 's2', title: 'Royal Ritz', videoSrc: 'https://framerusercontent.com/assets/LT8LknkT9i2BLeB4XOlnpegHM.mp4' },
  { id: 's3', title: 'King Ice Cream', videoSrc: 'https://framerusercontent.com/assets/QEULegvNbUOj5xGRC0qTE3JDKXo.mp4' },
  { id: 's4', title: 'Manoj jewellers', videoSrc: 'https://framerusercontent.com/assets/G1q7RAi5BwMr4QsLOKkqWKKKY.mp4' },
  { id: 's5', title: 'Smash Guys', videoSrc: 'https://framerusercontent.com/assets/i0GGrfKLXHnL3qTeex3GHcN0FyI.mp4' },
  { id: 's6', title: 'Adithya Milk', videoSrc: 'https://framerusercontent.com/assets/pyMKsGtTFLnUyqx3HlHbjMRJHj0.mp4' },
  { id: 's7', title: 'King Ice Cream', videoSrc: 'https://framerusercontent.com/assets/HIGz2dtxsz7k2lLAcZEmAANCuhk.mp4' },
  { id: 's8', title: 'Meetha Bharath', videoSrc: 'https://framerusercontent.com/assets/rbeCBVQSGNz14Hac8RGmbwVRiM.mp4' },
];

export const WEB_WORK = [
  { id: 'w1', title: 'Blckole', thumbnail: '/assets/Project/blckole.webp', url: 'https://www.blckole.com/' },
  { id: 'w2', title: 'Kamat Annaleela', thumbnail: '/assets/Project/kamatannaleela.webp', url: 'https://www.kamatannaleela.com/' },
  { id: 'w3', title: 'Sourberry', thumbnail: '/assets/Project/sourberry.webp', url: 'https://www.sourberryentertainment.com/' },
  { id: 'w4', title: 'Camorent', thumbnail: '/assets/Project/camorent.webp', url: 'https://www.camorent.com/' },
  { id: 'w5', title: 'Golt', thumbnail: '/assets/Project/golt.webp', url: 'https://play.google.com/store/apps/details?id=com.ajmalca.client' },
  { id: 'w6', title: 'Expenza', thumbnail: '/assets/Project/expenza.webp', url: 'https://play.google.com/store/apps/details?id=com.mohit29kr.expenza' },
  { id: 'w7', title: 'Nxtgen', thumbnail: '/assets/Project/nxtgenservices.webp', url: 'https://www.nxtgenservices.in/' },
  { id: 'w8', title: 'Mockit', thumbnail: '/assets/Project/mockit.webp', url: 'https://mockit-interview.vercel.app/' },
  { id: 'w9', title: 'SuperGem', thumbnail: '/assets/Project/supergem.webp', url: 'https://www.supergem.in/' },
];

export const VIDEO_WORK = [
  {
    id: 'v24',
    label: 'IMG 4782',
    videoSrc: '/assets/video/img-4782.mp4',
    width: 1080,
    height: 1920,
  },
  
  // {
  //   id: 'v9',
  //   label: 'Smash Guys AI Reel',
  //   videoSrc: 'https://res.cloudinary.com/do1w46bzr/video/upload/v1785830325/smash_guys_ai_reel_zgxlvt.mp4',
  //   width: 1080,
  //   height: 1920,
  // },
  {
    id: 'v23',
    label: 'Arveen Perfume',
    videoSrc: '/assets/video/arveen-perfume.mp4',
    width: 1080,
    height: 1920,
  },
  
  // {
    //   id: 'v3',
    //   label: 'Final Edit Video 02',
    //   videoSrc: 'https://res.cloudinary.com/do1w46bzr/video/upload/v1785830348/Final_Edit_Video_2_whsjbq.mp4',
  //   width: 1920,
  //   height: 1080,
  // },
  // {
  //   id: 'v4',
  //   label: 'Flipkart 02',
  //   videoSrc: 'https://res.cloudinary.com/do1w46bzr/video/upload/v1785830341/flipkart2_u1tydv.mp4',
  //   width: 1920,
  //   height: 1080,
  // },
  // {
  //   id: 'v5',
  //   label: 'Flipkart 01',
  //   videoSrc: 'https://res.cloudinary.com/do1w46bzr/video/upload/v1785830339/filpkart_zwismh.mp4',
  //   width: 1920,
  //   height: 1080,
  // },

  {
    id: 'v25',
    label: 'IMG 4782',
    videoSrc: '/assets/video/bici.mp4',
    width: 1920,
    height: 1080,
  },
  {
    id: 'v1',
    label: 'WhatsApp Video 01',
    videoSrc: '/assets/video/whatsapp-video-01.mp4',
    width: 1080,
    height: 1920,
  },
  {
    id: 'v26',
    label: 'IMG 4782',
    videoSrc: '/assets/video/2nd-trial.mp4',
    width: 1920,
    height: 1080,
  },
  
  {
    id: 'v7',
    label: 'WhatsApp Video 03',
    videoSrc: '/assets/video/whatsapp-video-03.mp4',
    width: 1024,
    height: 576,
  },
  {
    id: 'v8',
    label: 'WhatsApp Video 04',
    videoSrc: '/assets/video/whatsapp-video-04.mp4',
    width: 1024,
    height: 576,
  },

  {
    id: 'v6',
    label: 'WhatsApp Video 02',
    videoSrc: '/assets/video/whatsapp-video-02.mp4',
    width: 864,
    height: 496,
  },
  
  // {
  //   id: 'v10',
  //   label: 'IMG 1384',
  //   videoSrc: 'https://res.cloudinary.com/do1w46bzr/video/upload/v1785830322/IMG_1384_ryy0ls.mp4',
  //   width: 1920,
  //   height: 1080,
  // },
  {
    id: 'v11',
    label: 'Video 938',
    videoSrc: '/assets/video/video-938.mp4',
    width: 1920,
    height: 1080,
  },
  {
    id: 'v12',
    label: 'Video 680',
    videoSrc: '/assets/video/video-680.mp4',
    width: 1268,
    height: 720,
  },
//   {
//     id: 'v13',
//     label: 'Meetha Bharat Diwali AI Reel',
//     videoSrc: 'https://res.cloudinary.com/do1w46bzr/video/upload/v1785830320/meetha_Bharat_Diwali_AI_reel_2._viqozv.mp4',
//     width: 1080,
//     height: 1920,
//   },
  {
    id: 'v14',
    label: 'Paris Panini',
    videoSrc: '/assets/video/paris-panini.mp4',
    width: 1080,
    height: 1938,
  },
  {
    id: 'v15',
    label: 'AI Film 01',
    videoSrc: '/assets/video/ai-film-01.mp4',
    width: 1076,
    height: 1928,
  },
  {
    id: 'v16',
    label: "Marki's Advertisement",
    videoSrc: '/assets/video/markis-advertisement.mp4',
    width: 1920,
    height: 1080,
  },
  {
    id: 'v17',
    label: 'AI Film 02',
    videoSrc: '/assets/video/ai-film-02.mp4',
    width: 1076,
    height: 1928,
  },
//   {
//     id: 'v18',
//     label: 'Big Mishra AI Reel — Revised',
//     videoSrc: 'https://res.cloudinary.com/do1w46bzr/video/upload/v1785830290/Big_mishra_Ai_reel_changed_mcw1wj.mp4',
//     width: 1080,
//     height: 1920,
//   },
  // {
  //   id: 'v19',
  //   label: 'Big Mishra AI Reel',
  //   videoSrc: 'https://res.cloudinary.com/do1w46bzr/video/upload/v1785830285/Big_Mishra_ai_reel_qcalzp.mp4',
  //   width: 1920,
  //   height: 1080,
  // },
  {
    id: 'v20',
    label: 'Lakmé Ad',
    videoSrc: '/assets/video/lakme-ad.mp4',
    width: 1920,
    height: 1080,
  },
  {
    id: 'v21',
    label: 'Lenskart',
    videoSrc: '/assets/video/lenskart.mp4',
    width: 1920,
    height: 1080,
  },
//   {
//     id: 'v22',
//     label: 'IMG 6483',
//     videoSrc: 'https://res.cloudinary.com/do1w46bzr/video/upload/v1785830270/IMG_6483_m4dacb.mp4',
//     width: 1080,
//     height: 1920,
//   },
  
  // {
  //   id: 'v27',
  //   label: 'IMG 4782',
  //   videoSrc: 'https://res.cloudinary.com/do1w46bzr/video/upload/v1785830325/smash_guys_ai_reel_zgxlvt.mp4',
  //   width: 1080,
  //   height: 1920,
  // },
];

export const REEL_SLOTS = VIDEO_WORK.filter((item) => item.width > item.height);
