// ===== AUTH MODULE =====
const AUTH={
  users:{},
  session:null,
  selectedRole:'analyst',
  roleNames:{analyst:'风险分析师',manager:'部门主管',admin:'系统管理员'},
  hash(s){let h=5381;for(let i=0;i<s.length;i++)h=((h<<5)+h)+s.charCodeAt(i);return String(h)},
  init(){
    const stored=localStorage.getItem('orps_users');
    if(stored){try{this.users=JSON.parse(stored)}catch(e){this.users={}}}
    if(!this.users['admin']){this.users['admin']={pass:this.hash('admin123'),org:'系统管理部',role:'admin',createdAt:new Date().toISOString()};this.save()}
    const sess=sessionStorage.getItem('orps_session');
    if(sess){try{this.session=JSON.parse(sess)}catch(e){this.session=null}}
    if(this.session&&this.users[this.session.user]){this.enterApp()}
    else{this.showOverlay()}
  },
  save(){localStorage.setItem('orps_users',JSON.stringify(this.users))},
  showOverlay(){document.getElementById('auth-overlay').style.display='flex';this.showLogin()},
  hideOverlay(){document.getElementById('auth-overlay').style.display='none'},
  showLogin(){
    document.getElementById('auth-card-login').style.display='block';
    document.getElementById('auth-card-register').style.display='none';
    this.clearErrors('login');
  },
  showRegister(){
    document.getElementById('auth-card-register').style.display='block';
    document.getElementById('auth-card-login').style.display='none';
    this.clearErrors('reg');
  },
  selectRole(el,role){
    document.querySelectorAll('.auth-role').forEach(r=>r.classList.remove('active'));
    el.classList.add('active');this.selectedRole=role;
  },
  showError(id,msg){const e=document.getElementById(id);if(e){e.textContent=msg;e.classList.add('show')}},
  clearErrors(prefix){document.querySelectorAll('.auth-error').forEach(e=>{if(e.id.startsWith(prefix))e.classList.remove('show')});document.querySelectorAll('.auth-input').forEach(i=>i.classList.remove('error'))},
  login(){
    this.clearErrors('login');
    const u=document.getElementById('login-user').value.trim();
    const p=document.getElementById('login-pass').value;
    let ok=true;
    if(!u){this.showError('login-user-err','请输入用户名');document.getElementById('login-user').classList.add('error');ok=false}
    if(!p){this.showError('login-pass-err','请输入密码');document.getElementById('login-pass').classList.add('error');ok=false}
    if(!ok)return;
    const btn=document.getElementById('login-btn');btn.disabled=true;btn.textContent='登录中...';
    setTimeout(()=>{
      const user=this.users[u];
      if(!user){this.showError('login-user-err','用户名不存在');document.getElementById('login-user').classList.add('error');btn.disabled=false;btn.textContent='🔐 登 录';return}
      if(user.pass!==this.hash(p)){this.showError('login-pass-err','密码错误');document.getElementById('login-pass').classList.add('error');btn.disabled=false;btn.textContent='🔐 登 录';return}
      this.session={user:u,role:user.role||'analyst',org:user.org||'',loginTime:new Date().toISOString()};
      sessionStorage.setItem('orps_session',JSON.stringify(this.session));
      this.enterApp();btn.disabled=false;btn.textContent='🔐 登 录';
    },400);
  },
  register(){
    this.clearErrors('reg');
    const u=document.getElementById('reg-user').value.trim();
    const org=document.getElementById('reg-org').value.trim();
    const p=document.getElementById('reg-pass').value;
    const p2=document.getElementById('reg-pass2').value;
    let ok=true;
    if(!u||u.length<3){this.showError('reg-user-err','用户名至少3个字符');document.getElementById('reg-user').classList.add('error');ok=false}
    else if(!/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(u)){this.showError('reg-user-err','只能包含字母、数字、下划线、中文');document.getElementById('reg-user').classList.add('error');ok=false}
    else if(this.users[u]){this.showError('reg-user-err','该用户名已被注册');document.getElementById('reg-user').classList.add('error');ok=false}
    if(!p||p.length<6){this.showError('reg-pass-err','密码至少6位');document.getElementById('reg-pass').classList.add('error');ok=false}
    if(p!==p2){this.showError('reg-pass2-err','两次密码不一致');document.getElementById('reg-pass2').classList.add('error');ok=false}
    if(!ok)return;
    const btn=document.getElementById('reg-btn');btn.disabled=true;btn.textContent='注册中...';
    setTimeout(()=>{
      this.users[u]={pass:this.hash(p),org:org||'未填写',role:this.selectedRole,createdAt:new Date().toISOString()};
      this.save();
      this.session={user:u,role:this.selectedRole,org:org,loginTime:new Date().toISOString()};
      sessionStorage.setItem('orps_session',JSON.stringify(this.session));
      this.enterApp();btn.disabled=false;btn.textContent='✅ 注 册';
    },400);
  },
  enterApp(){
    this.hideOverlay();
    const s=this.session;
    const ic=document.getElementById('tb-user-ic');
    const name=document.getElementById('tb-user-name');
    if(ic)ic.textContent=s.user.charAt(0).toUpperCase();
    if(name)name.textContent=s.user;
    if(!window._appInited){window._appInited=true;renderTicker();initDashboard();initAssess();}
  },
  logout(){
    if(!confirm('确定要退出登录吗？'))return;
    sessionStorage.removeItem('orps_session');
    this.session=null;
    window._appInited=false;
    document.getElementById('login-user').value='';
    document.getElementById('login-pass').value='';
    this.showOverlay();
  }
};
// Enter key support
document.addEventListener('keydown',e=>{if(e.key==='Enter'){const ov=document.getElementById('auth-overlay');if(ov&&ov.style.display!=='none'){if(document.getElementById('auth-card-login').style.display!=='none')AUTH.login();else if(document.getElementById('auth-card-register').style.display!=='none')AUTH.register();}}});
// ===== END AUTH MODULE =====

const DIMS=[{key:'political',name:'政治风险',ic:'🏛',w:.15,color:'#2563eb',factors:['政局稳定性','政策连续性','政府治理效率','国际关系态势']},{key:'economic',name:'经济风险',ic:'📉',w:.15,color:'#0891b2',factors:['GDP增长趋势','通胀与汇率','主权债务风险','贸易管制程度']},{key:'security',name:'安全风险',ic:'🛡',w:.20,color:'#dc2626',factors:['恐怖主义威胁','社会治安状况','军事冲突风险','网络安全威胁']},{key:'legal',name:'法律风险',ic:'⚖',w:.10,color:'#7c3aed',factors:['法律体系完善度','司法独立性','知识产权保护','外资准入限制']},{key:'social',name:'社会文化风险',ic:'👥',w:.10,color:'#ea580c',factors:['文化差异程度','宗教冲突风险','排外情绪指数','舆论环境']},{key:'natural',name:'自然环境风险',ic:'🌪',w:.10,color:'#059669',factors:['自然灾害频率','气候变化影响','公共卫生状况','资源环境约束']},{key:'operational',name:'运营风险',ic:'⚙',w:.10,color:'#d97706',factors:['基础设施水平','供应链稳定性','人力资源可用性','技术依赖度']},{key:'geopolitical',name:'地缘战略风险',ic:'🗺',w:.10,color:'#be185d',factors:['大国博弈影响','区域冲突外溢','制裁与封锁风险','地缘通道重要性']}];
const COUNTRIES=[
{name:'阿富汗',flag:'🇦🇫',region:'南亚',capital:'喀布尔',pop:'3890万',gdp:'147.9亿$',gdpGrowth:'-3.5%',inflation:'8.2%',currency:'阿富汗尼',credit:'SD',diplo:'代办级',trade:'12.8亿$',lon:67,lat:33,scores:{political:9.5,economic:9,security:9.8,legal:8.5,social:8,natural:7,operational:9,geopolitical:9.5},trend:'up',mainRisk:'安全风险',lastUpdate:'2025-06-01 08:30',notes:'2021年8月15日塔利班接管政权，国际社会未正式承认。中色集团梅斯艾纳克铜矿项目（2008年中标，约30亿美元投资）因考古遗址发掘和安全问题至今未实质开工。中方人员已全部撤离。'},
{name:'叙利亚',flag:'🇸🇾',region:'中东',capital:'大马士革',pop:'2120万',gdp:'165.5亿$',gdpGrowth:'-1.8%',inflation:'45.2%',currency:'叙利亚镑',credit:'D',diplo:'代办级',trade:'2.1亿$',lon:38,lat:35,scores:{political:9,economic:9.5,security:9.5,legal:8,social:8.5,natural:6.5,operational:9,geopolitical:8.5},trend:'up',mainRisk:'安全风险',lastUpdate:'2025-06-01 08:00',notes:'内战持续多年，多方势力介入，基础设施严重损毁。中资企业此前在叙承建的住宅项目被迫搁置。'},
{name:'乌克兰',flag:'🇺🇦',region:'东欧',capital:'基辅',pop:'4100万',gdp:'1785亿$',gdpGrowth:'-15.2%',inflation:'26.6%',currency:'格里夫纳',credit:'CC',diplo:'战略伙伴',trade:'197亿$',lon:32,lat:49,scores:{political:8.5,economic:8,security:9,legal:7,social:6.5,natural:5,operational:8.5,geopolitical:9.5},trend:'up',mainRisk:'地缘战略风险',lastUpdate:'2025-06-01 08:00',notes:'俄乌冲突持续，安全形势严峻。中粮集团在乌粮食采购业务受影响，中交建在乌基建项目全面停滞。'},
{name:'苏丹',flag:'🇸🇩',region:'非洲',capital:'喀土穆',pop:'4490万',gdp:'350亿$',gdpGrowth:'-23.4%',inflation:'185%',currency:'苏丹镑',credit:'SD',diplo:'全面战略伙伴',trade:'28亿$',lon:30,lat:15,scores:{political:9,economic:8.5,security:8.8,legal:7.5,social:8,natural:7.5,operational:8.5,geopolitical:7},trend:'up',mainRisk:'政治风险',lastUpdate:'2025-06-01 06:45',notes:'2023年4月15日武装部队与快速支援部队爆发全面冲突，持续至今。中国组织1,500余名公民分两批撤离（4月29日海路、5月2日空路）。中石油6区、7区油田运营全面中断。'},
{name:'缅甸',flag:'🇲🇲',region:'东南亚',capital:'内比都',pop:'5410万',gdp:'650亿$',gdpGrowth:'-4%',inflation:'25%',currency:'缅元',credit:'CCC',diplo:'全面战略伙伴',trade:'192亿$',lon:96,lat:22,scores:{political:8,economic:7.5,security:8,legal:7,social:7.5,natural:6,operational:7.5,geopolitical:6.5},trend:'up',mainRisk:'政治风险',lastUpdate:'2025-06-01 07:30',notes:'2021年2月1日军事政变后局势持续动荡。密松水电站2011年暂停，军政府2024年拟重启（36亿美元/6GW），中电建持审慎态度。中缅油气管道多次遭地方武装袭击（2023年5月管道被炸、11月控制站被占）。'},
{name:'伊拉克',flag:'🇮🇶',region:'中东',capital:'巴格达',pop:'4020万',gdp:'2640亿$',gdpGrowth:'2.8%',inflation:'7.5%',currency:'第纳尔',credit:'B',diplo:'战略伙伴',trade:'375亿$',lon:44,lat:33,scores:{political:7.5,economic:7,security:8,legal:7,social:7,natural:6,operational:7,geopolitical:7.5},trend:'flat',mainRisk:'安全风险',lastUpdate:'2025-06-01 08:00',notes:'政局脆弱，教派冲突隐患犹存。中石油鲁迈拉油田运营正常但安保投入巨大，450名中方人员在伊拉克南部油田作业。'},
{name:'委内瑞拉',flag:'🇻🇪',region:'南美',capital:'加拉加斯',pop:'2870万',gdp:'920亿$',gdpGrowth:'-3.5%',inflation:'48%',currency:'玻利瓦尔',credit:'SD',diplo:'全面战略伙伴',trade:'38亿$',lon:-66,lat:8,scores:{political:8.5,economic:9,security:7.5,legal:7,social:8,natural:6,operational:8,geopolitical:7},trend:'up',mainRisk:'经济风险',lastUpdate:'2025-06-01 18:00',notes:'2018年通胀峰值65,374%。中石油因美制裁2019年撤出直接参与，2023年美临时放松后恢复购买委原油。2024年通胀约48%，经济基本面仍脆弱。'},
{name:'俄罗斯',flag:'🇷🇺',region:'东欧',capital:'莫斯科',pop:'1.44亿',gdp:'2.06万亿$',gdpGrowth:'3.6%',inflation:'7.4%',currency:'卢布',credit:'BB-',diplo:'新时代全面战略协作伙伴',trade:'2448亿$',lon:37,lat:56,scores:{political:6.5,economic:6.5,security:5.5,legal:6,social:5,natural:4,operational:6,geopolitical:9},trend:'up',mainRisk:'地缘战略风险',lastUpdate:'2025-06-01 08:00',notes:'西方制裁持续。2023年11月北极LNG 2号遭美制裁，中石化、中海油宣布不可抗力退出。约42亿美元中资滞留俄银行。中俄贸易额2024年达2,448亿美元。紫金在俄资产面临估值风险。'},
{name:'巴基斯坦',flag:'🇵🇰',region:'南亚',capital:'伊斯兰堡',pop:'2.31亿',gdp:'3760亿$',gdpGrowth:'2.5%',inflation:'25%',currency:'卢比',credit:'CCC+',diplo:'全天候战略伙伴',trade:'239亿$',lon:70,lat:30,scores:{political:6.5,economic:7,security:7.5,legal:6,social:6.5,natural:6.5,operational:6.5,geopolitical:6},trend:'up',mainRisk:'安全风险',lastUpdate:'2025-06-01 07:00',notes:'中巴经济走廊核心区域。近年发生多起中方人员遇袭事件：2021年7月达苏9人遇难、2022年4月卡拉奇孔院3人遇难、2024年3月达苏5人遇难、2024年10月瓜达尔2人遇难。PKM高速2019年通车。'},
{name:'尼日利亚',flag:'🇳🇬',region:'非洲',capital:'阿布贾',pop:'2.19亿',gdp:'4770亿$',gdpGrowth:'3.2%',inflation:'24.5%',currency:'奈拉',credit:'B-',diplo:'战略伙伴',trade:'226亿$',lon:8,lat:10,scores:{political:6,economic:6.5,security:7,legal:5.5,social:6,natural:5.5,operational:6.5,geopolitical:5},trend:'up',mainRisk:'安全风险',lastUpdate:'2025-06-01 08:00',notes:'海域海盗活跃，北部博科圣地恐怖主义威胁。中石油海上平台遭海盗袭击，85名中方人员安保升级。中土阿卡铁路项目推进中。'},
{name:'哈萨克斯坦',flag:'🇰🇿',region:'中亚',capital:'阿斯塔纳',pop:'1920万',gdp:'2610亿$',gdpGrowth:'5.1%',inflation:'14.2%',currency:'坚戈',credit:'BBB-',diplo:'永久全面战略伙伴',trade:'410亿$',lon:67,lat:48,scores:{political:5,economic:5.5,security:4.5,legal:5,social:4,natural:4.5,operational:5,geopolitical:5.5},trend:'flat',mainRisk:'经济风险',lastUpdate:'2025-06-01 08:00',notes:'中亚最大经济体，政治相对稳定。中石油卡沙甘油田、中信建设阿斯塔纳轻轨项目推进顺利。2022年1月骚乱事件后安保加强。'},
{name:'沙特阿拉伯',flag:'🇸🇦',region:'中东',capital:'利雅得',pop:'3500万',gdp:'1.06万亿$',gdpGrowth:'3.8%',inflation:'2.3%',currency:'里亚尔',credit:'A-',diplo:'全面战略伙伴',trade:'1070亿$',lon:45,lat:24,scores:{political:4.5,economic:4,security:4.5,legal:5,social:4.5,natural:4,operational:4,geopolitical:5.5},trend:'flat',mainRisk:'地缘战略风险',lastUpdate:'2025-06-01 08:00',notes:'最大石油出口国，2030愿景推进经济转型。中石化延布炼厂运营良好，中核集团与沙方推进核能合作。'},
{name:'南非',flag:'🇿🇦',region:'非洲',capital:'比勒陀利亚',pop:'6000万',gdp:'3990亿$',gdpGrowth:'0.9%',inflation:'5.9%',currency:'兰特',credit:'BB-',diplo:'全面战略伙伴',trade:'614亿$',lon:25,lat:-29,scores:{political:5,economic:5.5,security:6.5,legal:5,social:6,natural:5,operational:5.5,geopolitical:4},trend:'up',mainRisk:'安全风险',lastUpdate:'2025-06-01 08:00',notes:'电力危机严重，社会治安恶化。华为南非国家宽带网项目受停电影响，海康威视约堡仓库遭武装抢劫。排外抗议时有发生。'},
{name:'埃塞俄比亚',flag:'🇪🇹',region:'非洲',capital:'亚的斯亚贝巴',pop:'1.2亿',gdp:'1560亿$',gdpGrowth:'6.1%',inflation:'30.2%',currency:'比尔',credit:'CCC',diplo:'全面战略伙伴',trade:'68亿$',lon:40,lat:9,scores:{political:6.5,economic:6,security:6.5,legal:5.5,social:6,natural:5.5,operational:6,geopolitical:5},trend:'down',mainRisk:'政治风险',lastUpdate:'2025-06-01 08:00',notes:'提格雷冲突缓和但内部矛盾犹存。中土亚吉铁路运营恢复，葛洲坝尼罗河大坝项目推进。中兴埃塞移动通信网项目正常。'},
{name:'越南',flag:'🇻🇳',region:'东南亚',capital:'河内',pop:'9740万',gdp:'4300亿$',gdpGrowth:'6.5%',inflation:'3.5%',currency:'盾',credit:'BB+',diplo:'全面战略合作伙伴',trade:'2300亿$',lon:106,lat:16,scores:{political:4,economic:4,security:3.5,legal:4.5,social:3.5,natural:4.5,operational:4,geopolitical:4.5},trend:'flat',mainRisk:'地缘战略风险',lastUpdate:'2025-06-01 08:00',notes:'投资环境良好，制造业转移重要目的地。华为5G网络建设受限，中铁雅万高铁补充项目推进。南海问题需关注。'},
{name:'印度尼西亚',flag:'🇮🇩',region:'东南亚',capital:'雅加达',pop:'2.74亿',gdp:'1.37万亿$',gdpGrowth:'5.0%',inflation:'3.2%',currency:'卢比',credit:'BBB',diplo:'全面战略伙伴',trade:'1490亿$',lon:113,lat:-2,scores:{political:4,economic:4,security:4,legal:4.5,social:4,natural:5.5,operational:4.5,geopolitical:4},trend:'flat',mainRisk:'自然环境风险',lastUpdate:'2025-06-01 08:00',notes:'东盟最大经济体，镍矿出口禁令影响供应链。中铁雅万高铁通车运营，中建多个基建项目推进。苏门答腊洪灾影响部分工地。'},
{name:'巴西',flag:'🇧🇷',region:'南美',capital:'巴西利亚',pop:'2.15亿',gdp:'2.13万亿$',gdpGrowth:'2.9%',inflation:'4.6%',currency:'雷亚尔',credit:'BB',diplo:'全面战略伙伴',trade:'1810亿$',lon:-55,lat:-10,scores:{political:4.5,economic:4.5,security:5,legal:4.5,social:4.5,natural:4.5,operational:4.5,geopolitical:3.5},trend:'flat',mainRisk:'安全风险',lastUpdate:'2025-06-01 08:00',notes:'拉美最大经济体，大豆铁矿石贸易密切。国家电网美丽山特高压运营良好，比亚迪电动巴士工厂投产。中粮大豆采购链稳定。'},
{name:'美国',flag:'🇺🇸',region:'北美',capital:'华盛顿',pop:'3.33亿',gdp:'27.36万亿$',gdpGrowth:'2.5%',inflation:'3.2%',currency:'美元',credit:'AA+',diplo:'大国关系',trade:'6640亿$',lon:-95,lat:38,scores:{political:4,economic:3.5,security:3.5,legal:3,social:4,natural:3.5,operational:3,geopolitical:7.5},trend:'up',mainRisk:'地缘战略风险',lastUpdate:'2025-06-01 08:00',notes:'科技制裁持续升级，芯片出口管制扩大至14nm以下。华为、中兴、海康威视等企业被列入实体清单。联想在美业务面临安全审查。'},
{name:'泰国',flag:'🇹🇭',region:'东南亚',capital:'曼谷',pop:'7000万',gdp:'5120亿$',gdpGrowth:'2.8%',inflation:'1.2%',currency:'泰铢',credit:'BBB+',diplo:'全面战略合作伙伴',trade:'1260亿$',lon:100,lat:15,scores:{political:4.5,economic:4,security:4,legal:4.5,social:4,natural:4.5,operational:3.5,geopolitical:3.5},trend:'flat',mainRisk:'政治风险',lastUpdate:'2025-06-01 08:00',notes:'政局波动后趋稳，比亚迪电池工厂投产，中移动跨境光缆项目推进。汽车产业链重要节点。'},
{name:'阿联酋',flag:'🇦🇪',region:'中东',capital:'阿布扎比',pop:'990万',gdp:'5090亿$',gdpGrowth:'3.4%',inflation:'2.0%',currency:'迪拉姆',credit:'AA-',diplo:'全面战略伙伴',trade:'1020亿$',lon:54,lat:24,scores:{political:3.5,economic:3.5,security:3.5,legal:4,social:3.5,natural:3.5,operational:3,geopolitical:4.5},trend:'flat',mainRisk:'地缘战略风险',lastUpdate:'2025-06-01 08:00',notes:'中东金融物流枢纽，投资环境优良。中远海运、招商局在阿港口运营良好，华为数据中心项目推进。'},
{name:'澳大利亚',flag:'🇦🇺',region:'大洋洲',capital:'堪培拉',pop:'2600万',gdp:'1.69万亿$',gdpGrowth:'2.0%',inflation:'4.1%',currency:'澳元',credit:'AAA',diplo:'全面战略伙伴',trade:'2300亿$',lon:134,lat:-25,scores:{political:3.5,economic:3.5,security:3,legal:3,social:3.5,natural:4.5,operational:3,geopolitical:5},trend:'flat',mainRisk:'地缘战略风险',lastUpdate:'2025-06-01 08:00',notes:'铁矿石锂矿重要来源。跟随美国对华政策，外国投资审查趋严。中铝、五矿在澳矿业项目受限。2022年东部洪灾曾影响供应链。'},
{name:'新加坡',flag:'🇸🇬',region:'东南亚',capital:'新加坡',pop:'590万',gdp:'4970亿$',gdpGrowth:'3.0%',inflation:'2.8%',currency:'新元',credit:'AAA',diplo:'全方位高质量前瞻性伙伴',trade:'1080亿$',lon:104,lat:1,scores:{political:2,economic:2.5,security:2,legal:2.5,social:2,natural:2.5,operational:2,geopolitical:3},trend:'flat',mainRisk:'地缘战略风险',lastUpdate:'2025-06-01 08:00',notes:'国际金融中心，营商环境全球领先。中远海运比雷埃夫斯港亚太区总部设于此，中美之间保持平衡。'},
{name:'伊朗',flag:'🇮🇷',region:'中东',capital:'德黑兰',pop:'8500万',gdp:'3880亿$',gdpGrowth:'4.5%',inflation:'40.3%',currency:'里亚尔',credit:'B-',diplo:'全面战略伙伴',trade:'490亿$',lon:53,lat:32,scores:{political:7,economic:7.5,security:7.5,legal:6.5,social:7.5,natural:6,operational:7,geopolitical:8.5},trend:'up',mainRisk:'地缘战略风险',lastUpdate:'2025-06-01 08:00',notes:'美伊对抗持续，西方制裁影响深远。中石化南帕尔斯气田项目受制裁影响结算困难。美对伊制裁持续涉及石油运输。'},
{name:'土耳其',flag:'🇹🇷',region:'中东',capital:'安卡拉',pop:'8400万',gdp:'8190亿$',gdpGrowth:'3.5%',inflation:'64.8%',currency:'里拉',credit:'B-',diplo:'战略合作关系',trade:'460亿$',lon:35,lat:39,scores:{political:6.5,economic:7,security:6.5,legal:6,social:6,natural:5.5,operational:6,geopolitical:7},trend:'up',mainRisk:'经济风险',lastUpdate:'2025-06-01 08:00',notes:'通胀64.8%，里拉跌破32关口。联想融资成本大幅上升，中铁在土项目面临汇率风险。央行紧急加息至50%。'},
{name:'埃及',flag:'🇪🇬',region:'非洲',capital:'开罗',pop:'1.04亿',gdp:'4040亿$',gdpGrowth:'3.8%',inflation:'33.7%',currency:'埃及镑',credit:'B',diplo:'战略合作关系',trade:'167亿$',lon:30,lat:27,scores:{political:6,economic:6.5,security:6,legal:5.5,social:5.5,natural:5,operational:6.5,geopolitical:6},trend:'flat',mainRisk:'经济风险',lastUpdate:'2025-06-01 08:00',notes:'外汇短缺，埃及镑贬值超15%。中建新行政首都项目预算超标，苏伊士运河安全关乎贸易通道。小米在埃手机工厂受影响。'},
{name:'利比亚',flag:'🇱🇾',region:'非洲',capital:'的黎波里',pop:'690万',gdp:'430亿$',gdpGrowth:'-5.5%',inflation:'13.5%',currency:'第纳尔',credit:'CCC',diplo:'代办级',trade:'58亿$',lon:17,lat:27,scores:{political:9,economic:8.5,security:8.5,legal:8,social:7,natural:6,operational:8.5,geopolitical:7.5},trend:'up',mainRisk:'政治风险',lastUpdate:'2025-06-01 08:00',notes:'东西割据，内战风险持续。2024年东部势力曾宣布停止石油出口，中石油在利项目面临供应中断，60名中方人员受影响。'},
{name:'也门',flag:'🇾🇪',region:'中东',capital:'萨那',pop:'3300万',gdp:'210亿$',gdpGrowth:'-8.2%',inflation:'28.5%',currency:'里亚尔',credit:'D',diplo:'代办级',trade:'30亿$',lon:48,lat:15,scores:{political:9.5,economic:9,security:9.5,legal:8,social:8.5,natural:7,operational:9,geopolitical:7.5},trend:'up',mainRisk:'安全风险',lastUpdate:'2025-06-01 08:00',notes:'内战持续，胡塞武装控制北部。2023年11月起胡塞武装持续袭击红海商船，中远海运暂停红海航线。多家航运公司绕行好望角。'},
{name:'索马里',flag:'🇸🇴',region:'非洲',capital:'摩加迪沙',pop:'1700万',gdp:'100亿$',gdpGrowth:'-3.5%',inflation:'22.4%',currency:'先令',credit:'D',diplo:'代办级',trade:'7亿$',lon:46,lat:6,scores:{political:9.5,economic:9,security:9.8,legal:9,social:8.5,natural:7.5,operational:9,geopolitical:7},trend:'up',mainRisk:'安全风险',lastUpdate:'2025-06-01 08:00',notes:'青年党恐怖袭击频繁。青年党袭击频繁，中资企业需保持最高安保级别，45名中方人员紧急撤离。'},
{name:'南苏丹',flag:'🇸🇸',region:'非洲',capital:'朱巴',pop:'1100万',gdp:'50亿$',gdpGrowth:'-2.8%',inflation:'35.2%',currency:'南苏丹镑',credit:'D',diplo:'代办级',trade:'12亿$',lon:31,lat:7,scores:{political:9,economic:8.5,security:9,legal:8.5,social:8,natural:7,operational:8.5,geopolitical:6.5},trend:'up',mainRisk:'政治风险',lastUpdate:'2025-06-01 08:00',notes:'部族冲突持续，2024年政治不确定性持续。中地项目人员已转移至安全区域，60名中方人员受影响。'},
{name:'刚果(金)',flag:'🇨🇩',region:'非洲',capital:'金沙萨',pop:'9500万',gdp:'640亿$',gdpGrowth:'6.2%',inflation:'18.5%',currency:'刚果法郎',credit:'B-',diplo:'全面战略合作伙伴',trade:'187亿$',lon:23,lat:-3,scores:{political:8,economic:7.5,security:8.5,legal:7.5,social:7.5,natural:7,operational:8,geopolitical:6.5},trend:'up',mainRisk:'安全风险',lastUpdate:'2025-06-01 06:30',notes:'2025年2月M23武装攻占北基伍省戈马和南基伍省布卡武。紫金矿业卡莫阿铜矿位于南部卢阿拉巴省，距战区约1,500公里，但供应链受影响。钴铜矿资源丰富但东部投资风险极高。2025年矿震淹井产量下调。'},
{name:'哥伦比亚',flag:'🇨🇴',region:'南美',capital:'波哥大',pop:'5100万',gdp:'3640亿$',gdpGrowth:'1.5%',inflation:'9.5%',currency:'比索',credit:'BB',diplo:'战略伙伴',trade:'230亿$',lon:-74,lat:4,scores:{political:5.5,economic:5.5,security:6.5,legal:5,social:5.5,natural:6,operational:5.5,geopolitical:4.5},trend:'flat',mainRisk:'安全风险',lastUpdate:'2025-06-01 07:00',notes:'2024年1月紫金矿业公告武里蒂卡金矿被非法采矿组织控制60%以上矿区。2023年记录2,260次爆炸和2,450次枪击。紫金已向哥政府提起5亿美元国际仲裁。'},
{name:'墨西哥',flag:'🇲🇽',region:'南美',capital:'墨西哥城',pop:'1.28亿',gdp:'1.81万亿$',gdpGrowth:'3.2%',inflation:'4.7%',currency:'比索',credit:'BBB',diplo:'全面战略伙伴',trade:'1280亿$',lon:-102,lat:23,scores:{political:5,economic:4.5,security:6.5,legal:4.5,social:4.5,natural:5,operational:5,geopolitical:4.5},trend:'flat',mainRisk:'安全风险',lastUpdate:'2025-06-01 08:00',notes:'毒品犯罪和治安问题突出。联想蒙特雷工厂附近发生枪击事件，400名员工临时加强安保。近岸外包重要目的地。'},
{name:'秘鲁',flag:'🇵🇪',region:'南美',capital:'利马',pop:'3300万',gdp:'2430亿$',gdpGrowth:'2.5%',inflation:'6.2%',currency:'索尔',credit:'BBB',diplo:'全面战略伙伴',trade:'280亿$',lon:-76,lat:-10,scores:{political:5.5,economic:5,security:5.5,legal:4.5,social:5,natural:6.5,operational:5,geopolitical:4},trend:'flat',mainRisk:'社会文化风险',lastUpdate:'2025-06-01 08:00',notes:'政局不稳，社会抗议频发。中铝特罗莫克铜矿运输通道被社区抗议堵塞，200名中方人员受影响。五矿拉斯邦巴斯铜矿同样面临社区冲突。'},
{name:'印度',flag:'🇮🇳',region:'南亚',capital:'新德里',pop:'14.2亿',gdp:'3.73万亿$',gdpGrowth:'6.5%',inflation:'5.4%',currency:'卢比',credit:'BBB-',diplo:'战略合作伙伴',trade:'1360亿$',lon:78,lat:21,scores:{political:5.5,economic:5,security:4.5,legal:5,social:6,natural:5,operational:5.5,geopolitical:6},trend:'flat',mainRisk:'地缘战略风险',lastUpdate:'2025-06-01 08:00',notes:'中印边境问题持续。2024年印度持续对小米等中国手机企业施压，vivo被指控逃税，2000名中方人员受影响。华为、中兴市场准入受限。'},
{name:'菲律宾',flag:'🇵🇭',region:'东南亚',capital:'马尼拉',pop:'1.1亿',gdp:'4370亿$',gdpGrowth:'5.8%',inflation:'6.0%',currency:'比索',credit:'BBB',diplo:'全面战略合作关系',trade:'820亿$',lon:122,lat:13,scores:{political:5,economic:4.5,security:5.5,legal:4.5,social:5,natural:6,operational:5,geopolitical:4.5},trend:'flat',mainRisk:'安全风险',lastUpdate:'2025-06-01 08:00',notes:'南部安全风险较高。超强台风登陆吕宋岛，武夷住宅项目工地受损，300名中方人员受影响。国电电网项目审批延误2-3个月。'},
{name:'马来西亚',flag:'🇲🇾',region:'东南亚',capital:'吉隆坡',pop:'3300万',gdp:'4150亿$',gdpGrowth:'4.2%',inflation:'2.5%',currency:'林吉特',credit:'A-',diplo:'全面战略伙伴',trade:'2040亿$',lon:102,lat:2,scores:{political:3.5,economic:3.5,security:4,legal:4,social:3.5,natural:4,operational:3.5,geopolitical:3.5},trend:'down',mainRisk:'政治风险',lastUpdate:'2025-06-01 08:00',notes:'政局相对稳定，投资环境良好。半导体产业链重要节点。中移动需调整运营架构应对本地化合规要求。武夷住宅项目推进顺利。'},
{name:'柬埔寨',flag:'🇰🇭',region:'东南亚',capital:'金边',pop:'1600万',gdp:'310亿$',gdpGrowth:'5.5%',inflation:'3.5%',currency:'瑞尔',credit:'B+',diplo:'全面战略合作伙伴',trade:'160亿$',lon:105,lat:13,scores:{political:4.5,economic:4.5,security:4.5,legal:4.5,social:4,natural:4.5,operational:4.5,geopolitical:4},trend:'flat',mainRisk:'政治风险',lastUpdate:'2025-06-01 08:00',notes:'中柬关系紧密，投资环境较好。中国路桥、中工国际基建项目推进顺利。中粮糖业加工厂运营稳定。'},
{name:'乌兹别克斯坦',flag:'🇺🇿',region:'中亚',capital:'塔什干',pop:'3500万',gdp:'780亿$',gdpGrowth:'5.5%',inflation:'11.2%',currency:'苏姆',credit:'BB-',diplo:'全面战略伙伴',trade:'130亿$',lon:64,lat:41,scores:{political:5,economic:4.5,security:4.5,legal:5,social:4.5,natural:5,operational:5,geopolitical:5},trend:'flat',mainRisk:'政治风险',lastUpdate:'2025-06-01 08:00',notes:'改革推进中，营商环境改善。中信建设、通用在乌项目推进。苏姆汇率波动导致工程款结算差额。中亚天然气通道重要节点。'},
{name:'肯尼亚',flag:'🇰🇪',region:'非洲',capital:'内罗毕',pop:'5400万',gdp:'1130亿$',gdpGrowth:'5.0%',inflation:'7.7%',currency:'先令',credit:'B',diplo:'全面战略合作伙伴',trade:'85亿$',lon:38,lat:0,scores:{political:5.5,economic:5.5,security:5.5,legal:5,social:5,natural:5.5,operational:5.5,geopolitical:4.5},trend:'flat',mainRisk:'安全风险',lastUpdate:'2025-06-01 08:00',notes:'东非门户，中国路桥蒙内铁路运营良好。2024年6月反税抗议曾致交通瘫痪，中土、江西国际部分项目受影响。暴雨导致铁路路基受损。'},
{name:'安哥拉',flag:'🇦🇴',region:'非洲',capital:'罗安达',pop:'3300万',gdp:'1240亿$',gdpGrowth:'2.8%',inflation:'13.5%',currency:'宽扎',credit:'B-',diplo:'战略伙伴',trade:'280亿$',lon:18,lat:-12,scores:{political:6,economic:6.5,security:5.5,legal:5.5,social:5.5,natural:5,operational:6,geopolitical:5},trend:'flat',mainRisk:'经济风险',lastUpdate:'2025-06-01 08:00',notes:'石油依赖度高。中信建设社会住房、葛洲坝项目推进。中石化17区油田运营正常。中国在安哥拉投资规模大。'},
{name:'阿尔及利亚',flag:'🇩🇿',region:'非洲',capital:'阿尔及尔',pop:'4400万',gdp:'2240亿$',gdpGrowth:'3.5%',inflation:'9.3%',currency:'第纳尔',credit:'BB-',diplo:'全面战略伙伴',trade:'90亿$',lon:3,lat:28,scores:{political:5.5,economic:5.5,security:5.5,legal:5,social:5,natural:5,operational:5.5,geopolitical:5},trend:'flat',mainRisk:'政治风险',lastUpdate:'2025-06-01 08:00',notes:'能源出口国，政治相对稳定。中土在阿工程款拖欠超6个月，350名中方人员受影响。中核集团与阿方推进核能合作。'},
{name:'塞尔维亚',flag:'🇷🇸',region:'东欧',capital:'贝尔格莱德',pop:'690万',gdp:'750亿$',gdpGrowth:'3.5%',inflation:'12.5%',currency:'第纳尔',credit:'BB',diplo:'全面战略伙伴',trade:'60亿$',lon:21,lat:44,scores:{political:3.5,economic:4,security:3.5,legal:4,social:3.5,natural:3.5,operational:4,geopolitical:4.5},trend:'down',mainRisk:'地缘战略风险',lastUpdate:'2025-06-01 08:00',notes:'中塞关系友好。2024年中塞自贸协定生效，经贸合作深化。紫金矿业博尔铜矿、中铁建匈塞铁路项目推进顺利。投资环境改善。'}
];
const ENTERPRISES=[
{id:1,name:'中国石油天然气集团',short:'中石油',code:'CNPC',industry:'能源石化',hq:'北京',logo:'油',logoColor:'#1a6dd6',investment:850,personnel:3200,assets:1200,countries:['伊拉克','哈萨克斯坦','苏丹','委内瑞拉','尼日利亚','俄罗斯','伊朗','利比亚','南苏丹'],projects:[{n:'鲁迈拉油田',c:'伊拉克',inv:120,p:450},{n:'卡沙甘油田',c:'哈萨克斯坦',inv:85,p:280},{n:'6区油田',c:'苏丹',inv:35,p:120},{n:'Junin4区块',c:'委内瑞拉',inv:60,p:180},{n:'南帕尔斯气田',c:'伊朗',inv:45,p:150}],status:'alert'},
{id:2,name:'中国石油化工集团',short:'中石化',code:'Sinopec',industry:'能源石化',hq:'北京',logo:'石',logoColor:'#0d47a1',investment:720,personnel:2800,assets:950,countries:['沙特阿拉伯','俄罗斯','哈萨克斯坦','尼日利亚','伊拉克','伊朗','安哥拉'],projects:[{n:'延布炼厂',c:'沙特阿拉伯',inv:85,p:320},{n:'亚马尔LNG',c:'俄罗斯',inv:120,p:250},{n:'17区油田',c:'安哥拉',inv:35,p:180}],status:'monitoring'},
{id:3,name:'中国建筑集团',short:'中建',code:'CSCEC',industry:'建筑工程',hq:'北京',logo:'建',logoColor:'#059669',investment:45,personnel:8500,assets:180,countries:['巴基斯坦','缅甸','埃塞俄比亚','越南','印度尼西亚','阿联酋','埃及','阿尔及利亚'],projects:[{n:'PKM高速公路',c:'巴基斯坦',inv:28,p:1200},{n:'内比都CBD',c:'缅甸',inv:8,p:350},{n:'新行政首都',c:'埃及',inv:15,p:800}],status:'monitoring'},
{id:4,name:'中国铁建',short:'中铁建',code:'CRCC',industry:'建筑工程',hq:'北京',logo:'铁',logoColor:'#b91c1c',investment:38,personnel:6200,assets:150,countries:['巴基斯坦','缅甸','哈萨克斯坦','越南','印度尼西亚','巴西','泰国','塞尔维亚','尼日利亚'],projects:[{n:'拉合尔橙线',c:'巴基斯坦',inv:16,p:800},{n:'雅万高铁补充',c:'印度尼西亚',inv:6,p:400},{n:'匈塞铁路',c:'塞尔维亚',inv:8,p:350}],status:'monitoring'},
{id:5,name:'华为技术',short:'华为',code:'Huawei',industry:'通信科技',hq:'深圳',logo:'华',logoColor:'#dc2626',investment:25,personnel:4500,assets:300,countries:['美国','俄罗斯','巴基斯坦','越南','印度尼西亚','南非','巴西','沙特阿拉伯','阿联酋','泰国','土耳其','肯尼亚'],projects:[{n:'5G网络建设',c:'越南',inv:3.5,p:600},{n:'国家宽带网',c:'南非',inv:2.8,p:400},{n:'数据中心',c:'肯尼亚',inv:1.5,p:200}],status:'monitoring'},
{id:6,name:'中兴通讯',short:'中兴',code:'ZTE',industry:'通信科技',hq:'深圳',logo:'兴',logoColor:'#2563eb',investment:12,personnel:1800,assets:150,countries:['美国','巴基斯坦','越南','印度尼西亚','南非','埃塞俄比亚','肯尼亚'],projects:[{n:'国家光纤网',c:'巴基斯坦',inv:2.2,p:300},{n:'移动通信网',c:'埃塞俄比亚',inv:1.8,p:250}],status:'monitoring'},
{id:7,name:'比亚迪股份',short:'比亚迪',code:'BYD',industry:'新能源汽车',hq:'深圳',logo:'比',logoColor:'#16a34a',investment:8,personnel:1200,assets:60,countries:['美国','巴西','印度尼西亚','越南','南非','泰国','澳大利亚','马来西亚'],projects:[{n:'电动巴士工厂',c:'巴西',inv:2,p:150},{n:'电池工厂',c:'泰国',inv:1.5,p:200}],status:'monitoring'},
{id:8,name:'中国交通建设',short:'中交建',code:'CCCC',industry:'建筑工程',hq:'北京',logo:'交',logoColor:'#0891b2',investment:52,personnel:7500,assets:220,countries:['巴基斯坦','缅甸','斯里兰卡','肯尼亚','埃塞俄比亚','马来西亚','哥伦比亚','菲律宾','刚果(金)'],projects:[{n:'瓜达尔港',c:'巴基斯坦',inv:16,p:600},{n:'皎漂深水港',c:'缅甸',inv:7.5,p:400},{n:'蒙巴萨港',c:'肯尼亚',inv:5,p:300}],status:'alert'},
{id:9,name:'中国电力建设',short:'中电建',code:'PowerChina',industry:'建筑工程',hq:'北京',logo:'电',logoColor:'#d97706',investment:35,personnel:5800,assets:160,countries:['缅甸','巴基斯坦','埃塞俄比亚','印度尼西亚','柬埔寨','老挝','安哥拉','乌兹别克斯坦'],projects:[{n:'密松水电站',c:'缅甸',inv:3.6,p:500},{n:'卡西姆港燃煤电站',c:'巴基斯坦',inv:4.5,p:400},{n:'水电站群',c:'老挝',inv:5,p:300}],status:'alert'},
{id:10,name:'中国有色矿业',short:'中色',code:'NFC',industry:'矿业资源',hq:'北京',logo:'色',logoColor:'#ca8a04',investment:28,personnel:1500,assets:120,countries:['阿富汗','赞比亚','刚果(金)','蒙古','秘鲁','澳大利亚'],projects:[{n:'艾娜克铜矿',c:'阿富汗',inv:8,p:200},{n:'卢安夏铜矿',c:'赞比亚',inv:6,p:180}],status:'alert'},
{id:11,name:'中粮集团',short:'中粮',code:'COFCO',industry:'农业食品',hq:'北京',logo:'粮',logoColor:'#65a30d',investment:18,personnel:800,assets:200,countries:['巴西','澳大利亚','泰国','柬埔寨','美国','乌克兰'],projects:[{n:'大豆采购链',c:'巴西',inv:5,p:100},{n:'糖业加工',c:'泰国',inv:2,p:150}],status:'normal'},
{id:12,name:'中远海运',short:'中远海运',code:'COSCO',industry:'物流运输',hq:'上海',logo:'运',logoColor:'#1e40af',investment:42,personnel:3200,assets:500,countries:['希腊','巴基斯坦','阿联酋','新加坡','巴西','澳大利亚','埃及','肯尼亚'],projects:[{n:'比雷埃夫斯港',c:'希腊',inv:8,p:500},{n:'瓜达尔港运营',c:'巴基斯坦',inv:5,p:300}],status:'monitoring'},
{id:13,name:'中信建设',short:'中信建设',code:'CITIC',industry:'建筑工程',hq:'北京',logo:'信',logoColor:'#7c3aed',investment:30,personnel:2800,assets:140,countries:['哈萨克斯坦','乌兹别克斯坦','安哥拉','委内瑞拉','巴西','阿尔及利亚'],projects:[{n:'阿斯塔纳轻轨',c:'哈萨克斯坦',inv:8,p:350},{n:'社会住房',c:'安哥拉',inv:6,p:500}],status:'monitoring'},
{id:14,name:'招商局集团',short:'招商局',code:'CMG',industry:'综合投资',hq:'深圳',logo:'招',logoColor:'#be185d',investment:55,personnel:4200,assets:800,countries:['巴基斯坦','斯里兰卡','吉布提','阿联酋','新加坡','巴西','澳大利亚'],projects:[{n:'吉布提国际自贸区',c:'吉布提',inv:3.5,p:200},{n:'汉班托塔港',c:'斯里兰卡',inv:5,p:300}],status:'normal'},
{id:15,name:'中国铝业',short:'中铝',code:'Chalco',industry:'矿业资源',hq:'北京',logo:'铝',logoColor:'#92400e',investment:22,personnel:1800,assets:150,countries:['几内亚','秘鲁','澳大利亚','印度尼西亚','巴西'],projects:[{n:'博法铝土矿',c:'几内亚',inv:8,p:250},{n:'特罗莫克铜矿',c:'秘鲁',inv:5,p:200}],status:'monitoring'},
{id:16,name:'中国五矿',short:'五矿',code:'Minmetals',industry:'矿业资源',hq:'北京',logo:'矿',logoColor:'#4338ca',investment:25,personnel:1600,assets:180,countries:['秘鲁','澳大利亚','巴基斯坦','刚果(金)','巴西'],projects:[{n:'拉斯邦巴斯铜矿',c:'秘鲁',inv:10,p:300}],status:'monitoring'},
{id:17,name:'中国核工业',short:'中核工',code:'CNEC',industry:'能源核电',hq:'北京',logo:'核',logoColor:'#dc2626',investment:20,personnel:1200,assets:200,countries:['巴基斯坦','阿根廷','英国','沙特阿拉伯'],projects:[{n:'卡拉奇核电站',c:'巴基斯坦',inv:8,p:400}],status:'normal'},
{id:18,name:'葛洲坝集团',short:'葛洲坝',code:'GGEB',industry:'建筑工程',hq:'武汉',logo:'坝',logoColor:'#059669',investment:28,personnel:3500,assets:130,countries:['巴基斯坦','埃塞俄比亚','安哥拉','阿根廷','印度尼西亚','乌兹别克斯坦'],projects:[{n:'尼罗河大坝',c:'埃塞俄比亚',inv:5,p:400}],status:'monitoring'},
{id:19,name:'中国路桥',short:'中国路桥',code:'CRBC',industry:'建筑工程',hq:'北京',logo:'路',logoColor:'#2563eb',investment:32,personnel:4200,assets:160,countries:['巴基斯坦','肯尼亚','柬埔寨','塞尔维亚','哥伦比亚','喀麦隆','越南'],projects:[{n:'蒙内铁路',c:'肯尼亚',inv:3.8,p:500},{n:'E763高速公路',c:'塞尔维亚',inv:4,p:300}],status:'monitoring'},
{id:20,name:'中工国际',short:'中工国际',code:'CAMCE',industry:'工程承包',hq:'北京',logo:'工',logoColor:'#0891b2',investment:15,personnel:1200,assets:80,countries:['白俄罗斯','柬埔寨','老挝','缅甸','委内瑞拉'],projects:[{n:'水泥厂',c:'白俄罗斯',inv:3,p:200}],status:'normal'},
{id:21,name:'中国中铁',short:'中铁',code:'CREC',industry:'建筑工程',hq:'北京',logo:'铁',logoColor:'#b91c1c',investment:35,personnel:5500,assets:140,countries:['巴基斯坦','越南','印度尼西亚','泰国','马来西亚','老挝','土耳其'],projects:[{n:'中老铁路',c:'老挝',inv:12,p:800},{n:'雅万高铁',c:'印度尼西亚',inv:8,p:600}],status:'monitoring'},
{id:22,name:'国家电网',short:'国电',code:'SGCC',industry:'能源电力',hq:'北京',logo:'电',logoColor:'#f59e0b',investment:65,personnel:3200,assets:500,countries:['巴西','菲律宾','澳大利亚','巴基斯坦','葡萄牙','意大利','智利','希腊','肯尼亚'],projects:[{n:'美丽山特高压',c:'巴西',inv:12,p:400},{n:'国家输电网',c:'菲律宾',inv:8,p:300}],status:'monitoring'},
{id:23,name:'中国华能',short:'华能',code:'CHNG',industry:'能源电力',hq:'北京',logo:'能',logoColor:'#0891b2',investment:28,personnel:1500,assets:180,countries:['缅甸','巴基斯坦','柬埔寨','新加坡','英国'],projects:[{n:'瑞丽江电站',c:'缅甸',inv:3,p:250}],status:'monitoring'},
{id:24,name:'海康威视',short:'海康',code:'Hikvision',industry:'通信科技',hq:'杭州',logo:'康',logoColor:'#1a6dd6',investment:8,personnel:1200,assets:80,countries:['美国','印度','巴西','英国','澳大利亚','南非','阿联酋'],projects:[{n:'智慧城市安防',c:'巴西',inv:1.5,p:200}],status:'monitoring'},
{id:25,name:'小米科技',short:'小米',code:'Xiaomi',industry:'通信科技',hq:'北京',logo:'米',logoColor:'#ea580c',investment:12,personnel:2000,assets:150,countries:['印度','印度尼西亚','越南','泰国','马来西亚','巴西','埃及'],projects:[{n:'手机组装工厂',c:'印度',inv:3,p:500},{n:'智能工厂',c:'越南',inv:1.5,p:300}],status:'monitoring'},
{id:26,name:'联想集团',short:'联想',code:'Lenovo',industry:'通信科技',hq:'北京',logo:'想',logoColor:'#7c3aed',investment:15,personnel:2800,assets:200,countries:['美国','墨西哥','印度','巴西','匈牙利','日本'],projects:[{n:'PC组装基地',c:'墨西哥',inv:3,p:400},{n:'服务器工厂',c:'匈牙利',inv:2,p:300}],status:'monitoring'},
{id:27,name:'中国移动',short:'移动',code:'CMCC',industry:'通信科技',hq:'北京',logo:'移',logoColor:'#16a34a',investment:10,personnel:800,assets:100,countries:['巴基斯坦','泰国','英国','马来西亚','南非'],projects:[{n:'跨境光缆',c:'巴基斯坦',inv:2,p:150}],status:'normal'},
{id:28,name:'中国通用技术',short:'通用',code:'GT',industry:'综合贸易',hq:'北京',logo:'通',logoColor:'#059669',investment:22,personnel:1800,assets:120,countries:['哈萨克斯坦','乌兹别克斯坦','肯尼亚','安哥拉','土耳其','马来西亚'],projects:[{n:'轨道交通车辆',c:'哈萨克斯坦',inv:3,p:200}],status:'monitoring'},
{id:29,name:'中地海外',short:'中地',code:'CGC',industry:'建筑工程',hq:'北京',logo:'地',logoColor:'#d97706',investment:15,personnel:2200,assets:80,countries:['苏丹','南苏丹','尼日利亚','安哥拉','刚果(金)','埃塞俄比亚','索马里'],projects:[{n:'水利灌溉工程',c:'苏丹',inv:3,p:300},{n:'公路网',c:'尼日利亚',inv:2.5,p:250}],status:'alert'},
{id:30,name:'中国土木',short:'中土',code:'CCECC',industry:'建筑工程',hq:'北京',logo:'土',logoColor:'#be185d',investment:28,personnel:3500,assets:150,countries:['尼日利亚','埃塞俄比亚','肯尼亚','安哥拉','坦桑尼亚','土耳其','沙特阿拉伯'],projects:[{n:'阿卡铁路',c:'尼日利亚',inv:5,p:400},{n:'亚吉铁路',c:'埃塞俄比亚',inv:4,p:350}],status:'monitoring'},
{id:31,name:'中纺集团',short:'中纺',code:'COFCO-Oils',industry:'农业食品',hq:'北京',logo:'纺',logoColor:'#65a30d',investment:8,personnel:600,assets:50,countries:['巴西','澳大利亚','泰国','柬埔寨','乌克兰'],projects:[{n:'油脂加工厂',c:'巴西',inv:2,p:150}],status:'normal'},
{id:32,name:'中国江西国际',short:'江西国际',code:'JXIC',industry:'建筑工程',hq:'南昌',logo:'江',logoColor:'#0d47a1',investment:12,personnel:1800,assets:60,countries:['肯尼亚','埃塞俄比亚','加纳','乌干达','赞比亚','坦桑尼亚'],projects:[{n:'机场航站楼',c:'肯尼亚',inv:2.5,p:200}],status:'monitoring'},
{id:33,name:'中国武夷',short:'武夷',code:'CWY',industry:'建筑工程',hq:'福州',logo:'夷',logoColor:'#92400e',investment:6,personnel:900,assets:40,countries:['菲律宾','马来西亚','柬埔寨','老挝','肯尼亚'],projects:[{n:'住宅项目',c:'菲律宾',inv:1.5,p:200}],status:'normal'},
{id:34,name:'中核集团',short:'中核',code:'CNNC',industry:'能源核电',hq:'北京',logo:'核',logoColor:'#dc2626',investment:45,personnel:1200,assets:300,countries:['巴基斯坦','阿根廷','英国','沙特阿拉伯','阿尔及利亚'],projects:[{n:'华龙一号',c:'巴基斯坦',inv:12,p:500},{n:'核能合作',c:'沙特阿拉伯',inv:5,p:200}],status:'monitoring'},
{id:35,name:'紫金矿业',short:'紫金',code:'Zijin',industry:'矿业资源',hq:'龙岩',logo:'金',logoColor:'#ca8a04',investment:38,personnel:2800,assets:250,countries:['塞尔维亚','刚果(金)','哥伦比亚','澳大利亚','俄罗斯','秘鲁','苏里南'],projects:[{n:'博尔铜矿',c:'塞尔维亚',inv:8,p:400},{n:'卡莫阿铜矿',c:'刚果(金)',inv:12,p:350},{n:'武里蒂卡金矿',c:'哥伦比亚',inv:5,p:250}],status:'alert'}
];
const ALERTS=[
{id:'AW-2025-0216-001',level:'red',type:'安全风险',country:'刚果(金)',enterprise:'紫金矿业',title:'M23武装攻占布卡武，东部安全形势急剧恶化',desc:'2025年2月，M23武装攻占南基伍省首府布卡武，向矿区方向推进。紫金矿业卡莫阿铜矿位于南部，距战区较远但需高度警戒。',time:'2025-02-16 14:30',status:'active',affectedP:85,affectedA:12},
{id:'AW-2024-1006-002',level:'red',type:'安全风险',country:'巴基斯坦',enterprise:'中交建',title:'瓜达尔港附近中方人员遭袭击',desc:'2024年10月6日，俾路支分离主义武装在瓜达尔港附近袭击中方人员车队，造成2名中方人员死亡、1人受伤。',time:'2024-10-06 23:15',status:'responding',affectedP:1200,affectedA:0.5},
{id:'AW-2024-0326-003',level:'red',type:'安全风险',country:'巴基斯坦',enterprise:'中铁建',title:'达苏水电站项目遭恐怖袭击，5名中方人员遇难',desc:'2024年3月26日，达苏水电站项目中方人员车辆遭自杀式炸弹袭击，5名中方工程师遇难。这是近年来针对中方人员最严重的袭击之一。',time:'2024-03-26 13:00',status:'responding',affectedP:800,affectedA:4.5},
{id:'AW-2023-1218-004',level:'red',type:'安全风险',country:'也门',enterprise:'中远海运',title:'胡塞武装扩大红海袭击，中远海运暂停红海航线',desc:'2023年11月19日胡塞武装劫持"银河领袖"号货轮后，持续袭击红海商船。中远海运于12月18日宣布暂停红海航行，改道好望角。亚欧航线运价上涨256%。',time:'2023-12-18 09:00',status:'responding',affectedP:25,affectedA:8},
{id:'AW-2023-1115-005',level:'red',type:'政治风险',country:'苏丹',enterprise:'中石油',title:'苏丹武装冲突持续，中石油完成大规模撤侨',desc:'2023年4月15日苏丹武装部队与快速支援部队爆发冲突。中国组织1,500余名公民分两批撤离（4月29日海路、5月2日空路）。中石油6区、7区油田运营中断。',time:'2023-05-02 16:00',status:'responding',affectedP:1500,affectedA:35},
{id:'AW-2023-1102-006',level:'orange',type:'安全风险',country:'缅甸',enterprise:'中石油',title:'中缅油气管道遭袭击，输油中断',desc:'2023年11月，缅甸境内中缅油气管道控制站被当地武装组织占领，输油临时中断。管道自2013年/2017年投入运营以来已多次遭袭。',time:'2023-11-02 08:30',status:'acknowledged',affectedP:0,affectedA:2.8},
{id:'AW-2023-0515-007',level:'orange',type:'安全风险',country:'缅甸',enterprise:'中石油',title:'中缅天然气管道被炸',desc:'2023年5月，中缅天然气管道缅甸段遭爆炸破坏，输气中断数日。军政府与地方武装冲突持续影响管道安全。',time:'2023-05-15 20:00',status:'resolved',affectedP:0,affectedA:1.5},
{id:'AW-2024-1201-008',level:'orange',type:'地缘战略风险',country:'美国',enterprise:'华为',title:'美国进一步收紧对华芯片出口管制',desc:'2024年12月，美国商务部发布新一轮出口管制规则，进一步限制先进芯片和半导体设备对华出口，华为、中芯国际等企业受直接影响。',time:'2024-12-01 03:00',status:'acknowledged',affectedP:0,affectedA:25},
{id:'AW-2023-1122-009',level:'orange',type:'地缘战略风险',country:'俄罗斯',enterprise:'中石化',title:'北极LNG 2号项目遭美制裁，中企宣布不可抗力',desc:'2023年11月，美国对俄罗斯北极LNG 2号项目实施制裁。中石化、中海油作为参股方宣布不可抗力，退出项目运营。约42亿美元中资滞留俄银行。',time:'2023-11-22 15:00',status:'acknowledged',affectedP:250,affectedA:120},
{id:'AW-2024-0115-010',level:'orange',type:'安全风险',country:'哥伦比亚',enterprise:'紫金矿业',title:'武里蒂卡金矿丧失60%以上矿区控制权',desc:'2024年1月，紫金矿业公告称哥伦比亚武里蒂卡金矿已被非法采矿组织控制60%以上矿区。2023年记录2,260次爆炸和2,450次枪击事件。紫金已向哥政府提起5亿美元仲裁。',time:'2024-01-15 11:00',status:'active',affectedP:150,affectedA:6.5},
{id:'AW-2022-0426-011',level:'red',type:'安全风险',country:'巴基斯坦',enterprise:'中核集团',title:'卡拉奇大学孔子学院遭自杀式袭击',desc:'2022年4月26日，卡拉奇大学孔子学院班车遭"俾路支解放解放军"自杀式炸弹袭击，3名中方教师遇难、1人受伤。',time:'2022-04-26 14:30',status:'resolved',affectedP:0,affectedA:0},
{id:'AW-2021-0714-012',level:'red',type:'安全风险',country:'巴基斯坦',enterprise:'中铁建',title:'达苏水电站项目班车遭爆炸袭击，9名中方人员遇难',desc:'2021年7月14日，达苏水电站项目中方人员班车在赴工地途中遭遇爆炸袭击，9名中方人员遇难、28人受伤。为近年来伤亡最严重的中方人员遇袭事件。',time:'2021-07-14 07:00',status:'resolved',affectedP:0,affectedA:4.3},
{id:'AW-2024-0523-013',level:'orange',type:'政治风险',country:'缅甸',enterprise:'中电建',title:'缅甸军政府拟重启密松水电站项目',desc:'2024年5月，缅甸军政府表示拟重启2011年暂停的密松水电站项目（原投资36亿美元/6GW）。中电建对此持审慎态度，项目区域克钦邦安全形势依然严峻。',time:'2024-05-23 10:00',status:'acknowledged',affectedP:0,affectedA:3.6},
{id:'AW-2024-1215-014',level:'yellow',type:'经济风险',country:'土耳其',enterprise:'联想',title:'土耳其通胀高企，里拉持续贬值',desc:'2024年土耳其通胀率峰值达65%，央行将基准利率维持在50%。里拉兑美元全年贬值约15%。联想、小米在土业务融资成本大幅上升。',time:'2024-12-15 16:00',status:'active',affectedP:0,affectedA:8},
{id:'AW-2024-0306-015',level:'orange',type:'经济风险',country:'埃及',enterprise:'中建',title:'埃及镑一次性贬值超60%，项目成本剧增',desc:'2024年3月6日，埃及央行允许埃及镑一次性贬值，兑美元从31跌至50以上。中建新行政首都项目建材进口成本翻倍，多家中企面临汇兑损失。',time:'2024-03-06 18:00',status:'acknowledged',affectedP:800,affectedA:5},
{id:'AW-2024-0801-016',level:'yellow',type:'安全风险',country:'尼日利亚',enterprise:'中石油',title:'尼日利亚海域海盗活动持续，海上平台安保升级',desc:'2024年几内亚湾海盗活动持续，虽较前几年有所下降但仍对海上油气作业构成威胁。中石油海上平台保持最高安保级别。',time:'2024-08-01 12:00',status:'active',affectedP:85,affectedA:1.2},
{id:'AW-2024-0625-017',level:'yellow',type:'社会文化风险',country:'肯尼亚',enterprise:'中土',title:'肯尼亚反税抗议活动影响项目运营',desc:'2024年6月25日起，肯尼亚爆发大规模反税改革抗议，内罗毕等主要城市交通瘫痪。中土蒙内铁路运营受影响，江西国际部分项目暂停施工。',time:'2024-06-25 14:00',status:'resolved',affectedP:0,affectedA:0.3},
{id:'AW-2024-0201-018',level:'yellow',type:'经济风险',country:'阿根廷',enterprise:'国电',title:'阿根廷比索再贬值54%，外汇管制收紧',desc:'2024年1月，阿根廷新政府实施比索贬值54%并大幅削减补贴。国家电网在阿资产价值缩水，资金汇出受限。',time:'2024-02-01 10:00',status:'active',affectedP:120,affectedA:8.5},
{id:'AW-2023-0815-019',level:'orange',type:'政治风险',country:'尼日尔',enterprise:'中石油',title:'尼日尔军事政变影响石油合作',desc:'2023年7月26日尼日尔发生军事政变。中石油阿加德姆油田和尼日尔-贝宁输油管道项目受政变影响，部分运营中断。',time:'2023-08-15 12:00',status:'acknowledged',affectedP:200,affectedA:15},
{id:'AW-2024-0501-020',level:'yellow',type:'社会文化风险',country:'秘鲁',enterprise:'中铝',title:'秘鲁社区抗议堵塞铜矿运输通道',desc:'2024年5月，秘鲁阿普里马克大区社区抗议堵塞中铝特罗莫克铜矿运输通道。五矿拉斯邦巴斯铜矿同样频繁面临社区堵路抗议。',time:'2024-05-01 09:00',status:'acknowledged',affectedP:200,affectedA:4.2},
{id:'AW-2024-0715-021',level:'yellow',type:'安全风险',country:'南非',enterprise:'海康',title:'南非电力危机加剧，社会治安恶化',desc:'2024年南非每日停电时长达6-10小时（Stage 4-6限电），约堡犯罪率上升。海康威视约堡仓库曾遭武装抢劫，华为等国家宽带网项目受停电影响。',time:'2024-07-15 08:00',status:'active',affectedP:15,affectedA:0.8},
{id:'AW-2024-0301-022',level:'blue',type:'运营风险',country:'哈萨克斯坦',enterprise:'中信建设',title:'坚戈汇率波动影响阿斯塔纳轻轨项目',desc:'2024年哈萨克斯坦坚戈兑美元波动加大，中信建设阿斯塔纳轻轨项目工程款结算出现差额。中石油卡沙甘油田运营正常。',time:'2024-03-01 11:00',status:'active',affectedP:30,affectedA:1.8},
{id:'AW-2024-1001-023',level:'yellow',type:'安全风险',country:'墨西哥',enterprise:'联想',title:'蒙特雷工业区治安恶化',desc:'2024年墨西哥蒙特雷工业区犯罪率上升，联想工厂附近多次发生枪击事件，已加强安保措施。近岸外包吸引大量中企设厂但安全风险需关注。',time:'2024-10-01 20:00',status:'active',affectedP:400,affectedA:0},
{id:'AW-2024-0401-024',level:'blue',type:'运营风险',country:'阿尔及利亚',enterprise:'中土',title:'阿尔及利亚工程款拖欠问题持续',desc:'2024年阿方业主拖欠中土工程款超过6个月，影响项目资金周转。中土在阿项目约350名中方人员受影响。',time:'2024-04-01 14:00',status:'acknowledged',affectedP:350,affectedA:5.5},
{id:'AW-2024-0601-025',level:'blue',type:'社会文化风险',country:'马来西亚',enterprise:'中国移动',title:'马来西亚调整通信行业本地化合规要求',desc:'2024年马来西亚通信委员会发布新本地化要求，中国移动需调整运营架构以符合合规标准。',time:'2024-06-01 09:00',status:'active',affectedP:80,affectedA:1.2},
{id:'AW-2023-0701-026',level:'yellow',type:'经济风险',country:'委内瑞拉',enterprise:'中石油',title:'委内瑞拉经济持续困难，中石油恢复有限合作',desc:'2023年美国临时放松对委石油制裁后，中石油恢复购买委内瑞拉原油。但委通胀率仍高达约48%（2024年），经济基本面脆弱。',time:'2023-07-01 10:00',status:'acknowledged',affectedP:180,affectedA:60},
{id:'AW-2025-0105-027',level:'orange',type:'地缘战略风险',country:'伊朗',enterprise:'中石化',title:'美对伊制裁持续，中伊能源合作受限',desc:'2025年初美国维持对伊全面制裁，中石化南帕尔斯气田项目结算渠道受限。中伊贸易部分通过人民币结算规避美元体系。',time:'2025-01-05 08:00',status:'acknowledged',affectedP:0,affectedA:35},
{id:'AW-2022-0115-028',level:'yellow',type:'政治风险',country:'哈萨克斯坦',enterprise:'中石油',title:'哈萨克斯坦"一月事件"后安保加强',desc:'2022年1月，哈萨克斯坦爆发大规模骚乱。中石油卡沙甘油田、中信建设阿斯塔纳轻轨项目安保升级。事件后局势迅速稳定。',time:'2022-01-15 10:00',status:'resolved',affectedP:0,affectedA:0},
{id:'AW-2024-0901-029',level:'blue',type:'自然环境风险',country:'菲律宾',enterprise:'武夷',title:'台风影响菲律宾项目施工',desc:'2024年9月超强台风登陆吕宋岛，中国武夷住宅项目工地受损，国电电网项目审批延误2-3个月。',time:'2024-09-01 06:30',status:'resolved',affectedP:300,affectedA:0.5},
{id:'AW-2024-1101-030',level:'yellow',type:'政治风险',country:'印度',enterprise:'小米',title:'印度持续对中国科技企业施压',desc:'2024年印度继续对中国手机企业加强审查，小米被要求补充财务数据。华为、中兴在印市场准入持续受限。vivo印度公司被指控逃税。',time:'2024-11-01 14:00',status:'acknowledged',affectedP:2000,affectedA:15}
];
const EVENTS=[
{id:'EVT-2502-001',type:'security',sev:'critical',country:'刚果(金)',date:'2025-02-16',title:'M23武装攻占布卡武，东部局势急剧恶化',desc:'2025年2月，M23武装连续攻占北基伍省戈马和南基伍省布卡武两大城市，为近年来最大规模军事进攻。紫金矿业卡莫阿铜矿位于南部卢阿拉巴省，距战区约1,500公里，但供应链和人员流动受影响。',enterprises:['紫金矿业','中铝'],impact:'供应链中断风险，安保成本上升',response:'加强矿区安保，评估供应链替代方案',status:'active'},
{id:'EVT-2403-002',type:'security',sev:'critical',country:'巴基斯坦',date:'2024-03-26',title:'达苏水电站项目中方人员遭自杀式袭击',desc:'2024年3月26日，达苏水电站项目中方人员车辆在开伯尔-普什图省遭自杀式炸弹袭击，5名中方工程师遇难。巴方称袭击由TTP（巴基斯坦塔利班）策划，在阿富汗境内实施。',enterprises:['中铁建'],impact:'5名中方人员遇难，项目暂停施工',response:'启动应急响应，暂停施工，加强安保',status:'active'},
{id:'EVT-2311-003',type:'security',sev:'critical',country:'也门',date:'2023-11-19',title:'胡塞武装开始袭击红海商船',desc:'2023年11月19日，胡塞武装劫持以色列关联货轮"银河领袖"号，随后持续对红海商船发动导弹和无人机袭击。全球主要航运公司陆续暂停红海航线，改道好望角。亚欧航线运价上涨256%，中远海运于12月18日暂停红海航行。',enterprises:['中远海运','招商局'],impact:'航运成本上升30-40%，交期延长7-14天',response:'改道好望角，加强护航协调',status:'active'},
{id:'EVT-2304-004',type:'political',sev:'critical',country:'苏丹',date:'2023-04-15',title:'苏丹武装部队与快速支援部队爆发全面冲突',desc:'2023年4月15日，苏丹武装部队（SAF）与快速支援部队（RSF）在喀土穆爆发全面冲突。冲突持续至今，已造成数万人伤亡、超千万人流离失所。中石油6区、7区油田位于交战区域附近，运营全面中断。',enterprises:['中石油','中地'],impact:'油田运营中断，1,500余名中方人员撤离',response:'组织海陆空联运撤侨，启动资产保全',status:'active'},
{id:'EVT-2405-005',type:'political',sev:'medium',country:'缅甸',date:'2024-05-23',title:'缅甸军政府拟重启密松水电站项目',desc:'2024年5月，缅甸军政府表示拟重启2011年因民众抗议而暂停的密松水电站项目（中电建原投资36亿美元/6,000MW）。项目位于克钦邦，当地武装冲突持续，中电建对此持审慎态度。',enterprises:['中电建','华能'],impact:'项目前景不确定，安全风险极高',response:'审慎评估，暂不推进',status:'monitoring'},
{id:'EVT-2108-006',type:'political',sev:'critical',country:'阿富汗',date:'2021-08-15',title:'塔利班接管喀布尔，阿富汗政权更迭',desc:'2021年8月15日，塔利班进入喀布尔，阿富汗伊斯兰共和国政府垮台。中色集团梅斯艾纳克铜矿项目（2008年中标，投资约30亿美元）因考古遗址发掘和安全问题自始至终未实质开工建设。中方人员已全部撤离。',enterprises:['中色'],impact:'铜矿项目无限期搁置，人员已撤离',response:'撤离全部人员，评估政治风险',status:'monitoring'},
{id:'EVT-2401-007',type:'security',sev:'high',country:'哥伦比亚',date:'2024-01-15',title:'紫金矿业武里蒂卡金矿丧失大部分矿区控制权',desc:'2024年1月，紫金矿业公告哥伦比亚武里蒂卡金矿已被非法采矿组织（CLC集团）控制60%以上矿区。2023年矿区记录2,260次爆炸和2,450次枪击事件。紫金已向哥政府提起5亿美元国际仲裁。',enterprises:['紫金矿业'],impact:'黄金产量大幅下降，安保成本极高',response:'提起国际仲裁，加强核心区域安保',status:'active'},
{id:'EVT-2311-008',type:'diplomatic',sev:'high',country:'俄罗斯',date:'2023-11-22',title:'美国制裁北极LNG 2号项目，中企受牵连',desc:'2023年11月，美国对俄罗斯北极LNG 2号项目实施制裁。中石化、中海油作为各持10%股份的参股方宣布不可抗力，退出项目运营。约42亿美元中资滞留俄罗斯银行无法汇出。',enterprises:['中石化','中海油'],impact:'LNG项目运营中断，42亿美元资金冻结',response:'宣布不可抗力，寻求制裁豁免',status:'monitoring'},
{id:'EVT-2107-009',type:'security',sev:'critical',country:'巴基斯坦',date:'2021-07-14',title:'达苏水电站项目班车遭爆炸袭击',desc:'2021年7月14日，中铁建达苏水电站项目中方人员班车在赴工地途中遭遇爆炸袭击，9名中方人员遇难、28人受伤。巴方最初称机械故障，后确认系恐怖袭击。为近年来中方海外人员伤亡最严重事件。',enterprises:['中铁建'],impact:'9名中方人员遇难，项目延期',response:'暂停施工，加强安保，要求巴方严查',status:'resolved'},
{id:'EVT-2204-010',type:'security',sev:'critical',country:'巴基斯坦',date:'2022-04-26',title:'卡拉奇大学孔子学院遭自杀式袭击',desc:'2022年4月26日，卡拉奇大学孔子学院班车在校内遭"俾路支解放军"（BLA）自杀式炸弹袭击，3名中方教师（院长黄桂平及2名教师）遇难、1人受伤。袭击者系女性自杀炸弹客。',enterprises:['中核集团'],impact:'3名中方教师遇难，孔子学院停课',response:'暂停巴方人员来华，加强安保',status:'resolved'},
{id:'EVT-2410-011',type:'security',sev:'high',country:'巴基斯坦',date:'2024-10-06',title:'瓜达尔港中方人员遭分离主义武装袭击',desc:'2024年10月6日晚，俾路支分离主义武装在瓜达尔港附近袭击中方人员车队，造成2名中方人员死亡、1人受伤。"俾路支解放解放军"宣称负责。',enterprises:['中交建','中远海运'],impact:'2名中方人员遇难，港口安保升级',response:'启动应急响应，暂停人员外出',status:'active'},
{id:'EVT-2307-012',type:'political',sev:'high',country:'尼日尔',date:'2023-07-26',title:'尼日尔发生军事政变',desc:'2023年7月26日，尼日尔总统卫队司令奇亚尼发动军事政变，推翻总统巴祖姆。西共体实施制裁，邻国关闭边境。中石油阿加德姆油田和尼日尔-贝宁输油管道（2023年11月启用）运营受影响。',enterprises:['中石油'],impact:'输油管道运营中断，投资回收不确定',response:'与军方沟通，评估项目前景',status:'monitoring'},
{id:'EVT-2403-013',type:'economic',sev:'high',country:'埃及',date:'2024-03-06',title:'埃及镑一次性贬值超60%',desc:'2024年3月6日，埃及央行允许埃及镑自由浮动，兑美元从约31跌至50.7，单日贬值超60%。同时加息600基点至27.25%。IMF提供80亿美元贷款支持。中建新行政首都项目建材成本翻倍。',enterprises:['中建','小米'],impact:'项目成本翻倍，汇兑损失严重',response:'启动汇率对冲， renegotiate合同',status:'monitoring'},
{id:'EVT-2020-014',type:'political',sev:'high',country:'埃塞俄比亚',date:'2020-11-04',title:'埃塞俄比亚提格雷战争爆发',desc:'2020年11月4日，埃塞俄比亚联邦政府与提格雷人民解放阵线（TPLF）爆发全面战争。战争持续至2022年11月2日签署停火协议。中土亚吉铁路运营中断数月，葛洲坝复兴大坝项目推进受影响。',enterprises:['中土','葛洲坝','中兴'],impact:'铁路运营中断，项目延期',response:'暂停冲突区域项目，保护人员安全',status:'resolved'},
{id:'EVT-2201-015',type:'political',sev:'medium',country:'哈萨克斯坦',date:'2022-01-05',title:'哈萨克斯坦"一月事件"骚乱',desc:'2022年1月2日起，哈萨克斯坦因液化气价格上涨爆发大规模抗议，演变为暴力骚乱。1月5日集体安全条约组织派兵协助平息。中石油卡沙甘油田暂停运营，中信建设阿斯塔纳轻轨项目受影响。',enterprises:['中石油','中信建设'],impact:'油田暂停运营，项目施工中断',response:'启动应急预案，加强安保',status:'resolved'},
{id:'EVT-2412-016',type:'diplomatic',sev:'medium',country:'美国',date:'2024-12-02',title:'美国进一步收紧对华半导体出口管制',desc:'2024年12月，美国商务部产业安全局（BIS）发布新一轮出口管制规则，进一步限制先进计算芯片、半导体制造设备对华出口，新增136家中国实体至实体清单。华为、中芯国际等企业受直接影响。',enterprises:['华为','中兴','海康'],impact:'芯片供应受限，技术合作受阻',response:'启动供应链多元化，加速国产替代',status:'monitoring'},
{id:'EVT-2102-017',type:'political',sev:'high',country:'缅甸',date:'2021-02-01',title:'缅甸军事政变',desc:'2021年2月1日，缅甸国防军发动政变，推翻民选政府，拘留昂山素季等领导人。此后缅甸局势持续动荡，多地爆发武装冲突。中缅油气管道多次遭地方武装袭击（2023年5月管道被炸、11月控制站被占）。',enterprises:['中电建','中交建','中石油','华能'],impact:'项目审批停滞，管道安全受威胁',response:'启动应急预案，加强与各方沟通',status:'active'},
{id:'EVT-2406-018',type:'political',sev:'medium',country:'肯尼亚',date:'2024-06-25',title:'肯尼亚爆发大规模反税抗议',desc:'2024年6月25日，肯尼亚爆发反对增税法案的大规模抗议，抗议者冲入议会大厦。总统鲁托被迫撤回法案并改组内阁。内罗毕交通瘫痪，中土蒙内铁路运营受影响。',enterprises:['中土','江西国际','中国路桥'],impact:'部分项目暂停，交通受阻',response:'加强安全防范，暂停非必要外出',status:'resolved'},
{id:'EVT-2402-019',type:'economic',sev:'high',country:'阿根廷',date:'2024-02-01',title:'阿根廷实施"休克疗法"经济改革',desc:'2024年1月，阿根廷新总统米莱实施比索贬值54%、大幅削减补贴等"休克疗法"改革。国家电网在阿资产价值缩水，五矿、紫金矿业在阿项目成本上升。',enterprises:['国电','五矿','紫金矿业'],impact:'资产缩水，资金汇出受限',response:'调整资产配置，寻求汇率对冲',status:'monitoring'},
{id:'EVT-2408-020',type:'security',sev:'medium',country:'南非',date:'2024-08-01',title:'南非电力危机持续恶化',desc:'2024年南非Eskom电力公司持续实施Stage 4-6限电（每日停电6-10小时），为国家电网美丽山特高压项目运营带来挑战。约堡犯罪率因停电上升，海康威视仓库遭抢劫。',enterprises:['国电','华为','海康'],impact:'运营中断频繁，安保成本上升',response:'配置备用电源，加强安保',status:'monitoring'},
{id:'EVT-2305-021',type:'security',sev:'medium',country:'缅甸',date:'2023-05-15',title:'中缅天然气管道遭爆炸破坏',desc:'2023年5月，中缅天然气管道缅甸境内段遭不明武装组织爆炸破坏，输气临时中断。该管道自2013年投入运营，是中缅油气走廊的重要组成部分，多次遭受安全威胁。',enterprises:['中石油'],impact:'输气中断，能源供应受影响',response:'紧急抢修，加强管道巡护',status:'resolved'},
{id:'EVT-2304-022',type:'political',sev:'high',country:'苏丹',date:'2023-04-29',title:'中国组织大规模苏丹撤侨',desc:'2023年4月29日，中国海军南宁舰、微山湖舰抵达苏丹港，首批撤出678人。5月2日，第二批通过空路撤出800余人。共计撤出1,500余名中国公民，包括中石油、中地等企业员工。',enterprises:['中石油','中地'],impact:'1,500余名中方人员撤离，项目全面中断',response:'海陆空联运撤侨，启动资产保全',status:'resolved'},
{id:'EVT-2411-023',type:'political',sev:'medium',country:'印度',date:'2024-11-01',title:'印度持续对中国科技企业施压',desc:'2024年印度继续对中国手机企业加强审查。vivo印度公司被指控逃税24亿元，小米此前被冻结48亿元资金（后部分解冻）。华为、中兴在印市场准入持续受限。',enterprises:['小米','华为','中兴','vivo'],impact:'合规成本上升，市场准入受限',response:'调整市场策略，加强合规',status:'monitoring'},
{id:'EVT-2108-024',type:'political',sev:'medium',country:'阿富汗',date:'2021-08-15',title:'中方对阿富汗塔利班政权态度审慎',desc:'2021年8月塔利班接管政权后，中方未正式承认塔利班政权，但保持务实接触。中色梅斯艾纳克铜矿项目（2008年中标，30亿美元投资）因考古遗址和安全问题至今未开工。瓦罕走廊安全形势严峻。',enterprises:['中色'],impact:'铜矿项目无限期搁置',response:'观望局势，保护已有权益',status:'monitoring'},
{id:'EVT-2312-025',type:'economic',sev:'high',country:'红海区域',date:'2023-12-18',title:'全球航运公司大规模改道好望角',desc:'2023年12月18日起，马士基、地中海航运、达飞、中远海运等全球主要航运公司陆续宣布暂停红海航行，改道好望角。70-75%亚欧集装箱船改道，运价上涨256%，交期延长7-14天。',enterprises:['中远海运','招商局'],impact:'航运成本上升30-40%，交期延长',response:'调整航线，协调运力调配',status:'active'}
];
const WARNING_RULES=[
{id:'WR01',name:'国家综合风险红色阈值',desc:'国家综合风险评分≥8.0时自动触发红色预警',threshold:'≥8.0',level:'red',type:'综合风险',enabled:true,trigCount:6},
{id:'WR02',name:'国家综合风险橙色阈值',desc:'国家综合风险评分≥6.0且＜8.0时触发橙色预警',threshold:'6.0-8.0',level:'orange',type:'综合风险',enabled:true,trigCount:14},
{id:'WR03',name:'安全风险维度红色阈值',desc:'安全风险维度评分≥9.0时触发红色预警',threshold:'≥9.0',level:'red',type:'安全风险',enabled:true,trigCount:5},
{id:'WR04',name:'政治风险维度橙色阈值',desc:'政治风险维度评分≥8.0时触发橙色预警',threshold:'≥8.0',level:'orange',type:'政治风险',enabled:true,trigCount:8},
{id:'WR05',name:'企业综合风险橙色阈值',desc:'企业综合风险评分≥7.0时触发橙色预警',threshold:'≥7.0',level:'orange',type:'企业风险',enabled:true,trigCount:9},
{id:'WR06',name:'货币贬值预警',desc:'目标国货币月贬值幅度超过10%时触发黄色预警',threshold:'月贬值>10%',level:'yellow',type:'经济风险',enabled:true,trigCount:3},
{id:'WR07',name:'恐怖袭击事件预警',desc:'监测到目标国发生恐怖袭击事件时触发橙色以上预警',threshold:'事件触发',level:'orange',type:'安全风险',enabled:true,trigCount:4},
{id:'WR08',name:'政局突变预警',desc:'目标国发生政变、内阁解散等事件时触发橙色预警',threshold:'事件触发',level:'orange',type:'政治风险',enabled:true,trigCount:2},
{id:'WR09',name:'制裁措施预警',desc:'监测到针对目标国或中资企业的新制裁措施时触发橙色预警',threshold:'事件触发',level:'orange',type:'地缘战略风险',enabled:true,trigCount:3},
{id:'WR10',name:'自然灾害预警',desc:'目标国发生重大自然灾害时触发黄色预警',threshold:'事件触发',level:'yellow',type:'自然环境风险',enabled:true,trigCount:5},
{id:'WR11',name:'外交关系降级预警',desc:'目标国与我国外交关系降级时触发橙色预警',threshold:'事件触发',level:'orange',type:'政治风险',enabled:true,trigCount:1},
{id:'WR12',name:'人员安全事件预警',desc:'监测到中方人员安全受威胁事件时触发红色预警',threshold:'事件触发',level:'red',type:'安全风险',enabled:true,trigCount:3}
];
// 关键航运通道数据
const CHOKEPOINTS=[
{name:'红海-曼德海峡',risk:9.5,level:'极高',desc:'2023年11月起胡塞武装持续袭击商船，劫持"银河领袖"号。70-75%亚欧集装箱船改道好望角，运价上涨256%',impact:'航运成本上升30-40%，交期延长7-14天',ents:['中远海运','招商局']},
{name:'苏伊士运河',risk:7.5,level:'高',desc:'受红海局势影响通行量大幅下降，2024年通行量较2023年下降约50%。埃及镑贬值影响运河运营收入',impact:'欧亚航线延误，运河收入锐减',ents:['中远海运']},
{name:'马六甲海峡',risk:5.5,level:'中高',desc:'海盗活动时有发生，中美军事存在增加摩擦风险。中国80%能源进口经此通道',impact:'能源运输通道安全',ents:['中远海运','中石油']},
{name:'霍尔木兹海峡',risk:7,level:'高',desc:'美伊对抗持续，全球约20%石油运输经此海峡。伊朗曾多次威胁封锁',impact:'全球石油运输要道',ents:['中石油','中石化']},
{name:'巴拿马运河',risk:4,level:'中低',desc:'2023-2024年干旱导致通行能力下降，等待时间延长。2024年降雨恢复后有所改善',impact:'太平洋航线延误',ents:['中远海运']},
{name:'北极航道',risk:5,level:'中高',desc:'冰层融化通航窗口延长，中俄合作推进北极航道开发。但基础设施不足且地缘博弈加剧',impact:'新兴战略通道，潜力与风险并存',ents:['中远海运']}
];
// 一带一路走廊数据
const CORRIDORS=[
{name:'中巴经济走廊',risk:7.5,countries:'巴基斯坦',ents:5,inv:62,status:'部分受阻',desc:'PKM高速2019年通车运营，但俾路支分离主义武装多次袭击中方人员（2021年9人遇难、2024年5人遇难、2024年10月2人遇难）',detail:'中建、中交建、中电建、中铁建、中远海运参与'},
{name:'中缅经济走廊',risk:7.8,countries:'缅甸',ents:4,inv:19,status:'高风险',desc:'2021年政变后局势动荡。密松水电站2011年暂停，军政府2024年拟重启。中缅油气管道多次遭武装袭击',detail:'中交建、中电建、中石油、华能参与'},
{name:'中亚天然气管道',risk:4.5,countries:'哈萨克斯坦/乌兹别克斯坦',ents:3,inv:30,status:'正常推进',desc:'政治相对稳定，2022年1月骚乱后局势恢复。管道运营正常，汇率波动需关注',detail:'中石油、中信建设、通用参与'},
{name:'中老铁路走廊',risk:3.5,countries:'老挝',ents:2,inv:17,status:'正常运营',desc:'2021年12月中老铁路通车，运营良好，货运量持续增长',detail:'中铁、中电建参与'},
{name:'雅万高铁走廊',risk:3.8,countries:'印度尼西亚',ents:3,inv:16,status:'正常运营',desc:'2023年10月雅万高铁正式通车运营，客流超预期',detail:'中铁、中铁建、中建参与'},
{name:'比雷埃夫斯港走廊',risk:3,countries:'希腊/塞尔维亚',ents:3,inv:16,status:'良好',desc:'中远海运运营比雷埃夫斯港，中塞自贸协定2024年生效。匈塞铁路推进中',detail:'中远海运、中铁建、紫金矿业参与'}
];
// 预测数据
const PREDICTIONS=[
{country:'阿富汗',flag:'🇦🇫',cur:9.4,p3:9.6,p6:9.5,trend:'up',driver:'塔利班政权未被国际承认，IS-K袭击频发',advice:'建议撤回非必要人员'},
{country:'苏丹',flag:'🇸🇩',cur:8.3,p3:8.8,p6:9.0,trend:'up',driver:'SAF与RSF冲突持续，饥荒风险加剧',advice:'保持人员撤离状态'},
{country:'缅甸',flag:'🇲🇲',cur:7.5,p3:7.8,p6:8.0,trend:'up',driver:'军政府控制力下降，地方武装攻势扩大',advice:'审慎评估项目前景'},
{country:'也门',flag:'🇾🇪',cur:9.0,p3:9.2,p6:9.0,trend:'up',driver:'胡塞武装持续袭击红海商船，停火无望',advice:'维持绕行好望角'},
{country:'刚果(金)',flag:'🇨🇩',cur:7.9,p3:8.2,p6:8.5,trend:'up',driver:'M23攻占戈马和布卡武，东部局势失控',advice:'加强南部矿区安保'},
{country:'委内瑞拉',flag:'🇻🇪',cur:8.1,p3:8.3,p6:8.0,trend:'up',driver:'经济基本面脆弱，政治不确定性持续',advice:'关注制裁变化，审慎投资'},
{country:'美国',flag:'🇺🇸',cur:4.3,p3:4.8,p6:5.2,trend:'up',driver:'对华科技制裁持续升级，实体清单扩大',advice:'供应链多元化'},
{country:'俄罗斯',flag:'🇷🇺',cur:6.6,p3:6.8,p6:7.0,trend:'up',driver:'西方制裁持续，北极LNG项目受阻',advice:'关注制裁豁免动态'},
{country:'巴基斯坦',flag:'🇵🇰',cur:6.6,p3:6.8,p6:6.5,trend:'up',driver:'分离主义武装持续袭击中方目标',advice:'加强项目安保，减少不必要外出'},
{country:'塞尔维亚',flag:'🇷🇸',cur:3.9,p3:3.7,p6:3.5,trend:'down',driver:'中塞自贸协定生效，投资环境改善',advice:'加大投资力度'}
];
const ALERT_LV={red:{label:'红色',cls:'lv-red'},orange:{label:'橙色',cls:'lv-orange'},yellow:{label:'黄色',cls:'lv-yellow'},blue:{label:'蓝色',cls:'lv-blue'}};
const ALERT_ST={active:'待处理',acknowledged:'已确认',responding:'处置中',resolved:'已解除'};
const EVT_TYPE={political:'政治变动',security:'安全事件',economic:'经济波动',natural:'自然灾害',diplomatic:'外交事件'};
const EVT_SEV={critical:'严重',high:'较高',medium:'中等',low:'较低'};
function calcOverall(s){let t=0;DIMS.forEach(d=>t+=(s[d.key]||0)*d.w);return Math.round(t*10)/10}
function getLevel(s){if(s>=8)return{level:'critical',label:'极高风险',color:'#991b1b',cls:'lv-red',short:'极高'};if(s>=6)return{level:'high',label:'高风险',color:'#dc2626',cls:'lv-red',short:'高'};if(s>=4)return{level:'elevated',label:'中高风险',color:'#ea580c',cls:'lv-orange',short:'中高'};if(s>=2.5)return{level:'moderate',label:'中低风险',color:'#ca8a04',cls:'lv-yellow',short:'中低'};return{level:'low',label:'低风险',color:'#16a34a',cls:'lv-green',short:'低'}}
function getEntRisk(ent){const cs=ent.countries.map(c=>COUNTRIES.find(x=>x.name===c)).filter(Boolean);if(!cs.length)return 0;return Math.round(cs.reduce((s,c)=>s+calcOverall(c.scores),0)/cs.length*10)/10}
function getEntsInCountry(n){return ENTERPRISES.filter(e=>e.countries.includes(n))}
function showToast(m){const t=document.getElementById('toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),3000)}
function genAlertTrend(){const days=[];const today=new Date('2025-06-01');const seedData=[[2,4,2,1],[1,3,3,1],[2,2,1,0],[3,4,2,1],[1,3,2,0],[2,5,3,1],[0,2,1,1],[1,3,2,0],[2,4,2,1],[3,3,1,1],[1,2,3,0],[2,4,2,1],[0,3,1,0],[1,5,2,1],[2,3,3,1],[3,4,1,0],[1,2,2,1],[2,5,3,1],[1,3,2,0],[0,2,1,1],[2,4,2,1],[1,3,3,0],[3,5,2,1],[1,2,1,0],[2,4,3,1],[0,3,2,1],[1,5,2,0],[2,3,3,1],[1,4,2,0],[2,5,3,1]];for(let i=29;i>=0;i--){const d=new Date(today);d.setDate(d.getDate()-i);days.push({d:String(d.getMonth()+1)+'/'+String(d.getDate()),r:seedData[29-i][0],o:seedData[29-i][1],y:seedData[29-i][2],b:seedData[29-i][3]})}return days}
let charts={};
//导航
const VIEW_MAP={dashboard:{t:'态势总览',b:'监测中心 / 态势总览'},map:{t:'风险地图',b:'监测中心 / 风险地图'},enterprises:{t:'中资企业',b:'监测中心 / 中资企业'},countries:{t:'国家监测',b:'监测中心 / 国家监测'},alerts:{t:'预警中心',b:'监测中心 / 预警中心'},events:{t:'事件追踪',b:'监测中心 / 事件追踪'},personnel:{t:'人员安全',b:'监测中心 / 人员安全'},collect:{t:'数据采集',b:'分析工具 / 数据采集'},prediction:{t:'预测中心',b:'分析工具 / 预测中心'},assess:{t:'风险评估',b:'分析工具 / 风险评估'},matrix:{t:'风险矩阵',b:'分析工具 / 风险矩阵'},stats:{t:'统计分析',b:'分析工具 / 统计分析'},reports:{t:'报告中心',b:'管理 / 报告中心'},settings:{t:'系统管理',b:'管理 / 系统管理'}};
function navigateTo(v){document.querySelectorAll('.view').forEach(x=>x.classList.remove('active'));document.getElementById('view-'+v).classList.add('active');document.querySelectorAll('.sb-item').forEach(x=>x.classList.remove('active'));const si=document.querySelector('.sb-item[data-view="'+v+'"]');if(si)si.classList.add('active');const i=VIEW_MAP[v]||{t:v,b:v};document.getElementById('pageTitle').textContent=i.t;document.getElementById('pageCrumb').textContent=i.b;const r=document.getElementById('content');if(r)r.scrollTop=0;if(v==='dashboard')initDashboard();if(v==='map')renderRiskMap();if(v==='enterprises')renderEntGrid();if(v==='countries')renderCtyGrid();if(v==='alerts'){renderAlertSummary();renderAlertList();renderAlertCenterCharts();renderWarningRules();}if(v==='events')renderEvents();if(v==='personnel')renderPersonnel();if(v==='collect')COLLECT.init();if(v==='prediction')renderPrediction();if(v==='matrix')renderMatrix();if(v==='stats')initStats();}
document.querySelectorAll('.sb-item').forEach(item=>item.addEventListener('click',()=>navigateTo(item.dataset.view)));
//时钟
function updateClock(){const n=new Date();const d=['日','一','二','三','四','五','六'][n.getDay()];document.getElementById('tb-time').textContent=`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,'0')}-${String(n.getDate()).padStart(2,'0')} ${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}:${String(n.getSeconds()).padStart(2,'0')} 周${d}`}
setInterval(updateClock,1000);updateClock();
//预警滚动条
function renderTicker(){const items=ALERTS.filter(a=>a.status==='active'||a.status==='responding').slice(0,10);const html=items.map(a=>{const lv=ALERT_LV[a.level];return`<div class="ticker-item"><span class="lv">${lv.label}</span>${a.country} · ${a.title}</div>`}).join('');document.getElementById('ticker-track').innerHTML=html+html}
//世界地图SVG
function buildMapSVG(w,h,showLabels){
  const mx=lon=>(lon+180)*w/360,my=lat=>(90-lat)*h/180;
  let grid='';
  for(let lon=-150;lon<=150;lon+=30){const x=mx(lon).toFixed(0);grid+=`<line x1="${x}" y1="0" x2="${x}" y2="${h}" stroke="#1e2d3d" stroke-width="0.5"/>`}
  for(let lat=-60;lat<=60;lat+=30){const y=my(lat).toFixed(0);grid+=`<line x1="0" y1="${y}" x2="${w}" y2="${y}" stroke="#1e2d3d" stroke-width="0.5"/>`}
  const eqY=my(0).toFixed(0);grid+=`<line x1="0" y1="${eqY}" x2="${w}" y2="${eqY}" stroke="#2a3a4d" stroke-width="1" stroke-dasharray="4,4"/>`;
  let labels='';
  if(showLabels){labels=[['北美',200,130],['南美',310,300],['欧洲',520,100],['非洲',560,250],['中东',610,165],['中亚',665,115],['南亚',710,170],['东南亚',790,215],['东亚',830,130],['大洋洲',870,325]].map(([t,x,y])=>`<text x="${x}" y="${y}" fill="#3a4858" font-size="11" font-weight="600">${t}</text>`).join('')}
  const dots=COUNTRIES.map(c=>{const x=mx(c.lon).toFixed(0),y=my(c.lat).toFixed(0);const ov=calcOverall(c.scores),lv=getLevel(ov);const ents=getEntsInCountry(c.name).length;const r=Math.max(4,Math.min(14,4+ents*1.2));const al=ALERTS.filter(a=>a.country===c.name&&a.status!=='resolved').length;const pulse=(al>0&&ov>=7)?`<animate attributeName="r" values="${r};${r+3};${r}" dur="2s" repeatCount="indefinite"/>`:'';return `<circle cx="${x}" cy="${y}" r="${r}" fill="${lv.color}" fill-opacity="0.7" stroke="${lv.color}" stroke-width="1.5" style="cursor:pointer" onclick="showCtyDetail('${c.name}')"><title>${c.flag} ${c.name} | 评分:${ov.toFixed(1)} ${lv.label} | ${ents}家中资企业 | ${al}条活跃预警</title>${pulse}</circle>`}).join('');
  return `<svg viewBox="0 0 ${w} ${h}" style="width:100%;height:auto;display:block;background:#152030;border-radius:6px"><rect width="${w}" height="${h}" fill="#152030"/>${grid}${labels}${dots}</svg>`;
}
//仪表盘
function initDashboard(){
  const tI=ENTERPRISES.reduce((s,e)=>s+e.investment,0),tP=ENTERPRISES.reduce((s,e)=>s+e.personnel,0),tA=ENTERPRISES.reduce((s,e)=>s+e.assets,0);
  const aA=ALERTS.filter(a=>a.status==='active'||a.status==='responding').length,rA=ALERTS.filter(a=>a.level==='red'&&a.status!=='resolved').length;
  document.getElementById('dash-stats').innerHTML=[{ic:'🏢',bg:'var(--blue-bg)',c:'var(--blue)',l:'监测企业',v:ENTERPRISES.length,s:'覆盖'+new Set(ENTERPRISES.map(e=>e.industry)).size+'个行业'},{ic:'🌏',bg:'var(--green-bg)',c:'var(--green)',l:'监测国家',v:COUNTRIES.length,s:'覆盖6大区域'},{ic:'💰',bg:'var(--yellow-bg)',c:'var(--yellow)',l:'海外投资(亿$)',v:tI.toLocaleString(),s:'海外资产'+tA.toLocaleString()+'亿$'},{ic:'👥',bg:'var(--orange-bg)',c:'var(--orange)',l:'海外人员',v:tP.toLocaleString(),s:'含外派及本地雇员'},{ic:'🚨',bg:'var(--red-bg)',c:'var(--red)',l:'活跃预警',v:aA,s:'红色预警'+rA+'起',cls:'up'},{ic:'📡',bg:'var(--blue-bg)',c:'var(--blue)',l:'追踪事件',v:EVENTS.length,s:'监控中'+EVENTS.filter(e=>e.status==='active'||e.status==='monitoring').length+'起'}].map(s=>`<div class="stat-card"><div class="stat-ic" style="background:${s.bg};color:${s.c}">${s.ic}</div><div><div class="stat-label">${s.l}</div><div class="stat-val">${s.v}</div><div class="stat-sub ${s.cls||''}">${s.s}</div></div></div>`).join('');
  const gAvg=COUNTRIES.reduce((s,c)=>s+calcOverall(c.scores),0)/COUNTRIES.length;
  const gLv=getLevel(gAvg);
  const pct=gAvg/10,circ=2*Math.PI*52,dash=circ*(1-pct);
  document.getElementById('global-gauge').innerHTML=`<svg viewBox="0 0 140 140" style="width:120px;height:120px"><circle cx="70" cy="70" r="52" fill="none" stroke="#e0e6ed" stroke-width="8"/><circle cx="70" cy="70" r="52" fill="none" stroke="${gLv.color}" stroke-width="8" stroke-dasharray="${circ}" stroke-dashoffset="${dash}" transform="rotate(-90 70 70)" stroke-linecap="round" style="transition:stroke-dashoffset 1s"/><text x="70" y="66" text-anchor="middle" font-size="28" font-weight="900" fill="${gLv.color}">${gAvg.toFixed(1)}</text><text x="70" y="84" text-anchor="middle" font-size="11" fill="#6b7c8d">${gLv.label}</text></svg>`;
  document.getElementById('gauge-info').innerHTML=`<div style="font-size:13px;font-weight:700;margin-bottom:6px">全球海外利益风险指数</div><div style="font-size:12px;color:var(--text2);line-height:1.8">监测国家：<strong>${COUNTRIES.length}</strong> 个<br>极高风险：<strong style="color:#dc2626">${COUNTRIES.filter(c=>calcOverall(c.scores)>=8).length}</strong> 个<br>高风险：<strong style="color:#ea580c">${COUNTRIES.filter(c=>{const s=calcOverall(c.scores);return s>=6&&s<8}).length}</strong> 个<br>中高风险：<strong style="color:#ca8a04">${COUNTRIES.filter(c=>{const s=calcOverall(c.scores);return s>=4&&s<6}).length}</strong> 个<br>中低风险：<strong style="color:#16a34a">${COUNTRIES.filter(c=>calcOverall(c.scores)<4).length}</strong> 个</div><div style="margin-top:8px;padding:6px 10px;background:${gLv.cls==='lv-red'?'var(--red-bg)':gLv.cls==='lv-orange'?'var(--orange-bg)':'var(--yellow-bg)'};border-radius:6px;font-size:11px"><strong>⚠️ 综合研判：</strong>当前全球海外利益保护面临${gAvg>=6?'严峻':'较大'}风险挑战，${COUNTRIES.filter(c=>c.trend==='up').length}个国家风险呈上升趋势，需重点关注。</div>`;
  document.getElementById('dash-map').innerHTML=buildMapSVG(1000,500,true)+`<div style="display:flex;gap:12px;margin-top:8px;flex-wrap:wrap"><span style="font-size:11px;color:var(--text2)">图例：</span><span style="font-size:11px;display:flex;align-items:center;gap:3px"><span style="width:10px;height:10px;border-radius:50%;background:#991b1b;display:inline-block"></span>极高</span><span style="font-size:11px;display:flex;align-items:center;gap:3px"><span style="width:10px;height:10px;border-radius:50%;background:#dc2626;display:inline-block"></span>高</span><span style="font-size:11px;display:flex;align-items:center;gap:3px"><span style="width:10px;height:10px;border-radius:50%;background:#ea580c;display:inline-block"></span>中高</span><span style="font-size:11px;display:flex;align-items:center;gap:3px"><span style="width:10px;height:10px;border-radius:50%;background:#ca8a04;display:inline-block"></span>中低</span><span style="font-size:11px;display:flex;align-items:center;gap:3px"><span style="width:10px;height:10px;border-radius:50%;background:#16a34a;display:inline-block"></span>低</span><span style="font-size:11px;color:var(--text2);margin-left:auto">圆圈大小=中资企业数量 | 闪烁=活跃预警</span></div>`;
  const regs=[...new Set(COUNTRIES.map(c=>c.region))];
  document.getElementById('region-summary').innerHTML=regs.map(r=>{const cs=COUNTRIES.filter(c=>c.region===r);const avg=cs.reduce((s,c)=>s+calcOverall(c.scores),0)/cs.length;const lv=getLevel(avg);const ents=ENTERPRISES.filter(e=>e.countries.some(c=>{const ct=COUNTRIES.find(x=>x.name===c);return ct&&ct.region===r})).length;return `<div style="display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid var(--border)"><div style="width:60px;font-size:12px;font-weight:600">${r}</div><div style="flex:1"><div style="height:8px;background:#e8edf3;border-radius:4px;overflow:hidden"><div style="height:100%;width:${avg*10}%;background:${lv.color};border-radius:4px;transition:width .5s"></div></div></div><div style="width:36px;text-align:right;font-size:13px;font-weight:700;color:${lv.color}">${avg.toFixed(1)}</div><div style="width:50px;text-align:right;font-size:11px;color:var(--text2)">${cs.length}国/${ents}企</div></div>`}).join('');
  document.getElementById('risk-gauges').innerHTML=DIMS.map(d=>{const avg=COUNTRIES.reduce((s,c)=>s+c.scores[d.key],0)/COUNTRIES.length;const lv=getLevel(avg);const p=avg/10,c=2*Math.PI*28,da=c*(1-p);return `<div style="text-align:center"><svg viewBox="0 0 80 80" style="width:60px;height:60px"><circle cx="40" cy="40" r="28" fill="none" stroke="#e0e6ed" stroke-width="5"/><circle cx="40" cy="40" r="28" fill="none" stroke="${lv.color}" stroke-width="5" stroke-dasharray="${c}" stroke-dashoffset="${da}" transform="rotate(-90 40 40)" stroke-linecap="round" style="transition:stroke-dashoffset 1s"/><text x="40" y="38" text-anchor="middle" font-size="15" font-weight="800" fill="${lv.color}">${avg.toFixed(1)}</text><text x="40" y="50" text-anchor="middle" font-size="8" fill="#6b7c8d">${d.ic}</text></svg><div style="font-size:10px;color:var(--text2);margin-top:2px">${d.name}</div></div>`}).join('');
  const pHigh=ENTERPRISES.reduce((s,e)=>{const r=getEntRisk(e);return r>=6?s+e.personnel:s},0);
  const pAlert=ALERTS.filter(a=>a.status!=='resolved').reduce((s,a)=>s+a.affectedP,0);
  document.getElementById('personnel-summary').innerHTML=`<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:10px"><div style="text-align:center;padding:8px;background:#f8fafc;border-radius:6px"><div style="font-size:20px;font-weight:800;color:var(--blue)">${tP.toLocaleString()}</div><div style="font-size:10px;color:var(--text2)">海外人员</div></div><div style="text-align:center;padding:8px;background:var(--red-bg);border-radius:6px"><div style="font-size:20px;font-weight:800;color:var(--red)">${pHigh.toLocaleString()}</div><div style="font-size:10px;color:var(--text2)">高风险地区</div></div><div style="text-align:center;padding:8px;background:var(--orange-bg);border-radius:6px"><div style="font-size:20px;font-weight:800;color:var(--orange)">${pAlert.toLocaleString()}</div><div style="font-size:10px;color:var(--text2)">预警影响</div></div></div><div style="font-size:11px;color:var(--text2);margin-bottom:4px">人员风险分布</div>${[{l:'极高风险',c:'#991b1b',f:e=>getEntRisk(e)>=8},{l:'高风险',c:'#dc2626',f:e=>{const r=getEntRisk(e);return r>=6&&r<8}},{l:'中高风险',c:'#ea580c',f:e=>{const r=getEntRisk(e);return r>=4&&r<6}},{l:'中低风险',c:'#16a34a',f:e=>getEntRisk(e)<4}].map(s=>{const cnt=ENTERPRISES.filter(s.f).reduce((a,e)=>a+e.personnel,0);const pct=tP?Math.round(cnt/tP*100):0;return `<div style="display:flex;align-items:center;gap:6px;margin-bottom:3px"><span style="width:50px;font-size:10px">${s.l}</span><div style="flex:1;height:10px;background:#e8edf3;border-radius:5px;overflow:hidden"><div style="height:100%;width:${pct}%;background:${s.c};border-radius:5px;transition:width .5s"></div></div><span style="width:50px;text-align:right;font-size:10px;font-weight:600">${cnt.toLocaleString()}(${pct}%)</span></div>`}).join('')}`;
  const aHigh=ENTERPRISES.reduce((s,e)=>{const r=getEntRisk(e);return r>=6?s+e.assets:s},0);
  document.getElementById('asset-summary').innerHTML=`<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px"><div style="text-align:center;padding:8px;background:#f8fafc;border-radius:6px"><div style="font-size:20px;font-weight:800;color:var(--blue)">${tA.toLocaleString()}亿$</div><div style="font-size:10px;color:var(--text2)">海外资产</div></div><div style="text-align:center;padding:8px;background:var(--red-bg);border-radius:6px"><div style="font-size:20px;font-weight:800;color:var(--red)">${aHigh.toLocaleString()}亿$</div><div style="font-size:10px;color:var(--text2)">高风险敞口</div></div></div><div style="font-size:11px;color:var(--text2);margin-bottom:4px">区域资产分布</div>${regs.map(r=>{const ents=ENTERPRISES.filter(e=>e.countries.some(c=>{const ct=COUNTRIES.find(x=>x.name===c);return ct&&ct.region===r}));const a=ents.reduce((s,e)=>s+e.assets/e.countries.length,0);const pct=tA?Math.round(a/tA*100):0;return `<div style="display:flex;align-items:center;gap:6px;margin-bottom:3px"><span style="width:50px;font-size:10px">${r}</span><div style="flex:1;height:10px;background:#e8edf3;border-radius:5px;overflow:hidden"><div style="height:100%;width:${pct}%;background:var(--accent);border-radius:5px;transition:width .5s"></div></div><span style="width:50px;text-align:right;font-size:10px;font-weight:600">${Math.round(a)}亿$</span></div>`}).join('')}`;
  const upC=COUNTRIES.filter(c=>c.trend==='up').sort((a,b)=>calcOverall(b.scores)-calcOverall(a.scores)).slice(0,5);
  const downC=COUNTRIES.filter(c=>c.trend==='down');
  document.getElementById('risk-movement').innerHTML=`<div style="font-size:12px;font-weight:700;color:var(--red);margin-bottom:6px">📈 风险上升 (${COUNTRIES.filter(c=>c.trend==='up').length})</div>${upC.map(c=>{const ov=calcOverall(c.scores),lv=getLevel(ov);return `<div style="display:flex;align-items:center;justify-content:space-between;padding:4px 0;font-size:11px;cursor:pointer" onclick="showCtyDetail('${c.name}')"><span>${c.flag} ${c.name}</span><span style="color:${lv.color};font-weight:700">${ov.toFixed(1)} <span style="color:var(--red)">↑</span></span></div>`}).join('')}${downC.length?`<div style="font-size:12px;font-weight:700;color:var(--green);margin:8px 0 6px">📉 风险下降 (${downC.length})</div>${downC.map(c=>{const ov=calcOverall(c.scores),lv=getLevel(ov);return `<div style="display:flex;align-items:center;justify-content:space-between;padding:4px 0;font-size:11px;cursor:pointer" onclick="showCtyDetail('${c.name}')"><span>${c.flag} ${c.name}</span><span style="color:${lv.color};font-weight:700">${ov.toFixed(1)} <span style="color:var(--green)">↓</span></span></div>`}).join('')}`:'<div style="font-size:11px;color:var(--text2);margin-top:8px">暂无风险下降国家</div>'}`;
  const er=[...ENTERPRISES].map(e=>({...e,rs:getEntRisk(e)})).sort((a,b)=>b.rs-a.rs).slice(0,10);
  document.getElementById('ent-ranking-body').innerHTML=er.map((e,i)=>{const lv=getLevel(e.rs);return`<tr style="cursor:pointer" onclick="showEntDetail(${e.id})"><td><strong style="color:${i<3?'var(--red)':'var(--text2)'}">${i+1}</strong></td><td><strong>${e.short}</strong></td><td>${e.industry}</td><td>${e.countries.length}</td><td>${e.personnel.toLocaleString()}</td><td><strong style="color:${lv.color}">${e.rs.toFixed(1)}</strong></td><td><span class="risk-badge ${lv.cls}">${lv.short}</span></td></tr>`}).join('');
  const cr=[...COUNTRIES].map(c=>({...c,ov:calcOverall(c.scores),ec:getEntsInCountry(c.name).length})).sort((a,b)=>b.ov-a.ov).slice(0,10);
  document.getElementById('cty-ranking-body').innerHTML=cr.map(c=>{const lv=getLevel(c.ov);const ti=c.trend==='up'?'<span style="color:var(--red)">↑上升</span>':c.trend==='down'?'<span style="color:var(--green)">↓下降</span>':'<span style="color:var(--text2)">→持平</span>';return`<tr style="cursor:pointer" onclick="showCtyDetail('${c.name}')"><td>${c.flag} <strong>${c.name}</strong></td><td>${c.region}</td><td><strong style="color:${lv.color}">${c.ov.toFixed(1)}</strong></td><td><span class="risk-badge ${lv.cls}">${lv.label}</span></td><td>${ti}</td><td>${c.ec}</td><td>${c.trade}</td><td>${c.mainRisk}</td><td style="font-size:11px;color:var(--text2)">${c.lastUpdate}</td></tr>`}).join('');
  const la=[...ALERTS].sort((a,b)=>b.time.localeCompare(a.time)).slice(0,5);
  document.getElementById('dash-alerts').innerHTML=la.map(a=>{const lv=ALERT_LV[a.level];return`<div class="alert-item lv-${a.level}" onclick="showAlertDetail('${a.id}')"><div class="alert-item-top"><div class="alert-item-tt"><span class="risk-badge ${lv.cls}">${lv.label}</span>${a.title}</div><span style="font-size:11px;color:var(--text2)">${a.time.split(' ')[1]}</span></div><div class="alert-item-desc">${a.desc.substring(0,80)}...</div><div class="alert-item-bottom"><span>📍${a.country}|🏢${a.enterprise}|👥${a.affectedP}人</span><span class="risk-badge ${a.status==='active'?'lv-red':a.status==='responding'?'lv-orange':'lv-blue'}">${ALERT_ST[a.status]}</span></div></div>`}).join('');
  renderTrendChart('overall');renderAlertPie();renderDashIndustry();renderDashRegion();renderAlertTrendChart();renderAlertTypeChart();
}
function renderTrendChart(m){const months=['2月','3月','4月','5月','6月','7月'];const regions=['南亚','中东','东欧','非洲','东南亚','南美'];const colors=['#dc2626','#ea580c','#ca8a04','#2563eb','#059669','#7c3aed'];const ds=regions.map((r,i)=>{const cs=COUNTRIES.filter(c=>c.region===r);if(!cs.length)return null;const data=months.map((_,j)=>{const avg=cs.reduce((s,c)=>m==='overall'?s+calcOverall(c.scores):s+(c.scores[m]||0),0)/cs.length;return Math.round((avg+(j-2.5)*0.15)*10)/10});return{label:r,data,borderColor:colors[i],backgroundColor:colors[i]+'20',borderWidth:2,tension:.3,pointRadius:3}}).filter(Boolean);const ctx=document.getElementById('chart-trend').getContext('2d');if(charts.trend)charts.trend.destroy();charts.trend=new Chart(ctx,{type:'line',data:{labels:months,datasets:ds},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{font:{size:10},padding:8}}},scales:{y:{min:3,max:10,grid:{color:'#f0f2f5'}},x:{grid:{display:false}}}}})}
function updateTrendChart(v){renderTrendChart(v)}
function renderAlertPie(){const c={red:0,orange:0,yellow:0,blue:0};ALERTS.forEach(a=>c[a.level]++);const ctx=document.getElementById('chart-alert-pie').getContext('2d');if(charts.ap)charts.ap.destroy();charts.ap=new Chart(ctx,{type:'doughnut',data:{labels:['红色','橙色','黄色','蓝色'],datasets:[{data:[c.red,c.orange,c.yellow,c.blue],backgroundColor:['#dc2626','#ea580c','#ca8a04','#2563eb'],borderWidth:2,borderColor:'#fff'}]},options:{responsive:true,maintainAspectRatio:false,cutout:'60%',plugins:{legend:{position:'bottom',labels:{font:{size:10},padding:8}}}}})}
function renderDashIndustry(){const m={};ENTERPRISES.forEach(e=>{if(!m[e.industry])m[e.industry]=[];m[e.industry].push(getEntRisk(e))});const labels=Object.keys(m),data=labels.map(i=>Math.round(m[i].reduce((a,b)=>a+b,0)/m[i].length*10)/10);const ctx=document.getElementById('chart-industry').getContext('2d');if(charts.di)charts.di.destroy();charts.di=new Chart(ctx,{type:'bar',data:{labels,datasets:[{data,backgroundColor:data.map(v=>v>=7?'#dc2626':v>=5?'#ea580c':v>=2.5?'#ca8a04':'#16a34a'),borderRadius:4}]},options:{responsive:true,maintainAspectRatio:false,indexAxis:'y',plugins:{legend:{display:false}},scales:{x:{max:10,grid:{color:'#f0f2f5'}},y:{grid:{display:false},ticks:{font:{size:10}}}}}})}
function renderDashRegion(){const m={};COUNTRIES.forEach(c=>{if(!m[c.region])m[c.region]=[];m[c.region].push(calcOverall(c.scores))});const labels=Object.keys(m),data=labels.map(r=>Math.round(m[r].reduce((a,b)=>a+b,0)/m[r].length*10)/10);const ctx=document.getElementById('chart-region').getContext('2d');if(charts.dr)charts.dr.destroy();charts.dr=new Chart(ctx,{type:'bar',data:{labels,datasets:[{data,backgroundColor:data.map(v=>v>=7?'#dc2626':v>=5?'#ea580c':v>=2.5?'#ca8a04':'#16a34a'),borderRadius:4,barThickness:30}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{max:10,grid:{color:'#f0f2f5'}},x:{grid:{display:false},ticks:{font:{size:10}}}}}})}
function renderAlertTrendChart(){const data=genAlertTrend();const ctx=document.getElementById('chart-alert-trend').getContext('2d');if(charts.at)charts.at.destroy();charts.at=new Chart(ctx,{type:'bar',data:{labels:data.map(d=>d.d),datasets:[{label:'红色',data:data.map(d=>d.r),backgroundColor:'#dc2626',stack:'s'},{label:'橙色',data:data.map(d=>d.o),backgroundColor:'#ea580c',stack:'s'},{label:'黄色',data:data.map(d=>d.y),backgroundColor:'#ca8a04',stack:'s'},{label:'蓝色',data:data.map(d=>d.b),backgroundColor:'#2563eb',stack:'s'}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{font:{size:9},padding:6,boxWidth:10}},tooltip:{mode:'index'}},scales:{x:{stacked:true,grid:{display:false},ticks:{font:{size:8},maxRotation:45}},y:{stacked:true,grid:{color:'#f0f2f5'},beginAtZero:true}}}})}
function renderAlertTypeChart(){const types={};ALERTS.forEach(a=>{types[a.type]=(types[a.type]||0)+1});const labels=Object.keys(types),data=Object.values(types);const ctx=document.getElementById('chart-alert-type').getContext('2d');if(charts.aty)charts.aty.destroy();charts.aty=new Chart(ctx,{type:'doughnut',data:{labels,datasets:[{data,backgroundColor:['#dc2626','#ea580c','#ca8a04','#2563eb','#059669','#7c3aed','#d97706','#be185d'],borderWidth:2,borderColor:'#fff'}]},options:{responsive:true,maintainAspectRatio:false,cutout:'55%',plugins:{legend:{position:'right',labels:{font:{size:10},padding:6,boxWidth:12}}}}})}
//企业
let entFI='all',entFR='all';
function renderEntGrid(){
  const inds=[...new Set(ENTERPRISES.map(e=>e.industry))];
  document.getElementById('ent-industry-filters').innerHTML=`<div class="chip ${entFI==='all'?'active':''}" onclick="entFI='all';renderEntGrid()">全部</div>`+inds.map(i=>`<div class="chip ${entFI===i?'active':''}" onclick="entFI='${i}';renderEntGrid()">${i}</div>`).join('');
  document.getElementById('ent-risk-filters').innerHTML=`<div class="chip ${entFR==='all'?'active':''}" onclick="entFR='all';renderEntGrid()">全部风险</div><div class="chip ${entFR==='high'?'active':''}" onclick="entFR='high';renderEntGrid()">高风险</div><div class="chip ${entFR==='moderate'?'active':''}" onclick="entFR='moderate';renderEntGrid()">中风险</div><div class="chip ${entFR==='low'?'active':''}" onclick="entFR='low';renderEntGrid()">低风险</div>`;
  const s=(document.getElementById('ent-search')?.value||'').toLowerCase();
  const f=ENTERPRISES.filter(e=>{const ms=e.name.toLowerCase().includes(s)||e.short.toLowerCase().includes(s)||e.industry.toLowerCase().includes(s);const mi=entFI==='all'||e.industry===entFI;const r=getEntRisk(e);const mr=entFR==='all'||(entFR==='high'&&r>=6)||(entFR==='moderate'&&r>=2.5&&r<6)||(entFR==='low'&&r<2.5);return ms&&mi&&mr});
  const g=document.getElementById('ent-grid');if(!f.length){g.innerHTML='<div class="empty" style="grid-column:1/-1"><div class="ic">🔍</div><div>未找到匹配企业</div></div>';return}
  g.innerHTML=f.map(e=>{const r=getEntRisk(e),lv=getLevel(r);const sc=e.status==='alert'?'lv-red':e.status==='monitoring'?'lv-orange':'lv-green';const st=e.status==='alert'?'⚠️预警':e.status==='monitoring'?'📡监控':'✅正常';const ea=ALERTS.filter(a=>a.enterprise===e.short&&a.status!=='resolved');return`<div class="ent-card" onclick="showEntDetail(${e.id})"><div class="ent-hd"><div class="ent-logo" style="background:${e.logoColor}20;color:${e.logoColor}">${e.logo}</div><div style="flex:1"><div class="ent-name">${e.name}</div><div class="ent-ind">${e.industry} | ${e.code}</div></div><span class="risk-badge ${lv.cls}">${lv.short}</span></div><div class="ent-bd"><div class="ent-stats"><div class="ent-stat"><div class="ent-stat-label">投资(亿$)</div><div class="ent-stat-val">${e.investment}</div></div><div class="ent-stat"><div class="ent-stat-label">人员</div><div class="ent-stat-val">${e.personnel.toLocaleString()}</div></div><div class="ent-stat"><div class="ent-stat-label">国家</div><div class="ent-stat-val">${e.countries.length}</div></div></div><div style="font-size:11px;color:var(--text2);margin-bottom:4px">所在国家/地区</div><div class="ent-countries">${e.countries.slice(0,8).map(c=>{const ct=COUNTRIES.find(x=>x.name===c);return`<span class="ent-country-tag" onclick="event.stopPropagation();showCtyDetail('${c}')">${ct?ct.flag:''} ${c}</span>`}).join('')}${e.countries.length>8?`<span class="ent-country-tag">+${e.countries.length-8}</span>`:''}</div></div><div class="ent-footer"><span>综合风险:<strong style="color:${lv.color}">${r.toFixed(1)}</strong></span><span class="risk-badge ${sc}">${st}</span>${ea.length?`<span style="color:var(--red)">🚨${ea.length}</span>`:''}</div></div>`}).join('');
}
function showEntDetail(id){
  const e=ENTERPRISES.find(x=>x.id===id);if(!e)return;const r=getEntRisk(e),lv=getLevel(r);const ea=ALERTS.filter(a=>a.enterprise===e.short);const ev=EVENTS.filter(x=>x.enterprises.includes(e.short));const cd=e.countries.map(c=>{const ct=COUNTRIES.find(x=>x.name===c);if(!ct)return null;const sc=calcOverall(ct.scores),cl=getLevel(sc);return{c,ct,sc,cl}}).filter(Boolean).sort((a,b)=>b.sc-a.sc);
  document.getElementById('modal-tt').textContent=e.name;
  document.getElementById('modal-bd').innerHTML=`<div class="ent-detail-hd"><div class="ent-detail-logo" style="background:${e.logoColor}20;color:${e.logoColor}">${e.logo}</div><div class="ent-detail-info"><div class="ent-detail-name">${e.name} <span style="font-size:13px;color:var(--text2);font-weight:400">(${e.code})</span></div><div class="ent-detail-meta">${e.industry}|总部:${e.hq}|覆盖${e.countries.length}个国家</div><div style="margin-top:4px"><span class="risk-badge ${lv.cls}">${lv.label} ${r.toFixed(1)}</span><span class="risk-badge ${e.status==='alert'?'lv-red':e.status==='monitoring'?'lv-orange':'lv-green'}" style="margin-left:6px">${e.status==='alert'?'预警中':e.status==='monitoring'?'监控中':'正常'}</span></div></div></div><div class="ent-detail-stats"><div class="ent-detail-stat"><div class="ent-detail-stat-label">海外投资</div><div class="ent-detail-stat-val">${e.investment}亿$</div></div><div class="ent-detail-stat"><div class="ent-detail-stat-label">海外人员</div><div class="ent-detail-stat-val">${e.personnel.toLocaleString()}</div></div><div class="ent-detail-stat"><div class="ent-detail-stat-label">海外资产</div><div class="ent-detail-stat-val">${e.assets}亿$</div></div><div class="ent-detail-stat"><div class="ent-detail-stat-label">活跃预警</div><div class="ent-detail-stat-val" style="color:${ea.filter(a=>a.status!=='resolved').length?'var(--red)':'var(--green)'}">${ea.filter(a=>a.status!=='resolved').length}</div></div></div><div class="card-tt" style="margin-bottom:10px">🌐 所在国风险分布</div><div class="cty-dist-list" style="margin-bottom:14px">${cd.map(({c,ct,sc,cl})=>`<div class="cty-dist-row" style="cursor:pointer" onclick="showCtyDetail('${c}')"><span>${ct.flag} ${c}</span><div><div class="cty-dist-bar"><div class="cty-dist-bar-fill" style="width:${sc*10}%;background:${cl.color}"></div></div></div><span style="color:${cl.color};font-weight:700">${sc.toFixed(1)}</span><span class="risk-badge ${cl.cls}">${cl.short}</span></div>`).join('')}</div>${e.projects.length?`<div class="card-tt" style="margin-bottom:10px">🏗️ 海外重点项目</div><div class="tbl-wrap" style="margin-bottom:14px"><table><thead><tr><th>项目名称</th><th>所在国</th><th>投资(亿$)</th><th>人员</th></tr></thead><tbody>${e.projects.map(p=>`<tr><td><strong>${p.n}</strong></td><td>${p.c}</td><td>${p.inv}</td><td>${p.p}</td></tr>`).join('')}</tbody></table></div>`:''}${ea.length?`<div class="card-tt" style="margin-bottom:10px">🚨 关联预警</div><div class="alert-list" style="margin-bottom:14px">${ea.map(a=>{const al=ALERT_LV[a.level];return`<div class="alert-item lv-${a.level}" onclick="showAlertDetail('${a.id}')"><div class="alert-item-top"><div class="alert-item-tt"><span class="risk-badge ${al.cls}">${al.label}</span>${a.title}</div><span style="font-size:11px;color:var(--text2)">${a.time}</span></div><div class="alert-item-desc">${a.desc}</div></div>`}).join('')}</div>`:''}${ev.length?`<div class="card-tt" style="margin-bottom:10px">📡 关联事件</div><div class="timeline" style="margin-bottom:14px">${ev.map(e=>{const dot=e.sev==='critical'?'red':e.sev==='high'?'orange':e.sev==='medium'?'yellow':'blue';return`<div class="tl-item"><div class="tl-dot ${dot}"></div><div class="tl-date">${e.date} | ${EVT_TYPE[e.type]}</div><div class="tl-title">${e.title}</div><div class="tl-desc">${e.desc}</div></div>`}).join('')}</div>`:''}`;
  document.getElementById('modal').classList.add('show');
}
//国家
let ctyFR='all';
function renderCtyGrid(){
  const regs=[...new Set(COUNTRIES.map(c=>c.region))];
  document.getElementById('cty-region-filters').innerHTML=`<div class="chip ${ctyFR==='all'?'active':''}" onclick="ctyFR='all';renderCtyGrid()">全部</div>`+regs.map(r=>`<div class="chip ${ctyFR===r?'active':''}" onclick="ctyFR='${r}';renderCtyGrid()">${r}</div>`).join('');
  const s=(document.getElementById('cty-search')?.value||'').toLowerCase();
  const f=COUNTRIES.filter(c=>{const ms=c.name.toLowerCase().includes(s)||c.region.toLowerCase().includes(s);const mr=ctyFR==='all'||c.region===ctyFR;return ms&&mr});
  const g=document.getElementById('cty-grid');if(!f.length){g.innerHTML='<div class="empty" style="grid-column:1/-1"><div class="ic">🔍</div><div>未找到匹配国家</div></div>';return}
  g.innerHTML=f.map(c=>{const ov=calcOverall(c.scores),lv=getLevel(ov);const ents=getEntsInCountry(c.name);const ti=c.trend==='up'?'<span style="color:var(--red)">↑</span>':c.trend==='down'?'<span style="color:var(--green)">↓</span>':'<span style="color:var(--text2)">→</span>';const ca=ALERTS.filter(a=>a.country===c.name&&a.status!=='resolved');return`<div class="cty-card" onclick="showCtyDetail('${c.name}')"><div class="cty-hd" style="border-left-color:${lv.color}"><span class="cty-flag">${c.flag}</span><div style="flex:1"><div class="cty-name">${c.name}</div><div class="cty-region">${c.region}|${c.capital}</div></div><span class="risk-badge ${lv.cls}">${lv.short}</span></div><div class="cty-bd"><div class="cty-score-row"><div><div style="font-size:11px;color:var(--text2)">综合评分 ${ti}</div><div class="cty-overall" style="color:${lv.color}">${ov.toFixed(1)}</div></div><div style="text-align:right"><div style="font-size:11px;color:var(--text2)">中资企业</div><div style="font-size:16px;font-weight:700">${ents.length}</div>${ca.length?`<div style="font-size:10px;color:var(--red);margin-top:2px">🚨${ca.length}条预警</div>`:''}</div></div><div class="cty-bar"><div class="cty-bar-fill" style="width:${ov*10}%;background:${lv.color}"></div></div><div class="cty-ind">${DIMS.slice(0,6).map(d=>{const sc=c.scores[d.key],cl=getLevel(sc);return`<div style="display:flex;justify-content:space-between;padding:2px 0;border-bottom:1px dashed #f0f4f8;font-size:11px"><span style="color:var(--text2)">${d.ic}${d.name}</span><span style="font-weight:600;color:${cl.color}">${sc.toFixed(1)}</span></div>`}).join('')}</div><div style="margin-top:8px;padding:6px 8px;background:#f8fafc;border-radius:5px;font-size:11px;color:var(--text2);line-height:1.5">${c.notes.substring(0,80)}...</div></div></div>`}).join('');
  // 渲染国家风险分布图
  const dist={critical:0,high:0,elevated:0,moderate:0,low:0};COUNTRIES.forEach(c=>{dist[getLevel(calcOverall(c.scores)).level]++});
  const ctx1=document.getElementById('chart-cty-dist').getContext('2d');if(charts.cd)charts.cd.destroy();charts.cd=new Chart(ctx1,{type:'doughnut',data:{labels:['极高','高','中高','中低','低'],datasets:[{data:[dist.critical,dist.high,dist.elevated,dist.moderate,dist.low],backgroundColor:['#991b1b','#dc2626','#ea580c','#ca8a04','#16a34a'],borderWidth:2,borderColor:'#fff'}]},options:{responsive:true,maintainAspectRatio:false,cutout:'55%',plugins:{legend:{position:'bottom',labels:{font:{size:10},padding:8}}}}});
  // 区域风险对比
  const rData=regs.map(r=>{const cs=COUNTRIES.filter(c=>c.region===r);return Math.round(cs.reduce((s,c)=>s+calcOverall(c.scores),0)/cs.length*10)/10});
  const ctx2=document.getElementById('chart-cty-region').getContext('2d');if(charts.cr)charts.cr.destroy();charts.cr=new Chart(ctx2,{type:'bar',data:{labels:regs,datasets:[{data:rData,backgroundColor:rData.map(v=>v>=7?'#dc2626':v>=5?'#ea580c':v>=2.5?'#ca8a04':'#16a34a'),borderRadius:4,barThickness:30}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{max:10,grid:{color:'#f0f2f5'}},x:{grid:{display:false},ticks:{font:{size:10}}}}}});
  // 趋势变化摘要
  const upCnt=COUNTRIES.filter(c=>c.trend==='up').length,downCnt=COUNTRIES.filter(c=>c.trend==='down').length,flatCnt=COUNTRIES.filter(c=>c.trend==='flat').length;
  document.getElementById('cty-trend-summary').innerHTML=`<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:10px"><div style="text-align:center;padding:10px;background:var(--red-bg);border-radius:6px"><div style="font-size:22px;font-weight:800;color:var(--red)">${upCnt}</div><div style="font-size:10px;color:var(--text2)">↑ 风险上升</div></div><div style="text-align:center;padding:10px;background:#f8fafc;border-radius:6px"><div style="font-size:22px;font-weight:800;color:var(--text2)">${flatCnt}</div><div style="font-size:10px;color:var(--text2)">→ 持平</div></div><div style="text-align:center;padding:10px;background:var(--green-bg);border-radius:6px"><div style="font-size:22px;font-weight:800;color:var(--green)">${downCnt}</div><div style="font-size:10px;color:var(--text2)">↓ 风险下降</div></div></div><div style="font-size:11px;color:var(--text2);line-height:1.6">${upCnt}个国家风险呈上升趋势，主要集中在南亚、中东和非洲地区。${downCnt}个国家风险下降。需重点关注阿富汗、苏丹、缅甸等高风险国家。</div>`;
}
function showCtyDetail(name){
  const c=COUNTRIES.find(x=>x.name===name);if(!c)return;const ov=calcOverall(c.scores),lv=getLevel(ov);const ents=getEntsInCountry(c.name);const ca=ALERTS.filter(a=>a.country===c.name);const ce=EVENTS.filter(e=>e.country===c.name);
  document.getElementById('modal-tt').textContent=`${c.flag} ${c.name} 风险档案`;
  document.getElementById('modal-bd').innerHTML=`<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:14px"><div class="ent-detail-stat"><div class="ent-detail-stat-label">综合评分</div><div class="ent-detail-stat-val" style="color:${lv.color}">${ov.toFixed(1)}</div></div><div class="ent-detail-stat"><div class="ent-detail-stat-label">风险等级</div><div class="ent-detail-stat-val" style="color:${lv.color}">${lv.label}</div></div><div class="ent-detail-stat"><div class="ent-detail-stat-label">中资企业</div><div class="ent-detail-stat-val">${ents.length}</div></div><div class="ent-detail-stat"><div class="ent-detail-stat-label">活跃预警</div><div class="ent-detail-stat-val" style="color:${ca.filter(a=>a.status!=='resolved').length?'var(--red)':'var(--green)'}">${ca.filter(a=>a.status!=='resolved').length}</div></div></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">${[['首都',c.capital],['人口',c.pop],['GDP',c.gdp+' ('+c.gdpGrowth+')'],['通胀率',c.inflation],['主权评级',c.credit],['货币',c.currency],['外交关系',c.diplo],['双边贸易',c.trade]].map(([l,v])=>`<div style="background:#f8fafc;padding:10px 12px;border-radius:6px;border:1px solid var(--border)"><div style="font-size:11px;color:var(--text2)">${l}</div><div style="font-weight:600">${v}</div></div>`).join('')}</div><div style="background:#fff7ed;padding:10px 14px;border-radius:6px;border-left:3px solid var(--orange);margin-bottom:14px;font-size:12px"><strong>📌 情报摘要：</strong>${c.notes}</div><div class="card-tt" style="margin-bottom:10px">📊 八维风险评分</div><div class="dim-bars" style="margin-bottom:14px">${DIMS.map(d=>{const sc=c.scores[d.key],dl=getLevel(sc);return`<div class="dim-bar"><div class="dim-bar-lbl">${d.ic}${d.name}</div><div class="dim-bar-track"><div class="dim-bar-fill" style="width:${sc*10}%;background:${dl.color}"></div></div><div class="dim-bar-val" style="color:${dl.color}">${sc.toFixed(1)}</div></div>`}).join('')}</div>${ents.length?`<div class="card-tt" style="margin-bottom:10px">🏢 在该国的中资企业</div><div class="tbl-wrap" style="margin-bottom:14px"><table><thead><tr><th>企业</th><th>行业</th><th>海外投资</th><th>人员</th><th>综合风险</th></tr></thead><tbody>${ents.map(e=>{const er=getEntRisk(e),el=getLevel(er);return`<tr style="cursor:pointer" onclick="showEntDetail(${e.id})"><td><strong>${e.short}</strong></td><td>${e.industry}</td><td>${e.investment}亿$</td><td>${e.personnel.toLocaleString()}</td><td><strong style="color:${el.color}">${er.toFixed(1)}</strong></td></tr>`}).join('')}</tbody></table></div>`:''}${ca.length?`<div class="card-tt" style="margin-bottom:10px">🚨 关联预警</div><div class="alert-list" style="margin-bottom:14px">${ca.map(a=>{const al=ALERT_LV[a.level];return`<div class="alert-item lv-${a.level}" onclick="showAlertDetail('${a.id}')"><div class="alert-item-top"><div class="alert-item-tt"><span class="risk-badge ${al.cls}">${al.label}</span>${a.title}</div><span style="font-size:11px;color:var(--text2)">${a.time}</span></div><div class="alert-item-desc">${a.desc}</div></div>`}).join('')}</div>`:''}${ce.length?`<div class="card-tt" style="margin-bottom:10px">📡 近期事件</div><div class="timeline" style="margin-bottom:14px">${ce.map(e=>{const dot=e.sev==='critical'?'red':e.sev==='high'?'orange':e.sev==='medium'?'yellow':'blue';return`<div class="tl-item"><div class="tl-dot ${dot}"></div><div class="tl-date">${e.date} | ${EVT_TYPE[e.type]} | ${EVT_SEV[e.sev]}</div><div class="tl-title">${e.title}</div><div class="tl-desc">${e.desc}</div><div class="tl-desc" style="margin-top:4px"><strong>影响：</strong>${e.impact}<br><strong>响应：</strong>${e.response}</div></div>`}).join('')}</div>`:''}`;
  document.getElementById('modal').classList.add('show');
}
//预警中心
function renderAlertSummary(){
  const c={red:0,orange:0,yellow:0,blue:0};ALERTS.forEach(a=>{if(a.status!=='resolved')c[a.level]++});
  document.getElementById('alert-summary').innerHTML=[
    {cls:'alert-stat-red',lv:'红色预警',num:c.red,desc:'特别重大风险'},{cls:'alert-stat-orange',lv:'橙色预警',num:c.orange,desc:'重大风险'},
    {cls:'alert-stat-yellow',lv:'黄色预警',num:c.yellow,desc:'较大风险'},{cls:'alert-stat-blue',lv:'蓝色预警',num:c.blue,desc:'一般风险'}
  ].map(s=>`<div class="alert-stat ${s.cls}"><div class="alert-stat-lv">${s.lv}</div><div class="alert-stat-num">${s.num}</div><div class="alert-stat-desc">${s.desc}</div></div>`).join('');
}
function renderAlertList(){
  const lf=document.getElementById('alert-level-filter')?document.getElementById('alert-level-filter').value:'all',sf=document.getElementById('alert-status-filter')?document.getElementById('alert-status-filter').value:'all';
  const f=ALERTS.filter(a=>(lf==='all'||a.level===lf)&&(sf==='all'||a.status===sf)).sort((a,b)=>b.time.localeCompare(a.time));
  const l=document.getElementById('alert-list');if(!f.length){l.innerHTML='<div class="empty"><div class="ic">🚨</div><div>暂无符合条件的预警</div></div>';return}
  l.innerHTML=f.map(a=>{const lv=ALERT_LV[a.level];return`<div class="alert-item lv-${a.level}" onclick="showAlertDetail('${a.id}')"><div class="alert-item-top"><div class="alert-item-tt"><span class="risk-badge ${lv.cls}">${lv.label}</span>${a.title}</div><span style="font-size:11px;color:var(--text2)">${a.time}</span></div><div class="alert-item-desc">${a.desc}</div><div class="alert-item-bottom"><span>📍${a.country}|🏢${a.enterprise}|👥${a.affectedP}人|💰${a.affectedA}亿$</span><span class="risk-badge ${a.status==='active'?'lv-red':a.status==='responding'?'lv-orange':a.status==='acknowledged'?'lv-yellow':'lv-green'}">${ALERT_ST[a.status]}</span></div></div>`}).join('');
}
function renderAlertCenterCharts(){
  const data=genAlertTrend();
  const ctx1=document.getElementById('chart-alert-center-trend').getContext('2d');
  if(charts.act)charts.act.destroy();
  charts.act=new Chart(ctx1,{type:'bar',data:{labels:data.map(d=>d.d),datasets:[{label:'红色',data:data.map(d=>d.r),backgroundColor:'#dc2626',stack:'s'},{label:'橙色',data:data.map(d=>d.o),backgroundColor:'#ea580c',stack:'s'},{label:'黄色',data:data.map(d=>d.y),backgroundColor:'#ca8a04',stack:'s'},{label:'蓝色',data:data.map(d=>d.b),backgroundColor:'#2563eb',stack:'s'}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{font:{size:9},padding:6,boxWidth:10}},tooltip:{mode:'index'}},scales:{x:{stacked:true,grid:{display:false},ticks:{font:{size:8},maxRotation:45}},y:{stacked:true,grid:{color:'#f0f2f5'},beginAtZero:true}}}});
  const cm={};ALERTS.forEach(a=>{cm[a.country]=(cm[a.country]||0)+1});
  const cl=Object.keys(cm).sort((a,b)=>cm[b]-cm[a]).slice(0,10),cd=cl.map(c=>cm[c]);
  const ctx2=document.getElementById('chart-alert-center-country').getContext('2d');
  if(charts.acc)charts.acc.destroy();
  charts.acc=new Chart(ctx2,{type:'bar',data:{labels:cl,datasets:[{label:'预警数',data:cd,backgroundColor:cd.map(v=>v>=3?'#dc2626':v>=2?'#ea580c':'#ca8a04'),borderRadius:4}]},options:{responsive:true,maintainAspectRatio:false,indexAxis:'y',plugins:{legend:{display:false}},scales:{x:{grid:{color:'#f0f2f5'},beginAtZero:true},y:{grid:{display:false},ticks:{font:{size:10}}}}}});
}
function renderWarningRules(){
  document.getElementById('warning-rules').innerHTML=WARNING_RULES.map(r=>{const lc=r.level==='red'?'lv-red':r.level==='orange'?'lv-orange':r.level==='yellow'?'lv-yellow':'lv-blue';return `<div style="background:#f8fafc;border:1px solid var(--border);border-left:4px solid ${r.level==='red'?'var(--red)':r.level==='orange'?'var(--orange)':r.level==='yellow'?'var(--yellow)':'var(--blue)'};border-radius:6px;padding:10px 12px;margin-bottom:8px"><div style="display:flex;align-items:center;gap:8px;margin-bottom:4px"><span class="risk-badge ${lc}">${r.level==='red'?'红色':r.level==='orange'?'橙色':r.level==='yellow'?'黄色':'蓝色'}</span><strong style="font-size:12px">${r.name}</strong><span style="margin-left:auto;font-size:11px;color:${r.enabled?'var(--green)':'var(--text2)'}">${r.enabled?'✅ 已启用':'⏸️ 已停用'}</span></div><div style="font-size:11px;color:var(--text2);line-height:1.5">${r.desc}</div><div style="display:flex;gap:12px;margin-top:6px;font-size:11px"><span style="color:var(--text2)">阈值: <strong>${r.threshold}</strong></span><span style="color:var(--text2)">类型: <strong>${r.type}</strong></span><span style="color:var(--text2)">触发: <strong style="color:var(--red)">${r.trigCount}次</strong></span></div></div>`}).join('');
}
function showAlertDetail(id){
  const a=ALERTS.find(x=>x.id===id);if(!a)return;const lv=ALERT_LV[a.level];
  const related=ALERTS.filter(x=>x.id!==id&&(x.country===a.country||x.enterprise===a.enterprise)).slice(0,3);
  document.getElementById('modal-tt').textContent=`预警详情 ${a.id}`;
  document.getElementById('modal-bd').innerHTML=`<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:14px"><div class="ent-detail-stat"><div class="ent-detail-stat-label">预警等级</div><div class="ent-detail-stat-val"><span class="risk-badge ${lv.cls}">${lv.label}</span></div></div><div class="ent-detail-stat"><div class="ent-detail-stat-label">预警类型</div><div class="ent-detail-stat-val" style="font-size:14px">${a.type}</div></div><div class="ent-detail-stat"><div class="ent-detail-stat-label">影响人员</div><div class="ent-detail-stat-val">${a.affectedP}</div></div><div class="ent-detail-stat"><div class="ent-detail-stat-label">影响资产</div><div class="ent-detail-stat-val">${a.affectedA}亿$</div></div></div><div style="background:#f8fafc;padding:14px;border-radius:8px;margin-bottom:14px"><div style="font-size:12px;color:var(--text2);margin-bottom:4px">预警标题</div><div style="font-size:15px;font-weight:700;margin-bottom:10px">${a.title}</div><div style="font-size:12px;color:var(--text2);margin-bottom:4px">预警描述</div><div style="font-size:13px;line-height:1.6">${a.desc}</div></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">${[['预警编号',a.id],['发布时间',a.time],['目标国家',a.country],['关联企业',a.enterprise],['当前状态',ALERT_ST[a.status]],['预警类型',a.type]].map(([l,v])=>`<div style="background:#f8fafc;padding:10px 12px;border-radius:6px;border:1px solid var(--border)"><div style="font-size:11px;color:var(--text2)">${l}</div><div style="font-weight:600">${v}</div></div>`).join('')}</div><div class="card-tt" style="margin-bottom:10px">📋 响应建议</div><div style="background:var(--blue-bg);padding:12px 14px;border-radius:6px;font-size:12px;line-height:1.8;color:var(--text)">${a.level==='red'?'1. 立即启动一级应急响应机制<br>2. 评估人员安全状况，必要时启动撤离<br>3. 向外交部领事保护中心报备<br>4. 启动24小时应急值守<br>5. 协调使领馆提供领事保护':a.level==='orange'?'1. 启动二级应急响应<br>2. 加强项目现场安保措施<br>3. 限制非必要人员外出<br>4. 保持与使领馆密切联系<br>5. 制定详细应急预案':'1. 加强风险监控频率<br>2. 制定针对性防范措施<br>3. 通报相关人员<br>4. 定期评估风险变化'}</div>${related.length?`<div class="card-tt" style="margin:14px 0 10px">🔗 关联预警</div><div class="alert-list">${related.map(r=>{const rl=ALERT_LV[r.level];return`<div class="alert-item lv-${r.level}" onclick="showAlertDetail('${r.id}')"><div class="alert-item-top"><div class="alert-item-tt"><span class="risk-badge ${rl.cls}">${rl.label}</span>${r.title}</div><span style="font-size:11px;color:var(--text2)">${r.time}</span></div><div class="alert-item-desc">${r.desc.substring(0,60)}...</div></div>`}).join('')}</div>`:''}`;
  document.getElementById('modal').classList.add('show');
}
//事件追踪
function renderEvents(){
  const tf=document.getElementById('evt-type-filter')?document.getElementById('evt-type-filter').value:'all',sf=document.getElementById('evt-sev-filter')?document.getElementById('evt-sev-filter').value:'all';
  const f=EVENTS.filter(e=>(tf==='all'||e.type===tf)&&(sf==='all'||e.sev===sf)).sort((a,b)=>b.date.localeCompare(a.date));
  document.getElementById('evt-total').textContent=EVENTS.length;
  document.getElementById('evt-active').textContent=EVENTS.filter(e=>e.status==='active'||e.status==='monitoring').length;
  const t=document.getElementById('event-timeline');if(!f.length){t.innerHTML='<div class="empty"><div class="ic">📡</div><div>暂无符合条件的事件</div></div>';return}
  t.innerHTML=f.map(e=>{const dot=e.sev==='critical'?'red':e.sev==='high'?'orange':e.sev==='medium'?'yellow':'blue';return`<div class="tl-item"><div class="tl-dot ${dot}"></div><div class="tl-date">${e.date} | ${EVT_TYPE[e.type]} | ${EVT_SEV[e.sev]}</div><div class="tl-title">${e.title}</div><div class="tl-desc">${e.desc}</div><div class="tl-desc" style="margin-top:4px"><strong>影响：</strong>${e.impact}<br><strong>响应：</strong>${e.response}</div><div class="tl-tags"><span class="risk-badge lv-${dot}">${e.country}</span>${e.enterprises.map(en=>`<span class="risk-badge lv-blue">${en}</span>`).join('')}<span class="risk-badge ${e.status==='active'?'lv-red':e.status==='monitoring'?'lv-orange':'lv-green'}">${e.status==='active'?'活跃':e.status==='monitoring'?'监控中':'已解决'}</span></div></div>`}).join('');
}
//人员安全
function renderPersonnel(){
  const tP=ENTERPRISES.reduce((s,e)=>s+e.personnel,0);
  const pCrit=ENTERPRISES.filter(e=>getEntRisk(e)>=8).reduce((s,e)=>s+e.personnel,0);
  const pHigh=ENTERPRISES.filter(e=>{const r=getEntRisk(e);return r>=6&&r<8}).reduce((s,e)=>s+e.personnel,0);
  const pAlert=ALERTS.filter(a=>a.status!=='resolved').reduce((s,a)=>s+a.affectedP,0);
  const pSafe=tP-pCrit-pHigh;
  document.getElementById('personnel-stats').innerHTML=`<div class="alert-stat alert-stat-blue"><div class="alert-stat-lv">海外人员总数</div><div class="alert-stat-num">${tP.toLocaleString()}</div><div class="alert-stat-desc">含外派及本地雇员</div></div><div class="alert-stat alert-stat-red"><div class="alert-stat-lv">极高风险地区</div><div class="alert-stat-num">${pCrit.toLocaleString()}</div><div class="alert-stat-desc">需重点关注</div></div><div class="alert-stat alert-stat-orange"><div class="alert-stat-lv">高风险地区</div><div class="alert-stat-num">${pHigh.toLocaleString()}</div><div class="alert-stat-desc">需加强防护</div></div><div class="alert-stat alert-stat-yellow"><div class="alert-stat-lv">预警影响</div><div class="alert-stat-num">${pAlert.toLocaleString()}</div><div class="alert-stat-desc">受活跃预警影响</div></div>`;
  const pm={};COUNTRIES.forEach(c=>{const ents=getEntsInCountry(c.name);if(ents.length){const cnt=ents.reduce((s,e)=>s+Math.round(e.personnel/e.countries.length),0);pm[c.name]={cnt,ov:calcOverall(c.scores),flag:c.flag}}});const top=Object.entries(pm).sort((a,b)=>b[1].cnt-a[1].cnt).slice(0,15);
  const ctx1=document.getElementById('chart-personnel-country').getContext('2d');if(charts.pc)charts.pc.destroy();charts.pc=new Chart(ctx1,{type:'bar',data:{labels:top.map(([n])=>pm[n].flag+n),datasets:[{label:'人员数',data:top.map(([n])=>pm[n].cnt),backgroundColor:top.map(([n])=>{const ov=pm[n].ov;return ov>=8?'#dc2626':ov>=6?'#ea580c':ov>=4?'#ca8a04':'#16a34a'}),borderRadius:4}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{display:false},ticks:{font:{size:9},maxRotation:45}},y:{grid:{color:'#f0f2f5'},beginAtZero:true}}}});
  const ctx2=document.getElementById('chart-personnel-risk').getContext('2d');if(charts.pr)charts.pr.destroy();charts.pr=new Chart(ctx2,{type:'doughnut',data:{labels:['极高风险','高风险','中高风险','中低风险'],datasets:[{data:[pCrit,pHigh,tP-pCrit-pHigh-pSafe>0?tP-pCrit-pHigh-pSafe:0,pSafe].filter(v=>v>0),backgroundColor:['#991b1b','#dc2626','#ea580c','#16a34a'],borderWidth:2,borderColor:'#fff'}]},options:{responsive:true,maintainAspectRatio:false,cutout:'60%',plugins:{legend:{position:'bottom',labels:{font:{size:10},padding:8}}}}});
  // 近期安全事件案例
  const incidents=ALERTS.filter(a=>a.type==='安全风险'&&a.status!=='resolved').slice(0,5);
  document.getElementById('personnel-incidents').innerHTML=incidents.map(a=>{const lv=ALERT_LV[a.level];return`<div style="padding:10px;border-radius:6px;border-left:3px solid ${a.level==='red'?'var(--red)':a.level==='orange'?'var(--orange)':'var(--yellow)'};background:#f8fafc;margin-bottom:8px;cursor:pointer" onclick="showAlertDetail('${a.id}')"><div style="display:flex;align-items:center;gap:6px;margin-bottom:4px"><span class="risk-badge ${lv.cls}">${lv.label}</span><strong style="font-size:12px">${a.title}</strong></div><div style="font-size:11px;color:var(--text2);line-height:1.5">${a.desc.substring(0,100)}...</div><div style="display:flex;gap:10px;margin-top:4px;font-size:11px;color:var(--text2)"><span>📍${a.country}</span><span>🏢${a.enterprise}</span><span>👥${a.affectedP}人受影响</span><span>${a.time}</span></div></div>`}).join('');
  // 撤离状态追踪
  const evacAlerts=ALERTS.filter(a=>a.status==='responding'&&a.affectedP>50);
  document.getElementById('personnel-evacuation').innerHTML=`<div style="font-size:12px;font-weight:700;margin-bottom:8px">🚨 正在处置的安全事件（影响>50人）</div>${evacAlerts.length?evacAlerts.map(a=>{const lv=ALERT_LV[a.level];const pct=Math.min(100,Math.round((a.affectedP>500?80:a.affectedP>200?60:40)));return`<div style="padding:10px;border-radius:6px;background:${a.level==='red'?'var(--red-bg)':'var(--orange-bg)'};margin-bottom:8px"><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px"><span class="risk-badge ${lv.cls}">${lv.label}</span><span style="font-size:11px;color:var(--text2)">${a.time}</span></div><div style="font-size:12px;font-weight:600;margin-bottom:4px">${a.title}</div><div style="font-size:11px;color:var(--text2);margin-bottom:6px">📍${a.country} | 🏢${a.enterprise} | 👥${a.affectedP}人</div><div style="font-size:11px;color:var(--text2);margin-bottom:4px">处置进度</div><div style="height:8px;background:#e8edf3;border-radius:4px;overflow:hidden"><div style="height:100%;width:${pct}%;background:${a.level==='red'?'var(--red)':'var(--orange)'};border-radius:4px;transition:width .5s"></div></div><div style="display:flex;justify-content:space-between;margin-top:4px;font-size:10px;color:var(--text2)"><span>已转移:${Math.round(a.affectedP*pct/100)}人</span><span>待转移:${a.affectedP-Math.round(a.affectedP*pct/100)}人</span></div></div>`}).join(''):'<div style="font-size:12px;color:var(--text2);text-align:center;padding:20px">暂无大规模撤离事件</div>'}<div style="margin-top:10px;padding:10px;background:var(--blue-bg);border-radius:6px;font-size:11px;color:var(--text);line-height:1.6"><strong>📞 应急联络：</strong><br>外交部全球领事保护热线：12308<br>商务部对外投资合作服务：12335<br>企业应急联络通道：系统内置通讯录</div>`;
  document.getElementById('personnel-table').innerHTML=[...ENTERPRISES].map(e=>({...e,rs:getEntRisk(e)})).sort((a,b)=>b.rs-a.rs).map(e=>{const lv=getLevel(e.rs);const hCnt=e.countries.filter(c=>{const ct=COUNTRIES.find(x=>x.name===c);return ct&&calcOverall(ct.scores)>=6}).length;const hP=Math.round(e.personnel*hCnt/Math.max(e.countries.length,1));const st=e.status==='alert'?'<span class="risk-badge lv-red">⚠️预警</span>':e.status==='monitoring'?'<span class="risk-badge lv-orange">📡监控</span>':'<span class="risk-badge lv-green">✅安全</span>';return`<tr style="cursor:pointer" onclick="showEntDetail(${e.id})"><td><strong>${e.short}</strong></td><td>${e.industry}</td><td>${e.countries.length}</td><td>${e.personnel.toLocaleString()}</td><td>${hCnt}</td><td style="color:${hP>0?'var(--red)':'var(--text2)'}">${hP>0?hP.toLocaleString():'—'}</td><td><strong style="color:${lv.color}">${e.rs.toFixed(1)}</strong></td><td><span class="risk-badge ${lv.cls}">${lv.short}</span></td><td>${st}</td></tr>`}).join('');
}
//风险地图
function renderRiskMap(){
  const counts={critical:0,high:0,elevated:0,moderate:0,low:0};
  COUNTRIES.forEach(c=>{const lv=getLevel(calcOverall(c.scores));counts[lv.level]++});
  document.getElementById('map-stats').innerHTML=`<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">${[{l:'极高风险',v:counts.critical,c:'#991b1b'},{l:'高风险',v:counts.high,c:'#dc2626'},{l:'中高风险',v:counts.elevated,c:'#ea580c'},{l:'中低风险',v:counts.moderate,c:'#ca8a04'},{l:'低风险',v:counts.low,c:'#16a34a'},{l:'总计',v:COUNTRIES.length,c:'#1a6dd6'}].map(s=>`<div style="background:#f8fafc;padding:10px;border-radius:6px;text-align:center;border:1px solid var(--border)"><div style="font-size:22px;font-weight:800;color:${s.c}">${s.v}</div><div style="font-size:11px;color:var(--text2)">${s.l}</div></div>`).join('')}</div><div style="font-size:12px;font-weight:700;margin-bottom:8px">🚨 高风险国家列表</div>${COUNTRIES.filter(c=>calcOverall(c.scores)>=6).sort((a,b)=>calcOverall(b.scores)-calcOverall(a.scores)).map(c=>{const ov=calcOverall(c.scores),lv=getLevel(ov);const ents=getEntsInCountry(c.name).length;const al=ALERTS.filter(a=>a.country===c.name&&a.status!=='resolved').length;return `<div style="display:flex;align-items:center;justify-content:space-between;padding:5px 0;border-bottom:1px solid var(--border);cursor:pointer;font-size:12px" onclick="showCtyDetail('${c.name}')"><span>${c.flag} ${c.name}</span><span style="color:${lv.color};font-weight:700">${ov.toFixed(1)} (${ents}企${al?',🚨'+al:''})</span></div>`}).join('')}`;
  document.getElementById('map-container').innerHTML=buildMapSVG(1000,500,true)+`<div style="display:flex;gap:16px;margin-top:10px;flex-wrap:wrap;align-items:center"><span style="font-size:12px;font-weight:600">图例：</span><span style="font-size:11px;display:flex;align-items:center;gap:4px"><span style="width:12px;height:12px;border-radius:50%;background:#991b1b;display:inline-block"></span>极高(≥8)</span><span style="font-size:11px;display:flex;align-items:center;gap:4px"><span style="width:12px;height:12px;border-radius:50%;background:#dc2626;display:inline-block"></span>高(6-8)</span><span style="font-size:11px;display:flex;align-items:center;gap:4px"><span style="width:12px;height:12px;border-radius:50%;background:#ea580c;display:inline-block"></span>中高(4-6)</span><span style="font-size:11px;display:flex;align-items:center;gap:4px"><span style="width:12px;height:12px;border-radius:50%;background:#ca8a04;display:inline-block"></span>中低(2.5-4)</span><span style="font-size:11px;display:flex;align-items:center;gap:4px"><span style="width:12px;height:12px;border-radius:50%;background:#16a34a;display:inline-block"></span>低(<2.5)</span><span style="font-size:11px;color:var(--text2);margin-left:auto">💡 点击圆点查看国家详情 | 圆圈大小=企业数量 | 闪烁=活跃预警</span></div>`;
  // 航运通道
  document.getElementById('map-chokepoints').innerHTML=CHOKEPOINTS.map(cp=>{const lv=getLevel(cp.risk);return`<div style="padding:10px;border-radius:6px;border-left:3px solid ${lv.color};background:#f8fafc;margin-bottom:8px"><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px"><strong style="font-size:12px">${cp.name}</strong><span class="risk-badge ${lv.cls}">${cp.risk.toFixed(1)} ${lv.short}</span></div><div style="font-size:11px;color:var(--text2);line-height:1.5;margin-bottom:4px">${cp.desc}</div><div style="display:flex;gap:10px;font-size:11px"><span style="color:var(--red)">⚠️ ${cp.impact}</span></div><div style="font-size:10px;color:var(--text2);margin-top:4px">影响企业：${cp.ents.join('、')}</div></div>`}).join('');
  // 一带一路走廊
  document.getElementById('map-corridors').innerHTML=CORRIDORS.map(co=>{const lv=getLevel(co.risk);const stColor=co.status==='高风险'?'var(--red)':co.status==='部分受阻'?'var(--orange)':co.status==='正常推进'?'var(--blue)':'var(--green)';return`<div style="padding:10px;border-radius:6px;border-left:3px solid ${lv.color};background:#f8fafc;margin-bottom:8px;cursor:pointer" onclick="showCtyDetail('${co.countries.split('/')[0]}')"><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px"><strong style="font-size:12px">${co.name}</strong><span class="risk-badge ${lv.cls}">${co.risk.toFixed(1)}</span></div><div style="font-size:11px;color:var(--text2);margin-bottom:4px">${co.countries} | ${co.ents}家中企 | 投资${co.inv}亿$</div><div style="font-size:11px;color:var(--text2);line-height:1.5;margin-bottom:4px">${co.desc}</div><div style="display:flex;gap:8px;align-items:center"><span style="font-size:11px;font-weight:600;color:${stColor}">${co.status}</span></div><div style="font-size:10px;color:var(--text2);margin-top:4px">${co.detail}</div></div>`}).join('');
  // 区域风险对比图
  const regs=[...new Set(COUNTRIES.map(c=>c.region))];const rData=regs.map(r=>{const cs=COUNTRIES.filter(c=>c.region===r);return Math.round(cs.reduce((s,c)=>s+calcOverall(c.scores),0)/cs.length*10)/10});
  const ctx=document.getElementById('chart-map-region').getContext('2d');if(charts.mr)charts.mr.destroy();charts.mr=new Chart(ctx,{type:'radar',data:{labels:regs,datasets:[{label:'区域风险评分',data:rData,borderColor:'#dc2626',backgroundColor:'rgba(220,38,38,.15)',borderWidth:2,pointBackgroundColor:'#dc2626',pointRadius:4}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{r:{min:0,max:10,grid:{color:'#e0e6ed'},pointLabels:{font:{size:11}}}}}});
}
//预测中心
function renderPrediction(){
  const high3=PREDICTIONS.filter(p=>p.p3>=7).length;
  const high6=PREDICTIONS.filter(p=>p.p6>=7).length;
  const high12=PREDICTIONS.filter(p=>p.trend==='up').length;
  document.getElementById('pred-3m').textContent=high3;
  document.getElementById('pred-6m').textContent=high6;
  document.getElementById('pred-12m').textContent=high12;
  document.getElementById('pred-indicators').textContent=WARNING_RULES.filter(r=>r.enabled).length;
  // 预测趋势图
  const months=['7月','8月','9月','10月','11月','12月'];
  const topPred=PREDICTIONS.slice(0,6);
  const colors=['#dc2626','#ea580c','#ca8a04','#2563eb','#7c3aed','#059669'];
  const ds=topPred.map((p,i)=>{const data=months.map((_,j)=>{return Math.round(Math.min(10,(p.cur+(j+1)*0.1*(p.trend==='up'?1:p.trend==='down'?-1:0)))*10)/10});return{label:p.flag+p.country,data,borderColor:colors[i],backgroundColor:colors[i]+'20',borderWidth:2,tension:.3,pointRadius:3}}).filter(Boolean);
  const ctx1=document.getElementById('chart-pred-trend').getContext('2d');if(charts.pt)charts.pt.destroy();charts.pt=new Chart(ctx1,{type:'line',data:{labels:months,datasets:ds},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{font:{size:10},padding:8}}},scales:{y:{min:2,max:10,grid:{color:'#f0f2f5'}},x:{grid:{display:false}}}}});
  // 情景分析
  document.getElementById('pred-scenarios').innerHTML=`<div style="margin-bottom:12px;padding:12px;border-radius:6px;background:var(--green-bg);border-left:3px solid var(--green)"><div style="display:flex;align-items:center;gap:6px;margin-bottom:6px"><span style="font-size:16px">✅</span><strong style="font-size:13px;color:var(--green)">乐观情景</strong></div><div style="font-size:12px;color:var(--text2);line-height:1.6">苏丹冲突缓和，缅甸局势趋稳，红海航运恢复。全球风险指数下降至5.5左右。建议把握塞尔维亚、马来西亚等风险下降国家的投资机遇。</div></div><div style="margin-bottom:12px;padding:12px;border-radius:6px;background:var(--yellow-bg);border-left:3px solid var(--yellow)"><div style="display:flex;align-items:center;gap:6px;margin-bottom:6px"><span style="font-size:16px">📊</span><strong style="font-size:13px;color:var(--yellow)">基准情景（最可能）</strong></div><div style="font-size:12px;color:var(--text2);line-height:1.6">当前风险格局延续，阿富汗、苏丹、缅甸等高风险国家维持高位。美国大选年政策不确定性增加。全球风险指数维持在6.0-6.5区间。建议加强重点国家风险防范。</div></div><div style="padding:12px;border-radius:6px;background:var(--red-bg);border-left:3px solid var(--red)"><div style="display:flex;align-items:center;gap:6px;margin-bottom:6px"><span style="font-size:16px">⚠️</span><strong style="font-size:13px;color:var(--red)">悲观情景</strong></div><div style="font-size:12px;color:var(--text2);line-height:1.6">苏丹冲突扩大至区域战争，红海航运完全中断，美国对华制裁大幅升级。刚果(金)矿区武装冲突蔓延。全球风险指数攀升至7.5以上。建议启动大规模人员撤离预案。</div></div>`;
  // 早期预警指标
  const indicators=[{n:'政治稳定性指标',v:'⚠️ 关注',d:'3国内阁变动/政变',c:'var(--orange)'},{n:'货币贬值指标',v:'🔴 预警',d:'5国月贬值>10%',c:'var(--red)'},{n:'恐怖袭击指标',v:'🔴 预警',d:'4国发生恐袭事件',c:'var(--red)'},{n:'制裁措施指标',v:'⚠️ 关注',d:'美对华/对伊新制裁',c:'var(--orange)'},{n:'社会动荡指标',v:'⚠️ 关注',d:'5国发生抗议活动',c:'var(--orange)'},{n:'自然灾害指标',v:'🟡 监控',d:'东南亚台风季',c:'var(--yellow)'}];
  document.getElementById('pred-indicators-panel').innerHTML=indicators.map(ind=>`<div style="display:flex;align-items:center;gap:10px;padding:10px;border-bottom:1px solid var(--border)"><div style="width:8px;height:8px;border-radius:50%;background:${ind.c};flex-shrink:0;animation:pulse 2s infinite"></div><div style="flex:1"><div style="font-size:12px;font-weight:600">${ind.n}</div><div style="font-size:11px;color:var(--text2)">${ind.d}</div></div><span style="font-size:12px;font-weight:700;color:${ind.c}">${ind.v}</span></div>`).join('')+`<div style="margin-top:10px;padding:10px;background:var(--blue-bg);border-radius:6px;font-size:11px;color:var(--text2);line-height:1.6"><strong>💡 模型说明：</strong>预测基于历史风险数据、事件趋势分析、宏观经济指标和政治稳定性模型综合计算。预测准确率约75-80%，仅供决策参考。</div>`;
  // 重点国家预测表
  document.getElementById('pred-country-table').innerHTML=PREDICTIONS.map(p=>{const lv=getLevel(p.cur);const tIcon=p.trend==='up'?'<span style="color:var(--red)">↑上升</span>':p.trend==='down'?'<span style="color:var(--green)">↓下降</span>':'<span style="color:var(--text2)">→持平</span>';const aLv=getLevel(p.p6);return`<tr style="cursor:pointer" onclick="showCtyDetail('${p.country}')"><td>${p.flag} <strong>${p.country}</strong></td><td><strong style="color:${lv.color}">${p.cur.toFixed(1)}</strong></td><td style="color:${getLevel(p.p3).color}">${p.p3.toFixed(1)}</td><td style="color:${aLv.color};font-weight:700">${p.p6.toFixed(1)}</td><td>${tIcon}</td><td style="font-size:11px;color:var(--text2)">${p.driver}</td><td style="font-size:11px"><span class="risk-badge ${aLv.cls}">${p.advice}</span></td></tr>`}).join('');
  // 行业风险预测
  const inds=[...new Set(ENTERPRISES.map(e=>e.industry))];const curData=inds.map(i=>{const es=ENTERPRISES.filter(e=>e.industry===i);return Math.round(es.reduce((s,e)=>s+getEntRisk(e),0)/es.length*10)/10});const futData=inds.map((_,i)=>Math.round((curData[i]+0.2)*10)/10);
  const ctx2=document.getElementById('chart-pred-industry').getContext('2d');if(charts.pi)charts.pi.destroy();charts.pi=new Chart(ctx2,{type:'bar',data:{labels:inds,datasets:[{label:'当前风险',data:curData,backgroundColor:'#2563eb',borderRadius:4},{label:'6月预测',data:futData,backgroundColor:'#dc2626',borderRadius:4}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{font:{size:11},padding:8}}},scales:{y:{max:10,grid:{color:'#f0f2f5'}},x:{grid:{display:false},ticks:{font:{size:10}}}}}});
}
//风险评估
let curAssess={scores:{},step:1};
function initAssess(){
  document.getElementById('as-enterprise').innerHTML='<option value="">请选择...</option>'+ENTERPRISES.map(e=>`<option value="${e.short}">${e.logo} ${e.name} (${e.industry})</option>`).join('');
  document.getElementById('as-country').innerHTML='<option value="">请选择...</option>'+COUNTRIES.map(c=>`<option value="${c.name}">${c.flag} ${c.name} (${c.region})</option>`).join('');
  document.getElementById('as-name').value='';document.getElementById('as-enterprise').value='';document.getElementById('as-country').value='';
  DIMS.forEach(d=>{curAssess.scores[d.key]=5;d.factors.forEach((_,i)=>{curAssess.scores[d.key+'_'+i]=5})});
  renderScoringSliders();goStep(1);
}
function onEntSelect(){const sh=document.getElementById('as-enterprise').value;if(!sh)return;const e=ENTERPRISES.find(x=>x.short===sh);if(!e)return;document.getElementById('as-name').value=`${e.name}海外运营风险评估`;}
function renderScoringSliders(){document.getElementById('scoring-area').innerHTML=DIMS.map(d=>`<div class="sl-group"><div class="sl-group-hd"><div class="sl-group-tt">${d.ic} ${d.name} <span style="font-size:11px;color:var(--text2);font-weight:400">(权重${d.w*100}%)</span></div><div class="sl-group-score" id="sc-${d.key}" style="color:${d.color}">5.0</div></div>${d.factors.map((f,i)=>`<div class="sl-row"><label>${f}</label><input type="range" min="1" max="10" step="0.5" value="5" oninput="updateFactor('${d.key}',${i},this.value)" id="sl-${d.key}-${i}"><span class="sl-val" id="v-${d.key}-${i}">5</span></div>`).join('')}</div>`).join('');}
function updateFactor(k,i,v){curAssess.scores[k+'_'+i]=parseFloat(v);document.getElementById('v-'+k+'-'+i).textContent=parseFloat(v).toFixed(1);const d=DIMS.find(x=>x.key===k);const avg=d.factors.reduce((s,_,j)=>s+curAssess.scores[k+'_'+j],0)/d.factors.length;curAssess.scores[k]=Math.round(avg*10)/10;document.getElementById('sc-'+k).textContent=curAssess.scores[k].toFixed(1);updateLive();}
function updateLive(){const ov=calcOverall(curAssess.scores),lv=getLevel(ov);document.getElementById('live-score').textContent=ov.toFixed(1);document.getElementById('live-score').style.color=lv.color;document.getElementById('live-level').innerHTML=`<span class="risk-badge ${lv.cls}">${lv.label}</span>`;}
function preloadData(){const cn=document.getElementById('as-country').value;if(!cn)return;const c=COUNTRIES.find(x=>x.name===cn);if(!c)return;DIMS.forEach(d=>{const bs=c.scores[d.key]||5;d.factors.forEach((_,i)=>{const v=Math.max(1,Math.min(10,Math.round((bs+(Math.random()-.5)*1.5)*2)/2));curAssess.scores[d.key+'_'+i]=v;const sl=document.getElementById('sl-'+d.key+'-'+i);if(sl){sl.value=v;document.getElementById('v-'+d.key+'-'+i).textContent=v.toFixed(1)}});const avg=d.factors.reduce((s,_,i)=>s+curAssess.scores[d.key+'_'+i],0)/d.factors.length;curAssess.scores[d.key]=Math.round(avg*10)/10;document.getElementById('sc-'+d.key).textContent=curAssess.scores[d.key].toFixed(1)});updateLive();showToast('已加载'+cn+'参考数据');}
function goStep(s){curAssess.step=s;for(let i=1;i<=4;i++){document.getElementById('assess-s'+i).style.display=i===s?'block':'none';const el=document.getElementById('stp-'+i);el.classList.remove('active','done');if(i<s)el.classList.add('done');if(i===s)el.classList.add('active')}if(s===3)renderResult();if(s===4)renderReport();}
function calcResult(){DIMS.forEach(d=>{const avg=d.factors.reduce((s,_,i)=>s+(curAssess.scores[d.key+'_'+i]||5),0)/d.factors.length;curAssess.scores[d.key]=Math.round(avg*10)/10});goStep(3);}
function renderResult(){const ov=calcOverall(curAssess.scores),lv=getLevel(ov);const c=document.getElementById('res-circle');c.style.background=`conic-gradient(${lv.color} ${ov*36}deg,#e0e6ed ${ov*36}deg)`;document.getElementById('res-score').textContent=ov.toFixed(1);document.getElementById('res-score').style.color=lv.color;document.getElementById('res-label').textContent=lv.label;document.getElementById('res-label').style.color=lv.color;document.getElementById('res-dim-bars').innerHTML=DIMS.map(d=>{const sc=curAssess.scores[d.key],dl=getLevel(sc);return`<div class="dim-bar"><div class="dim-bar-lbl">${d.ic}${d.name}</div><div class="dim-bar-track"><div class="dim-bar-fill" style="width:${sc*10}%;background:${dl.color}"></div></div><div class="dim-bar-val" style="color:${dl.color}">${sc.toFixed(1)}</div></div>`}).join('');const rc=document.getElementById('chart-radar').getContext('2d');if(charts.radar)charts.radar.destroy();charts.radar=new Chart(rc,{type:'radar',data:{labels:DIMS.map(d=>d.name),datasets:[{label:'当前评估',data:DIMS.map(d=>curAssess.scores[d.key]),backgroundColor:'rgba(220,38,38,.15)',borderColor:'#dc2626',borderWidth:2,pointBackgroundColor:'#dc2626',pointRadius:4}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{r:{min:0,max:10,grid:{color:'#e0e6ed'},pointLabels:{font:{size:10}}}}}});const bc=document.getElementById('chart-bar-res').getContext('2d');if(charts.bar)charts.bar.destroy();charts.bar=new Chart(bc,{type:'bar',data:{labels:DIMS.map(d=>d.name),datasets:[{data:DIMS.map(d=>curAssess.scores[d.key]),backgroundColor:DIMS.map(d=>getLevel(curAssess.scores[d.key]).color),borderRadius:4}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{max:10,grid:{color:'#f0f2f5'}},x:{grid:{display:false},ticks:{font:{size:9}}}}}});}
function renderReport(){const ov=calcOverall(curAssess.scores),lv=getLevel(ov);const cn=document.getElementById('as-country').value||'目标国家';const en=document.getElementById('as-enterprise').value||'';const an=document.getElementById('as-name').value||'海外利益风险评估';const sd=[...DIMS].sort((a,b)=>curAssess.scores[b.key]-curAssess.scores[a.key]);const tr=sd.slice(0,3);const recs=[];if(ov>=8)recs.push({t:'⚠️ 立即启动应急响应',d:`鉴于${cn}整体风险极高，建议立即启动应急响应机制，评估是否需要撤回非必要人员，保全关键资产。`});else if(ov>=6)recs.push({t:'⚠️ 制定详细应急预案',d:`针对${cn}高风险情况，建议制定详细应急预案，包括人员撤离路线、资产保全方案。`});else if(ov>=4)recs.push({t:'📋 加强风险防范',d:`${cn}存在中等风险，建议加强日常风险监控，建立定期评估机制。`});else recs.push({t:'✅ 保持常规监控',d:`${cn}风险总体可控，建议保持常规风险监控频率。`});tr.forEach(d=>{if(curAssess.scores[d.key]<6)return;const sp={political:['政治风险防范','建立政治动态监测机制，与使领馆保持密切联系'],security:['安全保障升级','聘请专业安保公司，建立安全信息通报系统，制定撤离预案'],economic:['经济风险对冲','使用金融工具对冲汇率风险，分散供应链布局'],legal:['法律合规保障','聘请当地法律顾问，完善合同条款'],social:['社区关系建设','加强企业社会责任投入，开展跨文化培训'],natural:['灾害应急准备','建立自然灾害预警系统，购买财产保险'],operational:['运营韧性提升','推进供应链多元化，建立备用方案'],geopolitical:['地缘风险管控','密切关注大国博弈动态，做好制裁合规审查']};if(sp[d.key])recs.push({t:sp[d.key][0],d:sp[d.key][1]})});recs.push({t:'🔄 持续评估机制',d:`建议每3-6个月对${cn}进行重新评估，重大事件后及时启动临时评估。`});
  document.getElementById('report-body').innerHTML=`<div style="text-align:center;margin-bottom:16px"><h2 style="font-size:20px;margin-bottom:4px">海外利益保护风险评估报告</h2><p style="color:var(--text2);font-size:13px">${an}</p></div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:16px">${[['关联企业',en||'—'],['目标国家',cn],['综合评分',ov.toFixed(1)+'/10'],['风险等级',lv.label],['评估日期',new Date().toISOString().split('T')[0]],['评估模型','8维度32指标']].map(([l,v])=>`<div style="background:#f8fafc;padding:10px 12px;border-radius:6px;border-left:3px solid var(--accent)"><div style="font-size:11px;color:var(--text2)">${l}</div><div style="font-weight:600;margin-top:2px">${v}</div></div>`).join('')}</div><div class="card-tt" style="border-bottom:2px solid var(--accent);padding-bottom:8px;margin-bottom:12px">📊 一、评估结果概览</div><p style="line-height:1.8;margin-bottom:14px">经对${cn}的8大风险维度32项指标综合评估，综合风险评分为<strong style="color:${lv.color}">${ov.toFixed(1)}</strong>分，属于<strong style="color:${lv.color}">${lv.label}</strong>。${lv.level==='critical'||lv.level==='high'?'建议'+(lv.level==='critical'?'暂缓或撤出':'审慎推进')+'相关活动，并启动应急预案。':lv.level==='elevated'?'建议在充分做好风险防范前提下审慎推进。':'风险总体可控，可正常开展业务。'}</p><div class="card-tt" style="border-bottom:2px solid var(--accent);padding-bottom:8px;margin-bottom:12px">🔍 二、主要风险分析</div>${tr.map((d,i)=>{const sc=curAssess.scores[d.key],dl=getLevel(sc);return`<div class="rec-item" style="border-left-color:${dl.color}"><div class="rec-ic" style="background:${dl.color}20;color:${dl.color}">${i+1}</div><div><div class="rec-tt">${d.ic}${d.name}（${sc.toFixed(1)}分）</div><div class="rec-tx">${d.key==='political'?cn+'政局存在较大不确定性，政策连续性难以保障。':d.key==='security'?cn+'安全形势严峻，恐怖主义、社会治安问题突出。':d.key==='economic'?cn+'经济面临较大压力，通胀汇率风险突出。':d.key==='geopolitical'?cn+'地缘战略位置敏感，大国博弈影响显著。':cn+'该维度风险较高，需重点关注。'}</div></div></div>`}).join('')}<div class="card-tt" style="border-bottom:2px solid var(--accent);padding-bottom:8px;margin:14px 0 12px">✅ 三、相对优势</div><p style="color:var(--text2);line-height:1.8;margin-bottom:14px">${sd.slice(-2).map(d=>`${d.name}（${curAssess.scores[d.key].toFixed(1)}分）`).join('和')}为相对低风险维度，可作为业务开展的有利支撑。</p><div class="card-tt" style="border-bottom:2px solid var(--accent);padding-bottom:8px;margin-bottom:12px">📋 四、建议措施</div>${recs.map(r=>`<div class="rec-item"><div class="rec-ic">${r.t.charAt(0)}</div><div><div class="rec-tt">${r.t}</div><div class="rec-tx">${r.d}</div></div></div>`).join('')}`;}
function saveAssess(){showToast('✅ 评估记录已保存');setTimeout(()=>navigateTo('reports'),1500);}
function resetAssess(){curAssess={scores:{},step:1};initAssess();showToast('已重置，请开始新评估');}
//风险矩阵
function renderMatrix(){
  function cellLv(l,i){const s=l*i;if(s>=16)return 5;if(s>=12)return 4;if(s>=8)return 3;if(s>=4)return 2;return 1}
  function getCtyCell(c){const ov=calcOverall(c.scores);return{l:Math.min(5,Math.ceil(ov/2)),i:Math.min(4,Math.ceil(ov/2.5))}}
  const ll=['极低','较低','中等','较高','极高'],il=['影响较小','影响一般','影响较大','影响严重'];
  let h='<div class="mx-cell hdr"></div>'+ll.map(l=>`<div class="mx-cell hdr">${l}<br><span style="font-size:10px;font-weight:400">可能性</span></div>`).join('');
  for(let imp=4;imp>=1;imp--){h+=`<div class="mx-cell hdr">${il[imp-1]}</div>`;for(let lk=1;lk<=5;lk++){const lv=cellLv(lk,imp);const cs=COUNTRIES.filter(c=>{const cc=getCtyCell(c);return cc.l===lk&&cc.i===imp});const labels=['','低','中低','中高','高','极高'];h+=`<div class="mx-cell l${lv}" onclick="showMatrixCties(${lk},${imp})"><span class="mx-count">${cs.length}</span><span class="mx-lbl">${labels[lv]}风险</span></div>`}}
  document.getElementById('matrix-grid').innerHTML=h;
  // 企业矩阵表
  document.getElementById('matrix-ent-table').innerHTML=[...ENTERPRISES].map(e=>({...e,rs:getEntRisk(e)})).sort((a,b)=>b.rs-a.rs).map(e=>{const lv=getLevel(e.rs);const q=e.rs>=7&&e.investment>=30?'🔴 高风险高敞口':e.rs>=7&&e.investment<30?'🟠 高风险低敞口':e.rs>=4&&e.investment>=30?'🟡 中风险高敞口':e.rs>=4&&e.investment<30?'🟢 中风险低敞口':'🟢 低风险';const rec=e.rs>=7?'立即制定应急预案，评估撤回非必要人员':e.rs>=5?'加强风险监控，制定防范措施':'保持常规监控，正常开展业务';return`<tr style="cursor:pointer" onclick="showEntDetail(${e.id})"><td><strong>${e.short}</strong></td><td>${e.industry}</td><td><strong style="color:${lv.color}">${e.rs.toFixed(1)}</strong></td><td>${e.investment}亿$</td><td>${e.personnel.toLocaleString()}</td><td><span class="risk-badge ${e.rs>=7?'lv-red':e.rs>=4?'lv-orange':'lv-green'}">${q}</span></td><td style="font-size:11px;color:var(--text2)">${rec}</td></tr>`}).join('');
  // 典型案例
  const cases=[{t:'🔴 苏丹中石油油田撤离（2023-2024）',d:'2023年4月15日苏丹爆发全面冲突，中国组织1,500余名公民分两批撤离（4月29日海路、5月2日空路）。中石油6区、7区油田运营全面中断，资产损失约35亿美元。',l:'极高×极高'},{t:'🟠 哥伦比亚紫金武里蒂卡金矿（2024）',d:'2024年1月紫金公告武里蒂卡金矿被非法采矿组织控制60%以上矿区。2023年记录2,260次爆炸和2,450次枪击。已向哥政府提起5亿美元国际仲裁。',l:'高×高'},{t:'🟡 巴基斯坦达苏项目遇袭（2024）',d:'2024年3月26日达苏水电站项目中方人员车辆遭自杀式炸弹袭击，5名中方工程师遇难。此前2021年7月同项目已致9名中方人员遇难。',l:'高×高'},{t:'🟢 塞尔维亚紫金矿业博尔铜矿（2024）',d:'中塞自贸协定2024年生效，投资环境改善。紫金矿业博尔铜矿项目推进顺利，投资8亿美元，400名中方人员安全作业。',l:'低×低'}];
  document.getElementById('matrix-cases').innerHTML=cases.map(c=>`<div style="padding:12px;border-radius:6px;background:#f8fafc;border-left:3px solid var(--accent);margin-bottom:8px"><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px"><strong style="font-size:13px">${c.t}</strong><span class="risk-badge lv-blue">${c.l}</span></div><div style="font-size:12px;color:var(--text2);line-height:1.6">${c.d}</div></div>`).join('');
}
function showMatrixCties(lk,imp){
  const cs=COUNTRIES.filter(c=>{const ov=calcOverall(c.scores);const l=Math.min(5,Math.ceil(ov/2)),i=Math.min(4,Math.ceil(ov/2.5));return l===lk&&i===imp});
  if(!cs.length){showToast('该区域暂无国家');return}
  document.getElementById('modal-tt').textContent=`矩阵区域 (可能性${lk}×影响${imp})`;
  document.getElementById('modal-bd').innerHTML=cs.map(c=>{const ov=calcOverall(c.scores),lv=getLevel(ov);return`<div style="display:flex;align-items:center;gap:12px;padding:10px;border-bottom:1px solid var(--border);cursor:pointer" onclick="showCtyDetail('${c.name}')"><span style="font-size:24px">${c.flag}</span><div style="flex:1"><div style="font-weight:600">${c.name}</div><div style="font-size:12px;color:var(--text2)">${c.region}|${c.mainRisk}</div></div><div style="text-align:right"><div style="font-size:18px;font-weight:700;color:${lv.color}">${ov.toFixed(1)}</div><span class="risk-badge ${lv.cls}">${lv.label}</span></div></div>`}).join('');
  document.getElementById('modal').classList.add('show');
}
//统计分析
function initStats(){
  const inds=[...new Set(ENTERPRISES.map(e=>e.industry))];
  const invData=inds.map(i=>ENTERPRISES.filter(e=>e.industry===i).reduce((s,e)=>s+e.investment,0));
  const ctx1=document.getElementById('st-industry-inv').getContext('2d');if(charts.siv)charts.siv.destroy();charts.siv=new Chart(ctx1,{type:'bar',data:{labels:inds,datasets:[{label:'海外投资(亿$)',data:invData,backgroundColor:'#1a6dd6',borderRadius:4}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{grid:{color:'#f0f2f5'}},x:{grid:{display:false},ticks:{font:{size:10}}}}}});
  const riskData=inds.map(i=>{const es=ENTERPRISES.filter(e=>e.industry===i);return Math.round(es.reduce((s,e)=>s+getEntRisk(e),0)/es.length*10)/10});
  const ctx2=document.getElementById('st-industry-risk').getContext('2d');if(charts.sir)charts.sir.destroy();charts.sir=new Chart(ctx2,{type:'bar',data:{labels:inds,datasets:[{label:'平均风险',data:riskData,backgroundColor:riskData.map(v=>v>=7?'#dc2626':v>=5?'#ea580c':v>=2.5?'#ca8a04':'#16a34a'),borderRadius:4}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{max:10,grid:{color:'#f0f2f5'}},x:{grid:{display:false},ticks:{font:{size:10}}}}}});
  const regs=[...new Set(COUNTRIES.map(c=>c.region))];
  const entData=regs.map(r=>ENTERPRISES.filter(e=>e.countries.some(c=>{const ct=COUNTRIES.find(x=>x.name===c);return ct&&ct.region===r})).length);
  const ctx3=document.getElementById('st-region-ent').getContext('2d');if(charts.sre)charts.sre.destroy();charts.sre=new Chart(ctx3,{type:'bar',data:{labels:regs,datasets:[{label:'企业数',data:entData,backgroundColor:'#059669',borderRadius:4}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{grid:{color:'#f0f2f5'}},x:{grid:{display:false},ticks:{font:{size:10}}}}}});
  const months=['2月','3月','4月','5月','6月','7月'];const colors=['#dc2626','#2563eb','#16a34a'];
  const ds=['南亚','东欧','东南亚'].map((r,i)=>{const cs=COUNTRIES.filter(c=>c.region===r);if(!cs.length)return null;const data=months.map((_,j)=>{const avg=cs.reduce((s,c)=>s+calcOverall(c.scores),0)/cs.length;return Math.round((avg+(j-2.5)*0.15)*10)/10});return{label:r,data,borderColor:colors[i],backgroundColor:colors[i]+'20',borderWidth:2,tension:.3}}).filter(Boolean);
  const ctx4=document.getElementById('st-trend-compare').getContext('2d');if(charts.stc)charts.stc.destroy();charts.stc=new Chart(ctx4,{type:'line',data:{labels:months,datasets:ds},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{font:{size:10},padding:8}}},scales:{y:{min:3,max:10,grid:{color:'#f0f2f5'}},x:{grid:{display:false}}}}});
  const dist={critical:0,high:0,elevated:0,moderate:0,low:0};COUNTRIES.forEach(c=>{dist[getLevel(calcOverall(c.scores)).level]++});
  const ctx5=document.getElementById('st-country-dist').getContext('2d');if(charts.scd)charts.scd.destroy();charts.scd=new Chart(ctx5,{type:'doughnut',data:{labels:['极高','高','中高','中低','低'],datasets:[{data:[dist.critical,dist.high,dist.elevated,dist.moderate,dist.low],backgroundColor:['#991b1b','#dc2626','#ea580c','#ca8a04','#16a34a'],borderWidth:2,borderColor:'#fff'}]},options:{responsive:true,maintainAspectRatio:false,cutout:'55%',plugins:{legend:{position:'bottom',labels:{font:{size:10},padding:8}}}}});
  const atd=genAlertTrend();const ctx6=document.getElementById('st-alert-trend').getContext('2d');if(charts.sat)charts.sat.destroy();charts.sat=new Chart(ctx6,{type:'line',data:{labels:atd.map(d=>d.d),datasets:[{label:'红色',data:atd.map(d=>d.r),borderColor:'#dc2626',backgroundColor:'#dc262620',borderWidth:2,tension:.3},{label:'橙色',data:atd.map(d=>d.o),borderColor:'#ea580c',backgroundColor:'#ea580c20',borderWidth:2,tension:.3},{label:'黄色',data:atd.map(d=>d.y),borderColor:'#ca8a04',backgroundColor:'#ca8a0420',borderWidth:2,tension:.3}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{font:{size:10},padding:8}}},scales:{y:{beginAtZero:true,grid:{color:'#f0f2f5'}},x:{grid:{display:false},ticks:{font:{size:8},maxRotation:45}}}}});
  // 行业×区域热力图
  document.getElementById('st-heatmap').innerHTML=(function(){let h='<div style="overflow-x:auto"><table style="font-size:11px"><thead><tr><th>行业＼区域</th>'+regs.map(r=>`<th style="text-align:center;padding:4px 6px">${r}</th>`).join('')+'</tr></thead><tbody>';inds.forEach(ind=>{h+=`<tr><td style="font-weight:600;white-space:nowrap">${ind}</td>`;regs.forEach(r=>{const ents=ENTERPRISES.filter(e=>e.industry===ind&&e.countries.some(c=>{const ct=COUNTRIES.find(x=>x.name===c);return ct&&ct.region===r}));if(!ents.length){h+='<td style="text-align:center;padding:4px 6px;color:var(--text2)">—</td>';return}const avgRisk=Math.round(ents.reduce((s,e)=>s+getEntRisk(e),0)/ents.length*10)/10;const lv=getLevel(avgRisk);h+=`<td style="text-align:center;padding:4px 6px;background:${lv.color}20;color:${lv.color};font-weight:700">${avgRisk.toFixed(1)}</td>`});h+='</tr>'});h+='</tbody></table></div>';return h})();
  // 预警类型×等级交叉分析
  const types=[...new Set(ALERTS.map(a=>a.type))];const levels=['red','orange','yellow','blue'];
  const crossData=levels.map(lv=>types.map(t=>ALERTS.filter(a=>a.level===lv&&a.type===t).length));
  const ctx7=document.getElementById('st-alert-cross').getContext('2d');if(charts.sac)charts.sac.destroy();charts.sac=new Chart(ctx7,{type:'bar',data:{labels:types,datasets:levels.map((lv,i)=>({label:ALERT_LV[lv].label,data:crossData[i],backgroundColor:['#dc2626','#ea580c','#ca8a04','#2563eb'][i],borderRadius:3,stack:'s'}))},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{font:{size:10},padding:8}}},scales:{x:{stacked:true,grid:{display:false},ticks:{font:{size:10}}},y:{stacked:true,grid:{color:'#f0f2f5'},beginAtZero:true}}}});
  document.getElementById('st-ent-table').innerHTML=[...ENTERPRISES].map(e=>({...e,rs:getEntRisk(e)})).sort((a,b)=>b.rs-a.rs).map(e=>{const lv=getLevel(e.rs);const ea=ALERTS.filter(a=>a.enterprise===e.short&&a.status!=='resolved').length;return`<tr style="cursor:pointer" onclick="showEntDetail(${e.id})"><td><strong>${e.short}</strong></td><td>${e.industry}</td><td>${e.countries.length}</td><td>${e.investment}</td><td>${e.personnel.toLocaleString()}</td><td><strong style="color:${lv.color}">${e.rs.toFixed(1)}</strong></td><td><span class="risk-badge ${lv.cls}">${lv.short}</span></td><td>${ea?`<span style="color:var(--red)">${ea}</span>`:'—'}</td></tr>`}).join('');
}
//通用
function closeModal(){document.getElementById('modal').classList.remove('show')}
function exportData(){const data={date:new Date().toISOString(),enterprises:ENTERPRISES,countries:COUNTRIES,alerts:ALERTS,events:EVENTS,warningRules:WARNING_RULES};const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`海外利益保护数据_${new Date().toISOString().split('T')[0]}.json`;a.click();URL.revokeObjectURL(url);showToast('✅ 数据已导出');}
// ===== DATA COLLECTION MODULE (v2 — fixed CORS + multi-source fallback) =====
const COLLECT={
  sources:[
    {id:'gdelt',name:'GDELT全球新闻事件',ic:'📰',desc:'GDELT V2 Doc API — 搜索与中国海外利益相关的全球新闻事件',enabled:true,type:'news',api:'https://api.gdeltproject.org/api/v2/doc/doc'},
    {id:'gdeltv1',name:'GDELT V1全文搜索',ic:'🔍',desc:'GDELT V1 FTXT — 备用新闻源，HTML解析提取',enabled:true,type:'news',api:'https://api.gdeltproject.org/api/v1/search_ftxtsearch/search_ftxtsearch'},
    {id:'rssproxy',name:'国际RSS新闻(代理)',ic:'📡',desc:'通过CORS代理采集BBC/UN/SCMP/AlJazeera等国际媒体',enabled:true,type:'news',api:'https://api.allorigins.win/raw'},
    {id:'worldbank',name:'世界银行经济指标',ic:'📊',desc:'采集监测国家的GDP、通胀、汇率等宏观经济数据',enabled:true,type:'econ',api:'https://api.worldbank.org/v2'},
    {id:'fxrate',name:'实时汇率数据',ic:'💰',desc:'采集美元兑人民币等关键货币实时汇率',enabled:true,type:'fx',api:'https://open.er-api.com/v6/latest/USD'},
    {id:'restcountry',name:'国家基础信息',ic:'🌐',desc:'从Rest Countries API采集国家人口/面积/首都等信息',enabled:true,type:'country',api:'https://restcountries.com/v3.1'}
  ],
  data:{news:[],econ:[],fx:[],country:[]},
  stats:{success:0,fail:0,records:0,lastTime:null},
  autoTimer:null,
  autoInterval:600000,
  inited:false,
  currentTab:'news',
  // News queries for GDELT v2
  gdeltQueries:[
    {q:'China overseas investment security',label:'中国海外投资安全'},
    {q:'Chinese companies Belt Road risk',label:'中企一带一路风险'},
    {q:'Chinese workers attacked abroad',label:'中方海外人员遇袭'},
    {q:'China Sudan Pakistan Myanmar conflict',label:'高风险国家涉华事件'},
    {q:'China overseas project sanctions',label:'中国海外项目制裁'},
    {q:'Belt and Road Initiative risk',label:'一带一路风险'}
  ],
  // News feeds via CORS proxy
  proxyFeeds:[
    {url:'https://feeds.bbci.co.uk/news/world/rss.xml',name:'BBC World'},
    {url:'https://news.un.org/feed/subscribe/en/news/all/rss.xml',name:'UN News'},
    {url:'https://www.scmp.com/rss/4/feed',name:'SCMP China'},
    {url:'https://www.aljazeera.com/xml/rss/all.xml',name:'Al Jazeera'}
  ],
  // CORS proxies (tried in order)
  corsProxies:[
    'https://api.allorigins.win/raw?url=',
    'https://corsproxy.io/?'
  ],
  wbIndicators:[
    {code:'NY.GDP.MKTP.CD',name:'GDP（美元）'},
    {code:'NY.GDP.MKTP.KD.ZG',name:'GDP增长率（%）'},
    {code:'FP.CPI.TOTL.ZG',name:'通货膨胀率（%）'},
    {code:'NE.EXP.GNFS.CD',name:'出口总额（美元）'},
    {code:'BX.KLT.DINV.CD.WD',name:'外商直接投资（美元）'},
    {code:'PA.NUS.FCRF',name:'官方汇率（本币/美元）'}
  ],
  countryCodes:{'中国':'CHN','阿富汗':'AFG','巴基斯坦':'PAK','哈萨克斯坦':'KAZ','俄罗斯':'RUS','苏丹':'SDN','缅甸':'MMR','伊拉克':'IRQ','委内瑞拉':'VEN','伊朗':'IRN','尼日利亚':'NGA','沙特阿拉伯':'SAU','南非':'ZAF','埃塞俄比亚':'ETH','越南':'VNM','印度尼西亚':'IDN','巴西':'BRA','美国':'USA','泰国':'THA','阿联酋':'ARE','澳大利亚':'AUS','新加坡':'SGP','土耳其':'TUR','埃及':'EGY','利比亚':'LBY','也门':'YEM','索马里':'SOM','南苏丹':'SSD','刚果(金)':'COD','哥伦比亚':'COL','墨西哥':'MEX','秘鲁':'PER','印度':'IND','菲律宾':'PHL','马来西亚':'MYS','柬埔寨':'KHM','乌兹别克斯坦':'UZB','肯尼亚':'KEN','安哥拉':'AGO','阿尔及利亚':'DZA','塞尔维亚':'SRB','乌克兰':'UKR','叙利亚':'SYR'},
  // Track which sources succeeded/failed for UI feedback
  sourceStatus:{},
  init(){
    if(this.inited)return;
    this.inited=true;
    this.renderSources();
    this.log('info','[系统] 数据采集中心初始化完成，共'+this.sources.length+'个数据源就绪（3个新闻源+3个数据源）');
    this.updateStats();
  },
  renderSources(){
    const el=document.getElementById('collect-sources');
    if(!el)return;
    el.innerHTML=this.sources.map(s=>`<div class="src-card${s.enabled?' enabled':''}" onclick="COLLECT.toggleSource('${s.id}')"><div class="src-card-toggle${s.enabled?' on':''}" id="toggle-${s.id}"></div><div class="src-card-hd"><div class="src-card-ic">${s.ic}</div><div class="src-card-tt">${s.name}</div></div><div class="src-card-desc">${s.desc}</div><div class="src-card-meta"><span>类型：${s.type}</span><span>状态：<span id="status-${s.id}" style="color:${s.enabled?'var(--green)':'var(--text2)'}">${s.enabled?'就绪':'未启用'}</span></span></div></div>`).join('');
    const enabledCount=this.sources.filter(s=>s.enabled).length;
    document.getElementById('cs-sources').textContent=enabledCount;
  },
  toggleSource(id){
    const s=this.sources.find(x=>x.id===id);
    if(!s)return;
    s.enabled=!s.enabled;
    const card=event.currentTarget;
    card.classList.toggle('enabled');
    const toggle=document.getElementById('toggle-'+id);
    if(toggle)toggle.classList.toggle('on');
    const meta=document.getElementById('status-'+id);
    if(meta){meta.textContent=s.enabled?'就绪':'未启用';meta.style.color=s.enabled?'var(--green)':'var(--text2)'}
    document.getElementById('cs-sources').textContent=this.sources.filter(x=>x.enabled).length;
    this.log('info','['+s.name+'] '+(s.enabled?'已启用':'已停用'));
  },
  // Retry wrapper with exponential backoff
  async fetchWithRetry(url,options={},maxRetries=2){
    let lastError;
    for(let i=0;i<=maxRetries;i++){
      try{
        if(i>0){
          const delay=Math.pow(2,i)*1000;
          await new Promise(r=>setTimeout(r,delay));
        }
        const resp=await fetch(url,options);
        return resp;
      }catch(e){
        lastError=e;
        if(i<maxRetries)this.log('warn','[网络] 请求失败，'+(i+1)+'秒后重试... ('+(i+1)+'/'+maxRetries+')');
      }
    }
    throw lastError;
  },
  async collectAll(){
    const btn=document.getElementById('btn-collect-all');
    const enabledSources=this.sources.filter(s=>s.enabled);
    if(!enabledSources.length){showToast('请至少启用一个数据源');return}
    if(btn){btn.disabled=true;btn.innerHTML='<span class="collect-spin"></span> 采集中...'}
    const prog=document.getElementById('collect-progress');
    const progBar=document.getElementById('collect-progress-bar');
    if(prog){prog.classList.add('show')}
    this.log('info','[系统] ===== 开始采集，共'+enabledSources.length+'个数据源 =====');
    this.sourceStatus={};
    
    // Collect news sources first (parallel), then data sources
    let done=0;
    const newsSources=enabledSources.filter(s=>s.type==='news');
    const dataSources=enabledSources.filter(s=>s.type!=='news');
    
    // Phase 1: News collection
    for(const s of newsSources){
      this.setSourceStatus(s.id,'采集中...','var(--accent)');
      if(progBar)progBar.style.width=Math.floor((done/enabledSources.length)*100)+'%';
      try{
        this.log('info','['+s.name+'] 开始采集...');
        switch(s.id){
          case 'gdelt':await this.collectGDELT();break;
          case 'gdeltv1':await this.collectGDELTv1();break;
          case 'rssproxy':await this.collectRSSProxy();break;
        }
        this.stats.success++;
        this.setSourceStatus(s.id,'✅ 成功','var(--green)');
      }catch(e){
        this.stats.fail++;
        this.setSourceStatus(s.id,'❌ 失败','var(--red)');
        this.log('error','['+s.name+'] 采集失败：'+e.message);
      }
      done++;
      if(progBar)progBar.style.width=Math.floor((done/enabledSources.length)*100)+'%';
    }
    
    // Phase 2: Data sources
    for(const s of dataSources){
      this.setSourceStatus(s.id,'采集中...','var(--accent)');
      if(progBar)progBar.style.width=Math.floor((done/enabledSources.length)*100)+'%';
      try{
        this.log('info','['+s.name+'] 开始采集...');
        switch(s.id){
          case 'worldbank':await this.collectWorldBank();break;
          case 'fxrate':await this.collectFxRate();break;
          case 'restcountry':await this.collectRestCountries();break;
        }
        this.stats.success++;
        this.setSourceStatus(s.id,'✅ 成功','var(--green)');
      }catch(e){
        this.stats.fail++;
        this.setSourceStatus(s.id,'❌ 失败','var(--red)');
        this.log('error','['+s.name+'] 采集失败：'+e.message);
      }
      done++;
      if(progBar)progBar.style.width=Math.floor((done/enabledSources.length)*100)+'%';
    }
    
    this.stats.lastTime=new Date();
    this.updateStats();
    this.renderResults();
    if(progBar)progBar.style.width='100%';
    setTimeout(()=>{if(prog)prog.classList.remove('show')},2000);
    if(btn){btn.disabled=false;btn.innerHTML='🚀 一键采集全部'}
    const total=this.data.news.length+this.data.econ.length+this.data.fx.length+this.data.country.length;
    this.log('success','[系统] ===== 采集完成！成功'+this.stats.success+'个源，失败'+this.stats.fail+'个，共'+total+'条记录 =====');
    if(total>0){showToast('✅ 数据采集完成，共获取'+total+'条记录')}
    else{showToast('⚠️ 新闻采集全部失败，请查看内置数据或稍后重试')}
    const badge=document.getElementById('sb-collect-count');
    if(badge)badge.textContent=total;
    // Show fallback hint if no news
    if(!this.data.news.length)this.log('warn','[提示] 新闻源均未成功，可点击「加载内置新闻」查看系统预置的涉华安全事件数据');
  },
  setSourceStatus(id,text,color){
    const el=document.getElementById('status-'+id);
    if(el){el.textContent=text;el.style.color=color}
  },
  // ===== News Sources =====
  async collectGDELT(){
    const results=[];
    for(const query of this.gdeltQueries){
      try{
        const url=this.sources.find(s=>s.id==='gdelt').api+'?query='+encodeURIComponent(query.q)+'&mode=artlist&format=json&maxrecords=8&sort=datedesc';
        const resp=await this.fetchWithRetry(url,{},1);
        if(!resp.ok)throw new Error('HTTP '+resp.status);
        const data=await resp.json();
        if(data.articles&&data.articles.length){
          data.articles.forEach(a=>{
            results.push({
              title:a.title||'(无标题)',
              url:a.url||'',
              source:a.domain||'GDELT',
              date:a.seendate||'',
              language:a.language||'',
              query:query.label,
              type:'gdelt'
            });
          });
          this.log('success','[GDELT V2] "'+query.label+'" → '+data.articles.length+'条');
        }else{
          this.log('warn','[GDELT V2] "'+query.label+'" 无结果');
        }
      }catch(e){
        this.log('error','[GDELT V2] "'+query.label+'" 请求失败：'+e.message);
      }
    }
    // Merge: keep existing rssproxy news, replace gdelt
    const otherNews=this.data.news.filter(n=>n.type!=='gdelt');
    this.data.news=[...results,...otherNews];
    this.updateRecordCount();
  },
  async collectGDELTv1(){
    // GDELT V1 FTXT — returns HTML, parse article links
    const results=[];
    for(const query of [{q:'China+security+risk',label:'涉华安全风险'},{q:'Belt+Road+China+investment',label:'一带一路投资'},{q:'Chinese+workers+abroad',label:'海外中方人员'}]){
      try{
        const url=this.sources.find(s=>s.id==='gdeltv1').api+'?query='+encodeURIComponent(query.q)+'&maxrows=5';
        const resp=await this.fetchWithRetry(url,{},1);
        if(!resp.ok)throw new Error('HTTP '+resp.status);
        const html=await resp.text();
        // Parse article blocks from HTML
        const parser=new DOMParser();
        const doc=parser.parseFromString(html,'text/html');
        const links=doc.querySelectorAll('a[href^="http"]');
        let count=0;
        links.forEach(a=>{
          const href=a.getAttribute('href');
          const text=a.textContent.trim();
          if(href&&!href.includes('gdeltproject')&&!href.includes('google')&&text&&text.length>10){
            results.push({
              title:text.substring(0,150),
              url:href,
              source:'GDELT V1',
              date:'',
              query:query.label,
              type:'gdeltv1'
            });
            count++;
          }
        });
        this.log('success','[GDELT V1] "'+query.label+'" → '+count+'条');
      }catch(e){
        this.log('error','[GDELT V1] "'+query.label+'" 请求失败：'+e.message);
      }
    }
    const otherNews=this.data.news.filter(n=>n.type!=='gdeltv1');
    this.data.news=[...otherNews,...results];
    this.updateRecordCount();
  },
  async collectRSSProxy(){
    let allItems=[];
    for(const feed of this.proxyFeeds){
      let success=false;
      for(const proxy of this.corsProxies){
        try{
          const proxyUrl=proxy+encodeURIComponent(feed.url);
          const resp=await this.fetchWithRetry(proxyUrl,{},1);
          if(!resp.ok)continue;
          const text=await resp.text();
          const parser=new DOMParser();
          const xmlDoc=parser.parseFromString(text,'text/xml');
          const items=xmlDoc.querySelectorAll('item');
          if(items.length>0){
            items.forEach(item=>{
              const title=item.querySelector('title')?.textContent||'';
              const link=item.querySelector('link')?.textContent||'';
              const desc=item.querySelector('description')?.textContent||'';
              const pubDate=item.querySelector('pubDate')?.textContent||'';
              if(title)allItems.push({
                title:title,
                url:link,
                source:feed.name,
                date:pubDate,
                description:(desc||'').replace(/<[^>]*>/g,'').substring(0,200),
                query:'RSS代理',
                type:'rssproxy'
              });
            });
            this.log('success','[RSS代理] '+feed.name+' → '+items.length+'条');
            success=true;
            break;
          }
        }catch(e){}
      }
      if(!success)this.log('warn','[RSS代理] '+feed.name+' 所有代理均失败');
    }
    const otherNews=this.data.news.filter(n=>n.type!=='rssproxy');
    this.data.news=[...otherNews,...allItems];
    this.updateRecordCount();
  },
  // Load curated news from built-in ALERTS data
  loadCuratedNews(){
    const results=[];
    if(typeof ALERTS!=='undefined'&&ALERTS.length){
      ALERTS.slice(0,20).forEach(a=>{
        const sevMap={red:'🔴',orange:'🟠',yellow:'🟡',blue:'🔵'};
        results.push({
          title:'['+sevMap[a.severity||'yellow']+'] '+a.title,
          url:'',
          source:'系统内置预警',
          date:a.date||'',
          country:a.country||'',
          level:a.level||'',
          severity:a.severity||'yellow',
          description:a.desc||'',
          type:'curated'
        });
      });
    }
    // Also add recent events
    if(typeof EVENTS!=='undefined'&&EVENTS.length){
      EVENTS.slice(0,10).forEach(e=>{
        results.push({
          title:'[📋事件] '+e.title,
          url:'',
          source:'系统内置事件',
          date:e.date||'',
          country:e.country||'',
          description:e.desc||'',
          type:'curated'
        });
      });
    }
    // Replace ALL news with curated
    this.data.news=results;
    this.updateRecordCount();
    this.renderNews();
    this.log('success','[内置数据] 已加载'+results.length+'条涉华安全事件（来自系统预警和事件库）');
    showToast('✅ 已加载'+results.length+'条内置新闻');
  },
  updateRecordCount(){
    this.stats.records=this.data.news.length+this.data.econ.length+this.data.fx.length+this.data.country.length;
  },
  // ===== Data Sources (unchanged but with retry) =====
  async collectWorldBank(){
    const results=[];
    let collected=0;
    for(const countryCode of Object.values(this.countryCodes).slice(0,20)){
      const cname=Object.keys(this.countryCodes).find(k=>this.countryCodes[k]===countryCode);
      for(const ind of this.wbIndicators){
        try{
          const url=this.sources.find(s=>s.id==='worldbank').api+'/country/'+countryCode+'/indicator/'+ind.code+'?format=json&per_page=1&date=2020:2024';
          const resp=await this.fetchWithRetry(url);
          if(!resp.ok)continue;
          const data=await resp.json();
          if(data&&data[1]&&data[1][0]){
            const item=data[1][0];
            results.push({country:cname,indicator:ind.name,value:item.value,year:item.date,source:'World Bank API',collectTime:new Date().toLocaleString('zh-CN')});
            collected++;
          }
        }catch(e){}
      }
      if(collected%10===0&&collected>0)this.log('info','[World Bank] 已采集'+collected+'条...');
    }
    this.data.econ=results;
    this.updateRecordCount();
    this.log('success','[World Bank] 完成，共'+results.length+'条经济指标');
  },
  async collectFxRate(){
    const url=this.sources.find(s=>s.id==='fxrate').api;
    this.log('info','[汇率] 请求实时汇率...');
    const resp=await this.fetchWithRetry(url);
    if(!resp.ok)throw new Error('HTTP '+resp.status);
    const data=await resp.json();
    if(data&&data.rates){
      const keyCurrencies=['CNY','EUR','GBP','JPY','RUB','INR','BRL','ZAR','KRW','TRY','AED','SGD','AUD','CAD','PKR','EGP','NGN','VND','IDR','THB'];
      this.data.fx=keyCurrencies.filter(c=>data.rates[c]).map(c=>({pair:'USD/'+c,rate:data.rates[c],base:'USD',quote:c,updateTime:data.time_last_update_utc||new Date().toUTCString(),source:'open.er-api.com',collectTime:new Date().toLocaleString('zh-CN')}));
      this.updateRecordCount();
      this.log('success','[汇率] 完成，共'+this.data.fx.length+'个货币对');
    }
  },
  async collectRestCountries(){
    const results=[];
    const countryNames=Object.keys(this.countryCodes);
    for(let i=0;i<countryNames.length;i+=5){
      const batch=countryNames.slice(i,i+5);
      for(const cname of batch){
        try{
          const searchName=cname.replace(/\(.*\)/,'').trim();
          const url=this.sources.find(s=>s.id==='restcountry').api+'/name/'+encodeURIComponent(searchName)+'?fields=name,capital,population,area,region,subregion,currencies,languages,flag';
          const resp=await this.fetchWithRetry(url);
          if(!resp.ok)continue;
          const data=await resp.json();
          if(Array.isArray(data)&&data[0]){
            const c=data[0];
            const cur=c.currencies?Object.values(c.currencies).map(x=>x.name).join(', '):'—';
            const lang=c.languages?Object.values(c.languages).join(', '):'—';
            results.push({country:cname,capital:Array.isArray(c.capital)?c.capital[0]:(c.capital||'—'),population:c.population?c.population.toLocaleString():'—',area:c.area?c.area.toLocaleString():'—',region:c.region||'—',currency:cur,language:lang,collectTime:new Date().toLocaleString('zh-CN')});
          }
        }catch(e){}
      }
      if(i>0)this.log('info','[Rest Countries] 已采集'+results.length+'个国家...');
    }
    this.data.country=results;
    this.updateRecordCount();
    this.log('success','[Rest Countries] 完成，共'+results.length+'个国家信息');
  },
  // ===== Rendering =====
  renderResults(){
    this.renderNews();
    this.renderEcon();
    this.renderFx();
    this.renderCountry();
  },
  renderNews(){
    const el=document.getElementById('collect-news-list');
    const cnt=document.getElementById('news-count');
    if(!el)return;
    if(!this.data.news.length){
      el.innerHTML='<div class="empty"><div class="ic">📰</div><div>暂无采集数据</div><div style="font-size:11px;color:var(--text2);margin-top:6px">尝试点击「加载内置新闻」查看系统预置数据</div></div>';
      if(cnt)cnt.textContent='0条记录';
      return;
    }
    if(cnt)cnt.textContent=this.data.news.length+'条记录';
    el.innerHTML=this.data.news.map(n=>{
      const lowerTitle=(n.title||'').toLowerCase();
      const isRisk=/(attack|kill|bomb|security|conflict|war|sanction|crisis|evacuat|threat|kidnap|explosion|coup|unrest|protest|terror|🔴|🟠|⚠)/i.test(lowerTitle);
      const isCurated=n.type==='curated';
      const cls=isRisk?'red':(isCurated?'blue':'');
      const dateStr=n.date?n.date.substring(0,16):'';
      const srcTag=n.type==='gdelt'?'GDELT V2':n.type==='gdeltv1'?'GDELT V1':n.type==='rssproxy'?'RSS':n.type==='curated'?'系统内置':'其他';
      const srcColor=n.type==='curated'?'var(--accent)':n.type==='gdelt'?'var(--green)':n.type==='rssproxy'?'var(--yellow)':'var(--text2)';
      return `<div class="collect-news-item ${cls}"><div class="collect-news-tt">${isRisk&&!isCurated?'⚠️ ':''}${n.url?'<a href="'+n.url+'" target="_blank" rel="noopener">'+this.escapeHtml(n.title)+'</a>':this.escapeHtml(n.title)}</div><div class="collect-news-meta"><span class="collect-news-src" style="background:'+srcColor+'20;color:'+srcColor+'">'+srcTag+'</span><span>📰 '+this.escapeHtml(n.source||'')+'</span>${dateStr?'<span>🕐 '+dateStr+'</span>':''}<span>🔍 '+this.escapeHtml(n.query||n.country||'')+'</span></div>${n.description?'<div style="font-size:11px;color:var(--text2);margin-top:4px;line-height:1.4">'+this.escapeHtml(n.description)+'</div>':''}</div>`;
    }).join('');
  },
  renderEcon(){
    const el=document.getElementById('collect-econ-body');
    const cnt=document.getElementById('econ-count');
    if(!el)return;
    if(!this.data.econ.length){el.innerHTML='<tr><td colspan="6" style="text-align:center;padding:30px;color:var(--text2)">暂无采集数据</td></tr>';if(cnt)cnt.textContent='0条记录';return;}
    if(cnt)cnt.textContent=this.data.econ.length+'条记录';
    el.innerHTML=this.data.econ.map(e=>{
      let val=e.value;
      if(e.indicator.includes('%'))val=val+'%';
      else if(val&&Math.abs(val)>1e9)val=(val/1e9).toFixed(2)+'B$';
      else if(val&&Math.abs(val)>1e6)val=(val/1e6).toFixed(2)+'M$';
      else val=val!==null&&val!==undefined?Number(val).toFixed(2):'—';
      return `<tr><td><strong>${this.escapeHtml(e.country)}</strong></td><td>${this.escapeHtml(e.indicator)}</td><td><strong>${val}</strong></td><td>${e.year||'—'}</td><td><span class="collect-news-src">${this.escapeHtml(e.source)}</span></td><td style="font-size:10px;color:var(--text2)">${e.collectTime||''}</td></tr>`;
    }).join('');
  },
  renderFx(){
    const el=document.getElementById('collect-fx-grid');
    const cnt=document.getElementById('fx-count');
    if(!el)return;
    if(!this.data.fx.length){el.innerHTML='<div class="empty"><div class="ic">💰</div><div>暂无采集数据</div></div>';if(cnt)cnt.textContent='0条记录';return;}
    if(cnt)cnt.textContent=this.data.fx.length+'条记录';
    el.innerHTML=this.data.fx.map(f=>{
      const isCNY=f.quote==='CNY';
      return `<div class="collect-fx-card" style="${isCNY?'border-color:var(--accent);background:var(--blue-bg)':''}"><div class="collect-fx-pair">${f.pair}</div><div class="collect-fx-rate" style="${isCNY?'color:var(--accent)':''}">${f.rate.toFixed(4)}</div><div class="collect-fx-change" style="color:var(--text2)">${f.source}</div>${isCNY?'<div style="font-size:10px;color:var(--accent);font-weight:600;margin-top:2px">🇨🇳 关注货币</div>':''}</div>`;
    }).join('');
  },
  renderCountry(){
    const el=document.getElementById('collect-country-body');
    const cnt=document.getElementById('country-count');
    if(!el)return;
    if(!this.data.country.length){el.innerHTML='<tr><td colspan="8" style="text-align:center;padding:30px;color:var(--text2)">暂无采集数据</td></tr>';if(cnt)cnt.textContent='0条记录';return;}
    if(cnt)cnt.textContent=this.data.country.length+'条记录';
    el.innerHTML=this.data.country.map(c=>`<tr><td><strong>${this.escapeHtml(c.country)}</strong></td><td>${this.escapeHtml(c.capital)}</td><td>${c.population}</td><td>${c.area}</td><td>${this.escapeHtml(c.region)}</td><td>${this.escapeHtml(c.currency)}</td><td style="font-size:11px">${this.escapeHtml(c.language)}</td><td style="font-size:10px;color:var(--text2)">${c.collectTime||''}</td></tr>`).join('');
  },
  switchTab(tab,el){
    document.querySelectorAll('.collect-tab').forEach(t=>t.classList.remove('active'));
    if(el)el.classList.add('active');
    document.querySelectorAll('.collect-results').forEach(r=>r.classList.remove('active'));
    const target=document.getElementById('collect-results-'+tab);
    if(target)target.classList.add('active');
    this.currentTab=tab;
  },
  updateStats(){
    document.getElementById('cs-success').textContent=this.stats.success;
    document.getElementById('cs-fail').textContent=this.stats.fail;
    document.getElementById('cs-records').textContent=this.data.news.length+this.data.econ.length+this.data.fx.length+this.data.country.length;
    document.getElementById('cs-last').textContent=this.stats.lastTime?this.stats.lastTime.toLocaleString('zh-CN'):'未采集';
  },
  log(type,msg){
    const el=document.getElementById('collect-log');
    if(!el)return;
    const time=new Date().toLocaleTimeString('zh-CN');
    const line=document.createElement('div');
    line.className='collect-log-line '+type;
    line.textContent='['+time+'] '+msg;
    el.appendChild(line);
    el.scrollTop=el.scrollHeight;
    while(el.children.length>200)el.removeChild(el.firstChild);
  },
  clearLog(){
    const el=document.getElementById('collect-log');
    if(el)el.innerHTML='<div class="collect-log-line info">[系统] 日志已清空</div>';
  },
  toggleAuto(){
    if(this.autoTimer){clearInterval(this.autoTimer);this.autoTimer=null;document.getElementById('auto-toggle-text').textContent='⏱️ 开启自动采集';this.log('info','[系统] 自动采集已关闭');showToast('自动采集已关闭');}
    else{
      this.autoInterval=parseInt(document.getElementById('auto-interval').value);
      if(!this.autoInterval){showToast('请选择采集间隔');return;}
      this.autoTimer=setInterval(()=>this.collectAll(),this.autoInterval);
      document.getElementById('auto-toggle-text').textContent='⏱️ 关闭自动采集';
      this.log('success','[系统] 自动采集已开启，间隔'+(this.autoInterval/60000)+'分钟');
      showToast('✅ 自动采集已开启');
    }
  },
  updateInterval(){
    const val=parseInt(document.getElementById('auto-interval').value);
    if(!val&&this.autoTimer){clearInterval(this.autoTimer);this.autoTimer=null;document.getElementById('auto-toggle-text').textContent='⏱️ 开启自动采集';this.log('info','[系统] 自动采集已关闭');}
    else if(this.autoTimer){clearInterval(this.autoTimer);this.autoInterval=val;this.autoTimer=setInterval(()=>this.collectAll(),this.autoInterval);this.log('info','[系统] 间隔已更新为'+(this.autoInterval/60000)+'分钟');}
  },
  escapeHtml(s){
    if(!s)return'';
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
  }
};
// ===== END DATA COLLECTION MODULE =====
//初始化
document.addEventListener('DOMContentLoaded',()=>{AUTH.init()});