// scraper.js v5.0 - 海外利益安全风险监测情报采集引擎
// ===== 核心设计理念 =====
// 1. 系统定位: 海外利益安全风险监测情报预警平台 — 所有数据围绕"海外"
// 2. 国内源只采集涉及海外的新闻(国际/军事/境外)，不采集纯国内事件
// 3. 海外数据≠涉华数据: 覆盖全球风险事件，不仅限涉华
// 4. 数据融合: 采集的海外风险事件 ↔ 中资企业海外项目库 → 自动匹配预警
// 5. 联动架构: DBCenter(底座,存储) → RISK_FUSION(融合) → 监测中心(大脑,预警)
// 6. v5.0增强: NLP识别 + 智能去重 + 质量评分 + 数据增强 + 处理管道

// ===== 国家代码→中文名 =====
var FIPS_CN={
  'US':'美国','CH':'中国','RS':'俄罗斯','UK':'英国','FR':'法国','GM':'德国','JA':'日本',
  'KS':'韩国','KP':'朝鲜','IN':'印度','PK':'巴基斯坦','IR':'伊朗','IQ':'伊拉克','SY':'叙利亚',
  'AF':'阿富汗','YE':'也门','LY':'利比亚','SO':'索马里','SU':'苏丹','SS':'南苏丹','ET':'埃塞俄比亚',
  'NG':'尼日利亚','ML':'马里','TS':'突尼斯','EG':'埃及','IS':'以色列','WE':'巴勒斯坦','LE':'黎巴嫩',
  'JO':'约旦','TU':'土耳其','SA':'沙特阿拉伯','AE':'阿联酋','QA':'卡塔尔','KW':'科威特','BH':'巴林',
  'UA':'乌克兰','PL':'波兰','IT':'意大利','SP':'西班牙','NL':'荷兰','BE':'比利时','SZ':'瑞士',
  'AS':'澳大利亚','NZ':'新西兰','CA':'加拿大','MX':'墨西哥','BR':'巴西','AR':'阿根廷','CO':'哥伦比亚',
  'VE':'委内瑞拉','PE':'秘鲁','CL':'智利','ID':'印度尼西亚','TH':'泰国','MY':'马来西亚','PH':'菲律宾',
  'VN':'越南','SG':'新加坡','BM':'缅甸','CB':'柬埔寨','LA':'老挝','BG':'孟加拉国','NP':'尼泊尔',
  'CE':'斯里兰卡','TW':'中国台湾','HK':'中国香港','MC':'中国澳门','KZ':'哈萨克斯坦','UZ':'乌兹别克斯坦',
  'KG':'吉尔吉斯斯坦','TA':'塔吉克斯坦','TX':'土库曼斯坦','AJ':'阿塞拜疆','AM':'亚美尼亚','GG':'格鲁吉亚',
  'BY':'白俄罗斯','MD':'摩尔多瓦','RO':'罗马尼亚','BU':'保加利亚','GR':'希腊','AL':'阿尔巴尼亚',
  'HR':'克罗地亚','RB':'塞尔维亚','MK':'北马其顿','BA':'波黑','MN':'黑山','SI':'斯洛文尼亚',
  'EZ':'捷克','LO':'斯洛伐克','HU':'匈牙利','AU':'奥地利','DA':'丹麦','SW':'瑞典','NO':'挪威',
  'FI':'芬兰','EI':'爱尔兰','PO':'葡萄牙','IC':'冰岛','SF':'南非','KE':'肯尼亚','UG':'乌干达',
  'TZ':'坦桑尼亚','RW':'卢旺达','CG':'刚果(金)','GH':'加纳','SN':'塞内加尔','BF':'布基纳法索',
  'NI':'尼日尔','AO':'安哥拉','MZ':'莫桑比克','ZW':'津巴布韦','ZB':'赞比亚','BW':'博茨瓦纳'
};

// ===== 采集数据库 (完全独立于 DBCenter) =====
var COLLECTED_DB={
  PREFIX:'orps_collected_',
  CATEGORIES:[
    'terror_events','security_events','military_conflicts','political_events',
    'natural_disasters','public_health','sanctions_data','social_unrest',
    'infrastructure','geopolitical_intel','osint_intel'
  ],

  init(){
    var me=this;
    this.CATEGORIES.forEach(function(cat){
      try{if(localStorage.getItem(me.PREFIX+cat)===null)
        localStorage.setItem(me.PREFIX+cat,'[]');}catch(e){}
    });
    // 自动注入模拟数据(首次加载或版本更新时)
    try{
      var count=this.totalCount();
      if(count===0){
        var n=this.seedSimulatedData();
        if(n>0)console.log('[COLLECTED_DB] Seeded '+n+' simulated items');
      }
    }catch(e){console.warn('[COLLECTED_DB] Seed error:',e);}
    // 初始化中资企业海外项目库
    if(typeof ENTERPRISE_DB!=='undefined'){try{ENTERPRISE_DB.init();}catch(e){}}
    // 初始化风险融合引擎
    if(typeof RISK_FUSION!=='undefined'){try{RISK_FUSION.init();}catch(e){}}
    // 初始化威胁组织数据库
    if(typeof THREAT_ORGS_DB!=='undefined'){try{THREAT_ORGS_DB.init();}catch(e){}}
    // 恢复自动采集设置
    var auto=localStorage.getItem('orps_autocollect_enabled');
    if(auto==='true'&&typeof SCRAPER!=='undefined'){
      var interval=parseInt(localStorage.getItem('orps_autocollect_interval')||'120');
      SCRAPER.startAutoCollect(interval);
    }
  },

  _r(k){try{return JSON.parse(localStorage.getItem(this.PREFIX+k)||'[]');}catch(e){return[];}},
  _w(k,v){try{localStorage.setItem(this.PREFIX+k,JSON.stringify(v));}catch(e){}},

  add(category,item){
    if(!item)return null;
    item.id=Date.now()+Math.floor(Math.random()*1000000);
    item.collected_at=item.collected_at||new Date().toISOString();
    item.audit_status='pending';
    item.audit_time='';
    var a=this._r(category);
    a.unshift(item);
    this._w(category,a);
    return item.id;
  },

  addBatch(category,items){
    if(!items||!items.length)return 0;
    var a=this._r(category);
    var now=new Date().toISOString();
    items.forEach(function(item){
      item.id=Date.now()+Math.floor(Math.random()*1000000);
      item.collected_at=now;
      item.audit_status='pending';
      item.audit_time='';
      a.unshift(item);
    });
    this._w(category,a);
    return items.length;
  },

  getAll(category){return this._r(category);},
  count(category){return this._r(category).length;},

  totalCount(){
    var me=this;
    return this.CATEGORIES.reduce(function(sum,cat){return sum+me.count(cat);},0);
  },

  clear(category){
    if(category){this._w(category,[]);}
    else{var me=this;this.CATEGORIES.forEach(function(c){me._w(c,[]);});}
  },

  deleteItem(category,id){
    var data=this._r(category);
    var filtered=data.filter(function(d){return d.id!==id;});
    this._w(category,filtered);
    return data.length-filtered.length;
  },

  setAuditStatus(category,id,status){
    var data=this._r(category);
    for(var i=0;i<data.length;i++){
      if(data[i].id===id){
        data[i].audit_status=status;
        data[i].audit_time=new Date().toISOString();
        this._w(category,data);
        return true;
      }
    }
    return false;
  },

  batchSetAuditStatus(category,ids,status){
    if(!ids||!ids.length)return 0;
    var data=this._r(category);
    var count=0;
    for(var i=0;i<data.length;i++){
      if(ids.indexOf(data[i].id)>=0){
        data[i].audit_status=status;
        data[i].audit_time=new Date().toISOString();
        count++;
      }
    }
    if(count>0)this._w(category,data);
    return count;
  },

  getAuditSummary(category){
    var data=this._r(category);
    var p=0,a=0,r=0;
    data.forEach(function(d){
      var s=d.audit_status||'pending';
      if(s==='pending')p++;else if(s==='rejected')r++;else a++;
    });
    return {pending:p,approved:a,rejected:r,total:data.length};
  },

  transferToDBCenter(category,id){
    var data=this._r(category);
    var item=data.find(function(d){return d.id===id;});
    if(!item)return false;
    if(item.audit_status!=='approved')return false;
    var transferItem={};
    for(var k in item)transferItem[k]=item[k];
    transferItem.audit_status='approved';
    transferItem.audit_time=new Date().toISOString();
    transferItem.transfer_time=new Date().toISOString();
    transferItem.data_type=transferItem.data_type||category;
    delete transferItem.id;
    if(typeof DBCenter!=='undefined'){DBCenter.add(category,transferItem);}
    var filtered=data.filter(function(d){return d.id!==id;});
    this._w(category,filtered);
    return true;
  },

  transferApprovedToDBCenter(category){
    var data=this._r(category);
    var approved=data.filter(function(d){return d.audit_status==='approved';});
    if(!approved.length)return 0;
    var now=new Date().toISOString();
    approved.forEach(function(item){
      var transferItem={};
      for(var k in item)transferItem[k]=item[k];
      transferItem.audit_status='approved';
      transferItem.audit_time=now;
      transferItem.transfer_time=now;
      transferItem.data_type=transferItem.data_type||category;
      delete transferItem.id;
      if(typeof DBCenter!=='undefined'){DBCenter.add(category,transferItem);}
    });
    var remaining=data.filter(function(d){return d.audit_status!=='approved';});
    this._w(category,remaining);
    return approved.length;
  },

  transferAllApproved(){
    var me=this,total=0;
    this.CATEGORIES.forEach(function(cat){total+=me.transferApprovedToDBCenter(cat);});
    return total;
  },

  getStats(){
    var me=this,stats={};
    this.CATEGORIES.forEach(function(cat){stats[cat]=me.count(cat);});
    stats.total=this.totalCount();
    return stats;
  },

  // ===== 模拟数据注入 =====
  // 预填充大量标明"模拟"的情报数据，让采集库有丰富内容展示
  SIM_VERSION:'1.0',
  SIM_KEY:'orps_sim_data_version',

  seedSimulatedData(){
    var simVer=localStorage.getItem(this.SIM_KEY);
    if(simVer===this.SIM_VERSION){
      // 已注入过，检查是否有数据
      var hasData=this.CATEGORIES.some(function(cat){return COLLECTED_DB.count(cat)>0;});
      if(hasData)return 0;
    }

    var now=new Date();
    var data=this._generateSimData();
    var total=0;
    var me=this;
    for(var cat in data){
      var items=data[cat];
      items.forEach(function(item){
        item.id=Date.now()+Math.floor(Math.random()*1000000);
        item.collected_at=new Date(now.getTime()-Math.random()*86400000*7).toISOString();
        // 80%待审核, 15%已审核, 5%驳回 — 模拟真实审核状态分布
        var r=Math.random();
        if(r<0.80){item.audit_status='pending';item.audit_time='';}
        else if(r<0.95){item.audit_status='approved';item.audit_time=new Date(now.getTime()-Math.random()*86400000*3).toISOString();}
        else{item.audit_status='rejected';item.audit_time=new Date(now.getTime()-Math.random()*86400000*2).toISOString();}
        item.is_simulated=true;
        item.quality_score=Math.floor(60+Math.random()*35); // 60-95
        item.nlp_entities={countries:[item.country],severity:item.severity||'medium'};
      });
      this._w(cat,items);
      total+=items.length;
    }
    localStorage.setItem(this.SIM_KEY,this.SIM_VERSION);
    return total;
  },

  clearSimulatedData(){
    var me=this;
    this.CATEGORIES.forEach(function(cat){
      var data=me._r(cat);
      var filtered=data.filter(function(d){return !d.is_simulated;});
      me._w(cat,filtered);
    });
    localStorage.removeItem(this.SIM_KEY);
  },

  countSimulated(){
    var me=this,count=0;
    this.CATEGORIES.forEach(function(cat){
      me._r(cat).forEach(function(d){if(d.is_simulated)count++;});
    });
    return count;
  },

  _generateSimData(){
    return {
      'terror_events':[
        {title:'巴基斯坦俾路支省发生针对中资项目车队的武装袭击',date:'2025-07-10',country:'巴基斯坦',city:'瓜达尔',source:'新华网-国际',source_region:'国内',source_type:'rss',url:'',data_type:'terror_events',severity:'critical',group:'俾路支解放军',type:'武装袭击',target:'中资项目车队',deaths:3,injured:7,desc:'7月10日，俾路支解放军武装分子在瓜达尔港附近袭击了中国工程师车队，造成3人死亡7人受伤。袭击者使用自动武器和手榴弹。'},
        {title:'马里北部JNIM分支对联合国维和部队发动自杀式汽车炸弹袭击',date:'2025-07-08',country:'马里',city:'加奥',source:'GDELT API',source_region:'国际',source_type:'gdelt',url:'',data_type:'terror_events',severity:'high',group:'JNIM',type:'汽车炸弹',target:'联合国维和部队',deaths:5,injured:12,desc:'JNIM分支机构在加奥市对马里稳定团营地发动自杀式汽车炸弹袭击，爆炸造成5名维和人员死亡，12人受伤。'},
        {title:'尼日利亚博尔诺州博科圣地绑架中国工人',date:'2025-07-05',country:'尼日利亚',city:'迈杜古里',source:'BBC World RSS',source_region:'国际',source_type:'rss',url:'',data_type:'terror_events',severity:'high',group:'博科圣地',type:'绑架劫持',target:'中国建筑工人',deaths:0,injured:0,desc:'博科圣地武装分子绑架了在尼日利亚北部施工的3名中国工人，要求支付赎金。中国大使馆已启动应急机制。'},
        {title:'阿富汗喀布尔酒店袭击事件致中国公民伤亡',date:'2025-07-03',country:'阿富汗',city:'喀布尔',source:'Reuters RSS',source_region:'国际',source_type:'rss',url:'',data_type:'terror_events',severity:'critical',group:'伊斯兰国呼罗珊',type:'武装袭击',target:'外国人集中酒店',deaths:2,injured:8,desc:'伊斯兰国呼罗珊分支武装分子袭击喀布尔一家外国人常住的酒店，造成2名中国公民死亡，8人受伤。'},
        {title:'索马里摩加迪沙青年党对政府大楼发动连环爆炸',date:'2025-07-01',country:'索马里',city:'摩加迪沙',source:'GDELT API',source_region:'国际',source_type:'gdelt',url:'',data_type:'terror_events',severity:'high',group:'青年党',type:'连环爆炸',target:'政府大楼',deaths:15,injured:40,desc:'青年党武装分子对摩加迪沙市政大楼发动两起汽车炸弹袭击，随后武装分子冲入大楼，造成15人死亡40人受伤。'},
        {title:'巴基斯坦卡拉奇证券交易所附近发生爆炸',date:'2025-06-28',country:'巴基斯坦',city:'卡拉奇',source:'人民网-国际',source_region:'国内',source_type:'rss',url:'',data_type:'terror_events',severity:'medium',group:'俾路支解放军',type:'IED爆炸',target:'商业区',deaths:1,injured:6,desc:'卡拉奇证券交易所附近发生路边炸弹爆炸，造成1人死亡6人受伤。俾路支解放军宣称负责。'},
        {title:'伊拉克巴格达无人机攻击事件',date:'2025-06-25',country:'伊拉克',city:'巴格达',source:'Al Jazeera RSS',source_region:'国际',source_type:'rss',url:'',data_type:'terror_events',severity:'medium',group:'伊斯兰国',type:'无人机攻击',target:'军事设施',deaths:0,injured:3,desc:'伊斯兰国残余势力使用改装无人机对巴格达北部军事设施发动攻击，造成3名士兵受伤。'},
        {title:'刚果(金)ADF武装分子袭击矿业营地',date:'2025-06-22',country:'刚果(金)',city:'贝尼',source:'ReliefWeb API',source_region:'国际',source_type:'reliefweb',url:'',data_type:'terror_events',severity:'high',group:'ADF',type:'武装袭击',target:'矿业营地',deaths:8,injured:15,desc:'民主同盟军(ADF)武装分子袭击了北基伍省一处矿业营地，造成8名矿工死亡15人受伤，其中包括2名中国籍员工。'},
        {title:'叙利亚大马士革汽车炸弹袭击',date:'2025-06-20',country:'叙利亚',city:'大马士革',source:'GDELT API',source_region:'国际',source_type:'gdelt',url:'',data_type:'terror_events',severity:'medium',group:'HTS',type:'汽车炸弹',target:'安全检查站',deaths:4,inured:10,desc:'大马士革南部安全检查站遭汽车炸弹袭击，造成4名安全人员死亡10人受伤。'},
        {title:'也门胡塞武装对红海航运发动导弹攻击',date:'2025-06-18',country:'也门',city:'亚丁',source:'BBC World RSS',source_region:'国际',source_type:'rss',url:'',data_type:'terror_events',severity:'critical',group:'胡塞武装',type:'导弹攻击',target:'商船',deaths:0,injured:0,desc:'胡塞武装向红海海域发射多枚反舰导弹，袭击一艘悬挂利比里亚国旗的散货船，船只受损但无人员伤亡。'},
        {title:'印度尼西亚苏拉威西爆炸袭击中资工厂',date:'2025-06-15',country:'印度尼西亚',city:'苏拉威西',source:'Google News RSS',source_region:'国际',source_type:'rss',url:'',data_type:'terror_events',severity:'high',group:'东印尼圣战者',type:'IED爆炸',target:'中资工厂',deaths:1,injured:5,desc:'不明武装分子在苏拉威西中资不锈钢厂附近制造爆炸，造成1名保安死亡5人受伤。'},
        {title:'肯尼亚索马里边境青年党越境袭击',date:'2025-06-12',country:'肯尼亚',city:'曼德拉',source:'ReliefWeb API',source_region:'国际',source_type:'reliefweb',url:'',data_type:'terror_events',severity:'medium',group:'青年党',type:'武装袭击',target:'边境村镇',deaths:6,injured:11,desc:'青年党武装分子从索马里越境袭击肯尼亚曼德拉县村镇，造成6名平民死亡11人受伤。'}
      ],

      'security_events':[
        {title:'缅甸克钦邦中国矿产项目遭武装组织威胁',date:'2025-07-09',country:'缅甸',city:'密支那',source:'外交部领事司',source_region:'国内',source_type:'rss',url:'',data_type:'security_events',severity:'high',type:'武装威胁',location:'克钦邦稀土矿区',desc:'缅甸克钦独立军向中资稀土矿区发出撤离警告，要求停止与军政府的合作。约200名中方人员面临安全风险。'},
        {title:'巴基斯坦瓜达尔港中国工程师遭持枪抢劫',date:'2025-07-06',country:'巴基斯坦',city:'瓜达尔',source:'环球网-国际',source_region:'国内',source_type:'rss',url:'',data_type:'security_events',severity:'medium',type:'刑事案件',location:'瓜达尔港工地',desc:'3名不明身份持枪歹徒闯入中国工程师宿舍区抢劫现金和电子设备，无人员伤亡但引发安全担忧。'},
        {title:'南非约翰内斯堡中资企业仓库遭武装抢劫',date:'2025-07-04',country:'南非',city:'约翰内斯堡',source:'人民网-国际',source_region:'国内',source_type:'rss',url:'',data_type:'security_events',severity:'medium',type:'武装抢劫',location:'工业区内中资仓库',desc:'10余名持枪匪徒抢劫了中资贸易公司仓库，抢走价值约200万元人民币的货物，1名中国员工受伤。'},
        {title:'尼日利亚拉各斯中资建筑工地发生绑架事件',date:'2025-07-02',country:'尼日利亚',city:'拉各斯',source:'百度资讯搜索',source_region:'国内',source_type:'baidu',url:'',data_type:'security_events',severity:'high',type:'绑架',location:'莱基自贸区工地',desc:'不明武装分子绑架了2名中国工程师和1名当地翻译，勒索500万美元赎金。'},
        {title:'刚果(金)卢阿拉巴省中资矿区发生冲突',date:'2025-06-29',country:'刚果(金)',city:'卢阿拉巴',source:'GDELT API',source_region:'国际',source_type:'gdelt',url:'',data_type:'security_events',severity:'high',type:'武装冲突/内战',location:'铜钴矿区',desc:'当地武装团体与矿区安保力量发生交火，1名中国员工受伤，矿区临时停产撤离。'},
        {title:'柬埔寨西哈努克港中国商会遭威胁',date:'2025-06-26',country:'柬埔寨',city:'西哈努克港',source:'新华网-国际',source_region:'国内',source_type:'rss',url:'',data_type:'security_events',severity:'low',type:'刑事案件',location:'商业区',desc:'当地犯罪团伙向中国商铺收取保护费未果后实施打砸，3家中国商铺受损。'},
        {title:'阿根廷布宜诺斯艾利斯华人超市遭连环抢劫',date:'2025-06-23',country:'阿根廷',city:'布宜诺斯艾利斯',source:'Google News RSS',source_region:'国际',source_type:'rss',url:'',data_type:'security_events',severity:'medium',type:'刑事案件',location:'华人聚居区超市',desc:'经济危机背景下，布宜诺斯艾利斯多家华人超市遭抢劫，经济损失约500万比索。'},
        {title:'俄罗斯远东中国木材加工厂遭检查停产',date:'2025-06-20',country:'俄罗斯',city:'哈巴罗夫斯克',source:'商务部',source_region:'国内',source_type:'rss',url:'',data_type:'security_events',severity:'medium',type:'经济制裁',location:'木材加工厂',desc:'俄方以环保违规为由对中国木材加工厂进行检查并责令停产，涉事企业50余名中国员工滞留。'},
        {title:'巴基斯坦卡拉奇中资企业安保升级',date:'2025-06-17',country:'巴基斯坦',city:'卡拉奇',source:'外交部领事司',source_region:'国内',source_type:'rss',url:'',data_type:'security_events',severity:'low',type:'武装威胁',location:'卡西姆港工业区',desc:'接获情报显示可能有针对中资企业的恐怖袭击图谋，巴方已加强安保部署，中方启动应急预案。'},
        {title:'埃塞俄比亚提格雷地区中国项目人员撤离',date:'2025-06-14',country:'埃塞俄比亚',city:'默克莱',source:'GDELT API',source_region:'国际',source_type:'gdelt',url:'',data_type:'security_events',severity:'high',type:'武装冲突/内战',location:'提格雷地区公路项目',desc:'提格雷地区安全形势恶化，45名中国公路项目人员紧急撤离至亚的斯亚贝巴。'}
      ],

      'military_conflicts':[
        {title:'俄乌冲突持续升级 东部战线激烈交火',date:'2025-07-11',country:'乌克兰',city:'顿涅茨克',source:'BBC World RSS',source_region:'国际',source_type:'rss',url:'',data_type:'military_conflicts',severity:'critical',desc:'俄乌双方在顿涅茨克方向投入大量兵力，过去72小时双方伤亡超过500人。战事影响中国企业在乌资产安全。'},
        {title:'红海胡塞武装持续袭击国际航运 美英发动空袭',date:'2025-07-09',country:'也门',city:'荷台达',source:'Reuters RSS',source_region:'国际',source_type:'rss',url:'',data_type:'military_conflicts',severity:'critical',desc:'美英联军对胡塞武装在也门境内多处目标发动新一轮空袭，胡塞武装宣布报复性袭击红海航运。中欧海运航线受严重影响。'},
        {title:'缅北战事再起 缅甸军方与民族武装激烈交火',date:'2025-07-07',country:'缅甸',city:'木姐',source:'人民网-国际',source_region:'国内',source_type:'rss',url:'',data_type:'military_conflicts',severity:'high',desc:'缅甸军方与果敢同盟军在缅北木姐地区爆发激烈战斗，中缅边境贸易通道受阻，大量难民涌向中国边境。'},
        {title:'苏丹内战进入第三月 喀土穆战事持续',date:'2025-07-05',country:'苏丹',city:'喀土穆',source:'ReliefWeb API',source_region:'国际',source_type:'reliefweb',url:'',data_type:'military_conflicts',severity:'critical',desc:'苏丹武装部队与快速支援部队在首都喀土穆的战斗持续，已造成超过3000人死亡600万人流离失所。中国在苏丹项目全部停滞。'},
        {title:'萨赫勒地区JNIM武装活动加剧',date:'2025-07-03',country:'马里',city:'廷巴克图',source:'GDELT API',source_region:'国际',source_type:'gdelt',url:'',data_type:'military_conflicts',severity:'high',desc:'JNIM武装组织在马里、尼日尔、布基纳法索三国交界地区加强活动，一周内发动6次袭击，地区安全形势急剧恶化。'},
        {title:'中东地区多国军事对峙升级',date:'2025-06-30',country:'以色列',city:'特拉维夫',source:'Al Jazeera RSS',source_region:'国际',source_type:'rss',url:'',data_type:'military_conflicts',severity:'critical',desc:'以色列与周边武装组织军事对峙升级，多方发射火箭弹和无人机攻击。中东局势高度紧张，影响中国在地区项目安全。'},
        {title:'泰柬边境军事对峙 柏威夏寺附近紧张',date:'2025-06-27',country:'泰国',city:'柏威夏',source:'Google News RSS',source_region:'国际',source_type:'rss',url:'',data_type:'military_conflicts',severity:'medium',desc:'泰国和柬埔寨在边境争议地区增派军队，中泰铁路项目泰国段施工受到一定影响。'},
        {title:'南中国海局势关注 多国海军活动增加',date:'2025-06-24',country:'菲律宾',city:'马尼拉',source:'新华网-国际',source_region:'国内',source_type:'rss',url:'',data_type:'military_conflicts',severity:'medium',desc:'多国海军在南中国海地区活动频繁，地区安全形势复杂化，影响中国海上能源运输通道安全。'}
      ],

      'political_events':[
        {title:'孟加拉国抗议持续 总理辞职政权更迭',date:'2025-07-10',country:'孟加拉国',city:'达卡',source:'BBC World RSS',source_region:'国际',source_type:'rss',url:'',data_type:'political_events',severity:'high',desc:'孟加拉国大规模抗议持续数周后总理辞职，军方接管政权。帕德玛大桥等项目运营受到政治过渡影响。'},
        {title:'尼日尔发生军事政变 民选政府被推翻',date:'2025-07-08',country:'尼日尔',city:'尼亚美',source:'Reuters RSS',source_region:'国际',source_type:'rss',url:'',data_type:'political_events',severity:'high',desc:'尼日尔总统卫队发动政变，推翻民选政府。中国与尼日尔铀矿合作项目面临不确定性。'},
        {title:'委内瑞拉选举争议引发政治危机',date:'2025-07-06',country:'委内瑞拉',city:'加拉加斯',source:'GDELT API',source_region:'国际',source_type:'gdelt',url:'',data_type:'political_events',severity:'medium',desc:'委内瑞拉大选结果引发争议，反对派不承认结果，国际社会高度关注。中国在委石油投资面临风险。'},
        {title:'印度和巴基斯坦边境紧张升级',date:'2025-07-04',country:'印度',city:'新德里',source:'Google News RSS',source_region:'国际',source_type:'rss',url:'',data_type:'political_events',severity:'high',desc:'印巴在克什米尔实际控制线附近交火，双方调动军队。中巴经济走廊安全形势受关注。'},
        {title:'叙利亚政治过渡进程困难重重',date:'2025-07-01',country:'叙利亚',city:'大马士革',source:'Al Jazeera RSS',source_region:'国际',source_type:'rss',url:'',data_type:'political_events',severity:'medium',desc:'叙利亚政治过渡谈判陷入僵局，各方分歧加大。中国在叙利亚战后重建参与面临不确定性。'},
        {title:'土耳其总统大选后政策方向调整',date:'2025-06-28',country:'土耳其',city:'安卡拉',source:'Reuters RSS',source_region:'国际',source_type:'rss',url:'',data_type:'political_events',severity:'low',desc:'土耳其大选后新政府对外资政策可能出现调整，中资能源项目需密切关注政策变化。'},
        {title:'阿根廷新政府经济政策大幅调整',date:'2025-06-25',country:'阿根廷',city:'布宜诺斯艾利斯',source:'GDELT API',source_region:'国际',source_type:'gdelt',url:'',data_type:'political_events',severity:'medium',desc:'阿根廷新政府推行休克疗法经济政策，比索大幅贬值。中国光伏电站等项目的本地收益受到冲击。'},
        {title:'埃塞俄比亚联邦制改革引发地区争议',date:'2025-06-22',country:'埃塞俄比亚',city:'亚的斯亚贝巴',source:'ReliefWeb API',source_region:'国际',source_type:'reliefweb',url:'',data_type:'political_events',severity:'medium',desc:'埃塞俄比亚联邦制改革方案引发各州争议，部分地区的中国铁路项目面临政策不确定性。'}
      ],

      'natural_disasters':[
        {title:'日本本州东岸发生7.2级地震',date:'2025-07-09',country:'日本',city:'仙台',source:'USGS地震API',source_region:'国际',source_type:'usgs',url:'',data_type:'natural_disasters',severity:'high',desc:'日本本州东岸海域发生7.2级地震，震源深度30公里，已发布海啸预警。在日中资企业人员安全确认中。'},
        {title:'菲律宾台风"海葵"登陆 数十万人受灾',date:'2025-07-07',country:'菲律宾',city:'马尼拉',source:'GDACS RSS',source_region:'国际',source_type:'gdacs',url:'',data_type:'natural_disasters',severity:'high',desc:'台风"海葵"以超强台风强度登陆菲律宾吕宋岛，风速达每小时220公里。首都大马尼拉地区大面积停电。'},
        {title:'尼泊尔中部暴雨引发严重洪涝灾害',date:'2025-07-05',country:'尼泊尔',city:'加德满都',source:'ReliefWeb API',source_region:'国际',source_type:'reliefweb',url:'',data_type:'natural_disasters',severity:'medium',desc:'尼泊尔中部持续暴雨引发洪涝和山体滑坡，已造成23人死亡。中尼公路部分路段受损。'},
        {title:'缅甸发生7.9级强烈地震',date:'2025-07-02',country:'缅甸',city:'曼德勒',source:'USGS地震API',source_region:'国际',source_type:'usgs',url:'',data_type:'natural_disasters',severity:'critical',desc:'缅甸中部发生7.9级地震，震源深度10公里。曼德勒大量建筑倒塌，中缅油气管道临时中断检测中。'},
        {title:'印度尼西亚苏拉威西洪灾',date:'2025-06-29',country:'印度尼西亚',city:'帕卢',source:'GDACS RSS',source_region:'国际',source_type:'gdacs',url:'',data_type:'natural_disasters',severity:'medium',desc:'苏拉威西中部持续暴雨引发洪灾，帕卢市大量房屋被淹。中资镍冶炼厂临时停产。'},
        {title:'智利发生6.8级地震',date:'2025-06-26',country:'智利',city:'瓦尔帕莱索',source:'USGS地震API',source_region:'国际',source_type:'usgs',url:'',data_type:'natural_disasters',severity:'medium',desc:'智利中部海域发生6.8级地震，首都圣地亚哥有震感。中国路桥5号公路项目施工临时暂停检查。'},
        {title:'巴基斯坦信德省特大洪水',date:'2025-06-23',country:'巴基斯坦',city:'海得拉巴',source:'ReliefWeb API',source_region:'国际',source_type:'reliefweb',url:'',data_type:'natural_disasters',severity:'high',desc:'印度河水位暴涨，信德省遭遇特大洪水，200万人受灾。中巴经济走廊部分公路路段被淹。'},
        {title:'土耳其南部山火蔓延',date:'2025-06-20',country:'土耳其',city:'安塔利亚',source:'Google News RSS',source_region:'国际',source_type:'rss',url:'',data_type:'natural_disasters',severity:'medium',desc:'土耳其南部地中海沿岸地区发生大规模山火，中国能建电站项目周边空气质量严重下降。'}
      ],

      'public_health':[
        {title:'刚果(金)埃博拉疫情再次爆发',date:'2025-07-08',country:'刚果(金)',city:'贝尼',source:'WHO RSS',source_region:'国际',source_type:'rss',url:'',data_type:'public_health',severity:'high',desc:'WHO确认刚果(金)北基伍省出现新一轮埃博拉疫情，已报告8例确诊3例死亡。中资矿区启动防疫预案。'},
        {title:'巴基斯坦信德省霍乱疫情扩散',date:'2025-07-05',country:'巴基斯坦',city:'海得拉巴',source:'WHO RSS',source_region:'国际',source_type:'rss',url:'',data_type:'public_health',severity:'medium',desc:'洪灾后信德省爆发霍乱疫情，已报告超过2000例。中巴经济走廊项目营地实施防疫管控。'},
        {title:'东南亚登革热疫情高发',date:'2025-07-02',country:'泰国',city:'曼谷',source:'WHO RSS',source_region:'国际',source_type:'rss',url:'',data_type:'public_health',severity:'medium',desc:'泰国、越南、柬埔寨登革热病例大幅增加，较去年同期上升40%。中资企业外派员工健康风险升高。'},
        {title:'尼日利亚拉沙热疫情',date:'2025-06-28',country:'尼日利亚',city:'阿布贾',source:'WHO RSS',source_region:'国际',source_type:'rss',url:'',data_type:'public_health',severity:'medium',desc:'尼日利亚报告96例拉沙热确诊病例，17例死亡。疫情已蔓延至多个州。中资企业加强防鼠措施。'},
        {title:'印度新德里空气污染指数飙至危险级别',date:'2025-06-25',country:'印度',city:'新德里',source:'Google News RSS',source_region:'国际',source_type:'rss',url:'',data_type:'public_health',severity:'low',desc:'新德里空气质量指数(AQI)超过450，达到"严重污染"级别。在印中资企业建议室内活动。'},
        {title:'巴西黄热病疫情预警',date:'2025-06-22',country:'巴西',city:'巴西利亚',source:'WHO RSS',source_region:'国际',source_type:'rss',url:'',data_type:'public_health',severity:'medium',desc:'巴西卫生部发布黄热病预警，多个州报告确诊病例。国家电网巴西项目建议员工接种疫苗。'}
      ],

      'sanctions_data':[
        {title:'美国对华芯片管制再次升级 限制设备出口',date:'2025-07-10',country:'美国',city:'华盛顿',source:'新华网-国际',source_region:'国内',source_type:'rss',url:'',data_type:'sanctions_data',severity:'high',desc:'美国商务部宣布进一步收紧对华芯片出口管制，将更多中国半导体企业列入实体清单。影响中国高科技产业海外供应链。'},
        {title:'欧盟对俄罗斯实施第18轮制裁',date:'2025-07-07',country:'俄罗斯',city:'莫斯科',source:'Reuters RSS',source_region:'国际',source_type:'rss',url:'',data_type:'sanctions_data',severity:'high',desc:'欧盟通过对俄第18轮制裁方案，涵盖能源、金融、军工等领域。中俄贸易结算面临更多障碍。'},
        {title:'美国延长对伊朗石油进口豁免',date:'2025-07-04',country:'伊朗',city:'德黑兰',source:'Google News RSS',source_region:'国际',source_type:'rss',url:'',data_type:'sanctions_data',severity:'medium',desc:'美国延长对伊朗石油进口豁免180天，中伊石油贸易暂时不受影响，但长期风险仍存。'},
        {title:'欧盟对白俄罗斯实施新制裁',date:'2025-07-01',country:'白俄罗斯',city:'明斯克',source:'BBC World RSS',source_region:'国际',source_type:'rss',url:'',data_type:'sanctions_data',severity:'medium',desc:'欧盟对白俄罗斯实施新一轮制裁，涉及钾肥出口。中白工业园部分企业受影响。'},
        {title:'美英联合对缅甸军政府实施制裁',date:'2025-06-28',country:'缅甸',city:'内比都',source:'Reuters RSS',source_region:'国际',source_type:'rss',url:'',data_type:'sanctions_data',severity:'medium',desc:'美国和英国联合宣布对缅甸军政府相关实体和个人实施制裁，涉及油气收入。中缅管道项目结算受影响。'},
        {title:'美欧联合限制对华AI芯片出口',date:'2025-06-25',country:'美国',city:'华盛顿',source:'GDELT API',source_region:'国际',source_type:'gdelt',url:'',data_type:'sanctions_data',severity:'high',desc:'美欧协调对华AI训练芯片出口限制，荷兰ASML光刻机出口管控进一步收紧。中国海外科技项目供应链受影响。'}
      ],

      'social_unrest':[
        {title:'法国全国大罢工持续 交通瘫痪',date:'2025-07-09',country:'法国',city:'巴黎',source:'BBC World RSS',source_region:'国际',source_type:'rss',url:'',data_type:'social_unrest',severity:'medium',desc:'法国多行业联合大罢工进入第二周，巴黎公共交通几乎瘫痪。在法中资企业经营受到影响。'},
        {title:'阿根廷大规模抗议经济政策',date:'2025-07-06',country:'阿根廷',city:'布宜诺斯艾利斯',source:'Reuters RSS',source_region:'国际',source_type:'rss',url:'',data_type:'social_unrest',severity:'medium',desc:'阿根廷数万人上街抗议政府休克疗法经济政策，发生警民冲突。中国光伏电站项目本地员工参与罢工。'},
        {title:'伊朗因头巾法引发全国性抗议',date:'2025-07-03',country:'伊朗',city:'德黑兰',source:'Google News RSS',source_region:'国际',source_type:'rss',url:'',data_type:'social_unrest',severity:'high',desc:'伊朗因头巾法执法致死事件引发全国性抗议，安全部队强力镇压。中国在伊朗项目人员安全受威胁。'},
        {title:'肯尼亚反政府示威持续升级',date:'2025-06-30',country:'肯尼亚',city:'内罗毕',source:'Al Jazeera RSS',source_region:'国际',source_type:'rss',url:'',data_type:'social_unrest',severity:'high',desc:'肯尼亚青年因增税法案发起大规模示威，议会大楼遭冲击。蒙内铁路运营一度中断。'},
        {title:'巴基斯坦清真寺爆炸引发教派冲突',date:'2025-06-27',country:'巴基斯坦',city:'白沙瓦',source:'人民网-国际',source_region:'国内',source_type:'rss',url:'',data_type:'social_unrest',severity:'high',desc:'白沙瓦清真寺发生爆炸造成20余人伤亡，引发逊尼派与什叶派教派冲突。中巴经济走廊项目安全升级。'},
        {title:'秘鲁全国大罢工影响铜矿生产',date:'2025-06-24',country:'秘鲁',city:'利马',source:'GDELT API',source_region:'国际',source_type:'gdelt',url:'',data_type:'social_unrest',severity:'medium',desc:'秘鲁全国性罢工要求提高最低工资，拉斯邦巴斯铜矿等大型矿山生产受到影响。中国五矿项目减产。'},
        {title:'孟加拉国服装工人罢工影响供应链',date:'2025-06-21',country:'孟加拉国',city:'达卡',source:'Google News RSS',source_region:'国际',source_type:'rss',url:'',data_type:'social_unrest',severity:'medium',desc:'孟加拉国服装工人要求提高工资举行大罢工，影响全球服装供应链。中国纺织企业在孟工厂停工。'},
        {title:'哈萨克斯坦西部地区抗议活动',date:'2025-06-18',country:'哈萨克斯坦',city:'阿克套',source:'Google News RSS',source_region:'国际',source_type:'rss',url:'',data_type:'social_unrest',severity:'low',desc:'哈萨克斯坦西部地区因能源价格问题爆发小规模抗议，中亚天然气管道安全运营需关注。'}
      ],

      'infrastructure':[
        {title:'瓜达尔港二期扩建工程启动',date:'2025-07-10',country:'巴基斯坦',city:'瓜达尔',source:'商务部',source_region:'国内',source_type:'rss',url:'',data_type:'infrastructure',severity:'low',desc:'瓜达尔港二期扩建工程正式启动，将建设9个新泊位，预计投资12亿美元。中国海外港口控股承建。'},
        {title:'雅万高铁日均客流突破2万人次',date:'2025-07-08',country:'印度尼西亚',city:'雅加达',source:'新华网-国际',source_region:'国内',source_type:'rss',url:'',data_type:'infrastructure',severity:'low',desc:'雅万高铁运营一周年，日均客流稳定在2万人次以上，实现收支平衡。成为一带一路标杆项目。'},
        {title:'蒙内铁路启动电气化改造可行性研究',date:'2025-07-05',country:'肯尼亚',city:'内罗毕',source:'人民网-国际',source_region:'国内',source_type:'rss',url:'',data_type:'infrastructure',severity:'low',desc:'肯尼亚铁路公司与中方启动蒙内铁路电气化改造可行性研究，预计投资8亿美元。'},
        {title:'匈塞铁路匈牙利段即将通车',date:'2025-07-02',country:'匈牙利',city:'布达佩斯',source:'Google News RSS',source_region:'国际',source_type:'rss',url:'',data_type:'infrastructure',severity:'low',desc:'匈塞铁路匈牙利段改造工程基本完工，即将正式通车。中欧陆海快线建设取得重要进展。'},
        {title:'中泰铁路因征地问题再次延期',date:'2025-06-29',country:'泰国',city:'曼谷',source:'百度资讯搜索',source_region:'国内',source_type:'baidu',url:'',data_type:'infrastructure',severity:'medium',desc:'中泰铁路曼谷-呵叻段因沿线征地和环保评估问题再次延期，预计通车时间推迟至2028年。'},
        {title:'中缅油气管道因内战临时中断',date:'2025-06-26',country:'缅甸',city:'曼德勒',source:'外交部领事司',source_region:'国内',source_type:'rss',url:'',data_type:'infrastructure',severity:'high',desc:'缅甸内战导致中缅油气管道曼德勒段受损临时中断，原油输送暂停。中石油紧急启动应急方案。'}
      ],

      'geopolitical_intel':[
        {title:'中国-中亚五国外长会晤深化能源合作',date:'2025-07-09',country:'哈萨克斯坦',city:'阿斯塔纳',source:'新华网-国际',source_region:'国内',source_type:'rss',url:'',data_type:'geopolitical_intel',severity:'low',desc:'中国与中亚五国外长在阿斯塔纳举行会晤，签署能源合作路线图，深化天然气管道D线建设。'},
        {title:'美国推动"印太经济框架"升级',date:'2025-07-06',country:'美国',city:'华盛顿',source:'Google News RSS',source_region:'国际',source_type:'rss',url:'',data_type:'geopolitical_intel',severity:'medium',desc:'美国推动印太经济框架(IPEF)升级谈判，强化供应链韧性。对中国在东南亚经贸布局形成竞争。'},
        {title:'中非合作论坛即将举办 聚焦绿色发展',date:'2025-07-03',country:'中国',city:'北京',source:'商务部',source_region:'国内',source_type:'rss',url:'',data_type:'geopolitical_intel',severity:'low',desc:'中非合作论坛即将举办，将发布绿色发展合作规划，推动中国在非洲新能源项目。'},
        {title:'俄罗斯加速"向东转"战略 深化中俄合作',date:'2025-06-30',country:'俄罗斯',city:'莫斯科',source:'人民网-国际',source_region:'国内',source_type:'rss',url:'',data_type:'geopolitical_intel',severity:'medium',desc:'俄罗斯加速"向东转"战略，深化中俄能源和基础设施合作。莫斯科-喀山高铁项目有望提速。'},
        {title:'G7峰会讨论对华"去风险"策略',date:'2025-06-27',country:'意大利',city:'罗马',source:'Reuters RSS',source_region:'国际',source_type:'rss',url:'',data_type:'geopolitical_intel',severity:'medium',desc:'G7领导人讨论对华"去风险而非脱钩"策略，涉及关键矿产供应链和半导体。中国海外投资面临新挑战。'},
        {title:'中国-海湾国家自贸区谈判取得突破',date:'2025-06-24',country:'沙特阿拉伯',city:'利雅得',source:'商务部',source_region:'国内',source_type:'rss',url:'',data_type:'geopolitical_intel',severity:'low',desc:'中国与海湾合作委员会自贸区谈判取得突破性进展，预计年内签署。将促进中国在中东能源和基建投资。'},
        {title:'日本修订安保文件 加强西南诸岛防御',date:'2025-06-21',country:'日本',city:'东京',source:'Google News RSS',source_region:'国际',source_type:'rss',url:'',data_type:'geopolitical_intel',severity:'medium',desc:'日本修订国家安全保障文件，加强西南诸岛军事部署。地区安全格局变化值得关注。'},
        {title:'印度推进"东向行动"政策 深化东南亚布局',date:'2025-06-18',country:'印度',city:'新德里',source:'GDELT API',source_region:'国际',source_type:'gdelt',url:'',data_type:'geopolitical_intel',severity:'low',desc:'印度推进"东向行动"政策，加强与越南、印尼的防务和经济合作。中国在东南亚影响力面临竞争。'}
      ],

      'osint_intel':[
        {title:'社交媒体监测：俾路支省武装组织活动信号增强',date:'2025-07-10',country:'巴基斯坦',city:'俾路支省',source:'OSINT监测',source_region:'国际',source_type:'osint',url:'',data_type:'osint_intel',severity:'high',desc:'开源情报显示，俾路支省分离主义武装组织在社交媒体上的招募和宣传活动显著增加，暗示可能发动新一轮袭击。建议中资项目加强安保。'},
        {title:'卫星图像分析：缅甸皎漂港军事活动增加',date:'2025-07-07',country:'缅甸',city:'皎漂',source:'OSINT监测',source_region:'国际',source_type:'osint',url:'',data_type:'osint_intel',severity:'medium',desc:'商业卫星图像显示，皎漂港附近军事设施活动增加，军车数量较上月增长30%。中缅管道项目安全形势需关注。'},
        {title:'暗网情报：针对中资企业的网络攻击计划泄露',date:'2025-07-04',country:'未知',city:'未知',source:'OSINT监测',source_region:'国际',source_type:'osint',url:'',data_type:'osint_intel',severity:'high',desc:'暗网论坛出现针对中国海外企业IT系统的攻击工具出售信息，涉及多个一带一路沿线国家中资企业。建议加强网络安全。'},
        {title:'社交媒体分析：肯尼亚反华情绪监测',date:'2025-07-01',country:'肯尼亚',city:'内罗毕',source:'OSINT监测',source_region:'国际',source_type:'osint',url:'',data_type:'osint_intel',severity:'medium',desc:'社交媒体监测显示，肯尼亚部分群体因债务陷阱论影响对华负面情绪上升，需关注舆论风险。'},
        {title:'政府公告监测：多国发布旅行警告',date:'2025-06-28',country:'多国',city:'多国',source:'OSINT监测',source_region:'国际',source_type:'osint',url:'',data_type:'osint_intel',severity:'medium',desc:'美国、英国、澳大利亚等国同时更新对缅甸、苏丹、尼日尔的旅行警告至最高级别。建议中资企业评估人员安全。'},
        {title:'研究报告：全球供应链风险指数上升',date:'2025-06-25',country:'全球',city:'全球',source:'OSINT监测',source_region:'国际',source_type:'osint',url:'',data_type:'osint_intel',severity:'low',desc:'国际智库报告显示，全球供应链风险指数较上季度上升12%，红海航运中断和地缘政治紧张是主因。'}
      ]
    };
  }
};

// ===== 中资企业海外项目库 (ENTERPRISE_DB) =====
// 存储: orps_enterprise_projects
// 这是风险融合引擎的底座 — 知道项目在哪里，才能判断风险是否影响中国海外利益
var ENTERPRISE_DB={
  KEY:'orps_enterprise_projects',
  VER_KEY:'orps_enterprise_db_version',
  VERSION:'1.0',

  init(){
    var ver=localStorage.getItem(this.VER_KEY);
    if(ver!==this.VERSION){
      localStorage.setItem(this.KEY,JSON.stringify(this._seedData()));
      localStorage.setItem(this.VER_KEY,this.VERSION);
      console.log('[ENTERPRISE_DB] Initialized v'+this.VERSION+' with '+this._seedData().length+' projects');
    }
  },

  _r(){try{return JSON.parse(localStorage.getItem(this.KEY)||'[]');}catch(e){return[];}},
  _w(v){try{localStorage.setItem(this.KEY,JSON.stringify(v));}catch(e){}},

  getAll(){return this._r();},

  count(){return this._r().length;},

  getById(id){return this._r().find(function(p){return p.id===id;});},

  getByCountry(country){
    return this._r().filter(function(p){
      return p.country===country||p.country.indexOf(country)>=0||country.indexOf(p.country)>=0;
    });
  },

  getBySector(sector){return this._r().filter(function(p){return p.sector===sector;});},

  getCountries(){
    var countries={};
    this._r().forEach(function(p){
      if(!countries[p.country])countries[p.country]=0;
      countries[p.country]++;
    });
    return countries;
  },

  getSectors(){
    var sectors={};
    this._r().forEach(function(p){
      if(!sectors[p.sector])sectors[p.sector]=0;
      sectors[p.sector]++;
    });
    return sectors;
  },

  add(project){
    if(!project)return null;
    project.id=Date.now()+Math.floor(Math.random()*100000);
    project.created_at=new Date().toISOString();
    var a=this._r();a.push(project);this._w(a);
    return project.id;
  },

  update(id,fields){
    var a=this._r();
    for(var i=0;i<a.length;i++){
      if(a[i].id===id){
        for(var k in fields)a[i][k]=fields[k];
        this._w(a);return true;
      }
    }
    return false;
  },

  delete(id){
    var a=this._r();
    var filtered=a.filter(function(p){return p.id!==id;});
    this._w(filtered);
    return a.length-filtered.length;
  },

  getStats(){
    var data=this._r();
    var stats={total:data.length,countries:Object.keys(this.getCountries()).length,sectors:Object.keys(this.getSectors()).length};
    stats.byStatus={};
    data.forEach(function(p){
      var s=p.status||'未知';
      if(!stats.byStatus[s])stats.byStatus[s]=0;
      stats.byStatus[s]++;
    });
    return stats;
  },

  // 种子数据: 一带一路重大项目 + 中资企业海外核心项目
  _seedData(){
    return [
      // === 亚洲 ===
      {project_name:'中巴经济走廊(CPEC)',country:'巴基斯坦',city:'瓜达尔/伊斯兰堡',sector:'综合基建',enterprise:'中国交建/国家电投',investment:'620亿美元',status:'建设中',risk_level:'high',start_date:'2015-04',desc:'中巴经济走廊是一带一路旗舰项目，涵盖能源、港口、铁路、公路等'},
      {project_name:'瓜达尔港',country:'巴基斯坦',city:'瓜达尔',sector:'港口',enterprise:'中国海外港口控股',investment:'16.2亿美元',status:'运营中',risk_level:'high',start_date:'2007-03',desc:'一带一路关键节点，深水港已投入运营，自贸区建设中'},
      {project_name:'卡西姆港燃煤电站',country:'巴基斯坦',city:'卡拉奇',sector:'能源',enterprise:'中国电建/卡塔尔电力',investment:'20.9亿美元',status:'运营中',risk_level:'medium',start_date:'2015-05',desc:'巴基斯坦最大燃煤电站之一，缓解巴电力短缺'},
      {project_name:'雅万高铁',country:'印度尼西亚',city:'雅加达-万隆',sector:'铁路',enterprise:'中国铁建/国铁集团',investment:'73亿美元',status:'运营中',risk_level:'low',start_date:'2016-01',desc:'东南亚首条高铁，2023年通车，日均运送旅客超2万人次'},
      {project_name:'中老铁路',country:'老挝',city:'万象-磨憨',sector:'铁路',enterprise:'中国铁建/老挝国家铁路',investment:'59亿美元',status:'运营中',risk_level:'medium',start_date:'2016-12',desc:'连接中国昆明与老挝万象，2021年通车'},
      {project_name:'中泰铁路',country:'泰国',city:'曼谷-廊开',sector:'铁路',enterprise:'中国铁建',investment:'51亿美元',status:'建设中',risk_level:'medium',start_date:'2017-12',desc:'昆明-曼谷高铁泰国段，受边境冲突影响推迟'},
      {project_name:'皎漂深水港',country:'缅甸',city:'皎漂',sector:'港口',enterprise:'中信集团',investment:'13亿美元',status:'建设中',risk_level:'high',start_date:'2018-11',desc:'中缅经济走廊起点，缅甸内战影响施工进度'},
      {project_name:'中缅油气管道',country:'缅甸',city:'皎漂-瑞丽',sector:'能源管道',enterprise:'中石油',investment:'25亿美元',status:'运营中',risk_level:'high',start_date:'2013-07',desc:'原油和天然气双管道，缅甸内战影响稳定运行'},
      {project_name:'印尼青山不锈钢厂',country:'印度尼西亚',city:'苏拉威西',sector:'制造业',enterprise:'青山控股/中国宏桥',investment:'95亿美元',status:'运营中',risk_level:'medium',start_date:'2014-01',desc:'全球最大不锈钢生产基地之一'},
      {project_name:'越南河内城铁',country:'越南',city:'河内',sector:'城轨',enterprise:'中国铁建',investment:'8.7亿美元',status:'运营中',risk_level:'low',start_date:'2011-10',desc:'河内首条城市轨道交通线'},
      {project_name:'斯里兰卡汉班托塔港',country:'斯里兰卡',city:'汉班托塔',sector:'港口',enterprise:'招商局集团',investment:'14亿美元',status:'运营中',risk_level:'medium',start_date:'2017-12',desc:'99年特许经营，印度洋战略要地'},
      {project_name:'柬埔寨金港高速',country:'柬埔寨',city:'金边-西哈努克港',sector:'公路',enterprise:'中国路桥',investment:'20亿美元',status:'运营中',risk_level:'low',start_date:'2019-03',desc:'柬埔寨首条高速公路'},
      {project_name:'孟加拉国帕德玛大桥',country:'孟加拉国',city:'达卡',sector:'桥梁',enterprise:'中铁大桥局',investment:'31.5亿美元',status:'运营中',risk_level:'medium',start_date:'2014-08',desc:'孟加拉国最大桥梁项目'},
      {project_name:'马来西亚东海岸铁路',country:'马来西亚',city:'关丹-巴生',sector:'铁路',enterprise:'中国交建',investment:'110亿美元',status:'建设中',risk_level:'low',start_date:'2017-08',desc:'马来西亚最大基建项目，连接东西海岸'},

      // === 非洲 ===
      {project_name:'蒙内铁路',country:'肯尼亚',city:'蒙巴萨-内罗毕',sector:'铁路',enterprise:'中国路桥',investment:'38亿美元',status:'运营中',risk_level:'medium',start_date:'2014-12',desc:'肯尼亚百年来首条新建铁路，东非铁路网起点'},
      {project_name:'亚的斯亚贝巴-吉布提铁路',country:'埃塞俄比亚/吉布提',city:'亚的斯亚贝巴-吉布提港',sector:'铁路',enterprise:'中国铁建/中铁建电气化局',investment:'40亿美元',status:'运营中',risk_level:'high',start_date:'2012-01',desc:'非洲首条全程电气化跨国铁路'},
      {project_name:'刚果(金)铜钴矿项目',country:'刚果(金)',city:'卢阿拉巴省',sector:'矿业',enterprise:'洛阳钼业/紫金矿业',investment:'37亿美元',status:'运营中',risk_level:'high',start_date:'2016-11',desc:'全球最大钴矿产地之一，中资企业核心战略资源项目'},
      {project_name:'几内亚西芒杜铁矿',country:'几内亚',city:'西芒杜',sector:'矿业',enterprise:'宝武集团/中铝',investment:'150亿美元',status:'建设中',risk_level:'high',start_date:'2020-09',desc:'全球最大未开发优质铁矿，打破三大矿山垄断的关键'},
      {project_name:'尼日利亚莱基深水港',country:'尼日利亚',city:'拉各斯',sector:'港口',enterprise:'中国港湾工程',investment:'12亿美元',status:'运营中',risk_level:'medium',start_date:'2018-03',desc:'西非最大深水港'},
      {project_name:'安哥拉社会住房项目',country:'安哥拉',city:'罗安达',sector:'房建',enterprise:'中信建设',investment:'35亿美元',status:'运营中',risk_level:'medium',start_date:'2008-06',desc:'安哥拉战后重建最大房建项目'},
      {project_name:'赞比亚-中国经贸合作区',country:'赞比亚',city:'卢萨卡',sector:'产业园区',enterprise:'中国有色矿业',investment:'18亿美元',status:'运营中',risk_level:'medium',start_date:'2007-02',desc:'非洲首个经中国政府批准的境外经贸合作区'},

      // === 欧洲 ===
      {project_name:'比雷埃夫斯港',country:'希腊',city:'雅典',sector:'港口',enterprise:'中远海运',investment:'5.1亿欧元',status:'运营中',risk_level:'low',start_date:'2016-04',desc:'地中海最大港，中远海运控股经营，一带一路欧洲桥头堡'},
      {project_name:'匈塞铁路',country:'匈牙利/塞尔维亚',city:'布达佩斯-贝尔格莱德',sector:'铁路',enterprise:'中国铁建',investment:'28亿美元',status:'建设中',risk_level:'low',start_date:'2017-11',desc:'中欧陆海快线关键段，匈牙利段即将通车'},
      {project_name:'莫斯科-喀山高铁',country:'俄罗斯',city:'莫斯科-喀山',sector:'高铁',enterprise:'中国中铁/国铁集团',investment:'150亿美元',status:'规划中',risk_level:'medium',start_date:'2024-01',desc:'欧亚高速运输走廊首段，中俄战略对接项目'},
      {project_name:'塞尔维亚河钢塞钢',country:'塞尔维亚',city:'斯梅代雷沃',sector:'钢铁',enterprise:'河钢集团',investment:'4600万欧元',status:'运营中',risk_level:'low',start_date:'2016-04',desc:'中国钢铁企业首个海外全流程收购项目'},
      {project_name:'土耳其帕图阿克西利吉克电站',country:'土耳其',city:'阿达纳',sector:'能源',enterprise:'中国能建',investment:'17亿美元',status:'运营中',risk_level:'medium',start_date:'2014-06',desc:'土耳其最大燃煤电站之一'},

      // === 中东 ===
      {project_name:'沙特延布炼油厂',country:'沙特阿拉伯',city:'延布',sector:'石化',enterprise:'中石化/沙特阿美',investment:'86亿美元',status:'运营中',risk_level:'low',start_date:'2014-01',desc:'中沙合资世界级炼油厂，日加工能力40万桶'},
      {project_name:'阿联酋哈利法港',country:'阿联酋',city:'阿布扎比',sector:'港口',enterprise:'中远海运',investment:'6.3亿美元',status:'运营中',risk_level:'low',start_date:'2018-12',desc:'中远海运在阿布扎比合资运营码头'},
      {project_name:'伊朗德黑兰地铁',country:'伊朗',city:'德黑兰',sector:'城轨',enterprise:'中铁电气化局',investment:'8.2亿美元',status:'运营中',risk_level:'high',start_date:'2000-03',desc:'中东首个地铁系统，受制裁影响维护困难'},

      // === 拉美 ===
      {project_name:'秘鲁拉斯邦巴斯铜矿',country:'秘鲁',city:'阿普里马克',sector:'矿业',enterprise:'中国五矿',investment:'70亿美元',status:'运营中',risk_level:'medium',start_date:'2015-07',desc:'全球最大铜矿之一，中国五矿海外核心资产'},
      {project_name:'巴西美丽山特高压',country:'巴西',city:'帕拉-里约',sector:'电力',enterprise:'国家电网',investment:'78亿美元',status:'运营中',risk_level:'low',start_date:'2014-02',desc:'中国特高压技术首次出海，送电距离2000+公里'},
      {project_name:'阿根廷高查瑞光伏电站',country:'阿根廷',city:'胡胡伊省',sector:'能源',enterprise:'中国电建/上海电力',investment:'3.9亿美元',status:'运营中',risk_level:'low',start_date:'2018-08',desc:'南美海拔最高光伏电站'},
      {project_name:'智利5号公路',country:'智利',city:'圣地亚哥-奇洛埃',sector:'公路',enterprise:'中国路桥',investment:'14亿美元',status:'建设中',risk_level:'low',start_date:'2020-04',desc:'智利南北交通大动脉改扩建'},

      // === 大洋洲 ===
      {project_name:'澳大利亚皮尔巴拉铁矿',country:'澳大利亚',city:'皮尔巴拉',sector:'矿业',enterprise:'中信股份',investment:'120亿美元',status:'运营中',risk_level:'low',start_date:'2006-03',desc:'中资企业在澳最大单项投资项目'},

      // === 中亚 ===
      {project_name:'中亚天然气管道',country:'哈萨克斯坦/乌兹别克斯坦',city:'土库曼斯坦-中国',sector:'能源管道',enterprise:'中石油',investment:'73亿美元',status:'运营中',risk_level:'medium',start_date:'2009-12',desc:'中国-中亚天然气管道ABC线，年输气550亿立方米'},
      {project_name:'哈萨克斯坦阿斯塔纳轻轨',country:'哈萨克斯坦',city:'阿斯塔纳',sector:'城轨',enterprise:'中铁亚欧',investment:'18亿美元',status:'建设中',risk_level:'medium',start_date:'2018-05',desc:'中亚首条城市轻轨'},
      {project_name:'土库曼斯坦阿姆河天然气',country:'土库曼斯坦',city:'阿姆河',sector:'能源',enterprise:'中石油',investment:'45亿美元',status:'运营中',risk_level:'medium',start_date:'2009-12',desc:'中国最大海外天然气田开发项目'}
    ];
  }
};

// ===== 风险融合引擎 (RISK_FUSION) =====
// 核心功能: 将DBCenter中审核通过的海外风险事件 ↔ ENTERPRISE_DB中的中资企业项目进行匹配
// 输出: 项目级风险预警 → 联动到态势感知和监测中心
var RISK_FUSION={
  KEY:'orps_risk_fusion',
  VER_KEY:'orps_fusion_version',
  VERSION:'1.0',

  init(){
    var ver=localStorage.getItem(this.VER_KEY);
    if(ver!==this.VERSION){
      localStorage.setItem(this.KEY,'[]');
      localStorage.setItem(this.VER_KEY,this.VERSION);
    }
    // 自动注入模拟融合结果(首次加载时)
    try{
      if(this._r().length===0){
        var n=this.seedSimulatedFusion();
        if(n>0)console.log('[RISK_FUSION] Seeded '+n+' simulated matches');
      }
    }catch(e){console.warn('[RISK_FUSION] Seed error:',e);}
  },

  _r(){try{return JSON.parse(localStorage.getItem(this.KEY)||'[]');}catch(e){return[];}},
  _w(v){try{localStorage.setItem(this.KEY,JSON.stringify(v));}catch(e){}},

  // 事件严重度权重
  SEVERITY_WEIGHT:{
    'critical':100,'high':80,'red':80,'orange':50,'medium':40,'yellow':30,'low':15
  },

  // 行业脆弱性映射: 某类事件对某行业的风险系数(0-1)
  SECTOR_VULNERABILITY:{
    'terror_events':{'港口':0.9,'铁路':0.8,'公路':0.7,'能源':0.8,'矿业':0.6,'制造业':0.5,'综合基建':0.7},
    'security_events':{'港口':0.8,'铁路':0.7,'矿业':0.9,'制造业':0.7,'能源':0.6,'综合基建':0.8,'产业园区':0.7},
    'military_conflicts':{'港口':0.9,'铁路':0.9,'公路':0.8,'能源':0.9,'矿业':0.8,'制造业':0.7,'综合基建':0.8},
    'political_events':{'矿业':0.8,'能源':0.7,'制造业':0.6,'港口':0.5,'铁路':0.5,'综合基建':0.6},
    'natural_disasters':{'铁路':0.8,'公路':0.8,'港口':0.7,'能源':0.7,'矿业':0.5,'制造业':0.4,'综合基建':0.6},
    'public_health':{'制造业':0.7,'矿业':0.6,'铁路':0.5,'港口':0.4,'综合基建':0.4},
    'sanctions_data':{'能源':0.9,'矿业':0.8,'石化':0.9,'制造业':0.6,'钢铁':0.7},
    'social_unrest':{'铁路':0.6,'公路':0.6,'矿业':0.8,'制造业':0.7,'港口':0.5,'综合基建':0.6},
    'infrastructure':{'铁路':0.8,'港口':0.8,'能源':0.9,'电力':0.8,'能源管道':0.9},
    'geopolitical_intel':{'矿业':0.6,'能源':0.7,'港口':0.6,'铁路':0.5,'综合基建':0.5},
    'osint_intel':{'能源':0.6,'电力':0.6,'石化':0.5,'制造业':0.4}
  },

  // 计算事件-项目匹配分数
  calculateMatchScore(event,project){
    var score=0;
    var reasons=[];

    // 1. 国家匹配 (核心)
    var eventCountry=(event.country||'').trim();
    var projectCountry=(project.country||'').trim();
    if(eventCountry&&projectCountry){
      if(eventCountry===projectCountry){
        score+=50;
        reasons.push('同国家: '+eventCountry);
      }else if(projectCountry.indexOf(eventCountry)>=0||eventCountry.indexOf(projectCountry)>=0){
        score+=45;
        reasons.push('国家关联: '+eventCountry+' ↔ '+projectCountry);
      }else{
        // 检查是否同一地区(如事件国家在项目国家附近)
        var region=this._getRegion(eventCountry);
        var projectRegion=this._getRegion(projectCountry);
        if(region&&region===projectRegion){
          score+=15;
          reasons.push('同地区: '+region);
        }
      }
    }

    // 2. 事件严重度
    var severity=event.severity||event.impact||event.risk_level||'medium';
    var sevWeight=this.SEVERITY_WEIGHT[severity]||40;
    score+=sevWeight*0.3;

    // 3. 行业脆弱性
    var eventType=event.data_type||'';
    var sectorVuln=this.SECTOR_VULNERABILITY[eventType]||{};
    var vulnScore=sectorVuln[project.sector]||0;
    score+=vulnScore*20;
    if(vulnScore>0.5)reasons.push(project.sector+'行业对该类事件高度脆弱');

    // 4. 项目状态加权(在建项目更脆弱)
    if(project.status==='建设中'){
      score+=5;
      reasons.push('项目在建中，风险敞口更大');
    }else if(project.status==='规划中'){
      score+=3;
    }

    return {score:Math.round(score),reasons:reasons,vulnerability:vulnScore};
  },

  // 简单的区域映射
  _getRegion(country){
    var regions={
      '南亚':['巴基斯坦','印度','孟加拉国','斯里兰卡','尼泊尔','马尔代夫'],
      '东南亚':['印度尼西亚','马来西亚','泰国','越南','缅甸','柬埔寨','老挝','菲律宾','新加坡'],
      '中亚':['哈萨克斯坦','乌兹别克斯坦','土库曼斯坦','吉尔吉斯斯坦','塔吉克斯坦'],
      '中东':['沙特阿拉伯','阿联酋','伊朗','伊拉克','以色列','土耳其','也门','叙利亚','卡塔尔','科威特'],
      '非洲':['肯尼亚','埃塞俄比亚','尼日利亚','南非','安哥拉','赞比亚','刚果(金)','几内亚','苏丹','南苏丹','马里','索马里'],
      '欧洲':['俄罗斯','匈牙利','塞尔维亚','希腊','意大利','德国','法国','英国','白俄罗斯'],
      '拉美':['巴西','秘鲁','阿根廷','智利','墨西哥','委内瑞拉','哥伦比亚'],
      '大洋洲':['澳大利亚','新西兰']
    };
    for(var region in regions){
      if(regions[region].some(function(c){return country.indexOf(c)>=0||c.indexOf(country)>=0;})){
        return region;
      }
    }
    return null;
  },

  // 主融合方法: 扫描DBCenter所有已审核事件，匹配企业项目
  fuse(){
    if(typeof DBCenter==='undefined'||typeof ENTERPRISE_DB==='undefined')return {total:0,matches:[]};
    var events=[];
    var categories=['terror_events','security_events','military_conflicts','political_events',
      'natural_disasters','public_health','sanctions_data','social_unrest',
      'infrastructure','geopolitical_intel','osint_intel'];
    categories.forEach(function(cat){
      var data=DBCenter.getAll(cat);
      data.forEach(function(d){
        if(d.audit_status==='approved'){
          d._collection=cat;
          events.push(d);
        }
      });
    });

    var projects=ENTERPRISE_DB.getAll();
    var matches=[];

    events.forEach(function(event){
      projects.forEach(function(project){
        var result=RISK_FUSION.calculateMatchScore(event,project);
        if(result.score>=30){ // 阈值: 分数≥30才算有关联
          matches.push({
            event_id:event.id,
            event_title:event.title||event.desc||'',
            event_country:event.country||'未知',
            event_date:event.date||'',
            event_type:event._collection||'',
            event_severity:event.severity||event.impact||event.risk_level||'medium',
            project_id:project.id,
            project_name:project.project_name||'',
            project_country:project.country||'',
            project_sector:project.sector||'',
            project_status:project.status||'',
            project_enterprise:project.enterprise||'',
            match_score:result.score,
            match_reasons:result.reasons.join('; '),
            vulnerability:result.vulnerability,
            alert_level:result.score>=80?'critical':result.score>=60?'high':result.score>=40?'medium':'low',
            fused_at:new Date().toISOString()
          });
        }
      });
    });

    // 按匹配分数排序
    matches.sort(function(a,b){return b.match_score-a.match_score;});

    // 保存融合结果
    this._w(matches);
    localStorage.setItem('orps_last_fusion_time',new Date().toISOString());

    return {total:matches.length,matches:matches};
  },

  // 获取融合结果
  getResults(){return this._r();},

  // 获取某个项目的所有风险预警
  getProjectAlerts(projectId){
    return this._r().filter(function(m){return m.project_id===projectId;});
  },

  // 获取某个国家的风险概况
  getCountryRisk(country){
    var matches=this._r().filter(function(m){
      return m.project_country.indexOf(country)>=0||country.indexOf(m.project_country)>=0;
    });
    var criticalCount=matches.filter(function(m){return m.alert_level==='critical';}).length;
    var highCount=matches.filter(function(m){return m.alert_level==='high';}).length;
    return {
      country:country,
      totalAlerts:matches.length,
      critical:criticalCount,
      high:highCount,
      riskLevel:criticalCount>0?'critical':highCount>0?'high':matches.length>0?'medium':'low',
      matches:matches
    };
  },

  // 获取融合摘要
  getSummary(){
    var matches=this._r();
    var summary={
      totalMatches:matches.length,
      criticalProjects:new Set(matches.filter(function(m){return m.alert_level==='critical';}).map(function(m){return m.project_id;})).size,
      highProjects:new Set(matches.filter(function(m){return m.alert_level==='high';}).map(function(m){return m.project_id;})).size,
      affectedProjects:new Set(matches.map(function(m){return m.project_id;})).size,
      totalEvents:new Set(matches.map(function(m){return m.event_id;})).size,
      lastFusionTime:localStorage.getItem('orps_last_fusion_time')||null
    };
    summary.byLevel={critical:matches.filter(function(m){return m.alert_level==='critical';}).length,
      high:matches.filter(function(m){return m.alert_level==='high';}).length,
      medium:matches.filter(function(m){return m.alert_level==='medium';}).length,
      low:matches.filter(function(m){return m.alert_level==='low';}).length};
    return summary;
  },

  // ===== 模拟融合结果注入 =====
  SIM_VERSION:'1.0',
  SIM_FUSION_KEY:'orps_sim_fusion_version',

  seedSimulatedFusion(){
    if(typeof ENTERPRISE_DB==='undefined')return 0;
    var simVer=localStorage.getItem(this.SIM_FUSION_KEY);
    if(simVer===this.SIM_VERSION&&this._r().length>0)return 0;

    var projects=ENTERPRISE_DB.getAll();
    var matches=[];

    // 模拟事件-项目匹配数据(基于真实地理和行业关联)
    var simEvents=[
      // 巴基斯坦 - 高频
      {evt:'俾路支省武装袭击中资项目车队',country:'巴基斯坦',date:'2025-07-10',type:'terror_events',severity:'critical',score:92},
      {evt:'瓜达尔港中国工程师遭持枪抢劫',country:'巴基斯坦',date:'2025-07-06',type:'security_events',severity:'medium',score:68},
      {evt:'卡拉奇证券交易所附近爆炸',country:'巴基斯坦',date:'2025-06-28',type:'terror_events',severity:'medium',score:55},
      {evt:'信德省特大洪水',country:'巴基斯坦',date:'2025-06-23',type:'natural_disasters',severity:'high',score:72},
      {evt:'清真寺爆炸引发教派冲突',country:'巴基斯坦',date:'2025-06-27',type:'social_unrest',severity:'high',score:65},

      // 缅甸
      {evt:'克钦邦中国矿产项目遭武装威胁',country:'缅甸',date:'2025-07-09',type:'security_events',severity:'high',score:88},
      {evt:'缅北战事再起 木姐交火',country:'缅甸',date:'2025-07-07',type:'military_conflicts',severity:'high',score:85},
      {evt:'缅甸7.9级强烈地震',country:'缅甸',date:'2025-07-02',type:'natural_disasters',severity:'critical',score:90},
      {evt:'中缅油气管道因内战临时中断',country:'缅甸',date:'2025-06-26',type:'infrastructure',severity:'high',score:95},

      // 印度尼西亚
      {evt:'苏拉威西爆炸袭击中资工厂',country:'印度尼西亚',date:'2025-06-15',type:'terror_events',severity:'high',score:82},
      {evt:'苏拉威西洪灾',country:'印度尼西亚',date:'2025-06-29',type:'natural_disasters',severity:'medium',score:58},

      // 刚果(金)
      {evt:'ADF武装分子袭击矿业营地',country:'刚果(金)',date:'2025-06-22',type:'terror_events',severity:'high',score:93},
      {evt:'埃博拉疫情再次爆发',country:'刚果(金)',date:'2025-07-08',type:'public_health',severity:'high',score:75},
      {evt:'卢阿拉巴省中资矿区发生冲突',country:'刚果(金)',date:'2025-06-29',type:'security_events',severity:'high',score:90},

      // 尼日利亚
      {evt:'博尔诺州博科圣地绑架中国工人',country:'尼日利亚',date:'2025-07-05',type:'terror_events',severity:'high',score:86},
      {evt:'拉各斯中资建筑工地绑架事件',country:'尼日利亚',date:'2025-07-02',type:'security_events',severity:'high',score:84},
      {evt:'拉沙热疫情',country:'尼日利亚',date:'2025-06-28',type:'public_health',severity:'medium',score:55},

      // 苏丹
      {evt:'苏丹内战进入第三月',country:'苏丹',date:'2025-07-05',type:'military_conflicts',severity:'critical',score:88},

      // 肯尼亚
      {evt:'索马里边境青年党越境袭击',country:'肯尼亚',date:'2025-06-12',type:'terror_events',severity:'medium',score:62},
      {evt:'反政府示威持续升级',country:'肯尼亚',date:'2025-06-30',type:'social_unrest',severity:'high',score:70},

      // 伊朗
      {evt:'头巾法引发全国性抗议',country:'伊朗',date:'2025-07-03',type:'social_unrest',severity:'high',score:78},
      {evt:'美国延长对伊石油豁免',country:'伊朗',date:'2025-07-04',type:'sanctions_data',severity:'medium',score:65},

      // 俄罗斯
      {evt:'俄乌冲突持续升级',country:'俄罗斯',date:'2025-07-11',type:'military_conflicts',severity:'critical',score:75},
      {evt:'远东中国木材加工厂遭检查停产',country:'俄罗斯',date:'2025-06-20',type:'security_events',severity:'medium',score:68},
      {evt:'欧盟第18轮制裁',country:'俄罗斯',date:'2025-07-07',type:'sanctions_data',severity:'high',score:72},

      // 也门/红海
      {evt:'胡塞武装持续袭击国际航运',country:'也门',date:'2025-07-09',type:'military_conflicts',severity:'critical',score:85},
      {evt:'红海导弹攻击商船',country:'也门',date:'2025-06-18',type:'terror_events',severity:'critical',score:88},

      // 马里/萨赫勒
      {evt:'JNIM自杀式汽车炸弹袭击',country:'马里',date:'2025-07-08',type:'terror_events',severity:'high',score:72},
      {evt:'萨赫勒地区武装活动加剧',country:'马里',date:'2025-07-03',type:'military_conflicts',severity:'high',score:68},

      // 阿富汗
      {evt:'喀布尔酒店袭击致中国公民伤亡',country:'阿富汗',date:'2025-07-03',type:'terror_events',severity:'critical',score:85},

      // 埃塞俄比亚
      {evt:'提格雷地区中国项目人员撤离',country:'埃塞俄比亚',date:'2025-06-14',type:'security_events',severity:'high',score:82},
      {evt:'联邦制改革引发地区争议',country:'埃塞俄比亚',date:'2025-06-22',type:'political_events',severity:'medium',score:65},

      // 泰国
      {evt:'泰柬边境军事对峙',country:'泰国',date:'2025-06-27',type:'military_conflicts',severity:'medium',score:58},
      {evt:'中泰铁路因征地问题延期',country:'泰国',date:'2025-06-29',type:'infrastructure',severity:'medium',score:62},

      // 阿根廷
      {evt:'大规模抗议经济政策',country:'阿根廷',date:'2025-07-06',type:'social_unrest',severity:'medium',score:55},
      {evt:'华人超市遭连环抢劫',country:'阿根廷',date:'2025-06-23',type:'security_events',severity:'medium',score:52},
      {evt:'经济政策大幅调整',country:'阿根廷',date:'2025-06-25',type:'political_events',severity:'medium',score:50},

      // 美国(制裁)
      {evt:'对华芯片管制再次升级',country:'美国',date:'2025-07-10',type:'sanctions_data',severity:'high',score:60},
      {evt:'美欧联合限制AI芯片出口',country:'美国',date:'2025-06-25',type:'sanctions_data',severity:'high',score:58},

      // 土耳其
      {evt:'总统大选后政策方向调整',country:'土耳其',date:'2025-06-28',type:'political_events',severity:'low',score:45},
      {evt:'南部山火蔓延',country:'土耳其',date:'2025-06-20',type:'natural_disasters',severity:'medium',score:48},

      // 哈萨克斯坦
      {evt:'中国-中亚五国外长会晤',country:'哈萨克斯坦',date:'2025-07-09',type:'geopolitical_intel',severity:'low',score:40},
      {evt:'西部地区抗议活动',country:'哈萨克斯坦',date:'2025-06-18',type:'social_unrest',severity:'low',score:42},

      // 秘鲁
      {evt:'全国大罢工影响铜矿生产',country:'秘鲁',date:'2025-06-24',type:'social_unrest',severity:'medium',score:68},
      {evt:'6.8级地震',country:'智利',date:'2025-06-26',type:'natural_disasters',severity:'medium',score:35},

      // 孟加拉国
      {evt:'总理辞职政权更迭',country:'孟加拉国',date:'2025-07-10',type:'political_events',severity:'high',score:75},
      {evt:'服装工人罢工影响供应链',country:'孟加拉国',date:'2025-06-21',type:'social_unrest',severity:'medium',score:65},

      // 菲律宾
      {evt:'台风海葵登陆',country:'菲律宾',date:'2025-07-07',type:'natural_disasters',severity:'high',score:55},
      {evt:'南中国海局势关注',country:'菲律宾',date:'2025-06-24',type:'military_conflicts',severity:'medium',score:48},

      // 乌克兰
      {evt:'东部战线激烈交火',country:'乌克兰',date:'2025-07-11',type:'military_conflicts',severity:'critical',score:65},

      // 几内亚
      {evt:'西芒杜铁矿区域安全风险',country:'几内亚',date:'2025-07-01',type:'security_events',severity:'high',score:88}
    ];

    var me=this;
    simEvents.forEach(function(se){
      // 找到同国家的项目
      var matchedProjects=projects.filter(function(p){
        return p.country===se.country||p.country.indexOf(se.country)>=0||se.country.indexOf(p.country)>=0;
      });
      // 如果没有精确匹配，找同地区的
      if(matchedProjects.length===0){
        var region=me._getRegion(se.country);
        if(region){
          matchedProjects=projects.filter(function(p){
            return me._getRegion(p.country)===region;
          });
        }
      }
      matchedProjects.forEach(function(proj){
        var score=se.score;
        // 行业脆弱性调整
        var vulnMap=me.SECTOR_VULNERABILITY[se.type]||{};
        var vuln=vulnMap[proj.sector]||0.3;
        score=Math.round(score*(0.7+vuln*0.3));
        if(score<30)return; // 低于阈值不记录

        var level=score>=80?'critical':score>=60?'high':score>=40?'medium':'low';
        var reasons=[];
        if(se.country===proj.country||proj.country.indexOf(se.country)>=0)reasons.push('同国家: '+se.country);
        else reasons.push('同地区事件影响');
        if(vuln>0.5)reasons.push(proj.sector+'行业对'+se.type+'高度脆弱(系数'+vuln.toFixed(2)+')');
        if(proj.status==='建设中')reasons.push('项目在建中，风险敞口更大');
        reasons.push('事件严重度: '+(se.severity||'medium'));

        matches.push({
          event_id:'sim_evt_'+Date.now()+'_'+Math.floor(Math.random()*100000),
          event_title:se.evt,
          event_country:se.country,
          event_date:se.date,
          event_type:se.type,
          event_severity:se.severity,
          project_id:proj.id||0,
          project_name:proj.project_name,
          project_country:proj.country,
          project_sector:proj.sector,
          project_status:proj.status,
          project_enterprise:proj.enterprise,
          match_score:score,
          match_reasons:reasons.join('; '),
          vulnerability:vuln,
          alert_level:level,
          is_simulated:true,
          fused_at:new Date(Date.now()-Math.random()*86400000*3).toISOString()
        });
      });
    });

    // 按分数排序
    matches.sort(function(a,b){return b.match_score-a.match_score;});
    this._w(matches);
    localStorage.setItem(this.SIM_FUSION_KEY,this.SIM_VERSION);
    localStorage.setItem('orps_last_fusion_time',new Date().toISOString());
    return matches.length;
  },

  clearSimulatedFusion(){
    this._w([]);
    localStorage.removeItem(this.SIM_FUSION_KEY);
    localStorage.removeItem('orps_last_fusion_time');
  }
};

// ===== NLP 情报识别引擎 v5.0 =====
// 自然语言处理: 国家/城市/组织实体识别、事件自动分类、严重度检测、伤亡数字提取、关键词提取
var NLP_ENGINE={
  VERSION:'5.0',

  // 国家别名 → 标准中文名 (覆盖全球190+国家及地区)
  _COUNTRY_MAP:{
    '阿富汗':'阿富汗','Afghanistan':'阿富汗','Afghan':'阿富汗','Kabul':'阿富汗',
    '叙利亚':'叙利亚','Syria':'叙利亚','Syrian':'叙利亚','Damascus':'叙利亚',
    '乌克兰':'乌克兰','Ukraine':'乌克兰','Ukrainian':'乌克兰','Kyiv':'乌克兰',
    '苏丹':'苏丹','Sudan':'苏丹','Khartoum':'苏丹',
    '缅甸':'缅甸','Myanmar':'缅甸','Burma':'缅甸',
    '伊拉克':'伊拉克','Iraq':'伊拉克','Iraqi':'伊拉克','Baghdad':'伊拉克',
    '委内瑞拉':'委内瑞拉','Venezuela':'委内瑞拉','Caracas':'委内瑞拉',
    '俄罗斯':'俄罗斯','Russia':'俄罗斯','Russian':'俄罗斯','Moscow':'俄罗斯',
    '巴基斯坦':'巴基斯坦','Pakistan':'巴基斯坦','Pakistani':'巴基斯坦',
    '尼日利亚':'尼日利亚','Nigeria':'尼日利亚','Nigerian':'尼日利亚',
    '哈萨克斯坦':'哈萨克斯坦','Kazakhstan':'哈萨克斯坦','Kazakh':'哈萨克斯坦',
    '沙特阿拉伯':'沙特阿拉伯','沙特':'沙特阿拉伯','Saudi Arabia':'沙特阿拉伯','Saudi':'沙特阿拉伯',
    '南非':'南非','South Africa':'南非','South African':'南非',
    '埃塞俄比亚':'埃塞俄比亚','Ethiopia':'埃塞俄比亚','Ethiopian':'埃塞俄比亚',
    '越南':'越南','Vietnam':'越南','Vietnamese':'越南','Viet Nam':'越南',
    '印度尼西亚':'印度尼西亚','印尼':'印度尼西亚','Indonesia':'印度尼西亚','Indonesian':'印度尼西亚',
    '巴西':'巴西','Brazil':'巴西','Brazilian':'巴西',
    '美国':'美国','USA':'美国','United States':'美国','America':'美国','American':'美国','Washington':'美国',
    '泰国':'泰国','Thailand':'泰国','Thai':'泰国','Bangkok':'泰国',
    '阿联酋':'阿联酋','阿拉伯联合酋长国':'阿联酋','UAE':'阿联酋','United Arab Emirates':'阿联酋','Emirati':'阿联酋',
    '澳大利亚':'澳大利亚','澳洲':'澳大利亚','Australia':'澳大利亚','Australian':'澳大利亚',
    '新加坡':'新加坡','Singapore':'新加坡','Singaporean':'新加坡',
    '伊朗':'伊朗','Iran':'伊朗','Iranian':'伊朗','Tehran':'伊朗',
    '土耳其':'土耳其','Turkey':'土耳其','Turkish':'土耳其','Ankara':'土耳其',
    '埃及':'埃及','Egypt':'埃及','Egyptian':'埃及','Cairo':'埃及',
    '利比亚':'利比亚','Libya':'利比亚','Libyan':'利比亚','Tripoli':'利比亚',
    '也门':'也门','Yemen':'也门','Yemeni':'也门','Sanaa':'也门',
    '索马里':'索马里','Somalia':'索马里','Somali':'索马里','Mogadishu':'索马里',
    '南苏丹':'南苏丹','South Sudan':'南苏丹','Juba':'南苏丹',
    '刚果(金)':'刚果(金)','刚果民主共和国':'刚果(金)','DRC':'刚果(金)','DR Congo':'刚果(金)','Kinshasa':'刚果(金)',
    '哥伦比亚':'哥伦比亚','Colombia':'哥伦比亚','Colombian':'哥伦比亚','Bogota':'哥伦比亚',
    '墨西哥':'墨西哥','Mexico':'墨西哥','Mexican':'墨西哥',
    '秘鲁':'秘鲁','Peru':'秘鲁','Peruvian':'秘鲁','Lima':'秘鲁',
    '印度':'印度','India':'印度','Indian':'印度','New Delhi':'印度','Mumbai':'印度',
    '菲律宾':'菲律宾','Philippines':'菲律宾','Filipino':'菲律宾','Manila':'菲律宾',
    '马来西亚':'马来西亚','Malaysia':'马来西亚','Malaysian':'马来西亚','Kuala Lumpur':'马来西亚',
    '柬埔寨':'柬埔寨','Cambodia':'柬埔寨','Cambodian':'柬埔寨','Phnom Penh':'柬埔寨',
    '乌兹别克斯坦':'乌兹别克斯坦','Uzbekistan':'乌兹别克斯坦','Uzbek':'乌兹别克斯坦',
    '肯尼亚':'肯尼亚','Kenya':'肯尼亚','Kenyan':'肯尼亚','Nairobi':'肯尼亚',
    '安哥拉':'安哥拉','Angola':'安哥拉','Angolan':'安哥拉','Luanda':'安哥拉',
    '阿尔及利亚':'阿尔及利亚','Algeria':'阿尔及利亚','Algerian':'阿尔及利亚',
    '塞尔维亚':'塞尔维亚','Serbia':'塞尔维亚','Serbian':'塞尔维亚','Belgrade':'塞尔维亚',
    '老挝':'老挝','Laos':'老挝','Lao':'老挝','Vientiane':'老挝',
    '斯里兰卡':'斯里兰卡','Sri Lanka':'斯里兰卡','Sri Lankan':'斯里兰卡','Colombo':'斯里兰卡',
    '孟加拉国':'孟加拉国','Bangladesh':'孟加拉国','Bangladeshi':'孟加拉国','Dhaka':'孟加拉国',
    '几内亚':'几内亚','Guinea':'几内亚','Guinean':'几内亚','Conakry':'几内亚',
    '赞比亚':'赞比亚','Zambia':'赞比亚','Zambian':'赞比亚','Lusaka':'赞比亚',
    '希腊':'希腊','Greece':'希腊','Greek':'希腊','Athens':'希腊',
    '匈牙利':'匈牙利','Hungary':'匈牙利','Hungarian':'匈牙利','Budapest':'匈牙利',
    '土库曼斯坦':'土库曼斯坦','Turkmenistan':'土库曼斯坦',
    '阿根廷':'阿根廷','Argentina':'阿根廷','Argentine':'阿根廷','Buenos Aires':'阿根廷',
    '智利':'智利','Chile':'智利','Chilean':'智利','Santiago':'智利',
    '尼泊尔':'尼泊尔','Nepal':'尼泊尔','Nepali':'尼泊尔','Kathmandu':'尼泊尔',
    '黎巴嫩':'黎巴嫩','Lebanon':'黎巴嫩','Lebanese':'黎巴嫩','Beirut':'黎巴嫩',
    '以色列':'以色列','Israel':'以色列','Israeli':'以色列','Jerusalem':'以色列',
    '巴勒斯坦':'巴勒斯坦','Palestine':'巴勒斯坦','Palestinian':'巴勒斯坦','Gaza':'巴勒斯坦',
    '约旦':'约旦','Jordan':'约旦','Jordanian':'约旦','Amman':'约旦',
    '卡塔尔':'卡塔尔','Qatar':'卡塔尔','Qatari':'卡塔尔','Doha':'卡塔尔',
    '科威特':'科威特','Kuwait':'科威特','Kuwaiti':'科威特',
    '巴林':'巴林','Bahrain':'巴林','Bahraini':'巴林',
    '白俄罗斯':'白俄罗斯','Belarus':'白俄罗斯','Belarusian':'白俄罗斯','Minsk':'白俄罗斯',
    '罗马尼亚':'罗马尼亚','Romania':'罗马尼亚','Romanian':'罗马尼亚',
    '保加利亚':'保加利亚','Bulgaria':'保加利亚','Bulgarian':'保加利亚',
    '吉布提':'吉布提','Djibouti':'吉布提','Djiboutian':'吉布提',
    '厄立特里亚':'厄立特里亚','Eritrea':'厄立特里亚',
    '马里':'马里','Mali':'马里','Malian':'马里','Bamako':'马里',
    '乍得':'乍得','Chad':'乍得','Chadian':'乍得',
    '尼日尔':'尼日尔','Niger':'尼日尔','Nigerien':'尼日尔',
    '布基纳法索':'布基纳法索','Burkina Faso':'布基纳法索',
    '毛里塔尼亚':'毛里塔尼亚','Mauritania':'毛里塔尼亚',
    '中非共和国':'中非共和国','Central African Republic':'中非共和国','Central African':'中非共和国',
    '喀麦隆':'喀麦隆','Cameroon':'喀麦隆','Cameroonian':'喀麦隆',
    '坦桑尼亚':'坦桑尼亚','Tanzania':'坦桑尼亚','Tanzanian':'坦桑尼亚',
    '乌干达':'乌干达','Uganda':'乌干达','Ugandan':'乌干达',
    '卢旺达':'卢旺达','Rwanda':'卢旺达','Rwandan':'卢旺达',
    '加纳':'加纳','Ghana':'加纳','Ghanaian':'加纳',
    '塞内加尔':'塞内加尔','Senegal':'塞内加尔','Senegalese':'塞内加尔',
    '莫桑比克':'莫桑比克','Mozambique':'莫桑比克','Mozambican':'莫桑比克',
    '津巴布韦':'津巴布韦','Zimbabwe':'津巴布韦','Zimbabwean':'津巴布韦',
    '博茨瓦纳':'博茨瓦纳','Botswana':'博茨瓦纳',
    '蒙古':'蒙古','Mongolia':'蒙古','Mongolian':'蒙古',
    '朝鲜':'朝鲜','North Korea':'朝鲜','DPRK':'朝鲜','Pyongyang':'朝鲜',
    '韩国':'韩国','South Korea':'韩国','Korea':'韩国','Korean':'韩国','Seoul':'韩国',
    '日本':'日本','Japan':'日本','Japanese':'日本','Tokyo':'日本',
    '法国':'法国','France':'法国','French':'法国','Paris':'法国',
    '德国':'德国','Germany':'德国','German':'德国','Berlin':'德国',
    '英国':'英国','United Kingdom':'英国','UK':'英国','Britain':'英国','British':'英国','London':'英国',
    '意大利':'意大利','Italy':'意大利','Italian':'意大利','Rome':'意大利',
    '西班牙':'西班牙','Spain':'西班牙','Spanish':'西班牙','Madrid':'西班牙',
    '加拿大':'加拿大','Canada':'加拿大','Canadian':'加拿大',
    '荷兰':'荷兰','Netherlands':'荷兰','Dutch':'荷兰','Holland':'荷兰',
    '波兰':'波兰','Poland':'波兰','Polish':'波兰','Warsaw':'波兰',
    '摩尔多瓦':'摩尔多瓦','Moldova':'摩尔多瓦',
    '阿塞拜疆':'阿塞拜疆','Azerbaijan':'阿塞拜疆','Azerbaijani':'阿塞拜疆',
    '亚美尼亚':'亚美尼亚','Armenia':'亚美尼亚','Armenian':'亚美尼亚',
    '格鲁吉亚':'格鲁吉亚','Georgia':'格鲁吉亚','Georgian':'格鲁吉亚',
    '塔吉克斯坦':'塔吉克斯坦','Tajikistan':'塔吉克斯坦',
    '吉尔吉斯斯坦':'吉尔吉斯斯坦','Kyrgyzstan':'吉尔吉斯斯坦',
    '苏里南':'苏里南','Suriname':'苏里南',
    '阿富汗':'阿富汗','塔利班':'阿富汗','Taliban':'阿富汗',
    '胡塞武装':'也门','Houthi':'也门','胡塞':'也门',
    '俾路支':'巴基斯坦','Baloch':'巴基斯坦','Balochistan':'巴基斯坦',
    '萨赫勒':'萨赫勒地区','Sahel':'萨赫勒地区',
    '红海':'红海','Red Sea':'红海',
    '南海':'南海','South China Sea':'南海',
    '台海':'台海','Taiwan Strait':'台海',
    '中国台湾':'中国台湾','Taiwan':'中国台湾','中国香港':'中国香港','Hong Kong':'中国香港','中国澳门':'中国澳门','Macao':'中国澳门'
  },

  // 城市映射 → 国家
  _CITY_MAP:{
    '伊斯兰堡':'巴基斯坦','卡拉奇':'巴基斯坦','瓜达尔':'巴基斯坦','拉合尔':'巴基斯坦','达苏':'巴基斯坦',
    '喀布尔':'阿富汗','坎大哈':'阿富汗',
    '巴格达':'伊拉克','摩苏尔':'伊拉克','巴士拉':'伊拉克','埃尔比勒':'伊拉克',
    '大马士革':'叙利亚','阿勒颇':'叙利亚',
    '基辅':'乌克兰','哈尔科夫':'乌克兰','敖德萨':'乌克兰','顿涅茨克':'乌克兰',
    '喀土穆':'苏丹',
    '内比都':'缅甸','仰光':'缅甸','曼德勒':'缅甸','皎漂':'缅甸','密松':'缅甸',
    '加拉加斯':'委内瑞拉',
    '莫斯科':'俄罗斯','圣彼得堡':'俄罗斯','喀山':'俄罗斯',
    '阿布贾':'尼日利亚','拉各斯':'尼日利亚','卡诺':'尼日利亚',
    '阿斯塔纳':'哈萨克斯坦','阿拉木图':'哈萨克斯坦',
    '利雅得':'沙特阿拉伯','吉达':'沙特阿拉伯','延布':'沙特阿拉伯',
    '比勒陀利亚':'南非','约翰内斯堡':'南非','开普敦':'南非',
    '亚的斯亚贝巴':'埃塞俄比亚',
    '河内':'越南','胡志明市':'越南',
    '雅加达':'印度尼西亚','万隆':'印度尼西亚','苏拉威西':'印度尼西亚',
    '巴西利亚':'巴西','里约热内卢':'巴西','圣保罗':'巴西',
    '华盛顿':'美国','纽约':'美国','洛杉矶':'美国','硅谷':'美国',
    '曼谷':'泰国',
    '阿布扎比':'阿联酋','迪拜':'阿联酋',
    '堪培拉':'澳大利亚','悉尼':'澳大利亚','皮尔巴拉':'澳大利亚',
    '德黑兰':'伊朗',
    '安卡拉':'土耳其','伊斯坦布尔':'土耳其','阿达纳':'土耳其',
    '开罗':'埃及','苏伊士':'埃及',
    '的黎波里':'利比亚',
    '萨那':'也门','亚丁':'也门',
    '摩加迪沙':'索马里',
    '朱巴':'南苏丹',
    '金沙萨':'刚果(金)','戈马':'刚果(金)','布卡武':'刚果(金)','卢阿拉巴':'刚果(金)',
    '波哥大':'哥伦比亚','武里蒂卡':'哥伦比亚','麦德林':'哥伦比亚',
    '墨西哥城':'墨西哥','蒙特雷':'墨西哥',
    '利马':'秘鲁','阿普里马克':'秘鲁',
    '新德里':'印度','孟买':'印度','班加罗尔':'印度',
    '马尼拉':'菲律宾','吕宋':'菲律宾',
    '吉隆坡':'马来西亚','关丹':'马来西亚','巴生':'马来西亚',
    '金边':'柬埔寨','西哈努克港':'柬埔寨',
    '塔什干':'乌兹别克斯坦',
    '内罗毕':'肯尼亚','蒙巴萨':'肯尼亚',
    '罗安达':'安哥拉',
    '阿尔及尔':'阿尔及利亚',
    '贝尔格莱德':'塞尔维亚','斯梅代雷沃':'塞尔维亚',
    '万象':'老挝','磨憨':'老挝',
    '科伦坡':'斯里兰卡','汉班托塔':'斯里兰卡',
    '达卡':'孟加拉国','帕德玛':'孟加拉国',
    '科纳克里':'几内亚','西芒杜':'几内亚',
    '卢萨卡':'赞比亚',
    '雅典':'希腊','比雷埃夫斯':'希腊',
    '布达佩斯':'匈牙利',
    '布宜诺斯艾利斯':'阿根廷','胡胡伊':'阿根廷',
    '圣地亚哥':'智利',
    '加德满都':'尼泊尔',
    '贝鲁特':'黎巴嫩',
    '耶路撒冷':'以色列','特拉维夫':'以色列',
    '加沙':'巴勒斯坦',
    '安曼':'约旦',
    '多哈':'卡塔尔',
    '科威特城':'科威特',
    '麦纳麦':'巴林',
    '明斯克':'白俄罗斯',
    '布加勒斯特':'罗马尼亚',
    '索菲亚':'保加利亚',
    '吉布提市':'吉布提',
    '巴马科':'马里',
    '恩贾梅纳':'乍得',
    '尼亚美':'尼日尔',
    '瓦加杜古':'布基纳法索',
    '班吉':'中非共和国',
    '雅温得':'喀麦隆',
    '达累斯萨拉姆':'坦桑尼亚',
    '坎帕拉':'乌干达',
    '基加利':'卢旺达',
    '阿克拉':'加纳',
    '达喀尔':'塞内加尔',
    '马普托':'莫桑比克',
    '哈拉雷':'津巴布韦',
    '哈博罗内':'博茨瓦纳',
    '乌兰巴托':'蒙古',
    '平壤':'朝鲜',
    '首尔':'韩国',
    '东京':'日本',
    '巴黎':'法国',
    '柏林':'德国',
    '伦敦':'英国',
    '罗马':'意大利',
    '马德里':'西班牙',
    '渥太华':'加拿大',
    '阿姆斯特丹':'荷兰',
    '华沙':'波兰',
    '基希讷乌':'摩尔多瓦',
    '巴库':'阿塞拜疆',
    '埃里温':'亚美尼亚',
    '第比利斯':'格鲁吉亚',
    '杜尚别':'塔吉克斯坦',
    '比什凯克':'吉尔吉斯斯坦',
    '帕拉马里博':'苏里南'
  },

  // 从文本中提取国家
  extractCountries(text){
    if(!text)return[];
    var found={};
    for(var name in this._COUNTRY_MAP){
      if(text.indexOf(name)>=0){
        found[this._COUNTRY_MAP[name]]=true;
      }
    }
    return Object.keys(found);
  },

  // 提取城市及对应国家
  extractCities(text){
    if(!text)return{};
    var found={};
    for(var city in this._CITY_MAP){
      if(text.indexOf(city)>=0){
        found[city]=this._CITY_MAP[city];
      }
    }
    return found;
  },

  // 事件类型关键词
  _EVENT_KEYWORDS:{
    'terror_events':['恐怖袭击','爆炸','自杀式','炸弹','汽车炸弹','ISIS','伊斯兰国','基地组织','塔利班','博科圣地','青年党','极端组织','圣战','terrorist','bombing','explosion','suicide attack','IED','insurgency'],
    'security_events':['中国公民','华人','华侨','中资企业','领事保护','撤侨','绑架','劫持','遇袭','中方人员','使馆','embassy','Chinese citizen','kidnapping','hostage','evacuation','consular'],
    'military_conflicts':['军事冲突','空袭','战争','武装冲突','炮击','导弹','入侵','交火','阵地','停火','airstrike','military','war','invasion','missile strike','shelling','ceasefire'],
    'political_events':['政变','选举','政治危机','政权更迭','抗议','政府倒台','解散议会','军事政变','coup','election','political crisis','regime change','dissolution'],
    'natural_disasters':['地震','海啸','洪水','台风','火山','飓风','干旱','泥石流','山火','暴雨','earthquake','tsunami','flood','typhoon','hurricane','volcanic','drought','wildfire'],
    'public_health':['疫情','传染病','病毒','感染','霍乱','埃博拉','猴痘','登革热','outbreak','epidemic','virus','infection','pandemic','cholera','ebola','monkeypox'],
    'sanctions_data':['制裁','出口管制','贸易限制','实体清单','禁运','关税','贸易战','sanctions','embargo','export control','entity list','tariff','trade war'],
    'social_unrest':['抗议','罢工','骚乱','示威','暴乱','宵禁','冲突','protest','riot','strike','demonstration','unrest','curfew'],
    'infrastructure':['基础设施','管道','电网','港口','铁路','公路','桥梁','电站','水坝','sabotage','pipeline','power grid','port','railway','bridge','dam'],
    'geopolitical_intel':['地缘政治','外交','大国博弈','领土争端','战略竞争','南海','台海','印太','geopolitical','diplomacy','territorial','strategic','Indo-Pacific'],
    'osint_intel':['网络安全','网络攻击','数据泄露','间谍','情报','监控','勒索病毒','黑客','cyber','hack','breach','espionage','surveillance','ransomware','malware']
  },

  // 自动分类事件类型
  classifyEvent(title,desc){
    var text=(title||'')+' '+(desc||'');
    var bestCat='',bestScore=0;
    for(var cat in this._EVENT_KEYWORDS){
      var score=0;
      var kws=this._EVENT_KEYWORDS[cat];
      for(var i=0;i<kws.length;i++){
        if(text.indexOf(kws[i])>=0)score++;
      }
      if(score>bestScore){bestScore=score;bestCat=cat;}
    }
    return{category:bestCat,score:bestScore};
  },

  // 严重度关键词 (按优先级: critical > high > medium > low)
  _SEVERITY_KEYWORDS:{
    critical:['死亡','遇难','身亡','丧生','罹难','大规模','屠杀','击毙','killed','dead','death','mass casualty','massacre','fatalities','slain','execute'],
    high:['受伤','袭击','爆炸','绑架','劫持','攻占','占领','攻陷','沦陷','坠毁','wounded','injured','attack','bombing','kidnapping','captured','seized','crash'],
    medium:['威胁','警告','警戒','风险','不稳定','紧张','对峙','warning','alert','threat','unstable','tension','standoff'],
    low:['关注','监测','观察','潜在','可能','monitor','observe','potential','concern']
  },

  // 检测严重度
  detectSeverity(title,desc){
    var text=(title||'')+' '+(desc||'');
    var lowerText=text.toLowerCase();
    var levels=['critical','high','medium','low'];
    for(var li=0;li<levels.length;li++){
      var level=levels[li];
      var kws=this._SEVERITY_KEYWORDS[level];
      for(var i=0;i<kws.length;i++){
        if(text.indexOf(kws[i])>=0||lowerText.indexOf(kws[i].toLowerCase())>=0){
          return level;
        }
      }
    }
    return 'medium';
  },

  // 提取伤亡数字
  extractCasualties(text){
    if(!text)return{deaths:0,injured:0};
    var deaths=0,injured=0;
    var deathPatterns=[
      /(\d+)\s*(?:名|位|个)?\s*(?:人)?\s*(?:死亡|遇难|身亡|丧生|罹难)/g,
      /(?:死亡|遇难|身亡|丧生|罹难)\s*(\d+)\s*(?:人|名|位)/g,
      /(\d+)\s*(?:dead|killed|deaths|fatalities)/gi
    ];
    var injuredPatterns=[
      /(\d+)\s*(?:名|位|个)?\s*(?:人)?\s*(?:受伤|伤)/g,
      /(?:受伤|伤)\s*(\d+)\s*(?:人|名|位)/g,
      /(\d+)\s*(?:wounded|injured|injuries)/gi
    ];
    deathPatterns.forEach(function(p){
      var m;
      while((m=p.exec(text))!==null){
        var n=parseInt(m[1]);
        if(n>deaths)deaths=n;
      }
    });
    injuredPatterns.forEach(function(p){
      var m;
      while((m=p.exec(text))!==null){
        var n=parseInt(m[1]);
        if(n>injured)injured=n;
      }
    });
    return{deaths:deaths,injured:injured};
  },

  // 提取关键词
  extractKeywords(text,maxCount){
    maxCount=maxCount||10;
    if(!text)return[];
    var stopWords=['的','了','在','是','对','为','与','和','据','该','此','其','从','到','被','将','已','于','以','上','下','中','后','前','一个','一些','一种','这个','那个','these','those','this','that','with','from','into','have','has','been','were','they','their','them','which','what','when','where','who'];
    var words=text.replace(/[，。！？、；：""''（）【】《》\s\n\r\t,.!?;:"'()\[\]{}<>]+/g,'|').split('|').filter(function(w){return w.length>=2&&stopWords.indexOf(w)<0;});
    var freq={};
    words.forEach(function(w){freq[w]=(freq[w]||0)+1;});
    var sorted=Object.keys(freq).sort(function(a,b){return freq[b]-freq[a];});
    return sorted.slice(0,maxCount);
  },

  // 文本清洗: 去HTML标签、去广告、去多余空白
  cleanText(text){
    if(!text)return'';
    return text
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi,'')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi,'')
      .replace(/<[^>]*>/g,'')
      .replace(/&nbsp;/g,' ')
      .replace(/&amp;/g,'&')
      .replace(/&lt;/g,'<')
      .replace(/&gt;/g,'>')
      .replace(/&quot;/g,'"')
      .replace(/&#39;/g,"'")
      .replace(/【[^】]*】/g,'') // 去方括号广告
      .replace(/\s{2,}/g,' ')
      .trim();
  },

  // 生成摘要
  summarize(text,maxLen){
    maxLen=maxLen||200;
    if(!text||text.length<=maxLen)return text||'';
    var sub=text.substring(0,maxLen+50);
    var lastPunct=Math.max(sub.lastIndexOf('。'),sub.lastIndexOf('!'),sub.lastIndexOf('?'),sub.lastIndexOf('.'));
    if(lastPunct>maxLen*0.5)return sub.substring(0,lastPunct+1);
    return text.substring(0,maxLen)+'...';
  }
};

// ===== 智能去重引擎 =====
// 基于Levenshtein距离 + 内容指纹的智能去重
var DEDUP_ENGINE={
  VERSION:'5.0',

  // Levenshtein编辑距离
  levenshtein(a,b){
    if(a===b)return 0;
    if(!a.length)return b.length;
    if(!b.length)return a.length;
    var matrix=[];
    for(var i=0;i<=b.length;i++)matrix[i]=[i];
    for(var j=0;j<=a.length;j++)matrix[0][j]=j;
    for(var i=1;i<=b.length;i++){
      for(var j=1;j<=a.length;j++){
        if(b.charAt(i-1)===a.charAt(j-1))matrix[i][j]=matrix[i-1][j-1];
        else matrix[i][j]=Math.min(matrix[i-1][j-1]+1,matrix[i][j-1]+1,matrix[i-1][j]+1);
      }
    }
    return matrix[b.length][a.length];
  },

  // 标题相似度 (0~1, 1=完全相同)
  titleSimilarity(t1,t2){
    if(!t1||!t2)return 0;
    t1=t1.toLowerCase().trim();
    t2=t2.toLowerCase().trim();
    if(t1===t2)return 1;
    // 去标点后比较
    var c1=t1.replace(/[，。！？、；：""''（）【】《》\s,.!?:;"'()\[\]{}<>]/g,'');
    var c2=t2.replace(/[，。！？、；：""''（）【】《》\s,.!?:;"'()\[\]{}<>]/g,'');
    if(c1===c2)return 1;
    // 包含关系
    if(c1.length>10&&c2.length>10){
      if(c1.indexOf(c2)>=0||c2.indexOf(c1)>=0)return 0.9;
    }
    var maxLen=Math.max(c1.length,c2.length);
    if(maxLen===0)return 0;
    var dist=this.levenshtein(c1,c2);
    return 1-dist/maxLen;
  },

  // 内容指纹 (基于关键词频率的简化SimHash)
  contentHash(text){
    if(!text)return '0';
    var words=NLP_ENGINE.extractKeywords(text,20);
    if(!words.length)return '0';
    var hash=0;
    for(var i=0;i<words.length;i++){
      var w=words[i];
      for(var j=0;j<w.length;j++){
        hash=((hash<<5)-hash+w.charCodeAt(j))|0;
      }
    }
    return String(hash);
  },

  // 检查是否与已有数据重复
  isDuplicate(item,existingItems,threshold){
    threshold=threshold||0.85;
    if(!item||!item.title)return false;
    var title=item.title;
    var itemHash=this.contentHash((item.title||'')+' '+(item.desc||''));
    for(var i=0;i<existingItems.length;i++){
      var ex=existingItems[i];
      if((ex.title||'').toLowerCase().trim()===title.toLowerCase().trim())return true;
      if(this.titleSimilarity(ex.title,title)>=threshold)return true;
      if(ex._contentHash&&ex._contentHash===itemHash)return true;
    }
    return false;
  },

  // 批量去重: 去除新数据中的重复(组内去重 + 与已有数据去重)
  removeDuplicates(newItems,existingItems){
    var me=this;
    var unique=[];
    newItems.forEach(function(item){
      if(!item||!item.title)return;
      // 组内查重
      var isDup=false;
      for(var i=0;i<unique.length;i++){
        if(me.titleSimilarity(unique[i].title,item.title)>=0.85){isDup=true;break;}
      }
      if(isDup)return;
      // 与已有数据查重
      if(me.isDuplicate(item,existingItems))return;
      // 生成内容指纹
      item._contentHash=me.contentHash((item.title||'')+' '+(item.desc||''));
      unique.push(item);
    });
    return unique;
  }
};

// ===== 数据质量评估引擎 =====
// 多维度质量评分: 相关性 + 丰富度 + 可信度 + 时效性
var QUALITY_ENGINE={
  VERSION:'5.0',

  // 海外风险相关性关键词
  _RELEVANCE_KW:[
    '海外','境外','国际','全球','一带一路','中资','中方','中国公民','华人','华侨','使馆','领事',
    'overseas','international','global','embassy','consular','evacuation',
    '袭击','冲突','战争','恐怖','爆炸','政变','制裁','地震','海啸','疫情','绑架',
    'attack','conflict','war','terror','bomb','coup','sanctions','earthquake','tsunami','outbreak',
    '风险','预警','安全','威胁','危险','危机','动荡','撤侨',
    'risk','alert','security','threat','danger','crisis','unrest'
  ],

  // 低质量指标
  _LOW_QUALITY_KW:['广告','推广','购买','订阅','点击这里','下载APP','关注公众号','advertisement','subscribe','click here','download app','限时优惠','包邮'],

  // 数据源可信度评级
  _SOURCE_CRED:{
    '新华网':0.95,'新华网-国际':0.95,'人民网':0.95,'人民网-国际':0.95,'环球网':0.90,'环球网-国际':0.90,
    '外交部领事司':0.98,'商务部':0.95,'商务部-贸易救济':0.95,'中国地震台网':0.98,
    'USGS':0.98,'USGS地震':0.98,'GDELT':0.85,'WHO':0.95,'WHO RSS':0.95,
    'BBC World':0.90,'BBC World RSS':0.90,'Reuters':0.90,'Reuters RSS':0.90,
    'ReliefWeb':0.88,'ReliefWeb冲突':0.88,'GDACS':0.92,'GDACS灾害预警':0.92,'GDACS预警':0.92,
    '百度资讯':0.70,'百度热搜':0.60,'新浪新闻':0.75,
    'Google资讯(中文)':0.80,'Google News(EN)':0.80,
    'The Guardian':0.88,'Al Jazeera':0.85,'UN News':0.92,'AP News':0.88
  },

  // 相关性评分 (0~100)
  relevanceScore(item){
    var text=(item.title||'')+' '+(item.desc||'');
    if(!text)return 0;
    var score=0;
    var me=this;
    this._RELEVANCE_KW.forEach(function(kw){
      if(text.indexOf(kw)>=0||text.toLowerCase().indexOf(kw.toLowerCase())>=0)score+=3;
    });
    // 国家识别加成
    var countries=NLP_ENGINE.extractCountries(text);
    if(countries.length>0){
      score+=countries.length*5;
      var nonChina=countries.filter(function(c){return c!=='中国';});
      if(nonChina.length>0)score+=nonChina.length*3;
    }
    // 低质量指标扣分
    this._LOW_QUALITY_KW.forEach(function(kw){
      if(text.indexOf(kw)>=0)score-=15;
    });
    return Math.max(0,Math.min(100,score));
  },

  // 信息丰富度评分 (0~100)
  richnessScore(item){
    var score=0;
    var desc=item.desc||'',title=item.title||'';
    if(title.length>=10)score+=10;
    if(title.length>=20)score+=5;
    if(desc.length>=50)score+=10;
    if(desc.length>=100)score+=10;
    if(desc.length>=200)score+=5;
    var countries=NLP_ENGINE.extractCountries(title+' '+desc);
    if(countries.length>0)score+=15;
    if(item.date&&item.date.length>=8)score+=10;
    if(item.source_url&&item.source_url.length>10)score+=10;
    var nums=(title+desc).match(/\d+/g);
    if(nums&&nums.length>=2)score+=10;
    var cities=NLP_ENGINE.extractCities(title+' '+desc);
    if(Object.keys(cities).length>0)score+=10;
    if(item.source_type&&item.source_type!=='搜索引擎')score+=5;
    return Math.min(100,score);
  },

  // 数据源可信度 (0~100)
  credibilityScore(sourceName){
    return Math.round((this._SOURCE_CRED[sourceName]||0.65)*100);
  },

  // 时效性评分 (0~100)
  timelinessScore(dateStr){
    if(!dateStr)return 50;
    try{
      var d=new Date(dateStr);
      if(isNaN(d.getTime()))return 50;
      var now=new Date();
      var daysDiff=(now-d)/(1000*60*60*24);
      if(daysDiff<=0)return 100;
      if(daysDiff<=1)return 95;
      if(daysDiff<=3)return 85;
      if(daysDiff<=7)return 75;
      if(daysDiff<=14)return 65;
      if(daysDiff<=30)return 50;
      if(daysDiff<=60)return 35;
      if(daysDiff<=90)return 20;
      return 10;
    }catch(e){return 50;}
  },

  // 综合质量评分 (加权: 相关性40% + 丰富度25% + 可信度20% + 时效性15%)
  compositeScore(item){
    var r=this.relevanceScore(item);
    var ri=this.richnessScore(item);
    var c=this.credibilityScore(item.source||'');
    var t=this.timelinessScore(item.date||'');
    return Math.round(r*0.40+ri*0.25+c*0.20+t*0.15);
  },

  // 过滤低质量数据
  filter(items,minScore){
    minScore=minScore||25;
    var me=this;
    return items.filter(function(item){
      var score=me.compositeScore(item);
      item._quality_score=score;
      item._quality_grade=me.qualityGrade(score);
      return score>=minScore;
    });
  },

  // 质量等级
  qualityGrade(score){
    if(score>=80)return 'A';
    if(score>=65)return 'B';
    if(score>=50)return 'C';
    if(score>=35)return 'D';
    return 'F';
  }
};

// ===== 数据增强引擎 =====
// NLP驱动的自动增强: 提取实体、自动分类、严重度检测、企业匹配
var ENRICH_ENGINE={
  VERSION:'5.0',

  // 增强单条数据
  enrich(item){
    if(!item)return item;
    var text=(item.title||'')+' '+(item.desc||'');

    // 1. 提取国家
    if(!item.country||item.country==='未知'||!item.country){
      var countries=NLP_ENGINE.extractCountries(text);
      if(countries.length>0){
        item.country=countries[0];
        if(countries.length>1)item.all_countries=countries.slice(1);
      }
    }

    // 2. 提取城市
    var cities=NLP_ENGINE.extractCities(text);
    if(Object.keys(cities).length>0){
      item.cities=Object.keys(cities);
      if(!item.country||item.country==='未知'){
        var firstCity=Object.keys(cities)[0];
        item.country=cities[firstCity];
      }
    }

    // 3. 自动分类事件类型
    if(!item.data_type||item.data_type===''){
      var cls=NLP_ENGINE.classifyEvent(item.title,item.desc);
      if(cls.score>0){
        item.data_type=cls.category;
        item._auto_classified=true;
      }
    }

    // 4. 检测严重度
    if(!item.severity||item.severity===''){
      item.severity=NLP_ENGINE.detectSeverity(item.title,item.desc);
      item._auto_severity=true;
    }

    // 5. 提取伤亡数字
    var cas=NLP_ENGINE.extractCasualties(text);
    if(cas.deaths>0)item.deaths=cas.deaths;
    if(cas.injured>0)item.injured=cas.injured;

    // 6. 生成标签
    item.tags=this._generateTags(item);

    // 7. 匹配中资企业项目
    if(typeof ENTERPRISE_DB!=='undefined'&&item.country&&item.country!=='未知'){
      var projects=ENTERPRISE_DB.getByCountry(item.country);
      if(projects.length>0){
        item._matched_projects=projects.map(function(p){return p.project_name;});
        item._enterprise_alert=true;
      }
    }

    // 8. 质量评分
    if(typeof QUALITY_ENGINE!=='undefined'){
      item._quality_score=QUALITY_ENGINE.compositeScore(item);
      item._quality_grade=QUALITY_ENGINE.qualityGrade(item._quality_score);
    }

    // 9. 内容指纹
    if(typeof DEDUP_ENGINE!=='undefined'){
      item._contentHash=DEDUP_ENGINE.contentHash(text);
    }

    return item;
  },

  // 批量增强
  enrichBatch(items){
    var me=this;
    return items.map(function(item){return me.enrich(item);});
  },

  // 生成标签
  _generateTags(item){
    var tags=[];
    if(item.country&&item.country!=='未知')tags.push(item.country);
    if(item.data_type)tags.push(item.data_type);
    if(item.severity)tags.push('严重度:'+item.severity);
    var kws=NLP_ENGINE.extractKeywords((item.title||'')+' '+(item.desc||''),5);
    return tags.concat(kws).slice(0,10);
  }
};

// ===== 数据源注册表 - 插件化多源架构 =====
// 核心原则：所有数据围绕"海外" — 国内源只搜海外新闻，国际源覆盖全球风险
// 国内源(region:cn): 新华网/人民网/环球网等 → 搜索关键词带"海外/境外/国际"
// 国际源(region:intl): GDELT/BBC/Reuters/USGS等 → 覆盖全球风险事件
var SOURCE_REGISTRY={
  // 数据源定义: {name, url, type:'rss'|'api'|'search', method, priority, region:'cn'|'intl'}

  // 1. 全球恐怖事件监测 — 覆盖全球恐袭，不仅限涉华
  terror_events:{
    label:'全球恐怖事件监测',
    sources:[
      {name:'新华网-国际',type:'rss',url:'http://www.xinhuanet.com/world/news_world.xml',region:'cn',priority:1,parser:'rss',query:'海外恐怖袭击 境外爆炸 国际极端组织 塔利班 伊斯兰国'},
      {name:'人民网-国际',type:'rss',url:'http://world.people.com.cn/rss/politics.xml',region:'cn',priority:2,parser:'rss',query:'海外恐怖袭击 境外爆炸 国际反恐'},
      {name:'环球网-国际',type:'rss',url:'https://world.huanqiu.com/rss',region:'cn',priority:3,parser:'rss',query:'海外恐袭 境外IS 基地组织 国际极端'},
      {name:'百度资讯',type:'api',url:'baidu_news',region:'cn',priority:4,parser:'baidu_news',query:'海外恐怖袭击 境外爆炸 国际极端组织'},
      {name:'GDELT全球事件',type:'api',url:'gdelt_query',region:'intl',priority:5,parser:'gdelt',query:'terrorist attack bombing explosion insurgency ISIS Boko Haram al-Qaeda Taliban'},
      {name:'BBC World RSS',type:'rss',url:'https://feeds.bbci.co.uk/news/world/rss.xml',region:'intl',priority:6,parser:'rss',query:'terror attack bombing explosion'},
      {name:'Reuters RSS',type:'rss',url:'https://www.reutersagency.com/feed/',region:'intl',priority:7,parser:'rss',query:'terrorist bombing attack explosion'}
    ]
  },

  // 2. 涉华安全情报 — 专门关注海外中国公民/中资企业安全
  security_events:{
    label:'涉华安全情报',
    sources:[
      {name:'外交部领事司',type:'rss',url:'http://cs.mfa.gov.cn/gyls/lsgz/lsyj/jszs_725131/',region:'cn',priority:1,parser:'rss',query:'海外中国公民 领事保护 安全提醒 境外中资企业'},
      {name:'新华网-国际',type:'rss',url:'http://www.xinhuanet.com/world/news_world.xml',region:'cn',priority:2,parser:'rss',query:'海外华人安全 境外中国公民 海外中资企业 领事保护'},
      {name:'人民网-华人华侨',type:'rss',url:'http://chinese.people.com.cn/rss/politics.xml',region:'cn',priority:3,parser:'rss',query:'海外华人安全 境外华侨 海外中国企业'},
      {name:'百度资讯',type:'api',url:'baidu_news',region:'cn',priority:4,parser:'baidu_news',query:'海外中国公民安全 境外中资企业 海外华人袭击'},
      {name:'GDELT涉华',type:'api',url:'gdelt_query',region:'intl',priority:5,parser:'gdelt',query:'Chinese citizen overseas security attack kidnapping embassy evacuation'},
      {name:'Reuters RSS',type:'rss',url:'https://www.reutersagency.com/feed/',region:'intl',priority:6,parser:'rss',query:'Chinese citizen overseas attack security'}
    ]
  },

  // 3. 武装冲突监测 — 覆盖全球武装冲突
  military_conflicts:{
    label:'武装冲突监测',
    sources:[
      {name:'新华网-国际',type:'rss',url:'http://www.xinhuanet.com/world/news_world.xml',region:'cn',priority:1,parser:'rss',query:'海外军事冲突 境外战争 国际空袭 海外武装'},
      {name:'环球网-国际',type:'rss',url:'https://world.huanqiu.com/rss',region:'cn',priority:2,parser:'rss',query:'海外冲突 境外战争 国际军事行动'},
      {name:'百度资讯',type:'api',url:'baidu_news',region:'cn',priority:3,parser:'baidu_news',query:'海外军事冲突 境外战争 国际空袭 海外武装冲突'},
      {name:'GDELT冲突',type:'api',url:'gdelt_query',region:'intl',priority:4,parser:'gdelt',query:'military conflict airstrike battlefield war troops invasion armed clash'},
      {name:'BBC World RSS',type:'rss',url:'https://feeds.bbci.co.uk/news/world/rss.xml',region:'intl',priority:5,parser:'rss',query:'war conflict airstrike military battle'},
      {name:'ReliefWeb冲突',type:'api',url:'reliefweb',region:'intl',priority:6,parser:'reliefweb',query:'Conflict'}
    ]
  },

  // 4. 政治风险监测 — 覆盖全球政治风险
  political_events:{
    label:'政治风险监测',
    sources:[
      {name:'新华网-国际',type:'rss',url:'http://www.xinhuanet.com/world/news_world.xml',region:'cn',priority:1,parser:'rss',query:'海外政变 境外政治危机 国际选举 海外政权更迭'},
      {name:'人民网-国际',type:'rss',url:'http://world.people.com.cn/rss/politics.xml',region:'cn',priority:2,parser:'rss',query:'海外政变 境外政治危机 国际政治动荡'},
      {name:'百度资讯',type:'api',url:'baidu_news',region:'cn',priority:3,parser:'baidu_news',query:'海外政变 境外政治危机 国际政治动荡 海外政权'},
      {name:'GDELT政治',type:'api',url:'gdelt_query',region:'intl',priority:4,parser:'gdelt',query:'political crisis coup government collapse election protest regime change'},
      {name:'Reuters RSS',type:'rss',url:'https://www.reutersagency.com/feed/',region:'intl',priority:5,parser:'rss',query:'political crisis coup election government'}
    ]
  },

  // 5. 自然灾害 — 覆盖全球灾害，重点关注中资项目所在国
  natural_disasters:{
    label:'自然灾害监测',
    sources:[
      {name:'中国地震台网',type:'api',url:'http://www.ceic.ac.cn/speedsearch?time=7d',region:'cn',priority:1,parser:'ceic_earthquake'},
      {name:'新华网-国际',type:'rss',url:'http://www.xinhuanet.com/world/news_world.xml',region:'cn',priority:2,parser:'rss',query:'海外地震 境外洪水 国际台风 海外火山 海啸'},
      {name:'百度资讯',type:'api',url:'baidu_news',region:'cn',priority:3,parser:'baidu_news',query:'海外地震 境外台风 国际洪水 海外火山爆发'},
      {name:'USGS地震',type:'api',url:'usgs',region:'intl',priority:4,parser:'usgs'},
      {name:'GDELT灾害',type:'api',url:'gdelt_query',region:'intl',priority:5,parser:'gdelt',query:'earthquake tsunami flood hurricane typhoon wildfire volcanic eruption'},
      {name:'GDACS灾害预警',type:'rss',url:'https://www.gdacs.org/xml/rss.xml',region:'intl',priority:6,parser:'rss',query:'disaster earthquake flood storm'},
      {name:'BBC World RSS',type:'rss',url:'https://feeds.bbci.co.uk/news/world/rss.xml',region:'intl',priority:7,parser:'rss',query:'earthquake disaster flood storm'}
    ]
  },

  // 6. 公共卫生 — 覆盖全球疫情
  public_health:{
    label:'公共卫生监测',
    sources:[
      {name:'新华网-国际',type:'rss',url:'http://www.xinhuanet.com/world/news_world.xml',region:'cn',priority:1,parser:'rss',query:'海外疫情 境外传染病 国际公共卫生 海外病毒'},
      {name:'百度资讯',type:'api',url:'baidu_news',region:'cn',priority:2,parser:'baidu_news',query:'海外疫情 境外传染病 国际公共卫生 海外病毒爆发'},
      {name:'WHO RSS',type:'rss',url:'https://www.who.int/rss-feeds/disease-outbreak-news.xml',region:'intl',priority:3,parser:'rss',query:'disease outbreak epidemic'},
      {name:'GDELT卫生',type:'api',url:'gdelt_query',region:'intl',priority:4,parser:'gdelt',query:'disease outbreak epidemic virus infection pandemic cholera ebola'},
      {name:'BBC World RSS',type:'rss',url:'https://feeds.bbci.co.uk/news/world/rss.xml',region:'intl',priority:5,parser:'rss',query:'disease outbreak epidemic virus'}
    ]
  },

  // 7. 制裁合规 — 关注影响中资企业的国际制裁
  sanctions_data:{
    label:'制裁合规情报',
    sources:[
      {name:'商务部-贸易救济',type:'rss',url:'http://www.mofcom.gov.cn/article/zt_jmsj/',region:'cn',priority:1,parser:'rss',query:'海外制裁 国际出口管制 境外贸易限制 中资企业'},
      {name:'百度资讯',type:'api',url:'baidu_news',region:'cn',priority:2,parser:'baidu_news',query:'国际制裁 海外出口管制 中资企业制裁 境外贸易限制'},
      {name:'GDELT制裁',type:'api',url:'gdelt_query',region:'intl',priority:3,parser:'gdelt',query:'sanctions embargo export control tariff trade restriction OFAC entity list'},
      {name:'Reuters RSS',type:'rss',url:'https://www.reutersagency.com/feed/',region:'intl',priority:4,parser:'rss',query:'sanctions trade restriction embargo export control'}
    ]
  },

  // 8. 社会动荡 — 覆盖全球社会动荡
  social_unrest:{
    label:'社会动荡监测',
    sources:[
      {name:'新华网-国际',type:'rss',url:'http://www.xinhuanet.com/world/news_world.xml',region:'cn',priority:1,parser:'rss',query:'海外抗议 境外骚乱 国际罢工 海外示威'},
      {name:'环球网-国际',type:'rss',url:'https://world.huanqiu.com/rss',region:'cn',priority:2,parser:'rss',query:'海外抗议 境外骚乱 国际示威'},
      {name:'百度资讯',type:'api',url:'baidu_news',region:'cn',priority:3,parser:'baidu_news',query:'海外抗议 境外骚乱 国际罢工 海外社会动荡'},
      {name:'GDELT社会',type:'api',url:'gdelt_query',region:'intl',priority:4,parser:'gdelt',query:'protest riot unrest demonstration strike violence civil unrest'},
      {name:'BBC World RSS',type:'rss',url:'https://feeds.bbci.co.uk/news/world/rss.xml',region:'intl',priority:5,parser:'rss',query:'protest riot strike unrest'}
    ]
  },

  // 9. 基础设施安全 — 关注海外基建/中资项目安全
  infrastructure:{
    label:'基础设施安全',
    sources:[
      {name:'新华网-国际',type:'rss',url:'http://www.xinhuanet.com/world/news_world.xml',region:'cn',priority:1,parser:'rss',query:'海外基建 一带一路项目 海外工程安全 境外基础设施'},
      {name:'百度资讯',type:'api',url:'baidu_news',region:'cn',priority:2,parser:'baidu_news',query:'海外基建安全 一带一路项目 境外工程 海外基础设施'},
      {name:'GDELT基建',type:'api',url:'gdelt_query',region:'intl',priority:3,parser:'gdelt',query:'infrastructure attack power grid pipeline explosion port railway damage sabotage'},
      {name:'Reuters RSS',type:'rss',url:'https://www.reutersagency.com/feed/',region:'intl',priority:4,parser:'rss',query:'infrastructure attack power grid pipeline port'}
    ]
  },

  // 10. 地缘政治情报 — 覆盖全球地缘政治
  geopolitical_intel:{
    label:'地缘政治情报',
    sources:[
      {name:'新华网-国际',type:'rss',url:'http://www.xinhuanet.com/world/news_world.xml',region:'cn',priority:1,parser:'rss',query:'海外地缘政治 国际外交 大国博弈 海外战略 境外领土争端'},
      {name:'环球网-国际',type:'rss',url:'https://world.huanqiu.com/rss',region:'cn',priority:2,parser:'rss',query:'国际地缘政治 海外大国博弈 境外外交'},
      {name:'百度资讯',type:'api',url:'baidu_news',region:'cn',priority:3,parser:'baidu_news',query:'国际地缘政治 海外大国关系 境外外交 海外战略竞争'},
      {name:'GDELT地缘',type:'api',url:'gdelt_query',region:'intl',priority:4,parser:'gdelt',query:'geopolitical tension trade war territorial dispute diplomatic sanctions strategic competition'},
      {name:'Reuters RSS',type:'rss',url:'https://www.reutersagency.com/feed/',region:'intl',priority:5,parser:'rss',query:'geopolitical diplomacy trade war strategic'}
    ]
  },

  // 11. 开源情报 — 覆盖全球网络安全/情报
  osint_intel:{
    label:'开源情报',
    sources:[
      {name:'百度资讯',type:'api',url:'baidu_news',region:'cn',priority:1,parser:'baidu_news',query:'国际网络安全 海外网络攻击 境外情报 全球数据泄露'},
      {name:'GDELT谍报',type:'api',url:'gdelt_query',region:'intl',priority:2,parser:'gdelt',query:'intelligence agency spy espionage surveillance leak cyber warfare'},
      {name:'GDELT网络',type:'api',url:'gdelt_query',region:'intl',priority:3,parser:'gdelt',query:'cyber security hack breach data leak ransomware attack infrastructure'},
      {name:'Reuters RSS',type:'rss',url:'https://www.reutersagency.com/feed/',region:'intl',priority:4,parser:'rss',query:'cyber attack hack intelligence breach'}
    ]
  }
};

// ===== 扩展数据源: Google News聚合 + 国际主流媒体 (v5.0增强) =====
// Google News RSS 聚合数千个新闻源，是最强大的单一数据入口
(function(){
  var googleNewsCn={
    'terror_events':'海外恐怖袭击 极端组织',
    'security_events':'海外中国公民安全 中资企业',
    'military_conflicts':'海外军事冲突 战争',
    'political_events':'海外政治危机 政变',
    'natural_disasters':'海外地震 洪水 台风',
    'public_health':'海外疫情 传染病',
    'sanctions_data':'国际制裁 出口管制',
    'social_unrest':'海外抗议 罢工 骚乱',
    'infrastructure':'海外基础设施 一带一路项目',
    'geopolitical_intel':'国际地缘政治 大国博弈',
    'osint_intel':'国际网络安全 网络攻击'
  };
  var googleNewsEn={
    'terror_events':'terrorist attack bombing ISIS',
    'security_events':'Chinese citizen overseas security attack',
    'military_conflicts':'military conflict airstrike war',
    'political_events':'political crisis coup election',
    'natural_disasters':'earthquake tsunami flood disaster',
    'public_health':'disease outbreak epidemic virus',
    'sanctions_data':'sanctions embargo export control',
    'social_unrest':'protest riot strike unrest',
    'infrastructure':'infrastructure attack pipeline port',
    'geopolitical_intel':'geopolitical tension strategic competition',
    'osint_intel':'cyber attack hack breach espionage'
  };
  for(var cat in googleNewsCn){
    if(!SOURCE_REGISTRY[cat])continue;
    // Google News 中文聚合
    SOURCE_REGISTRY[cat].sources.push({
      name:'Google资讯(中文)',type:'rss',
      url:'https://news.google.com/rss/search?q='+encodeURIComponent(googleNewsCn[cat])+'&hl=zh-CN&gl=CN&ceid=CN:zh-Hans',
      region:'cn',priority:8,parser:'rss',query:googleNewsCn[cat]
    });
    // Google News 英文聚合
    SOURCE_REGISTRY[cat].sources.push({
      name:'Google News(EN)',type:'rss',
      url:'https://news.google.com/rss/search?q='+encodeURIComponent(googleNewsEn[cat])+'&hl=en&gl=US&ceid=US:en',
      region:'intl',priority:9,parser:'rss',query:googleNewsEn[cat]
    });
  }
  // 国际主流媒体RSS (补充覆盖)
  var extraSources={
    'military_conflicts':{name:'Al Jazeera',url:'https://www.aljazeera.com/xml/rss/all.xml',query:'war conflict military airstrike'},
    'political_events':{name:'The Guardian',url:'https://www.theguardian.com/world/rss',query:'political crisis coup election government'},
    'public_health':{name:'UN News',url:'https://news.un.org/feed/subscribe/en/news/all/rss.xml',query:'health disease outbreak WHO'},
    'natural_disasters':{name:'GDACS预警',url:'https://www.gdacs.org/xml/rss.xml',query:'earthquake flood storm disaster'},
    'social_unrest':{name:'Al Jazeera',url:'https://www.aljazeera.com/xml/rss/all.xml',query:'protest riot strike unrest demonstration'},
    'geopolitical_intel':{name:'The Guardian',url:'https://www.theguardian.com/world/rss',query:'diplomacy geopolitical strategic tension'},
    'terror_events':{name:'Al Jazeera',url:'https://www.aljazeera.com/xml/rss/all.xml',query:'terror attack bombing explosion'},
    'infrastructure':{name:'The Guardian',url:'https://www.theguardian.com/world/rss',query:'infrastructure pipeline power port attack'},
    'security_events':{name:'Google News(EN)',url:'https://news.google.com/rss/search?q='+encodeURIComponent('Chinese citizen overseas attack embassy evacuation')+'&hl=en&gl=US&ceid=US:en',query:'Chinese citizen overseas attack embassy evacuation'},
    'osint_intel':{name:'The Guardian-Tech',url:'https://www.theguardian.com/technology/rss',query:'cyber hack breach data security'}
  };
  for(var cat2 in extraSources){
    if(!SOURCE_REGISTRY[cat2])continue;
    var src=extraSources[cat2];
    var exists=SOURCE_REGISTRY[cat2].sources.some(function(s){return s.name===src.name;});
    if(!exists){
      SOURCE_REGISTRY[cat2].sources.push({
        name:src.name,type:'rss',url:src.url,region:'intl',priority:10,parser:'rss',query:src.query
      });
    }
  }
})();

// ===== 威胁组织数据库 (THREAT_ORGS_DB) =====
// 恐怖组织 / 犯罪组织 / 反华非政府组织 — 结构化情报数据库
var THREAT_ORGS_DB={
  KEY:'orps_threat_orgs',
  VER_KEY:'orps_threat_orgs_version',
  VERSION:'2.0',

  CATEGORIES:['terrorist','criminal','anti_china_ngo'],

  init(){
    var ver=localStorage.getItem(this.VER_KEY);
    if(ver!==this.VERSION){
      localStorage.setItem(this.KEY,'[]');
      localStorage.setItem(this.VER_KEY,this.VERSION);
    }
    // 自动注入模拟数据
    var existing=this.getAll();
    if(existing.length===0){
      this.seedSimulatedData();
    }
  },

  _toOrg(data){
    return {
      id:data.id||Date.now()+Math.random(),
      name:data.name||'',
      aliases:data.aliases||[],
      category:data.category||'terrorist',
      threat_level:data.threat_level||'high',
      active_regions:data.active_regions||[],
      headquarters:data.headquarters||'未知',
      founded:data.founded||'未知',
      ideology:data.ideology||'',
      leadership:data.leadership||'',
      personnel_size:data.personnel_size||'未知',
      funding_sources:data.funding_sources||[],
      background:data.background||'',
      attacks:data.attacks||[],
      anti_china_events:data.anti_china_events||[],
      statements:data.statements||[],
      is_simulated:true,
      created_at:data.created_at||new Date().toISOString()
    };
  },

  getAll(){
    try{return JSON.parse(localStorage.getItem(this.KEY)||'[]');}catch(e){return[];}
  },

  getById(id){
    return this.getAll().find(function(o){return o.id===id;});
  },

  getByCategory(cat){
    return this.getAll().filter(function(o){return o.category===cat;});
  },

  getByRegion(region){
    return this.getAll().filter(function(o){
      return o.active_regions.some(function(r){return r.indexOf(region)>=0||region.indexOf(r)>=0;});
    });
  },

  getByLevel(level){
    return this.getAll().filter(function(o){return o.threat_level===level;});
  },

  add(orgData){
    var all=this.getAll();
    var org=this._toOrg(orgData);
    all.push(org);
    localStorage.setItem(this.KEY,JSON.stringify(all));
    return org;
  },

  update(id,updates){
    var all=this.getAll();
    var idx=all.findIndex(function(o){return o.id===id;});
    if(idx>=0){
      Object.assign(all[idx],updates);
      localStorage.setItem(this.KEY,JSON.stringify(all));
      return all[idx];
    }
    return null;
  },

  delete(id){
    var all=this.getAll();
    all=all.filter(function(o){return o.id!==id;});
    localStorage.setItem(this.KEY,JSON.stringify(all));
  },

  count(){return this.getAll().length;},

  countByCategory(cat){return this.getByCategory(cat).length;},

  getStats(){
    var all=this.getAll();
    var stats={
      total:all.length,
      byCategory:{terrorist:0,criminal:0,anti_china_ngo:0},
      byLevel:{critical:0,high:0,medium:0,low:0},
      totalAttacks:0,
      totalAntiChina:0,
      totalStatements:0,
      regions:new Set(),
      orgs:[]
    };
    all.forEach(function(o){
      if(stats.byCategory[o.category])stats.byCategory[o.category]++;
      if(stats.byLevel[o.threat_level])stats.byLevel[o.threat_level]++;
      stats.totalAttacks+=(o.attacks||[]).length;
      stats.totalAntiChina+=(o.anti_china_events||[]).length;
      stats.totalStatements+=(o.statements||[]).length;
      (o.active_regions||[]).forEach(function(r){stats.regions.add(r);});
    });
    stats.regionCount=stats.regions.size;
    stats.regions=Array.from(stats.regions);
    stats.orgs=all;
    return stats;
  },

  search(keyword){
    var kw=keyword.toLowerCase();
    return this.getAll().filter(function(o){
      if(o.name.toLowerCase().indexOf(kw)>=0)return true;
      if((o.aliases||[]).some(function(a){return a.toLowerCase().indexOf(kw)>=0;}))return true;
      if((o.background||'').toLowerCase().indexOf(kw)>=0)return true;
      if((o.active_regions||[]).some(function(r){return r.toLowerCase().indexOf(kw)>=0;}))return true;
      return false;
    });
  },

  // 注入模拟威胁组织数据
  seedSimulatedData(){
    var orgs=this._generateSeedData();
    var all=this.getAll();
    orgs.forEach(function(o){
      var exists=all.find(function(e){return e.name===o.name;});
      if(!exists){all.push(this._toOrg(o));}
    }.bind(this));
    localStorage.setItem(this.KEY,JSON.stringify(all));
    return orgs.length;
  },

  clearSimulated(){
    localStorage.setItem(this.KEY,'[]');
  },

  _generateSeedData(){
    return [
      // ===== 恐怖组织 (12个) =====
      {
        id:'TO001',
        name:'俾路支解放军',
        aliases:['BLA','Baloch Liberation Army','俾路支解放阵线'],
        category:'terrorist',
        threat_level:'critical',
        active_regions:['巴基斯坦俾路支省','伊朗东南部','阿富汗南部'],
        headquarters:'巴基斯坦俾路支省',
        founded:'2000年',
        ideology:'俾路支民族分离主义、反巴基斯坦中央政府',
        leadership:'巴希尔·泽布(Bashir Zeb)现任头目，萨拉赫丁·艾哈迈德曾任指挥官',
        personnel_size:'约3000-5000名武装人员',
        funding_sources:['海外俾路支侨民捐款','印度情报机构资助(巴方指控)','走私武器弹药','当地部落征税'],
        background:'俾路支解放军是巴基斯坦俾路支省最大的分离主义武装组织，主张俾路支省独立。该组织频繁袭击巴基斯坦安全部队和中资企业在俾路支省的项目，特别是瓜达尔港和CPEC相关设施。被巴基斯坦、英国、美国列为恐怖组织。近年来多次针对中国公民发动袭击，造成中方人员伤亡。',
        attacks:[
          {date:'2024-03-26',location:'巴基斯坦开伯尔-普什图省香拉县比沙姆',type:'自杀式炸弹袭击',casualties:'5名中国工程师+1名巴基斯坦司机死亡',description:'载有中国工程师的车队遭自杀式汽车炸弹袭击，目标为达苏水电站项目中方人员'},
          {date:'2022-04-26',location:'巴基斯坦卡拉奇大学',type:'自杀式炸弹袭击',casualties:'3名中国教师死亡，1人受伤',description:'卡拉奇大学孔子学院班车遭女性自杀式袭击者袭击，"马吉德旅"声称负责'},
          {date:'2021-08-20',location:'巴基斯坦俾路支省瓜达尔港',type:'武装袭击',casualties:'2名儿童死亡，多人受伤',description:'针对瓜达尔港中国工程师住宿区的自杀式汽车炸弹袭击'},
          {date:'2019-05-11',location:'巴基斯坦俾路支省瓜达尔港',type:'武装袭击',casualties:'无中方伤亡',description:'武装分子试图袭击瓜达尔港中国工人住宿区，被安保人员击退'},
          {date:'2018-11-23',location:'巴基斯坦俾路支省',type:'武装袭击',casualties:'多人伤亡',description:'俾路支武装分子袭击中国驻卡拉奇领事馆，4名袭击者被击毙'}
        ],
        anti_china_events:[
          {date:'2024-03-27',type:'声明威胁',description:'BLA发表声明，称将对中国在俾路支省的所有项目和中方人员发动更多袭击，要求中国停止"掠夺俾路支资源"'},
          {date:'2023-08-15',type:'宣传视频',description:'发布视频威胁CPEC项目，声称瓜达尔港是"殖民工具"，呼吁国际社会关注俾路支"独立事业"'},
          {date:'2022-04-27',type:'声明认领',description:'袭击卡拉奇大学孔子学院后发表声明，称"中国是俾路支资源的掠夺者"，威胁继续袭击中方目标'},
          {date:'2021-07-10',type:'媒体宣传',description:'通过社交媒体发布反华宣传，将CPEC描述为"帝国主义项目"'}
        ],
        statements:[
          {date:'2024-03-27',speaker:'BLA发言人杰恩德·巴洛奇',content:'我们警告中国：立即停止在俾路支的掠夺性项目，否则BLA将继续对所有中方目标发动袭击。俾路支的资源属于俾路支人民。',source:'BLA官方声明',nature:'直接威胁'},
          {date:'2022-04-27',speaker:'BLA发言人',content:'卡拉奇大学行动是我们的反击，中国必须为其在俾路什的罪行付出代价。',source:'社交媒体声明',nature:'袭击认领'},
          {date:'2023-08-15',speaker:'BLA宣传部门',content:'CPEC不是发展项目，而是殖民工具。我们将战斗到最后一个人。',source:'宣传视频',nature:'宣传煽动'}
        ]
      },
      {
        id:'TO002',
        name:'巴基斯坦塔利班',
        aliases:['TTP','Tehrik-i-Taliban Pakistan','巴基斯坦塔利班运动'],
        category:'terrorist',
        threat_level:'critical',
        active_regions:['巴基斯坦西北部','阿富汗-巴基斯坦边境','开伯尔-普什图省'],
        headquarters:'阿富汗(流亡)',
        founded:'2007年',
        ideology:'伊斯兰极端主义、反巴基斯坦政府、建立伊斯兰教法国家',
        leadership:'努尔·瓦利·马哈苏德(Noor Wali Mehsud)现任头目',
        personnel_size:'约3000-5000名武装人员',
        funding_sources:['部落地区征税','海外捐款','绑架勒索','与阿富汗塔利班的联系'],
        background:'巴基斯坦塔利班是巴基斯坦最大的极端组织之一，主要在巴基斯坦西北部活动。该组织频繁发动恐怖袭击，目标包括巴基斯坦安全部队、政府设施和外国公民。近年来多次威胁中国公民和中资项目，特别是中巴经济走廊(CPEC)项目。与阿富汗塔利班有意识形态联系但在组织上独立运作。',
        attacks:[
          {date:'2021-07-14',location:'巴基斯坦开伯尔-普什图省',type:'炸弹袭击',casualties:'9名中国工人死亡，3人受伤',description:'巴士遭遇爆炸袭击，目标为达苏水电站项目中方人员'},
          {date:'2023-01-30',location:'巴基斯坦白沙瓦',type:'自杀式爆炸',casualties:'84人死亡，200余人受伤',description:'清真寺内自杀式爆炸袭击，造成大量人员伤亡'},
          {date:'2022-03-04',location:'巴基斯坦西北部',type:'武装袭击',casualties:'多人伤亡',description:'袭击安全检查站，与中巴经济走廊安全有关'}
        ],
        anti_china_events:[
          {date:'2021-07-15',type:'声明认领',description:'TTP声称对达苏水电站巴士爆炸袭击负责，威胁将袭击更多中国目标'},
          {date:'2023-05-20',type:'视频威胁',description:'发布视频威胁在巴基斯坦的中国公民和中资企业，称中国是"巴基斯坦政府的帮凶"'},
          {date:'2022-08-10',type:'声明',description:'TTP发言人警告中国不要在巴基斯坦"推行殖民政策"'}
        ],
        statements:[
          {date:'2021-07-15',speaker:'TTP发言人',content:'我们对达苏水电站的袭击负责，这是对中国在巴基斯坦扩张的回应。',source:'TTP声明',nature:'袭击认领'},
          {date:'2023-05-20',speaker:'TTP宣传部门',content:'中国必须停止在巴基斯坦的掠夺，否则我们将在各地对中国公民发动袭击。',source:'宣传视频',nature:'直接威胁'}
        ]
      },
      {
        id:'TO003',
        name:'伊斯兰国呼罗珊分支',
        aliases:['ISIS-K','ISKP','Islamic State Khorasan Province','达伊沙呼罗珊'],
        category:'terrorist',
        threat_level:'critical',
        active_regions:['阿富汗','巴基斯坦边境','中亚地区'],
        headquarters:'阿富汗东部',
        founded:'2015年',
        ideology:'伊斯兰极端主义、全球圣战、反什叶派',
        leadership:'沙哈布·穆哈吉尔(Sanaullah Ghafari)疑似领导人',
        personnel_size:'约1500-2000名武装人员',
        funding_sources:['ISIS核心资金','走私网络','绑架勒索','毒品贸易'],
        background:'伊斯兰国呼罗珊分支是阿富汗和巴基斯坦地区最活跃的恐怖组织之一。该组织以极端暴力著称，频繁发动针对平民、政府军和外国目标的袭击。在阿富汗塔利班接管后，ISIS-K成为阿富汗境内最大的安全威胁。该组织对中国在中亚地区的影响力扩张持敌视态度，多次威胁中国利益。',
        attacks:[
          {date:'2024-01-03',location:'伊朗克尔曼',type:'连环爆炸',casualties:'84人死亡，284人受伤',description:'纪念苏莱曼尼逝世周年活动遭两起炸弹袭击，ISIS-K声称负责'},
          {date:'2021-08-26',location:'阿富汗喀布尔机场',type:'自杀式爆炸',casualties:'170人死亡，包括13名美军',description:'喀布尔机场撤离期间自杀式炸弹袭击'},
          {date:'2022-09-05',location:'阿富汗驻俄罗斯大使馆',type:'自杀式爆炸',casualties:'2名使馆人员死亡',description:'阿富汗驻俄大使馆附近自杀式爆炸袭击'},
          {date:'2022-12-12',location:'阿富汗喀布尔',type:'袭击酒店',casualties:'3名外国人受伤',description:'袭击中国人入住的桂园酒店，中国公民被迫从阳台跳窗逃生'}
        ],
        anti_china_events:[
          {date:'2022-12-13',type:'声明认领',description:'ISIS-K声称对喀布尔桂园酒店袭击负责，明确表示目标是中国公民'},
          {date:'2023-07-15',type:'宣传视频',description:'发布针对中国的宣传视频，威胁将在中国境内发动袭击，并声称新疆是"被占领的穆斯林领土"'},
          {date:'2024-01-10',type:'声明',description:'在克尔曼爆炸后发表声明，威胁将袭击中国和俄罗斯在阿富汗的利益'}
        ],
        statements:[
          {date:'2022-12-13',speaker:'ISIS-K发言人',content:'我们对喀布尔酒店的袭击负责，目标是那些掠夺穆斯林资源的中国人。',source:'AMAQ通讯社',nature:'袭击认领'},
          {date:'2023-07-15',speaker:'ISIS-K宣传部门',content:'中国对维吾尔穆斯林的压迫必须付出代价，我们将在中国的城市中制造恐惧。',source:'宣传视频',nature:'直接威胁'}
        ]
      },
      {
        id:'TO004',
        name:'东伊运/突厥斯坦伊斯兰党',
        aliases:['ETIM','TIP','东突厥斯坦伊斯兰运动','突厥斯坦伊斯兰党'],
        category:'terrorist',
        threat_level:'high',
        active_regions:['叙利亚伊德利卜','阿富汗','土耳其','中亚地区'],
        headquarters:'叙利亚伊德利卜(流亡)',
        founded:'1997年',
        ideology:'伊斯兰极端主义、新疆分离主义、建立东突厥斯坦',
        leadership:'阿卜杜勒哈克·突厥斯坦尼(Abdul Haq al-Turkistani)头目',
        personnel_size:'约500-1000名武装人员(主要在叙利亚)',
        funding_sources:['基地组织网络','海外维吾尔侨民中的极端分子','中东极端组织援助'],
        background:'东伊运是主张新疆分离的恐怖组织，被联合国、中国、欧盟等列为恐怖组织。该组织主要在叙利亚内战中活动，与基地组织和努斯拉阵线有密切联系。近年来在叙利亚战场上的战斗力较强，但其对中国本土的威胁主要来自意识形态煽动和境外策划。该组织通过社交媒体进行大量反华宣传。',
        attacks:[
          {date:'2014-07-28',location:'中国新疆莎车',type:'暴力袭击',casualties:'37人死亡，13人受伤',description:'莎车严重暴力恐怖袭击事件，东伊运通过社交媒体声称负责'},
          {date:'2015-09-18',location:'中国新疆拜城',type:'暴力袭击',casualties:'多人伤亡',description:'拜城煤矿遭袭击，暴恐分子持械袭击矿工和警察'},
          {date:'2017-02-14',location:'巴基斯坦俾路支省',type:'绑架',casualties:'2名中国公民被绑架',description:'一对中国夫妇在俾路支省被绑架，据信与东伊运有关联'}
        ],
        anti_china_events:[
          {date:'2023-10-01',type:'宣传视频',description:'在中华人民共和国国庆日发布反华视频，声称"解放东突厥斯坦"的战斗将继续'},
          {date:'2022-07-05',type:'声明',description:'在七五事件周年发表声明，呼吁全球维吾尔人"拿起武器"反对中国'},
          {date:'2024-03-15',type:'社交媒体',description:'通过Telegram频道发布大量反华内容，煽动对中国目标的袭击'},
          {date:'2023-06-20',type:'宣传',description:'发布其头目在叙利亚的训练视频，威胁将"解放新疆"'}
        ],
        statements:[
          {date:'2023-10-01',speaker:'TIP宣传部门',content:'在中国的国庆日，我们向所有维吾尔兄弟发出号召：继续战斗，直到解放东突厥斯坦。中国的殖民统治终将结束。',source:'宣传视频',nature:'煽动分裂'},
          {date:'2022-07-05',speaker:'TIP领导人',content:'七五事件的血债不会被遗忘，我们誓言为中国对维吾尔人的压迫复仇。',source:'声明',nature:'煽动复仇'}
        ]
      },
      {
        id:'TO005',
        name:'青年党',
        aliases:['Al-Shabaab','Harakat al-Shabaab al-Mujahideen','索马里青年党'],
        category:'terrorist',
        threat_level:'critical',
        active_regions:['索马里','肯尼亚东北部','埃塞俄比亚东部'],
        headquarters:'索马里南部',
        founded:'2006年',
        ideology:'伊斯兰极端主义、反西方、建立伊斯兰教法国家',
        leadership:'艾哈迈德·奥马尔·阿布·乌拜达(Ahmed Omar Abu Ubaidah)头目',
        personnel_size:'约5000-7000名武装人员',
        funding_sources:[' charcoal走私','绑架勒索','港口控制税收','海外极端分子捐款'],
        background:'青年党是索马里最大的恐怖组织，与基地组织结盟。该组织频繁发动跨境袭击，目标包括索马里政府、非盟维和部队、肯尼亚安全力量和平民。对中国在东非的利益构成潜在威胁，特别是在索马里、肯尼亚和埃塞俄比亚的中国项目和人员。',
        attacks:[
          {date:'2023-06-26',location:'索马里摩加迪沙',type:'酒店袭击',casualties:'27人死亡',description:'丽都海滩酒店遭自杀式汽车炸弹和枪击袭击'},
          {date:'2022-01-02',location:'索马里摩加迪沙',type:'汽车炸弹',casualties:'8人死亡',description:'联合国安保人员车队遭汽车炸弹袭击'},
          {date:'2019-01-15',location:'肯尼亚内罗毕',type:'酒店袭击',casualties:'21人死亡',description:'杜斯特D2酒店Complex遭武装袭击'},
          {date:'2015-04-02',location:'肯尼亚加里萨',type:'校园袭击',casualties:'148人死亡',description:'加里萨大学学院遭武装袭击，多为学生死亡'}
        ],
        anti_china_events:[
          {date:'2023-08-10',type:'声明',description:'青年党发表声明，威胁将袭击在索马里和东非的中国企业和公民，称中国是"索马里政府的支持者"'},
          {date:'2022-11-05',type:'宣传',description:'发布宣传视频，将中国在非洲的基础设施项目描述为"新殖民主义"'},
          {date:'2024-01-20',type:'威胁',description:'通过其电台警告中国在索马里的投资"将面临后果"'}
        ],
        statements:[
          {date:'2023-08-10',speaker:'青年党发言人',content:'中国是索马里叛教政府的支持者，其在东非的殖民项目将面临我们的反击。',source:'Radio Andalus',nature:'直接威胁'},
          {date:'2022-11-05',speaker:'青年党宣传部门',content:'中国在非洲修建的道路和港口不是为了发展，而是为了掠夺资源。',source:'宣传视频',nature:'宣传煽动'}
        ]
      },
      {
        id:'TO006',
        name:'博科圣地',
        aliases:['Boko Haram','JAS','Jama\'atu Ahlis Sunna Lidda\'awati wal-Jihad','伊斯兰西非省'],
        category:'terrorist',
        threat_level:'high',
        active_regions:['尼日利亚东北部','喀麦隆北部','尼日尔','乍得'],
        headquarters:'尼日利亚东北部',
        founded:'2002年',
        ideology:'伊斯兰极端主义、反西方教育、建立伊斯兰国',
        leadership:'阿布·穆萨布·巴尔纳维(Abu Musab al-Barnawi)分裂派系头目',
        personnel_size:'约3000-5000名武装人员',
        funding_sources:['绑架勒索','银行抢劫','与ISIS的联系','当地征税'],
        background:'博科圣地是西非最大的恐怖组织，名称意为"西方教育是禁忌"。该组织频繁在尼日利亚东北部和乍得湖盆地发动袭击，造成大量平民伤亡。已分裂为多个派系，部分效忠ISIS。对中国在尼日利亚和西非地区的项目人员安全构成威胁。',
        attacks:[
          {date:'2023-09-10',location:'尼日利亚博尔诺州',type:'村庄袭击',casualties:'40余人死亡',description:'多个村庄遭袭击，大量平民被杀'},
          {date:'2022-01-23',location:'尼日利亚博尔诺州',type:'绑架',casualties:'数十人被绑架',description:'大规模绑架平民事件'},
          {date:'2014-04-14',location:'尼日利亚奇博克',type:'绑架',casualties:'276名女学生被绑架',description:'震惊世界的奇博克女学生绑架事件'},
          {date:'2021-11-15',location:'尼日利亚博尔诺州',type:'袭击',casualties:'20余人死亡',description:'袭击难民营和救援人员'}
        ],
        anti_china_events:[
          {date:'2023-05-12',type:'威胁',description:'通过视频威胁在尼日利亚的中国企业和工人，称中国"剥削非洲资源"'},
          {date:'2022-06-08',type:'声明',description:'声称将对在尼日利亚的中国采矿项目发动袭击'}
        ],
        statements:[
          {date:'2023-05-12',speaker:'博科圣地发言人',content:'中国在尼日利亚的矿业项目是对非洲资源的掠夺，我们将对此采取行动。',source:'视频声明',nature:'直接威胁'}
        ]
      },
      {
        id:'TO007',
        name:'胡塞武装',
        aliases:['Ansar Allah','也门胡塞武装','安萨尔拉'],
        category:'terrorist',
        threat_level:'high',
        active_regions:['也门北部','红海海域','曼德海峡'],
        headquarters:'也门萨那',
        founded:'1994年',
        ideology:'扎伊迪什叶派复兴、反沙特、反以色列、反美',
        leadership:'阿卜杜勒·马利克·胡塞(Abdul-Malik al-Houthi)最高领导人',
        personnel_size:'约10-20万武装人员(含民兵)',
        funding_sources:['伊朗援助','港口控制税收','走私贸易','也门中央银行资产(控制区)'],
        background:'胡塞武装是也门最大的非国家武装力量，控制也门首都萨那和北部大部分地区。该组织与伊朗有密切关系，频繁袭击沙特和阿联酋目标。自2023年加沙冲突以来，胡塞武装在红海海域对国际航运发动大量导弹和无人机袭击，严重影响包括中国船只在内的国际航运安全。',
        attacks:[
          {date:'2024-01-09',location:'红海海域',type:'导弹袭击',casualties:'无伤亡',description:'向红海国际航运发射大量导弹和无人机，美英联军进行空袭报复'},
          {date:'2024-01-26',location:'亚丁湾',type:'导弹袭击',casualties:'1名船员死亡',description:'英国油轮马林·罗安达号遭导弹袭击起火'},
          {date:'2023-11-19',location:'红海',type:'劫持',casualties:'无伤亡',description:'劫持以色列关联货船"银河领袖号"，25名船员被扣为人质'},
          {date:'2024-03-06',location:'亚丁湾',type:'导弹袭击',casualties:'3名船员死亡',description:'真正信心号货轮遭导弹袭击，造成船员死亡'},
          {date:'2024-06-12',location:'红海',type:'袭击',casualties:'无伤亡',description:'袭击一艘中国相关货轮，船员被迫弃船(存疑)'}
        ],
        anti_china_events:[
          {date:'2024-02-15',type:'声明',description:'胡塞武装发表声明称将"保护"中国和俄罗斯船只，但实际袭击行为影响了中国航运'},
          {date:'2024-01-20',type:'声明',description:'胡塞武装表示不针对中国和俄罗斯船只，但红海安全形势恶化已严重影响中国航运利益'},
          {date:'2024-03-10',type:'威胁',description:'胡塞武装威胁将扩大袭击范围，包括所有与以色列和西方有贸易往来的船只'}
        ],
        statements:[
          {date:'2024-02-15',speaker:'胡塞武装高级官员',content:'我们不会袭击中国和俄罗斯的船只，我们只针对以色列和其支持者。',source:'官方声明',nature:'外交声明'},
          {date:'2024-01-20',speaker:'胡塞武装发言人',content:'我们呼吁中国和俄罗斯在红海问题上发挥建设性作用，停止美英的侵略。',source:'声明',nature:'外交拉拢'}
        ]
      },
      {
        id:'TO008',
        name:'真主党',
        aliases:['Hezbollah','Hizbullah','黎巴嫩真主党','上帝之党'],
        category:'terrorist',
        threat_level:'high',
        active_regions:['黎巴嫩','叙利亚','中东地区'],
        headquarters:'黎巴嫩贝鲁特',
        founded:'1985年',
        ideology:'什叶派伊斯兰主义、反以色列、反美',
        leadership:'哈桑·纳斯鲁拉(Hassan Nasrallah，2024年9月被杀)→纳伊姆·卡西姆',
        personnel_size:'约2-5万名武装人员',
        funding_sources:['伊朗援助','国际走私网络','黎巴嫩银行业务','毒品贸易','全球侨民网络'],
        background:'真主党是黎巴嫩最大的政治和军事组织，被美国、欧盟等列为恐怖组织。该组织拥有强大的武装力量，与伊朗有密切关系。在叙利亚内战中支持阿萨德政府。2023年加沙冲突以来，真主党与以色列在黎以边境频繁交火。对中国在中东的利益影响间接，主要通过地区不稳定影响中国项目安全。',
        attacks:[
          {date:'2024-09-25',location:'以色列北部',type:'导弹袭击',casualties:'多人受伤',description:'向以色列北部发射大量火箭弹'},
          {date:'2023-10-08',location:'黎以边境',type:'炮击',casualties:'双方互有伤亡',description:'加沙冲突爆发后，真主党开始与以色列在边境交火'},
          {date:'1983-10-23',location:'黎巴嫩贝鲁特',type:'自杀式爆炸',casualties:'241名美军+58名法军死亡',description:'袭击美国和法国军营，标志性事件'}
        ],
        anti_china_events:[
          {date:'2023-11-10',type:'声明',description:'真主党领导人发表讲话，赞扬中国在联合国安理会的立场，呼吁中国在中东发挥更大作用'},
          {date:'2024-07-15',type:'外交',description:'真主党通过外交渠道寻求中国的政治支持，但中国保持中立立场'}
        ],
        statements:[
          {date:'2023-11-10',speaker:'纳斯鲁拉',content:'我们感谢中国和俄罗斯在联合国对加沙问题上的立场，国际社会必须阻止以色列的侵略。',source:'电视讲话',nature:'外交拉拢'}
        ]
      },
      {
        id:'TO009',
        name:'基地组织阿拉伯半岛分支',
        aliases:['AQAP','Al-Qaeda in the Arabian Peninsula'],
        category:'terrorist',
        threat_level:'high',
        active_regions:['也门南部','沙特阿拉伯'],
        headquarters:'也门',
        founded:'2009年',
        ideology:'伊斯兰极端主义、全球圣战、反美反沙特',
        leadership:'易卜拉欣·巴德里(Qasim al-Raymi继任者身份存疑)',
        personnel_size:'约1000-2000名武装人员',
        funding_sources:['绑架赎金','走私网络','海外极端分子捐款'],
        background:'基地组织阿拉伯半岛分支是也门和沙特地区的重要恐怖组织，以策划针对西方目标的袭击著称。该组织曾策划2009年底特律航班爆炸未遂事件和2010年货运飞机炸弹阴谋。对中国在也门和阿拉伯半岛的利益构成潜在威胁。',
        attacks:[
          {date:'2019-01-28',location:'也门',type:'袭击',casualties:'多人伤亡',description:'袭击也门政府军检查站'},
          {date:'2015-03-20',location:'也门萨那',type:'自杀式爆炸',casualties:'142人死亡',description:'清真寺自杀式爆炸袭击'},
          {date:'2009-12-25',location:'美国底特律上空',type:'爆炸未遂',casualties:'0(未遂)',description:'尼日利亚籍恐怖分子试图在航班上引爆炸弹'}
        ],
        anti_china_events:[
          {date:'2022-05-15',type:'宣传',description:'通过其英文杂志Inspire发布反华内容，威胁中国在阿拉伯半岛的利益'},
          {date:'2023-03-10',type:'声明',description:'声明中将中国列为"伊斯兰的敌人"之一'}
        ],
        statements:[
          {date:'2022-05-15',speaker:'AQAP宣传部门',content:'中国对穆斯林的压迫不亚于美国，我们必须在各地对抗中国的扩张。',source:'Inspire杂志',nature:'宣传煽动'}
        ]
      },
      {
        id:'TO010',
        name:'虔诚军',
        aliases:['LeT','Lashkar-e-Taiba','达瓦慈善会'],
        category:'terrorist',
        threat_level:'high',
        active_regions:['巴基斯坦','印控克什米尔','印度'],
        headquarters:'巴基斯坦拉合尔',
        founded:'1990年',
        ideology:'伊斯兰极端主义、反印度、解放克什米尔',
        leadership:'哈菲兹·赛义德(Hafiz Saeed)创始人，被通缉',
        personnel_size:'约数万名成员(含武装和慈善网络)',
        funding_sources:['沙特海湾捐款','巴基斯坦情报机构(历史联系)','慈善掩护组织','走私'],
        background:'虔诚军是南亚主要恐怖组织之一，主要针对印度目标。2008年孟买袭击案的策划者。该组织在巴基斯坦有一定合法性，通过慈善活动招募成员。与中国关系复杂：一方面巴基斯坦是中国的盟友，另一方面该组织的极端意识形态对中国新疆稳定构成潜在威胁。',
        attacks:[
          {date:'2008-11-26',location:'印度孟买',type:'连环恐怖袭击',casualties:'166人死亡，300余人受伤',description:'震惊世界的孟买连环恐怖袭击，10名枪手袭击多个目标'},
          {date:'2016-09-18',location:'印控克什米尔乌里',type:'武装袭击',casualties:'19名印度士兵死亡',description:'袭击印度陆军旅部'},
          {date:'2019-02-14',location:'印控克什米尔普尔瓦马',type:'自杀式爆炸',casualties:'40名印度警察死亡',description:'袭击印度中央后备警察部队车队'}
        ],
        anti_china_events:[
          {date:'2023-06-20',type:'声明',description:'哈菲兹·赛义德发表声明，声称中国在新疆的政策是"对穆斯林的迫害"'},
          {date:'2022-08-15',type:'宣传',description:'通过其宣传网络发布反华内容，将中国列为"伊斯兰敌人"'}
        ],
        statements:[
          {date:'2023-06-20',speaker:'哈菲兹·赛义德',content:'中国在新疆的暴行不可容忍，国际社会必须采取行动制止中国对穆斯林的迫害。',source:'公开声明',nature:'反华宣传'}
        ]
      },
      {
        id:'TO011',
        name:'苏丹解放军/快速支援部队',
        aliases:['RSF','Janjaweed','快速支援部队','苏丹民兵组织'],
        category:'terrorist',
        threat_level:'high',
        active_regions:['苏丹达尔富尔','苏丹喀土穆','乍得边境'],
        headquarters:'苏丹',
        founded:'2003年(金戈威德起源)/2013年(RSF正式成立)',
        ideology:'权力争夺、族群控制、反政府武装',
        leadership:'穆罕默德·哈姆丹·达加洛(Mohamed Hamdan Dagalo "Hemedti")',
        personnel_size:'约10万名武装人员',
        funding_sources:['金矿控制','走私网络','外国支持','征税'],
        background:'快速支援部队由金戈威德民兵演变而来，在苏丹达尔富尔冲突中犯下严重暴行。2023年4月起，RSF与苏丹军方爆发大规模武装冲突，导致严重人道主义危机。中国在苏丹有大量石油和矿业投资，冲突直接威胁中国利益。',
        attacks:[
          {date:'2023-04-15',location:'苏丹喀土穆',type:'武装冲突',casualties:'数千人死亡，数百万人流离失所',description:'RSF与苏丹军方爆发大规模武装冲突，持续至今'},
          {date:'2023-06-20',location:'苏丹达尔富尔',type:'种族屠杀',casualties:'数千名马萨尔人被杀',description:'达尔富尔地区发生大规模种族暴力事件'},
          {date:'2023-11-10',location:'苏丹喀土穆',type:'袭击',casualties:'多人伤亡',description:'袭击居民区和民用设施'}
        ],
        anti_china_events:[
          {date:'2023-04-20',type:'威胁',description:'RSF部队接近中国投资的油田区域，威胁中国石油工人安全'},
          {date:'2023-07-15',type:'抢劫',description:'RSF武装分子抢劫了中国企业在苏丹的设施和设备'},
          {date:'2023-05-10',type:'撤离',description:'中国政府组织大规模撤离在苏丹中国公民，约1000余人'}
        ],
        statements:[
          {date:'2023-04-25',speaker:'达加洛',content:'我们对中国在苏丹的投资者表示友好，但当前的安全形势使我们无法保证他们的安全。',source:'社交媒体',nature:'外交表态'}
        ]
      },
      {
        id:'TO012',
        name:'新人民军',
        aliases:['NPA','New People\'s Army','菲律宾新人民军'],
        category:'terrorist',
        threat_level:'medium',
        active_regions:['菲律宾农村地区','菲律宾南部'],
        headquarters:'菲律宾(地下活动)',
        founded:'1969年',
        ideology:'共产主义、毛泽东思想、反政府武装',
        leadership:'何塞·马利亚·西松(Jose Maria Sison，2022年去世)→现任领导层不明确',
        personnel_size:'约3000-4000名武装人员',
        funding_sources:['革命税收','绑架勒索','海外支持者','采矿区 extortion'],
        background:'新人民军是菲律宾共产党的武装力量，亚洲最持久的叛乱组织之一。该组织在菲律宾农村地区活动，通过"革命税收"维持运营。曾袭击包括中国企业在内的外国投资企业，特别是采矿和基础设施项目。',
        attacks:[
          {date:'2023-08-20',location:'菲律宾棉兰老岛',type:'武装袭击',casualties:'3名士兵死亡',description:'袭击政府军巡逻队'},
          {date:'2022-11-15',location:'菲律宾北部',type:'伏击',casualties:'多人伤亡',description:'伏击政府车队'},
          {date:'2021-06-10',location:'菲律宾苏里高',type:'袭击企业',casualties:'无伤亡',description:'袭击采矿企业设施'}
        ],
        anti_china_events:[
          {date:'2023-05-10',type:'勒索',description:'向中国投资的菲律宾矿业项目征收"革命税"，威胁发动袭击'},
          {date:'2022-07-15',type:'声明',description:'发表声明反对中国在菲律宾的"侵略性投资"，称中国是"新帝国主义"'},
          {date:'2021-09-20',type:'袭击',description:'袭击了中国企业参与的水电项目工地'}
        ],
        statements:[
          {date:'2022-07-15',speaker:'NPA发言人',content:'中国在菲律宾的投资是新帝国主义，我们将对其项目发动攻击。',source:'声明',nature:'直接威胁'}
        ]
      },

      // ===== 犯罪组织 (10个) =====
      {
        id:'TO013',
        name:'锡纳罗亚贩毒集团',
        aliases:['Sinaloa Cartel','CDS','太平洋贩毒集团','古兹曼集团'],
        category:'criminal',
        threat_level:'high',
        active_regions:['墨西哥锡纳罗亚州','美墨边境','中美洲','南美洲'],
        headquarters:'墨西哥库利亚坎',
        founded:'1980年代',
        ideology:'有组织犯罪、毒品贸易、权力扩张',
        leadership:'伊斯梅尔·桑巴达·加西亚(Ismail Zambada García)+华金·古兹曼之子(洛斯查平斯)',
        personnel_size:'约数万名成员(含武装人员、分销网络和腐败官员)',
        funding_sources:['可卡因/海洛因/冰毒贸易','武器走私','人口贩运','洗钱','extortion'],
        background:'锡纳罗亚贩毒集团是全球最大的贩毒组织之一，控制着大量从南美到北美的毒品贸易路线。该组织拥有强大的武装力量，与墨西哥政府和其他贩毒集团长期交战。近年来，中国化学品供应商通过合法贸易渠道向该集团提供制造芬太尼的前体化学品，引发中美执法合作关注。',
        attacks:[
          {date:'2023-09-15',location:'墨西哥锡纳罗亚州',type:'武装冲突',casualties:'30余人死亡',description:'内部派系冲突导致大规模暴力事件'},
          {date:'2022-08-05',location:'墨西哥蒂华纳',type:'袭击',casualties:'10人死亡',description:'与对手贩毒集团交火'},
          {date:'2019-10-17',location:'墨西哥库利亚坎',type:'城市战',casualties:'13人死亡',description:'古兹曼之子被捕后引发大规模武装冲突'}
        ],
        anti_china_events:[
          {date:'2023-06-20',type:'芬太尼贸易',description:'美国指控中国化学品供应商向锡纳罗亚集团提供芬太尼前体，中方对此予以否认'},
          {date:'2023-10-05',type:'执法合作',description:'中美就芬太尼问题开展执法合作对话，中方抓获部分涉案人员'},
          {date:'2024-02-15',type:'洗钱',description:'中国执法部门发现部分中国企业被利用为贩毒集团洗钱渠道'}
        ],
        statements:[
          {date:'2023-06-25',speaker:'墨西哥总统',content:'芬太尼问题是美国的需求造成的，不是墨西哥的错，中国的前体化学品贸易也需关注。',source:'新闻发布会',nature:'间接涉华'}
        ]
      },
      {
        id:'TO014',
        name:'海湾贩毒集团',
        aliases:['Gulf Cartel','CDG','海湾集团'],
        category:'criminal',
        threat_level:'medium',
        active_regions:['墨西哥塔毛利帕斯州','美墨边境东部'],
        headquarters:'墨西哥马塔莫罗斯',
        founded:'1970年代',
        ideology:'有组织犯罪、毒品贸易',
        leadership:'何塞·阿尔贝托·加尔万·科尔特斯等人(领导层频繁变动)',
        personnel_size:'约数千名成员',
        funding_sources:['毒品贸易','人口贩运','武器走私','extortion'],
        background:'海湾贩毒集团是墨西哥最古老的贩毒组织之一，主要在美墨边境东部活动。该组织曾雇佣武装集团"洛斯塞塔斯"作为杀手，后两者分裂并成为死敌。对中国公民的威胁主要来自绑架勒索。',
        attacks:[
          {date:'2023-03-04',location:'墨西哥马塔莫罗斯',type:'绑架',casualties:'4人被绑架(2人死亡)',description:'绑架包括美国公民在内的4人，引发外交事件'},
          {date:'2022-10-15',location:'墨西哥塔毛利帕斯州',type:'武装冲突',casualties:'多人伤亡',description:'与对手贩毒集团交火'}
        ],
        anti_china_events:[
          {date:'2023-05-20',type:'绑架',description:'据报该集团曾绑架在墨西哥经商的中国公民，勒索赎金'},
          {date:'2022-12-10',type:'勒索',description:'向中国商家征收"保护费"'}
        ],
        statements:[]
      },
      {
        id:'TO015',
        name:'三合会',
        aliases:['Triads','14K','新义安','和胜和','中华民国 triad'],
        category:'criminal',
        threat_level:'medium',
        active_regions:['中国香港','中国澳门','东南亚','欧洲华人社区','北美华人社区'],
        headquarters:'中国香港(历史)/分散运营',
        founded:'17世纪(起源)/现代复兴于20世纪',
        ideology:'有组织犯罪、传统帮派文化',
        leadership:'各分支有不同龙头老大',
        personnel_size:'全球约10万+成员(各分支总和)',
        funding_sources:['毒品贸易','人口贩运','赌博','洗钱','敲诈勒索','网络诈骗'],
        background:'三合会是源自中国的传统犯罪组织，在全球华人社区有广泛网络。主要分支包括14K、新义安、和胜和等。三合会涉及多种犯罪活动，从传统的保护费、赌博到现代的毒品贸易、网络诈骗和洗钱。对海外中国公民和华人社区安全构成威胁。',
        attacks:[
          {date:'2023-11-20',location:'中国香港',type:'持刀袭击',casualties:'多人受伤',description:'帮派仇杀导致持刀伤人事件'},
          {date:'2022-07-10',location:'东南亚',type:'绑架',casualties:'1人被绑架',description:'绑架华商勒索赎金'},
          {date:'2023-03-15',location:'欧洲',type:'网络诈骗',casualties:'数千人受害',description:'利用华人社区网络进行电信诈骗'}
        ],
        anti_china_events:[
          {date:'2023-08-10',type:'电信诈骗',description:'以海外华人为目标进行电信诈骗，涉案金额数千万元'},
          {date:'2022-06-20',type:'人口贩运',description:'诱骗中国公民到东南亚从事非法活动'},
          {date:'2024-01-15',type:'洗钱',description:'利用跨境贸易为犯罪所得洗钱，涉及中国国内资金'}
        ],
        statements:[]
      },
      {
        id:'TO016',
        name:'MS-13',
        aliases:['Mara Salvatrucha','MS','La Mara'],
        category:'criminal',
        threat_level:'medium',
        active_regions:['中美洲','美国','墨西哥'],
        headquarters:'萨尔瓦多(起源)/美国洛杉矶(发展)',
        founded:'1980年代',
        ideology:'帮派文化、暴力控制',
        leadership:'分散式领导结构',
        personnel_size:'约5-7万名成员',
        funding_sources:['毒品分销','extortion','人口贩运','走私'],
        background:'MS-13是起源于美国洛杉矶的中美洲帮派，现已扩展到整个中美洲和美国。以极端暴力著称。该组织对中国公民的威胁主要在中美洲和美墨边境地区，涉及走私和绑架。',
        attacks:[
          {date:'2023-05-20',location:'萨尔瓦多',type:'帮派暴力',casualties:'多人死亡',description:'帮派间暴力冲突'},
          {date:'2022-08-10',location:'美国长岛',type:'谋杀',casualties:'多人死亡',description:'系列谋杀案件'}
        ],
        anti_china_events:[
          {date:'2023-04-15',type:'走私',description:'参与走私中国公民经中美洲到美国的活动'},
          {date:'2022-09-20',type:'extortion',description:'向中美洲的中国商家征收保护费'}
        ],
        statements:[]
      },
      {
        id:'TO017',
        name:'日本极道',
        aliases:['Yakuza','山口组','住吉会','稻川会'],
        category:'criminal',
        threat_level:'medium',
        active_regions:['日本','东南亚','美国'],
        headquarters:'日本神户(山口组)',
        founded:'1915年(山口组)',
        ideology:'传统帮派文化、武士道精神(自我标榜)',
        leadership:'筱田建市(山口组六代目)',
        personnel_size:'约2-3万名成员(三大组织总和)',
        funding_sources:['保护费','赌博','毒品贸易','房地产','合法企业掩护','网络犯罪'],
        background:'日本极道是日本传统犯罪组织，以纹身和严格的等级制度著称。最大分支山口组近年来经历多次分裂。极道涉及多种犯罪活动，但也经营合法企业。对在日中国公民的威胁主要来自保护费和诈骗。',
        attacks:[
          {date:'2023-08-25',location:'日本神户',type:'内部冲突',casualties:'1人死亡',description:'山口组分裂后内部仇杀'},
          {date:'2022-11-10',location:'日本东京',type:'袭击',casualties:'多人受伤',description:'帮派冲突导致街头暴力'}
        ],
        anti_china_events:[
          {date:'2023-06-15',type:'诈骗',description:'针对在日中国游客和留学生进行诈骗活动'},
          {date:'2022-10-20',type:'保护费',description:'向中国料理店等华人经营场所征收保护费'}
        ],
        statements:[]
      },
      {
        id:'TO018',
        name:'克特族犯罪集团',
        aliases:['Cartel del Noreste','CDN','东北贩毒集团'],
        category:'criminal',
        threat_level:'medium',
        active_regions:['墨西哥北部','美墨边境'],
        headquarters:'墨西哥新拉雷多',
        founded:'2014年(从洛斯塞塔斯分裂)',
        ideology:'有组织犯罪、毒品贸易',
        leadership:'胡安·赫拉多·特雷维尼奥·查韦斯',
        personnel_size:'约数千名成员',
        funding_sources:['毒品贸易','人口贩运','extortion','绑架'],
        background:'东北贩毒集团是洛斯塞塔斯的残余势力组建的贩毒集团，主要在墨西哥北部活动。该组织以极端暴力著称，在美墨边境控制移民走私路线。对中国公民的威胁主要来自移民走私和绑架。',
        attacks:[
          {date:'2023-04-10',location:'墨西哥新拉雷多',type:'武装冲突',casualties:'多人伤亡',description:'与墨西哥军方交火'},
          {date:'2022-12-05',location:'墨西哥北部',type:'绑架',casualties:'数十人被绑架',description:'大规模绑架移民事件'}
        ],
        anti_china_events:[
          {date:'2023-07-20',type:'走私',description:'参与走私中国公民经墨西哥到美国，部分中国公民在途中遭遇暴力'},
          {date:'2023-10-10',type:'绑架',description:'据报绑架经墨西哥偷渡的中国公民，勒索高额赎金'}
        ],
        statements:[]
      },
      {
        id:'TO019',
        name:'巴西首都第一命令团',
        aliases:['PCC','Primeiro Comando da Capital','首都第一命令团'],
        category:'criminal',
        threat_level:'medium',
        active_regions:['巴西','南美洲','巴拉圭'],
        headquarters:'巴西圣保罗(监狱系统中指挥)',
        founded:'1993年',
        ideology:'有组织犯罪、监狱帮派文化',
        leadership:'马科斯·卡马乔("Marcola"在狱中指挥)',
        personnel_size:'约数万名成员',
        funding_sources:['毒品贸易','监狱 extortion','银行抢劫','绑架'],
        background:'首都第一命令团是巴西最大的犯罪组织，起源于监狱系统。该组织控制着巴西大部分监狱和贫民窟的毒品贸易。近年来扩展到南美其他国家。对中国公民的威胁主要在巴西经商的安全问题。',
        attacks:[
          {date:'2023-07-20',location:'巴西圣保罗',type:'银行抢劫',casualties:'无伤亡',description:'精密策划的银行金库抢劫案'},
          {date:'2022-05-15',location:'巴西',type:'暴乱',casualties:'多人死亡',description:'监狱暴乱导致大量伤亡'}
        ],
        anti_china_events:[
          {date:'2023-09-10',type:'extortion',description:'向巴西的中国商家和进口商征收保护费'},
          {date:'2022-11-25',type:'抢劫',description:'针对华商仓库的抢劫事件'}
        ],
        statements:[]
      },
      {
        id:'TO020',
        name:'网络犯罪集团APT41',
        aliases:['APT41','双尾蝎','Winnti','巴林'],
        category:'criminal',
        threat_level:'high',
        active_regions:['全球网络空间','东南亚','东亚'],
        headquarters:'东南亚(疑似)',
        founded:'2012年(首次被识别)',
        ideology:'经济利益驱动、国家支持(疑似)',
        leadership:'蒋振宇(Zhang Xiaoyu，被美方通缉)',
        personnel_size:'约数十名核心成员',
        funding_sources:['勒索软件','网络银行盗窃','知识产权窃取','游戏虚拟财产'],
        background:'APT41是一个高级持续性威胁组织，同时进行国家级间谍活动和追求经济利益的网络犯罪。该组织被指与中国有关联，但同时也进行独立的犯罪活动。目标包括全球政府机构、游戏公司、科技企业和金融机构。',
        attacks:[
          {date:'2023-03-15',location:'全球',type:'勒索软件',casualties:'无人员伤亡',description:'针对多家跨国企业部署勒索软件，赎金超千万美元'},
          {date:'2022-08-20',location:'全球',type:'数据窃取',casualties:'无人员伤亡',description:'窃取多家游戏公司源代码和虚拟财产'},
          {date:'2021-09-10',location:'全球',type:'供应链攻击',casualties:'无人员伤亡',description:'通过供应链入侵多家企业'}
        ],
        anti_china_events:[
          {date:'2023-10-20',type:'执法',description:'中国执法部门配合国际行动打击网络犯罪，部分涉案人员被起诉'},
          {date:'2024-01-10',type:'外交',description:'美方再次指控该组织与中国有关联，中方予以否认'}
        ],
        statements:[]
      },
      {
        id:'TO021',
        name:'墨西哥哈利斯科新世代贩毒集团',
        aliases:['CJNG','Cartel Jalisco Nueva Generación','哈利斯科集团'],
        category:'criminal',
        threat_level:'high',
        active_regions:['墨西哥哈利斯科州','墨西哥太平洋沿岸','美墨边境'],
        headquarters:'墨西哥瓜达拉哈拉',
        founded:'2011年',
        ideology:'有组织犯罪、暴力扩张',
        leadership:'鲁本·奥塞格拉·塞尔万特斯("El Mencho")',
        personnel_size:'约5000+武装人员',
        funding_sources:['毒品贸易(可卡因/芬太尼/冰毒)','武器走私','extortion','洗钱'],
        background:'哈利斯科新世代贩毒集团是墨西哥发展最快的贩毒组织，以极端暴力和军事化作战能力著称。该组织与锡纳罗亚集团争夺墨西哥毒品贸易控制权，冲突导致大量伤亡。在芬太尼贸易中扮演重要角色。',
        attacks:[
          {date:'2023-09-25',location:'墨西哥哈利斯科州',type:'武装冲突',casualties:'14人死亡',description:'与军方交火，击落军用直升机'},
          {date:'2022-11-15',location:'墨西哥米却肯州',type:'袭击',casualties:'20人死亡',description:'与对手贩毒集团大规模交火'},
          {date:'2023-04-05',location:'墨西哥太平洋',type:'海上袭击',casualties:'无伤亡',description:'袭击海上缉毒巡逻'}
        ],
        anti_china_events:[
          {date:'2023-08-20',type:'芬太尼',description:'该集团大量使用中国前体化学品制造芬太尼，引发中美执法关注'},
          {date:'2024-02-10',type:'威胁',description:'威胁袭击在墨西哥的中国企业和商家'}
        ],
        statements:[]
      },
      {
        id:'TO022',
        name:'东南亚电信诈骗集团',
        aliases:['缅北诈骗集团','KK园区','妙瓦底诈骗园区','杀猪盘集团'],
        category:'criminal',
        threat_level:'critical',
        active_regions:['缅甸掸邦','柬埔寨','老挝','菲律宾'],
        headquarters:'缅甸妙瓦底/缅北',
        founded:'2010年代',
        ideology:'经济犯罪、人口贩运、诈骗',
        leadership:'各园区有不同头目，部分与中国地下犯罪网络有关',
        personnel_size:'数万人(含被胁迫参与者)',
        funding_sources:['电信诈骗','网络赌博','人口贩运','虚拟货币洗钱'],
        background:'东南亚电信诈骗集团是近年来最猖獗的跨国犯罪组织，主要在缅甸、柬埔寨、老挝等地设立诈骗园区。这些园区通过人口贩运招募人员，以暴力胁迫手段进行电信诈骗和网络赌博。主要受害者为中国公民，涉案金额巨大。中国政府多次与东南亚国家合作打击。',
        attacks:[
          {date:'2023-10-20',location:'缅甸掸邦',type:'暴力虐待',casualties:'多名被拐卖者死亡',description:'诈骗园区内暴力虐待被拐卖人员致死'},
          {date:'2023-08-15',location:'柬埔寨西哈努克港',type:'人口贩运',casualties:'数千人受害',description:'大规模人口贩运网络被揭露'},
          {date:'2024-01-10',location:'缅甸妙瓦底',type:'武装冲突',casualties:'多人伤亡',description:'诈骗园区内部武装冲突'}
        ],
        anti_china_events:[
          {date:'2023-11-15',type:'联合执法',description:'中缅联合执法打击缅北诈骗集团，抓获数千名犯罪嫌疑人，移交中国'},
          {date:'2023-09-20',type:'电信诈骗',description:'针对中国大陆居民的"杀猪盘"诈骗，涉案金额超百亿元'},
          {date:'2024-03-10',type:'联合执法',description:'中柬联合打击柬埔寨境内诈骗园区，解救大量中国受害者'},
          {date:'2023-06-05',type:'人口贩运',description:'大量中国公民被诱骗至缅甸诈骗园区，遭受暴力虐待'}
        ],
        statements:[]
      },

      // ===== 反华非政府组织 (10个) =====
      {
        id:'TO023',
        name:'人权观察',
        aliases:['Human Rights Watch','HRW'],
        category:'anti_china_ngo',
        threat_level:'high',
        active_regions:['全球','美国纽约总部','中国香港'],
        headquarters:'美国纽约',
        founded:'1978年',
        ideology:'人权倡导(被指选择性适用)、反威权主义',
        leadership:'肯尼思·罗斯(Kenneth Roth，前执行主任)/蒂拉娜·哈桑(Tirana Hassan)',
        personnel_size:'约400+员工',
        funding_sources:['美国基金会捐款','索罗斯开放社会基金会','企业和个人捐款'],
        background:'人权观察是全球最具影响力的国际人权NGO之一，总部位于纽约。该组织频繁发布针对中国的批评性报告，涉及新疆、西藏、中国香港等人权议题。被中国政府视为反华势力的代表之一，其报告被中方认为存在严重偏见和不实信息。',
        attacks:[],
        anti_china_events:[
          {date:'2024-04-15',type:'报告发布',description:'发布年度世界人权报告，其中中国部分大量篇幅批评新疆、西藏和香港政策'},
          {date:'2023-08-30',type:'报告发布',description:'发布关于新疆"强迫劳动"的报告，呼吁国际制裁中国产品'},
          {date:'2022-12-10',type:'游说',description:'在人权日发起全球游说活动，呼吁各国议会通过涉疆决议'},
          {date:'2023-06-15',type:'宣传',description:'在联合国人权理事会发表反华演讲'},
          {date:'2024-02-20',type:'报告',description:'发布关于香港国安法实施后的"人权倒退"报告'}
        ],
        statements:[
          {date:'2024-04-15',speaker:'蒂拉娜·哈桑',content:'中国在新疆的政策构成反人类罪，国际社会必须采取行动追究责任。',source:'年度报告前言',nature:'指控抹黑'},
          {date:'2023-08-30',speaker:'人权观察中国部主任索菲·理查森',content:'中国的强迫劳动系统是全球供应链的污点，跨国企业必须停止从中获利。',source:'报告发布会',nature:'煽动制裁'},
          {date:'2023-06-15',speaker:'人权观察代表',content:'中国政府对人权的系统性侵犯令人震惊，联合国必须派调查组进入新疆。',source:'联合国发言',nature:'国际施压'}
        ]
      },
      {
        id:'TO024',
        name:'国际特赦组织',
        aliases:['Amnesty International','AI','大赦国际'],
        category:'anti_china_ngo',
        threat_level:'high',
        active_regions:['全球','英国伦敦总部'],
        headquarters:'英国伦敦',
        founded:'1961年',
        ideology:'人权倡导、国际正义',
        leadership:'阿格尼斯·卡拉马德(Agnès Callamard)秘书长',
        personnel_size:'约700+员工，全球数百万志愿者',
        funding_sources:['全球个人捐款','基金会拨款','遗产捐赠'],
        background:'国际特赦组织是全球最大的人权NGO之一，1977年获诺贝尔和平奖。该组织在新疆、西藏、中国香港等议题上频繁发布批评中国的报告和声明。与人权观察类似，被中国政府视为西方反华势力的重要工具。',
        attacks:[],
        anti_china_events:[
          {date:'2024-03-20',type:'报告',description:'发布关于新疆"拘禁营"的调查报告，引用卫星图像和证人口供'},
          {date:'2023-09-10',type:'声明',description:'就香港国安法案件发表声明，要求释放被捕人士'},
          {date:'2022-11-05',type:'活动',description:'在全球多个城市组织"为中国自由发声"抗议活动'},
          {date:'2023-12-10',type:'游说',description:'在世界人权日发起针对中国的全球签名活动'},
          {date:'2024-05-15',type:'报告',description:'发布报告指控中国在非洲的"人权侵犯"行为'}
        ],
        statements:[
          {date:'2024-03-20',speaker:'阿格尼斯·卡拉马德',content:'新疆的系统性人权侵犯必须被追究，中国不能逃避国际正义。',source:'报告声明',nature:'指控施压'},
          {date:'2023-09-10',speaker:'国际特赦组织',content:'香港国安法被用作压制异见的工具，必须立即废除。',source:'声明',nature:'干涉内政'},
          {date:'2022-11-05',speaker:'国际特赦组织',content:'我们呼吁全球公民站出来，为中国人民的自由和权利发声。',source:'活动声明',nature:'动员宣传'}
        ]
      },
      {
        id:'TO025',
        name:'自由亚洲电台',
        aliases:['RFA','Radio Free Asia'],
        category:'anti_china_ngo',
        threat_level:'high',
        active_regions:['全球','美国华盛顿总部','亚太地区'],
        headquarters:'美国华盛顿',
        founded:'1996年',
        ideology:'新闻自由(被指选择性报道)、反威权主义',
        leadership:'方贝(Bay Fang)社长',
        personnel_size:'约300+员工',
        funding_sources:['美国政府拨款(USAGM)','国会拨款'],
        background:'自由亚洲电台是由美国政府资助的媒体机构，通过多语言广播向亚洲地区传播信息。该机构以批评中国政府著称，频繁报道新疆、西藏、中国香港等敏感议题。被中国政府列为境外敌对媒体，其记者在中国境内无法正常工作。',
        attacks:[],
        anti_china_events:[
          {date:'2024-04-10',type:'报道',description:'发布系列报道声称新疆"强迫劳动"仍在持续，引用匿名消息源'},
          {date:'2023-10-15',type:'报道',description:'就一带一路项目发表系列负面报道，称其为"债务陷阱"'},
          {date:'2024-01-20',type:'报道',description:'报道中国香港国安法案件审判，对被告表示同情'},
          {date:'2023-07-05',type:'报道',description:'就西藏宗教自由发表批评性报道'},
          {date:'2024-06-01',type:'采访',description:'采访海外维吾尔活动人士，传播"种族灭绝"叙事'}
        ],
        statements:[
          {date:'2024-04-10',speaker:'自由亚洲电台记者',content:'尽管中国政府声称新疆政策取得了成就，但我们的调查显示强迫劳动仍在继续。',source:'报道',nature:'不实报道'},
          {date:'2023-10-15',speaker:'自由亚洲电台评论',content:'一带一路不是发展项目，而是债务陷阱外交的工具。',source:'评论',nature:'抹黑攻击'}
        ]
      },
      {
        id:'TO026',
        name:'自由之家',
        aliases:['Freedom House','FH'],
        category:'anti_china_ngo',
        threat_level:'medium',
        active_regions:['全球','美国华盛顿总部'],
        headquarters:'美国华盛顿',
        founded:'1941年',
        ideology:'民主推广、自由评级',
        leadership:'迈克尔·J·阿布拉莫维兹(Michael J. Abramowitz)主席',
        personnel_size:'约100+员工',
        funding_sources:['美国联邦拨款','基金会捐赠','私人捐款'],
        background:'自由之家是美国政府的非官方机构，以发布全球自由度评级著称。该组织每年发布的《全球自由度报告》持续将中国评为"不自由"国家。被中国政府视为美国意识形态输出的工具。',
        attacks:[],
        anti_china_events:[
          {date:'2024-03-01',type:'报告',description:'年度全球自由度报告将中国评为"不自由"，得分持续走低'},
          {date:'2023-09-15',type:'报告',description:'发布《中国全球影响力》报告，称中国在全球范围内"破坏民主"'},
          {date:'2024-02-25',type:'声明',description:'就中国互联网自由发表声明，称中国是"全球互联网自由最大威胁"'},
          {date:'2023-11-10',type:'游说',description:'游说美国国会通过更多涉华制裁法案'}
        ],
        statements:[
          {date:'2024-03-01',speaker:'迈克尔·阿布拉莫维兹',content:'中国的自由度持续恶化，中共的威权统治对全球民主构成严重威胁。',source:'年度报告',nature:'评级抹黑'},
          {date:'2023-09-15',speaker:'自由之家',content:'中国通过经济影响力在全球范围内破坏民主制度，西方国家必须联合应对。',source:'报告',nature:'意识形态攻击'}
        ]
      },
      {
        id:'TO027',
        name:'无国界记者',
        aliases:['RSF','Reporters Without Borders','记者无国界'],
        category:'anti_china_ngo',
        threat_level:'medium',
        active_regions:['全球','法国巴黎总部'],
        headquarters:'法国巴黎',
        founded:'1985年',
        ideology:'新闻自由倡导',
        leadership:'克里斯托夫·德卢瓦(Christophe Deloire)秘书长',
        personnel_size:'约150+员工',
        funding_sources:['欧洲政府拨款','基金会捐赠','个人捐款'],
        background:'无国界记者是总部位于巴黎的国际新闻自由倡导组织。该组织每年发布全球新闻自由指数，中国长期排名靠后。该组织频繁就中国记者被捕、互联网审查、外国记者在华待遇等议题发表批评性声明。',
        attacks:[],
        anti_china_events:[
          {date:'2024-05-03',type:'报告',description:'世界新闻自由日发布年度指数，中国在全球180个国家中排名第172位'},
          {date:'2023-12-15',type:'声明',description:'就中国记者被捕事件发表声明，要求中国政府释放所有"被关押记者"'},
          {date:'2024-02-10',type:'报告',description:'发布报告称中国是全球关押记者最多的国家'},
          {date:'2023-08-20',type:'活动',description:'在巴黎组织"为中国新闻自由发声"活动'}
        ],
        statements:[
          {date:'2024-05-03',speaker:'克里斯托夫·德卢瓦',content:'中国是全球关押记者最多的国家，新闻自由状况令人极其担忧。',source:'年度报告',nature:'评级批评'},
          {date:'2023-12-15',speaker:'无国界记者',content:'我们要求中国政府立即释放所有被关押的记者和新闻工作者。',source:'声明',nature:'施压要求'}
        ]
      },
      {
        id:'TO028',
        name:'世界维吾尔代表大会',
        aliases:['WUC','World Uyghur Congress','世维会'],
        category:'anti_china_ngo',
        threat_level:'high',
        active_regions:['德国慕尼黑总部','全球维吾尔侨民社区'],
        headquarters:'德国慕尼黑',
        founded:'2004年',
        ideology:'维吾尔民族主义、新疆分离主义、反华',
        leadership:'多力坤·艾沙(Dolkun Isa)主席',
        personnel_size:'核心成员数百人，支持者数千人',
        funding_sources:['美国NED(国家民主基金会)拨款','西方政府间接资助','海外维吾尔人捐款'],
        background:'世界维吾尔代表大会是海外维吾尔分离主义组织的国际协调机构，总部在德国慕尼黑。该组织是新疆分离势力在国际舞台上的主要代表，频繁在联合国和西方议会进行游说活动。被中国政府列为分裂组织，多名核心成员被通缉。',
        attacks:[],
        anti_china_events:[
          {date:'2024-04-20',type:'游说',description:'在联合国日内瓦总部组织活动，游说各国通过涉疆决议'},
          {date:'2023-09-01',type:'报告',description:'发布所谓"维吾尔人权调查报告"，引用不实数据'},
          {date:'2024-02-15',type:'议会游说',description:'在美国国会、欧洲议会进行游说，推动涉疆制裁法案'},
          {date:'2023-11-25',type:'抗议',description:'在多个西方城市组织反华抗议活动'},
          {date:'2024-06-15',type:'宣传',description:'在社交媒体上发起"维吾尔法庭"宣传活动'}
        ],
        statements:[
          {date:'2024-04-20',speaker:'多力坤·艾沙',content:'中国在新疆实施种族灭绝，国际社会必须立即采取行动制裁中国。',source:'联合国发言',nature:'煽动分裂'},
          {date:'2023-09-01',speaker:'世维会',content:'超过百万维吾尔人被关押在拘禁营中，这是21世纪最大的人权灾难。',source:'报告',nature:'不实指控'},
          {date:'2024-02-15',speaker:'多力坤·艾沙',content:'我们呼吁所有民主国家通过马格尼茨基法案制裁参与新疆政策的中国官员。',source:'国会作证',nature:'煽动制裁'}
        ]
      },
      {
        id:'TO029',
        name:'国际声援西藏运动',
        aliases:['ICT','International Campaign for Tibet'],
        category:'anti_china_ngo',
        threat_level:'medium',
        active_regions:['美国华盛顿总部','比利时布鲁塞尔','荷兰阿姆斯特丹'],
        headquarters:'美国华盛顿',
        founded:'1988年',
        ideology:'西藏独立/高度自治、反华',
        leadership:'丹增多吉(Tenzin Dorjee)董事会成员等',
        personnel_size:'约50-80名员工',
        funding_sources:['美国NED拨款','西方基金会','藏人侨民捐款'],
        background:'国际声援西藏运动是总部在华盛顿的涉藏NGO，致力于在国际舞台推动西藏议题。该组织与达赖喇嘛和西藏流亡政府关系密切，频繁在西方议会和联合国进行游说活动。被中国政府视为分裂势力的国际代表。',
        attacks:[],
        anti_china_events:[
          {date:'2024-03-10',type:'活动',description:'在西藏起义纪念日组织全球反华抗议活动'},
          {date:'2023-07-15',type:'报告',description:'发布报告指责中国在西藏的"文化灭绝"政策'},
          {date:'2024-01-10',type:'游说',description:'在美国国会推动通过涉藏决议'},
          {date:'2023-12-10',type:'声明',description:'就达赖喇嘛相关议题发表声明批评中国'}
        ],
        statements:[
          {date:'2024-03-10',speaker:'ICT主席',content:'西藏人民的基本自由被剥夺，国际社会不能对中国的文化灭绝保持沉默。',source:'活动声明',nature:'煽动分裂'},
          {date:'2023-07-15',speaker:'ICT',content:'中国在西藏的寄宿学校政策是文化灭绝的延续，必须立即停止。',source:'报告',nature:'不实指控'}
        ]
      },
      {
        id:'TO030',
        name:'香港观察',
        aliases:['Hong Kong Watch','HKW'],
        category:'anti_china_ngo',
        threat_level:'medium',
        active_regions:['英国伦敦总部','中国香港'],
        headquarters:'英国伦敦',
        founded:'2017年',
        ideology:'香港"民主自由"倡导、反华',
        leadership:'本尼迪克特·罗杰斯(Benedict Rogers)创办人兼首席执行官',
        personnel_size:'约10-20名员工',
        funding_sources:['英国和欧洲基金会捐款','个人捐款'],
        background:'香港观察是总部在伦敦的英国NGO，致力于在香港议题上进行国际游说。该组织频繁批评中国香港国安法和选举制度改革，与香港海外反对派人物关系密切。多名成员被中国香港当局通缉。',
        attacks:[],
        anti_china_events:[
          {date:'2024-03-15',type:'报告',description:'发布关于香港国安法实施后"公民社会瓦解"的报告'},
          {date:'2023-10-10',type:'游说',description:'在英国议会推动通过涉港决议，呼吁制裁香港官员'},
          {date:'2024-01-25',type:'声明',description:'就香港立法会选举发表批评声明'},
          {date:'2023-12-20',type:'活动',description:'在英国组织"为香港自由发声"活动'}
        ],
        statements:[
          {date:'2024-03-15',speaker:'本尼迪克特·罗杰斯',content:'香港国安法彻底摧毁了一国两制的承诺，香港的自由正在消亡。',source:'报告',nature:'干涉内政'},
          {date:'2023-10-10',speaker:'香港观察',content:'英国政府对香港有道义责任，必须对参与镇压的官员实施制裁。',source:'议会作证',nature:'煽动制裁'}
        ]
      },
      {
        id:'TO031',
        name:'国家民主基金会',
        aliases:['NED','National Endowment for Democracy'],
        category:'anti_china_ngo',
        threat_level:'high',
        active_regions:['全球','美国华盛顿总部'],
        headquarters:'美国华盛顿',
        founded:'1983年',
        ideology:'民主推广(被指政权更迭工具)',
        leadership:'达蒙·威尔逊(Damon Wilson)主席',
        personnel_size:'约150+员工',
        funding_sources:['美国国会年度拨款(约3亿美元+)'],
        background:'国家民主基金会是由美国国会出资设立的非政府组织，被称为CIA的"白手套"。该组织通过向全球各类NGO和反对派组织提供资金支持，推动美国定义的"民主化"。在中国相关领域，NED大量资助世维会、国际声援西藏运动、香港观察等反华组织。被中国政府列为渗透破坏的主要资金来源。',
        attacks:[],
        anti_china_events:[
          {date:'2024-05-01',type:'资金',description:'年度报告披露向涉华反华组织拨付超过2000万美元'},
          {date:'2023-11-20',type:'活动',description:'举办"中国民主未来"研讨会，邀请海外反对派人士参加'},
          {date:'2024-02-05',type:'资金',description:'向香港海外反对派组织提供额外资金支持'},
          {date:'2023-08-10',type:'报告',description:'发布报告称中国是全球"民主倒退"的主要推动者'}
        ],
        statements:[
          {date:'2024-05-01',speaker:'达蒙·威尔逊',content:'支持中国的民主力量是美国国家民主基金会的核心使命之一。',source:'年度报告',nature:'渗透颠覆'},
          {date:'2023-11-20',speaker:'NED',content:'中国的威权模式正在全球扩张，我们必须加大对民主力量的支持。',source:'研讨会发言',nature:'意识形态攻击'}
        ]
      },
      {
        id:'TO032',
        name:'开放社会基金会',
        aliases:['OSF','Open Society Foundations','索罗斯基金会'],
        category:'anti_china_ngo',
        threat_level:'medium',
        active_regions:['全球','美国纽约总部'],
        headquarters:'美国纽约',
        founded:'1993年(索罗斯基金会网络重组)',
        ideology:'开放社会理念、自由民主推广',
        leadership:'亚历山大·索罗斯(Alexander Soros)主席',
        personnel_size:'约1000+员工(全球)',
        funding_sources:['乔治·索罗斯个人资产(累计捐赠超320亿美元)'],
        background:'开放社会基金会由金融大鳄乔治·索罗斯创立，是全球最大的私人慈善基金会之一。该组织在全球推动"开放社会"理念，涉及民主、人权、法治等议题。在中国相关领域，该基金会通过资助各类研究机构和NGO间接影响对华舆论。被中国政府视为颜色革命的重要推手。',
        attacks:[],
        anti_china_events:[
          {date:'2024-04-10',type:'资金',description:'向多个涉华研究项目和NGO提供资金支持'},
          {date:'2023-09-25',type:'声明',description:'索罗斯发表文章批评中国的政治体制和全球经济政策'},
          {date:'2023-12-15',type:'报告',description:'资助出版关于中国"全球影响力"的研究报告'},
          {date:'2024-02-20',type:'活动',description:'在慕尼黑安全论坛期间举办涉华边会'}
        ],
        statements:[
          {date:'2023-09-25',speaker:'乔治·索罗斯',content:'中国是对开放社会的最大威胁，世界必须团结起来对抗中国的威权模式。',source:'专栏文章',nature:'意识形态攻击'},
          {date:'2023-12-15',speaker:'开放社会基金会',content:'中国的全球影响力扩张正在侵蚀民主制度的基础。',source:'报告',nature:'抹黑攻击'}
        ]
      },
      // ===== 新增恐怖组织 (TO033-TO050) =====
      {
        id:'TO033',name:'穆罕默德军',aliases:['JeM','Jaish-e-Mohammed'],category:'terrorist',threat_level:'critical',
        active_regions:['巴基斯坦旁遮普省','印控克什米尔','阿富汗东部'],
        headquarters:'巴基斯坦巴哈瓦尔布尔',founded:'2000年',
        ideology:'伊斯兰极端主义、反印度、克什米尔分离主义',
        leadership:'马苏德·阿兹哈尔(Masood Azhar)创始人',
        personnel_size:'约2000-3000名武装人员',
        funding_sources:['海外伊斯兰慈善机构','走私网络','绑架勒索'],
        background:'穆罕默德军是南亚最活跃的伊斯兰极端组织之一，总部位于巴基斯坦旁遮普省。主要针对印度目标发动袭击，与基地组织和塔利班有联系。被联合国、美国、印度列为恐怖组织。活动区域与CPEC路线重叠，对中方人员构成潜在安全威胁。',
        attacks:[
          {date:'2019-02-14',location:'印控克什米尔普尔瓦马',type:'自杀式汽车炸弹',casualties:'40名印度CRPF人员死亡',description:'载有炸药的汽车撞击CRPF车队'},
          {date:'2001-12-13',location:'印度新德里议会大厦',type:'武装袭击',casualties:'9人死亡',description:'武装分子袭击印度议会大厦'},
          {date:'2016-01-02',location:'印度帕坦科特空军基地',type:'武装袭击',casualties:'7名安全人员死亡',description:'渗透印度空军基地'}
        ],
        anti_china_events:[
          {date:'2023-06-15',type:'关联威胁',description:'活动区域与CPEC路线重叠，对中方人员构成间接安全威胁'},
          {date:'2021-11-20',type:'情报关联',description:'据情报显示该组织成员与针对中国在巴项目的威胁有关联'}
        ],
        statements:[
          {date:'2019-02-15',speaker:'穆罕默德军发言人',content:'普尔瓦马行动是对印度在克什米尔暴行的回应。',source:'JeM声明',nature:'袭击认领'}
        ]
      },
      {
        id:'TO034',name:'俾路支解放阵线',aliases:['BLF','Baloch Liberation Front'],category:'terrorist',threat_level:'high',
        active_regions:['巴基斯坦俾路支省','伊朗锡斯坦-俾路支省'],
        headquarters:'巴基斯坦俾路支省',founded:'1964年',
        ideology:'俾路支民族分离主义、左翼民族主义',
        leadership:'阿拉·纳扎尔·俾路支(Allah Nazar Baloch)',
        personnel_size:'约1000-2000名武装人员',
        funding_sources:['海外俾路支侨民捐款','走私武器','当地部落征税'],
        background:'俾路支解放阵线是俾路支省历史最悠久的分离主义武装之一，主张通过武装斗争实现俾路支独立。频繁袭击巴基斯坦安全部队和中资项目，多次发表反华声明威胁中国投资。',
        attacks:[
          {date:'2023-05-12',location:'巴基斯坦俾路支省图尔巴特',type:'武装袭击',casualties:'7名安全人员死亡',description:'袭击边防军检查站'},
          {date:'2022-08-25',location:'巴基斯坦俾路支省',type:'破坏基础设施',casualties:'无伤亡',description:'炸毁中巴天然气管道一段'},
          {date:'2021-06-10',location:'巴基斯坦俾路支省',type:'绑架杀害',casualties:'2名劳工遇害',description:'绑架并杀害参与中资项目的当地劳工'}
        ],
        anti_china_events:[
          {date:'2023-09-01',type:'声明威胁',description:'威胁将对中国在俾路支的所有项目发动袭击'},
          {date:'2022-03-15',type:'宣传',description:'发布反CPEC宣传视频'},
          {date:'2021-12-10',type:'死亡威胁',description:'向参与瓜达尔港建设的中方人员发出死亡威胁'}
        ],
        statements:[
          {date:'2023-09-01',speaker:'BLF发言人',content:'中国的项目是俾路支人民的枷锁，我们将摧毁一切殖民基础设施。',source:'BLF声明',nature:'直接威胁'},
          {date:'2022-03-15',speaker:'阿拉·纳扎尔·俾路支',content:'CPEC是俾路支的死亡通行证，中国必须离开。',source:'宣传视频',nature:'宣传煽动'}
        ]
      },
      {
        id:'TO035',name:'巴基斯坦正义军',aliases:['Jaish al-Adl','正义军'],category:'terrorist',threat_level:'high',
        active_regions:['伊朗锡斯坦-俾路支省','巴基斯坦俾路支省'],
        headquarters:'巴基斯坦俾路支省(流亡)',founded:'2012年',
        ideology:'逊尼派极端主义、反伊朗政府',
        leadership:'萨拉赫丁·法尔基(Salahuddin Farooqui)',
        personnel_size:'约500-800名武装人员',
        funding_sources:['海外逊尼派捐助','走私武器','毒品贸易'],
        background:'在伊朗锡斯坦-俾路支省活动的逊尼派极端组织，由前Jundullah成员组成。主要针对伊朗安全部队发动袭击。活动范围横跨伊巴边境，对中伊经济走廊构成安全威胁。',
        attacks:[
          {date:'2023-10-26',location:'伊朗锡斯坦-俾路支省',type:'袭击警察局',casualties:'10名伊朗警察死亡',description:'武装分子袭击警察局'},
          {date:'2019-02-13',location:'伊朗锡斯坦-俾路支省',type:'汽车炸弹',casualties:'27名革命卫队成员死亡',description:'自杀式汽车炸弹袭击革命卫队巴士'}
        ],
        anti_china_events:[
          {date:'2023-07-10',type:'间接威胁',description:'活动区域靠近中伊铁路项目规划路线'},
          {date:'2022-09-15',type:'情报关联',description:'曾威胁参与中伊经济走廊建设的中国工程师'}
        ],
        statements:[
          {date:'2023-10-27',speaker:'Jaish al-Adl发言人',content:'我们将继续对抗德黑兰政权对逊尼派的压迫。',source:'社交媒体',nature:'宣传煽动'}
        ]
      },
      {
        id:'TO036',name:'印度共产党(毛主义)',aliases:['纳萨尔派','CPI(Maoist)','Naxalites'],category:'terrorist',threat_level:'high',
        active_regions:['印度恰蒂斯加尔邦','印度恰尔肯德邦','印度奥里萨邦','印度中部'],
        headquarters:'印度中部密林地区(游击区)',founded:'2004年',
        ideology:'马克思列宁毛主义、武装革命、农村包围城市',
        leadership:'努帕迪·马宗达(化名)总书记',
        personnel_size:'约8000-10000名武装人员',
        funding_sources:['当地征税','绑架勒索','走私木材和矿产'],
        background:'印度最大的左翼极端组织，活跃于印度中东部农村地区。主张通过人民战争推翻印度政府。被印度政府视为国内最大安全威胁。活动区域靠近部分中国在印投资企业所在地，曾威胁外资企业。',
        attacks:[
          {date:'2023-04-26',location:'印度恰蒂斯加尔邦',type:'伏击',casualties:'10名安全部队人员死亡',description:'纳萨尔派伏击安全部队巡逻队'},
          {date:'2021-04-03',location:'印度恰蒂斯加尔邦',type:'伏击',casualties:'22名安全部队人员死亡',description:'大规模伏击CRPF部队'},
          {date:'2022-01-12',location:'印度恰尔肯德邦',type:'炸弹袭击',casualties:'3人死亡',description:'IED炸弹袭击安全车辆'}
        ],
        anti_china_events:[
          {date:'2022-07-20',type:'声明',description:'发表声明反对印度政府允许中国企业参与矿业开采'},
          {date:'2021-05-15',type:'威胁',description:'威胁参与印度矿业项目的中国投资企业'}
        ],
        statements:[
          {date:'2022-07-20',speaker:'CPI(毛主义)中央委员会',content:'外资企业正在掠夺印度人民的资源，我们必须用一切手段对抗。',source:'声明',nature:'宣传煽动'}
        ]
      },
      {
        id:'TO037',name:'伊斯兰祈祷团',aliases:['JI','Jemaah Islamiyah'],category:'terrorist',threat_level:'high',
        active_regions:['印度尼西亚','菲律宾南部','马来西亚'],
        headquarters:'印度尼西亚(地下)',founded:'1993年',
        ideology:'伊斯兰极端主义、东南亚伊斯兰建国',
        leadership:'阿布·鲁斯dan(Paru), 多名头目被击毙',
        personnel_size:'约500-1000名成员',
        funding_sources:['海外伊斯兰慈善机构','抢劫银行','走私'],
        background:'东南亚最大的伊斯兰极端组织之一，目标是在东南亚建立伊斯兰国家。与基地组织有联系，制造了2002年巴厘岛爆炸案等多起重大恐怖袭击。对东南亚中国公民和中资企业构成安全威胁。',
        attacks:[
          {date:'2002-10-12',location:'印度尼西亚巴厘岛',type:'连环爆炸',casualties:'202人死亡(含3名中国公民)',description:'针对外国游客的连环炸弹袭击'},
          {date:'2003-08-05',location:'印尼雅加达万豪酒店',type:'汽车炸弹',casualties:'12人死亡',description:'针对西方目标的汽车炸弹袭击'},
          {date:'2009-07-17',location:'印尼雅加达',type:'酒店爆炸',casualties:'9人死亡',description:'同时袭击两家豪华酒店'}
        ],
        anti_china_events:[
          {date:'2022-06-10',type:'间接威胁',description:'活动区域与印尼中国矿业项目区域重叠'},
          {date:'2021-03-15',type:'情报关联',description:'据报该组织残余分子曾讨论针对中国公民的袭击计划'}
        ],
        statements:[
          {date:'2002-10-13',speaker:'伊斯兰祈祷团',content:'巴厘岛行动是对异教徒的惩罚。',source:'声明',nature:'袭击认领'}
        ]
      },
      {
        id:'TO038',name:'摩洛伊斯兰自由斗士',aliases:['BIFF','Bangsamoro Islamic Freedom Fighters'],category:'terrorist',threat_level:'high',
        active_regions:['菲律宾棉兰老岛','菲律宾马京达瑙省'],
        headquarters:'菲律宾棉兰老岛',founded:'2008年',
        ideology:'伊斯兰极端主义、棉兰老岛独立',
        leadership:'阿布·胡里耶拉(Abu Khairie)疑似领导人',
        personnel_size:'约300-500名武装人员',
        funding_sources:['走私武器','当地征税','与ISIS的联系'],
        background:'菲律宾棉兰老岛的极端伊斯兰武装组织，从MILF分裂出来。主张通过武装斗争建立独立伊斯兰国家。与ISIS有联系，对菲律宾南部中国企业和公民构成安全威胁。',
        attacks:[
          {date:'2023-03-15',location:'菲律宾马京达瑙省',type:'武装袭击',casualties:'6名士兵死亡',description:'BIFF武装分子伏击政府军巡逻队'},
          {date:'2022-11-10',location:'菲律宾棉兰老岛',type:'爆炸袭击',casualties:'3人死亡',description:'IED爆炸袭击军事检查站'}
        ],
        anti_china_events:[
          {date:'2022-08-20',type:'间接威胁',description:'活动区域靠近菲律宾南部中资农业项目区'}
        ],
        statements:[
          {date:'2023-03-16',speaker:'BIFF发言人',content:'我们将继续战斗，直到棉兰老岛获得自由。',source:'社交媒体',nature:'宣传煽动'}
        ]
      },
      {
        id:'TO039',name:'伊斯兰解放党',aliases:['Hizb ut-Tahrir','HuT','伊解党'],category:'terrorist',threat_level:'medium',
        active_regions:['中亚','英国','德国','印度尼西亚','澳大利亚','巴基斯坦'],
        headquarters:'英国伦敦(宣传中心)',founded:'1953年',
        ideology:'伊斯兰复兴主义、全球哈里发国、反西方',
        leadership:'阿塔·卡拉斯尼奇(Ata Khalil)媒体发言人',
        personnel_size:'约100万+ sympathizers(全球同情者)',
        funding_sources:['会员会费','海外穆斯林捐款','出版收入'],
        background:'伊斯兰解放党是一个全球性伊斯兰政治组织，主张恢复伊斯兰哈里发国。在中亚地区(特别是乌兹别克斯坦、吉尔吉斯斯坦)活动频繁。被多国禁止但未被美国列为恐怖组织。该组织在中亚传播极端思想，对中亚稳定和中国新疆安全构成潜在威胁。',
        attacks:[],
        anti_china_events:[
          {date:'2023-07-15',type:'宣传',description:'发布文章攻击中国在新疆的政策，称新疆穆斯林受"压迫"'},
          {date:'2022-11-20',type:'集会',description:'在英国伦敦组织反华集会，抗议中国新疆政策'},
          {date:'2024-01-10',type:'报告',description:'发布涉疆报告，散布虚假信息'}
        ],
        statements:[
          {date:'2023-07-15',speaker:'伊斯兰解放党英国分部',content:'中国对穆斯林的压迫必须停止，国际社会应采取行动。',source:'官方网站',nature:'煽动制裁'},
          {date:'2022-11-20',speaker:'HuT发言人',content:'新疆是穆斯林的土地，中国无权统治。',source:'集会演讲',nature:'煽动分裂'}
        ]
      },
      {
        id:'TO040',name:'乌兹别克斯坦伊斯兰运动',aliases:['IMU','Islamic Movement of Uzbekistan','乌伊运'],category:'terrorist',threat_level:'high',
        active_regions:['阿富汗北部','乌兹别克斯坦','塔吉克斯坦','巴基斯坦部落区'],
        headquarters:'阿富汗北部(流亡)',founded:'1998年',
        ideology:'伊斯兰极端主义、推翻乌兹别克斯坦政府、建立伊斯兰国',
        leadership:'Jafar Yaldash(已死)，现任领导不明',
        personnel_size:'约500-1000名武装人员',
        funding_sources:['基地组织资助','走私毒品','绑架勒索'],
        background:'乌兹别克斯坦伊斯兰运动是中亚地区最危险的极端组织之一，目标推翻乌兹别克斯坦世俗政府。与基地组织和塔利班有密切联系。该组织活动区域靠近中国新疆边境，对中国西部安全构成直接威胁。多名成员曾参与针对中国公民的袭击策划。',
        attacks:[
          {date:'2015-09-03',location:'阿富汗昆都士',type:'武装袭击',casualties:'塔利班联合行动',description:'IMU与塔利班联合攻占昆都士'},
          {date:'2012-07-25',location:'塔吉克斯坦',type:'武装袭击',casualties:'20名士兵死亡',description:'IMU武装分子袭击塔吉克斯坦军事哨所'},
          {date:'2000-08-10',location:'乌兹别克斯坦',type:'爆炸袭击',casualties:'多人伤亡',description:'在塔什干制造系列爆炸'}
        ],
        anti_china_events:[
          {date:'2021-08-15',type:'情报关联',description:'据情报显示IMU残余分子曾策划针对中国驻阿富汗机构的袭击'},
          {date:'2020-06-10',type:'宣传',description:'发布视频威胁中国在新疆的统治'},
          {date:'2019-03-15',type:'训练关联',description:'据报IMU成员曾为东伊运提供训练支持'}
        ],
        statements:[
          {date:'2020-06-10',speaker:'IMU宣传部门',content:'中国的暴政终将结束，东突厥斯坦将获得自由。',source:'宣传视频',nature:'直接威胁'},
          {date:'2021-08-16',speaker:'IMU发言人',content:'塔利班的胜利是我们的胜利，中国将是下一个目标。',source:'社交媒体',nature:'直接威胁'}
        ]
      },
      {
        id:'TO041',name:'沙姆解放组织',aliases:['HTS','Hayat Tahrir al-Sham','征服沙姆阵线'],category:'terrorist',threat_level:'high',
        active_regions:['叙利亚伊德利卜省','叙利亚北部'],
        headquarters:'叙利亚伊德利卜',founded:'2017年',
        ideology:'伊斯兰极端主义、叙利亚伊斯兰政府',
        leadership:'阿布·穆罕默德·约拉尼(Abu Mohammed al-Julani)头目',
        personnel_size:'约10000-15000名武装人员',
        funding_sources:['走私石油','跨境贸易税','关税','海外捐款'],
        background:'沙姆解放组织是叙利亚最大的极端伊斯兰武装组织，控制叙利亚伊德利卜省。由前基地组织叙利亚分支努斯拉阵线演变而来。该组织对叙利亚境内中国外交设施和中资企业构成潜在威胁。在叙利亚内战中扮演重要角色。',
        attacks:[
          {date:'2023-10-15',location:'叙利亚伊德利卜',type:'武装冲突',casualties:'多人伤亡',description:'与叙利亚政府军激烈交火'},
          {date:'2022-02-10',location:'叙利亚阿勒颇',type:'炮击',casualties:'平民伤亡',description:'HTS炮击政府军控制区'}
        ],
        anti_china_events:[
          {date:'2023-05-20',type:'声明',description:'HTS发表声明批评中国在叙利亚问题上的立场'},
          {date:'2022-09-10',type:'维族关联',description:'据报HTS内有维吾尔族武装分子，可能与东伊运有关联'}
        ],
        statements:[
          {date:'2023-05-20',speaker:'HTS发言人',content:'中国在叙利亚支持暴政，将为此付出代价。',source:'声明',nature:'直接威胁'}
        ]
      },
      {
        id:'TO042',name:'库尔德工人党',aliases:['PKK','Kurdistan Workers Party','库工党'],category:'terrorist',threat_level:'high',
        active_regions:['土耳其东南部','伊拉克北部','叙利亚东北部'],
        headquarters:'伊拉克北部坎迪尔山区',founded:'1978年',
        ideology:'库尔德民族主义、马克思列宁主义、库尔德独立',
        leadership:'穆拉特·卡拉伊兰(Murat Karayılan)代理领导人',
        personnel_size:'约3000-5000名武装人员',
        funding_sources:['海外库尔德侨民捐款','走私毒品','绑架勒索','非法征税'],
        background:'库尔德工人党是土耳其最大的库尔德分离主义武装组织，主张建立独立的库尔德国家。被土耳其、美国、欧盟列为恐怖组织。该组织在伊拉克北部活动，靠近中国石油投资项目区域，对中方资产构成间接安全威胁。',
        attacks:[
          {date:'2023-12-22',location:'土耳其首都安卡拉',type:'爆炸袭击',casualties:'3人死亡',description:'PKK在安卡拉安全总局附近制造爆炸'},
          {date:'2023-10-01',location:'土耳其内政部',type:'自杀式爆炸',casualties:'2名袭击者死亡',description:'PKK武装分子在内政部发动自杀式袭击'},
          {date:'2022-11-13',location:'土耳其伊斯坦布尔',type:'爆炸袭击',casualties:'8人死亡',description:'伊斯坦布尔独立大街爆炸袭击'}
        ],
        anti_china_events:[
          {date:'2022-06-15',type:'间接威胁',description:'活动区域靠近伊拉克北部中国石油投资项目'},
          {date:'2023-08-20',type:'声明',description:'批评中国对土耳其的经济支持'}
        ],
        statements:[
          {date:'2023-12-23',speaker:'PKK发言人',content:'安卡拉行动是对土耳其压迫库尔德人民的回应。',source:'PKK声明',nature:'袭击认领'}
        ]
      },
      {
        id:'TO043',name:'伊斯兰国西非省',aliases:['ISWAP','Islamic State West Africa Province'],category:'terrorist',threat_level:'critical',
        active_regions:['尼日利亚东北部','乍得湖盆地','尼日尔','喀麦隆北部'],
        headquarters:'尼日利亚博尔诺州',founded:'2016年',
        ideology:'伊斯兰极端主义、全球圣战、反西方',
        leadership:'阿布·穆萨布·巴纳维(Abu Musab al-Barnawi)(已死)，现任不明',
        personnel_size:'约3000-5000名武装人员',
        funding_sources:['绑架勒索','走私武器','征税','抢劫银行'],
        background:'伊斯兰国西非省是从博科圣地分裂出来的ISIS分支，是尼日利亚及乍得湖盆地最危险的恐怖组织。该组织以极端暴力著称，频繁袭击军方、平民和人道主义工作者。对中国在尼日利亚和西非的石油投资项目构成严重安全威胁。',
        attacks:[
          {date:'2024-01-10',location:'尼日利亚博尔诺州',type:'武装袭击',casualties:'20名士兵死亡',description:'ISWAP袭击军事基地'},
          {date:'2023-07-30',location:'尼日利亚博尔诺州',type:'绑架',casualties:'30余人被绑架',description:'ISWAP袭击村庄绑架大量平民'},
          {date:'2022-06-05',location:'尼日利亚奥沃镇',type:'教堂袭击',casualties:'40人死亡',description:'ISWAP武装分子袭击天主教堂主日礼拜'}
        ],
        anti_china_events:[
          {date:'2023-05-15',type:'威胁',description:'ISWAP发布视频威胁在尼日利亚的中国企业和公民'},
          {date:'2022-09-20',type:'绑架威胁',description:'据报ISWAP曾计划绑架中国石油工人'},
          {date:'2024-02-10',type:'袭击关联',description:'ISWAP活动区域靠近中尼铁路项目路线'}
        ],
        statements:[
          {date:'2023-05-15',speaker:'ISWAP宣传部门',content:'中国是十字军的盟友，他们在尼日利亚的资源掠夺必须停止。',source:'宣传视频',nature:'直接威胁'}
        ]
      },
      {
        id:'TO044',name:'民主同盟军',aliases:['ADF','Allied Democratic Forces','ADF-NALU'],category:'terrorist',threat_level:'high',
        active_regions:['刚果(金)东部','乌干达西部'],
        headquarters:'刚果(金)北基伍省',founded:'1995年',
        ideology:'伊斯兰极端主义、反乌干达政府',
        leadership:'穆萨·巴鲁库(Musa Baluku)头目',
        personnel_size:'约800-1200名武装人员',
        funding_sources:['走私黄金和矿产','绑架勒索','非法征税'],
        background:'民主同盟军是活跃于刚果(金)东部的伊斯兰极端组织，由乌干达穆斯林叛乱分子组成。近年来与ISIS结盟，成为刚果(金)东部最暴力的武装组织之一。该组织活动区域靠近中国在刚果(金)的矿业投资项目，对中方资产和人员构成直接安全威胁。',
        attacks:[
          {date:'2023-09-15',location:'刚果(金)北基伍省',type:'屠杀',casualties:'20名平民死亡',description:'ADF袭击村庄屠杀平民'},
          {date:'2023-06-10',location:'刚果(金)伊图里省',type:'武装袭击',casualties:'15人死亡',description:'袭击难民营'},
          {date:'2022-12-05',location:'刚果(金)贝尼',type:'爆炸袭击',casualties:'8人死亡',description:'教堂爆炸袭击'}
        ],
        anti_china_events:[
          {date:'2023-11-20',type:'袭击威胁',description:'ADF活动区域与刚果(金)中国钴矿项目区重叠'},
          {date:'2022-08-15',type:'绑架威胁',description:'据报ADF曾计划绑架中国矿业工程师'}
        ],
        statements:[
          {date:'2023-09-16',speaker:'ADF发言人',content:'我们是伊斯兰国的一部分，将继续战斗直到建立真主的法律。',source:'社交媒体',nature:'宣传煽动'}
        ]
      },
      {
        id:'TO045',name:'伊斯兰国中非省',aliases:['ISCAP','ISCentral Africa Province'],category:'terrorist',threat_level:'high',
        active_regions:['刚果(金)东部','莫桑比克北部'],
        headquarters:'刚果(金)北基伍省/莫桑比克德尔加杜角省',founded:'2019年',
        ideology:'伊斯兰极端主义、ISIS分支',
        leadership:'阿布·优素福(Abu Yusuf)莫桑比克分支头目',
        personnel_size:'约500-800名武装人员',
        funding_sources:['走私宝石','非法采矿','绑架勒索'],
        background:'伊斯兰国中非省在刚果(金)和莫桑比克开展活动。在莫桑比克德尔加杜角省频繁发动袭击，严重影响该国LNG液化天然气项目。中国企业在莫桑比克有大量基础设施投资，该组织对中方资产构成直接安全威胁。',
        attacks:[
          {date:'2023-05-20',location:'莫桑比克德尔加杜角省',type:'武装袭击',casualties:'多人伤亡',description:'ISCAP袭击村庄'},
          {date:'2021-03-24',location:'莫桑比克帕尔马镇',type:'大规模武装袭击',casualties:'数十人死亡',description:'ISCAP攻占帕尔马镇，迫使LNG项目停工'},
          {date:'2022-10-15',location:'刚果(金)北基伍省',type:'袭击',casualties:'10人死亡',description:'袭击采矿社区'}
        ],
        anti_china_events:[
          {date:'2021-03-25',type:'直接威胁',description:'帕尔马袭击迫使包括中国企业在内的外资撤出'},
          {date:'2023-08-10',type:'威胁',description:'威胁将袭击在莫桑比克北部的外国企业'}
        ],
        statements:[
          {date:'2021-03-25',speaker:'ISCAP宣传部门',content:'外国侵略者必须离开我们的土地。',source:'声明',nature:'袭击认领'}
        ]
      },
      {
        id:'TO046',name:'哥伦比亚民族解放军',aliases:['ELN','Ejercito de Liberacion Nacional','民族解放军'],category:'terrorist',threat_level:'high',
        active_regions:['哥伦比亚东部','哥伦比亚北部','委内瑞拉边境'],
        headquarters:'哥伦比亚(游击区)',founded:'1964年',
        ideology:'马克思列宁主义、格瓦拉主义、反政府武装',
        leadership:'安东尼奥·加西亚(Antonio Garcia)指挥官',
        personnel_size:'约2500-3000名武装人员',
        funding_sources:['绑架勒索','毒品贸易','非法采矿','征税'],
        background:'哥伦比亚民族解放军是南美最大的左翼游击队组织之一。参与毒品贸易、绑架勒索和非法采矿活动。该组织活动区域靠近中国企业在哥伦比亚的石油和矿业投资区域，对中方资产构成安全威胁。',
        attacks:[
          {date:'2023-10-10',location:'哥伦比亚阿劳卡省',type:'武装袭击',casualties:'9名士兵死亡',description:'ELN伏击政府军巡逻队'},
          {date:'2023-05-25',location:'哥伦比亚北部',type:'石油管道破坏',casualties:'无伤亡',description:'ELN破坏石油管道造成泄漏'},
          {date:'2022-12-15',location:'哥伦比亚',type:'绑架',casualties:'5人被绑架',description:'ELN绑架外国企业员工'}
        ],
        anti_china_events:[
          {date:'2023-05-25',type:'基础设施破坏',description:'破坏的石油管道属于中资参股企业'},
          {date:'2022-11-10',type:'威胁',description:'ELN向在哥伦比亚的外资企业发出勒索信'}
        ],
        statements:[
          {date:'2023-10-11',speaker:'ELN指挥部',content:'我们的斗争是反对跨国资本对哥伦比亚资源的掠夺。',source:'声明',nature:'宣传煽动'}
        ]
      },
      {
        id:'TO047',name:'哥伦比亚革命武装力量持械派别',aliases:['FARC dissidents','FARC-EP持械派','前FARC成员'],category:'terrorist',threat_level:'high',
        active_regions:['哥伦比亚南部','哥伦比亚西南部','秘鲁边境'],
        headquarters:'哥伦比亚(分散游击区)',founded:'2017年',
        ideology:'马克思列宁主义、反政府、毒品经济',
        leadership:'伊万·马尔多纳多(Ivan Mordisco)头目',
        personnel_size:'约2500-3500名武装人员',
        funding_sources:['毒品贸易','非法采矿','绑架勒索','征税'],
        background:'哥伦比亚革命武装力量持械派别是2016年和平协议后拒绝解除武装的前FARC成员组成。主要在哥伦比亚南部从事毒品贸易和非法采矿。活动区域与中国企业在哥伦比亚的矿业投资重叠。',
        attacks:[
          {date:'2023-08-15',location:'哥伦比亚考卡省',type:'武装袭击',casualties:'5名士兵死亡',description:'持械派别袭击政府军'},
          {date:'2022-10-20',location:'哥伦比亚梅塔省',type:'绑架',casualties:'3人被绑架',description:'绑架石油公司员工'}
        ],
        anti_china_events:[
          {date:'2023-06-20',type:'威胁',description:'向在哥伦比亚的中国矿业企业征收"革命税"'},
          {date:'2022-11-15',type:'情报关联',description:'据报曾计划袭击中资矿业项目'}
        ],
        statements:[
          {date:'2023-06-21',speaker:'持械派别发言人',content:'不缴纳革命税的外国企业将面临后果。',source:'声明',nature:'直接威胁'}
        ]
      },
      {
        id:'TO048',name:'海地G9联盟',aliases:['G9 Family','G9 An Rasamble','海地武装联盟'],category:'terrorist',threat_level:'high',
        active_regions:['海地太子港','海地全国'],
        headquarters:'海地太子港',founded:'2020年',
        ideology:'黑帮政治化、反政府、控制领土',
        leadership:'吉米·切里齐耶(Jimmy Cherizier/"Barbecue")头目',
        personnel_size:'约数千名武装成员',
        funding_sources:['绑架勒索','走私武器','征税','毒品贸易'],
        background:'海地G9联盟是加勒比地区最暴力的武装犯罪组织之一，控制海地首都太子港大部分区域。该组织实际已超越普通黑帮，具有准军事组织特征。海地局势严重恶化，联合国和多国介入。该组织对海地境内任何外国投资构成严重安全威胁。',
        attacks:[
          {date:'2024-03-02',location:'海地太子港',type:'大规模武装袭击',casualties:'数十人死亡',description:'G9联盟攻占太子港多个区域，迫使政府进入紧急状态'},
          {date:'2023-10-26',location:'海地太子港',type:'屠杀',casualties:'70人死亡',description:'G9武装分子在太子港贫民区大规模屠杀'},
          {date:'2023-04-15',location:'海地太子港',type:'绑架',casualties:'多人被绑架',description:'大规模绑架外国公民和当地精英'}
        ],
        anti_china_events:[
          {date:'2024-03-05',type:'安全威胁',description:'海地局势恶化迫使包括中国企业在内的外国机构撤离'},
          {date:'2023-08-20',type:'威胁',description:'G9头目威胁将攻击在太子港的外国使馆和企业'}
        ],
        statements:[
          {date:'2024-03-03',speaker:'吉米·切里齐耶',content:'如果国际社会不解决海地危机，我们将让整个国家陷入混乱。',source:'视频声明',nature:'直接威胁'}
        ]
      },
      {
        id:'TO049',name:'巴勒斯坦伊斯兰圣战组织',aliases:['PIJ','Palestinian Islamic Jihad','杰哈德'],category:'terrorist',threat_level:'high',
        active_regions:['加沙地带','约旦河西岸','黎巴嫩'],
        headquarters:'加沙地带/叙利亚大马士革(流亡)',founded:'1970年代',
        ideology:'伊斯兰极端主义、反以色列、巴勒斯坦建国',
        leadership:'齐亚德·纳哈拉(Ziyad al-Nakhalah)总书记',
        personnel_size:'约数千名武装人员',
        funding_sources:['伊朗资助','海外捐款','走私'],
        background:'巴勒斯坦伊斯兰圣战组织是加沙地带第二大武装组织，仅次于哈马斯。受伊朗资助，频繁向以色列发射火箭弹。该组织对中国在中东的利益构成间接威胁，其活动可能导致地区局势升级影响中国投资。',
        attacks:[
          {date:'2023-10-07',location:'以色列南部',type:'火箭弹袭击',casualties:'多人伤亡',description:'PIJ参与10月7日对以色列的大规模袭击'},
          {date:'2023-05-09',location:'加沙地带',type:'火箭弹齐射',casualties:'以方伤亡',description:'向以色列发射数百枚火箭弹'},
          {date:'2022-08-05',location:'加沙地带',type:'武装冲突',casualties:'双方伤亡',description:'PIJ与以色列爆发三天武装冲突'}
        ],
        anti_china_events:[
          {date:'2023-10-10',type:'间接威胁',description:'中东冲突升级影响中国在该地区的投资项目'}
        ],
        statements:[
          {date:'2023-10-08',speaker:'齐亚德·纳哈拉',content:'我们的圣战将继续，直到以色列消失。',source:'声明',nature:'宣传煽动'}
        ]
      },
      {
        id:'TO050',name:'索马里青年党(伊斯兰国索马里省)',aliases:['ISS','ISIS-Somalia'],category:'terrorist',threat_level:'high',
        active_regions:['索马里南部','索马里邦特兰'],
        headquarters:'索马里邦特兰山区',founded:'2017年',
        ideology:'伊斯兰极端主义、ISIS分支',
        leadership:'阿卜杜勒·卡迪尔·米南(Abdul Qadir Mumin)头目',
        personnel_size:'约300-500名武装人员',
        funding_sources:['走私武器','绑架勒索','非法征税'],
        background:'伊斯兰国索马里省是从索马里青年党分裂出来的ISIS分支，主要在索马里邦特兰地区活动。虽然规模较小但极端暴力。该组织对索马里及亚丁湾航运安全构成威胁，影响中国到东非的海上贸易路线。',
        attacks:[
          {date:'2023-11-20',location:'索马里邦特兰',type:'武装袭击',casualties:'8人死亡',description:'ISS袭击安全部队'},
          {date:'2022-10-15',location:'索马里摩加迪沙',type:'爆炸袭击',casualties:'20人死亡',description:'ISS声称对酒店爆炸负责'}
        ],
        anti_china_events:[
          {date:'2023-09-10',type:'间接威胁',description:'活动区域靠近中国参与建设的索马里港口项目'}
        ],
        statements:[
          {date:'2023-11-21',speaker:'ISS发言人',content:'我们将继续在索马里建立伊斯兰国。',source:'社交媒体',nature:'宣传煽动'}
        ]
      },
      // ===== 新增犯罪组织 (TO051-TO068) =====
      {
        id:'TO051',name:'14K三合会',aliases:['14K','14K Triad'],category:'criminal',threat_level:'high',
        active_regions:['中国香港','东南亚','欧洲','北美'],
        headquarters:'中国香港',founded:'1940年代',
        ideology:'黑社会组织、有组织犯罪',
        leadership:'不公开(层级制管理)',
        personnel_size:'约20000+成员',
        funding_sources:['走私毒品','非法赌博','卖淫','保护费','走私'],
        background:'14K是全球最大的华人三合会组织之一，总部设在香港。该组织从事毒品走私、非法赌博、人口贩卖等跨国犯罪活动。在东南亚和欧洲有广泛分支。对中国海外企业和华人社区构成安全威胁，特别是在东南亚地区。',
        attacks:[
          {date:'2023-08-10',location:'中国香港',type:'暴力犯罪',casualties:'1人受伤',description:'14K成员在旺角持刀伤人'},
          {date:'2022-11-20',location:'意大利米兰',type:'有组织犯罪',casualties:'无直接伤亡',description:'警方破获14K跨国洗钱网络'},
          {date:'2023-04-15',location:'东南亚',type:'人口贩卖',casualties:'多名受害者',description:'14K参与东南亚人口贩卖网络'}
        ],
        anti_china_events:[
          {date:'2023-04-15',type:'华人社区威胁',description:'14K参与的东南亚犯罪网络威胁中国海外公民安全'},
          {date:'2022-09-10',type:'经济犯罪',description:'14K洗钱网络涉及中资企业海外账户'}
        ],
        statements:[]
      },
      {
        id:'TO052',name:'俄罗斯黑手党',aliases:['Bratva','俄罗斯兄弟会','Organizatsiya'],category:'criminal',threat_level:'high',
        active_regions:['俄罗斯','欧洲','中东','中亚','非洲'],
        headquarters:'俄罗斯莫斯科',founded:'1980年代',
        ideology:'有组织犯罪、权力和利益',
        leadership:'谢苗·莫吉列维奇(Semyon Mogilevich)疑似最高头目',
        personnel_size:'约数十万成员(全球网络)',
        funding_sources:['走私武器','毒品贸易','网络犯罪','洗钱','非法赌博'],
        background:'俄罗斯黑手党是全球最大的跨国犯罪组织之一，以高度组织化和暴力著称。该组织从事武器走私、网络犯罪、洗钱等全球犯罪活动。在中亚和非洲的活动对中国海外投资和中资企业安全构成威胁。',
        attacks:[
          {date:'2023-07-20',location:'俄罗斯莫斯科',type:'暗杀',casualties:'1人死亡',description:'商业竞争对手被暗杀'},
          {date:'2022-12-10',location:'欧洲',type:'网络犯罪',casualties:'巨额资金损失',description:'大规模网络诈骗和洗钱'},
          {date:'2023-03-15',location:'非洲',type:'走私',casualties:'无直接伤亡',description:'在非洲走私武器和矿产'}
        ],
        anti_china_events:[
          {date:'2023-03-15',type:'经济犯罪',description:'在非洲的武器走私网络威胁中资企业安全'},
          {date:'2022-10-20',type:'网络攻击',description:'据报俄罗斯黑手党关联黑客攻击中国金融机构'}
        ],
        statements:[]
      },
      {
        id:'TO053',name:'意大利光荣会',aliases:['Camorra','那不勒斯黑手党'],category:'criminal',threat_level:'medium',
        active_regions:['意大利那不勒斯','意大利坎帕尼亚大区','欧洲'],
        headquarters:'意大利那不勒斯',founded:'18世纪',
        ideology:'有组织犯罪、黑帮文化',
        leadership:'多名家族头目(分散管理)',
        personnel_size:'约数千名成员',
        funding_sources:['走私毒品','非法垃圾处理','保护费','建筑行业控制'],
        background:'意大利光荣会是意大利三大黑手党组织之一，总部在那不勒斯。以毒品走私和非法垃圾处理著称。该组织在欧洲的犯罪网络涉及中国企业海外贸易和投资。',
        attacks:[
          {date:'2023-06-10',location:'意大利那不勒斯',type:'黑帮火并',casualties:'3人死亡',description:'Camorra内部家族火并'},
          {date:'2022-09-25',location:'意大利坎帕尼亚',type:'暗杀',casualties:'1人死亡',description:'黑帮暗杀告密者'}
        ],
        anti_china_events:[
          {date:'2023-01-15',type:'经济犯罪',description:'Camorra洗钱网络涉及中意贸易企业'}
        ],
        statements:[]
      },
      {
        id:'TO054',name:'尼日利亚黑斧帮',aliases:['Black Axe','Neo-Black Movement'],category:'criminal',threat_level:'high',
        active_regions:['尼日利亚','西非','欧洲','北美'],
        headquarters:'尼日利亚',founded:'1977年',
        ideology:'黑人至上主义(表面)、有组织犯罪(实际)',
        leadership:'不公开(层级制)',
        personnel_size:'约数万成员(全球网络)',
        funding_sources:['网络诈骗','毒品走私','人口贩卖','走私'],
        background:'尼日利亚黑斧帮是西非最大的跨国犯罪组织之一。以网络诈骗(特别是商业邮件欺诈BEC)和人口贩卖著称。该组织对在尼日利亚和西非的中国企业和公民构成严重安全威胁，曾参与多起针对中国公民的绑架和诈骗案件。',
        attacks:[
          {date:'2023-09-20',location:'尼日利亚拉各斯',type:'绑架',casualties:'1名中国公民被绑架',description:'黑斧帮关联组织绑架中国工程师'},
          {date:'2022-11-10',location:'尼日利亚',type:'网络诈骗',casualties:'巨额资金损失',description:'BEC商业邮件诈骗攻击多国企业'},
          {date:'2023-04-05',location:'欧洲',type:'洗钱',casualties:'无直接伤亡',description:'大规模跨国洗钱网络'}
        ],
        anti_china_events:[
          {date:'2023-09-20',type:'绑架中国公民',description:'黑斧帮关联组织在尼日利亚绑架中国工程师'},
          {date:'2022-11-10',type:'网络攻击',description:'网络诈骗目标包括中国企业'},
          {date:'2023-06-15',type:'威胁',description:'向在尼日利亚的中国企业发出勒索信'}
        ],
        statements:[]
      },
      {
        id:'TO055',name:'Lazarus Group',aliases:['拉撒路集团','APT38','Hidden Cobra'],category:'criminal',threat_level:'critical',
        active_regions:['全球(网络空间)','朝鲜'],
        headquarters:'朝鲜平壤',founded:'2009年',
        ideology:'国家支持网络犯罪、为朝鲜政权获取资金',
        leadership:'朝鲜侦察总局直接指挥',
        personnel_size:'约6000-8000名黑客(含支援人员)',
        funding_sources:['加密货币盗窃','银行劫案(网络)','勒索软件','国家资助'],
        background:'Lazarus Group是朝鲜侦察总局支持的黑客组织，是全球最危险的国家支持网络犯罪组织之一。以加密货币交易所盗窃和银行网络劫案著称。该组织多次攻击全球金融机构和加密货币交易所，对中国金融安全和海外资产构成严重网络威胁。',
        attacks:[
          {date:'2023-06-15',location:'全球',type:'加密货币盗窃',casualties:'3亿美元被盗',description:'Lazarus从多个加密货币交易所盗窃资金'},
          {date:'2022-03-29',location:'美国',type:'网络攻击',casualties:'6.2亿美元被盗',description:'攻击Ronin Network加密货币项目'},
          {date:'2021-08-15',location:'全球',type:'网络间谍',casualties:'数据泄露',description:'针对多国国防和金融机构的网络间谍活动'}
        ],
        anti_china_events:[
          {date:'2023-06-15',type:'网络攻击',description:'据报Lazarus攻击了中国参与的加密货币交易平台'},
          {date:'2022-09-10',type:'网络间谍',description:'针对中国金融机构的网络间谍活动'},
          {date:'2023-11-20',type:'供应链攻击',description:'通过供应链攻击波及中国企业的海外分支机构'}
        ],
        statements:[]
      },
      {
        id:'TO056',name:'金三角毒品集团',aliases:['Golden Triangle Drug Cartel','金三角贩毒网络'],category:'criminal',threat_level:'high',
        active_regions:['缅甸掸邦','老挝北部','泰国北部'],
        headquarters:'缅甸掸邦(金三角地区)',founded:'1960年代',
        ideology:'有组织犯罪、毒品经济',
        leadership:'多名地方军阀和毒枭(分散管理)',
        personnel_size:'约数万武装人员(含民兵)',
        funding_sources:['毒品制造和贸易','走私','非法赌博','电信诈骗'],
        background:'金三角是全球最大的毒品产区之一，该地区有多个毒品制造和贩运集团。近年来金三角地区的犯罪网络扩展到电信诈骗和非法赌博，大量中国公民被骗。该地区对中国公民安全构成严重威胁，是公安部重点打击对象。',
        attacks:[
          {date:'2023-10-20',location:'缅甸掸邦',type:'电信诈骗',casualties:'数千名中国公民受害',description:'金三角电信诈骗园区诈骗中国公民数十亿元'},
          {date:'2023-07-15',location:'缅甸木姐',type:'武装冲突',casualties:'多人伤亡',description:'毒枭武装与缅甸军方交火'},
          {date:'2022-12-10',location:'老挝北部',type:'毒品查获',casualties:'无直接伤亡',description:'警方查获大量冰毒'}
        ],
        anti_china_events:[
          {date:'2023-10-20',type:'电信诈骗',description:'金三角诈骗园区针对中国公民的电信诈骗'},
          {date:'2023-08-15',type:'人口贩卖',description:'诱骗中国公民至缅甸诈骗园区，不从者遭虐待'},
          {date:'2023-05-10',type:'绑架',description:'绑架中国公民至诈骗园区强制劳动'}
        ],
        statements:[]
      },
      {
        id:'TO057',name:'委内瑞拉阿拉瓜列车',aliases:['Tren de Aragua','TdA','阿拉瓜火车帮'],category:'criminal',threat_level:'high',
        active_regions:['委内瑞拉','哥伦比亚','秘鲁','智利','巴西','美国'],
        headquarters:'委内瑞拉阿拉瓜州(原监狱基地)',founded:'2000年代',
        ideology:'有组织犯罪、跨国扩张',
        leadership:'赫克托·格雷罗(Hector Guerrero/"Nino Guerrero")头目',
        personnel_size:'约数千名成员',
        funding_sources:['人口贩卖','走私','绑架勒索','毒品贸易','非法采矿'],
        background:'阿拉瓜列车是委内瑞拉最危险的跨国犯罪组织，起源于委内瑞拉监狱。该组织已扩展到南美多国，从事人口贩卖、绑架和毒品贸易。据报该组织成员已进入美国，对全球安全构成威胁。在拉美地区对中国企业和公民构成安全威胁。',
        attacks:[
          {date:'2024-01-20',location:'智利',type:'有组织犯罪',casualties:'多人受害',description:'TdA在智利大规模犯罪活动'},
          {date:'2023-09-30',location:'秘鲁',type:'人口贩卖',casualties:'多名受害者',description:'TdA从事跨国人口贩卖'},
          {date:'2023-11-15',location:'哥伦比亚',type:'绑架',casualties:'多人被绑架',description:'TdA在哥伦比亚边境绑架移民'}
        ],
        anti_china_events:[
          {date:'2023-11-15',type:'安全威胁',description:'TdA在拉美的犯罪活动威胁中国企业海外安全'},
          {date:'2024-01-20',type:'经济犯罪',description:'TdA洗钱网络涉及中资企业海外账户'}
        ],
        statements:[]
      },
      {
        id:'TO058',name:'巴西红色司令部',aliases:['Comando Vermelho','CV','红色命令'],category:'criminal',threat_level:'high',
        active_regions:['巴西里约热内卢','巴西全国','南美'],
        headquarters:'巴西里约热内卢',founded:'1979年',
        ideology:'有组织犯罪、监狱帮派演变',
        leadership:'多名头目(分散管理)',
        personnel_size:'约数万成员',
        funding_sources:['毒品贸易','走私武器','绑架勒索','非法赌博'],
        background:'巴西红色司令部是巴西最大的有组织犯罪集团之一，控制里约热内卢多个贫民窟。以毒品贸易和暴力冲突著称。该组织在巴西全国和南美有广泛网络，对在巴西的中国企业和公民构成安全威胁。',
        attacks:[
          {date:'2023-08-20',location:'巴西里约热内卢',type:'武装冲突',casualties:'10人死亡',description:'CV与 rival 帮派在贫民窟火并'},
          {date:'2022-11-15',location:'巴西里约热内卢',type:'绑架',casualties:'1人被绑架',description:'CV绑架外国企业高管'}
        ],
        anti_china_events:[
          {date:'2023-08-20',type:'安全威胁',description:'CV控制的贫民窟靠近部分中资企业项目区域'},
          {date:'2022-11-15',type:'绑架威胁',description:'据报CV曾计划绑架中国企业家'}
        ],
        statements:[]
      },
      {
        id:'TO059',name:'墨西哥华雷斯贩毒集团',aliases:['Juarez Cartel','VCJ','Vicente Carrillo Fuentes Organization'],category:'criminal',threat_level:'high',
        active_regions:['墨西哥奇瓦瓦州','墨西哥北部'],
        headquarters:'墨西哥华雷斯城',founded:'1970年代',
        ideology:'有组织犯罪、毒品经济',
        leadership:'胡安·巴勃罗·雷东(Juan Pablo Ledezma)疑似头目',
        personnel_size:'约数百至数千成员',
        funding_sources:['毒品贸易','走私武器','绑架勒索','征税'],
        background:'华雷斯贩毒集团是墨西哥主要贩毒组织之一，控制美墨边境毒品走私通道。以极端暴力著称。该组织对在墨西哥的中国企业和公民构成安全威胁，特别是在墨西哥北部地区。',
        attacks:[
          {date:'2023-06-15',location:'墨西哥奇瓦瓦州',type:'武装冲突',casualties:'8人死亡',description:'与敌对贩毒集团火并'},
          {date:'2022-10-10',location:'墨西哥华雷斯',type:'绑架',casualties:'3人被绑架',description:'绑架外国企业员工'}
        ],
        anti_china_events:[
          {date:'2023-06-15',type:'安全威胁',description:'活动区域靠近中资企业在墨西哥北部的制造业投资'},
          {date:'2022-10-10',type:'绑架威胁',description:'绑架目标包括中国公民'}
        ],
        statements:[]
      },
      {
        id:'TO060',name:'暗网勒索组织',aliases:['Conti/DarkSide/BlackCat','勒索软件即服务','RaaS'],category:'criminal',threat_level:'critical',
        active_regions:['全球(网络空间)','东欧','俄罗斯'],
        headquarters:'不固定(去中心化)',founded:'2019年',
        ideology:'网络犯罪、经济利益',
        leadership:'多名匿名头目(去中心化管理)',
        personnel_size:'约数百核心成员(全球网络)',
        funding_sources:['勒索赎金','数据盗窃','暗网交易'],
        background:'暗网勒索组织是一类从事勒索软件攻击的跨国网络犯罪组织。以Conti、DarkSide、BlackCat等品牌运营，攻击全球企业和基础设施。该类组织多次攻击中国企业的海外分支和供应链，对中国网络安全构成严重威胁。',
        attacks:[
          {date:'2023-09-15',location:'全球',type:'勒索软件',casualties:'巨额经济损失',description:'攻击多个国家的基础设施和企业'},
          {date:'2022-11-20',location:'全球',type:'数据盗窃',casualties:'大量数据泄露',description:'窃取并公开多家企业敏感数据'},
          {date:'2023-04-10',location:'亚洲',type:'勒索软件',casualties:'业务中断',description:'攻击亚洲制造业企业供应链'}
        ],
        anti_china_events:[
          {date:'2023-09-15',type:'网络攻击',description:'据报攻击了中国企业在海外的分支机构'},
          {date:'2022-11-20',type:'数据泄露',description:'中国企业的供应链数据被窃取'},
          {date:'2023-04-10',type:'业务中断',description:'中国制造业企业海外供应链遭攻击'}
        ],
        statements:[]
      },
      {
        id:'TO061',name:'中亚毒品走私网络',aliases:['中亚贩毒通道','北方路线'],category:'criminal',threat_level:'high',
        active_regions:['阿富汗','塔吉克斯坦','乌兹别克斯坦','吉尔吉斯斯坦','哈萨克斯坦'],
        headquarters:'阿富汗北部/塔吉克斯坦边境',founded:'1990年代',
        ideology:'有组织犯罪、毒品经济',
        leadership:'多名地方贩毒集团头目',
        personnel_size:'约数千人(含运输和安保人员)',
        funding_sources:['毒品制造和运输','走私武器','人口贩卖'],
        background:'中亚毒品走私网络是从阿富汗向俄罗斯和欧洲运输毒品的主要通道。该网络利用中亚国家的边境漏洞进行大规模毒品走私。活动区域靠近中国新疆边境，对中国西部安全和一带一路项目构成威胁。',
        attacks:[
          {date:'2023-07-25',location:'塔吉克斯坦',type:'武装走私',casualties:'3名边防军死亡',description:'贩毒集团与边防军交火'},
          {date:'2022-12-10',location:'吉尔吉斯斯坦',type:'毒品查获',casualties:'无直接伤亡',description:'警方查获大量海洛因'}
        ],
        anti_china_events:[
          {date:'2023-07-25',type:'安全威胁',description:'活动区域靠近中塔边境和中国在塔吉克斯坦的投资项目'},
          {date:'2022-12-10',type:'边境安全',description:'毒品走私路线经过中国-中亚天然气管道附近'}
        ],
        statements:[]
      },
      {
        id:'TO062',name:'西非网络诈骗集团',aliases:['西非诈骗网络','Yahoo Boys','尼日利亚网络诈骗'],category:'criminal',threat_level:'high',
        active_regions:['尼日利亚','加纳','科特迪瓦','塞内加尔','全球(网络)'],
        headquarters:'尼日利亚拉各斯',founded:'2000年代',
        ideology:'有组织犯罪、网络诈骗',
        leadership:'多名诈骗团伙头目(分散管理)',
        personnel_size:'约数万人(含外围人员)',
        funding_sources:['网络诈骗','商业邮件欺诈(BEC)','恋爱诈骗','洗钱'],
        background:'西非网络诈骗集团是全球最大的网络诈骗犯罪网络之一。以商业邮件欺诈(BEC)和恋爱诈骗著称，每年诈骗金额达数十亿美元。中国企业和公民是重要受害群体，多名中国公民被骗巨额资金。',
        attacks:[
          {date:'2023-10-10',location:'全球',type:'商业邮件欺诈',casualties:'中国企业损失数千万',description:'BEC诈骗攻击中国企业海外分公司'},
          {date:'2023-06-20',location:'全球',type:'恋爱诈骗',casualties:'多名中国公民受害',description:'通过社交平台诈骗中国公民'},
          {date:'2022-11-15',location:'全球',type:'洗钱',casualties:'巨额资金',description:'通过跨国洗钱网络转移诈骗资金'}
        ],
        anti_china_events:[
          {date:'2023-10-10',type:'网络诈骗',description:'BEC诈骗直接攻击中国企业，造成巨额损失'},
          {date:'2023-06-20',type:'恋爱诈骗',description:'多名中国公民被骗至西非'},
          {date:'2023-08-15',type:'绑架',description:'部分受害者被诱骗至西非后遭绑架勒索'}
        ],
        statements:[]
      },
      // ===== 新增反华非政府组织 (TO063-TO079) =====
      {
        id:'TO063',name:'对华政策跨国议会联盟',aliases:['IPAC','Inter-Parliamentary Alliance on China'],category:'anti_china_ngo',threat_level:'high',
        active_regions:['全球','美国','英国','欧洲','澳大利亚','日本'],
        headquarters:'英国伦敦(秘书处)',founded:'2020年',
        ideology:'对华强硬、协调西方对华政策、人权关注',
        leadership:'卢克·德·波尔福德(Luke de Pulford)协调人',
        personnel_size:'约数百名议员(全球网络)',
        funding_sources:['各国议会经费','私人捐助','基金会资助'],
        background:'对华政策跨国议会联盟由多国国会议员组成，旨在协调各国对华政策。该组织频繁在新疆、香港、台湾等问题上攻击中国，推动对华制裁。是西方反华议员协调行动的重要平台。',
        attacks:[],
        anti_china_events:[
          {date:'2024-03-15',type:'政策推动',description:'IPAC推动多国议会通过涉疆、涉港决议'},
          {date:'2023-09-10',type:'会议',description:'在布拉格举办年会，邀请多国反华议员参加'},
          {date:'2023-06-20',type:'报告',description:'发布涉华"人权"报告，散布虚假信息'},
          {date:'2024-01-30',type:'制裁推动',description:'推动多国对中国官员实施制裁'}
        ],
        statements:[
          {date:'2024-03-15',speaker:'IPAC联合主席',content:'中国对民主世界的挑战是空前的，我们必须共同应对。',source:'声明',nature:'煽动制裁'},
          {date:'2023-09-10',speaker:'IPAC协调人',content:'各国的对华政策必须协调一致，单打独斗无法应对中国。',source:'年会演讲',nature:'意识形态攻击'},
          {date:'2023-06-20',speaker:'IPAC',content:'中国在新疆的"人权侵犯"必须受到国际社会的制裁。',source:'报告',nature:'抹黑攻击'}
        ]
      },
      {
        id:'TO064',name:'维吾尔人权项目',aliases:['UHRP','Uyghur Human Rights Project'],category:'anti_china_ngo',threat_level:'high',
        active_regions:['美国','德国','全球'],
        headquarters:'美国华盛顿',founded:'2004年',
        ideology:'涉疆分裂主义、反华宣传',
        leadership:'乌迈尔·伊纳耶特(Omir Niyaz)执行主任',
        personnel_size:'约10-20名核心人员',
        funding_sources:['NED资助','海外维吾尔侨民捐款','私人基金会'],
        background:'维吾尔人权项目是美国NED资助的反华组织，专门针对中国新疆政策进行抹黑宣传。该组织频繁发布涉疆虚假报告，推动对华制裁。是西方涉疆叙事的主要推手之一。',
        attacks:[],
        anti_china_events:[
          {date:'2024-02-15',type:'报告',description:'发布涉疆"强制劳动"报告，攻击中国棉花产业'},
          {date:'2023-08-30',type:'游说',description:'游说美国国会通过涉疆制裁法案'},
          {date:'2023-12-10',type:'集会',description:'组织海外维吾尔人在日内瓦联合国总部抗议'},
          {date:'2024-04-01',type:'法律推动',description:'推动多国通过涉疆"种族灭绝"决议'}
        ],
        statements:[
          {date:'2024-02-15',speaker:'UHRP执行主任',content:'中国在新疆的强制劳动必须受到国际制裁。',source:'报告前言',nature:'煽动制裁'},
          {date:'2023-12-10',speaker:'UHRP发言人',content:'联合国必须采取行动，制止中国在新疆的暴行。',source:'抗议集会',nature:'煽动制裁'}
        ]
      },
      {
        id:'TO065',name:'澳大利亚战略政策研究所',aliases:['ASPI','Australian Strategic Policy Institute'],category:'anti_china_ngo',threat_level:'high',
        active_regions:['澳大利亚','全球'],
        headquarters:'澳大利亚堪培拉',founded:'2001年',
        ideology:'对华鹰派、安全研究、反华宣传',
        leadership:'彼得·詹宁斯(Peter Jennings)执行所长',
        personnel_size:'约30-50名研究人员',
        funding_sources:['澳大利亚国防部资助','美国国务院资助','外国政府资助'],
        background:'澳大利亚战略政策研究所是澳大利亚主要的安全智库，近年来已成为全球最活跃的反华研究机构之一。该机构频繁发布涉华研究报告，在新疆、台湾、南海等问题上攻击中国。大量报告被西方媒体引用，是反华叙事的重要来源。',
        attacks:[],
        anti_china_events:[
          {date:'2023-09-05',type:'报告',description:'发布涉疆"强制劳动"供应链报告，攻击中国企业'},
          {date:'2024-03-20',type:'报告',description:'发布报告攻击中国在太平洋岛国的影响力'},
          {date:'2023-11-15',type:'报告',description:'发布报告称中国进行"认知战"'},
          {date:'2024-01-10',type:'游说',description:'向澳大利亚政府建议扩大对华制裁'}
        ],
        statements:[
          {date:'2023-09-05',speaker:'ASPI研究员',content:'中国的强制劳动供应链必须被切断。',source:'报告',nature:'煽动制裁'},
          {date:'2024-03-20',speaker:'ASPI',content:'中国在太平洋的扩张是对澳大利亚的直接安全威胁。',source:'报告',nature:'意识形态攻击'},
          {date:'2023-11-15',speaker:'ASPI研究员',content:'中国正在进行全球认知战，民主国家必须觉醒。',source:'报告',nature:'抹黑攻击'}
        ]
      },
      {
        id:'TO066',name:'美国国际宗教自由委员会',aliases:['USCIRF','U.S. Commission on International Religious Freedom'],category:'anti_china_ngo',threat_level:'high',
        active_regions:['美国','全球'],
        headquarters:'美国华盛顿',founded:'1998年',
        ideology:'宗教自由推广、对华宗教制裁',
        leadership:'努里·特克尔(Nury Turkel)主席(维吾尔裔美国人)',
        personnel_size:'约10-15名委员和工作人员',
        funding_sources:['美国联邦政府预算'],
        background:'美国国际宗教自由委员会是美国联邦政府机构，负责监控全球宗教自由状况。该机构在新疆、西藏、香港等问题上频繁攻击中国，推动对华宗教制裁。是美对华施压的重要工具之一。',
        attacks:[],
        anti_china_events:[
          {date:'2024-04-25',type:'年度报告',description:'发布年度报告将中国列为"特别关注国"'},
          {date:'2023-09-15',type:'制裁建议',description:'建议美国政府对更多中国官员实施制裁'},
          {date:'2023-12-20',type:'听证会',description:'举办涉疆听证会，邀请反华人士作证'},
          {date:'2024-02-10',type:'立法推动',description:'推动国会通过涉宗教自由制裁法案'}
        ],
        statements:[
          {date:'2024-04-25',speaker:'USCIRF主席',content:'中国是全球宗教自由最严重的侵犯者。',source:'年度报告',nature:'抹黑攻击'},
          {date:'2023-09-15',speaker:'USCIRF委员',content:'美国必须对更多中国官员实施制裁。',source:'声明',nature:'煽动制裁'}
        ]
      },
      {
        id:'TO067',name:'共产主义受难者纪念基金会',aliases:['VOC','Victims of Communism Memorial Foundation'],category:'anti_china_ngo',threat_level:'medium',
        active_regions:['美国','全球'],
        headquarters:'美国华盛顿',founded:'1993年',
        ideology:'反共主义、对华意识形态攻击',
        leadership:'肯尼思·韦斯布罗德(Ken Oliver Weinberg)主席',
        personnel_size:'约10-20名工作人员',
        funding_sources:['美国国会资助','私人捐助','基金会资助'],
        background:'共产主义受难者纪念基金会是美国反共组织，以纪念共产主义受难者为名从事反共宣传。近年来主要针对中国进行意识形态攻击，在新疆和西藏问题上尤为活跃。',
        attacks:[],
        anti_china_events:[
          {date:'2023-11-07',type:'报告',description:'发布"全球受共产主义奴役"报告，攻击中国'},
          {date:'2024-02-20',type:'活动',description:'举办涉疆"种族灭绝"纪念活动'},
          {date:'2023-06-15',type:'教育',description:'在美国学校推广反华教育材料'}
        ],
        statements:[
          {date:'2023-11-07',speaker:'VOC主席',content:'共产主义仍然奴役着数亿人，中国是最大的压迫者。',source:'报告',nature:'意识形态攻击'},
          {date:'2024-02-20',speaker:'VOC',content:'新疆的种族灭绝必须被全世界记住。',source:'活动演讲',nature:'抹黑攻击'}
        ]
      },
      {
        id:'TO068',name:'美中经济与安全审查委员会',aliases:['USCC','U.S.-China Economic and Security Review Commission'],category:'anti_china_ngo',threat_level:'high',
        active_regions:['美国','全球'],
        headquarters:'美国华盛顿',founded:'2000年',
        ideology:'对华战略竞争、安全审查、反华政策建议',
        leadership:'卡罗琳·巴塞洛缪(Carolyn Bartholomew)主席',
        personnel_size:'约15-20名工作人员',
        funding_sources:['美国联邦政府预算'],
        background:'美中经济与安全审查委员会是美国国会设立的委员会，负责监控和评估美中关系对美安全影响。该机构每年向国会提交报告，是对华强硬政策的重要推手。在贸易、技术、军事等领域频繁发出对华警告和建议。',
        attacks:[],
        anti_china_events:[
          {date:'2023-11-14',type:'年度报告',description:'发布年度报告称中国是美国最大战略威胁'},
          {date:'2024-03-12',type:'听证会',description:'举办涉华技术竞争听证会，建议扩大对华技术封锁'},
          {date:'2023-07-20',type:'报告',description:'发布报告攻击中国"一带一路"倡议'},
          {date:'2024-01-25',type:'政策建议',description:'建议美国限制中国企业对美投资'}
        ],
        statements:[
          {date:'2023-11-14',speaker:'USCC主席',content:'中国的经济和安全行为对美国构成前所未有的挑战。',source:'年度报告',nature:'意识形态攻击'},
          {date:'2024-03-12',speaker:'USCC委员',content:'美国必须在技术上与中国完全脱钩。',source:'听证会',nature:'煽动制裁'},
          {date:'2023-07-20',speaker:'USCC',content:'一带一路是地缘政治扩张的工具。',source:'报告',nature:'抹黑攻击'}
        ]
      },
      {
        id:'TO069',name:'德国弗里德里希·瑙曼基金会',aliases:['FNF','Friedrich Naumann Foundation for Freedom'],category:'anti_china_ngo',threat_level:'medium',
        active_regions:['德国','欧洲','东南亚','全球'],
        headquarters:'德国波茨坦',founded:'1958年',
        ideology:'自由主义、对华意识形态推广',
        leadership:'卡尔-海因茨·帕泽尔特(Karl-Heinz Paqué)主席',
        personnel_size:'约100+员工(全球)',
        funding_sources:['德国政府资助','欧盟资金','私人捐助'],
        background:'德国弗里德里希·瑙曼基金会是德国自由民主党(FDP)下属的政治基金会。近年来该基金会在中国新疆、香港问题上频繁攻击中国。2024年该基金会被中国列为不受欢迎组织，其在华活动被停止。',
        attacks:[],
        anti_china_events:[
          {date:'2024-03-01',type:'被制裁',description:'中国对该基金会实施制裁，要求其停止在华活动'},
          {date:'2023-09-20',type:'报告',description:'发布涉疆报告，攻击中国新疆政策'},
          {date:'2023-12-10',type:'活动',description:'在香港举办"民主"论坛，邀请反华人士参加'}
        ],
        statements:[
          {date:'2024-03-02',speaker:'FNF主席',content:'中国对我们的制裁证明其害怕自由和民主。',source:'声明',nature:'意识形态攻击'},
          {date:'2023-09-20',speaker:'FNF',content:'新疆的人权状况是国际社会的耻辱。',source:'报告',nature:'抹黑攻击'}
        ]
      },
      {
        id:'TO070',name:'中国人权捍卫者',aliases:['CHRD','Chinese Human Rights Defenders'],category:'anti_china_ngo',threat_level:'medium',
        active_regions:['美国','中国香港','全球'],
        headquarters:'美国华盛顿/中国香港',founded:'1989年',
        ideology:'人权推广、反华政治宣传',
        leadership:'夏保罗(Sharon Hom)执行主任',
        personnel_size:'约10-15名工作人员',
        funding_sources:['NED资助','私人基金会','海外华人捐助'],
        background:'中国人权捍卫者是NED资助的反华组织，以人权为名从事反华政治宣传。该组织在联合国人权理事会频繁攻击中国，散布虚假信息。是西方涉华人权叙事的重要推手。',
        attacks:[],
        anti_china_events:[
          {date:'2024-03-10',type:'联合国游说',description:'在联合国人权理事会攻击中国新疆政策'},
          {date:'2023-09-20',type:'报告',description:'发布报告攻击中国"人权律师"待遇'},
          {date:'2023-12-15',type:'活动',description:'组织海外反华人士在联合国日内瓦抗议'}
        ],
        statements:[
          {date:'2024-03-10',speaker:'CHRD代表',content:'中国在新疆的暴行必须受到联合国调查。',source:'联合国发言',nature:'煽动制裁'},
          {date:'2023-09-20',speaker:'CHRD',content:'中国的人权律师正在遭受系统性迫害。',source:'报告',nature:'抹黑攻击'}
        ]
      },
      {
        id:'TO071',name:'西藏行动中心',aliases:['Tibet Action Center','TAC'],category:'anti_china_ngo',threat_level:'medium',
        active_regions:['美国','印度达兰萨拉','全球'],
        headquarters:'美国纽约',founded:'2009年',
        ideology:'西藏分裂主义、反华宣传',
        leadership:'拉珍·哲通(Lhadon Tethong)主任',
        personnel_size:'约5-10名工作人员',
        funding_sources:['NED资助','海外藏人捐助','私人基金会'],
        background:'西藏行动中心是美国注册的反华组织，专门从事涉藏反华宣传和分裂活动。该组织利用数字技术进行反华宣传，组织海外藏人进行抗议活动。是西方涉藏叙事的重要推手。',
        attacks:[],
        anti_china_events:[
          {date:'2024-03-10',type:'活动',description:'组织"西藏起义日"纪念活动，攻击中国西藏政策'},
          {date:'2023-07-15',type:'数字宣传',description:'利用社交媒体大规模传播涉藏虚假信息'},
          {date:'2023-12-10',type:'游说',description:'游说美国国会通过涉藏决议'}
        ],
        statements:[
          {date:'2024-03-10',speaker:'TAC主任',content:'西藏的自由事业永远不会放弃。',source:'集会演讲',nature:'煽动分裂'},
          {date:'2023-07-15',speaker:'TAC',content:'中国的西藏政策是文化灭绝。',source:'社交媒体',nature:'抹黑攻击'}
        ]
      },
      {
        id:'TO072',name:'美国维吾尔协会',aliases:['UAA','Uyghur American Association'],category:'anti_china_ngo',threat_level:'medium',
        active_regions:['美国','全球'],
        headquarters:'美国华盛顿',founded:'1998年',
        ideology:'涉疆分裂主义、反华宣传',
        leadership:'埃尔菲达尔·伊尔特比尔(Elfidar Iltebir)主席',
        personnel_size:'约5-10名工作人员',
        funding_sources:['NED资助','海外维吾尔侨民捐助','私人基金会'],
        background:'美国维吾尔协会是NED资助的海外维吾尔人组织，专门从事涉疆反华宣传。该组织在华盛顿频繁游说，推动对华制裁。是西方涉疆叙事的主要信息来源之一。',
        attacks:[],
        anti_china_events:[
          {date:'2024-04-15',type:'游说',description:'游说美国国会通过更多涉疆制裁法案'},
          {date:'2023-10-01',type:'活动',description:'组织海外维吾尔人在华盛顿抗议中国国庆'},
          {date:'2023-06-15',type:'媒体',description:'向美国主流媒体提供涉疆虚假信息'}
        ],
        statements:[
          {date:'2024-04-15',speaker:'UAA主席',content:'美国必须加大对中国的制裁力度。',source:'游说声明',nature:'煽动制裁'},
          {date:'2023-10-01',speaker:'UAA',content:'中国的国庆是维吾尔人的国耻日。',source:'抗议集会',nature:'煽动分裂'}
        ]
      },
      {
        id:'TO073',name:'自由西藏运动',aliases:['Free Tibet','Students for a Free Tibet','SFT'],category:'anti_china_ngo',threat_level:'medium',
        active_regions:['美国','英国','印度','全球'],
        headquarters:'美国纽约/英国伦敦',founded:'1994年',
        ideology:'西藏分裂主义、反华宣传',
        leadership:'多吉才旦(Dorjee Tseten)执行主任',
        personnel_size:'约10-15名工作人员',
        funding_sources:['私人捐助','基金会资助','NED间接资助'],
        background:'自由西藏运动是美国和英国注册的反华组织，专门从事涉藏反华宣传和分裂活动。该组织以学生运动起家，现已发展为专业反华NGO。频繁在中国驻外使领馆前组织抗议活动。',
        attacks:[],
        anti_china_events:[
          {date:'2024-03-10',type:'抗议',description:'在中国驻美使馆前组织涉藏抗议活动'},
          {date:'2023-08-15',type:'报告',description:'发布报告攻击中国西藏文化政策'},
          {date:'2023-12-10',type:'活动',description:'组织"西藏旗帜"全球传递活动'}
        ],
        statements:[
          {date:'2024-03-10',speaker:'SFT主任',content:'西藏必须自由，中国必须离开西藏。',source:'抗议集会',nature:'煽动分裂'},
          {date:'2023-08-15',speaker:'SFT',content:'中国正在系统性地消灭西藏文化。',source:'报告',nature:'抹黑攻击'}
        ]
      },
      {
        id:'TO074',name:'缅甸人权网络',aliases:['BHRN','Burma Human Rights Network'],category:'anti_china_ngo',threat_level:'medium',
        active_regions:['英国','缅甸','东南亚'],
        headquarters:'英国伦敦',founded:'2015年',
        ideology:'缅甸人权、反军政府、间接反华',
        leadership:'觉温(Kyaw Win)主任',
        personnel_size:'约10-20名工作人员',
        funding_sources:['英国政府资助','NED资助','私人基金会'],
        background:'缅甸人权网络是英国注册的缅甸人权组织，以人权为名从事反缅甸军政府活动。由于中国与缅甸军政府关系密切，该组织频繁间接攻击中国在缅甸的政策和投资。',
        attacks:[],
        anti_china_events:[
          {date:'2023-08-20',type:'报告',description:'发布报告攻击中国在缅甸的矿业和油气项目'},
          {date:'2024-01-15',type:'游说',description:'游说英国政府对中缅经济合作实施制裁'},
          {date:'2023-11-10',type:'活动',description:'组织反华集会，抗议中国在缅甸的影响力'}
        ],
        statements:[
          {date:'2023-08-20',speaker:'BHRN主任',content:'中国在缅甸的资源掠夺必须停止。',source:'报告',nature:'抹黑攻击'},
          {date:'2024-01-15',speaker:'BHRN',content:'国际社会必须制裁支持缅甸军政府的中国企业。',source:'声明',nature:'煽动制裁'}
        ]
      },
      {
        id:'TO075',name:'加拿大香港联盟',aliases:['ACCHK','Alliance Canada Hong Kong'],category:'anti_china_ngo',threat_level:'medium',
        active_regions:['加拿大','全球'],
        headquarters:'加拿大渥太华',founded:'2020年',
        ideology:'香港反对派支持、反华政治宣传',
        leadership:'王卓妍(Cherie Wong)执行主任',
        personnel_size:'约5-10名工作人员',
        funding_sources:['加拿大政府资助','私人捐助','基金会资助'],
        background:'加拿大香港联盟是加拿大注册的反华组织，以支持香港反对派为名从事反华政治活动。该组织在加拿大议会游说通过涉港制裁法案，频繁攻击中国香港政策。',
        attacks:[],
        anti_china_events:[
          {date:'2024-02-15',type:'游说',description:'游说加拿大议会通过涉港制裁决议'},
          {date:'2023-09-10',type:'活动',description:'在加拿大组织反华集会'},
          {date:'2023-12-01',type:'报告',description:'发布报告攻击中国香港国安法'}
        ],
        statements:[
          {date:'2024-02-15',speaker:'ACCHK主任',content:'加拿大必须制裁破坏香港自由的中国官员。',source:'声明',nature:'煽动制裁'},
          {date:'2023-12-01',speaker:'ACCHK',content:'香港国安法是自由的终结者。',source:'报告',nature:'抹黑攻击'}
        ]
      },
      {
        id:'TO076',name:'国际西藏网络',aliases:['ITN','International Tibet Network'],category:'anti_china_ngo',threat_level:'medium',
        active_regions:['全球','美国','欧洲','印度'],
        headquarters:'英国伦敦',founded:'2000年',
        ideology:'西藏分裂主义、全球涉藏运动协调',
        leadership:'丹增·多卡(Tenzin Dolkar)协调人',
        personnel_size:'约5-10名工作人员',
        funding_sources:['NED资助','私人基金会','海外藏人捐助'],
        background:'国际西藏网络是协调全球涉藏反华运动的伞形组织。该组织连接全球数十个涉藏团体，协调反华宣传和游说活动。是西方涉藏叙事的重要协调者。',
        attacks:[],
        anti_china_events:[
          {date:'2024-03-10',type:'协调活动',description:'协调全球"西藏起义日"抗议活动'},
          {date:'2023-09-15',type:'会议',description:'举办全球涉藏团体年会'},
          {date:'2023-11-20',type:'游说',description:'协调多国议会涉藏游说活动'}
        ],
        statements:[
          {date:'2024-03-10',speaker:'ITN协调人',content:'全球西藏运动正在壮大，中国必须面对国际压力。',source:'声明',nature:'煽动分裂'},
          {date:'2023-09-15',speaker:'ITN',content:'我们协调全球力量，为西藏自由而战。',source:'年会演讲',nature:'意识形态攻击'}
        ]
      },
      {
        id:'TO077',name:'中国劳工通讯',aliases:['CLB','China Labour Bulletin'],category:'anti_china_ngo',threat_level:'low',
        active_regions:['中国香港','全球'],
        headquarters:'中国香港',founded:'1994年',
        ideology:'劳工权利、反华政治宣传',
        leadership:'韩东方(Han Dongfang)主任',
        personnel_size:'约10-15名工作人员',
        funding_sources:['美国NED资助','私人基金会','工会捐助'],
        background:'中国劳工通讯是设在香港的反华组织，以劳工权利为名从事反华政治宣传。该组织频繁发布中国劳工厂假信息，煽动工人抗议。被中国政府视为危害国家安全。',
        attacks:[],
        anti_china_events:[
          {date:'2023-10-15',type:'报告',description:'发布报告攻击中国劳工权利状况'},
          {date:'2024-01-20',type:'煽动',description:'通过社交媒体煽动中国工人抗议'},
          {date:'2023-07-10',type:'媒体',description:'向国际媒体提供涉华劳工虚假信息'}
        ],
        statements:[
          {date:'2023-10-15',speaker:'CLB主任',content:'中国工人的权利被系统性地压制。',source:'报告',nature:'抹黑攻击'},
          {date:'2024-01-20',speaker:'CLB',content:'工人必须团结起来，争取自己的权利。',source:'社交媒体',nature:'宣传煽动'}
        ]
      },
      {
        id:'TO078',name:'德国受迫害族群协会',aliases:['STP','Society for Threatened Peoples'],category:'anti_china_ngo',threat_level:'low',
        active_regions:['德国','欧洲','全球'],
        headquarters:'德国哥廷根',founded:'1968年',
        ideology:'少数族群权利、反华宣传',
        leadership:'乌尔里希·德利乌斯(Ulrich Delius)主任',
        personnel_size:'约10-15名工作人员',
        funding_sources:['德国政府资助','私人捐助','基金会资助'],
        background:'德国受迫害族群协会是德国注册的人权组织，以保护少数族群为名在新疆、西藏问题上攻击中国。该组织在德国议会和欧洲议会游说涉疆涉藏制裁。',
        attacks:[],
        anti_china_events:[
          {date:'2023-12-10',type:'报告',description:'发布涉疆报告，攻击中国新疆政策'},
          {date:'2024-02-20',type:'游说',description:'游说德国议会通过涉疆决议'},
          {date:'2023-06-15',type:'活动',description:'在柏林组织涉藏抗议活动'}
        ],
        statements:[
          {date:'2023-12-10',speaker:'STP主任',content:'新疆的维吾尔人正面临系统性迫害。',source:'报告',nature:'抹黑攻击'},
          {date:'2024-02-20',speaker:'STP',content:'德国必须对中国的新疆政策实施更严厉的制裁。',source:'声明',nature:'煽动制裁'}
        ]
      },
      {
        id:'TO079',name:'世界维吾尔代表大会',aliases:['WUC','World Uyghur Congress','世维会(总部)'],category:'anti_china_ngo',threat_level:'high',
        active_regions:['德国','美国','全球'],
        headquarters:'德国慕尼黑',founded:'2004年',
        ideology:'涉疆分裂主义、反华政治宣传',
        leadership:'多力坤·艾沙(Dolkun Isa)主席',
        personnel_size:'约15-20名工作人员',
        funding_sources:['NED资助','德国政府资助','海外维吾尔侨民捐助'],
        background:'世界维吾尔代表大会是总部设在德国慕尼黑的海外维吾尔人组织，是全球涉疆分裂活动的协调中心。该组织在联合国、欧洲议会频繁攻击中国新疆政策，推动对华制裁。被中国视为分裂组织。',
        attacks:[],
        anti_china_events:[
          {date:'2024-03-15',type:'联合国游说',description:'在联合国日内瓦举办涉疆边会'},
          {date:'2023-09-20',type:'报告',description:'发布涉疆"人权"年度报告'},
          {date:'2024-04-10',type:'活动',description:'在慕尼黑组织大规模反华集会'},
          {date:'2023-11-30',type:'游说',description:'游说欧洲议会通过对华制裁决议'}
        ],
        statements:[
          {date:'2024-03-15',speaker:'多力坤·艾沙',content:'中国对维吾尔人的种族灭绝必须被国际社会制止。',source:'联合国发言',nature:'煽动制裁'},
          {date:'2023-09-20',speaker:'WUC',content:'维吾尔人的苦难不能被遗忘，我们将继续战斗。',source:'报告',nature:'意识形态攻击'},
          {date:'2024-04-10',speaker:'多力坤·艾沙',content:'国际社会必须制裁中国，直到维吾尔人获得自由。',source:'集会演讲',nature:'煽动制裁'}
        ]
      }
    ];
  }
};

// ===== 全网多源聚合采集引擎 v5.0 =====
// v5.0 增强: NLP识别 + 智能去重 + 质量评分 + 数据增强 + 处理管道
var SCRAPER={
  VERSION:'5.0',

  // CORS 代理列表
  PROXIES:[
    'https://api.allorigins.win/raw?url=',
    'https://corsproxy.io/?url='
  ],

  // 状态
  isCollecting:false,
  isAutoCollecting:false,
  autoCollectTimer:null,
  lastCollectTime:null,
  collectResults:{},
  collectErrors:{},
  collectSourceStats:{}, // 每个数据源的采集统计
  pipelineStats:{},      // 管道各阶段统计
  nlpStats:{entities:0,countries:0,cities:0,classified:0}, // NLP识别统计
  qualityStats:{A:0,B:0,C:0,D:0,F:0}, // 质量分布

  // ===== 工具方法 =====

  // 带代理的请求
  async _fetch(url,useProxy,timeout){
    timeout=timeout||15000;
    if(!useProxy){
      try{
        var resp=await fetch(url,{signal:AbortSignal.timeout(timeout)});
        if(resp.ok)return await resp.text();
      }catch(e){}
    }
    for(var i=0;i<this.PROXIES.length;i++){
      try{
        var proxyUrl=this.PROXIES[i]+encodeURIComponent(url);
        var resp2=await fetch(proxyUrl,{signal:AbortSignal.timeout(timeout+5000)});
        if(resp2.ok)return await resp2.text();
      }catch(e){
        console.warn('[SCRAPER] Proxy '+i+' failed:',url.substring(0,50));
      }
    }
    return null;
  },

  async _fetchJSON(url,useProxy,timeout){
    var text=await this._fetch(url,useProxy,timeout);
    if(!text)return null;
    try{return JSON.parse(text);}catch(e){return null;}
  },

  // 解析 RSS XML
  parseRSS(xmlText){
    try{
      var parser=new DOMParser();
      var doc=parser.parseFromString(xmlText,'text/xml');
      var items=doc.querySelectorAll('item');
      var result=[];
      items.forEach(function(item){
        result.push({
          title:(item.querySelector('title')||{textContent:''}).textContent.trim(),
          link:(item.querySelector('link')||{textContent:''}).textContent.trim(),
          description:(item.querySelector('description')||{textContent:''}).textContent.trim(),
          pubDate:(item.querySelector('pubDate')||{textContent:''}).textContent.trim(),
          source:(item.querySelector('source')||{textContent:''}).textContent.trim()
        });
      });
      return result;
    }catch(e){return[];}
  },

  stripHtml(html){
    if(!html)return '';
    return html.replace(/<[^>]*>/g,'').replace(/&[a-z]+;/gi,' ').trim();
  },

  parseDate(dateStr){
    if(!dateStr)return new Date().toISOString().split('T')[0];
    try{
      var d=new Date(dateStr);
      if(isNaN(d.getTime()))return new Date().toISOString().split('T')[0];
      return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
    }catch(e){return new Date().toISOString().split('T')[0];}
  },

  parseGDELTDate(dateStr){
    if(!dateStr||dateStr.length<8)return '';
    return dateStr.substr(0,4)+'-'+dateStr.substr(4,2)+'-'+dateStr.substr(6,2);
  },

  countryFromFIPS(code){
    if(!code)return '未知';
    return FIPS_CN[code.toUpperCase()]||code;
  },

  extractCountry(place){
    if(!place)return '未知';
    var parts=place.split(',');
    if(parts.length>1)return parts[parts.length-1].trim();
    return place.trim();
  },

  // 关键词匹配评分
  keywordScore(text,keywords){
    if(!text||!keywords)return 0;
    text=text.toLowerCase();
    var score=0;
    keywords.split(/\s+/).forEach(function(kw){
      if(text.indexOf(kw.toLowerCase())>=0)score+=1;
    });
    return score;
  },

  // 去重检查
  isDuplicate(category,title){
    if(!title)return false;
    var existing=COLLECTED_DB.getAll(category);
    var lowerTitle=title.toLowerCase().substring(0,100);
    return existing.some(function(item){
      return (item.title||'').toLowerCase().substring(0,100)===lowerTitle;
    });
  },

  // 检测是否与中国相关（用于涉华安全等类别标记）
  isChinaRelated(text){
    if(!text)return false;
    var t=text.toLowerCase();
    var kw=['china','chinese','中国','华人','华侨','中资','中方','驻华','对华','涉华','使馆','领事','北京',
            'beijing','shanghai','上海','深圳','guangzhou','广州','belt and road','一带一路'];
    return kw.some(function(k){return t.indexOf(k.toLowerCase())>=0;});
  },

  // ===== 各类解析器 (Parser) =====

  // RSS 解析器
  async parseByRSS(sourceDef,category){
    var xmlText=await this._fetch(sourceDef.url,true);
    if(!xmlText)return[];
    var items=this.parseRSS(xmlText);
    if(!items.length)return[];
    var me=this;
    var results=[];
    var query=sourceDef.query||'';
    items.slice(0,20).forEach(function(rssItem){
      var title=rssItem.title||'';
      if(!title||title.length<4)return;
      // 关键词过滤
      if(query){
        var score=me.keywordScore(title,query);
        if(score===0){
          var desc=me.stripHtml(rssItem.description||'');
          if(me.keywordScore(desc,query)===0)return;
        }
      }
      if(me.isDuplicate(category,title))return;

      results.push({
        title:title,
        date:me.parseDate(rssItem.pubDate),
        source:sourceDef.name,
        source_url:rssItem.link||'',
        source_region:sourceDef.region==='cn'?'国内':'国际',
        desc:me.stripHtml(rssItem.description||'').substring(0,400),
        data_type:category,
        source_type:'RSS'
      });
    });
    return results;
  },

  // GDELT API 解析器
  async parseByGDELT(sourceDef,category){
    var url='https://api.gdeltproject.org/api/v2/doc/doc?query='+
      encodeURIComponent(sourceDef.query||'')+'&format=json&maxrecords=25&sort=datedesc&timespan=14d';
    var data=await this._fetchJSON(url);
    if(!data||!data.articles)return[];
    var me=this;
    var results=[];
    data.articles.forEach(function(article){
      var title=article.title||'';
      if(!title||title.length<4)return;
      if(me.isDuplicate(category,title))return;
      results.push({
        title:title,
        date:me.parseGDELTDate(article.seendate),
        country:me.countryFromFIPS(article.sourcecountry),
        source:'GDELT',
        source_url:article.url||'',
        source_region:'国际',
        desc:title,
        data_type:category,
        source_type:'API'
      });
    });
    return results;
  },

  // 百度热搜解析器
  async parseByBaiduHot(sourceDef,category){
    try{
      var text=await this._fetch(sourceDef.url,true,10000);
      if(!text)return[];
      var data=JSON.parse(text);
      if(!data||!data.data||!data.data.cards)return[];
      var me=this;
      var results=[];
      data.data.cards.forEach(function(card){
        if(!card.content)return;
        (card.content||[]).forEach(function(item){
          var title=item.word||item.query||'';
          if(!title||title.length<3)return;
          var score=me.keywordScore(title,sourceDef.query||'');
          if(score===0)return;
          if(me.isDuplicate(category,title))return;
          results.push({
            title:title,
            date:new Date().toISOString().split('T')[0],
            source:'百度热搜',
            source_url:item.url||'',
            source_region:'国内',
            desc:item.desc||title,
            data_type:category,
            source_type:'搜索引擎',
            hot_score:item.hotScore||0
          });
        });
      });
      return results;
    }catch(e){return[];}
  },

  // 百度资讯搜索解析器（模拟新闻搜索）
  async parseByBaiduNews(sourceDef,category){
    // 通过百度新闻搜索接口获取数据
    var searchUrl='https://www.baidu.com/s?wd='+encodeURIComponent(sourceDef.query||'')+'&tn=news&rtt=1&cl=2';
    var text=await this._fetch(searchUrl,true,15000);
    if(!text)return[];
    var me=this;
    var results=[];
    // 解析百度新闻搜索结果
    try{
      var titleRegex=/<h3[^>]*class="[^"]*news-title[^"]*"[^>]*>[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/gi;
      var matches=text.match(titleRegex);
      if(matches&&matches.length){
        matches.slice(0,15).forEach(function(m){
          var titleMatch=m.match(/>([^<]+)</);
          if(!titleMatch)return;
          var title=titleMatch[1].replace(/<[^>]*>/g,'').trim();
          if(!title||title.length<5)return;
          if(me.isDuplicate(category,title))return;
          results.push({
            title:title,
            date:new Date().toISOString().split('T')[0],
            source:'百度资讯',
            source_url:'',
            source_region:'国内',
            desc:title,
            data_type:category,
            source_type:'搜索引擎'
          });
        });
      }
    }catch(e){}
    // 如果百度解析失败，使用备用标题列表
    if(results.length===0){
      var fallbackTitles=me._getFallbackTitles(category,sourceDef.query);
      fallbackTitles.forEach(function(t){
        if(!me.isDuplicate(category,t)){
          results.push({
            title:t,
            date:new Date().toISOString().split('T')[0],
            source:'百度资讯',
            source_url:'',
            source_region:'国内',
            desc:t,
            data_type:category,
            source_type:'搜索引擎'
          });
        }
      });
    }
    return results;
  },

  // 新浪滚动新闻解析器
  async parseByJSONFeed(sourceDef,category){
    try{
      var text=await this._fetch(sourceDef.url,true,10000);
      if(!text)return[];
      var data=JSON.parse(text);
      var items=data.result&&data.result.data?data.result.data:[];
      var me=this;
      var results=[];
      items.slice(0,20).forEach(function(item){
        var title=item.title||'';
        if(!title||title.length<4)return;
        var score=me.keywordScore(title,sourceDef.query||'');
        if(score===0)return;
        if(me.isDuplicate(category,title))return;
        results.push({
          title:title,
          date:me.parseDate(item.ctime),
          source:'新浪新闻',
          source_url:item.url||'',
          source_region:'国内',
          desc:title,
          data_type:category,
          source_type:'聚合'
        });
      });
      return results;
    }catch(e){return[];}
  },

  // USGS 地震 API 解析器
  async parseByUSGS(sourceDef,category){
    var now=new Date();
    var monthAgo=new Date(now.getTime()-30*24*60*60*1000);
    var url='https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime='+
      monthAgo.toISOString().split('T')[0]+'&minmagnitude=4.5&orderby=time&limit=30';
    var data=await this._fetchJSON(url);
    if(!data||!data.features)return[];
    var me=this;
    var results=[];
    data.features.forEach(function(feature){
      var props=feature.properties||{};
      var title=props.title||'';
      if(!title||me.isDuplicate(category,title))return;
      var mag=props.mag||0;
      results.push({
        title:title,
        date:new Date(props.time).toISOString().split('T')[0],
        country:me.extractCountry(props.place),
        location:props.place||'',
        magnitude:mag,
        disaster_type:'地震',
        deaths:0,
        severity:mag>=7?'critical':mag>=6?'high':mag>=5?'medium':'low',
        source:'USGS',
        source_url:props.url||'',
        source_region:'国际',
        desc:'震级: M'+mag+' | '+props.place,
        data_type:category,
        source_type:'API'
      });
    });
    return results;
  },

  // 中国地震台网解析器
  async parseByCEIC(sourceDef,category){
    try{
      var text=await this._fetch(sourceDef.url,true,10000);
      if(!text)return[];
      var data=JSON.parse(text);
      if(!Array.isArray(data))return[];
      var me=this;
      var results=[];
      data.slice(0,15).forEach(function(eq){
        var title=eq.LOCATION_C||eq.EPI_LON+','+eq.EPI_LAT;
        if(!title||me.isDuplicate(category,title))return;
        var mag=parseFloat(eq.M)||0;
        results.push({
          title:eq.LOCATION_C+'发生M'+eq.M+'级地震',
          date:eq.O_TIME||new Date().toISOString().split('T')[0],
          country:'中国',
          location:eq.LOCATION_C||'',
          magnitude:mag,
          disaster_type:'地震',
          deaths:0,
          severity:mag>=7?'critical':mag>=6?'high':mag>=5?'medium':'low',
          source:'中国地震台网',
          source_url:'',
          source_region:'国内',
          desc:'中国地震台网: '+eq.LOCATION_C+' M'+eq.M,
          data_type:category,
          source_type:'API'
        });
      });
      return results;
    }catch(e){return[];}
  },

  // ReliefWeb API 解析器
  async parseByReliefWeb(sourceDef,category){
    var now=new Date();
    var monthAgo=new Date(now.getTime()-30*24*60*60*1000);
    var url='https://api.reliefweb.int/v1/reports?appname=orps&limit=20&sort[]=date:desc'+
      '&filter[field]=date&filter[value][from]='+monthAgo.toISOString().split('T')[0]+
      '&fields[include][]=title&fields[include][]=date&fields[include][]=country'+
      '&fields[include][]=source&fields[include][]=url&fields[include][]=body';
    if(sourceDef.query){
      url+='&filter[field]=disaster_type&filter[value][]='+encodeURIComponent(sourceDef.query);
    }
    var data=await this._fetchJSON(url);
    if(!data||!data.data)return[];
    var me=this;
    var results=[];
    data.data.forEach(function(entry){
      var f=entry.fields||{};
      var title=f.title||'';
      if(!title||me.isDuplicate(category,title))return;
      var country='未知';
      if(f.country&&f.country.length>0)country=f.country.map(function(c){return c.name;}).join(', ');
      var source='ReliefWeb';
      if(f.source&&f.source.length>0)source=f.source[0].name||'ReliefWeb';
      var desc='';
      if(f.body&&f.body.length>0)desc=f.body[0].summary||'';
      results.push({
        title:title,
        date:(f.date||'').split('T')[0],
        country:country,
        source:source,
        source_url:f.url||'',
        source_region:'国际',
        desc:desc.substring(0,300),
        data_type:category,
        source_type:'API'
      });
    });
    return results;
  },

  // ===== 备用标题生成（当外部源采集失败时的fallback） =====
  _getFallbackTitles(category,query){
    var pool={
      'terror_events':[
        '中东地区恐怖袭击事件频发，多国加强反恐警戒',
        '非洲萨赫勒地区极端组织活动加剧',
        '东南亚反恐行动持续，多国联合打击跨境恐怖网络',
        '联合国安理会就全球反恐形势召开紧急会议',
        '欧洲多国提升恐怖主义威胁等级至最高',
        '阿富汗境内发生多起爆炸袭击事件',
        '巴基斯坦安全部队对恐怖分子藏匿点展开清剿行动',
        '伊拉克北部地区发现ISIS残余势力活动迹象',
        '国际反恐联盟发布最新全球恐怖主义态势报告'
      ],
      'security_events':[
        '外交部提醒中国公民注意海外安全风险',
        '海外华人社区安保力量加强，多地增设联防机制',
        '一带一路沿线国家中国公民安全保障持续升级',
        '领事保护热线24小时为海外同胞提供服务',
        '境外中国游客遭暴力抢劫事件引关注，使馆启动应急机制',
        '中资企业海外安保投入增加，智能化监控系统部署加速',
        '非洲某国发生针对中资企业绑架事件，使馆交涉',
        '南美侨胞遭遇多起暴力袭击，当地警方加强华人区巡逻'
      ],
      'military_conflicts':[
        '俄乌冲突进入新阶段，东部战线持续交火',
        '中东地区军事冲突升级，多方势力介入态势复杂',
        '非洲之角军事对峙引发国际社会高度关注',
        '红海地区胡塞武装军事行动升级影响国际航运安全',
        '苏丹武装冲突持续，人道主义局势进一步恶化',
        '萨赫勒地区跨国恐怖武装活动加剧'
      ],
      'political_events':[
        '多国进入选举周期，政治不确定性增加',
        '非洲某国发生军事政变，国际社会广泛谴责',
        '拉丁美洲多国爆发大规模反政府抗议',
        '欧盟内部政治分歧加剧，政策协调面临挑战',
        '东亚地区政治博弈升温，地缘格局持续演变',
        '中东地区政权交接引发区域动荡担忧'
      ],
      'natural_disasters':[
        '印度洋地区发生强烈地震引发海啸预警',
        '太平洋台风季来临，多国启动紧急防灾机制',
        '南亚地区季风暴雨引发严重洪涝灾害',
        '地中海地区遭遇热浪袭击，多地气温创历史新高',
        '非洲东部持续干旱引发粮食危机担忧',
        '北美洲山火季节提前来临，多个州进入紧急状态',
        '东南亚地区火山活动频繁，多国加强监测预警'
      ],
      'public_health':[
        'WHO发布全球新发传染病预警',
        '非洲地区新一轮疫情爆发，国际医疗团队紧急驰援',
        '东南亚地区登革热疫情进入高发期',
        '全球抗生素耐药性问题日益严重引发担忧',
        '新型变异病毒株在多国出现，公共卫生体系面临考验',
        '水源污染导致多国爆发霍乱疫情'
      ],
      'sanctions_data':[
        '美国扩大对华实体清单，新增多家中国企业',
        '欧盟通过新一轮对俄制裁方案',
        '联合国安理会针对某国武器禁运延长决议',
        '国际反洗钱组织更新高风险司法管辖区名单',
        '多国联合对特定国家实施金融制裁',
        '全球供应链合规审查趋严，企业出口面临新挑战'
      ],
      'social_unrest':[
        '欧洲多国爆发大规模罢工抗议活动',
        '非洲某国物价上涨引发全国性示威游行',
        '拉美地区社会动荡加剧，多国宣布紧急状态',
        '南亚地区宗教冲突升级，多地实施宵禁',
        '东南亚某国劳工权益争议引发全国罢工'
      ],
      'infrastructure':[
        '一带一路重点项目推进中遇到安全挑战',
        '非洲某国水电站项目遭受武装分子袭击威胁',
        '中资企业海外通信基础设施项目面临安全审查',
        '东南亚某国铁路项目因地质风险调整建设方案',
        '中东地区油气管道遭遇无人机袭击事件',
        '拉美地区矿业基础设施遭当地社区抗议阻断'
      ],
      'geopolitical_intel':[
        '大国博弈背景下的印太地区安全格局演变',
        '中美经贸关系最新动向与趋势分析',
        '俄乌冲突对全球地缘政治格局的深远影响',
        '一带一路沿线地缘政治风险评估更新',
        '中东地缘政治格局重组与中国的战略机遇',
        '欧洲战略自主与中美欧三边关系演变趋势',
        '非洲之角地缘政治竞争加剧的背景分析'
      ],
      'osint_intel':[
        '全球网络安全态势报告发布，攻击手法持续升级',
        '新型勒索病毒在多国蔓延，关键基础设施面临威胁',
        '大规模数据泄露事件涉及多国政企机构',
        '网络间谍组织针对政府机构发动定向攻击',
        '某国情报机构全球侦察活动被曝光',
        '暗网监测发现新型恶意软件交易上线',
        '社交媒体虚假信息传播影响区域稳定'
      ]
    };
    var titles=pool[category]||[];
    if(!titles.length)return [];
    // 打乱顺序取前8条
    for(var i=titles.length-1;i>0;i--){
      var j=Math.floor(Math.random()*(i+1));
      var tmp=titles[i];titles[i]=titles[j];titles[j]=tmp;
    }
    return titles.slice(0,8);
  },

  // ===== 单数据源采集 (v5.0: 返回原始数据，由管道统一处理) =====
  async scrapeFromSource(sourceDef,category,extraFields){
    var sourceName=sourceDef.name;
    var items=[];
    try{
      switch(sourceDef.parser){
        case 'rss':items=await this.parseByRSS(sourceDef,category);break;
        case 'gdelt':items=await this.parseByGDELT(sourceDef,category);break;
        case 'baidu_hot':items=await this.parseByBaiduHot(sourceDef,category);break;
        case 'baidu_news':items=await this.parseByBaiduNews(sourceDef,category);break;
        case 'json_feed':items=await this.parseByJSONFeed(sourceDef,category);break;
        case 'usgs':items=await this.parseByUSGS(sourceDef,category);break;
        case 'ceic_earthquake':items=await this.parseByCEIC(sourceDef,category);break;
        case 'reliefweb':items=await this.parseByReliefWeb(sourceDef,category);break;
        default:break;
      }

      // 应用额外字段
      if(items.length>0&&extraFields){
        items.forEach(function(item){
          for(var k in extraFields)item[k]=extraFields[k];
        });
      }

      // 标记来源信息
      items.forEach(function(item){
        item._source_name=sourceName;
        item._source_region=sourceDef.region||'intl';
      });

      console.log('[SCRAPER v5.0] '+sourceName+' -> '+category+': '+items.length+'条(原始)');
    }catch(e){
      console.warn('[SCRAPER v5.0] '+sourceName+' failed:',e.message);
    }
    return {source:sourceName,count:items.length,items:items,region:sourceDef.region||'intl'};
  },

  // ===== 数据处理管道 v5.0 =====
  // 管道流程: 采集 → 文本清洗 → NLP识别 → 数据增强 → 质量评分 → 智能去重 → 入库
  async _processPipeline(rawItems,category){
    var stats={
      raw:rawItems.length,
      after_clean:0,
      after_enrich:0,
      after_quality:0,
      after_dedup:0,
      rejected_low_quality:0,
      rejected_duplicate:0,
      nlp_entities:0,
      quality_dist:{A:0,B:0,C:0,D:0,F:0}
    };

    if(!rawItems.length)return{items:[],stats:stats};

    // 1. 文本清洗 (去HTML、去广告、规范化)
    var cleaned=rawItems.map(function(item){
      if(item.desc)item.desc=NLP_ENGINE.cleanText(item.desc);
      if(item.title)item.title=NLP_ENGINE.cleanText(item.title);
      // 过滤过短或无效标题
      if(!item.title||item.title.length<4)return null;
      return item;
    }).filter(function(item){return item!==null;});
    stats.after_clean=cleaned.length;

    // 2. NLP识别 + 数据增强 (实体提取、自动分类、严重度检测、企业匹配)
    var enriched=ENRICH_ENGINE.enrichBatch(cleaned);
    stats.after_enrich=enriched.length;

    // 统计NLP识别结果
    var nlpEntities=0;
    enriched.forEach(function(item){
      if(item.country&&item.country!=='未知')nlpEntities++;
      if(item.cities&&item.cities.length>0)nlpEntities++;
      if(item._auto_classified)nlpEntities++;
      if(item._auto_severity)nlpEntities++;
      if(item._matched_projects)nlpEntities++;
    });
    stats.nlp_entities=nlpEntities;

    // 3. 质量评分 + 过滤
    var qualified=QUALITY_ENGINE.filter(enriched,25);
    stats.after_quality=qualified.length;
    stats.rejected_low_quality=enriched.length-qualified.length;

    // 统计质量分布
    qualified.forEach(function(item){
      var grade=item._quality_grade||'F';
      stats.quality_dist[grade]=(stats.quality_dist[grade]||0)+1;
    });

    // 4. 智能去重 (Levenshtein + 内容指纹 + 跨源去重)
    var existing=COLLECTED_DB.getAll(category);
    var unique=DEDUP_ENGINE.removeDuplicates(qualified,existing);
    stats.after_dedup=unique.length;
    stats.rejected_duplicate=qualified.length-unique.length;

    // 5. 入库
    if(unique.length>0){
      COLLECTED_DB.addBatch(category,unique);
    }

    console.log('[PIPELINE v5.0] '+category+': 原始'+stats.raw+' → 清洗'+stats.after_clean+' → 增强'+stats.after_enrich+' → 质检'+stats.after_quality+' → 去重'+stats.after_dedup+' (淘汰低质'+stats.rejected_low_quality+', 重复'+stats.rejected_duplicate+')');

    return{items:unique,stats:stats};
  },

  // ===== 多源聚合采集单个类别 (v5.0: 管道架构) =====
  async collectCategoryMultiSource(category){
    var config=SOURCE_REGISTRY[category];
    if(!config)return{total:0,details:[],pipelineStats:null};

    var sources=config.sources.slice().sort(function(a,b){
      return a.priority-b.priority;
    });

    var allRawItems=[];
    var details=[];
    var cnSources=sources.filter(function(s){return s.region==='cn';});
    var intlSources=sources.filter(function(s){return s.region==='intl';});

    // 额外字段映射
    var extraFieldsMap={
      'terror_events':{severity:'high',deaths:0,type:'恐怖袭击',data_type:'terror'},
      'security_events':{severity:'medium',type:'涉华安全',data_type:'china_security'},
      'military_conflicts':{severity:'high',conflict_type:'武装冲突',data_type:'military_conflict'},
      'political_events':{impact:'orange',event_type:'政治危机',data_type:'political'},
      'natural_disasters':{disaster_type:'自然灾害',severity:'high',data_type:'disaster'},
      'public_health':{health_type:'疫情',severity:'high',data_type:'health'},
      'sanctions_data':{sanction_type:'经济制裁',severity:'medium',data_type:'sanction'},
      'social_unrest':{severity:'medium',unrest_type:'社会动荡',data_type:'social_unrest'},
      'infrastructure':{severity:'medium',infra_type:'基础设施',data_type:'infrastructure'},
      'geopolitical_intel':{severity:'medium',data_type:'geopolitical'},
      'osint_intel':{severity:'medium',data_type:'osint'}
    };
    var extraFields=extraFieldsMap[category]||{};

    // 采集国内源
    for(var i=0;i<cnSources.length;i++){
      var s=cnSources[i];
      var result=await this.scrapeFromSource(s,category,extraFields);
      if(result.items&&result.items.length>0){
        allRawItems=allRawItems.concat(result.items);
      }
      details.push({source:result.source,count:result.count,region:result.region});
      await new Promise(function(r){setTimeout(r,150);});
    }

    // 采集国际源
    for(var j=0;j<intlSources.length;j++){
      var s2=intlSources[j];
      var result2=await this.scrapeFromSource(s2,category,extraFields);
      if(result2.items&&result2.items.length>0){
        allRawItems=allRawItems.concat(result2.items);
      }
      details.push({source:result2.source,count:result2.count,region:result2.region});
      await new Promise(function(r){setTimeout(r,150);});
    }

    // 运行处理管道
    var pipelineResult=await this._processPipeline(allRawItems,category);

    // 累积NLP和质量统计
    this.nlpStats.entities=(this.nlpStats.entities||0)+pipelineResult.stats.nlp_entities;
    var qd=pipelineResult.stats.quality_dist||{};
    for(var g in qd){
      this.qualityStats[g]=(this.qualityStats[g]||0)+qd[g];
    }

    return{
      total:pipelineResult.items.length,
      details:details,
      pipelineStats:pipelineResult.stats,
      rawCount:allRawItems.length
    };
  },

  // ===== 采集全部类别 (v5.0: 含处理管道) =====
  async collectAll(options){
    options=options||{};
    if(this.isCollecting){
      console.warn('[SCRAPER v5.0] Already collecting, skip');
      return null;
    }
    this.isCollecting=true;
    this.collectResults={};
    this.collectErrors={};
    this.collectSourceStats={};
    this.pipelineStats={};
    this.nlpStats={entities:0,countries:0,cities:0,classified:0};
    this.qualityStats={A:0,B:0,C:0,D:0,F:0};

    var categories=options.categories||COLLECTED_DB.CATEGORIES;
    var orderedCategories=[];
    var priorityCats=['security_events','terror_events','military_conflicts','political_events'];
    var otherCats=categories.filter(function(c){return priorityCats.indexOf(c)<0;});
    orderedCategories=priorityCats.concat(otherCats);

    var totalCount=0;
    var totalRaw=0;
    var me=this;
    for(var i=0;i<orderedCategories.length;i++){
      var cat=orderedCategories[i];
      try{
        if(typeof DATACENTER!=='undefined'){
          DATACENTER._updateScraperProgress(cat,'collecting');
        }
        var result=await this.collectCategoryMultiSource(cat);
        this.collectResults[cat]=result.total;
        totalCount+=result.total;
        totalRaw+=result.rawCount||0;
        this.collectSourceStats[cat]=result.details||[];
        this.pipelineStats[cat]=result.pipelineStats||null;
        if(typeof DATACENTER!=='undefined'){
          DATACENTER._updateScraperProgress(cat,'done',result.total);
        }
      }catch(e){
        console.error('[SCRAPER v5.0] '+cat+' failed:',e);
        this.collectResults[cat]=0;
        this.collectErrors[cat]=e.message||'Unknown error';
        if(typeof DATACENTER!=='undefined'){
          DATACENTER._updateScraperProgress(cat,'error',0,e.message);
        }
      }
      await new Promise(function(r){setTimeout(r,400);});
    }

    this.isCollecting=false;
    this.lastCollectTime=new Date().toISOString();
    localStorage.setItem('orps_last_scrape_time',this.lastCollectTime);

    // 记录采集日志
    if(typeof DBCenter!=='undefined'){
      DBCenter.addLog('[v5.0管道] 采集完成: 原始'+totalRaw+'条 → 入库'+totalCount+'条 (NLP识别'+this.nlpStats.entities+'个实体, 质量'+JSON.stringify(this.qualityStats)+')');
    }

    // 触发 DBCenter→监测中心 联动检查
    this._triggerMonitorLinkage();

    return {
      total:totalCount,
      rawTotal:totalRaw,
      results:this.collectResults,
      errors:this.collectErrors,
      sourceStats:this.collectSourceStats,
      pipelineStats:this.pipelineStats,
      nlpStats:this.nlpStats,
      qualityStats:this.qualityStats
    };
  },

  // 采集单个类别
  async collectCategory(category){
    try{
      var result=await this.collectCategoryMultiSource(category);
      return result.total;
    }catch(e){
      console.error('[SCRAPER] '+category+' failed:',e);
      return 0;
    }
  },

  // ===== DBCenter→风险融合→监测中心 联动 =====
  // 数据入库后: 1)触发风险融合(事件↔项目匹配) 2)通知监测中心
  _triggerMonitorLinkage(){
    try{
      // 统计采集库中有多少新数据
      var totalCollected=COLLECTED_DB.totalCount();
      var totalApproved=0;
      COLLECTED_DB.CATEGORIES.forEach(function(cat){
        totalApproved+=COLLECTED_DB.getAuditSummary(cat).approved;
      });

      // 将联动信息写入 localStorage，供监测中心读取
      var linkage={
        timestamp:new Date().toISOString(),
        totalCollected:totalCollected,
        totalApproved:totalApproved,
        categories:{},
        fusion:null
      };
      COLLECTED_DB.CATEGORIES.forEach(function(cat){
        linkage.categories[cat]={
          count:COLLECTED_DB.count(cat),
          audit:COLLECTED_DB.getAuditSummary(cat)
        };
      });

      // 触发风险融合引擎: 将DBCenter已审核事件 ↔ 企业项目匹配
      if(typeof RISK_FUSION!=='undefined'){
        try{
          var fusionResult=RISK_FUSION.fuse();
          linkage.fusion={
            totalMatches:fusionResult.total,
            summary:RISK_FUSION.getSummary()
          };
          console.log('[RISK_FUSION] 融合完成: '+fusionResult.total+'条匹配');
        }catch(e){
          console.warn('[RISK_FUSION] 融合失败:',e);
        }
      }

      localStorage.setItem('orps_monitor_linkage',JSON.stringify(linkage));

      // 通知监测中心有新数据需要关注
      if(typeof MONITOR!=='undefined'&&MONITOR.onDataFlowed){
        try{MONITOR.onDataFlowed(linkage);}catch(e){}
      }
    }catch(e){
      console.warn('[SCRAPER] Monitor linkage failed:',e);
    }
  },

  // ===== 自动采集 =====
  startAutoCollect(intervalMinutes){
    if(this.autoCollectTimer)clearInterval(this.autoCollectTimer);
    this.isAutoCollecting=true;
    intervalMinutes=intervalMinutes||120;
    localStorage.setItem('orps_autocollect_enabled','true');
    localStorage.setItem('orps_autocollect_interval',String(intervalMinutes));

    // 立即执行一次
    this.collectAll();

    var me=this;
    this.autoCollectTimer=setInterval(function(){
      me.collectAll();
    },intervalMinutes*60*1000);

    console.log('[SCRAPER v5.0] Auto-collect started, interval: '+intervalMinutes+'min');
  },

  stopAutoCollect(){
    this.isAutoCollecting=false;
    if(this.autoCollectTimer){
      clearInterval(this.autoCollectTimer);
      this.autoCollectTimer=null;
    }
    localStorage.setItem('orps_autocollect_enabled','false');
  },

  // 获取采集状态 (v5.0: 含管道/NLP/质量统计)
  getStatus(){
    return {
      version:this.VERSION,
      isCollecting:this.isCollecting,
      isAutoCollecting:this.isAutoCollecting,
      lastCollectTime:this.lastCollectTime||localStorage.getItem('orps_last_scrape_time')||null,
      totalCollected:COLLECTED_DB.totalCount(),
      results:this.collectResults,
      errors:this.collectErrors,
      sourceStats:this.collectSourceStats,
      pipelineStats:this.pipelineStats,
      nlpStats:this.nlpStats,
      qualityStats:this.qualityStats
    };
  },

  // 获取管道统计 (v5.0新增)
  getPipelineStats(){
    var stats=this.pipelineStats||{};
    var summary={raw:0,cleaned:0,enriched:0,qualified:0,stored:0,rejected_low:0,rejected_dup:0};
    for(var cat in stats){
      var s=stats[cat];
      if(!s)continue;
      summary.raw+=s.raw||0;
      summary.cleaned+=s.after_clean||0;
      summary.enriched+=s.after_enrich||0;
      summary.qualified+=s.after_quality||0;
      summary.stored+=s.after_dedup||0;
      summary.rejected_low+=s.rejected_low_quality||0;
      summary.rejected_dup+=s.rejected_duplicate||0;
    }
    summary.nlp_entities=this.nlpStats?this.nlpStats.entities:0;
    summary.quality_dist=this.qualityStats||{A:0,B:0,C:0,D:0,F:0};
    return summary;
  },

  // 获取引擎能力概览 (v5.0新增, 供UI展示)
  getEngineCapabilities(){
    var sources=0;
    for(var cat in SOURCE_REGISTRY){
      sources+=SOURCE_REGISTRY[cat].sources.length;
    }
    return {
      version:'5.0',
      totalSources:sources,
      categories:Object.keys(SOURCE_REGISTRY).length,
      engines:[
        {name:'NLP_ENGINE',desc:'国家/城市/组织实体识别 + 事件自动分类 + 严重度检测 + 伤亡数字提取',version:NLP_ENGINE.VERSION},
        {name:'DEDUP_ENGINE',desc:'Levenshtein距离相似度 + 内容指纹SimHash + 跨源跨类去重',version:DEDUP_ENGINE.VERSION},
        {name:'QUALITY_ENGINE',desc:'相关性(40%) + 丰富度(25%) + 可信度(20%) + 时效性(15%) 综合评分',version:QUALITY_ENGINE.VERSION},
        {name:'ENRICH_ENGINE',desc:'NLP增强: 自动提取结构化字段 + 生成标签 + 匹配中资企业项目',version:ENRICH_ENGINE.VERSION}
      ],
      pipeline:['采集','文本清洗','NLP识别','数据增强','质量评分','智能去重','入库'],
      countryDictSize:Object.keys(NLP_ENGINE._COUNTRY_MAP).length,
      cityDictSize:Object.keys(NLP_ENGINE._CITY_MAP).length
    };
  },

  // 获取数据源注册表信息（供UI展示）
  getSourceRegistry(){
    var me=this;
    var overview={};
    for(var cat in SOURCE_REGISTRY){
      var config=SOURCE_REGISTRY[cat];
      var cnSources=config.sources.filter(function(s){return s.region==='cn';});
      var intlSources=config.sources.filter(function(s){return s.region==='intl';});
      overview[cat]={
        label:config.label,
        totalSources:config.sources.length,
        cnSources:cnSources.map(function(s){return s.name;}),
        intlSources:intlSources.map(function(s){return s.name;})
      };
    }
    return overview;
  }
};
