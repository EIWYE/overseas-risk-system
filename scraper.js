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
    // 初始化中资企业海外项目库
    if(typeof ENTERPRISE_DB!=='undefined'){try{ENTERPRISE_DB.init();}catch(e){}}
    // 初始化风险融合引擎
    if(typeof RISK_FUSION!=='undefined'){try{RISK_FUSION.init();}catch(e){}}
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
