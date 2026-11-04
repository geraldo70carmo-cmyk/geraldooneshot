export interface LyricLine {
  en: string;
  pt: string;
  phonetic: string;
}

export interface LyricSection {
  title: string;
  type: 'verse' | 'pre-chorus' | 'chorus' | 'bridge';
  lines: LyricLine[];
}

export const SONG_TITLE = 'One Shot Tonight';
export const SONG_TRANSLATION = 'Uma chance esta noite';
export const AUDIO_ASSET_PATH = '/assets/aistudio/Hangin__Tough_Till_Morning_-_One_Shot_Tonight_91da7722.mp3';

export const SONG_SECTIONS: LyricSection[] = [
  {
    title: 'Verso 1',
    type: 'verse',
    lines: [
      {
        en: 'Got that feeling pulling on my sleeve',
        pt: 'Sinto aquela sensação puxando minha manga',
        phonetic: 'Gót dét fí-lin pú-lin on mái slív',
      },
      {
        en: "Morning sun and everything's okay",
        pt: 'Sol da manhã e está tudo bem',
        phonetic: 'Mór-nin sãn én é-vri-thins ou-kêi',
      },
      {
        en: 'Turn the radio up and I believe',
        pt: 'Aumento o volume do rádio e acredito',
        phonetic: 'Tãrn dâ rêi-diou âp én ái bi-lív',
      },
      {
        en: "Tonight we're gonna find a better way",
        pt: 'Que esta noite vamos encontrar um caminho melhor',
        phonetic: 'Tu-náit uâr gô-na fáind a bé-râr uêi',
      },
    ],
  },
  {
    title: 'Pré-Refrão',
    type: 'pre-chorus',
    lines: [
      {
        en: "And I won't look back",
        pt: 'E eu não vou olhar para trás',
        phonetic: 'Én-dái uount luc béc',
      },
      {
        en: 'Yeah I know the way',
        pt: 'Sim, eu sei o caminho',
        phonetic: 'Ié ái nôu dâ uêi',
      },
      {
        en: 'Gonna chase the light',
        pt: 'Vou perseguir a luz',
        phonetic: 'Gô-na tchêis dâ láit',
      },
      {
        en: 'To the break of day',
        pt: 'Até o raiar do dia',
        phonetic: 'Tu dâ brêic óv dêi',
      },
    ],
  },
  {
    title: 'Refrão',
    type: 'chorus',
    lines: [
      {
        en: 'Tell me why we only get one shot',
        pt: 'Diga-me por que só temos uma chance',
        phonetic: 'Tél mi uái uí ôun-li guét uãn shót',
      },
      {
        en: 'Tell me why we ever stop to wait',
        pt: 'Diga-me por que sequer paramos para esperar',
        phonetic: 'Tél mi uái uí é-vâr stóp tu uêit',
      },
      {
        en: "When the night is ours and it's so hot",
        pt: 'Quando a noite é nossa e está tão intensa',
        phonetic: 'Uén dâ náit iz áurs én íts sôu rót',
      },
      {
        en: "Tell me why we're standing at the gate",
        pt: 'Diga-me por que estamos parados no portão',
        phonetic: 'Tél mi uái uâr stén-din ét dâ guêit',
      },
      {
        en: 'Why, why, why, why, why, why, why, why',
        pt: 'Por que, por que, por que, por que, por que, por que, por que, por que',
        phonetic: 'Uái, uái, uái, uái, uái, uái, uái, uái',
      },
      {
        en: 'Tell me... why',
        pt: 'Diga-me... por que',
        phonetic: 'Tél mi... uái',
      },
    ],
  },
  {
    title: 'Verso 2',
    type: 'verse',
    lines: [
      {
        en: 'Heartbeat keeping time with mine',
        pt: 'Coração batendo no mesmo tempo que o meu',
        phonetic: 'Rárt-bit kí-pin táim uíth máin',
      },
      {
        en: 'Every city neon in my eyes',
        pt: 'O neon de todas as cidades em meus olhos',
        phonetic: 'É-vri sí-ti ní-on in mái áis',
      },
      {
        en: 'Take my hand and leave the world behind',
        pt: 'Pegue minha mão e deixe o mundo para trás',
        phonetic: 'Têic mái rénd én lív dâ uârld bi-ráind',
      },
      {
        en: 'No more waiting for the compromise',
        pt: 'Chega de esperar por um meio-termo',
        phonetic: 'Nôu mór uêi-tin for dâ kóm-pro-máis',
      },
    ],
  },
  {
    title: 'Ponte',
    type: 'bridge',
    lines: [
      {
        en: "Don't you know the moment's ours",
        pt: 'Você não sabe que o momento é nosso?',
        phonetic: 'Dount iu nôu dâ môu-mênts áurs',
      },
      {
        en: "Don't you know we got the power",
        pt: 'Você não sabe que nós temos o poder?',
        phonetic: 'Dount iu nôu uí gót dâ pá-uâr',
      },
      {
        en: 'Shout it out from every tower',
        pt: 'Grite isso de cada torre',
        phonetic: 'Sháu-ri-ráut from é-vri tá-uâr',
      },
      {
        en: 'This is our forever hour',
        pt: 'Esta é a nossa hora para sempre',
        phonetic: 'Dís iz áur fo-ré-vâr á-uâr',
      },
    ],
  },
];
