export type LightingMode = 'morning' | 'deep' | 'twilight';

export interface LightingPreset {
  id: LightingMode;
  label: string;
  description: string;
  backdropClass: string;
  glowClass: string;
  rimColor: string;
}

export interface DebutMilestone {
  id: string;
  step: string;
  dateLabel: string;
  title: string;
  summary: string;
  detail: string;
  statusLabel: string;
}

export interface BottleMessage {
  id: string;
  nickname: string;
  message: string;
  sentAtLabel: string;
}

export const SHIINA_WHISPERS: string[] = [
  '「はじめまして！蒼い海の底から、あなたの画面へ会いに行きますっ」',
  '「12月31日の大晦日、いちばん最初の歌を聴いてくれますか？」',
  '「お気に入りのフリルドレスでおめかしして待ってるからね！」',
  '「クラゲさんたちも、デビューのお祝いを楽しみにしてるみたいです」',
  '「ラムネ色の泡みたいに、きらきらした時間を一緒に作りたいな」',
  '「シルエットの向こう側、早くみんなにお披露目したいなぁ…」',
];

export const LIGHTING_PRESETS: LightingPreset[] = [
  {
    id: 'morning',
    label: '朝の浅瀬',
    description: '澄みきった海の光がふんわり広がるクリアブルー',
    backdropClass: 'from-[#eef4ff] via-[#dce8ff] to-[#bfd4ff]',
    glowClass: 'bg-[#93b4ff]/35',
    rimColor: 'rgba(0, 56, 168, 0.22)',
  },
  {
    id: 'deep',
    label: '深海の星屑',
    description: 'シルエットと同じ深い蒼が映えるミッドナイトブルー',
    backdropClass: 'from-[#00287a] via-[#0038a8] to-[#1a56d6]',
    glowClass: 'bg-[#6094ff]/35',
    rimColor: 'rgba(0, 56, 168, 0.35)',
  },
  {
    id: 'twilight',
    label: '夕凪ブルー',
    description: 'やさしい水平線のグラデーションが溶け合うロイヤルブルー',
    backdropClass: 'from-[#dbe7ff] via-[#7da8ff] to-[#0038a8]',
    glowClass: 'bg-[#ffffff]/55',
    rimColor: 'rgba(0, 56, 168, 0.28)',
  },
];

export const PROFILE_TABS = [
  {
    id: 'basic',
    label: '基本情報',
    items: [
      { key: 'お名前', value: 'シイナ（しいな）' },
      { key: 'デビュー日', value: '2026年12月31日 20:00 日本時間' },
      { key: '出身', value: '静かな蒼い海のほとり' },
      { key: '活動内容', value: 'お歌・雑談・ゆったりゲーム配信' },
    ],
  },
  {
    id: 'favorites',
    label: 'すきなもの',
    items: [
      { key: 'すきな飲み物', value: 'ビー玉入りのラムネソーダ' },
      { key: 'お気に入り', value: 'たくさんのリボンと蒼いフリルドレス' },
      { key: 'マイブーム', value: 'クラゲの観察と深夜の弾き語り' },
      { key: '好きな季節', value: '空気が澄んだ冬の海辺' },
    ],
  },
  {
    id: 'stream',
    label: '初配信の予定',
    items: [
      { key: '前半パート', value: 'お姿の初公開＆自己紹介トーク' },
      { key: '中盤パート', value: 'デビュー記念オリジナルカバー歌唱' },
      { key: '後半パート', value: '応援ボトルのお便り読み上げ' },
      { key: '配信場所', value: '公式配信チャンネル（公開準備中）' },
    ],
  },
] as const;

export const DEBUT_MILESTONES: DebutMilestone[] = [
  {
    id: 'teaser',
    step: '01',
    dateLabel: '公開中',
    title: 'ティザーサイト公開',
    summary: '海辺のカウントダウンが始まりました。',
    detail:
      '大晦日のデビューに向けて、この特設ページを公開しました。応援ボトルや通知予約で、初配信までの時間を一緒に楽しんでくださいね。',
    statusLabel: '進行中',
  },
  {
    id: 'silhouette',
    step: '02',
    dateLabel: '11月下旬',
    title: 'シルエット＆キービジュアル予告',
    summary: 'リボンとフリルのお姿のヒントをお届け。',
    detail:
      '蒼いシルエットに続き、衣装の細部や小さな設定画を少しずつ公開していく予定です。',
    statusLabel: '準備中',
  },
  {
    id: 'voice',
    step: '03',
    dateLabel: '12月中旬',
    title: 'ティザー映像・初ボイスの公開',
    summary: 'はじめての歌声とあいさつをお届けします。',
    detail:
      '動くお姿のプレビューとともに、シイナの声や雰囲気を感じられる短いティザームービーを公開します。',
    statusLabel: '予定',
  },
  {
    id: 'debut',
    step: '04',
    dateLabel: '2026年12月31日',
    title: '大晦日 初配信デビュー',
    summary: '20:00より、みなさんと出会う最初の夜。',
    detail:
      '一年の締めくくりであり、シイナにとっては始まりの夜。温かいお茶やラムネを用意して、ぜひ遊びに来てください。',
    statusLabel: '目標日',
  },
];

export const INITIAL_BOTTLE_MESSAGES: BottleMessage[] = [
  {
    id: 'seed-1',
    nickname: 'みなと',
    message: '大晦日の初配信、今からカレンダーに印をつけて待っています！',
    sentAtLabel: '海辺から',
  },
  {
    id: 'seed-2',
    nickname: 'しずく',
    message: 'フリルとリボンのシルエットがとても可愛いです。歌声も楽しみにしています！',
    sentAtLabel: '潮風より',
  },
  {
    id: 'seed-3',
    nickname: 'うみねこ',
    message: '蒼い海の世界観がすてきです。12月31日の20時に必ず会いに行きますね。',
    sentAtLabel: '波打ち際から',
  },
];
