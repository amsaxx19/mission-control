import { 
  Video, 
  Target, 
  TrendingUp, 
  Users, 
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock
} from 'lucide-react'

export default function TikTokStrategy() {
  const accounts = [
    {
      name: '@amosthiosa',
      type: 'Affiliate Machine',
      focus: 'Revenue Generator (25jt → 100jt)',
      freq: '3-4x/day',
      status: 'active',
      products: ['Obat semprot idung', 'Skincare', 'Haircare']
    },
    {
      name: '@amosfounder',
      type: 'CuanBoss Founder',
      focus: 'Personal Brand + Anti-Kabur',
      freq: '1-2x/day',
      status: 'pending',
      goal: '100K followers 2026'
    }
  ]

  const pillars = [
    {
      title: 'Kepulangan Series',
      desc: 'Day 1, Day 7, Day 30 countdown pulang dari Australia',
      status: 'ready'
    },
    {
      title: 'Anti-Kabur Manifesto',
      desc: 'Bantah narrative "kerja di Australia enak"',
      status: 'ready'
    },
    {
      title: 'CuanBoss Journey',
      desc: 'Behind the scenes bangun startup dari nol',
      status: 'planning'
    },
    {
      title: 'Networking & Collab',
      desc: 'Kenal artis/selebgram untuk reach 100K',
      status: 'planning'
    }
  ]

  const roadmap = [
    { q: 'Q1', target: '10K', focus: 'Foundation, launch, Day 1 series', status: 'in_progress' },
    { q: 'Q2', target: '30K', focus: 'CuanBoss launch, viral push', status: 'pending' },
    { q: 'Q3', target: '60K', focus: 'Events, media, collabs', status: 'pending' },
    { q: 'Q4', target: '100K+', focus: 'Domination, artis collabs', status: 'pending' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
              <Video className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">TikTok Domination Strategy</h2>
              <p className="text-sm text-muted-foreground">Scale 25jt → 100jt + 100K followers</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-medium">
              🟢 Ready to Execute
            </span>
          </div>
        </div>
      </div>

      {/* Two Account Strategy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {accounts.map((account, idx) => (
          <div key={idx} className="glass-card p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-lg">{account.name}</h3>
                <p className="text-sm text-muted-foreground">{account.type}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                account.status === 'active' 
                  ? 'bg-emerald-500/20 text-emerald-400' 
                  : 'bg-amber-500/20 text-amber-400'
              }`}>
                {account.status === 'active' ? 'Active' : 'Create Now'}
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Focus:</span>
                <span>{account.focus}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Frequency:</span>
                <span>{account.freq}</span>
              </div>
              {account.products && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Products:</span>
                  <span className="text-right">{account.products.join(', ')}</span>
                </div>
              )}
              {account.goal && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Goal:</span>
                  <span className="text-emerald-400">{account.goal}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Content Pillars */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Content Pillars (@amosfounder)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pillars.map((pillar, idx) => (
            <div key={idx} className="p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                {pillar.status === 'ready' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Clock className="w-4 h-4 text-amber-400" />
                )}
                <span className="font-medium">{pillar.title}</span>
              </div>
              <p className="text-sm text-muted-foreground">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 100K Roadmap */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          100K Followers Roadmap 2026
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {roadmap.map((item, idx) => (
            <div key={idx} className={`p-4 rounded-lg border ${
              item.status === 'in_progress'
                ? 'bg-primary/10 border-primary/30'
                : 'bg-white/5 border-white/10'
            }`}>
              <div className="text-2xl font-bold mb-1">{item.target}</div>
              <div className="text-sm font-medium mb-2">{item.q}</div>
              <p className="text-xs text-muted-foreground">{item.focus}</p>
              {item.status === 'in_progress' && (
                <span className="inline-block mt-2 text-xs text-primary">● In Progress</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Immediate Actions */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-400" />
          Immediate Actions (Today)
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
            <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-xs font-bold text-amber-400">1</div>
            <div className="flex-1">
              <p className="font-medium">Create @amosfounder account</p>
              <p className="text-sm text-muted-foreground">Bio: "PR Australia → Pulang ke Indonesia. Founder CuanBoss. Anti-kabur."</p>
            </div>
            <span className="px-2 py-1 rounded bg-red-500/20 text-red-400 text-xs">URGENT</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
            <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-xs font-bold text-amber-400">2</div>
            <div className="flex-1">
              <p className="font-medium">Record Day 1 video</p>
              <p className="text-sm text-muted-foreground">"Gue resign dari kerjaan Australia. Gaji? 70jt/bulan. Kenapa?"</p>
            </div>
            <span className="px-2 py-1 rounded bg-amber-500/20 text-amber-400 text-xs">TODAY</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
            <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-xs font-bold text-amber-400">3</div>
            <div className="flex-1">
              <p className="font-medium">@amosthiosa: 3x affiliate posts</p>
              <p className="text-sm text-muted-foreground">Focus: obat semprot idung, test new hooks</p>
            </div>
            <span className="px-2 py-1 rounded bg-amber-500/20 text-amber-400 text-xs">TODAY</span>
          </div>
        </div>
      </div>

      {/* Status Footer */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>Created: Feb 2, 2026</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span>Assigned to: Shuri (Research), Loki (Content)</span>
        </div>
      </div>
    </div>
  )
}