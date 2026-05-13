import React from "react";

const navy = "#21143f";
const red = "#cf1f45";
const yellow = "#f3b429";
const blue = "#1569ad";

function TriLogo({ letter = "A", color = blue, label = "异常体" }) {
  return (
    <div className="flex items-center gap-4">
      <div className="relative w-20 h-16">
        <div
          className="absolute inset-0"
          style={{
            clipPath: "polygon(50% 0, 100% 100%, 0 100%)",
            background: color,
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center pt-4 text-4xl font-black text-white">
          {letter}
        </div>
      </div>
      <div className="flex-1">
        <div className="text-2xl font-black" style={{ color }}>{label}</div>
        <div className="h-1 mt-2" style={{ background: color }} />
      </div>
    </div>
  );
}

function FieldLine({ label, color = navy }) {
  return (
    <div className="mb-7">
      <div className="font-black text-xl mb-4" style={{ color }}>{label}</div>
      <div className="border-b-2" style={{ borderColor: color }} />
    </div>
  );
}

function TinyTriangles({ count = 7 }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="w-7 h-6 border-2 border-slate-200" style={{ clipPath: "polygon(50% 0, 100% 100%, 0 100%)" }} />
      ))}
    </div>
  );
}

function ScoreRow({ label }) {
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="w-16 h-14 bg-rose-50" style={{ clipPath: "polygon(50% 0, 100% 100%, 0 100%)" }} />
      <div className="w-16 font-black text-xl" style={{ color: navy }}>{label}</div>
      <TinyTriangles count={7} />
    </div>
  );
}

function BulletBlock({ color, title, text, children }) {
  return (
    <div className="relative pl-8 py-2 mb-6">
      <div className="absolute left-0 top-4 w-0 h-0 border-y-[9px] border-y-transparent border-l-[15px]" style={{ borderLeftColor: color }} />
      <div className="absolute left-2 top-12 bottom-0 border-l-2" style={{ borderColor: color }} />
      <div className="font-black text-2xl" style={{ color }}>{title}</div>
      <div className="font-bold text-sm" style={{ color: navy }}>{text}</div>
      {children}
    </div>
  );
}

function Page({ children }) {
  return <section className="w-[768px] min-h-[1024px] bg-white p-11 mx-auto mb-10 shadow-xl print:shadow-none">{children}</section>;
}

function Page1() {
  return (
    <Page>
      <div className="grid grid-cols-2 gap-8">
        <div>
          <FieldLine label="角色姓名" />
          <FieldLine label="机构头衔" />
          <FieldLine label="机构评级" />
          <div className="mt-8 space-y-5">
            {["嘉奖", "申诫", "额外过载"].map((x) => (
              <div className="flex items-center gap-4" key={x}>
                <div className="w-10 h-10 rounded-full border-4 flex items-center justify-center font-black" style={{ color: red, borderColor: red }}>★</div>
                <div className="w-12 border-b-2" style={{ borderColor: red }} />
                <div className="text-3xl font-black" style={{ color: navy }}>{x}</div>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <BulletBlock color={yellow} title="现实触发器" text="你的GM可随时触发此项。" />
            <BulletBlock color={yellow} title="过载解除" text="勾选此项，以查看是否能解除你的过载。" />
            <BulletBlock color={red} title="首要指令" text="如果你……，则获得1点申诫：" />
            <BulletBlock color={red} title="许可行为" text="当你完成以下任一事项时，获得1点嘉奖：">
              <div className="mt-4 space-y-3 text-xl" style={{ color: red }}>▷<br />▷<br />▷</div>
              <div className="mt-4 text-sm font-bold" style={{ color: navy }}>如果你在单次任务中完成全部 3 项，将获得 3 点额外嘉奖。</div>
            </BulletBlock>
          </div>
        </div>
        <div>
          <div className="mb-2 text-xl font-black" style={{ color: navy }}>人称代词</div>
          <TriLogo letter="A" color={blue} label="异常体" />
          <TriLogo letter="R" color={yellow} label="现实" />
          <TriLogo letter="C" color={red} label="职能" />
          <div className="mt-12 flex justify-between items-start">
            <div className="text-4xl font-black leading-tight" style={{ color: navy }}>资质<br />保证</div>
            <div className="text-7xl font-black rotate-[-20deg]" style={{ color: red }}>Q</div>
          </div>
          <div className="mt-4">
            {['专注','欺瞒','活力','共情','主动','坚毅','气场','专业','诡秘'].map((x) => <ScoreRow key={x} label={x} />)}
          </div>
        </div>
      </div>
    </Page>
  );
}

function AbilityCard() {
  return (
    <div className="border rounded-xl overflow-hidden mb-4" style={{ borderColor: '#bdd2e6' }}>
      <div className="grid grid-cols-[45%_40%_15%] bg-blue-50 text-sm font-black" style={{ color: blue }}>
        <div className="p-3 border-r">能力</div><div className="p-3 border-r">触发器</div><div className="p-3">资质</div>
      </div>
      <div className="grid grid-cols-2 gap-6 p-4">
        <div>
          <div className="font-black mb-2" style={{ color: blue }}>▲ 成功时，</div>
          {Array.from({length:6}).map((_,i)=><div key={i} className="border-b my-4" style={{borderColor:'#8bb0d1'}} />)}
        </div>
        <div>
          <div className="font-black mb-2" style={{ color: red }}>✖ 失败时，</div>
          {Array.from({length:3}).map((_,i)=><div key={i} className="border-b my-4" style={{borderColor:'#dd8fa1'}} />)}
          <div className="bg-slate-50 p-3 mt-5 grid grid-cols-[1fr_90px] gap-2 text-sm" style={{ color: blue }}>
            <div><b>问:</b><div className="border-b inline-block w-44 ml-2" /></div><div>已练习? □</div>
            <div><b>答:</b><div className="border-b inline-block w-40 ml-2" /></div><div>➡ □ □ □ —</div>
            <div><b>答:</b><div className="border-b inline-block w-40 ml-2" /></div><div>➡ □ □ □ —</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Page3() {
  return (
    <Page>
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-4xl font-black" style={{ color: navy }}>异常能力</h1>
        <div className="w-80"><div className="text-slate-400 font-bold mb-2">角色姓名 __________________</div><TriLogo letter="A" color={blue} label="异常" /></div>
      </div>
      <AbilityCard /><AbilityCard /><AbilityCard />
    </Page>
  )
}

function RelationCard() {
  return (
    <div className="rounded-xl border-2 overflow-hidden" style={{ borderColor: yellow, color:'#b98a13' }}>
      <div className="grid grid-cols-2 bg-amber-50 font-black"><div className="p-3 border-r">姓名</div><div className="p-3">扮演者</div></div>
      <div className="p-4">
        <div className="font-black mb-5">描述</div>
        <div className="border-b mb-4" style={{ borderColor: yellow }} />
        <div className="flex justify-between font-black text-sm mb-1">{Array.from({length:10}).map((_,i)=><span key={i}>{i}</span>)}</div>
        <div className="flex items-center gap-2 mb-2"><span className="text-xl">▶</span>{Array.from({length:9}).map((_,i)=><span key={i} className="w-4 h-4 rounded-full border-2 bg-white" style={{ borderColor: yellow }} />)}<span>◎</span></div>
        <div className="text-right text-xs font-bold">关系网内 ▲</div>
        <div className="font-black">连结加成</div>
        <div className="grid grid-cols-[1fr_36px] gap-4 items-end"><div><div className="border-b my-4" style={{borderColor:yellow}}/><div className="border-b my-4" style={{borderColor:yellow}}/></div><div className="text-center"><div className="w-8 h-8 border-2 rounded-md" style={{borderColor:yellow}}/><b>激活</b></div></div>
      </div>
    </div>
  )
}

function Page5() {
  return (
    <Page>
      <div className="flex justify-between mb-6"><h1 className="text-4xl font-black" style={{color:navy}}>关系</h1><div className="w-80"><div className="text-slate-400 font-bold mb-2">角色姓名 __________________</div><TriLogo letter="R" color={yellow} label="现实" /></div></div>
      <div className="w-80 border rounded-xl p-4 mb-7 font-black text-xl" style={{color:navy}}>◎ 关系网内的关系</div>
      <div className="grid grid-cols-2 gap-3">{Array.from({length:6}).map((_,i)=><RelationCard key={i}/>)}</div>
    </Page>
  )
}

function Page7() {
  const qs = ["你是如何与你的异常体接触的?","机构是如何找到你的?","你的能力有独特的外在视觉表现吗?","你喝咖啡有什么偏好?","请描述你过往的工作经历。","你对Adobe、Excel和Google套件的熟悉程度如何?","在协作型工作环境中，你能做出什么贡献?"];
  return (
    <Page>
      <div className="grid grid-cols-[1fr_235px] gap-8">
        <div>
          <h1 className="text-4xl font-black" style={{ color: navy }}>欢迎你，特工!</h1>
          <p className="font-bold mt-2 mb-4" style={{ color: navy }}>请尽可能如实回答以下问题，以便机构和你的同事能更多地了解你。</p>
          {qs.map((q,i)=><div className="mb-8" key={q}><div className="font-black" style={{color:navy}}><span className="inline-flex w-5 h-5 rounded-full text-white items-center justify-center mr-2 text-sm" style={{background:red}}>{i+1}</span>{q}</div>{Array.from({length:i<3?3: i===4?3:2}).map((_,j)=><div key={j} className="border-b mt-5" style={{borderColor:'#d9d7df'}} />)}</div>)}
          <div className="font-black mt-8" style={{ color: navy }}>☕ 补充说明</div><div className="border-b mt-5" /><div className="border-b mt-8" />
        </div>
        <div>
          <div className="rounded-2xl border p-4 h-80 shadow-sm relative" style={{borderColor:'#ddd'}}><div className="h-44 border rounded-lg bg-slate-50 mb-5"></div><div className="font-black" style={{color:red}}>姓名</div><div className="border-b my-3" style={{borderColor:red}}/><div className="font-black text-sm" style={{color:red}}>人称代词 <span className="float-right text-lg">TRIANGLE<br/>AGENCY</span></div><div className="border-b mt-6" style={{borderColor:red}}/></div>
          <div className="rounded-xl border-2 p-5 mt-8" style={{borderColor:'#efc6cf', color:red}}><div className="font-black">紧急联系人</div><div className="border-b my-7" style={{borderColor:red}}/><div className="font-black">关系</div><div className="border-b mt-5" style={{borderColor:red}}/></div>
        </div>
      </div>
    </Page>
  )
}

export default function App() {
  return <main className="bg-slate-100 p-6 print:p-0"><Page1 /><Page3 /><Page5 /><Page7 /></main>;
}
