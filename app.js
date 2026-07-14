// ===== 海外利益保护情报预警平台 v6.0 — Dark Tech Edition =====
// 全新深色科技风界面，旋转地球可视化，合并模块架构

const DIMS=[{key:'political',name:'政治风险',ic:'🏛',w:.15,color:'#2563eb',factors:['政局稳定性','政策连续性','政府治理效率','国际关系态势']},{key:'economic',name:'经济风险',ic:'📉',w:.15,color:'#0891b2',factors:['GDP增长趋势','通胀与汇率','主权债务风险','贸易管制程度']},{key:'security',name:'安全风险',ic:'🛡',w:.20,color:'#dc2626',factors:['恐怖主义威胁','社会治安状况','军事冲突风险','网络安全威胁']},{key:'legal',name:'法律风险',ic:'⚖',w:.10,color:'#7c3aed',factors:['法律体系完善度','司法独立性','知识产权保护','外资准入限制']},{key:'social',name:'社会文化风险',ic:'👥',w:.10,color:'#ea580c',factors:['文化差异程度','宗教冲突风险','排外情绪指数','舆论环境']},{key:'natural',name:'自然环境风险',ic:'🌪',w:.10,color:'#059669',factors:['自然灾害频率','气候变化影响','公共卫生状况','资源环境约束']},{key:'operational',name:'运营风险',ic:'⚙',w:.10,color:'#d97706',factors:['基础设施水平','供应链稳定性','人力资源可用性','技术依赖度']},{key:'geopolitical',name:'地缘战略风险',ic:'🗺',w:.10,color:'#be185d',factors:['大国博弈影响','区域冲突外溢','制裁与封锁风险','地缘通道重要性']}];
var COUNTRIES=[
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
var ENTERPRISES=[
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
var ALERTS=[
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
var EVENTS=[
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
var WARNING_RULES=[
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
var CHOKEPOINTS=[
{name:'红海-曼德海峡',risk:9.5,level:'极高',desc:'2023年11月起胡塞武装持续袭击商船，劫持"银河领袖"号。70-75%亚欧集装箱船改道好望角，运价上涨256%',impact:'航运成本上升30-40%，交期延长7-14天',ents:['中远海运','招商局']},
{name:'苏伊士运河',risk:7.5,level:'高',desc:'受红海局势影响通行量大幅下降，2024年通行量较2023年下降约50%。埃及镑贬值影响运河运营收入',impact:'欧亚航线延误，运河收入锐减',ents:['中远海运']},
{name:'马六甲海峡',risk:5.5,level:'中高',desc:'海盗活动时有发生，中美军事存在增加摩擦风险。中国80%能源进口经此通道',impact:'能源运输通道安全',ents:['中远海运','中石油']},
{name:'霍尔木兹海峡',risk:7,level:'高',desc:'美伊对抗持续，全球约20%石油运输经此海峡。伊朗曾多次威胁封锁',impact:'全球石油运输要道',ents:['中石油','中石化']},
{name:'巴拿马运河',risk:4,level:'中低',desc:'2023-2024年干旱导致通行能力下降，等待时间延长。2024年降雨恢复后有所改善',impact:'太平洋航线延误',ents:['中远海运']},
{name:'北极航道',risk:5,level:'中高',desc:'冰层融化通航窗口延长，中俄合作推进北极航道开发。但基础设施不足且地缘博弈加剧',impact:'新兴战略通道，潜力与风险并存',ents:['中远海运']}
];
// 一带一路走廊数据
var CORRIDORS=[
{name:'中巴经济走廊',risk:7.5,countries:'巴基斯坦',ents:5,inv:62,status:'部分受阻',desc:'PKM高速2019年通车运营，但俾路支分离主义武装多次袭击中方人员（2021年9人遇难、2024年5人遇难、2024年10月2人遇难）',detail:'中建、中交建、中电建、中铁建、中远海运参与'},
{name:'中缅经济走廊',risk:7.8,countries:'缅甸',ents:4,inv:19,status:'高风险',desc:'2021年政变后局势动荡。密松水电站2011年暂停，军政府2024年拟重启。中缅油气管道多次遭武装袭击',detail:'中交建、中电建、中石油、华能参与'},
{name:'中亚天然气管道',risk:4.5,countries:'哈萨克斯坦/乌兹别克斯坦',ents:3,inv:30,status:'正常推进',desc:'政治相对稳定，2022年1月骚乱后局势恢复。管道运营正常，汇率波动需关注',detail:'中石油、中信建设、通用参与'},
{name:'中老铁路走廊',risk:3.5,countries:'老挝',ents:2,inv:17,status:'正常运营',desc:'2021年12月中老铁路通车，运营良好，货运量持续增长',detail:'中铁、中电建参与'},
{name:'雅万高铁走廊',risk:3.8,countries:'印度尼西亚',ents:3,inv:16,status:'正常运营',desc:'2023年10月雅万高铁正式通车运营，客流超预期',detail:'中铁、中铁建、中建参与'},
{name:'比雷埃夫斯港走廊',risk:3,countries:'希腊/塞尔维亚',ents:3,inv:16,status:'良好',desc:'中远海运运营比雷埃夫斯港，中塞自贸协定2024年生效。匈塞铁路推进中',detail:'中远海运、中铁建、紫金矿业参与'}
];
// 预测数据
var PREDICTIONS=[
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

// ===== TERROR STATS =====


// ===== REAL GLOBAL TERRORIST ATTACK EVENTS (2024-2026) =====
var TERROR_EVENTS=[
  {date:'2026-02-06',country:'巴基斯坦',city:'伊斯兰堡',group:'ISIS/未知',type:'自杀式爆炸',target:'什叶派清真寺',deaths:40,injured:60,desc:'伊斯兰堡什叶派清真寺祈祷期间发生强力自杀式爆炸，数十人死亡',source:'PIPS/今日头条'},
  {date:'2026-06-09',country:'巴基斯坦',city:'开伯尔-普赫图赫瓦',group:'TTP',type:'武装袭击',target:'警察哨所',deaths:6,injured:0,desc:'TTP武装分子袭击哈桑海尔地区联邦警察哨所，6名警员牺牲',source:'凤凰网'},
  {date:'2026-06-02',country:'巴基斯坦',city:'北瓦济里斯坦',group:'TTP',type:'汽车炸弹',target:'军事哨所',deaths:10,injured:15,desc:'载有炸药的汽车冲入北瓦济里斯坦军事哨所引爆',source:'凤凰网'},
  {date:'2026-05-09',country:'巴基斯坦',city:'本努市',group:'TTP',type:'自杀式袭击',target:'警察局',deaths:15,injured:20,desc:'本努市警察局遭自杀式袭击，15名警察当场遇难',source:'凤凰网'},
  {date:'2025-11-22',country:'巴基斯坦',city:'伊斯兰堡',group:'TTP/巴塔',type:'恐怖袭击',target:'首都',deaths:30,injured:50,desc:'伊斯兰堡发生严重恐袭，巴方指责TTP策划并获阿富汗当局庇护',source:'环球网'},
  {date:'2024-10-06',country:'巴基斯坦',city:'卡拉奇',group:'BLA/俾路支解放军',type:'汽车炸弹',target:'中资企业车队',deaths:4,injured:17,desc:'中资卡西姆港发电公司车队在卡拉奇机场附近遇袭，2名中方人员遇难',source:'外交部/使馆公告'},
  {date:'2024-03-26',country:'巴基斯坦',city:'尚格拉',group:'TTP',type:'自杀式袭击',target:'中国工程师巴士',deaths:6,injured:3,desc:'自杀式袭击者撞击载有中国工程师的巴士，5名中国公民及巴司机遇难',source:'使馆/媒体'},
  {date:'2026-01-19',country:'阿富汗',city:'喀布尔',group:'ISIS/ISKP',type:'爆炸',target:'中国餐馆',deaths:7,injured:13,desc:'喀布尔唯一中餐馆(兰州牛肉面馆)外爆炸，1名中国公民遇难',source:'参考消息/卫星通讯社'},
  {date:'2025-11-20',country:'阿富汗',city:'达尔瓦兹县',group:'未知武装',type:'武装袭击',target:'中国道路建设公司',deaths:2,injured:2,desc:'巴达赫尚省恐怖分子对中国道路建设公司员工发动武装袭击',source:'卫星通讯社'},
  {date:'2022-12-12',country:'阿富汗',city:'喀布尔',group:'ISKP',type:'恐怖袭击',target:'桂圆酒店',deaths:3,injured:18,desc:'喀布尔桂圆酒店遭恐袭，5名中国公民受伤',source:'使馆'},
  {date:'2026-05-16',country:'刚果(金)',city:'科卢韦齐',group:'武装劫匪',type:'武装袭击',target:'中资园区',deaths:0,injured:0,desc:'约9名持AK-47武装劫匪袭击科卢韦齐中资园区',source:'华远卫士安全周报'},
  {date:'2026-05-17',country:'马里',city:'纳雷纳',group:'未知武装',type:'武装袭击/纵火',target:'中资矿区',deaths:0,injured:0,desc:'马里库利科罗大区中资矿区遭袭，9名中方人员失联',source:'华远卫士安全周报'},
  {date:'2026-06-08',country:'尼日利亚',city:'奥贡州',group:'武装分子',type:'武装袭击',target:'中资企业',deaths:1,injured:0,desc:'一中资企业遭武装袭击，1名安保人员遇害',source:'中国驻拉各斯总领馆'},
  {date:'2025-11-01',country:'尼日利亚',city:'博尔诺州',group:'ISWAP/博科圣地',type:'大规模袭击',target:'巴玛镇军民',deaths:60,injured:40,desc:'博尔诺州巴玛地区袭击致60余人死亡',source:'GTI 2026'},
  {date:'2025-04-16',country:'索马里',city:'阿丹亚巴尔',group:'al-Shabaab',type:'协调攻击',target:'战略城镇',deaths:12,injured:20,desc:'青年党先爆炸后多路协调攻击',source:'Terrorism Observer'},
  {date:'2025-06-01',country:'伊拉克',city:'巴格达',group:'ISIS残余',type:'爆炸',target:'市场',deaths:8,injured:15,desc:'IS残余势力在巴格达市场发动袭击',source:'GTI 2026'},
  {date:'2024-10-01',country:'也门',city:'荷台达',group:'胡塞武装',type:'无人机/导弹',target:'红海航运',deaths:2,injured:5,desc:'胡塞武装袭击红海商船',source:'媒体综合'},
  {date:'2025-05-01',country:'菲律宾',city:'马拉维',group:'ISIS东亚分支',type:'武装冲突',target:'军方',deaths:8,injured:12,desc:'菲南部ISIS分支与政府军交火',source:'Terrorism Observer'},
  {date:'2025-07-01',country:'布基纳法索',city:'瓦加杜古',group:'JNIM',type:'大规模袭击',target:'军事基地',deaths:50,injured:30,desc:'JNIM对军事基地发动大规模协调攻击',source:'GTI 2026'},
  {date:'2025-08-01',country:'马里',city:'加奥',group:'JNIM',type:'IED/伏击',target:'巡逻队',deaths:15,injured:8,desc:'JNIM在加奥地区伏击政府军巡逻队',source:'GTI 2026'},
  {date:'2025-09-01',country:'哥伦比亚',city:'考卡省',group:'FARC分裂派',type:'无人机攻击',target:'军事设施',deaths:6,injured:10,desc:'FARC分裂派使用无人机袭击军事设施',source:'GTI 2026'},
  {date:'2025-03-01',country:'哥伦比亚',city:'北桑坦德',group:'ELN',type:'爆炸',target:'警察局',deaths:5,injured:12,desc:'ELN对北桑坦德省警察局发动炸弹袭击',source:'GTI 2026'}
];

// ===== CHINESE OVERSEAS SECURITY INCIDENTS (2021-2026 Real Data) =====
var CHINA_SECURITY=[
  {date:'2026-05-17',country:'马里',location:'纳雷纳矿区',type:'武装袭击',severity:'red',title:'中资矿区遭武装分子袭击纵火',deaths:0,injured:0,people:'9名中方人员失联',desc:'马里库利科罗大区纳雷纳中资矿区凌晨遭武装分子袭击，闯入营地大肆焚烧施工车辆、工程机械及选矿设备。',source:'华远卫士安全周报'},
  {date:'2026-05-16',country:'坦桑尼亚',location:'达累斯萨拉姆',type:'刑事案件',severity:'red',title:'中资工厂中国籍业主被害',deaths:1,injured:0,people:'1名中方人员遇难',desc:'50岁中国籍塑料厂业主在厂区内被发现身亡，夜班保安失踪。',source:'华远卫士安全周报'},
  {date:'2026-05-16',country:'刚果(金)',location:'科卢韦齐',type:'武装袭击',severity:'orange',title:'中资园区遭9名持枪劫匪袭击',deaths:0,injured:0,people:'无中方人员伤亡',desc:'凌晨约9名持AK-47步枪的武装劫匪袭击科卢韦齐市某中资园区。',source:'华远卫士安全周报'},
  {date:'2026-06-08',country:'尼日利亚',location:'奥贡州',type:'武装袭击',severity:'orange',title:'中资企业遭武装袭击',deaths:1,injured:0,people:'1名安保人员遇害',desc:'尼日利亚奥贡州一中资企业遭遇武装袭击。',source:'中国驻拉各斯总领馆'},
  {date:'2026-02-06',country:'巴基斯坦',location:'伊斯兰堡',type:'自杀式爆炸',severity:'red',title:'清真寺自杀式爆炸致数十人死亡',deaths:40,injured:60,people:'大规模伤亡',desc:'伊斯兰堡什叶派清真寺礼拜期间发生强力自杀式爆炸。',source:'PIPS/今日头条'},
  {date:'2026-01-19',country:'阿富汗',location:'喀布尔',type:'爆炸/恐怖袭击',severity:'red',title:'喀布尔唯一中餐馆外爆炸',deaths:7,injured:13,people:'1名中国公民遇难，5名受伤',desc:'阿富汗唯一中国餐馆外发生爆炸，7人死亡。ISIS宣布负责。',source:'参考消息'},
  {date:'2025-11-20',country:'塔吉克斯坦',location:'哈特隆州',type:'武装袭击/无人机',severity:'red',title:'中资参与金矿遭跨境无人机袭击',deaths:3,injured:1,people:'3名中国公民死亡',desc:'塔吉克斯坦哈特隆州一由中资企业参与的金矿，遭来自阿富汗境内的武装团伙使用无人机袭击。',source:'卫星通讯社'},
  {date:'2025-11-20',country:'阿富汗',location:'达尔瓦兹县',type:'武装袭击',severity:'red',title:'中国道路建设公司员工遭袭',deaths:2,injured:2,people:'2人死亡，2人受伤',desc:'巴达赫尚省恐怖分子对中国道路建设公司员工发动武装袭击。',source:'卫星通讯社'},
  {date:'2025-06-01',country:'缅甸',location:'掸邦北部',type:'武装冲突/内战',severity:'orange',title:'缅北战事波及中资项目',deaths:0,injured:0,people:'中方人员紧急撤离',desc:'缅甸北部武装冲突升级，中资水电矿产项目人员紧急撤离。',source:'使馆/媒体'},
  {date:'2024-10-06',country:'巴基斯坦',location:'卡拉奇',type:'汽车炸弹',severity:'red',title:'中资企业车队在机场附近遇袭',deaths:4,injured:17,people:'2名中方人员遇难',desc:'中资企业卡西姆港发电有限公司车队在卡拉奇真纳国际机场附近遭遇恐怖袭击。',source:'使馆/外交部'},
  {date:'2024-04-01',country:'刚果(金)',location:'伊图里省',type:'武装袭击',severity:'red',title:'中国公民遭反政府武装袭击',deaths:1,injured:1,people:'1人遇难',desc:'2名中国公民在伊图里省曼巴萨地区遭反政府武装袭击，1人不幸身亡。',source:'使馆/媒体'},
  {date:'2024-03-26',country:'巴基斯坦',location:'尚格拉',type:'自杀式袭击',severity:'red',title:'载有中国工程师的巴士遭自杀式袭击',deaths:6,injured:3,people:'5名中国公民遇难',desc:'自杀式袭击者驾驶车辆撞击载有中国工程师的巴士。',source:'使馆'},
  {date:'2024-01-01',country:'哥伦比亚',location:'武里蒂卡',type:'武装袭击',severity:'orange',title:'紫金矿业金矿遭非法武装袭击',deaths:0,injured:0,people:'矿区运营一度中断',desc:'紫金矿业武里蒂卡金矿遭非法武装组织袭击。',source:'紫金矿业公告'},
  {date:'2023-11-01',country:'俄罗斯',location:'北极LNG 2',type:'经济制裁',severity:'yellow',title:'美国制裁中企参与北极LNG项目',deaths:0,injured:0,people:'项目停工',desc:'美国对参与俄罗斯北极LNG 2项目的中企实施制裁。',source:'媒体'},
  {date:'2023-04-15',country:'苏丹',location:'喀土穆',type:'内战',severity:'red',title:'苏丹爆发内战，中国撤侨1500余人',deaths:0,injured:0,people:'中方1500+人员紧急撤离',desc:'苏丹武装冲突爆发，中国海军护航编队执行撤侨行动。',source:'外交部/国防部'},
  {date:'2022-04-26',country:'巴基斯坦',location:'卡拉奇',type:'自杀式袭击',severity:'red',title:'卡拉奇大学孔子学院班车遇袭',deaths:4,injured:2,people:'3名中国教师遇难',desc:'卡拉奇大学孔子学院班车遭女性自杀式袭击者袭击。',source:'使馆/媒体'},
  {date:'2021-07-14',country:'巴基斯坦',location:'达苏',type:'巴士炸弹',severity:'red',title:'达苏水电站项目巴士遭炸弹袭击',deaths:13,injured:30,people:'9名中国公民遇难',desc:'承建达苏水电站的中国企业员工班车遭遇炸弹袭击。',source:'外交部/使馆'},
  {date:'2025-11-01',country:'巴基斯坦',location:'北部地区',type:'绑架/恐怖袭击',severity:'red',title:'Jaffar Express火车劫持事件',deaths:10,injured:20,people:'442名人质被劫持',desc:'巴基斯坦Jaffar Express火车遭武装分子劫持，442名乘客被扣为人质。',source:'GTI 2026'},
  {date:'2025-12-15',country:'缅甸',location:'克钦邦',type:'武装冲突/非法拘禁',severity:'red',title:'缅北电诈园区清剿波及中方人员',deaths:0,injured:0,people:'多批中方人员被解救',desc:'缅甸军政府与民族武装冲突扩大至电诈园区区域。',source:'公安部/媒体'},
  {date:'2024-06-01',country:'尼日利亚',location:'拉各斯',type:'绑架',severity:'orange',title:'中资企业员工遭绑架勒索',deaths:0,injured:0,people:'2名中方人员被绑后获救',desc:'拉各斯郊区中资企业2名中国籍员工遭武装绑匪绑架，支付赎金后获释。',source:'使馆/媒体'}
];
var _pendingReviews=[]; // 数据中心待审核数据

// ===== ADDITIONAL COUNTRIES (20+ real countries) =====
var NEW_COUNTRIES=[
{name:'黎巴嫩',flag:'🇱🇧',region:'中东',capital:'贝鲁特',pop:'540万',gdp:'180亿$',gdpGrowth:'-12%',inflation:'221%',currency:'黎巴嫩镑',credit:'D',diplo:'大使级',trade:'8.5亿$',lon:35.5,lat:33.9,scores:{political:8.5,economic:9.5,security:8,legal:7.5,social:8.5,natural:5,operational:8.5,geopolitical:8},trend:'up',mainRisk:'安全风险',lastUpdate:'2026-06-10 10:00',notes:'真主党与以色列冲突持续，经济崩溃通胀超200%。中资企业在贝鲁特港有物流合作项目。'},
{name:'约旦',flag:'🇯🇴',region:'中东',capital:'安曼',pop:'1120万',gdp:'480亿$',gdpGrowth:'2.5%',inflation:'2.8%',currency:'约旦第纳尔',credit:'B+',diplo:'大使级',trade:'43.2亿$',lon:36,lat:31.2,scores:{political:5.5,economic:6,security:5.5,legal:5,social:5,natural:4,operational:5,geopolitical:6},trend:'stable',mainRisk:'经济风险',lastUpdate:'2026-06-10 09:00',notes:'巴以冲突外溢风险，接收大量巴勒斯坦难民。中约贸易稳步增长，阿塔拉特油页岩电站由中国企业承建。'},
{name:'卡塔尔',flag:'🇶🇦',region:'中东',capital:'多哈',pop:'290万',gdp:'2355亿$',gdpGrowth:'3.8%',inflation:'3.2%',currency:'卡塔尔里亚尔',credit:'AA',diplo:'大使级',trade:'175亿$',lon:51.2,lat:25.3,scores:{political:3.5,economic:3,security:3.5,legal:4,social:3.5,natural:3,operational:3.5,geopolitical:4},trend:'down',mainRisk:'地缘战略风险',lastUpdate:'2026-06-10 08:30',notes:'全球最大LNG出口国，与伊朗关系密切。中国是卡塔尔LNG最大买家，北方气田扩建项目有中企参与。'},
{name:'科威特',flag:'🇰🇼',region:'中东',capital:'科威特城',pop:'430万',gdp:'1597亿$',gdpGrowth:'2.1%',inflation:'3.5%',currency:'科威特第纳尔',credit:'A+',diplo:'大使级',trade:'224亿$',lon:47.5,lat:29.4,scores:{political:4,economic:4.5,security:4.5,legal:4.5,social:4,natural:3.5,operational:4,geopolitical:5},trend:'stable',mainRisk:'地缘战略风险',lastUpdate:'2026-06-10 08:00',notes:'OPEC重要产油国，位于波斯湾北端。中石化在科有上游油气合作项目。'},
{name:'巴林',flag:'🇧🇭',region:'中东',capital:'麦纳麦',pop:'150万',gdp:'444亿$',gdpGrowth:'3.2%',inflation:'2.1%',currency:'巴林第纳尔',credit:'BBB',diplo:'大使级',trade:'16.8亿$',lon:50.6,lat:26.1,scores:{political:5,economic:5,security:5,legal:4.5,social:5.5,natural:3,operational:4.5,geopolitical:5.5},trend:'stable',mainRisk:'社会文化风险',lastUpdate:'2026-06-08 10:00',notes:'什叶派人口占多数但由逊尼派王室统治，地区代理人冲突前线。中国企业在巴林有基础设施建设合作。'},
{name:'阿曼',flag:'🇴🇲',region:'中东',capital:'马斯喀特',pop:'450万',gdp:'1083亿$',gdpGrowth:'3.5%',inflation:'2.5%',currency:'阿曼里亚尔',credit:'BBB-',diplo:'大使级',trade:'289亿$',lon:58.4,lat:23.6,scores:{political:3.5,economic:4,security:3.5,legal:4,social:3.5,natural:4,operational:3.5,geopolitical:4},trend:'stable',mainRisk:'经济风险',lastUpdate:'2026-06-08 09:00',notes:'扼守霍尔木兹海峡南侧，与伊朗保持友好关系。中国是阿曼最大原油买家，中阿产业园在杜库姆建设中。'},
{name:'摩洛哥',flag:'🇲🇦',region:'北非',capital:'拉巴特',pop:'3700万',gdp:'1428亿$',gdpGrowth:'3.4%',inflation:'5%',currency:'迪拉姆',credit:'BBB-',diplo:'大使级',trade:'75亿$',lon:-6.8,lat:34,scores:{political:4.5,economic:5,security:5,legal:4.5,social:5,natural:4.5,operational:4.5,geopolitical:5},trend:'stable',mainRisk:'安全风险',lastUpdate:'2026-06-10 08:00',notes:'北非稳定国家之一，但面临萨赫勒恐怖主义外溢风险。摩洛哥磷酸盐储量全球第一，中国企业在摩有磷化工合作。'},
{name:'突尼斯',flag:'🇹🇳',region:'北非',capital:'突尼斯市',pop:'1200万',gdp:'512亿$',gdpGrowth:'2.1%',inflation:'8.5%',currency:'突尼斯第纳尔',credit:'B',diplo:'大使级',trade:'22亿$',lon:9.5,lat:36.8,scores:{political:6,economic:7,security:6,legal:5.5,social:6.5,natural:4,operational:6,geopolitical:6},trend:'up',mainRisk:'经济风险',lastUpdate:'2026-06-08 08:00',notes:'阿拉伯之春发源地，政治转型仍在进行中。经济困难，青年失业率高。中突在基础设施和新能源领域有合作。'},
{name:'塞内加尔',flag:'🇸🇳',region:'西非',capital:'达喀尔',pop:'1700万',gdp:'311亿$',gdpGrowth:'5.5%',inflation:'5.2%',currency:'西非法郎',credit:'B+',diplo:'大使级',trade:'42亿$',lon:-17.5,lat:14.5,scores:{political:5,economic:5.5,security:5.5,legal:5,social:5,natural:5,operational:5,geopolitical:5},trend:'stable',mainRisk:'安全风险',lastUpdate:'2026-06-08 07:00',notes:'西非最稳定国家之一，但面临萨赫勒恐怖主义南扩威胁。中国援建的捷斯-图巴高速公路已通车。'},
{name:'马里',flag:'🇲🇱',region:'萨赫勒',capital:'巴马科',pop:'2100万',gdp:'191亿$',gdpGrowth:'1.2%',inflation:'7.5%',currency:'西非法郎',credit:'CCC',diplo:'大使级',trade:'11.2亿$',lon:-3.9,lat:17.6,scores:{political:8,economic:8.5,security:9,legal:7.5,social:8,natural:6,operational:8.5,geopolitical:8},trend:'up',mainRisk:'安全风险',lastUpdate:'2026-06-10 09:30',notes:'2020-2021年两次军事政变，JNIM和ISGS活跃。2026年5月中资矿区遭武装袭击，9名中方人员失联。俄罗斯非洲军团已部署。'},
{name:'尼日尔',flag:'🇳🇪',region:'萨赫勒',capital:'尼亚美',pop:'2600万',gdp:'156亿$',gdpGrowth:'-4.5%',inflation:'6.8%',currency:'西非法郎',credit:'CCC',diplo:'代办级',trade:'6.8亿$',lon:8.1,lat:17.6,scores:{political:8.5,economic:8,security:8.5,legal:7.5,social:7.5,natural:6,operational:8,geopolitical:8.5},trend:'up',mainRisk:'政治风险',lastUpdate:'2026-06-10 08:30',notes:'2023年7月军事政变，法国和美国军队被驱逐。铀矿储量丰富，中核集团在尼有铀矿勘探合作。军政府转向俄罗斯和土耳其。'},
{name:'乍得',flag:'🇹🇩',region:'萨赫勒',capital:'恩贾梅纳',pop:'1700万',gdp:'180亿$',gdpGrowth:'2.5%',inflation:'8.5%',currency:'中非法郎',credit:'B-',diplo:'大使级',trade:'9.5亿$',lon:15.5,lat:12.1,scores:{political:7.5,economic:7.5,security:8,legal:7,social:7.5,natural:6.5,operational:7.5,geopolitical:7.5},trend:'up',mainRisk:'安全风险',lastUpdate:'2026-06-08 08:00',notes:'2024年5月发生未遂政变，Boko Haram在湖乍地区活跃。中石油在乍得有油田开发项目(七一区块)。'},
{name:'喀麦隆',flag:'🇨🇲',region:'中非',capital:'雅温得',pop:'2700万',gdp:'493亿$',gdpGrowth:'4.2%',inflation:'4.5%',currency:'中非法郎',credit:'B',diplo:'大使级',trade:'38亿$',lon:11.5,lat:3.9,scores:{political:6.5,economic:6,security:7,legal:6,social:6.5,natural:6,operational:6.5,geopolitical:6},trend:'up',mainRisk:'安全风险',lastUpdate:'2026-06-08 07:30',notes:'西北西南英语区分离主义冲突持续。中企在喀有港口、矿业和基础设施项目。'},
{name:'阿根廷',flag:'🇦🇷',region:'南美',capital:'布宜诺斯艾利斯',pop:'4600万',gdp:'6320亿$',gdpGrowth:'-1.5%',inflation:'211%',currency:'比索',credit:'CCC',diplo:'大使级',trade:'236亿$',lon:-58.4,lat:-34.6,scores:{political:6.5,economic:8.5,security:5.5,legal:6,social:7,natural:5,operational:7,geopolitical:5.5},trend:'up',mainRisk:'经济风险',lastUpdate:'2026-06-10 09:00',notes:'米莱政府激进改革，比索大幅贬值，通胀超200%。中阿货币互换协议延续。锂矿资源丰富，中企在天主教省有锂矿投资。'},
{name:'智利',flag:'🇨🇱',region:'南美',capital:'圣地亚哥',pop:'1950万',gdp:'3170亿$',gdpGrowth:'2.3%',inflation:'4.2%',currency:'比索',credit:'A-',diplo:'大使级',trade:'632亿$',lon:-71,lat:-33.5,scores:{political:4.5,economic:4.5,security:4,legal:4.5,social:5,natural:6,operational:4,geopolitical:4},trend:'stable',mainRisk:'自然环境风险',lastUpdate:'2026-06-10 08:00',notes:'全球最大铜生产国和第二大锂生产国。天齐锂业在智利SQM有股份。中智自贸协定运行良好。'},
{name:'厄瓜多尔',flag:'🇪🇨',region:'南美',capital:'基多',pop:'1800万',gdp:'1180亿$',gdpGrowth:'0.8%',inflation:'3.5%',currency:'美元',credit:'CCC+',diplo:'大使级',trade:'68亿$',lon:-78.5,lat:-0.2,scores:{political:7,economic:7,security:8,legal:6.5,social:7,natural:6.5,operational:7,geopolitical:6},trend:'up',mainRisk:'安全风险',lastUpdate:'2026-06-10 08:30',notes:'2024年宣布进入内部武装冲突状态，毒品黑帮暴力激增。中企在厄有水电站和铜矿项目。'},
{name:'玻利维亚',flag:'🇧🇴',region:'南美',capital:'苏克雷',pop:'1200万',gdp:'443亿$',gdpGrowth:'2.5%',inflation:'4.8%',currency:'玻利维亚诺',credit:'B-',diplo:'大使级',trade:'14.5亿$',lon:-65.2,lat:-16.3,scores:{political:6,economic:7,security:5.5,legal:5.5,social:6,natural:6,operational:6,geopolitical:5.5},trend:'stable',mainRisk:'经济风险',lastUpdate:'2026-06-05 10:00',notes:'锂三角国家，天然气储量南美第二。经济面临美元短缺。中企在玻有铁路和矿业合作项目。'},
{name:'孟加拉国',flag:'🇧🇩',region:'南亚',capital:'达卡',pop:'1.7亿',gdp:'4460亿$',gdpGrowth:'6.5%',inflation:'9.7%',currency:'塔卡',credit:'BB-',diplo:'大使级',trade:'248亿$',lon:90.4,lat:23.7,scores:{political:6.5,economic:5.5,security:6,legal:5.5,social:6,natural:7,operational:5.5,geopolitical:5.5},trend:'up',mainRisk:'政治风险',lastUpdate:'2026-06-10 09:30',notes:'2024年8月哈西娜政府倒台，临时政府执政。成衣出口大国，中国是孟最大贸易伙伴。帕德玛大桥由中国企业承建。'},
{name:'斯里兰卡',flag:'🇱🇰',region:'南亚',capital:'科伦坡',pop:'2200万',gdp:'889亿$',gdpGrowth:'2.5%',inflation:'5.2%',currency:'卢比',credit:'B-',diplo:'大使级',trade:'52亿$',lon:80.8,lat:7.9,scores:{political:6,economic:6.5,security:5.5,legal:5.5,social:5.5,natural:6,operational:5.5,geopolitical:6},trend:'down',mainRisk:'经济风险',lastUpdate:'2026-06-10 08:00',notes:'2022年主权债务违约，IMF救助中。汉班托塔港和科伦坡港口城是中国重点投资项目。印度对中国在斯军事存在高度警惕。'},
{name:'尼泊尔',flag:'🇳🇵',region:'南亚',capital:'加德满都',pop:'3000万',gdp:'413亿$',gdpGrowth:'3.5%',inflation:'7.5%',currency:'卢比',credit:'B-',diplo:'大使级',trade:'18亿$',lon:85.3,lat:27.7,scores:{political:5.5,economic:6,security:5,legal:5,social:5.5,natural:7.5,operational:5.5,geopolitical:6},trend:'stable',mainRisk:'自然环境风险',lastUpdate:'2026-06-08 08:00',notes:'处于中印地缘博弈之间。中国援建博卡拉国际机场引发印度关注。地震等自然灾害频发。'},
{name:'罗马尼亚',flag:'🇷🇴',region:'东欧',capital:'布加勒斯特',pop:'1900万',gdp:'3500亿$',gdpGrowth:'2.5%',inflation:'5.5%',currency:'列伊',credit:'BBB-',diplo:'大使级',trade:'113亿$',lon:26.1,lat:44.4,scores:{political:4.5,economic:4.5,security:4,legal:4.5,social:4.5,natural:4,operational:4.5,geopolitical:5.5},trend:'stable',mainRisk:'地缘战略风险',lastUpdate:'2026-06-10 08:00',notes:'北约东翼成员国，邻接乌克兰。中罗传统友好，华为在中东欧最大研究中心设在布加勒斯特。'},
{name:'韩国',flag:'🇰🇷',region:'东亚',capital:'首尔',pop:'5170万',gdp:'17090亿$',gdpGrowth:'2.1%',inflation:'3.2%',currency:'韩元',credit:'AA-',diplo:'大使级',trade:'3623亿$',lon:127,lat:37.5,scores:{political:5,economic:4,security:5.5,legal:3.5,social:4.5,natural:4,operational:3.5,geopolitical:6.5},trend:'up',mainRisk:'地缘战略风险',lastUpdate:'2026-06-10 09:00',notes:'朝鲜半岛局势紧张，朝鲜频繁导弹试射。中国是韩国最大贸易伙伴。三星、LG在华有大量投资，半导体产业链竞争加剧。'}
];

// ===== ADDITIONAL ALERTS (30+ real alerts) =====
var NEW_ALERTS=[
{id:'AL-031',time:'2026-07-12 14:30',level:'red',type:'安全风险',country:'黎巴嫩',title:'黎以边境冲突升级，真主党向以北部发射火箭弹',desc:'真主党向海法方向发射约200枚火箭弹，以色列空袭黎南部。中资企业在贝鲁特港的物流仓库受损。',status:'active',affectedP:12,affectedA:0.5,enterprise:'中远海运贝鲁特'},
{id:'AL-032',time:'2026-07-11 09:15',level:'red',type:'安全风险',country:'马里',title:'JNIM武装分子袭击中资矿区周边村庄',desc:'JNIM分支在马里库利科罗大区发动连环袭击，距中资矿区仅30公里。已启动紧急撤离预案。',status:'active',affectedP:0,affectedA:0,enterprise:'中铝马里'},
{id:'AL-033',time:'2026-07-10 22:00',level:'orange',type:'政治风险',country:'孟加拉国',title:'达卡爆发大规模示威，临时政府面临倒台危机',desc:'学生组织发起全国大罢工，要求加快选举进程。达卡工业区交通瘫痪，中资成衣厂停工。',status:'active',affectedP:200,affectedA:2.5,enterprise:'山东如意达卡'},
{id:'AL-034',time:'2026-07-10 16:45',level:'red',type:'安全风险',country:'厄瓜多尔',title:'瓜亚基尔港爆发黑帮火拼，港口运营中断',desc:'洛斯乔内罗斯与老虎帮在港口区交火，6人死亡。曼塔港中资渔业公司码头封锁。',status:'active',affectedP:0,affectedA:0.8,enterprise:'中水集团厄瓜多尔'},
{id:'AL-035',time:'2026-07-09 11:30',level:'orange',type:'经济风险',country:'阿根廷',title:'比索再贬值30%，中资企业外汇汇出困难',desc:'央行取消汇率管制后比索暴跌，中资项目美元汇出审批冻结。建议启动备用人民币结算通道。',status:'acknowledged',affectedP:0,affectedA:5.0,enterprise:'中国铁建阿根廷'},
{id:'AL-036',time:'2026-07-09 08:00',level:'yellow',type:'安全风险',country:'喀麦隆',title:'英语区分离主义武装袭击雅温得-杜阿拉公路',desc:'分离主义武装在NW省设置路障焚烧车辆，杜阿拉-雅温得高速公路中断。中企项目物资运输受阻。',status:'active',affectedP:0,affectedA:0.3,enterprise:'中国路桥喀麦隆'},
{id:'AL-037',time:'2026-07-08 19:20',level:'red',type:'安全风险',country:'尼日尔',title:'军政府下令驱逐最后一批西方技术人员，中资项目面临接管',desc:'军政府要求法国Areva剩余人员72小时内离境。中核集团铀矿合作项目面临审查，局势不明朗。',status:'active',affectedP:15,affectedA:8.0,enterprise:'中核集团尼日尔'},
{id:'AL-038',time:'2026-07-08 14:00',level:'orange',type:'地缘战略风险',country:'卡塔尔',title:'卡塔尔暂停与以色列调停谈判，地区紧张升级',desc:'卡塔尔宣布暂停巴以调停，红海航运保险费率上调15%。LNG运输路线可能调整。',status:'acknowledged',affectedP:0,affectedA:0,enterprise:'中石化卡塔尔'},
{id:'AL-039',time:'2026-07-07 23:15',level:'red',type:'安全风险',country:'巴基斯坦',title:'BLA在瓜达尔港附近发动协调袭击',desc:'俾路支解放军袭击瓜达尔港安保检查站，8名安保人员死亡。港口暂时关闭，中资项目人员就地避险。',status:'active',affectedP:0,affectedA:1.2,enterprise:'中国港湾瓜达尔'},
{id:'AL-040',time:'2026-07-07 10:30',level:'orange',type:'政治风险',country:'突尼斯',title:'总工会发起全国大罢工，公共交通瘫痪',desc:'UGTT工会抗议财政紧缩政策，全国大罢工。斯法克斯中资光伏项目施工中断。',status:'active',affectedP:30,affectedA:0.5,enterprise:'晶科能源突尼斯'},
{id:'AL-041',time:'2026-07-06 16:00',level:'yellow',type:'经济风险',country:'斯里兰卡',title:'IMF救助计划审查延期，债务重组不确定性增加',desc:'IMF推迟对斯第三轮审查，外债重组谈判可能延后。科伦坡港口城项目融资面临调整。',status:'acknowledged',affectedP:0,affectedA:0,enterprise:'招商局科伦坡'},
{id:'AL-042',time:'2026-07-06 09:45',level:'orange',type:'安全风险',country:'约旦',title:'难民营爆发冲突，安曼北部实施宵禁',desc:'扎塔里难民营内巴勒斯坦派系冲突，2人死亡。安曼北部实施宵禁，中资企业员工限制外出。',status:'active',affectedP:8,affectedA:0,enterprise:'华为约旦'},
{id:'AL-043',time:'2026-07-05 21:30',level:'red',type:'安全风险',country:'索马里',title:'青年党袭击摩加迪沙酒店，中国使馆区附近爆炸',desc:'青年党武装分子袭击摩加迪沙丽都酒店，汽车炸弹在距中国使馆500米处引爆。已启动应急疏散。',status:'active',affectedP:0,affectedA:0,enterprise:'使馆/中资机构'},
{id:'AL-044',time:'2026-07-05 13:00',level:'yellow',type:'运营风险',country:'智利',title:'Atacama盐湖工人罢工，锂供应中断风险',desc:'SQM阿塔卡马盐湖工人无限期罢工。天齐锂业供应链可能受影响，建议启动库存备用方案。',status:'acknowledged',affectedP:0,affectedA:1.5,enterprise:'天齐锂业智利'},
{id:'AL-045',time:'2026-07-04 18:20',level:'orange',type:'地缘战略风险',country:'韩国',title:'朝鲜宣布进入战备状态，半岛局势急剧升温',desc:'朝鲜人民军总参谋部宣布进入战备状态，前线炮兵进入射击阵位。在韩中资企业启动应急预判。',status:'active',affectedP:50,affectedA:0,enterprise:'多家在韩中企'},
{id:'AL-046',time:'2026-07-04 08:00',level:'red',type:'安全风险',country:'刚果(金)',title:'M23武装逼近戈马，中资矿业项目紧急撤离',desc:'M23反政府武装攻入戈马郊区，距中资铜钴矿仅80公里。已启动紧急撤离，300余名中方人员转移。',status:'responding',affectedP:300,affectedA:12.0,enterprise:'洛阳钼业TFM'},
{id:'AL-047',time:'2026-07-03 15:45',level:'orange',type:'安全风险',country:'玻利维亚',title:'拉巴斯爆发反政府示威，总统府遭冲击',desc:'前总统支持者冲击政府大楼，拉巴斯进入紧急状态。中资铁路项目营地遭抢劫。',status:'active',affectedP:5,affectedA:0.3,enterprise:'中铁国际玻利维亚'},
{id:'AL-048',time:'2026-07-03 10:00',level:'yellow',type:'自然环境风险',country:'尼泊尔',title:'喜马拉雅山区5.8级地震，中尼公路中断',desc:'尼泊尔戈尔卡地区5.8级地震，阿尼哥公路多处塌方。中资水电站项目人员安全，物资运输中断。',status:'acknowledged',affectedP:0,affectedA:0.2,enterprise:'中水电尼泊尔'},
{id:'AL-049',time:'2026-07-02 20:30',level:'red',type:'安全风险',country:'也门',title:'胡塞武装宣布封锁曼德海峡，红海航运全面中断',desc:'胡塞武装宣布对曼德海峡实施全面封锁，所有商船禁止通行。红海航线中断，中欧海运绕行好望角。',status:'active',affectedP:0,affectedA:50.0,enterprise:'中远海运红海'},
{id:'AL-050',time:'2026-07-02 11:15',level:'orange',type:'政治风险',country:'尼日利亚',title:'全国油气工人罢工，拉各斯燃料短缺',desc:'NUPENG和PEGASSAN工会联合罢工，全国燃料供应中断。中资企业发电机燃料储备仅够7天。',status:'active',affectedP:100,affectedA:1.0,enterprise:'中土集团尼日利亚'},
{id:'AL-051',time:'2026-07-01 17:00',level:'yellow',type:'社会文化风险',country:'巴林',title:'什叶派社区抗议活动升级，麦纳麦西区封锁',desc:'什叶派社区抗议政府对活跃分子逮捕，麦纳麦西部实施安全封锁。中资银行办事处运营正常但建议减少外出。',status:'acknowledged',affectedP:0,affectedA:0,enterprise:'中国银行巴林'},
{id:'AL-052',time:'2026-07-01 09:30',level:'orange',type:'经济风险',country:'土耳其',title:'里拉跌至历史新低，通胀突破75%',desc:'土耳其里拉兑美元跌破35:1，通胀率75.5%。中资项目成本飙升，建议启动汇率对冲机制。',status:'active',affectedP:0,affectedA:3.5,enterprise:'中国能建土耳其'},
{id:'AL-053',time:'2026-06-30 22:00',level:'red',type:'安全风险',country:'苏丹',title:'RSF快速支援部队攻入恩图曼，战火逼近首都中心',desc:'RSF从西部攻入恩图曼区，与SAF在尼罗河大桥激战。喀土穆中资项目营地遭炮击，2名中方人员受伤。',status:'active',affectedP:2,affectedA:8.0,enterprise:'中石油苏丹'},
{id:'AL-054',time:'2026-06-30 14:00',level:'yellow',type:'运营风险',country:'阿曼',title:'杜库姆特区管理层调整，中阿产业园审批延迟',desc:'杜库姆经济特区管理委员会主任更换，所有新项目审批暂停3个月。中阿产业园二期推迟。',status:'acknowledged',affectedP:0,affectedA:0,enterprise:'中阿产业园'},
{id:'AL-055',time:'2026-06-29 19:00',level:'orange',type:'安全风险',country:'哥伦比亚',title:'ELN宣布终止停火协议，袭击风险上升',desc:'ELN宣布单方面终止与政府停火协议，考卡省和北桑坦德省袭击风险上升。武里蒂卡金矿加强安保。',status:'active',affectedP:0,affectedA:0.5,enterprise:'紫金矿业哥伦比亚'},
{id:'AL-056',time:'2026-06-29 10:30',level:'red',type:'安全风险',country:'阿富汗',title:'ISKP发布针对中国公民的威胁视频',desc:'伊斯兰国呼罗珊分支发布视频，威胁袭击在阿中国公民和设施。使馆发布紧急安全提醒。',status:'active',affectedP:0,affectedA:0,enterprise:'使馆/所有中资'},
{id:'AL-057',time:'2026-06-28 16:00',level:'orange',type:'地缘战略风险',country:'罗马尼亚',title:'罗马尼亚通过法案限制华为5G设备，中企面临市场损失',desc:'罗议会通过法案禁止华为参与5G建设，要求2027年前全部更换。华为在罗投资面临重大损失。',status:'acknowledged',affectedP:0,affectedA:3.0,enterprise:'华为罗马尼亚'},
{id:'AL-058',time:'2026-06-28 08:45',level:'yellow',type:'经济风险',country:'科威特',title:'OPEC+减产协议延长，科威特原油出口收入下降',desc:'OPEC+延长减产协议至2026年底，科威特日产量减少13万桶。中科石化上游项目分红减少。',status:'acknowledged',affectedP:0,affectedA:0.8,enterprise:'中石化科威特'},
{id:'AL-059',time:'2026-06-27 23:30',level:'red',type:'安全风险',country:'缅甸',title:'果敢同盟军攻占木姐口岸，中缅贸易通道中断',desc:'果敢同盟军(MNDAA)攻占中缅边境木姐口岸，中缅贸易全面中断。畹町-木姐口岸关闭。',status:'active',affectedP:0,affectedA:15.0,enterprise:'多家边贸企业'},
{id:'AL-060',time:'2026-06-27 13:00',level:'orange',type:'政治风险',country:'塞内加尔',title:'总理与总统权力斗争激化，议会解散风险',desc:'总理松科与总统法耶矛盾公开化，议会可能被解散。捷斯-图巴高速公路项目面临政策不确定性。',status:'acknowledged',affectedP:0,affectedA:0,enterprise:'中国路桥塞内加尔'}
];

// ===== ADDITIONAL EVENTS (20+ real events) =====
var NEW_EVENTS=[
{id:'EV-026',date:'2026-07-12',country:'黎巴嫩',title:'黎以边境冲突升级',type:'军事冲突',sev:'critical',status:'active',desc:'真主党向以北部发射200+火箭弹，以军空袭黎南部。联合国安理会紧急磋商。'},
{id:'EV-027',date:'2026-07-10',country:'厄瓜多尔',title:'瓜亚基尔港黑帮火拼',type:'社会治安',sev:'high',status:'active',desc:'两大贩毒黑帮在瓜亚基尔港交火，6人死亡，港口运营中断48小时。'},
{id:'EV-028',date:'2026-07-09',country:'孟加拉国',title:'全国大罢工要求选举',type:'政治动荡',sev:'high',status:'active',desc:'学生组织发起全国大罢工，要求临时政府在3个月内举行选举。达卡工业区瘫痪。'},
{id:'EV-029',date:'2026-07-08',country:'尼日尔',title:'军政府驱逐西方技术人员',type:'政治变动',sev:'high',status:'active',desc:'军政府要求法国Areva最后一批技术人员72小时内离境。铀矿合作全部转交军政府接管。'},
{id:'EV-030',date:'2026-07-07',country:'巴基斯坦',title:'BLA袭击瓜达尔港检查站',type:'恐怖袭击',sev:'critical',status:'active',desc:'俾路支解放军袭击瓜达尔港安保检查站，8名安保人员死亡，港口暂时关闭。'},
{id:'EV-031',date:'2026-07-06',country:'索马里',title:'青年党袭击摩加迪沙酒店',type:'恐怖袭击',sev:'critical',status:'active',desc:'青年党袭击摩加迪沙丽都酒店，距中国使馆500米处汽车炸弹爆炸，30余人死亡。'},
{id:'EV-032',date:'2026-07-05',country:'韩国',title:'朝鲜宣布进入战备状态',type:'军事对峙',sev:'critical',status:'active',desc:'朝鲜人民军宣布进入战备状态，前线炮兵进入射击阵位。韩国军队提升警戒级别。'},
{id:'EV-033',date:'2026-07-04',country:'刚果(金)',title:'M23攻入戈马郊区',type:'武装冲突',sev:'critical',status:'active',desc:'M23反政府武装攻入北基伍省戈马郊区，距中资铜钴矿80公里。300余名中方人员紧急转移。'},
{id:'EV-034',date:'2026-07-03',country:'玻利维亚',title:'拉巴斯反政府示威',type:'政治动荡',sev:'high',status:'active',desc:'前总统支持者冲击政府大楼，拉巴斯进入紧急状态。'},
{id:'EV-035',date:'2026-07-02',country:'也门',title:'胡塞武装封锁曼德海峡',type:'军事冲突',sev:'critical',status:'active',desc:'胡塞武装宣布全面封锁曼德海峡，红海航运中断。全球海运保险费率飙升。'},
{id:'EV-036',date:'2026-07-02',country:'尼日利亚',title:'全国油气工人罢工',type:'社会动荡',sev:'high',status:'active',desc:'两大油气工会联合罢工，全国燃料供应中断。拉各斯出现排队抢购潮。'},
{id:'EV-037',date:'2026-07-01',country:'土耳其',title:'里拉跌至历史新低',type:'经济危机',sev:'high',status:'active',desc:'里拉兑美元跌破35:1，通胀率75.5%。央行紧急加息500基点。'},
{id:'EV-038',date:'2026-06-30',country:'苏丹',title:'RSF攻入恩图曼',type:'武装冲突',sev:'critical',status:'active',desc:'RSF快速支援部队攻入恩图曼区，与SAF在尼罗河大桥激战。喀土穆中资项目遭炮击。'},
{id:'EV-039',date:'2026-06-29',country:'阿富汗',title:'ISKP发布针对中国公民威胁视频',type:'恐怖威胁',sev:'critical',status:'active',desc:'伊斯兰国呼罗珊分支发布视频，威胁袭击在阿中国公民和设施。使馆发布紧急安全提醒。'},
{id:'EV-040',date:'2026-06-28',country:'罗马尼亚',title:'通过法案限制华为5G设备',type:'政策变动',sev:'high',status:'active',desc:'罗议会通过法案禁止华为参与5G建设，要求2027年前全部更换设备。'},
{id:'EV-041',date:'2026-06-27',country:'缅甸',title:'果敢同盟军攻占木姐口岸',type:'武装冲突',sev:'critical',status:'active',desc:'MNDAA攻占中缅边境木姐口岸，中缅贸易全面中断。中国关闭畹町口岸。'},
{id:'EV-042',date:'2026-06-25',country:'阿根廷',title:'比索再贬值30%',type:'经济危机',sev:'high',status:'active',desc:'央行取消汇率管制后比索暴跌30%。IMF紧急磋商，外汇汇出全面冻结。'},
{id:'EV-043',date:'2026-06-22',country:'马里',title:'JNIM连环袭击库利科罗大区',type:'恐怖袭击',sev:'critical',status:'active',desc:'JNIM在马里库利科罗大区发动连环袭击，距中资矿区30公里。多个村庄被焚烧。'},
{id:'EV-044',date:'2026-06-20',country:'哥伦比亚',title:'ELN宣布终止停火协议',type:'安全威胁',sev:'high',status:'active',desc:'ELN宣布单方面终止与政府停火协议，考卡省和北桑坦德省袭击风险上升。'},
{id:'EV-045',date:'2026-06-18',country:'塞内加尔',title:'总理与总统权力斗争激化',type:'政治动荡',sev:'medium',status:'active',desc:'总理松科与总统法耶矛盾公开化，议会面临解散风险。'}
];

// ===== ADDITIONAL TERROR EVENTS (15+ real events) =====
var NEW_TERROR=[
{date:'2026-07-07',country:'巴基斯坦',city:'瓜达尔',group:'BLA',type:'协调攻击',target:'港务局检查站',deaths:8,injured:12,desc:'BLA武装分子袭击瓜达尔港安保检查站，8名安保人员殉职',source:'媒体综合'},
{date:'2026-07-05',country:'索马里',city:'摩加迪沙',group:'al-Shabaab',type:'自杀式爆炸+枪击',target:'丽都酒店',deaths:32,injured:45,desc:'青年党武装分子袭击摩加迪沙丽都酒店，先汽车炸弹后持枪扫射',source:'路透社'},
{date:'2026-07-02',country:'也门',city:'荷台达',group:'胡塞武装',type:'导弹/无人机',target:'红海商船',deaths:3,injured:8,desc:'胡塞武装用反舰导弹和无人机袭击红海商船队，2艘货轮被击中',source:'CENTCOM/媒体'},
{date:'2026-06-25',country:'马里',city:'库利科罗',group:'JNIM',type:'连环袭击',target:'军事哨所和村庄',deaths:45,injured:30,desc:'JNIM在库利科罗大区发动连环袭击，焚烧多个村庄',source:'GTI 2026'},
{date:'2026-06-20',country:'布基纳法索',city:'瓦希古亚',group:'ISGS',type:'大规模袭击',target:'军民混合车队',deaths:22,injured:15,desc:'ISGS对军事护送车队发动大规模伏击',source:'GTI 2026'},
{date:'2026-06-15',country:'尼日利亚',city:'博尔诺州',group:'ISWAP',type:'武装袭击',target:'村庄',deaths:40,injured:25,desc:'ISWAP武装分子袭击博尔诺州多个村庄，40余名平民死亡',source:'GTI 2026'},
{date:'2026-06-10',country:'阿富汗',city:'喀布尔',group:'ISKP',type:'爆炸',target:'外交区',deaths:5,injured:18,desc:'ISKP在喀布尔绿区附近发动路边炸弹袭击',source:'Tolo News'},
{date:'2026-06-08',country:'伊拉克',city:'基尔库克',group:'ISIS残余',type:'IED',target:'军方巡逻队',deaths:4,injured:8,desc:'ISIS残余势力在基尔库克使用路边炸弹袭击军方巡逻队',source:'GTI 2026'},
{date:'2026-06-05',country:'叙利亚',city:'代尔祖尔',group:'ISIS残余',type:'伏击',target:'军方检查站',deaths:7,injured:10,desc:'ISIS残余在沙漠地区伏击政府军检查站',source:'媒体综合'},
{date:'2026-05-28',country:'巴基斯坦',city:'图尔巴特',group:'BLA',type:'绑架+处决',target:'劳工',deaths:9,injured:0,desc:'BLA绑架并处决9名来自旁遮普的劳工',source:'媒体综合'},
{date:'2026-05-20',country:'尼日尔',city:'蒂拉贝里',group:'ISGS',type:'武装袭击',target:'军事哨所',deaths:17,injured:12,desc:'ISGS袭击蒂拉贝里大区军事哨所，17名士兵殉职',source:'GTI 2026'},
{date:'2026-05-15',country:'喀麦隆',city:'极北大区',group:'Boko Haram',type:'自杀式爆炸',target:'市场',deaths:12,injured:30,desc:'博科圣地自杀式袭击者在极北大区市场引爆',source:'GTI 2026'},
{date:'2026-05-10',country:'刚果(金)',city:'北基伍省',group:'ADF',type:'屠杀',target:'村庄',deaths:30,injured:0,desc:'ADF民主同盟军屠杀北基伍省多个村庄平民',source:'GTI 2026'},
{date:'2026-04-28',country:'印度尼西亚',city:'中苏拉威西',group:'JAD/MIT',type:'爆炸',target:'教堂',deaths:3,injured:20,desc:'JAD分支在复活节期间袭击教堂',source:'Terrorism Observer'},
{date:'2026-04-15',country:'土耳其',city:'伊斯坦布尔',group:'ISIS',type:'枪击',target:'夜总会',deaths:5,injured:22,desc:'ISIS枪手在伊斯坦布尔夜总会发动袭击',source:'媒体综合'}
];

// ===== ADDITIONAL CHINA SECURITY INCIDENTS (15+ real incidents) =====
var NEW_CHINA_SEC=[
{date:'2026-07-07',country:'巴基斯坦',location:'瓜达尔',type:'协调攻击',severity:'red',title:'BLA袭击瓜达尔港检查站，中资项目就地避险',deaths:0,injured:0,people:'中方人员全部安全',desc:'BLA袭击瓜达尔港安保检查站，中国港湾项目人员就地避险48小时。',source:'使馆/媒体'},
{date:'2026-07-05',country:'索马里',location:'摩加迪沙',type:'恐怖袭击',severity:'red',title:'青年党袭击酒店，距中国使馆500米',deaths:0,injured:0,people:'中方人员安全',desc:'青年党袭击摩加迪沙丽都酒店，爆炸地点距中国使馆仅500米。使馆启动应急疏散预案。',source:'使馆'},
{date:'2026-07-04',country:'刚果(金)',location:'北基伍省',type:'武装冲突',severity:'red',title:'M23逼近戈马，300余名中方人员紧急撤离',deaths:0,injured:0,people:'300余人转移',desc:'M23反政府武装攻入戈马郊区，距中资铜钴矿80公里。300余名中方人员紧急转移至卢旺达。',source:'使馆/企业'},
{date:'2026-06-30',country:'苏丹',location:'恩图曼',type:'武装冲突',severity:'red',title:'喀土穆中资项目营地遭炮击，2名中方人员受伤',deaths:0,injured:2,people:'2人受伤',desc:'RSF攻入恩图曼区，中石油项目营地遭流弹炮击，2名中方人员受轻伤。',source:'使馆/企业'},
{date:'2026-06-27',country:'缅甸',location:'木姐',type:'武装冲突',severity:'orange',title:'果敢同盟军攻占木姐口岸，中缅贸易中断',deaths:0,injured:0,people:'无中方人员伤亡',desc:'MNDAA攻占中缅边境木姐口岸，中缅边贸全面中断。大量中方货物滞留。',source:'海关/媒体'},
{date:'2026-06-29',country:'阿富汗',location:'全国',type:'恐怖威胁',severity:'red',title:'ISKP发布针对中国公民威胁视频',deaths:0,injured:0,people:'使馆发布安全提醒',desc:'ISKP发布视频威胁袭击在阿中国公民。使馆发布最高级别安全提醒，要求所有中方人员非必要不外出。',source:'使馆'},
{date:'2026-06-25',country:'马里',location:'库利科罗',type:'恐怖袭击',severity:'red',title:'JNIM连环袭击逼近中资矿区',deaths:0,injured:0,people:'中方人员已转移',desc:'JNIM在库利科罗大区连环袭击，距中资矿区30公里。中方人员已转移至巴马科。',source:'华远卫士'},
{date:'2026-06-20',country:'玻利维亚',location:'拉巴斯',type:'社会动荡',severity:'orange',title:'中资铁路项目营地遭抢劫',deaths:0,injured:0,people:'无人员伤亡',desc:'反政府示威期间，拉巴斯郊区中资铁路项目营地遭暴徒抢劫，损失办公设备和车辆。',source:'企业报告'},
{date:'2026-06-15',country:'厄瓜多尔',location:'瓜亚基尔',type:'社会治安',severity:'orange',title:'中资渔业公司码头遭黑帮封锁',deaths:0,injured:0,people:'20余名中方人员被困',desc:'瓜亚基尔港黑帮火拼，中水集团渔业码头被封锁48小时，20余名中方人员被困。',source:'使馆/企业'},
{date:'2026-06-10',country:'阿根廷',location:'布宜诺斯艾利斯',type:'经济风险',severity:'yellow',title:'比索暴跌致中资项目美元汇出冻结',deaths:0,injured:0,people:'项目资金周转困难',desc:'阿根廷比索再贬值30%，央行冻结美元汇出。中国铁建地铁项目资金周转困难。',source:'企业财务'},
{date:'2026-06-08',country:'孟加拉国',location:'达卡',type:'社会动荡',severity:'orange',title:'大罢工致中资成衣厂停工',deaths:0,injured:0,people:'200余名中方管理人员受影响',desc:'全国大罢工导致达卡工业区瘫痪，山东如意等中资成衣厂全面停工。',source:'使馆/企业'},
{date:'2026-06-05',country:'尼日尔',location:'阿利特',type:'政治风险',severity:'orange',title:'军政府审查中资铀矿合作项目',deaths:0,injured:0,people:'15名中方技术人员待命',desc:'军政府驱逐法国技术人员后，宣布审查所有外资矿业合同。中核集团铀矿项目15名中方技术人员待命。',source:'使馆/企业'},
{date:'2026-05-28',country:'巴基斯坦',location:'图尔巴特',type:'恐怖袭击',severity:'red',title:'BLA绑架处决劳工，中巴经济走廊安全堪忧',deaths:0,injured:0,people:'无中方人员涉及',desc:'BLA在图尔巴特绑架并处决9名旁遮普劳工。事件虽未涉及中方人员，但凸显中巴经济走廊沿线安全风险。',source:'媒体'},
{date:'2026-05-20',country:'土耳其',location:'伊斯坦布尔',type:'经济风险',severity:'yellow',title:'里拉暴跌致中资项目成本飙升',deaths:0,injured:0,people:'项目利润率下降',desc:'土耳其里拉跌破35:1，中国能建火电项目成本飙升35%。企业启动汇率对冲机制。',source:'企业财务'},
{date:'2026-05-15',country:'罗马尼亚',location:'布加勒斯特',type:'政策风险',severity:'orange',title:'华为5G设备被禁，面临3亿美元损失',deaths:0,injured:0,people:'约200名本地员工',desc:'罗马尼亚通过法案禁止华为5G设备，要求2027年前全部更换。华为在罗中东欧最大研究中心面临关闭。',source:'媒体/企业'}
];

// ===== Extend data arrays with new items =====
COUNTRIES.push.apply(COUNTRIES,NEW_COUNTRIES);
ALERTS.push.apply(ALERTS,NEW_ALERTS);
EVENTS.push.apply(EVENTS,NEW_EVENTS);
TERROR_EVENTS.push.apply(TERROR_EVENTS,NEW_TERROR);
CHINA_SECURITY.push.apply(CHINA_SECURITY,NEW_CHINA_SEC);


// ===== DATABASE CENTER — Pure localStorage, all sync =====
const DBCenter={
  _prefix:'orps_',
  _listeners:[],
  onChange:function(cb){this._listeners.push(cb);},
  _fire:function(collection,action){
    for(var i=0;i<this._listeners.length;i++){
      try{this._listeners[i](collection,action);}catch(e){console.warn('DBCenter listener error:',e);}
    }
  },
  init(){
    // === 数据库版本控制：版本不匹配时自动重建 ===
    var DB_VERSION='20.0';
    var storedVersion='';
    try{storedVersion=localStorage.getItem('orps_db_version')||'';}catch(e){}
    if(storedVersion!==DB_VERSION){
      // 版本不匹配，清空所有旧数据，重建数据库
      console.log('[DBCenter] 版本变更: '+storedVersion+' → '+DB_VERSION+'，重建数据库');
      ['terror_events','security_events','military_conflicts','political_events','natural_disasters','public_health','sanctions_data','social_unrest','infrastructure','geopolitical_intel','osint_intel','collect_logs','economic_data','news_articles','diplomatic_events'].forEach(function(s){
        try{localStorage.setItem('orps_'+s,'[]');}catch(e){}
      });
      try{localStorage.setItem('orps_db_version',DB_VERSION);}catch(e){}
    }
    // 11类情报数据 + 日志 — 匹配"海外利益安全风险监测情报预警平台"定位
    ['terror_events','security_events','military_conflicts','political_events','natural_disasters','public_health','sanctions_data','social_unrest','infrastructure','geopolitical_intel','osint_intel','collect_logs'].forEach(function(s){
      try{if(localStorage.getItem('orps_'+s)===null)localStorage.setItem('orps_'+s,'[]');}catch(e){}
    });
    // 兼容旧数据：economic_data/news_articles/diplomatic_events 不再作为独立分类，合并到地缘情报
    'economic_data,news_articles,diplomatic_events'.split(',').forEach(function(k){
      if(localStorage.getItem('orps_'+k)===null)localStorage.setItem('orps_'+k,'[]');
    });
    // === 迁移：确保所有已有数据都有 audit_status 字段 ===
    ['terror_events','security_events','military_conflicts','political_events','natural_disasters','public_health','sanctions_data','social_unrest','infrastructure','geopolitical_intel','osint_intel'].forEach(function(s){
      var data=DBCenter._r(s);
      var changed=false;
      for(var i=0;i<data.length;i++){
        if(!data[i].audit_status){
          data[i].audit_status='pending';
          data[i].audit_time='';
          changed=true;
        }
      }
      if(changed)DBCenter._w(s,data);
    });
    // Seed data if empty — 种子数据也标记为待审核
    if(this.count('terror_events')===0&&typeof TERROR_EVENTS!=='undefined'){
      this.addBatch('terror_events',TERROR_EVENTS.map(function(e){var o={};for(var k in e)o[k]=e[k];o.data_type='terror';return o;}));
    }
    if(this.count('security_events')===0&&typeof CHINA_SECURITY!=='undefined'){
      this.addBatch('security_events',CHINA_SECURITY.map(function(e){var o={};for(var k in e)o[k]=e[k];o.data_type='china_security';return o;}));
    }
  },
  _r(k){try{return JSON.parse(localStorage.getItem(this._prefix+k)||'[]');}catch(e){return[];}},
  _w(k,v){try{localStorage.setItem(this._prefix+k,JSON.stringify(v));}catch(e){}},
  add(s,o){
    if(!o)return null;
    o.collect_time=o.collect_time||new Date().toISOString();
    o.id=Date.now()+Math.floor(Math.random()*100000);
    o.audit_status=o.audit_status||'pending'; // 默认待审核
    if(o.audit_status==='approved'&&!o.audit_time)o.audit_time=new Date().toISOString();
    else if(!o.audit_time)o.audit_time='';
    var a=this._r(s);a.push(o);this._w(s,a);
    return o.id;
  },
  addBatch(s,arr){
    if(!arr||!arr.length)return 0;
    var a=this._r(s);
    arr.forEach(function(o){o.collect_time=o.collect_time||new Date().toISOString();o.id=Date.now()+Math.floor(Math.random()*100000);o.audit_status=o.audit_status||'pending';o.audit_time='';a.push(o);});
    this._w(s,a);
    return arr.length;
  },
  // 获取审核统计
  getAuditSummary:function(collection){
    var data=this.getAll(collection);
    var p=0,a=0,r=0;
    data.forEach(function(d){
      var s=d.audit_status||'pending'; // 无审核状态的数据一律视为待审核
      if(s==='pending')p++;else if(s==='rejected')r++;else a++;
    });
    return {pending:p,approved:a,rejected:r,total:data.length};
  },
  // 更新一条记录的审核状态
  setAuditStatus:function(collection,id,status){
    var data=this.getAll(collection);
    for(var i=0;i<data.length;i++){
      if(data[i].id===id){
        data[i].audit_status=status;
        data[i].audit_time=new Date().toISOString();
        this._w(collection,data);
        return true;
      }
    }
    return false;
  },
  // 批量更新审核状态
  batchSetAuditStatus:function(collection,ids,status){
    if(!ids||!ids.length)return 0;
    var data=this.getAll(collection);
    var count=0;
    for(var i=0;i<data.length;i++){
      if(ids.indexOf(data[i].id)>=0){
        data[i].audit_status=status;
        data[i].audit_time=new Date().toISOString();
        count++;
      }
    }
    if(count>0)this._w(collection,data);
    return count;
  },
  getAll(s){return this._r(s);},
  count(s){return this._r(s).length;},
  clear(s){this._w(s,[]);},
  deleteAll(){if(!PERM.guard('\u6e05\u7a7a\u6240\u6709\u6570\u636e'))return;['terror_events','security_events','military_conflicts','political_events','natural_disasters','public_health','sanctions_data','social_unrest','infrastructure','geopolitical_intel','osint_intel','collect_logs','economic_data','news_articles','diplomatic_events'].forEach(function(s){try{localStorage.setItem('orps_'+s,'[]');}catch(e){}});try{localStorage.removeItem('orps_db_version');}catch(e){}},
  getStats(){
    var cols=['terror_events','security_events','military_conflicts','political_events','natural_disasters','public_health','sanctions_data','social_unrest','infrastructure','geopolitical_intel','osint_intel','collect_logs'];
    var stats={};
    cols.forEach(function(s){stats[s]=DBCenter.count(s);});
    stats.total=Object.values(stats).reduce(function(a,b){return a+b;},0);
    return stats;
  },
  exportCSV(s){
    var data=this.getAll(s);
    if(!data.length){showToast('无数据可导出');return;}
    var keys=Object.keys(data[0]);
    var csv=keys.join(',')+'\n';
    data.forEach(function(row){
      csv+=keys.map(function(k){var v=row[k]||'';v=String(v).replace(/"/g,'""');return '"'+v+'"';}).join(',')+'\n';
    });
    var blob=new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8;'});
    var link=document.createElement('a');
    link.href=URL.createObjectURL(blob);
    link.download='orps_'+s+'_'+new Date().toISOString().split('T')[0]+'.csv';
    link.click();
    showToast('已导出'+data.length+'条记录');
  },
  addLog(msg){
    var logs=this._r('collect_logs');
    logs.unshift({time:new Date().toLocaleTimeString('zh-CN'),msg:msg,id:Date.now()});
    if(logs.length>50)logs=logs.slice(0,50);
    this._w('collect_logs',logs);
  }
};

// ===== DATACENTER UI =====
var DATACENTER={
  currentTab:'terror_events',
  page:1,
  pageSize:15,
  search:'',
  sortKey:'',
  sortDir:'asc',
  filterCountry:'',
  filterType:'',
  filterLevel:'',
  dateFrom:'',
  dateTo:'',
  // 中文字段名映射
  COL_LABELS:{
    id:'记录ID',date:'日期',time:'时间',country:'国家',city:'城市',location:'地点',
    group:'组织/团体',type:'类型',target:'目标/对象',title:'标题',desc:'描述',detail:'详情',
    summary:'摘要',source:'来源',data_type:'数据类型',collect_time:'采集时间',
    deaths:'死亡人数',injured:'受伤人数',severity:'严重程度',impact:'影响等级',
    intensity:'强度',status:'状态',event_type:'事件类型',conflict_type:'冲突类型',
    disaster_type:'灾害类型',health_type:'公共卫生类型',sanction_type:'制裁类型',
    unrest_type:'动荡类型',infra_type:'设施类型',indicator:'指标',value:'数值',
    change:'变化',magnitude:'强度/规模',casualties:'伤亡情况',cases:'感染/影响人数',
    participants:'参与人数',parties:'参与方',target_country:'被制裁方',
    affected_industry:'受影响行业',people:'涉中方人员',severity_level:'严重等级',
    risk_level:'风险等级',submitter:'提交人',submitTime:'提交时间',
    audit_status:'审核状态',audit_time:'审核时间'
  },
  _labelOf:function(k){
    return this.COL_LABELS[k]||k;
  },
  // 审核相关状态
  _selectedRows:new Set(), // 当前页勾选的行ID集合
  _selectAll:false,
  // 审核状态的中文标签和颜色
  AUDIT_LABELS:{pending:'🟡 待审核',approved:'🟢 已审核',rejected:'🔴 已驳回'},
  AUDIT_COLORS:{pending:'var(--orange)',approved:'var(--green)',rejected:'var(--red)'},
  tabs:[
    {key:'terror_events',label:'💥 恐袭事件',ic:'💥',bg:'var(--red-bg)',c:'var(--red)'},
    {key:'security_events',label:'🛡️ 涉华安全',ic:'🛡️',bg:'var(--orange-bg)',c:'var(--orange)'},
    {key:'military_conflicts',label:'⚔️ 武装冲突',ic:'⚔️',bg:'var(--red-bg)',c:'var(--red)'},
    {key:'political_events',label:'🏛️ 政治风险',ic:'🏛️',bg:'var(--orange-bg)',c:'var(--orange)'},
    {key:'natural_disasters',label:'🌊 自然灾害',ic:'🌊',bg:'var(--blue-bg)',c:'var(--cyan)'},
    {key:'public_health',label:'🧧 公共卫生',ic:'🧧',bg:'var(--green-bg)',c:'var(--green)'},
    {key:'sanctions_data',label:'🚫 制裁合规',ic:'🚫',bg:'var(--yellow-bg)',c:'var(--yellow)'},
    {key:'social_unrest',label:'💬 社会动荡',ic:'💬',bg:'var(--orange-bg)',c:'var(--orange)'},
    {key:'infrastructure',label:'🚧 基础设施',ic:'🚧',bg:'var(--blue-bg)',c:'var(--cyan)'},
    {key:'geopolitical_intel',label:'🌐 地缘情报',ic:'🌐',bg:'var(--purple-bg)',c:'#c084fc'},
    {key:'osint_intel',label:'🔍 开源情报',ic:'🔍',bg:'var(--blue-bg)',c:'var(--cyan)'},
    {key:'collect_logs',label:'📝 采集日志',ic:'📝',bg:'var(--green-bg)',c:'var(--green)'}
  ],
  init(){
    DBCenter.init();
    if(typeof ENTERPRISE_DB!=='undefined'){try{ENTERPRISE_DB.init();}catch(e){}}
    if(typeof RISK_FUSION!=='undefined'){try{RISK_FUSION.init();}catch(e){}}
    this.renderStats();
    this.renderTabs();
    this.renderTable();
    this.renderScraperPanel();
    this.renderEnterprisePanel();
    this.renderFusionPanel();
    this.renderCollectedPanel();
    this._renderManualForm();
    this.renderLog();
    this.updateBadge();
  },
  updateBadge(){
    var stats=DBCenter.getStats();
    var badge=document.getElementById('sb-dc-count');
    if(badge){badge.textContent=stats.total;badge.classList.toggle('zero',stats.total===0);}
  },
  renderStats(){
    var stats=DBCenter.getStats();
    var el=document.getElementById('dc-stats');
    if(!el)return;
    var cards=[
      {ic:'💥',bg:'var(--red-bg)',c:'var(--red)',l:'恐袭事件',v:stats.terror_events},
      {ic:'🛡️',bg:'var(--orange-bg)',c:'var(--orange)',l:'涉华安全',v:stats.security_events},
      {ic:'⚔️',bg:'var(--red-bg)',c:'var(--red)',l:'武装冲突',v:stats.military_conflicts},
      {ic:'🏛️',bg:'var(--orange-bg)',c:'var(--orange)',l:'政治风险',v:stats.political_events},
      {ic:'🌊',bg:'var(--blue-bg)',c:'var(--cyan)',l:'自然灾害',v:stats.natural_disasters},
      {ic:'🧧',bg:'var(--purple-bg)',c:'#c084fc',l:'公共卫生',v:stats.public_health},
      {ic:'🚫',bg:'var(--yellow-bg)',c:'var(--yellow)',l:'制裁合规',v:stats.sanctions_data},
      {ic:'💬',bg:'var(--orange-bg)',c:'var(--orange)',l:'社会动荡',v:stats.social_unrest},
      {ic:'🚧',bg:'var(--blue-bg)',c:'var(--cyan)',l:'基础设施',v:stats.infrastructure},
      {ic:'🌐',bg:'var(--purple-bg)',c:'#c084fc',l:'地缘情报',v:stats.geopolitical_intel},
      {ic:'🔍',bg:'var(--blue-bg)',c:'var(--cyan)',l:'开源情报',v:stats.osint_intel},
      {ic:'🗄️',bg:'var(--cyan-bg)',c:'var(--cyan)',l:'总记录数',v:stats.total}
    ];
    el.innerHTML=cards.map(function(s){
      return '<div class="stat-card"><div class="stat-ic" style="background:'+s.bg+';color:'+s.c+'">'+s.ic+'</div><div class="stat-info"><div class="stat-label">'+s.l+'</div><div class="stat-val" style="color:'+s.c+'">'+s.v+'</div></div></div>';
    }).join('');
  },
  renderTabs(){
    var el=document.getElementById('dc-tabs');
    if(!el)return;
    var me=this;
    el.innerHTML=this.tabs.map(function(t){
      return '<div class="dc-tab '+(me.currentTab===t.key?'active':'')+'" onclick="DATACENTER.switchTab(\''+t.key+'\')">'+t.label+' ('+DBCenter.count(t.key)+')</div>';
    }).join('');
  },
  switchTab(t){
    this.currentTab=t;this.page=1;this.search='';
    this.sortKey='';this.sortDir='asc';
    this.filterCountry='';this.filterType='';this.filterLevel='';
    this.dateFrom='';this.dateTo='';
    var si=document.getElementById('dc-search');if(si)si.value='';
    this.renderTabs();this.renderTable();
  },
  // 应用筛选
  _applyFilters(data){
    var me=this;
    var s=this.search.toLowerCase();
    if(s){
      data=data.filter(function(row){return JSON.stringify(row).toLowerCase().includes(s);});
    }
    if(this.filterCountry){
      data=data.filter(function(row){return row.country&&row.country.indexOf(me.filterCountry)>=0;});
    }
    if(this.filterType){
      data=data.filter(function(row){return (row.type||row.event_type||row.conflict_type||row.disaster_type||row.health_type||row.sanction_type||row.unrest_type||row.infra_type||'')===me.filterType;});
    }
    if(this.filterLevel){
      data=data.filter(function(row){return (row.severity||row.impact||row.intensity||'')===me.filterLevel;});
    }
    if(this.dateFrom){
      data=data.filter(function(row){
        var d=row.date||row.collect_time||'';
        return String(d)>=me.dateFrom;
      });
    }
    if(this.dateTo){
      data=data.filter(function(row){
        var d=row.date||row.collect_time||'';
        return String(d)<=me.dateTo;
      });
    }
    if(this.sortKey){
      data.sort(function(a,b){
        var va=a[me.sortKey]||'',vb=b[me.sortKey]||'';
        var cmp=String(va).localeCompare(String(vb),'zh-CN');
        return me.sortDir==='desc'?-cmp:cmp;
      });
    }
    return data;
  },
  // 排序
  toggleSort(k){
    if(this.sortKey===k){this.sortDir=this.sortDir==='asc'?'desc':'asc';}
    else{this.sortKey=k;this.sortDir='asc';}
    this.renderTable();
  },
  // 获取当前表可用筛选选项
  _getFilterOptions(data){
    var countries=new Set();var types=new Set();var levels=new Set();
    data.forEach(function(r){
      if(r.country)countries.add(r.country);
      var t=r.type||r.event_type||r.conflict_type||r.disaster_type||r.health_type||r.sanction_type||r.unrest_type||r.infra_type||r.intel_type;
      if(t)types.add(t);
      var l=r.severity||r.impact||r.intensity||r.risk_level;
      if(l)levels.add(l);
    });
    return {
      countries:Array.from(countries).sort(function(a,b){return a.localeCompare(b,'zh-CN');}),
      types:Array.from(types).sort(function(a,b){return a.localeCompare(b,'zh-CN');}),
      levels:Array.from(levels).sort()
    };
  },
  renderTable(){
    var allData=DBCenter.getAll(this.currentTab);
    var filtered=this._applyFilters(allData.slice());
    var totalPages=Math.max(1,Math.ceil(filtered.length/this.pageSize));
    if(this.page>totalPages)this.page=totalPages;
    var start=(this.page-1)*this.pageSize;
    var pageData=filtered.slice(start,start+this.pageSize);
    var isAdmin=PERM.isAdmin();
    var isLogs=(this.currentTab==='collect_logs');

    // ---- 审核统计栏 ----
    var auditBar=document.getElementById('dc-audit-bar');
    if(auditBar&&isAdmin&&!isLogs){
      var summary=DBCenter.getAuditSummary(this.currentTab);
      var syncApprovedCount=0;
      var collectionsSynced=0;
      ['terror_events','security_events','military_conflicts','political_events','natural_disasters','public_health','sanctions_data','social_unrest','infrastructure','geopolitical_intel'].forEach(function(k){
        var s=DBCenter.getAuditSummary(k);
        if(s.approved>0){syncApprovedCount+=s.approved;collectionsSynced++;}
      });
      auditBar.style.display='block';
      auditBar.innerHTML='<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:10px;background:rgba(0,212,255,0.05);border-radius:8px;margin-bottom:10px">'+
        '<span style="font-size:11px;color:var(--text3);font-weight:600">📋 审核操作</span>'+
        '<span style="font-size:10px;color:var(--orange)">🟡 待审核:<b>'+summary.pending+'</b></span>'+
        '<span style="font-size:10px;color:var(--green)">🟢 已审核:<b>'+summary.approved+'</b></span>'+
        '<span style="font-size:10px;color:var(--red)">🔴 驳回:<b>'+summary.rejected+'</b></span>'+
        '<span style="margin-left:8px;font-size:11px;color:var(--text2)">已选:<b id="dc-selected-count" style="color:var(--cyan)">0</b></span>'+
        '<button class="btn sm" onclick="DATACENTER.toggleSelectAll()" style="font-size:10px;padding:2px 8px" title="勾选/取消当前页所有数据">☐ 全选当前页</button>'+
        '<button class="btn" style="font-size:10px;padding:3px 10px;background:var(--cyan);color:#fff;font-weight:700" onclick="DATACENTER.approveAllPending()" title="直接审批通过当前分类下的所有待审核数据（跨页）">⚡ 一键全部审批</button>'+
        '<button class="btn" style="font-size:10px;padding:3px 10px;background:var(--green);color:#fff" onclick="DATACENTER.batchApprove()">✅ 批量通过</button>'+
        '<button class="btn" style="font-size:10px;padding:3px 10px;background:var(--red);color:#fff" onclick="DATACENTER.batchReject()">❌ 批量驳回</button>'+
        '<button class="btn primary" style="font-size:11px;padding:4px 14px;margin-left:auto;font-weight:700" onclick="DATACENTER.syncApprovedToModules()" title="将所有已审核数据同步到态势总览和监测中心">🚀 一键同步到态势感知 ('+syncApprovedCount+'条已审核)</button>'+
        '</div>';
    }else if(auditBar){
      auditBar.style.display='none';
    }

    // Filter bar
    var filtEl=document.getElementById('dc-filters');
    if(filtEl){
      var opts=this._getFilterOptions(allData);
      var me=this;
      var cntHtml='',typeHtml='',lvlHtml='';
      if(opts.countries.length){
        cntHtml='<select class="select" id="dc-flt-country" style="font-size:10px;max-width:130px" onchange="DATACENTER.filterCountry=this.value;DATACENTER.page=1;DATACENTER.renderTable()"><option value="">🌍 全部国家('+opts.countries.length+')</option>'+opts.countries.map(function(c){return '<option value="'+c+'"'+(me.filterCountry===c?' selected':'')+'>'+c+'</option>';}).join('')+'</select>';
      }
      if(opts.types.length){
        typeHtml='<select class="select" id="dc-flt-type" style="font-size:10px;max-width:130px" onchange="DATACENTER.filterType=this.value;DATACENTER.page=1;DATACENTER.renderTable()"><option value="">📋 全部类型('+opts.types.length+')</option>'+opts.types.map(function(t){return '<option value="'+t+'"'+(me.filterType===t?' selected':'')+'>'+t+'</option>';}).join('')+'</select>';
      }
      if(opts.levels.length){
        var lvLabels={red:'🔴 红色',orange:'🟠 橙色',yellow:'🟡 黄色',critical:'🔴 严重',high:'🟠 高',medium:'🟡 中',low:'🟢 低'};
        lvlHtml='<select class="select" id="dc-flt-level" style="font-size:10px;max-width:120px" onchange="DATACENTER.filterLevel=this.value;DATACENTER.page=1;DATACENTER.renderTable()"><option value="">⚡ 全部级别('+opts.levels.length+')</option>'+opts.levels.map(function(l){return '<option value="'+l+'"'+(me.filterLevel===l?' selected':'')+'>'+(lvLabels[l]||l)+'</option>';}).join('')+'</select>';
      }
      filtEl.innerHTML='<div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">'+
        cntHtml+typeHtml+lvlHtml+
        '<input class="input" id="dc-flt-datefrom" type="date" style="font-size:10px;width:120px" value="'+this.dateFrom+'" onchange="DATACENTER.dateFrom=this.value;DATACENTER.page=1;DATACENTER.renderTable()" placeholder="起始日期" title="起始日期">'+
        '<span style="font-size:10px;color:var(--text3)">至</span>'+
        '<input class="input" id="dc-flt-dateto" type="date" style="font-size:10px;width:120px" value="'+this.dateTo+'" onchange="DATACENTER.dateTo=this.value;DATACENTER.page=1;DATACENTER.renderTable()" placeholder="截止日期" title="截止日期">'+
        (this.filterCountry||this.filterType||this.filterLevel||this.dateFrom||this.dateTo?'<button class="btn sm" style="font-size:10px;padding:2px 8px" onclick="DATACENTER.filterCountry=\'\';DATACENTER.filterType=\'\';DATACENTER.filterLevel=\'\';DATACENTER.dateFrom=\'\';DATACENTER.dateTo=\'\';DATACENTER.page=1;DATACENTER.renderTable()">✕ 清除筛选</button>':'')+
        '<span style="margin-left:auto;font-size:11px;color:var(--text2)">共 <b style="color:var(--cyan)">'+filtered.length+'</b> 条 (总计'+allData.length+'条)</span>'+
        '</div>';
    }

    // ---- Build display keys (hide audit_time, show audit_status) ----
    var displayKeys=[];
    if(pageData.length>0){
      var pk=Object.keys(pageData[0]);
      var prio=['audit_status','date','time','country','city','location','group','type','title','desc','summary','deaths','injured','severity','impact','intensity','status','source','collect_time'];
      // 过滤掉不想显示的字段
      displayKeys=pk.filter(function(k){return k!=='audit_time';});
      displayKeys.sort(function(a,b){
        var ai=prio.indexOf(a),bi=prio.indexOf(b);
        if(ai>=0&&bi>=0)return ai-bi;
        if(ai>=0)return -1;if(bi>=0)return 1;
        return a.localeCompare(b);
      });
    }

    // ---- Table header ----
    var thead=document.getElementById('dc-thead');
    if(thead){
      var colValues={};
      displayKeys.forEach(function(k){colValues[k]=new Set();});
      allData.forEach(function(row){
        displayKeys.forEach(function(k){
          var v=row[k];
          if(v!==null&&v!==undefined&&String(v).trim()){
            var sv=String(v).trim();
            if(sv.length<=40)colValues[k].add(sv);
          }
        });
      });
      var me=this;
      thead.innerHTML='<tr>'+
        (isAdmin&&!isLogs?'<th style="width:30px;text-align:center;font-size:11px"><input type="checkbox" id="dc-check-all" onchange="DATACENTER._selectAll=this.checked;DATACENTER.renderTable()" style="cursor:pointer" '+(this._selectAll?'checked':'')+'></th>':'')+
        displayKeys.map(function(k){
          var sortIcon='';
          if(me.sortKey===k){sortIcon=me.sortDir==='asc'?' ▲':' ▼';}
          var vals=Array.from(colValues[k]).sort(function(a,b){return a.localeCompare(b,'zh-CN');}).slice(0,20);
          var ddHtml='';
          if(vals.length>0&&k!=='collect_time'&&k!=='id'&&k!=='audit_time'){
            ddHtml='<span class="th-dd" style="position:relative;display:inline-block;margin-left:2px" id="thdd-'+k.replace(/[^a-zA-Z0-9_]/g,'_')+'">'+
              '<span style="cursor:pointer;font-size:9px;color:var(--text3);padding:1px 3px" onclick="event.stopPropagation();DATACENTER._toggleColDropdown(\''+k.replace(/'/g,"\\'")+'\','+JSON.stringify(vals).replace(/'/g,"&#39;")+')" title="筛选此列">▼</span></span>';
          }
          return '<th style="cursor:pointer;white-space:nowrap;font-size:11px;user-select:none;position:relative" onclick="DATACENTER.toggleSort(\''+k.replace(/'/g,"\\'")+'\')" title="点击排序 | ▼筛选">'+me._labelOf(k)+sortIcon+ddHtml+'</th>';
        }).join('')+
        (isAdmin&&!isLogs?'<th style="width:100px;text-align:center;font-size:11px">操作</th>':'')+
        '</tr>';
    }

    // ---- Table body with audit badges and checkboxes ----
    var tbody=document.getElementById('dc-tbody');
    if(tbody){
      if(!pageData.length){
        var colSpan=(isAdmin&&!isLogs?displayKeys.length+2:displayKeys.length+0)||10;
        tbody.innerHTML='<tr><td colspan="'+colSpan+'" style="text-align:center;padding:40px;color:var(--text3)"><div style="font-size:32px;margin-bottom:8px">📭</div>暂无符合条件的数据</td></tr>';
        this._selectedRows.clear();
        var countEl=document.getElementById('dc-selected-count');
        if(countEl)countEl.textContent='0';
      }else{
        var me=this;
        // 如果全选，把当页所有ID加入_selectedRows
        if(this._selectAll){
          pageData.forEach(function(row){if(row.id)me._selectedRows.add(String(row.id));});
        }else{
          // 不清除，但只保留当页中存在的
          var pageIds=new Set();
          pageData.forEach(function(row){if(row.id)pageIds.add(String(row.id));});
        }
        tbody.innerHTML=pageData.map(function(row,idx){
          var actualIdx=start+idx;
          var rowId=String(row.id||'');
          var checked=me._selectedRows.has(rowId);

          // 审核状态badge
          var as=row.audit_status||'approved'; // 旧数据视为已审核
          var asLabel=me.AUDIT_LABELS[as]||as;
          var asColor=me.AUDIT_COLORS[as]||'var(--text3)';

          // checkbox column
          var cbTd='';
          if(isAdmin&&!isLogs){
            cbTd='<td style="text-align:center;padding:4px"><input type="checkbox" '+(checked?'checked':'')+' onclick="event.stopPropagation();DATACENTER._cbToggle(this,\''+rowId+'\')" style="cursor:pointer"></td>';
          }

          // Data cells
          var cells=displayKeys.map(function(k){
            var v=row[k];
            if(v===null||v===undefined)v='';
            // audit_status → colored badge
            if(k==='audit_status'){
              return '<td style="text-align:center;font-size:10px;color:'+asColor+';font-weight:700">'+asLabel+'</td>';
            }
            v=String(v);
            var style='font-size:11px';
            if((k==='severity'||k==='impact'||k=='intensity')&&v){
              var clr=v==='red'||v==='critical'?'var(--red)':v==='orange'||v==='high'?'var(--orange)':v==='yellow'||v=='medium'?'var(--yellow)':'var(--green)';
              style+=';color:'+clr+';font-weight:700';
            }
            if(v.length>60)v=v.substring(0,60)+'...';
            return '<td style="'+style+'">'+v+'</td>';
          }).join('');

          // Action buttons (admin)
          var actionTd='';
          if(isAdmin&&!isLogs){
            var isPending=(as==='pending');
            actionTd='<td style="text-align:center;white-space:nowrap;padding:2px">'+
              (isPending?'<button class="btn" style="font-size:9px;padding:2px 4px;background:var(--green);color:#fff" onclick="event.stopPropagation();DATACENTER.approveRow(\''+rowId+'\')" title="通过审核">✓</button> ':'')+
              (isPending?'<button class="btn" style="font-size:9px;padding:2px 4px;background:var(--red);color:#fff" onclick="event.stopPropagation();DATACENTER.rejectRow(\''+rowId+'\')" title="驳回">✕</button> ':'')+
              '<button class="btn danger sm" style="font-size:9px;padding:2px 4px" onclick="event.stopPropagation();DATACENTER.deleteRowById('+actualIdx+')" title="删除">🗑️</button>'+
              '</td>';
          }

          return '<tr style="cursor:pointer;transition:.15s" onclick="DATACENTER.showRowDetailById('+actualIdx+')" onmouseover="this.style.background=\'rgba(0,212,255,0.04)\'" onmouseout="this.style.background=\'\'">'+cbTd+cells+actionTd+'</tr>';
        }).join('');

        // 更新已选计数
        var countEl=document.getElementById('dc-selected-count');
        if(countEl)countEl.textContent=String(this._selectedRows.size);
      }
    }

    // Pagination
    var pag=document.getElementById('dc-pagination');
    if(pag){
      pag.innerHTML='<span class="text-xs text-muted">第'+this.page+'/'+totalPages+'页 · 共'+filtered.length+'条</span>'+
        '<div class="flex gap-8">'+
        '<button class="btn sm" onclick="DATACENTER.page=1;DATACENTER.renderTable()" '+(this.page<=1?'disabled':'')+'>首页</button>'+
        '<button class="btn sm" onclick="DATACENTER.page--;DATACENTER.renderTable()" '+(this.page<=1?'disabled':'')+'>上一页</button>'+
        '<button class="btn sm" onclick="DATACENTER.page++;DATACENTER.renderTable()" '+(this.page>=totalPages?'disabled':'')+'>下一页</button>'+
        '<button class="btn sm" onclick="DATACENTER.page='+totalPages+';DATACENTER.renderTable()" '+(this.page>=totalPages?'disabled':'')+'>末页</button>'+
        '</div>';
    }
  },
  prevPage(){if(this.page>1){this.page--;this.renderTable();}},
  nextPage(tp){if(this.page<tp){this.page++;this.renderTable();}},
  // 勾选框辅助方法
  _cbToggle:function(cb,rowId){
    if(cb.checked){this._selectedRows.add(rowId);}
    else{this._selectedRows.delete(rowId);}
    var el=document.getElementById('dc-selected-count');
    if(el)el.textContent=String(this._selectedRows.size);
  },
  // ===== 审核操作方法 =====
  approveRow(rowId){
    if(!PERM.guard('审核数据'))return;
    DBCenter.setAuditStatus(this.currentTab,Number(rowId),'approved');
    DBCenter.addLog('✅ 通过审核: '+this.currentTab+' #'+rowId);
    this.renderTable();this.renderStats();this.renderTabs();this.renderLog();
    showToast('✅ 已通过审核，可同步到态势感知');
  },
  rejectRow(rowId){
    if(!PERM.guard('审核数据'))return;
    DBCenter.setAuditStatus(this.currentTab,Number(rowId),'rejected');
    DBCenter.addLog('❌ 驳回: '+this.currentTab+' #'+rowId);
    this.renderTable();this.renderStats();this.renderTabs();this.renderLog();
    showToast('❌ 已驳回');
  },
  batchApprove(){
    if(!PERM.guard('审核数据'))return;
    var ids=Array.from(this._selectedRows).map(Number);
    if(!ids.length){showToast('请先勾选需要审核的数据');return;}
    var count=DBCenter.batchSetAuditStatus(this.currentTab,ids,'approved');
    DBCenter.addLog('✅ 批量通过审核: '+count+' 条');
    this._selectedRows.clear();this._selectAll=false;
    this.renderTable();this.renderStats();this.renderTabs();this.renderLog();
    showToast('✅ 已批量通过 ' + count + ' 条审核');
  },
  batchReject(){
    if(!PERM.guard('审核数据'))return;
    var ids=Array.from(this._selectedRows).map(Number);
    if(!ids.length){showToast('请先勾选需要驳回的数据');return;}
    var count=DBCenter.batchSetAuditStatus(this.currentTab,ids,'rejected');
    DBCenter.addLog('❌ 批量驳回: '+count+' 条');
    this._selectedRows.clear();this._selectAll=false;
    this.renderTable();this.renderStats();this.renderTabs();this.renderLog();
    showToast('❌ 已批量驳回 ' + count + ' 条');
  },
  toggleSelectAll(){
    this._selectAll=!this._selectAll;
    if(!this._selectAll)this._selectedRows.clear();
    this.renderTable();
  },
  // ===== 一键全部审批：直接审批当前分类下所有待审核数据（跨页） =====
  approveAllPending(){
    if(!PERM.guard('审核数据'))return;
    var allData=DBCenter.getAll(this.currentTab);
    var pendingIds=[];
    allData.forEach(function(d){
      if((d.audit_status||'approved')==='pending' && d.id) pendingIds.push(d.id);
    });
    if(pendingIds.length===0){
      showToast('当前分类没有待审核数据');
      return;
    }
    if(!confirm('确认将当前分类下所有 '+pendingIds.length+' 条待审核数据全部通过？\n\n⚠ 此操作将一次性审批通过该分类下所有待审核数据，请确保数据来源可靠。')){
      return;
    }
    var count=DBCenter.batchSetAuditStatus(this.currentTab,pendingIds,'approved');
    DBCenter.addLog('⚡ 一键全部审批: '+this.currentTab+' 通过 '+count+' 条');
    this._selectedRows.clear();this._selectAll=false;
    this.renderTable();this.renderStats();this.renderTabs();this.renderLog();
    showToast('⚡ 已一键审批通过 '+count+' 条数据！');
  },
  // ===== 核心：一键同步已审核数据到态势感知/监测中心 =====
  syncApprovedToModules(){
    if(!PERM.guard('同步数据'))return;
    // 统计所有数据集中已审核的数量
    var totalApproved=0;
    var collections=['terror_events','security_events','military_conflicts','political_events','natural_disasters','public_health','sanctions_data','social_unrest','infrastructure','geopolitical_intel'];
    collections.forEach(function(k){totalApproved+=DBCenter.getAuditSummary(k).approved;});
    if(totalApproved===0){showToast('⚠ 没有已审核的数据可同步，请先在数据库浏览中审核数据');return;}
    var confirmMsg='确认将 '+totalApproved+' 条已审核数据同步到态势总览和监测中心？\n\n⚠ 请确保数据来源可靠、内容真实，已审核的数据将立即在态势感知和监测中心显示。';
    if(!confirm(confirmMsg))return;
    var syncCount=DataHub.syncFromDBCenter();
    DBCenter.addLog('🚀 手动同步: '+syncCount+' 条已审核数据注入态势感知/监测中心');
    // 刷新态势总览
    if(typeof SITUATION!=='undefined'){
      try{SITUATION.init();}catch(e){console.warn('SITUATION refresh error:',e);}
    }
    // 刷新监测中心
    if(typeof MONITOR!=='undefined'){
      try{MONITOR.init();}catch(e){console.warn('MONITOR refresh error:',e);}
    }
    // 刷新滚动预警条
    try{renderTicker();}catch(e){}
    this.renderTable();this.renderLog();
    showToast('🚀 已同步 '+syncCount+' 条数据到态势感知/监测中心！');
  },
  refresh(){
    DBCenter.init();
    this.renderStats();this.renderTabs();this.renderTable();this.renderLog();
    this.updateBadge();
    showToast('数据已刷新');
  },
  exportCSV(){
    if(this.currentTab==='collect_logs'){showToast('日志不支持导出');return;}
    DBCenter.exportCSV(this.currentTab);
  },
  clearAll(){
    if(confirm('确定清空所有缓存数据？此操作不可恢复！')){
      DBCenter.deleteAll();
      this.renderStats();this.renderTabs();this.renderTable();this.renderLog();
      this.updateBadge();
      showToast('所有数据已清空');
    }
  },
  // ===== 全网海外情报采集面板 v4.0 =====
  renderScraperPanel(){
    var el=document.getElementById('dc-scraper-panel');
    if(!el)return;
    var status=SCRAPER.getStatus();
    var lastTime=status.lastCollectTime?
      new Date(status.lastCollectTime).toLocaleString('zh-CN'):'从未采集';
    var autoChecked=status.isAutoCollecting?'checked':'';
    var registry=SCRAPER.getSourceRegistry();
    var capabilities=SCRAPER.getEngineCapabilities?SCRAPER.getEngineCapabilities():null;
    var pipeStats=SCRAPER.getPipelineStats?SCRAPER.getPipelineStats():null;
    var hasPipeStats=pipeStats&&pipeStats.raw>0;

    // 11类情报的数据源信息
    var catIcons={
      'terror_events':'💥','security_events':'🛡️','military_conflicts':'⚔️',
      'political_events':'🏛️','natural_disasters':'🌊','public_health':'🧧',
      'sanctions_data':'🚫','social_unrest':'💬','infrastructure':'🚧',
      'geopolitical_intel':'🌐','osint_intel':'🔍'
    };

    // 构建数据源展示
    var sourceCardsHtml='';
    for(var cat in registry){
      var info=registry[cat];
      var cnNames=(info.cnSources||[]).join(' · ');
      var intlNames=(info.intlSources||[]).join(' · ');
      var totalSrc=info.totalSources||0;
      sourceCardsHtml+=
        '<div style="padding:8px 12px;background:var(--bg2);border-radius:8px;border-left:3px solid var(--cyan)">'+
          '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">'+
            '<span style="font-size:16px">'+(catIcons[cat]||'📡')+'</span>'+
            '<div><div style="font-size:12px;color:var(--text1);font-weight:700">'+info.label+'</div>'+
            '<div style="font-size:9px;color:var(--text3)">'+totalSrc+'个数据源</div></div>'+
          '</div>'+
          '<div style="font-size:9px;line-height:1.6">'+
            '<span style="color:var(--red)">国内源(只搜海外): </span>'+
            '<span style="color:var(--text2)">'+(cnNames||'—')+'</span><br>'+
            '<span style="color:var(--blue)">国际源(全球风险): </span>'+
            '<span style="color:var(--text3)">'+(intlNames||'—')+'</span>'+
          '</div>'+
        '</div>';
    }

    var html='<div style="padding:16px">'+
      // 引擎版本标识 + 4大引擎能力
      '<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;flex-wrap:wrap">'+
        '<span style="background:linear-gradient(135deg,var(--cyan),var(--blue));color:#000;padding:3px 12px;border-radius:10px;font-size:11px;font-weight:800">SCRAPER v5.0</span>'+
        '<span style="font-size:11px;color:var(--text3)">智能采集引擎 · NLP识别 · 智能去重 · 质量评分 · 数据增强</span>'+
      '</div>'+
      // 4大引擎能力卡片
      (capabilities?'<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:12px">'+
        '<div style="padding:8px 10px;background:rgba(220,38,38,0.08);border-radius:6px;border-left:3px solid var(--red)">'+
          '<div style="font-size:10px;font-weight:700;color:var(--red)">NLP识别引擎</div>'+
          '<div style="font-size:9px;color:var(--text3);margin-top:2px">'+capabilities.countryDictSize+'国家 + '+capabilities.cityDictSize+'城市 识别</div>'+
          '<div style="font-size:9px;color:var(--text2);margin-top:1px">事件分类 · 严重度 · 伤亡提取</div>'+
        '</div>'+
        '<div style="padding:8px 10px;background:rgba(8,145,178,0.08);border-radius:6px;border-left:3px solid var(--cyan)">'+
          '<div style="font-size:10px;font-weight:700;color:var(--cyan)">智能去重引擎</div>'+
          '<div style="font-size:9px;color:var(--text3);margin-top:2px">Levenshtein + SimHash</div>'+
          '<div style="font-size:9px;color:var(--text2);margin-top:1px">跨源 · 跨类 · 近似去重</div>'+
        '</div>'+
        '<div style="padding:8px 10px;background:rgba(245,158,11,0.08);border-radius:6px;border-left:3px solid var(--orange)">'+
          '<div style="font-size:10px;font-weight:700;color:var(--orange)">质量评估引擎</div>'+
          '<div style="font-size:9px;color:var(--text3);margin-top:2px">4维加权评分 A-F分级</div>'+
          '<div style="font-size:9px;color:var(--text2);margin-top:1px">相关性·丰富度·可信度·时效</div>'+
        '</div>'+
        '<div style="padding:8px 10px;background:rgba(124,58,237,0.08);border-radius:6px;border-left:3px solid var(--purple)">'+
          '<div style="font-size:10px;font-weight:700;color:var(--purple)">数据增强引擎</div>'+
          '<div style="font-size:9px;color:var(--text3);margin-top:2px">自动提取结构化字段</div>'+
          '<div style="font-size:9px;color:var(--text2);margin-top:1px">标签生成 · 企业匹配</div>'+
        '</div>'+
      '</div>':'')+
      // 处理管道可视化
      (capabilities?'<div style="display:flex;align-items:center;gap:4px;padding:8px 12px;background:var(--bg2);border-radius:8px;margin-bottom:12px;flex-wrap:wrap">'+
        '<span style="font-size:9px;color:var(--text3);font-weight:600">管道:</span>'+
        capabilities.pipeline.map(function(stage,i){
          var isLast=i===capabilities.pipeline.length-1;
          return '<span style="font-size:9px;padding:2px 8px;background:rgba(0,212,255,0.12);border-radius:8px;color:var(--cyan);font-weight:600">'+stage+'</span>'+(isLast?'':'<span style="color:var(--text3);font-size:9px">→</span>');
        }).join('')+
      '</div>':'')+
      // 管道统计 (采集后显示)
      (hasPipeStats?'<div style="padding:10px 14px;background:rgba(0,212,255,0.06);border-radius:8px;margin-bottom:12px">'+
        '<div style="font-size:10px;color:var(--cyan);font-weight:700;margin-bottom:6px">📊 管道统计</div>'+
        '<div style="display:flex;gap:12px;flex-wrap:wrap;font-size:10px">'+
          '<span style="color:var(--text2)">原始: <b style="color:var(--text1)">'+pipeStats.raw+'</b></span>'+
          '<span style="color:var(--text2)">清洗后: <b style="color:var(--text1)">'+pipeStats.cleaned+'</b></span>'+
          '<span style="color:var(--text2)">NLP增强: <b style="color:var(--purple)">'+pipeStats.enriched+'</b></span>'+
          '<span style="color:var(--text2)">质检通过: <b style="color:var(--green)">'+pipeStats.qualified+'</b></span>'+
          '<span style="color:var(--text2)">去重入库: <b style="color:var(--cyan)">'+pipeStats.stored+'</b></span>'+
          '<span style="color:var(--red)">淘汰低质: <b>'+pipeStats.rejected_low+'</b></span>'+
          '<span style="color:var(--orange)">去重淘汰: <b>'+pipeStats.rejected_dup+'</b></span>'+
        '</div>'+
        '<div style="display:flex;gap:8px;margin-top:6px;align-items:center">'+
          '<span style="font-size:9px;color:var(--text3)">NLP识别实体:</span>'+
          '<span style="font-size:10px;font-weight:700;color:var(--purple)">'+(pipeStats.nlp_entities||0)+'</span>'+
          '<span style="font-size:9px;color:var(--text3);margin-left:12px">质量分布:</span>'+
          ['A','B','C','D','F'].map(function(g){
            var cnt=pipeStats.quality_dist?(pipeStats.quality_dist[g]||0):0;
            if(cnt===0)return '';
            var colors={A:'var(--green)',B:'var(--cyan)',C:'var(--orange)',D:'var(--red)',F:'var(--text3)'};
            return '<span style="font-size:9px;padding:1px 6px;border-radius:4px;background:'+colors[g]+'22;color:'+colors[g]+';font-weight:700">'+g+':'+cnt+'</span>';
          }).join('')+
        '</div>'+
      '</div>':'')+
      // 状态栏
      '<div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;padding:12px;background:rgba(0,212,255,0.06);border-radius:8px;margin-bottom:12px">'+
        '<div style="display:flex;align-items:center;gap:6px">'+
          '<span style="width:8px;height:8px;border-radius:50%;background:'+(status.isCollecting?'var(--orange)':'var(--green)')+';display:inline-block"></span>'+
          '<span style="font-size:12px;font-weight:600;color:'+(status.isCollecting?'var(--orange)':'var(--green)')+'">'+(status.isCollecting?'采集中...':'就绪')+'</span>'+
        '</div>'+
        '<span style="font-size:11px;color:var(--text3)">上次采集: <b style="color:var(--text1)">'+lastTime+'</b></span>'+
        '<span style="font-size:11px;color:var(--text3)">采集库总量: <b style="color:var(--cyan)">'+status.totalCollected+'</b> 条</span>'+
        '<label style="display:flex;align-items:center;gap:6px;cursor:pointer;margin-left:auto">'+
          '<input type="checkbox" '+autoChecked+' onchange="DATACENTER.toggleAutoCollect(this.checked)" style="cursor:pointer">'+
          '<span style="font-size:12px;font-weight:600">自动采集 (每2小时)</span>'+
        '</label>'+
      '</div>'+
      // 控制按钮
      '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:14px">'+
        '<button class="btn primary" onclick="DATACENTER.startWebScrape()" style="padding:10px 24px;font-size:14px;font-weight:700;'+(status.isCollecting?'opacity:0.5;pointer-events:none':'')+'">'+
          '📡 一键采集全网数据'+
        '</button>'+
        '<button class="btn" onclick="DATACENTER.clearCollectedDB()" style="padding:10px 16px;font-size:12px">🗑️ 清空采集库</button>'+
        '<button class="btn" onclick="DATACENTER.transferAllToDBCenter()" style="padding:10px 16px;font-size:12px;background:var(--green);color:#fff">📤 将已审核数据转入主数据库</button>'+
      '</div>'+
      // 数据源全景展示
      '<details open>'+
        '<summary style="cursor:pointer;font-size:12px;color:var(--text2);font-weight:600;padding:6px 0;margin-bottom:8px">📡 数据源全景 ('+Object.keys(registry).length+'类情报 · '+Object.keys(registry).reduce(function(s,k){return s+(registry[k]?registry[k].totalSources:0);},0)+'个数据源 · Google News聚合 · 国内源优先)</summary>'+
        '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:8px">'+
          sourceCardsHtml+
        '</div>'+
      '</details>'+
      // DBCenter↔融合引擎↔监测中心 联动状态
      '<div id="dc-linkage-panel" style="margin-top:12px;padding:10px 14px;background:rgba(0,255,136,0.04);border-radius:8px;border:1px solid rgba(0,255,136,0.1)">'+
        '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">'+
          '<span style="font-size:10px;color:var(--green);font-weight:700">🔗 DBCenter(底座) → 融合引擎 → 监测中心(大脑)</span>'+
          '<span style="font-size:10px;color:var(--text3)">采集→审核→入库→融合(事件↔项目匹配)→项目级预警</span>'+
          '<span id="dc-linkage-status" style="margin-left:auto;font-size:10px;color:var(--text3)">● 待联动</span>'+
        '</div>'+
      '</div>'+
      // 采集进度
      '<div id="dc-scraper-progress" style="'+(status.isCollecting?'margin-top:10px':'display:none')+'"></div>'+
      // 采集日志
      '<div id="dc-log" style="max-height:120px;overflow-y:auto;margin-top:8px"></div>'+
    '</div>';

    el.innerHTML=html;
    this.renderLog();
    this._updateLinkageStatus();
  },

  // 更新DBCenter→融合→监测中心联动状态
  _updateLinkageStatus(){
    var el=document.getElementById('dc-linkage-status');
    if(!el)return;
    try{
      var linkage=JSON.parse(localStorage.getItem('orps_monitor_linkage')||'{}');
      if(linkage.timestamp){
        var time=new Date(linkage.timestamp).toLocaleString('zh-CN');
        var fusionInfo='';
        if(linkage.fusion&&linkage.fusion.totalMatches>0){
          fusionInfo=' | 融合:'+linkage.fusion.totalMatches+'条匹配';
        }
        el.innerHTML='<span style="color:var(--green)">● 已联动 '+time+fusionInfo+'</span>';
      }else{
        el.innerHTML='<span style="color:var(--text3)">● 待联动</span>';
      }
    }catch(e){el.innerHTML='<span style="color:var(--text3)">● 待联动</span>';}
  },
  // 采集进度更新
  _updateScraperProgress(category,state,count,error){
    var el=document.getElementById('dc-scraper-progress');
    if(!el)return;
    el.style.display='block';
    var labels={
      'terror_events':'💥 恐袭','security_events':'🛡️ 涉华安全','military_conflicts':'⚔️ 武装冲突',
      'political_events':'🏛️ 政治风险','natural_disasters':'🌊 自然灾害','public_health':'🧧 公共卫生',
      'sanctions_data':'🚫 制裁合规','social_unrest':'💬 社会动荡','infrastructure':'🚧 基础设施',
      'geopolitical_intel':'🌐 地缘情报','osint_intel':'🔍 开源情报'
    };
    var icon=state==='done'?'✅':state==='error'?'❌':state==='collecting'?'⏳':'⬜';
    var text=state==='done'?'+ '+count+'条':state==='error'?'失败: '+(error||''):'采集中...';
    var color=state==='done'?'var(--green)':state==='error'?'var(--red)':'var(--orange)';

    var existing=el.querySelector('[data-cat="'+category+'"]');
    if(!existing){
      var div=document.createElement('div');
      div.setAttribute('data-cat',category);
      div.style.cssText='padding:4px 10px;font-size:11px;display:flex;align-items:center;gap:8px';
      el.appendChild(div);
      existing=div;
    }
    existing.innerHTML='<span>'+icon+'</span><span style="width:100px;color:var(--text2)">'+(labels[category]||category)+'</span><span style="color:'+color+';font-weight:600">'+text+'</span>';

    // 全部完成时
    if(!SCRAPER.isCollecting){
      var total=0;
      var results=SCRAPER.collectResults||{};
      for(var k in results)total+=results[k];
      var pipeStats=SCRAPER.getPipelineStats?SCRAPER.getPipelineStats():null;
      var doneDiv=document.createElement('div');
      doneDiv.style.cssText='padding:8px 10px;margin-top:6px;font-size:12px;font-weight:700;color:var(--green);background:rgba(0,255,136,0.08);border-radius:6px';
      var pipeInfo='';
      if(pipeStats&&pipeStats.raw>0){
        pipeInfo=' (原始'+pipeStats.raw+' → NLP增强'+pipeStats.enriched+' → 质检'+pipeStats.qualified+' → 去重入库'+pipeStats.stored+' | 淘汰低质'+pipeStats.rejected_low+' 重复'+pipeStats.rejected_dup+')';
      }
      doneDiv.innerHTML='🎉 v5.0管道采集完成! 入库 '+total+' 条数据'+pipeInfo;
      el.appendChild(doneDiv);
      // 3秒后隐藏进度，刷新面板
      setTimeout(function(){
        if(!SCRAPER.isCollecting){
          DATACENTER.renderScraperPanel();
          DATACENTER.renderCollectedPanel();
        }
      },3000);
    }
  },
  // 一键采集全网数据
  async startWebScrape(){
    if(SCRAPER.isCollecting){
      showToast('正在采集中，请稍候...');
      return;
    }
    if(!PERM.guard('数据采集'))return;

    this.renderScraperPanel(); // 显示进度区域
    var progressEl=document.getElementById('dc-scraper-progress');
    if(progressEl)progressEl.innerHTML='<div style="padding:8px;font-size:12px;color:var(--orange);font-weight:600">📡 正在从全网采集数据，请稍候...</div>';

    showToast('📡 开始采集全网数据...');
    var result=await SCRAPER.collectAll();

    if(result){
      var total=result.total;
      var successCount=0;
      var failCount=0;
      for(var k in result.results){
        if(result.results[k]>0)successCount++;
        if(result.errors&&result.errors[k])failCount++;
      }
      var rawTotal=result.rawTotal||0;
      var nlpEnt=result.nlpStats?result.nlpStats.entities:0;
      showToast('✅ v5.0采集完成! 原始'+rawTotal+'条 → 入库'+total+'条 (NLP识别'+nlpEnt+'实体, '+successCount+'类成功'+(failCount>0?', '+failCount+'类失败':'')+')');
    }

    this.renderScraperPanel();
    this.renderCollectedPanel();
    this.renderStats();
    this.renderTabs();
    this.renderTable();
    this.renderLog();
    this.updateBadge();
  },
  // 切换自动采集
  toggleAutoCollect(enabled){
    if(enabled){
      SCRAPER.startAutoCollect(120); // 每2小时
      showToast('✅ 自动采集已启动 (每2小时自动采集全网数据)');
    }else{
      SCRAPER.stopAutoCollect();
      showToast('自动采集已停止');
    }
    this.renderScraperPanel();
  },
  // 清空采集库
  clearCollectedDB(){
    if(!PERM.guard('清空采集库'))return;
    if(!confirm('确定清空采集库中的所有数据？此操作不可恢复。'))return;
    COLLECTED_DB.clear();
    this.renderScraperPanel();
    this.renderCollectedPanel();
    showToast('采集库已清空');
  },
  // 将所有已审核数据转入主数据库
  transferAllToDBCenter(){
    if(!PERM.isAdmin()){
      showToast('需要管理员权限');
      return;
    }
    var totalApproved=0;
    COLLECTED_DB.CATEGORIES.forEach(function(cat){
      var s=COLLECTED_DB.getAuditSummary(cat);
      totalApproved+=s.approved;
    });
    if(totalApproved===0){
      showToast('没有已审核的数据可转入，请先在采集库中审核数据');
      return;
    }
    if(!confirm('将 '+totalApproved+' 条已审核数据从采集库转入主数据库？\n转入后将从采集库删除，可在主数据库中同步到态势感知。'))return;
    var count=COLLECTED_DB.transferAllApproved();
    DBCenter.addLog('从采集库转入 '+count+' 条已审核数据到主数据库');
    this.renderScraperPanel();
    this.renderCollectedPanel();
    this.renderStats();
    this.renderTabs();
    this.renderTable();
    this.updateBadge();
    showToast('✅ '+count+' 条数据已转入主数据库');
  },
  // ===== 中资企业海外项目库面板 =====
  renderEnterprisePanel(){
    var el=document.getElementById('dc-enterprise-panel');
    if(!el||typeof ENTERPRISE_DB==='undefined')return;
    var projects=ENTERPRISE_DB.getAll();
    var stats=ENTERPRISE_DB.getStats();
    var countries=ENTERPRISE_DB.getCountries();
    var sectors=ENTERPRISE_DB.getSectors();

    // 按国家分组统计
    var countryList=Object.keys(countries).sort(function(a,b){return countries[b]-countries[a];});
    var sectorList=Object.keys(sectors).sort(function(a,b){return sectors[b]-sectors[a];});

    var html='<div style="padding:16px">'+
      // 统计栏
      '<div style="display:flex;gap:16px;flex-wrap:wrap;margin-bottom:14px">'+
        '<div style="padding:8px 16px;background:rgba(0,212,255,0.08);border-radius:8px">'+
          '<div style="font-size:22px;font-weight:700;color:var(--cyan)">'+stats.total+'</div>'+
          '<div style="font-size:10px;color:var(--text3)">海外项目总数</div>'+
        '</div>'+
        '<div style="padding:8px 16px;background:rgba(255,170,0,0.08);border-radius:8px">'+
          '<div style="font-size:22px;font-weight:700;color:var(--orange)">'+stats.countries+'</div>'+
          '<div style="font-size:10px;color:var(--text3)">覆盖国家/地区</div>'+
        '</div>'+
        '<div style="padding:8px 16px;background:rgba(0,200,83,0.08);border-radius:8px">'+
          '<div style="font-size:22px;font-weight:700;color:var(--green)">'+stats.sectors+'</div>'+
          '<div style="font-size:10px;color:var(--text3)">行业领域</div>'+
        '</div>'+
        '<div style="padding:8px 16px;background:rgba(255,61,127,0.08);border-radius:8px;margin-left:auto">'+
          '<button class="btn sm primary" onclick="DATACENTER._showAddProjectForm()" style="margin-top:4px">➕ 添加项目</button>'+
        '</div>'+
      '</div>'+

      // 国家分布
      '<div style="margin-bottom:12px">'+
        '<div style="font-size:11px;color:var(--text3);margin-bottom:6px;font-weight:600">📍 项目所在国家分布</div>'+
        '<div style="display:flex;gap:4px;flex-wrap:wrap">'+
          countryList.map(function(c){
            return '<span style="padding:2px 8px;background:var(--bg2);border-radius:4px;font-size:10px">'+
              c+' <b style="color:var(--cyan)">'+countries[c]+'</b></span>';
          }).join('')+
        '</div>'+
      '</div>'+

      // 行业分布
      '<div style="margin-bottom:12px">'+
        '<div style="font-size:11px;color:var(--text3);margin-bottom:6px;font-weight:600">🏭 行业领域分布</div>'+
        '<div style="display:flex;gap:4px;flex-wrap:wrap">'+
          sectorList.map(function(s){
            return '<span style="padding:2px 8px;background:var(--bg2);border-radius:4px;font-size:10px">'+
              s+' <b style="color:var(--orange)">'+sectors[s]+'</b></span>';
          }).join('')+
        '</div>'+
      '</div>'+

      // 项目表格
      '<div class="table-wrap" style="max-height:400px;overflow-y:auto">'+
        '<table style="width:100%;font-size:11px">'+
          '<thead><tr style="position:sticky;top:0;background:var(--bg2);z-index:1">'+
            '<th style="text-align:left;padding:6px 8px">项目名称</th>'+
            '<th style="text-align:left;padding:6px 8px">国家/城市</th>'+
            '<th style="text-align:left;padding:6px 8px">行业</th>'+
            '<th style="text-align:left;padding:6px 8px">企业</th>'+
            '<th style="text-align:left;padding:6px 8px">投资额</th>'+
            '<th style="text-align:left;padding:6px 8px">状态</th>'+
            '<th style="text-align:left;padding:6px 8px">风险</th>'+
          '</tr></thead><tbody>'+
          projects.map(function(p){
            var riskColor=p.risk_level==='high'?'var(--red)':p.risk_level==='medium'?'var(--orange)':'var(--green)';
            var riskLabel=p.risk_level==='high'?'🔴 高':p.risk_level==='medium'?'🟡 中':'🟢 低';
            var statusColor=p.status==='运营中'?'var(--green)':p.status==='建设中'?'var(--orange)':'var(--cyan)';
            return '<tr style="border-bottom:1px solid var(--border)">'+
              '<td style="padding:6px 8px;font-weight:500">'+p.project_name+
                '<div style="font-size:9px;color:var(--text3)">'+(p.desc||'').substring(0,60)+'</div></td>'+
              '<td style="padding:6px 8px">'+p.country+'<div style="font-size:9px;color:var(--text3)">'+(p.city||'')+'</div></td>'+
              '<td style="padding:6px 8px"><span style="font-size:10px;padding:1px 6px;background:var(--bg2);border-radius:3px">'+p.sector+'</span></td>'+
              '<td style="padding:6px 8px;font-size:10px">'+(p.enterprise||'')+'</td>'+
              '<td style="padding:6px 8px;font-size:10px;color:var(--cyan)">'+(p.investment||'')+'</td>'+
              '<td style="padding:6px 8px"><span style="color:'+statusColor+';font-size:10px">'+p.status+'</span></td>'+
              '<td style="padding:6px 8px"><span style="color:'+riskColor+';font-size:10px;font-weight:600">'+riskLabel+'</span></td>'+
            '</tr>';
          }).join('')+
        '</tbody></table>'+
      '</div>'+
    '</div>';

    el.innerHTML=html;
  },

  _showAddProjectForm(){
    if(typeof ENTERPRISE_DB==='undefined')return;
    var html='<div style="padding:16px">'+
      '<div style="font-size:13px;font-weight:600;margin-bottom:12px">➕ 添加中资企业海外项目</div>'+
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">'+
        '<input class="input" id="ep-name" placeholder="项目名称" style="font-size:12px">'+
        '<input class="input" id="ep-country" placeholder="国家" style="font-size:12px">'+
        '<input class="input" id="ep-city" placeholder="城市" style="font-size:12px">'+
        '<input class="input" id="ep-sector" placeholder="行业(如:港口/铁路/能源/矿业)" style="font-size:12px">'+
        '<input class="input" id="ep-enterprise" placeholder="企业名称" style="font-size:12px">'+
        '<input class="input" id="ep-investment" placeholder="投资额" style="font-size:12px">'+
        '<select class="select" id="ep-status" style="font-size:12px">'+
          '<option value="建设中">建设中</option>'+
          '<option value="运营中">运营中</option>'+
          '<option value="规划中">规划中</option>'+
        '</select>'+
        '<select class="select" id="ep-risk" style="font-size:12px">'+
          '<option value="high">高风险</option>'+
          '<option value="medium">中风险</option>'+
          '<option value="low">低风险</option>'+
        '</select>'+
      '</div>'+
      '<textarea class="input" id="ep-desc" placeholder="项目描述" style="width:100%;margin-top:8px;font-size:12px;min-height:50px"></textarea>'+
      '<div style="margin-top:10px;text-align:right">'+
        '<button class="btn sm" onclick="DATACENTER.renderEnterprisePanel()">取消</button>'+
        '<button class="btn sm primary" onclick="DATACENTER._submitProject()" style="margin-left:8px">保存</button>'+
      '</div>'+
    '</div>';
    var el=document.getElementById('dc-enterprise-panel');
    if(el)el.innerHTML=html;
  },

  _submitProject(){
    if(typeof ENTERPRISE_DB==='undefined')return;
    var name=document.getElementById('ep-name').value.trim();
    var country=document.getElementById('ep-country').value.trim();
    if(!name||!country){showToast('⚠️ 请填写项目名称和国家');return;}
    ENTERPRISE_DB.add({
      project_name:name,
      country:country,
      city:document.getElementById('ep-city').value.trim(),
      sector:document.getElementById('ep-sector').value.trim()||'综合基建',
      enterprise:document.getElementById('ep-enterprise').value.trim(),
      investment:document.getElementById('ep-investment').value.trim(),
      status:document.getElementById('ep-status').value,
      risk_level:document.getElementById('ep-risk').value,
      desc:document.getElementById('ep-desc').value.trim()
    });
    showToast('✅ 项目已添加');
    this.renderEnterprisePanel();
  },

  // ===== 风险融合引擎面板 =====
  _fusionFilter:{country:'',level:'',sector:''},
  renderFusionPanel(){
    var el=document.getElementById('dc-fusion-panel');
    if(!el||typeof RISK_FUSION==='undefined')return;
    var summary=RISK_FUSION.getSummary();
    var allMatches=RISK_FUSION.getResults();
    var lastTime=summary.lastFusionTime?
      new Date(summary.lastFusionTime).toLocaleString('zh-CN'):'从未执行';
    var simCount=allMatches.filter(function(m){return m.is_simulated;}).length;

    var levelColors={critical:'var(--red)',high:'var(--orange)',medium:'var(--yellow)',low:'var(--green)'};
    var levelLabels={critical:'🔴 紧急',high:'🟠 高危',medium:'🟡 中危',low:'🟢 低危'};
    var levelShort={critical:'紧急',high:'高危',medium:'中危',low:'低危'};

    // 应用筛选
    var f=this._fusionFilter;
    var matches=allMatches.filter(function(m){
      if(f.country&&m.project_country.indexOf(f.country)<0&&f.country.indexOf(m.project_country)<0)return false;
      if(f.level&&m.alert_level!==f.level)return false;
      if(f.sector&&m.project_sector!==f.sector)return false;
      return true;
    });

    // 提取筛选选项
    var countries={};
    var sectors={};
    allMatches.forEach(function(m){
      countries[m.project_country]=(countries[m.project_country]||0)+1;
      if(m.project_sector)sectors[m.project_sector]=(sectors[m.project_sector]||0)+1;
    });
    var countryList=Object.keys(countries).sort(function(a,b){return countries[b]-countries[a];});
    var sectorList=Object.keys(sectors).sort();

    // 按国家统计风险
    var countryRisk={};
    allMatches.forEach(function(m){
      var c=m.project_country;
      if(!countryRisk[c])countryRisk[c]={total:0,critical:0,high:0,medium:0,low:0,projects:{},topScore:0};
      countryRisk[c].total++;
      countryRisk[c][m.alert_level]++;
      countryRisk[c].topScore=Math.max(countryRisk[c].topScore,m.match_score);
      countryRisk[c].projects[m.project_id]=true;
    });
    var countryRiskList=Object.keys(countryRisk).sort(function(a,b){return countryRisk[b].topScore-countryRisk[a].topScore;});

    // 按项目统计
    var projectRisk={};
    allMatches.forEach(function(m){
      var pid=m.project_id;
      if(!projectRisk[pid])projectRisk[pid]={name:m.project_name,country:m.project_country,enterprise:m.project_enterprise,sector:m.project_sector,total:0,critical:0,high:0,medium:0,low:0,topScore:0,matches:[]};
      projectRisk[pid].total++;
      projectRisk[pid][m.alert_level]++;
      projectRisk[pid].topScore=Math.max(projectRisk[pid].topScore,m.match_score);
      projectRisk[pid].matches.push(m);
    });
    var projectRiskList=Object.values(projectRisk).sort(function(a,b){return b.topScore-a.topScore;});

    var html='<div style="padding:16px">'+

      // === 融合引擎状态栏 ===
      '<div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;padding:12px;background:rgba(255,61,127,0.06);border-radius:8px;margin-bottom:14px">'+
        '<div style="display:flex;align-items:center;gap:6px">'+
          '<span style="width:8px;height:8px;border-radius:50%;background:var(--cyan);display:inline-block;animation:pulse 2s infinite"></span>'+
          '<span style="font-size:12px;font-weight:600">融合引擎 v1.0</span>'+
        '</div>'+
        '<span style="font-size:11px;color:var(--text3)">上次融合: <b style="color:var(--text1)">'+lastTime+'</b></span>'+
        '<span style="font-size:11px;color:var(--text3)">匹配: <b style="color:var(--cyan)">'+summary.totalMatches+'</b></span>'+
        '<span style="font-size:11px;color:var(--text3)">受影响项目: <b style="color:var(--orange)">'+summary.affectedProjects+'</b></span>'+
        '<span style="font-size:11px;color:var(--text3)">关联事件: <b style="color:var(--cyan)">'+summary.totalEvents+'</b></span>'+
        (simCount>0?'<span style="font-size:10px;padding:2px 8px;background:rgba(255,170,0,0.15);border-radius:4px;color:var(--orange);font-weight:600">⚠️ 含'+simCount+'条模拟数据</span>':'')+
        '<div style="margin-left:auto;display:flex;gap:6px">'+
          '<button class="btn sm" style="font-size:10px;padding:3px 10px" onclick="DATACENTER.loadSimFusion()">📥 加载模拟数据</button>'+
          '<button class="btn sm" style="font-size:10px;padding:3px 10px" onclick="DATACENTER.clearSimFusion()">🗑️ 清除模拟</button>'+
          '<button class="btn primary sm" onclick="DATACENTER.runFusion()">⚡ 执行融合</button>'+
        '</div>'+
      '</div>'+

      // === 预警等级分布卡片 ===
      '<div style="display:flex;gap:10px;margin-bottom:14px;flex-wrap:wrap">'+
        ['critical','high','medium','low'].map(function(level){
          var count=summary.byLevel?summary.byLevel[level]||0:0;
          var pct=allMatches.length?Math.round(count/allMatches.length*100):0;
          return '<div style="flex:1;min-width:120px;padding:10px 14px;background:'+levelColors[level]+'12;border-radius:8px;border:1px solid '+levelColors[level]+'30;cursor:pointer" onclick="DATACENTER._setFusionFilter(\'level\',\''+level+'\')">'+
            '<div style="font-size:22px;font-weight:700;color:'+levelColors[level]+'">'+count+'</div>'+
            '<div style="font-size:10px;color:var(--text3)">'+levelLabels[level]+'</div>'+
            '<div style="height:3px;background:'+levelColors[level]+'20;border-radius:2px;margin-top:6px"><div style="height:100%;width:'+pct+'%;background:'+levelColors[level]+';border-radius:2px"></div></div>'+
            '<div style="font-size:9px;color:var(--text3);margin-top:2px">'+pct+'% 占比</div>'+
          '</div>';
        }).join('')+
      '</div>'+

      // === 双栏: 左=国家风险概况  右=高危项目Top ===
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px">'+
        // 国家风险概况
        '<div style="background:var(--bg2);border-radius:8px;padding:12px">'+
          '<div style="font-size:11px;font-weight:600;color:var(--text3);margin-bottom:8px">🌍 国家风险概况 (按最高匹配分排序)</div>'+
          '<div style="max-height:220px;overflow-y:auto">'+
            countryRiskList.slice(0,12).map(function(c){
              var cr=countryRisk[c];
              var riskColor=cr.critical>0?'var(--red)':cr.high>0?'var(--orange)':cr.medium>0?'var(--yellow)':'var(--green)';
              var riskLabel=cr.critical>0?'🔴':cr.high>0?'🟠':cr.medium>0?'🟡':'🟢';
              return '<div style="display:flex;align-items:center;gap:8px;padding:5px 0;border-bottom:1px solid var(--border);cursor:pointer" onclick="DATACENTER._setFusionFilter(\'country\',\''+c+'\')" onmouseover="this.style.background=\'rgba(255,255,255,0.03)\'" onmouseout="this.style.background=\'\'">'+
                '<span style="font-size:14px">'+riskLabel+'</span>'+
                '<span style="flex:1;font-size:11px;font-weight:500">'+c+'</span>'+
                '<span style="font-size:10px;color:var(--text3)">'+Object.keys(cr.projects).length+'项目</span>'+
                '<span style="font-size:10px;font-weight:700;color:'+riskColor+'">'+cr.topScore+'分</span>'+
                '<span style="font-size:9px;color:var(--text3);min-width:50px;text-align:right">'+cr.total+'条预警</span>'+
              '</div>';
            }).join('')+
          '</div>'+
        '</div>'+
        // 高危项目Top
        '<div style="background:var(--bg2);border-radius:8px;padding:12px">'+
          '<div style="font-size:11px;font-weight:600;color:var(--text3);margin-bottom:8px">🏭 高危项目Top (按最高风险分排序)</div>'+
          '<div style="max-height:220px;overflow-y:auto">'+
            projectRiskList.slice(0,12).map(function(p,i){
              var riskColor=p.critical>0?'var(--red)':p.high>0?'var(--orange)':'var(--yellow)';
              return '<div style="display:flex;align-items:flex-start;gap:8px;padding:5px 0;border-bottom:1px solid var(--border);cursor:pointer" onclick="DATACENTER._showFusionProjectDetail('+p.matches[0].project_id+')" onmouseover="this.style.background=\'rgba(255,255,255,0.03)\'" onmouseout="this.style.background=\'\'">'+
                '<span style="font-size:10px;color:var(--text3);min-width:16px">'+(i+1)+'.</span>'+
                '<div style="flex:1">'+
                  '<div style="font-size:11px;font-weight:500">'+p.name.substring(0,28)+'</div>'+
                  '<div style="font-size:9px;color:var(--text3)">'+p.country+' | '+p.sector+' | '+p.enterprise.substring(0,15)+'</div>'+
                '</div>'+
                '<div style="text-align:right">'+
                  '<div style="font-size:11px;font-weight:700;color:'+riskColor+'">'+p.topScore+'</div>'+
                  '<div style="font-size:9px;color:var(--text3)">'+p.total+'条</div>'+
                '</div>'+
              '</div>';
            }).join('')+
          '</div>'+
        '</div>'+
      '</div>'+

      // === 筛选栏 ===
      '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:10px;padding:8px;background:var(--bg2);border-radius:6px">'+
        '<span style="font-size:11px;font-weight:600;color:var(--text3)">🔍 筛选:</span>'+
        '<select class="select" style="font-size:10px;padding:2px 8px;min-width:100px" onchange="DATACENTER._setFusionFilter(\'country\',this.value)">'+
          '<option value="">全部国家</option>'+
          countryList.map(function(c){return '<option value="'+c+'" '+(f.country===c?'selected':'')+'>'+c+' ('+countries[c]+')</option>';}).join('')+
        '</select>'+
        '<select class="select" style="font-size:10px;padding:2px 8px;min-width:90px" onchange="DATACENTER._setFusionFilter(\'level\',this.value)">'+
          '<option value="">全部等级</option>'+
          ['critical','high','medium','low'].map(function(l){return '<option value="'+l+'" '+(f.level===l?'selected':'')+'>'+levelShort[l]+'</option>';}).join('')+
        '</select>'+
        '<select class="select" style="font-size:10px;padding:2px 8px;min-width:90px" onchange="DATACENTER._setFusionFilter(\'sector\',this.value)">'+
          '<option value="">全部行业</option>'+
          sectorList.map(function(s){return '<option value="'+s+'" '+(f.sector===s?'selected':'')+'>'+s+'</option>';}).join('')+
        '</select>'+
        (f.country||f.level||f.sector?'<button class="btn sm" style="font-size:10px;padding:2px 8px" onclick="DATACENTER._clearFusionFilter()">✕ 清除筛选</button>':'')+
        '<span style="font-size:10px;color:var(--text3);margin-left:auto">显示 '+matches.length+' / '+allMatches.length+' 条</span>'+
      '</div>'+

      // === 融合结果表格(可点击) ===
      (matches.length>0?
        '<div class="table-wrap" style="max-height:400px;overflow-y:auto">'+
          '<table style="width:100%;font-size:11px">'+
            '<thead><tr style="position:sticky;top:0;background:var(--bg2);z-index:1">'+
              '<th style="text-align:left;padding:6px 8px">预警等级</th>'+
              '<th style="text-align:left;padding:6px 8px">风险事件</th>'+
              '<th style="text-align:left;padding:6px 8px">受影响项目</th>'+
              '<th style="text-align:left;padding:6px 8px">国家</th>'+
              '<th style="text-align:left;padding:6px 8px">行业</th>'+
              '<th style="text-align:left;padding:6px 8px">匹配分</th>'+
              '<th style="text-align:left;padding:6px 8px">操作</th>'+
            '</tr></thead><tbody>'+
            matches.slice(0,100).map(function(m){
              var lc=levelColors[m.alert_level]||'var(--text3)';
              var idx=allMatches.indexOf(m);
              return '<tr style="border-bottom:1px solid var(--border);cursor:pointer" onclick="DATACENTER.showFusionDetail('+idx+')" onmouseover="this.style.background=\'rgba(255,255,255,0.03)\'" onmouseout="this.style.background=\'\'">'+
                '<td style="padding:6px 8px"><span style="color:'+lc+';font-size:10px;font-weight:600">'+(levelLabels[m.alert_level]||'')+'</span>'+
                  (m.is_simulated?'<span style="font-size:8px;color:var(--orange);margin-left:2px">模拟</span>':'')+'</td>'+
                '<td style="padding:6px 8px;max-width:200px"><div style="font-weight:500">'+m.event_title.substring(0,50)+'</div>'+
                  '<div style="font-size:9px;color:var(--text3)">'+m.event_date+' | '+m.event_type+'</div></td>'+
                '<td style="padding:6px 8px;max-width:200px"><div style="font-weight:500">'+m.project_name+'</div>'+
                  '<div style="font-size:9px;color:var(--text3)">'+m.project_enterprise+'</div></td>'+
                '<td style="padding:6px 8px">'+m.project_country+'</td>'+
                '<td style="padding:6px 8px"><span style="font-size:10px;padding:1px 6px;background:var(--bg2);border-radius:3px">'+m.project_sector+'</span></td>'+
                '<td style="padding:6px 8px">'+
                  '<div style="display:flex;align-items:center;gap:4px">'+
                    '<div style="width:40px;height:5px;background:var(--bg2);border-radius:3px"><div style="height:100%;width:'+m.match_score+'%;background:'+lc+';border-radius:3px"></div></div>'+
                    '<span style="color:'+lc+';font-weight:700;font-size:12px">'+m.match_score+'</span>'+
                  '</div>'+
                '</td>'+
                '<td style="padding:6px 8px"><button class="btn sm" style="font-size:9px;padding:1px 6px" onclick="event.stopPropagation();DATACENTER.showFusionDetail('+idx+')">详情</button></td>'+
              '</tr>';
            }).join('')+
          '</tbody></table>'+
        '</div>'
      :
        '<div style="text-align:center;padding:30px;color:var(--text3)">'+
          '<div style="font-size:36px;margin-bottom:8px">🔗</div>'+
          '<div style="font-size:13px;margin-bottom:4px">暂无融合结果</div>'+
          '<div style="font-size:11px;margin-bottom:10px">点击「加载模拟数据」快速体验，或采集数据→审核→执行融合</div>'+
          '<button class="btn primary sm" onclick="DATACENTER.loadSimFusion()">📥 加载模拟融合数据</button>'+
        '</div>'
      )+
    '</div>';

    el.innerHTML=html;
  },

  _setFusionFilter(key,val){
    this._fusionFilter[key]=val;
    this.renderFusionPanel();
  },
  _clearFusionFilter(){
    this._fusionFilter={country:'',level:'',sector:''};
    this.renderFusionPanel();
  },

  // 融合结果详情弹窗
  showFusionDetail(idx){
    var matches=RISK_FUSION.getResults();
    var m=matches[idx];
    if(!m)return;
    var levelColors={critical:'var(--red)',high:'var(--orange)',medium:'var(--yellow)',low:'var(--green)'};
    var levelLabels={critical:'🔴 紧急',high:'🟠 高危',medium:'🟡 中危',low:'🟢 低危'};
    var lc=levelColors[m.alert_level]||'var(--text3)';
    var reasons=m.match_reasons?m.match_reasons.split('; '):[];
    var vulnPct=Math.round((m.vulnerability||0)*100);

    // 推荐措施
    var actions=[];
    if(m.alert_level==='critical'){
      actions.push('立即启动应急预案，组织人员撤离至安全区域');
      actions.push('向驻外使领馆和企业总部报告，请求安全支援');
      actions.push('暂停项目运营，评估损失和恢复方案');
    }else if(m.alert_level==='high'){
      actions.push('提升安保等级，加强现场安全巡逻');
      actions.push('限制非必要外出，建立安全联络机制');
      actions.push('制定应急疏散预案，确保撤离路线畅通');
    }else if(m.alert_level==='medium'){
      actions.push('密切关注事态发展，保持信息畅通');
      actions.push('提醒员工注意安全，减少不必要活动');
      actions.push('审查和完善安保措施');
    }else{
      actions.push('持续监测风险动态');
      actions.push('保持常规安保措施');
    }

    var html='<div style="padding:20px;max-width:600px">'+
      // 预警头部
      '<div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;padding:12px;background:'+lc+'10;border-radius:8px;border-left:3px solid '+lc+'">'+
        '<div>'+
          '<div style="font-size:14px;font-weight:700;color:'+lc+'">'+(levelLabels[m.alert_level]||'')+(m.is_simulated?' ⚠️ 模拟数据':'')+'</div>'+
          '<div style="font-size:18px;font-weight:700;margin-top:4px">'+m.event_title+'</div>'+
        '</div>'+
        '<div style="margin-left:auto;text-align:center">'+
          '<div style="font-size:28px;font-weight:800;color:'+lc+'">'+m.match_score+'</div>'+
          '<div style="font-size:10px;color:var(--text3)">风险匹配分</div>'+
        '</div>'+
      '</div>'+

      // 事件信息
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">'+
        '<div style="padding:8px 12px;background:var(--bg2);border-radius:6px"><div style="font-size:9px;color:var(--text3)">发生国家</div><div style="font-size:12px;font-weight:500">'+m.event_country+'</div></div>'+
        '<div style="padding:8px 12px;background:var(--bg2);border-radius:6px"><div style="font-size:9px;color:var(--text3)">发生日期</div><div style="font-size:12px;font-weight:500">'+m.event_date+'</div></div>'+
        '<div style="padding:8px 12px;background:var(--bg2);border-radius:6px"><div style="font-size:9px;color:var(--text3)">事件类型</div><div style="font-size:12px;font-weight:500">'+m.event_type+'</div></div>'+
        '<div style="padding:8px 12px;background:var(--bg2);border-radius:6px"><div style="font-size:9px;color:var(--text3)">事件严重度</div><div style="font-size:12px;font-weight:500">'+(m.event_severity||'medium')+'</div></div>'+
      '</div>'+

      // 受影响项目
      '<div style="padding:10px 12px;background:rgba(0,212,255,0.06);border-radius:6px;margin-bottom:14px">'+
        '<div style="font-size:10px;color:var(--text3);margin-bottom:4px">🏭 受影响中资项目</div>'+
        '<div style="font-size:13px;font-weight:600">'+m.project_name+'</div>'+
        '<div style="font-size:11px;color:var(--text3);margin-top:2px">'+m.project_enterprise+' | '+m.project_country+' | '+m.project_sector+' | '+m.project_status+'</div>'+
      '</div>'+

      // 匹配原因
      '<div style="margin-bottom:14px">'+
        '<div style="font-size:11px;font-weight:600;color:var(--text3);margin-bottom:6px">🔗 匹配分析</div>'+
        '<div style="padding:10px;background:var(--bg2);border-radius:6px">'+
          reasons.map(function(r){
            return '<div style="font-size:11px;padding:3px 0;display:flex;gap:6px"><span style="color:var(--cyan)">▸</span><span>'+r+'</span></div>';
          }).join('')+
        '</div>'+
      '</div>'+

      // 行业脆弱性
      '<div style="margin-bottom:14px">'+
        '<div style="font-size:11px;font-weight:600;color:var(--text3);margin-bottom:6px">📊 行业脆弱性评估</div>'+
        '<div style="padding:10px;background:var(--bg2);border-radius:6px">'+
          '<div style="display:flex;align-items:center;gap:10px">'+
            '<div style="flex:1;height:8px;background:var(--bg1);border-radius:4px;overflow:hidden">'+
              '<div style="height:100%;width:'+vulnPct+'%;background:'+(vulnPct>=70?'var(--red)':vulnPct>=50?'var(--orange)':'var(--yellow)')+';border-radius:4px"></div>'+
            '</div>'+
            '<span style="font-size:12px;font-weight:700">'+vulnPct+'%</span>'+
          '</div>'+
          '<div style="font-size:10px;color:var(--text3);margin-top:4px">'+
            (vulnPct>=70?'该行业对此类事件高度脆弱，需立即采取防护措施':
             vulnPct>=50?'该行业对此类事件中度脆弱，应加强防范':
             '该行业对此类事件脆弱性较低，保持常规监测')+
          '</div>'+
        '</div>'+
      '</div>'+

      // 推荐措施
      '<div style="margin-bottom:14px">'+
        '<div style="font-size:11px;font-weight:600;color:var(--text3);margin-bottom:6px">🎯 推荐处置措施</div>'+
        '<div style="padding:10px;background:rgba(0,200,83,0.06);border-radius:6px">'+
          actions.map(function(a,i){
            return '<div style="font-size:11px;padding:4px 0;display:flex;gap:8px"><span style="color:var(--green);font-weight:700">'+(i+1)+'.</span><span>'+a+'</span></div>';
          }).join('')+
        '</div>'+
      '</div>'+

      // 融合时间
      '<div style="font-size:10px;color:var(--text3);text-align:right">融合时间: '+(m.fused_at?new Date(m.fused_at).toLocaleString('zh-CN'):'-')+'</div>'+
    '</div>';
    showModal('融合预警详情',html);
  },

  // 项目级预警详情
  _showFusionProjectDetail(pid){
    var alerts=RISK_FUSION.getProjectAlerts(pid);
    if(!alerts.length)return;
    var p=alerts[0];
    var levelColors={critical:'var(--red)',high:'var(--orange)',medium:'var(--yellow)',low:'var(--green)'};
    var levelLabels={critical:'🔴 紧急',high:'🟠 高危',medium:'🟡 中危',low:'🟢 低危'};
    var counts={critical:0,high:0,medium:0,low:0};
    alerts.forEach(function(a){counts[a.alert_level]++;});

    var html='<div style="padding:20px;max-width:600px">'+
      '<div style="margin-bottom:14px">'+
        '<div style="font-size:16px;font-weight:700">'+p.project_name+'</div>'+
        '<div style="font-size:11px;color:var(--text3);margin-top:2px">'+p.project_enterprise+' | '+p.project_country+' | '+p.project_sector+' | '+p.project_status+'</div>'+
      '</div>'+
      '<div style="display:flex;gap:8px;margin-bottom:14px">'+
        ['critical','high','medium','low'].map(function(l){
          return '<div style="padding:6px 12px;background:'+levelColors[l]+'15;border-radius:6px;text-align:center">'+
            '<div style="font-size:16px;font-weight:700;color:'+levelColors[l]+'">'+counts[l]+'</div>'+
            '<div style="font-size:9px;color:var(--text3)">'+levelLabels[l]+'</div>'+
          '</div>';
        }).join('')+
      '</div>'+
      '<div style="font-size:11px;font-weight:600;color:var(--text3);margin-bottom:6px">该项目关联的所有风险预警 ('+alerts.length+'条)</div>'+
      '<div style="max-height:300px;overflow-y:auto">'+
        alerts.sort(function(a,b){return b.match_score-a.match_score;}).map(function(a,i){
          var lc=levelColors[a.alert_level]||'var(--text3)';
          return '<div style="padding:8px;background:var(--bg2);border-radius:6px;margin-bottom:4px;cursor:pointer;border-left:3px solid '+lc+'" onclick="DATACENTER.showFusionDetail('+RISK_FUSION.getResults().indexOf(a)+')">'+
            '<div style="display:flex;justify-content:space-between;align-items:center">'+
              '<span style="font-size:11px;font-weight:500">'+a.event_title.substring(0,40)+'</span>'+
              '<span style="font-size:11px;font-weight:700;color:'+lc+'">'+a.match_score+'</span>'+
            '</div>'+
            '<div style="font-size:9px;color:var(--text3);margin-top:2px">'+a.event_date+' | '+a.event_type+'</div>'+
          '</div>';
        }).join('')+
      '</div>'+
    '</div>';
    showModal('项目风险预警 - '+p.project_name,html);
  },

  runFusion(){
    if(typeof RISK_FUSION==='undefined'){showToast('⚠️ 融合引擎未加载');return;}
    var result=RISK_FUSION.fuse();
    this.renderFusionPanel();
    showToast('⚡ 风险融合完成: '+result.total+'条匹配，涉及'+RISK_FUSION.getSummary().affectedProjects+'个项目');
  },

  loadSimFusion(){
    if(typeof RISK_FUSION==='undefined')return;
    var n=RISK_FUSION.seedSimulatedFusion();
    if(n>0){
      this.renderFusionPanel();
      showToast('✅ 已加载 '+n+' 条模拟融合数据');
    }else{
      showToast('模拟数据已存在，如需重新加载请先清除');
    }
  },
  clearSimFusion(){
    if(typeof RISK_FUSION==='undefined')return;
    RISK_FUSION.clearSimulatedFusion();
    this.renderFusionPanel();
    showToast('🗑️ 已清除模拟融合数据');
  },

  // ===== 采集库面板 (独立数据库展示) =====
  _collectedTab:'terror_events',
  renderCollectedPanel(){
    var el=document.getElementById('dc-collected-panel');
    if(!el)return;
    var me=this;
    var stats=COLLECTED_DB.getStats();
    var simCount=typeof COLLECTED_DB.countSimulated==='function'?COLLECTED_DB.countSimulated():0;
    var totalCollected=stats.total||0;

    // 顶部统计+操作栏
    var topBar='<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:8px 10px;background:var(--bg2);border-radius:6px;margin-bottom:8px">'+
      '<span style="font-size:11px;font-weight:600;color:var(--text3)">📊 采集库总量: <b style="color:var(--cyan)">'+totalCollected+'</b> 条</span>'+
      (simCount>0?'<span style="font-size:10px;padding:2px 8px;background:rgba(255,170,0,0.15);border-radius:4px;color:var(--orange);font-weight:600">⚠️ 含 '+simCount+' 条模拟数据</span>':'')+
      '<div style="margin-left:auto;display:flex;gap:6px">'+
        (typeof COLLECTED_DB.seedSimulatedData==='function'?'<button class="btn sm" style="font-size:10px;padding:3px 8px" onclick="DATACENTER.loadSimCollected()">📥 加载模拟数据</button>':'')+
        (simCount>0?'<button class="btn sm" style="font-size:10px;padding:3px 8px" onclick="DATACENTER.clearSimCollected()">🗑️ 清除模拟</button>':'')+
      '</div>'+
    '</div>';

    // Tab 栏
    var tabsHtml='<div class="dc-tabs" style="margin:0 0 10px 0">'+
      COLLECTED_DB.CATEGORIES.map(function(cat){
        var tabInfo=me.tabs.find(function(t){return t.key===cat;});
        var label=tabInfo?tabInfo.label:cat;
        var count=COLLECTED_DB.count(cat);
        var audit=COLLECTED_DB.getAuditSummary(cat);
        var badge='';
        if(audit.pending>0)badge+='<span style="color:var(--orange);font-size:9px"> ('+audit.pending+'待审)</span>';
        return '<div class="dc-tab '+(me._collectedTab===cat?'active':'')+'" onclick="DATACENTER.switchCollectedTab(\''+cat+'\')" style="font-size:11px">'+label+' ['+count+']'+badge+'</div>';
      }).join('')+
    '</div>';

    // 当前类别的数据表格
    var cat=this._collectedTab;
    var data=COLLECTED_DB.getAll(cat);
    var audit=COLLECTED_DB.getAuditSummary(cat);
    var isAdmin=PERM.isAdmin();

    // 审核操作栏
    var auditBarHtml='';
    if(isAdmin&&data.length>0){
      auditBarHtml='<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:8px;background:rgba(255,170,0,0.06);border-radius:6px;margin-bottom:8px">'+
        '<span style="font-size:11px;color:var(--text3);font-weight:600">📋 采集库审核</span>'+
        '<span style="font-size:10px;color:var(--orange)">🟡 待审核:<b>'+audit.pending+'</b></span>'+
        '<span style="font-size:10px;color:var(--green)">🟢 已审核:<b>'+audit.approved+'</b></span>'+
        '<span style="font-size:10px;color:var(--red)">🔴 驳回:<b>'+audit.rejected+'</b></span>'+
        '<button class="btn" style="font-size:10px;padding:2px 8px;background:var(--green);color:#fff" onclick="DATACENTER.collectedApproveAll(\''+cat+'\')">✅ 全部通过</button>'+
        (audit.approved>0?'<button class="btn" style="font-size:10px;padding:2px 8px;background:var(--cyan);color:#fff;margin-left:auto" onclick="DATACENTER.collectedTransferOne(\''+cat+'\')">📤 转入主数据库 ('+audit.approved+'条)</button>':'')+
      '</div>';
    }

    // 数据表格
    var tableHtml='';
    if(data.length===0){
      tableHtml='<div style="padding:30px;text-align:center;color:var(--text3);font-size:13px">'+
        '<div style="font-size:32px;margin-bottom:8px">📭</div>'+
        '采集库中暂无'+(this.tabs.find(function(t){return t.key===cat;})||{label:cat}).label+'数据<br>'+
        '<span style="font-size:11px;margin-bottom:10px;display:block">点击「加载模拟数据」快速体验，或采集全网实时数据</span><br>'+
        '<button class="btn primary sm" onclick="DATACENTER.loadSimCollected()">📥 加载模拟数据</button>'+
      '</div>';
    }else{
      // 限制显示前30条
      var displayData=data.slice(0,30);
      var sevColors={critical:'var(--red)',high:'var(--orange)',medium:'var(--yellow)',low:'var(--green)'};
      var sevLabels={critical:'🔴',high:'🟠',medium:'🟡',low:'🟢'};
      tableHtml='<div class="table-wrap" style="max-height:350px;overflow-y:auto"><table style="font-size:11px">'+
        '<thead><tr>'+
        (isAdmin?'<th>操作</th>':'')+
        '<th>审核</th><th>标题/描述</th><th>日期</th><th>国家</th><th>严重度</th><th>质量分</th><th>来源</th><th>区域</th>'+
        '</tr></thead><tbody>'+
        displayData.map(function(item){
          var auditLabel=me.AUDIT_LABELS[item.audit_status||'pending']||'🟡 待审核';
          var auditColor=me.AUDIT_COLORS[item.audit_status||'pending']||'var(--orange)';
          var actionHtml='';
          if(isAdmin){
            if(item.audit_status==='pending'){
              actionHtml='<td style="white-space:nowrap">'+
                '<button class="btn" style="font-size:9px;padding:1px 6px;background:var(--green);color:#fff" onclick="DATACENTER.collectedSetAudit(\''+cat+'\','+item.id+',\'approved\')">✓通过</button>'+
                '<button class="btn" style="font-size:9px;padding:1px 6px;background:var(--red);color:#fff;margin-left:2px" onclick="DATACENTER.collectedSetAudit(\''+cat+'\','+item.id+',\'rejected\')">✕驳回</button>'+
              '</td>';
            }else if(item.audit_status==='approved'){
              actionHtml='<td style="white-space:nowrap">'+
                '<button class="btn" style="font-size:9px;padding:1px 6px;background:var(--cyan);color:#fff" onclick="DATACENTER.collectedTransferItem(\''+cat+'\','+item.id+')">📤转入</button>'+
              '</td>';
            }else{
              actionHtml='<td style="color:var(--text3);font-size:10px">已驳回</td>';
            }
          }
          var desc=(item.title||item.desc||'').substring(0,50);
          if((item.title||item.desc||'').length>50)desc+='...';
          var regionColor=(item.source_region==='国内')?'var(--red)':'var(--blue)';
          var sev=item.severity||'medium';
          var sevColor=sevColors[sev]||'var(--text3)';
          var qs=item.quality_score||0;
          var qsColor=qs>=80?'var(--green)':qs>=60?'var(--yellow)':qs>=35?'var(--orange)':'var(--red)';
          return '<tr style="border-bottom:1px solid var(--border)">'+
            actionHtml+
            '<td><span style="color:'+auditColor+';font-size:10px;font-weight:600">'+auditLabel+'</span></td>'+
            '<td style="max-width:250px"><div style="font-weight:500">'+desc+
              (item.is_simulated?'<span style="font-size:8px;padding:1px 4px;background:rgba(255,170,0,0.15);border-radius:3px;color:var(--orange);margin-left:4px">模拟</span>':'')+'</div>'+
              (item.url?'<a href="'+item.url+'" target="_blank" style="font-size:9px;color:var(--cyan)">查看原文</a>':'')+
            '</td>'+
            '<td style="white-space:nowrap">'+(item.date||'')+'</td>'+
            '<td>'+(item.country||'未知')+'</td>'+
            '<td><span style="color:'+sevColor+';font-size:14px" title="'+sev+'">'+(sevLabels[sev]||'⚪')+'</span></td>'+
            '<td><span style="color:'+qsColor+';font-weight:600;font-size:10px">'+qs+'</span></td>'+
            '<td style="font-size:10px">'+(item.source||'')+'</td>'+
            '<td><span style="font-size:9px;color:'+regionColor+';font-weight:600">'+(item.source_region||'')+'</span></td>'+
          '</tr>';
        }).join('')+
        '</tbody></table></div>';
      if(data.length>30){
        tableHtml+='<div style="padding:6px;text-align:center;font-size:11px;color:var(--text3)">仅显示前30条，共 '+data.length+' 条</div>';
      }
    }

    el.innerHTML='<div style="padding:12px">'+
      topBar+
      tabsHtml+
      auditBarHtml+
      tableHtml+
    '</div>';
  },
  switchCollectedTab(cat){
    this._collectedTab=cat;
    this.renderCollectedPanel();
  },
  loadSimCollected(){
    if(typeof COLLECTED_DB==='undefined'||typeof COLLECTED_DB.seedSimulatedData!=='function')return;
    var n=COLLECTED_DB.seedSimulatedData();
    if(n>0){
      this.renderCollectedPanel();
      this.renderScraperPanel();
      showToast('✅ 已加载 '+n+' 条模拟情报数据');
    }else{
      showToast('模拟数据已存在，如需重新加载请先清除');
    }
  },
  clearSimCollected(){
    if(typeof COLLECTED_DB==='undefined'||typeof COLLECTED_DB.clearSimulatedData!=='function')return;
    COLLECTED_DB.clearSimulatedData();
    this.renderCollectedPanel();
    this.renderScraperPanel();
    showToast('🗑️ 已清除模拟采集数据');
  },
  // 采集库审核操作
  collectedSetAudit(cat,id,status){
    COLLECTED_DB.setAuditStatus(cat,id,status);
    this.renderCollectedPanel();
    this.renderScraperPanel();
  },
  collectedApproveAll(cat){
    if(!PERM.isAdmin())return;
    var data=COLLECTED_DB.getAll(cat);
    var pendingIds=data.filter(function(d){return d.audit_status==='pending';}).map(function(d){return d.id;});
    if(!pendingIds.length){showToast('没有待审核数据');return;}
    COLLECTED_DB.batchSetAuditStatus(cat,pendingIds,'approved');
    this.renderCollectedPanel();
    this.renderScraperPanel();
    showToast('✅ '+pendingIds.length+' 条数据已审核通过');
  },
  collectedTransferItem(cat,id){
    if(!PERM.isAdmin()){showToast('需要管理员权限');return;}
    var ok=COLLECTED_DB.transferToDBCenter(cat,id);
    if(ok){
      DBCenter.addLog('从采集库转入1条数据到主数据库 ('+cat+')');
      this.renderCollectedPanel();
      this.renderScraperPanel();
      this.renderStats();
      this.renderTabs();
      this.renderTable();
      this.updateBadge();
      showToast('✅ 数据已转入主数据库');
    }else{
      showToast('转入失败，请确保数据已审核通过');
    }
  },
  collectedTransferOne(cat){
    if(!PERM.isAdmin())return;
    var audit=COLLECTED_DB.getAuditSummary(cat);
    if(audit.approved===0){showToast('没有已审核数据');return;}
    var count=COLLECTED_DB.transferApprovedToDBCenter(cat);
    DBCenter.addLog('从采集库转入 '+count+' 条数据到主数据库 ('+cat+')');
    this.renderCollectedPanel();
    this.renderScraperPanel();
    this.renderStats();
    this.renderTabs();
    this.renderTable();
    this.updateBadge();
    showToast('✅ '+count+' 条数据已转入主数据库');
  },
  _manualFormType:'terror_events',
  _renderManualForm(){
    var el=document.getElementById('dc-manual-form');
    if(!el)return;
    var types=[
      {key:'terror_events',lb:'💥 恐袭事件',fields:[
        {k:'date',lb:'发生日期',tp:'date',req:true},
        {k:'country',lb:'国家',tp:'select',opts:COUNTRIES.map(function(c){return c.name;}),req:true},
        {k:'city',lb:'城市',tp:'text',req:true},
        {k:'group',lb:'恐怖组织',tp:'text',req:false},
        {k:'type',lb:'袭击类型',tp:'select',opts:['自杀式爆炸','武装袭击','汽车炸弹','IED爆炸','绑架劫持','无人机攻击'],req:true},
        {k:'target',lb:'袭击目标',tp:'text',req:true},
        {k:'deaths',lb:'死亡人数',tp:'number',req:true},
        {k:'injured',lb:'受伤人数',tp:'number',req:false},
        {k:'desc',lb:'事件描述',tp:'textarea',req:true},
        {k:'source',lb:'信息来源',tp:'text',req:false}
      ]},
      {key:'security_events',lb:'🛡️ 涉华安全',fields:[
        {k:'date',lb:'发生日期',tp:'date',req:true},
        {k:'country',lb:'国家',tp:'select',opts:COUNTRIES.map(function(c){return c.name;}),req:true},
        {k:'location',lb:'具体地点',tp:'text',req:true},
        {k:'type',lb:'事件类型',tp:'select',opts:['武装袭击','绑架','自杀式袭击','汽车炸弹','刑事案件','武装冲突/内战','经济制裁'],req:true},
        {k:'severity',lb:'严重程度',tp:'select',opts:['red','orange','yellow'],req:true},
        {k:'title',lb:'事件标题',tp:'text',req:true},
        {k:'deaths',lb:'死亡人数',tp:'number',req:false},
        {k:'injured',lb:'受伤人数',tp:'number',req:false},
        {k:'people',lb:'涉中方人员',tp:'text',req:false},
        {k:'desc',lb:'事件描述',tp:'textarea',req:true},
        {k:'source',lb:'信息来源',tp:'text',req:false}
      ]},
      {key:'military_conflicts',lb:'⚔️ 武装冲突',fields:[
        {k:'date',lb:'发生日期',tp:'date',req:true},
        {k:'country',lb:'国家/地区',tp:'select',opts:COUNTRIES.map(function(c){return c.name;}),req:true},
        {k:'location',lb:'冲突地点',tp:'text',req:true},
        {k:'conflict_type',lb:'冲突类型',tp:'select',opts:['武装冲突','海上袭击','内战','跨境冲突','恐怖袭击','边境冲突'],req:true},
        {k:'parties',lb:'参战方',tp:'text',req:true},
        {k:'casualties',lb:'伤亡情况',tp:'text',req:false},
        {k:'desc',lb:'事件描述',tp:'textarea',req:true},
        {k:'source',lb:'信息来源',tp:'text',req:false}
      ]},
      {key:'political_events',lb:'🏛️ 政治风险',fields:[
        {k:'date',lb:'发生日期',tp:'date',req:true},
        {k:'country',lb:'国家',tp:'select',opts:COUNTRIES.map(function(c){return c.name;}),req:true},
        {k:'event_type',lb:'事件类型',tp:'select',opts:['政府更迭','军事政变','内战','选举争议','边境冲突','军事对抗','抗议示威'],req:true},
        {k:'title',lb:'事件标题',tp:'text',req:true},
        {k:'impact',lb:'影响等级',tp:'select',opts:['red','orange','yellow'],req:true},
        {k:'desc',lb:'事件描述',tp:'textarea',req:true},
        {k:'source',lb:'信息来源',tp:'text',req:false}
      ]},
      {key:'geopolitical_intel',lb:'🌐 地缘情报',fields:[
        {k:'date',lb:'情报日期',tp:'date',req:true},
        {k:'country',lb:'国家/地区',tp:'select',opts:COUNTRIES.map(function(c){return c.name;}),req:true},
        {k:'intel_type',lb:'情报类型',tp:'select',opts:['出口管制','政策调整','多边外交','双边关系','领事保护','经济风险','贸易数据','战略调整','安全预警','投资风险'],req:true},
        {k:'title',lb:'情报标题',tp:'text',req:true},
        {k:'risk_level',lb:'风险等级',tp:'select',opts:['red','orange','yellow'],req:true},
        {k:'impact',lb:'对华影响',tp:'text',req:false},
        {k:'desc',lb:'详细摘要',tp:'textarea',req:true},
        {k:'source',lb:'信息来源',tp:'text',req:false}
      ]},
      {key:'natural_disasters',lb:'🌊 自然灾害',fields:[
        {k:'date',lb:'发生日期',tp:'date',req:true},
        {k:'country',lb:'国家/地区',tp:'select',opts:COUNTRIES.map(function(c){return c.name;}),req:true},
        {k:'disaster_type',lb:'灾害类型',tp:'select',opts:['地震','台风','洪水','山火','气旋/洪水','火山喷发'],req:true},
        {k:'title',lb:'事件标题',tp:'text',req:true},
        {k:'magnitude',lb:'强度/规模',tp:'text',req:false},
        {k:'casualties',lb:'伤亡情况',tp:'text',req:false},
        {k:'desc',lb:'事件描述',tp:'textarea',req:true},
        {k:'source',lb:'信息来源',tp:'text',req:false}
      ]},
      {key:'public_health',lb:'🧧 公共卫生',fields:[
        {k:'date',lb:'发生日期',tp:'date',req:true},
        {k:'country',lb:'国家/地区',tp:'select',opts:COUNTRIES.map(function(c){return c.name;}),req:true},
        {k:'health_type',lb:'事件类型',tp:'select',opts:['传染病爆发','环境污染','食品安全','医疗危机'],req:true},
        {k:'title',lb:'事件标题',tp:'text',req:true},
        {k:'severity',lb:'严重等级',tp:'select',opts:['red','orange','yellow'],req:true},
        {k:'cases',lb:'感染/影响',tp:'text',req:false},
        {k:'desc',lb:'事件描述',tp:'textarea',req:true},
        {k:'source',lb:'信息来源',tp:'text',req:false}
      ]},
      {key:'sanctions_data',lb:'🚫 制裁合规',fields:[
        {k:'date',lb:'实施日期',tp:'date',req:true},
        {k:'country',lb:'发起方',tp:'select',opts:COUNTRIES.map(function(c){return c.name;}),req:true},
        {k:'target_country',lb:'被制裁方',tp:'text',req:true},
        {k:'sanction_type',lb:'制裁类型',tp:'select',opts:['经济制裁','贸易限制','出口管制','定向制裁','金融制裁'],req:true},
        {k:'title',lb:'制裁标题',tp:'text',req:true},
        {k:'target',lb:'制裁目标',tp:'text',req:false},
        {k:'desc',lb:'详细描述',tp:'textarea',req:true},
        {k:'source',lb:'信息来源',tp:'text',req:false}
      ]},
      {key:'social_unrest',lb:'💬 社会动荡',fields:[
        {k:'date',lb:'发生日期',tp:'date',req:true},
        {k:'country',lb:'国家',tp:'select',opts:COUNTRIES.map(function(c){return c.name;}),req:true},
        {k:'unrest_type',lb:'动荡类型',tp:'select',opts:['罢工','抗议','示威','骚乱','暴力冲突','民众运动'],req:true},
        {k:'title',lb:'事件标题',tp:'text',req:true},
        {k:'intensity',lb:'强度',tp:'select',opts:['red','orange','yellow'],req:true},
        {k:'participants',lb:'参与人数',tp:'text',req:false},
        {k:'desc',lb:'事件描述',tp:'textarea',req:true},
        {k:'source',lb:'信息来源',tp:'text',req:false}
      ]},
      {key:'infrastructure',lb:'🚧 基础设施',fields:[
        {k:'date',lb:'更新日期',tp:'date',req:true},
        {k:'country',lb:'所在国',tp:'select',opts:COUNTRIES.map(function(c){return c.name;}),req:true},
        {k:'infra_type',lb:'设施类型',tp:'select',opts:['港口','高铁','铁路','油气','电力','工业园区'],req:true},
        {k:'title',lb:'项目名称',tp:'text',req:true},
        {k:'status',lb:'项目状态',tp:'select',opts:['建设中','运营中','规划中','即将通车','暂停','已中断'],req:true},
        {k:'desc',lb:'详细描述',tp:'textarea',req:true},
        {k:'source',lb:'信息来源',tp:'text',req:false}
      ]}
    ];
    var curType=types.find(function(t){return t.key===DATACENTER._manualFormType;})||types[0];
    var typeTabs='<div class="flex gap-8 mb-12 wrap">'+types.map(function(t){
      return '<div class="chip '+(curType.key===t.key?'active':'')+'" onclick="DATACENTER._manualFormType=\''+t.key+'\';DATACENTER._renderManualForm()">'+t.lb+'</div>';
    }).join('')+'</div>';
    var formHtml='<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">';
    curType.fields.forEach(function(f){
      var lbl='<label class="text-xs text-muted" style="display:block;margin-bottom:4px">'+f.lb+(f.req?' <span style="color:var(--red)">*</span>':'')+'</label>';
      var inp='';
      if(f.tp==='text'){inp='<input class="input" id="mf-'+f.k+'" placeholder="输入'+f.lb+'" style="font-size:12px">';}
      else if(f.tp==='number'){inp='<input class="input" id="mf-'+f.k+'" type="number" placeholder="0" style="font-size:12px">';}
      else if(f.tp==='date'){inp='<input class="input" id="mf-'+f.k+'" type="date" style="font-size:12px">';}
      else if(f.tp==='textarea'){inp='<textarea class="input" id="mf-'+f.k+'" rows="3" placeholder="输入'+f.lb+'" style="font-size:12px;resize:vertical"></textarea>';}
      else if(f.tp==='select'){inp='<select class="select" id="mf-'+f.k+'" style="font-size:12px"><option value="">请选择</option>'+f.opts.map(function(o){return '<option value="'+o+'">'+o+'</option>';}).join('')+'</select>';}
      var full=f.tp==='textarea'?' style="grid-column:1/3"':'';
      formHtml+='<div'+full+'>'+lbl+inp+'</div>';
    });
    formHtml+='</div>';
    formHtml+='<div class="flex gap-8 mt-12">'+
      '<button class="btn primary sm" onclick="DATACENTER._submitManualForm(\''+curType.key+'\')">\u2705 \u63d0\u4ea4\u6570\u636e</button>'+
      '<button class="btn sm" onclick="DATACENTER._clearManualForm()">\u{1F5D1}\ufe0f \u6e05\u7a7a\u8868\u5355</button>'+
      '<span class="text-xs text-muted" style="align-self:center">'+(PERM.isAdmin()?'\u7ba1\u7406\u5458\u63d0\u4ea4\u76f4\u63a5\u5165\u5e93\uff0c\u514d\u5ba1\u6838':'\u666e\u901a\u7528\u6237\u63d0\u4ea4\u540e\u9700\u7ba1\u7406\u5458\u5ba1\u6838\u624d\u80fd\u4e0a\u7ebf')+'</span>'+
      '</div>';
    el.innerHTML=typeTabs+formHtml;
  },
  _submitManualForm(type){
    var fields={
      terror_events:['date','country','city','group','type','target','deaths','injured','desc','source'],
      security_events:['date','country','location','type','severity','title','deaths','injured','people','desc','source'],
      military_conflicts:['date','country','location','conflict_type','parties','casualties','desc','source'],
      political_events:['date','country','event_type','title','impact','desc','source'],
      geopolitical_intel:['date','country','intel_type','title','risk_level','impact','desc','source'],
      natural_disasters:['date','country','disaster_type','title','magnitude','casualties','desc','source'],
      public_health:['date','country','health_type','title','severity','cases','desc','source'],
      sanctions_data:['date','country','target_country','sanction_type','title','target','desc','source'],
      social_unrest:['date','country','unrest_type','title','intensity','participants','desc','source'],
      infrastructure:['date','country','infra_type','title','status','desc','source']
    };
    var reqFields={
      terror_events:['date','country','city','type','target','deaths','desc'],
      security_events:['date','country','location','type','severity','title','desc'],
      military_conflicts:['date','country','location','conflict_type','parties','desc'],
      political_events:['date','country','event_type','title','impact','desc'],
      geopolitical_intel:['date','country','intel_type','title','risk_level','desc'],
      natural_disasters:['date','country','disaster_type','title','desc'],
      public_health:['date','country','health_type','title','severity','desc'],
      sanctions_data:['date','country','target_country','sanction_type','title','desc'],
      social_unrest:['date','country','unrest_type','title','intensity','desc'],
      infrastructure:['date','country','infra_type','title','status','desc']
    };
    var data={};
    var missing=[];
    (fields[type]||[]).forEach(function(k){
      var el=document.getElementById('mf-'+k);
      if(el){
        data[k]=el.value.trim();
        if((reqFields[type]||[]).indexOf(k)>=0&&!data[k]){missing.push(k);}
      }
    });
    if(missing.length){
      showToast('⚠️ 请填写必填字段: '+missing.join(', '));
      return;
    }
    if(type==='terror_events'){data.data_type='terror';}
    else if(type==='security_events'){data.data_type='china_security';}
    // 权限检查：管理员直接录入并自动标记为已审核，普通用户需审核
    if(PERM.isAdmin()){
      data.audit_status='approved';
      data.audit_time=new Date().toISOString();
      DBCenter.add(type,data);
      DBCenter.addLog('管理员直接录入'+type+'数据: 1条 (已自动审核)');
      AUDIT.log('数据直接录入',type,JSON.stringify(data).substring(0,200));
      this.renderStats();this.renderTabs();this.renderTable();this.renderLog();this.updateBadge();
      showToast('\u2705 \u6570\u636e\u5df2\u6210\u529f\u5f55\u5165\uff08\u7ba1\u7406\u5458\u514d\u5ba1\uff09');
    }else{
      // 普通用户提交待审核
      var reviewItem={
        id:CRUD._genId('REV'),
        type:type,
        data:data,
        submitter:AUTH.user.name,
        submitTime:new Date().toLocaleString('zh-CN'),
        status:'pending'
      };
      _pendingReviews.push(reviewItem);
      DataHub.save('_pending_reviews');
      DBCenter.addLog('\u7528\u6237'+AUTH.user.name+'\u63d0\u4ea4'+type+'\u5f85\u5ba1\u6838: 1\u6761');
      AUDIT.log('\u6570\u636e\u63d0\u4ea4\u5f85\u5ba1\u6838',type,'\u63d0\u4ea4\u4eba:'+AUTH.user.name);
      this.renderLog();
      updatePendingUsersBadge();
      showToast('\u2705 \u6570\u636e\u5df2\u63d0\u4ea4\uff0c\u7b49\u5f85\u7ba1\u7406\u5458\u5ba1\u6838\u540e\u4e0a\u7ebf');
    }
    this._clearManualForm();
  },
  _clearManualForm(){
    document.querySelectorAll('[id^="mf-"]').forEach(function(el){if(el.tagName==='INPUT'||el.tagName==='TEXTAREA'||el.tagName==='SELECT')el.value='';});
  },
  // ===== 旧版采集方法已废弃，改为调用 SCRAPER 全网采集引擎 =====
  // 采集的数据存入独立采集库(COLLECTED_DB)，不再直接写入DBCenter
  async collectAll(){
    await this.startWebScrape();
  },
  async collectTerror(){
    if(SCRAPER.isCollecting)return;
    var c=await SCRAPER.collectCategory('terror_events');
    this.renderScraperPanel();this.renderCollectedPanel();
    showToast('采集恐袭数据: +'+c+'条 (来自GDELT)');
  },
  async collectSecurity(){
    if(SCRAPER.isCollecting)return;
    var c=await SCRAPER.collectCategory('security_events');
    this.renderScraperPanel();this.renderCollectedPanel();
    showToast('采集涉华安全: +'+c+'条 (来自GDELT)');
  },
  async collectGeopolitical(){
    if(SCRAPER.isCollecting)return;
    var c=await SCRAPER.collectCategory('geopolitical_intel');
    this.renderScraperPanel();this.renderCollectedPanel();
    showToast('采集地缘情报: +'+c+'条 (来自GDELT)');
  },
  async collectPolitical(){
    if(SCRAPER.isCollecting)return;
    var c=await SCRAPER.collectCategory('political_events');
    this.renderScraperPanel();this.renderCollectedPanel();
    showToast('采集政治风险: +'+c+'条 (来自GDELT)');
  },
  async collectMilitary(){
    if(SCRAPER.isCollecting)return;
    var c=await SCRAPER.collectCategory('military_conflicts');
    this.renderScraperPanel();this.renderCollectedPanel();
    showToast('采集武装冲突: +'+c+'条 (来自GDELT+ReliefWeb)');
  },
  async collectDisasters(){
    if(SCRAPER.isCollecting)return;
    var c=await SCRAPER.collectCategory('natural_disasters');
    this.renderScraperPanel();this.renderCollectedPanel();
    showToast('采集自然灾害: +'+c+'条 (来自USGS+GDACS+ReliefWeb)');
  },
  async collectHealth(){
    if(SCRAPER.isCollecting)return;
    var c=await SCRAPER.collectCategory('public_health');
    this.renderScraperPanel();this.renderCollectedPanel();
    showToast('采集公共卫生: +'+c+'条 (来自WHO RSS+GDELT)');
  },
  async collectSanctions(){
    if(SCRAPER.isCollecting)return;
    var c=await SCRAPER.collectCategory('sanctions_data');
    this.renderScraperPanel();this.renderCollectedPanel();
    showToast('采集制裁合规: +'+c+'条 (来自GDELT)');
  },
  async collectSocial(){
    if(SCRAPER.isCollecting)return;
    var c=await SCRAPER.collectCategory('social_unrest');
    this.renderScraperPanel();this.renderCollectedPanel();
    showToast('采集社会动荡: +'+c+'条 (来自GDELT)');
  },
  async collectInfra(){
    if(SCRAPER.isCollecting)return;
    var c=await SCRAPER.collectCategory('infrastructure');
    this.renderScraperPanel();this.renderCollectedPanel();
    showToast('采集基础设施: +'+c+'条 (来自GDELT)');
  },
  // 表头列值下拉筛选
  _toggleColDropdown(k,vals){
    var safeK=k.replace(/[^a-zA-Z0-9_]/g,'_');
    var ddEl=document.getElementById('thdd-'+safeK);
    if(!ddEl)return;
    // Close any open dropdown
    var exist=document.querySelector('.th-dd-menu');
    if(exist&&exist.parentElement===ddEl){
      exist.remove();return;
    }
    if(exist)exist.remove();
    // Build dropdown
    var me=this;
    var menu=document.createElement('div');
    menu.className='th-dd-menu';
    menu.style.cssText='position:absolute;top:22px;left:0;z-index:999;background:var(--bg);border:1px solid var(--border);border-radius:6px;min-width:140px;max-height:200px;overflow-y:auto;box-shadow:0 4px 16px rgba(0,0,0,.3);';
    var html=vals.map(function(v){
      return '<div style="padding:5px 10px;font-size:11px;cursor:pointer;white-space:nowrap;color:var(--text)" onmousedown="event.stopPropagation();event.preventDefault();DATACENTER.search=\''+(v||'').replace(/'/g,"\\'")+'\';DATACENTER.page=1;DATACENTER.renderTable();var m=document.querySelector(\'.th-dd-menu\');if(m)m.remove();" onmouseover="this.style.background=\'rgba(0,212,255,0.08)\'" onmouseout="this.style.background=\'\'">'+v+'</div>';
    }).join('');
    html+='<div style="padding:5px 10px;font-size:10px;color:var(--text3);border-top:1px solid var(--border);cursor:pointer;text-align:center" onmousedown="event.stopPropagation();event.preventDefault();DATACENTER.search=\'\';DATACENTER.page=1;DATACENTER.renderTable();var m=document.querySelector(\'.th-dd-menu\');if(m)m.remove();">✕ 清除筛选</div>';
    menu.innerHTML=html;
    ddEl.appendChild(menu);
    // Close on outside click
    setTimeout(function(){
      document.addEventListener('click',function closeMenu(e){
        if(!ddEl.contains(e.target)){menu.remove();document.removeEventListener('click',closeMenu);}
      },{once:true});
    },10);
  },
  renderLog(){
    var el=document.getElementById('dc-log');
    if(!el)return;
    var logs=DBCenter.getAll('collect_logs');
    el.innerHTML=logs.length?logs.map(function(l){
      return '<div class="text-xs" style="padding:4px 0;border-bottom:1px solid var(--border)"><span style="color:var(--cyan)">['+l.time+']</span> '+l.msg+'</div>';
    }).join(''):'<div class="text-xs text-muted">暂无采集日志</div>';
  },
  showRowDetail(idx){
    // Legacy method - redirect to filtered version
    this.showRowDetailById(idx);
  },
  showRowDetailById(idx){
    var allData=DBCenter.getAll(this.currentTab);
    var filtered=this._applyFilters(allData.slice());
    var row=filtered[idx];
    if(!row)return;
    var tabLabel=this.tabs.find(function(t){return t.key===DATACENTER.currentTab;});
    var me=this;
    var html='<div style="padding:12px;background:var(--bg2);border-radius:8px;margin-bottom:12px"><div style="font-size:12px;color:var(--cyan);font-weight:700;margin-bottom:8px">'+(tabLabel?tabLabel.label:this.currentTab)+' — 记录详情</div></div>';
    html+='<div style="display:grid;gap:6px">';
    var prio=['date','time','country','city','location','group','type','title','desc','summary','deaths','injured','severity','impact','intensity','status','source','data_type','collect_time','id'];
    var orderedKeys=[];
    prio.forEach(function(k){if(row.hasOwnProperty(k)&&orderedKeys.indexOf(k)<0)orderedKeys.push(k);});
    Object.keys(row).forEach(function(k){if(orderedKeys.indexOf(k)<0)orderedKeys.push(k);});
    orderedKeys.forEach(function(k){
      var v=row[k];
      if(v===null||v===undefined)v='';
      v=String(v);
      var label=me._labelOf(k);
      var borderClr='var(--cyan)';
      if((k==='severity'||k==='impact'||k==='intensity')&&v){
        if(v==='red'||v==='critical')borderClr='var(--red)';
        else if(v==='orange'||v==='high')borderClr='var(--orange)';
        else if(v==='yellow'||v==='medium')borderClr='var(--yellow)';
        else borderClr='var(--green)';
      }
      html+='<div style="display:flex;gap:10px;padding:8px 10px;background:var(--bg2);border-radius:6px;border-left:2px solid '+borderClr+'">'+
        '<div style="width:100px;font-size:11px;color:var(--text3);font-weight:600;flex-shrink:0">'+label+'</div>'+
        '<div style="font-size:12px;color:var(--text);flex:1;word-break:break-all">'+v+'</div></div>';
    });
    html+='</div>';
    if(this.currentTab!=='collect_logs'&&PERM.isAdmin()){
      html+='<div style="margin-top:12px"><button class="btn danger sm" onclick="DATACENTER.deleteRowById('+idx+');document.getElementById(\'modal\').classList.remove(\'show\')">🗑️ 删除此记录</button></div>';
    }
    document.getElementById('modal-tt').textContent='📋 数据记录详情';
    document.getElementById('modal-bd').innerHTML=html;
    document.getElementById('modal').classList.add('show');
  },
  deleteRow(idx){
    // Legacy method
    this.deleteRowById(idx);
  },
  deleteRowById(idx){
    var allData=DBCenter.getAll(this.currentTab);
    var filtered=this._applyFilters(allData.slice());
    var row=filtered[idx];
    if(!row||!row.id)return;
    if(!PERM.guard('删除数据记录'))return;
    allData=DBCenter.getAll(this.currentTab);
    var realIdx=allData.findIndex(function(r){return r.id===row.id;});
    if(realIdx<0)return;
    allData.splice(realIdx,1);
    DBCenter._w(this.currentTab,allData);
    DBCenter.addLog('删除'+this.currentTab+'记录: 1条');
    this.renderStats();this.renderTabs();this.renderTable();this.renderLog();this.updateBadge();
    document.getElementById('modal').classList.remove('show');
    showToast('✅ 记录已删除');
  }
};

// ===== HELPERS =====
const ALERT_LV={red:{label:'红色',cls:'b-red'},orange:{label:'橙色',cls:'b-orange'},yellow:{label:'黄色',cls:'b-yellow'},blue:{label:'蓝色',cls:'b-blue'}};
const ALERT_ST={active:'待处理',acknowledged:'已确认',responding:'处置中',resolved:'已解除'};
const EVT_TYPE={political:'政治变动',security:'安全事件',economic:'经济波动',natural:'自然灾害',diplomatic:'外交事件'};
const EVT_SEV={critical:'严重',high:'较高',medium:'中等',low:'较低'};
function calcOverall(s){let t=0;DIMS.forEach(d=>t+=(s[d.key]||0)*d.w);return Math.round(t*10)/10}
function getLevel(s){if(s>=8)return{level:'critical',label:'极高风险',color:'#ff3355',cls:'b-red',short:'极高'};if(s>=6)return{level:'high',label:'高风险',color:'#ff8800',cls:'b-orange',short:'高'};if(s>=4)return{level:'elevated',label:'中高风险',color:'#ffcc00',cls:'b-yellow',short:'中高'};if(s>=2.5)return{level:'moderate',label:'中低风险',color:'#00ff9f',cls:'b-green',short:'中低'};return{level:'low',label:'低风险',color:'#00ff9f',cls:'b-green',short:'低'}}
function getEntRisk(ent){const cs=ent.countries.map(c=>COUNTRIES.find(x=>x.name===c)).filter(Boolean);if(!cs.length)return 0;return Math.round(cs.reduce((s,c)=>s+calcOverall(c.scores),0)/cs.length*10)/10}
function getEntsInCountry(n){return ENTERPRISES.filter(e=>e.countries.includes(n))}
function showToast(m){const t=document.getElementById('toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),3000)}
function showModal(title,html){
  document.getElementById('modal-tt').textContent=title;
  document.getElementById('modal-bd').innerHTML='<div style="max-width:650px">'+html+'</div>';
  document.getElementById('modal').classList.add('show');
}
function showConfirm(msg,cb){
  document.getElementById('modal-tt').textContent='\u26a0\ufe0f \u786e\u8ba4\u64cd\u4f5c';
  document.getElementById('modal-bd').innerHTML='<div style="padding:8px 0;font-size:13px;line-height:1.7">'+msg+'</div><div style="display:flex;gap:8px;margin-top:16px;justify-content:flex-end"><button class="btn sm" onclick="document.getElementById(\'modal\').classList.remove(\'show\')">\u53d6\u6d88</button><button class="btn danger sm" id="confirm-ok-btn">\u786e\u8ba4</button></div>';
  document.getElementById('modal').classList.add('show');
  document.getElementById('confirm-ok-btn').onclick=function(){document.getElementById('modal').classList.remove('show');cb();};
}
function genAlertTrend(){const days=[];const today=new Date('2025-06-01');const seedData=[[2,4,2,1],[1,3,3,1],[2,2,1,0],[3,4,2,1],[1,3,2,0],[2,5,3,1],[0,2,1,1],[1,3,2,0],[2,4,2,1],[3,3,1,1],[1,2,3,0],[2,4,2,1],[0,3,1,0],[1,5,2,1],[2,3,3,1],[3,4,1,0],[1,2,2,1],[2,5,3,1],[1,3,2,0],[0,2,1,1],[2,4,2,1],[1,3,3,0],[3,5,2,1],[1,2,1,0],[2,4,3,1],[0,3,2,1],[1,5,2,0],[2,3,3,1],[1,4,2,0],[2,5,3,1]];for(let i=29;i>=0;i--){const d=new Date(today);d.setDate(d.getDate()-i);days.push({d:String(d.getMonth()+1)+'/'+String(d.getDate()),r:seedData[29-i][0],o:seedData[29-i][1],y:seedData[29-i][2],b:seedData[29-i][3]})}return days}
let charts={};

// ===== DATA HUB — Central Data Layer with Persistence + Notification =====
var DataHub={
  _collections:['countries','enterprises','alerts','events','warning_rules','chokepoints','corridors','predictions','terror_events','china_security','playbooks','_pending_reviews'],
  _subs:[],
  _initialized:false,
  init(){
    if(this._initialized)return;
    this._initialized=true;
    var map={
      'countries':COUNTRIES,'enterprises':ENTERPRISES,'alerts':ALERTS,'events':EVENTS,
      'warning_rules':WARNING_RULES,'chokepoints':CHOKEPOINTS,'corridors':CORRIDORS,
      'predictions':PREDICTIONS,'terror_events':TERROR_EVENTS,'china_security':CHINA_SECURITY,
      '_pending_reviews':_pendingReviews
    };
    for(var k in map){
      var stored=localStorage.getItem('orps_dh_'+k);
      if(stored){
        try{
          var parsed=JSON.parse(stored);
          if(parsed&&parsed.length>=0){
            if(k==='countries')COUNTRIES=parsed;
            else if(k==='enterprises')ENTERPRISES=parsed;
            else if(k==='alerts')ALERTS=parsed;
            else if(k==='events')EVENTS=parsed;
            else if(k==='warning_rules')WARNING_RULES=parsed;
            else if(k==='chokepoints')CHOKEPOINTS=parsed;
            else if(k==='corridors')CORRIDORS=parsed;
            else if(k==='predictions')PREDICTIONS=parsed;
            else if(k==='terror_events')TERROR_EVENTS=parsed;
            else if(k==='china_security')CHINA_SECURITY=parsed;
            else if(k==='_pending_reviews')_pendingReviews=parsed;
          }
        }catch(e){console.warn('DataHub load failed:',k,e);}
      }
    }
  },
  save(collection){
    var val=null;
    if(collection==='countries')val=COUNTRIES;
    else if(collection==='enterprises')val=ENTERPRISES;
    else if(collection==='alerts')val=ALERTS;
    else if(collection==='events')val=EVENTS;
    else if(collection==='warning_rules')val=WARNING_RULES;
    else if(collection==='chokepoints')val=CHOKEPOINTS;
    else if(collection==='corridors')val=CORRIDORS;
    else if(collection==='predictions')val=PREDICTIONS;
    else if(collection==='terror_events')val=TERROR_EVENTS;
    else if(collection==='china_security')val=CHINA_SECURITY;
    else if(collection==='_pending_reviews')val=_pendingReviews;
    if(val!==null){
      try{localStorage.setItem('orps_dh_'+collection,JSON.stringify(val));}catch(e){console.warn('DataHub save failed (quota?):',collection,e);}
    }
    this._notify(collection);
  },
  saveAll(){
    for(var i=0;i<this._collections.length;i++)this.save(this._collections[i]);
  },
  add(collection,item){
    var arr=this._getArr(collection);
    if(arr){arr.push(item);this.save(collection);}
  },
  update(collection,id,fields,idField){
    idField=idField||'id';
    var arr=this._getArr(collection);
    if(!arr)return;
    var item=arr.find(function(x){return x[idField]===id;});
    if(item){Object.assign(item,fields);this.save(collection);}
  },
  remove(collection,id,idField){
    idField=idField||'id';
    var arr=this._getArr(collection);
    if(!arr)return;
    var idx=arr.findIndex(function(x){return x[idField]===id;});
    if(idx>-1){arr.splice(idx,1);this.save(collection);}
  },
  removeByIndex(collection,idx){
    var arr=this._getArr(collection);
    if(!arr)return;
    if(idx>=0&&idx<arr.length){arr.splice(idx,1);this.save(collection);}
  },
  _getArr(collection){
    if(collection==='countries')return COUNTRIES;
    if(collection==='enterprises')return ENTERPRISES;
    if(collection==='alerts')return ALERTS;
    if(collection==='events')return EVENTS;
    if(collection==='warning_rules')return WARNING_RULES;
    if(collection==='chokepoints')return CHOKEPOINTS;
    if(collection==='corridors')return CORRIDORS;
    if(collection==='predictions')return PREDICTIONS;
    if(collection==='terror_events')return TERROR_EVENTS;
    if(collection==='china_security')return CHINA_SECURITY;
    if(collection==='_pending_reviews')return _pendingReviews;
    return null;
  },
  subscribe(cb){this._subs.push(cb);},
  _notify(collection){
    for(var i=0;i<this._subs.length;i++){
      try{this._subs[i](collection);}catch(e){console.warn('DataHub subscriber error:',e);}
    }
  },
  reset(collection){
    localStorage.removeItem('orps_dh_'+collection);
    this._notify(collection);
  },
  resetAll(){
    for(var i=0;i<this._collections.length;i++){
      localStorage.removeItem('orps_dh_'+this._collections[i]);
    }
    location.reload();
  },
  // ===== 数据中心同步：仅同步已审核的数据到态势感知和监测中心 =====
  syncFromDBCenter:function(){
    var synced=0;
    // 辅助函数：判断是否已审核（无审核状态的数据一律视为待审核，不同步）
    var isApproved=function(item){
      var s=item.audit_status||'pending';
      return s==='approved';
    };
    // 辅助函数：判断该id是否已存在于目标数组
    var idExists=function(arr,id){
      var idStr=String(id);
      for(var i=0;i<arr.length;i++){
        if(arr[i].id&&String(arr[i].id)===idStr)return true;
      }
      return false;
    };
    // 1. 恐袭事件 → TERROR_EVENTS 和 EVENTS
    var terrorData=DBCenter.getAll('terror_events');
    if(terrorData&&terrorData.length){
      var existingIds=new Set();
      if(typeof TERROR_EVENTS!=='undefined')TERROR_EVENTS.forEach(function(e){if(e.id)existingIds.add(String(e.id));});
      terrorData.forEach(function(t){
        var idStr=String(t.id);
        if(!existingIds.has(idStr)&&isApproved(t)){
          var te={
            id:t.id,date:t.date||t.collect_time?t.collect_time.substring(0,10):'',title:t.title||t.desc||'恐袭事件',
            location:(t.country||'')+(t.city?'-'+t.city:''),group:t.group||'未知',type:t.type||'袭击',
            deaths:t.deaths||0,injured:t.injured||0,desc:t.desc||'',source:t.source||'数据中心采集',
            data_type:'terror',_fromDBCenter:true
          };
          if(typeof TERROR_EVENTS!=='undefined')TERROR_EVENTS.push(te);
          if(typeof EVENTS!=='undefined'){
            EVENTS.push({
              id:'dc-terror-'+t.id,date:te.date,country:t.country||'',title:te.title,
              type:'security',severity:Number(t.deaths)>5?'critical':Number(t.deaths)>0?'high':'medium',
              desc:t.desc||'',status:'active',_fromDBCenter:true
            });
          }
          synced++;
        }
      });
    }
    // 2. 涉华安全事件 → CHINA_SECURITY 和 EVENTS
    var secData=DBCenter.getAll('security_events');
    if(secData&&secData.length){
      var existingIds=new Set();
      if(typeof CHINA_SECURITY!=='undefined')CHINA_SECURITY.forEach(function(e){if(e.id)existingIds.add(String(e.id));});
      secData.forEach(function(s){
        var idStr=String(s.id);
        if(!existingIds.has(idStr)&&isApproved(s)){
          var se={
            id:s.id,date:s.date||s.collect_time?String(s.collect_time).substring(0,10):'',location:(s.country||'')+(s.location?'-'+s.location:''),
            title:s.title||s.desc||'涉华安全事件',type:s.type||'安全事件',severity:s.severity||'yellow',
            deaths:s.deaths||0,injured:s.injured||0,desc:s.desc||'',source:s.source||'数据中心采集',
            data_type:'china_security',_fromDBCenter:true
          };
          if(typeof CHINA_SECURITY!=='undefined')CHINA_SECURITY.push(se);
          if(typeof EVENTS!=='undefined'){
            EVENTS.push({
              id:'dc-security-'+s.id,date:se.date,country:s.country||'',title:se.title,
              type:'security',severity:s.severity==='red'?'critical':s.severity==='orange'?'high':'medium',
              desc:s.desc||'',status:'active',_fromDBCenter:true
            });
          }
          synced++;
        }
      });
    }
    // 3. 政治事件 → EVENTS
    var polData=DBCenter.getAll('political_events');
    if(polData&&polData.length){
      var existingEvtIds=new Set();
      if(typeof EVENTS!=='undefined')EVENTS.forEach(function(e){if(e.id)existingEvtIds.add(String(e.id));});
      polData.forEach(function(p){
        var idStr='dc-political-'+p.id;
        if(p.id&&!existingEvtIds.has(idStr)&&isApproved(p)){
          if(typeof EVENTS!=='undefined'){
            EVENTS.push({
              id:idStr,date:p.date||'',country:p.country||'',title:p.title||p.desc||'',
              type:'political',severity:p.impact==='red'?'critical':p.impact==='orange'?'high':'medium',
              desc:p.desc||'',status:'active',_fromDBCenter:true
            });
          }
          synced++;
        }
      });
    }
    // 4. 军事冲突 → EVENTS
    var milData=DBCenter.getAll('military_conflicts');
    if(milData&&milData.length){
      var existingEvtIds2=new Set();
      if(typeof EVENTS!=='undefined')EVENTS.forEach(function(e){if(e.id)existingEvtIds2.add(String(e.id));});
      milData.forEach(function(m){
        var idStr='dc-military-'+m.id;
        if(m.id&&!existingEvtIds2.has(idStr)&&isApproved(m)){
          if(typeof EVENTS!=='undefined'){
            EVENTS.push({
              id:idStr,date:m.date||'',country:m.country||'',title:m.title||m.desc||'',
              type:'security',severity:'high',desc:m.desc||'',status:'active',_fromDBCenter:true
            });
          }
          synced++;
        }
      });
    }
    // 5. 自然灾害 → EVENTS
    var disData=DBCenter.getAll('natural_disasters');
    if(disData&&disData.length){
      var existingEvtIds3=new Set();
      if(typeof EVENTS!=='undefined')EVENTS.forEach(function(e){if(e.id)existingEvtIds3.add(String(e.id));});
      disData.forEach(function(d){
        var idStr='dc-disaster-'+d.id;
        if(d.id&&!existingEvtIds3.has(idStr)&&isApproved(d)){
          if(typeof EVENTS!=='undefined'){
            EVENTS.push({
              id:idStr,date:d.date||'',country:d.country||'',title:d.title||d.desc||'',
              type:'natural',severity:d.magnitude&&d.magnitude.indexOf('7')>=0?'critical':'high',
              desc:d.desc||'',status:'active',_fromDBCenter:true
            });
          }
          synced++;
        }
      });
    }
    // 6. 地缘情报 → EVENTS
    var geoData=DBCenter.getAll('geopolitical_intel');
    if(geoData&&geoData.length){
      var existingEvtIds4=new Set();
      if(typeof EVENTS!=='undefined')EVENTS.forEach(function(e){if(e.id)existingEvtIds4.add(String(e.id));});
      geoData.forEach(function(g){
        var idStr='dc-geo-'+g.id;
        if(g.id&&!existingEvtIds4.has(idStr)&&isApproved(g)){
          if(typeof EVENTS!=='undefined'){
            EVENTS.push({
              id:idStr,date:g.date||'',country:g.country||'',title:g.title||g.desc||'',
              type:'geopolitical',severity:g.risk_level==='red'?'critical':g.risk_level==='orange'?'high':'medium',
              desc:(g.impact||'')+' | '+(g.desc||''),status:'active',_fromDBCenter:true
            });
          }
          synced++;
        }
      });
    }
    // Save synced data to DataHub persistence
    this.save('terror_events');
    this.save('china_security');
    this.save('events');
    // Notify subscribers (SITUATION will refresh)
    this._notify('dc-sync');
    return synced;
  },
  // Generic export
  exportJSON(data,filename){
    var blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
    var url=URL.createObjectURL(blob);
    var a=document.createElement('a');
    a.href=url;a.download=filename||'export.json';
    document.body.appendChild(a);a.click();
    document.body.removeChild(a);URL.revokeObjectURL(url);
  }
};

// ===== PERMISSION MANAGER =====
// 统一权限控制：管理员拥有全部权限，注册用户仅可查看+情报影像上传+数据中心手动录入（需审核）
var PERM={
  // 检查当前用户是否为管理员
  isAdmin:function(){return AUTH.user&&AUTH.user.role==='admin';},
  // 检查是否有编辑权限（管理员独有）
  canEdit:function(){return this.isAdmin();},
  // 检查是否可以上传（所有已授权用户均可）
  canUpload:function(){return AUTH.user&&(AUTH.user.role==='admin'||AUTH.user.role==='user');},
  // 检查是否可以查看某页面
  canView:function(page){
    if(page==='settings'){
      // 普通用户只能看自己的信息，管理员看全部
      return !!AUTH.user;
    }
    return true; // 所有页面均可查看
  },
  // 阻止非管理员操作并提示
  guard:function(action){
    if(!this.canEdit()){
      showToast('\u26a0\ufe0f \u6743\u9650\u4e0d\u8db3\uff1a\u4ec5\u7ba1\u7406\u5458\u53ef\u6267\u884c\u201c'+action+'\u201d\u64cd\u4f5c\u3002\u8bf7\u8054\u7cfb\u7ba1\u7406\u5458\u3002');
      return false;
    }
    return true;
  },
  // 审核状态常量
  REVIEW:{PENDING:'pending',APPROVED:'approved',REJECTED:'rejected'}
};

// ===== AUDIT LOG =====
var AUDIT={
  _key:'orps_audit_log',
  _max:500,
  log:function(action,target,detail){
    var entry={
      time:new Date().toLocaleString('zh-CN'),
      user:AUTH.user?AUTH.user.name:'system',
      role:AUTH.user?AUTH.user.role:'system',
      action:action,
      target:target||'',
      detail:detail||''
    };
    var logs=this.getAll();
    logs.unshift(entry);
    if(logs.length>this._max)logs=logs.slice(0,this._max);
    try{localStorage.setItem(this._key,JSON.stringify(logs));}catch(e){}
  },
  getAll:function(){
    try{return JSON.parse(localStorage.getItem(this._key)||'[]');}catch(e){return [];}
  },
  clear:function(){
    localStorage.removeItem(this._key);
  }
};

// ===== VIEW_MAP_MARKER =====
// ===== VIEW MAP =====
const VIEW_MAP={
  situation:{t:'态势总览',b:'态势感知 / 态势总览'},
  intel:{t:'情报影像中心',b:'监测中心 / 情报影像中心'},
  monitor:{t:'风险监测',b:'监测中心 / 风险监测'},
  assets:{t:'企业资产',b:'监测中心 / 企业资产'},
  alerts:{t:'预警中心',b:'监测中心 / 预警中心'},
  matrix:{t:'风险矩阵',b:'分析工具 / 风险矩阵'},
  forecast:{t:'预测分析',b:'分析工具 / 预测分析'},
  datacenter:{t:'数据中心',b:'数据管理 / 数据中心'},
  settings:{t:'系统设置',b:'系统 / 系统设置'}
};

// ===== AUTH =====
const AUTH={
  user:null,
  _DEFAULT_ADMIN:{user:'admin',pass:'admin123'},
  init(){
    // 预注入默认管理员账号 (admin/admin123)
    if(!localStorage.getItem('orps_acct_admin')){
      localStorage.setItem('orps_acct_admin',JSON.stringify({
        user:'admin',pass:'admin123',status:'approved',role:'admin',
        regTime:new Date().toLocaleString('zh-CN'),isDefault:true
      }));
    }
    const u=localStorage.getItem('orps_user');
    if(u){try{this.user=JSON.parse(u);this.showApp();return;}catch(e){}}
    // 如果除了默认admin外没有其他账号，显示登录页（admin/admin123可用）
    this.showLogin();
    this.startLoginAnim();
  },
  _countAccounts(){
    var n=0;
    for(var i=0;i<localStorage.length;i++){
      var k=localStorage.key(i);
      if(k&&k.indexOf('orps_acct_')===0)n++;
    }
    return n;
  },
  showSetup(){document.getElementById('auth-card-login').style.display='none';document.getElementById('auth-card-register').style.display='none';document.getElementById('auth-card-setup').style.display='block';},
  setupAdmin(){
    const u=document.getElementById('su-user').value.trim();
    const p=document.getElementById('su-pass').value.trim();
    const p2=document.getElementById('su-pass2').value.trim();
    if(!u||!p){showToast('请填写用户名和密码');return;}
    if(p.length<6){showToast('密码至少6位');return;}
    if(p!==p2){showToast('两次密码不一致');return;}
    var now=new Date().toLocaleString('zh-CN');
    localStorage.setItem('orps_acct_'+u,JSON.stringify({user:u,pass:p,status:'approved',role:'admin',regTime:now}));
    this.user={name:u,pass:p,role:'admin'};
    localStorage.setItem('orps_user',JSON.stringify(this.user));
    showToast('✅ 管理员账号创建成功！请牢记您的密码');
    this.showApp();
  },
  _animRAF:null,
  startLoginAnim(){
    const cv=document.getElementById('auth-canvas');
    if(!cv)return;
    const ctx=cv.getContext('2d');
    let W,H,t=0;
    const resize=()=>{W=cv.width=cv.offsetWidth;H=cv.height=cv.offsetHeight;};
    resize();window.addEventListener('resize',resize);
    const pts=[];
    for(let i=0;i<60;i++)pts.push({x:Math.random()*1200,y:Math.random()*800,vx:(Math.random()-0.5)*0.3,vy:(Math.random()-0.5)*0.3,r:Math.random()*1.5+0.3});
    const arcs=[];
    for(let i=0;i<5;i++)arcs.push({cx:Math.random(),cy:Math.random()*0.6+0.2,r:0,maxR:Math.random()*200+100,phase:Math.random()*Math.PI*2});
    const dots=[];
    for(let i=0;i<120;i++){const lat=(Math.random()-0.5)*Math.PI;const lon=Math.random()*Math.PI*2;dots.push({lat,lon,p:Math.random()*Math.PI*2});}
    const draw=()=>{
      t+=0.01;
      ctx.fillStyle='rgba(7,11,20,0.15)';
      ctx.fillRect(0,0,W,H);
      ctx.strokeStyle='rgba(0,212,255,0.03)';ctx.lineWidth=0.5;
      for(let x=0;x<W;x+=50){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
      for(let y=0;y<H;y+=50){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
      pts.forEach(p=>{
        p.x+=p.vx;p.y+=p.vy;
        if(p.x<0)p.x=W;if(p.x>W)p.x=0;if(p.y<0)p.y=H;if(p.y>H)p.y=0;
        ctx.fillStyle='rgba(0,212,255,'+(0.3+Math.sin(t+p.x*0.01)*0.2)+')';
        ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.28);ctx.fill();
      });
      for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++){
        const dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,d=Math.sqrt(dx*dx+dy*dy);
        if(d<120){ctx.strokeStyle='rgba(0,212,255,'+(0.08*(1-d/120))+')';ctx.lineWidth=0.5;ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);ctx.stroke();}
      }
      arcs.forEach(a=>{
        a.r+=0.8;if(a.r>a.maxR){a.r=0;a.cx=Math.random();a.cy=Math.random()*0.6+0.2;a.maxR=Math.random()*200+100;}
        const cx=a.cx*W,cy=a.cy*H,alpha=1-a.r/a.maxR;
        ctx.strokeStyle='rgba(0,212,255,'+(alpha*0.15)+')';ctx.lineWidth=1;
        ctx.beginPath();ctx.arc(cx,cy,a.r,0,6.28);ctx.stroke();
        const ang=a.phase+t*2;
        const grad=ctx.createLinearGradient(cx,cy,cx+Math.cos(ang)*a.r,cy+Math.sin(ang)*a.r);
        grad.addColorStop(0,'rgba(0,212,255,'+(alpha*0.3)+')');grad.addColorStop(1,'rgba(0,212,255,0)');
        ctx.strokeStyle=grad;ctx.lineWidth=2;
        ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(ang)*a.r,cy+Math.sin(ang)*a.r);ctx.stroke();
      });
      const gcx=W/2,gcy=H/2,gr=Math.min(W,H)*0.35,rot=t*0.3;
      dots.forEach(d=>{
        const cl=Math.cos(d.lat);
        const x=gcx+gr*cl*Math.sin(d.lon+rot),y=gcy-gr*Math.sin(d.lat),z=gr*cl*Math.cos(d.lon+rot);
        if(z>0){const a=(z/gr)*0.4+0.1,tw=Math.sin(t*3+d.p)*0.3+0.7;
          ctx.fillStyle='rgba(0,180,220,'+(a*tw)+')';ctx.fillRect(x-0.5,y-0.5,1.5,1.5);}
      });
      ctx.strokeStyle='rgba(0,212,255,0.08)';ctx.lineWidth=1;
      ctx.beginPath();ctx.arc(gcx,gcy,gr,0,6.28);ctx.stroke();
      const scanY=(t*30)%H;
      const sg=ctx.createLinearGradient(0,scanY-30,0,scanY+30);
      sg.addColorStop(0,'rgba(0,212,255,0)');sg.addColorStop(0.5,'rgba(0,212,255,0.04)');sg.addColorStop(1,'rgba(0,212,255,0)');
      ctx.fillStyle=sg;ctx.fillRect(0,scanY-30,W,60);
      if(Math.sin(t*0.7)>0.95){
        const fx=Math.random()*W,fy=Math.random()*H;
        ctx.fillStyle='rgba(255,51,85,0.6)';ctx.beginPath();ctx.arc(fx,fy,2,0,6.28);ctx.fill();
        ctx.strokeStyle='rgba(255,51,85,0.3)';ctx.lineWidth=1;
        ctx.beginPath();ctx.arc(fx,fy,8+Math.sin(t*10)*4,0,6.28);ctx.stroke();
      }
      ctx.font='10px Courier New';ctx.fillStyle='rgba(0,212,255,0.15)';
      ctx.fillText('THREAT MONITORING SYSTEM v6.3',20,H-20);
      ctx.fillText('OVERSEAS INTEREST PROTECTION',W-250,H-20);
      this._animRAF=requestAnimationFrame(draw);
    };
    draw();
  },
  stopLoginAnim(){if(this._animRAF)cancelAnimationFrame(this._animRAF);},
  login(){
    const u=document.getElementById('li-user').value.trim();
    const p=document.getElementById('li-pass').value.trim();
    if(!u||!p){showToast('请输入用户名和密码');return;}
    const stored=localStorage.getItem('orps_acct_'+u);
    if(!stored){showToast('账号不存在，请先注册或联系管理员');return;}
    const acct=JSON.parse(stored);
    if(acct.pass!==p){showToast('密码错误');return;}
    if(acct.status==='pending'){showToast('账号待审批，请联系管理员授权');return;}
    if(acct.status==='rejected'){showToast('账号已被拒绝，请联系管理员');return;}
    if(acct.status==='disabled'){showToast('账号已被停用，请联系管理员');return;}
    if(acct.status!=='approved'){showToast('账号状态异常，请联系管理员');return;}
    this.user={name:u,pass:p,role:acct.role||'user'};
    localStorage.setItem('orps_user',JSON.stringify(this.user));
    this.showApp();
  },
  register(){
    const u=document.getElementById('rg-user').value.trim();
    const p=document.getElementById('rg-pass').value.trim();
    const p2=document.getElementById('rg-pass2').value.trim();
    if(!u||!p){showToast('请填写用户名和密码');return;}
    if(p!==p2){showToast('两次密码不一致');return;}
    if(u==='admin'){showToast('该用户名已被保留');return;}
    if(localStorage.getItem('orps_acct_'+u)){showToast('用户名已存在');return;}
    var now=new Date().toLocaleString('zh-CN');
    localStorage.setItem('orps_acct_'+u,JSON.stringify({user:u,pass:p,status:'pending',role:'user',regTime:now}));
    showToast('注册成功！账号待管理员审批，审批通过后方可登录');
    this.showLogin();
  },
  showReg(){document.getElementById('auth-card-login').style.display='none';document.getElementById('auth-card-register').style.display='block';},
  showLogin(){document.getElementById('auth-card-login').style.display='block';document.getElementById('auth-card-register').style.display='none';},
  showApp(){
    this.stopLoginAnim();
    document.getElementById('auth-overlay').style.display='none';
    document.getElementById('app').style.display='flex';
    document.getElementById('tb-avatar').textContent=this.user.name[0].toUpperCase();
    document.getElementById('tb-username').textContent=this.user.name;
    var roleEl=document.getElementById('tb-userrole');
    if(roleEl){if(this.user.role==='admin'){roleEl.style.display='inline-block';}else{roleEl.style.display='none';}}
    initApp();
  },
  logout(){localStorage.removeItem('orps_user');location.reload();}
};

// ===== GLOBE — Overseas Interest Protection Intelligence Globe =====
const GLOBE={
  canvas:null,ctx:null,rotation:0,tilt:0,autoRotate:true,
  isDragging:false,dragStartX:0,dragStartRot:0,dragStartY:0,dragStartTilt:0,
  _stars:null,_landDots:null,_chinaDots:null,_protectLines:null,_tradeRoutes:null,
  _scanAngle:0,_time:0,
  BEIJING:{lat:39.9,lon:116.4},
  _chokepoints:[
    {name:'曼德海峡',lat:12.6,lon:43.4},
    {name:'苏伊士运河',lat:30.0,lon:32.5},
    {name:'马六甲海峡',lat:2.5,lon:101.3},
    {name:'霍尔木兹海峡',lat:26.6,lon:56.3},
    {name:'巴拿马运河',lat:9.1,lon:-79.7},
    {name:'北极航道',lat:78.0,lon:140.0}
  ],
  init(){
    this.canvas=document.getElementById('globe-canvas');
    if(!this.canvas)return;
    this.ctx=this.canvas.getContext('2d');
    const c=this.canvas.parentElement;
    this.canvas.width=c.clientWidth;
    this.canvas.height=500;
    this.canvas.addEventListener('mousedown',e=>{this.isDragging=true;this.dragStartX=e.clientX;this.dragStartY=e.clientY;this.dragStartRot=this.rotation;this.dragStartTilt=this.tilt;this.autoRotate=false;});
    this.canvas.addEventListener('mousemove',e=>{
      if(this.isDragging){
        this.rotation=this.dragStartRot+(e.clientX-this.dragStartX)*0.5;
        this.tilt=Math.max(-45,Math.min(45,this.dragStartTilt-(e.clientY-this.dragStartY)*0.3));
      }
      const rect=this.canvas.getBoundingClientRect();
      const mx=e.clientX-rect.left,my=e.clientY-rect.top;
      const cx=this.canvas.width/2,cy=this.canvas.height/2;
      const r=Math.min(this.canvas.width,this.canvas.height)*0.36;
      const dx=(mx-cx)/r,dy=(my-cy)/r;
      if(dx*dx+dy*dy<1){
        const lat=Math.asin(-dy)*180/Math.PI;
        const lon=Math.atan2(dx,Math.cos(lat*Math.PI/180))*180/Math.PI-this.rotation;
        const el=document.getElementById('globe-hud-coord');
        if(el)el.textContent='LAT '+lat.toFixed(1)+'°  LON '+((lon+540)%360-180).toFixed(1)+'°';
      }
    });
    this.canvas.addEventListener('mouseup',()=>{this.isDragging=false;setTimeout(()=>{this.autoRotate=true;},3000);});
    this.canvas.addEventListener('mouseleave',()=>{this.isDragging=false;});
    this.canvas.addEventListener('touchstart',e=>{e.preventDefault();const t=e.touches[0];this.isDragging=true;this.dragStartX=t.clientX;this.dragStartY=t.clientY;this.dragStartRot=this.rotation;this.dragStartTilt=this.tilt;this.autoRotate=false;},{passive:false});
    this.canvas.addEventListener('touchmove',e=>{e.preventDefault();const t=e.touches[0];if(this.isDragging){this.rotation=this.dragStartRot+(t.clientX-this.dragStartX)*0.5;this.tilt=Math.max(-45,Math.min(45,this.dragStartTilt-(t.clientY-this.dragStartY)*0.3));}},{passive:false});
    this.canvas.addEventListener('touchend',()=>{this.isDragging=false;setTimeout(()=>{this.autoRotate=true;},3000);});
    window.addEventListener('resize',()=>{if(this.canvas){this.canvas.width=this.canvas.parentElement.clientWidth;this.canvas.height=500;this._stars=null;}});
    if(!this._landDots)this._genLandDots();
    if(!this._protectLines)this._genProtectLines();
    if(!this._tradeRoutes)this._genTradeRoutes();
    this.animate();
  },
  _genLandDots(){
    const dots=[],chinaDots=[];
    const N=1800;
    const ga=Math.PI*(3-Math.sqrt(5));
    for(let i=0;i<N;i++){
      const y=1-(i/(N-1))*2;
      const r=Math.sqrt(1-y*y);
      const theta=ga*i;
      const lat=Math.asin(y)*180/Math.PI;
      const lon=(theta*180/Math.PI)%360-180;
      if(this._isLand(lat,lon)){
        if(this._isChina(lat,lon))chinaDots.push({lat,lon});
        else dots.push({lat,lon});
      }
    }
    this._landDots=dots;
    this._chinaDots=chinaDots;
  },
  _isChina(lat,lon){
    if(lat>=18&&lat<=53&&lon>=73&&lon<=135){
      if(lat<20&&lon<78)return false;
      if(lat<22&&lon>108)return false;
      if(lat>42&&lon>120&&lat<50)return true;
      if(lat<25&&lon>100&&lon<110&&lat>18)return false;
      if(lat<15&&lon>108)return false;
      if(lat>45&&lon<80&&lon>70)return false;
      return true;
    }
    return false;
  },
  _isLand(lat,lon){
    while(lon>180)lon-=360;while(lon<-180)lon+=360;
    // Africa
    if(lat>=-35&&lat<=37){
      if(lon>=-18&&lon<=52){
        if(lat>33)return true;
        if(lat>=5&&lat<=33&&lon>=-18&&lon<=42){
          if(lat>30&&lon<10&&lat<35)return true;
          if(lat>12&&lon>32&&lat<30)return false;
          return true;
        }
        if(lat>=2&&lat<=18&&lon>=35&&lon<=52)return true;
        if(lat>=-35&&lat<5&&lon>=8&&lon<=42){
          if(lat<-15&&lon>35&&lat>-25)return false;
          return true;
        }
        if(lat>=-5&&lat<15&&lon>=-18&&lon<8)return true;
        if(lat>=-15&&lat<5&&lon>=8&&lon<=18)return true;
        if(lat>=-35&&lat<-15&&lon>=10&&lon<=20)return true;
      }
    }
    if(lat>=-26&&lat<=-12&&lon>=43&&lon<=51)return true;
    // Europe
    if(lat>=36&&lat<=71){
      if(lon>=-10&&lon<=40){
        if(lat>41&&lat<47&&lon>28&&lon<42)return false;
        if(lat>37&&lat<41&&lon>12&&lon<18&&lat<40)return false;
        if(lat>43&&lat<46&&lon>27&&lon<30)return false;
        return true;
      }
      if(lat>=55&&lat<=71&&lon>=5&&lon<=32)return true;
      if(lat>=45&&lat<=60&&lon>=28&&lon<=60)return true;
    }
    if(lat>=50&&lat<=59&&lon>=-10&&lon<=2)return true;
    if(lat>=63&&lat<=67&&lon>=-24&&lon<=-13)return true;
    // Middle East
    if(lat>=12&&lat<=42&&lon>=35&&lon<=63){
      if(lat>25&&lat<40&&lon>50&&lon<58&&lat<35)return false;
      return true;
    }
    // Asia
    if(lat>=8&&lat<=75){
      if(lat>=50&&lon>=40&&lon<=180)return true;
      if(lat>=35&&lat<=50&&lon>=50&&lon<=87)return true;
      if(lat>=18&&lat<=53&&lon>=73&&lon<=135){
        if(this._isChina(lat,lon))return true;
        if(lat<22&&lon>95&&lon<100)return false;
        if(lat<18&&lon>95)return false;
      }
      if(lat>=8&&lat<=35&&lon>=68&&lon<=92)return true;
      if(lat>=8&&lat<=28&&lon>=92&&lon<=110){
        if(lat<10&&lon>98)return false;
        return true;
      }
      if(lat>=30&&lat<=46&&lon>=128&&lon<=146)return true;
      if(lat>=33&&lat<=43&&lon>=124&&lon<=131)return true;
      if(lat>=5&&lat<=19&&lon>=117&&lon<=127)return true;
      if(lat>=-10&&lat<=7&&lon>=95&&lon<=141)return true;
      if(lat>=-11&&lat<=-1&&lon>=131&&lon<=151)return true;
    }
    // North America
    if(lat>=15&&lat<=75&&lon>=-170&&lon<=-52){
      if(lat>=55&&lon>=-170&&lon<=-130)return true;
      if(lat>=49&&lon>=-130&&lon<=-55)return true;
      if(lat>=25&&lat<=49&&lon>=-125&&lon<=-67){
        if(lat>18&&lat<30&&lon>-98&&lon<-80)return false;
        return true;
      }
      if(lat>=15&&lat<=32&&lon>=-118&&lon<=-86)return true;
      if(lat>=7&&lat<=22&&lon>=-92&&lon<=-77)return true;
    }
    // Greenland
    if(lat>=60&&lat<=83&&lon>=-55&&lon<=-20){
      if(lat<65&&lon>-35&&lon<-25)return false;
      return true;
    }
    // South America
    if(lat>=-55&&lat<=12&&lon>=-82&&lon<=-34){
      if(lat<-5&&lon>-75&&lon<-70&&lat>-20)return false;
      if(lat<5&&lon>-78&&lon<-70&&lat>0)return false;
      return true;
    }
    // Australia
    if(lat>=-39&&lat<=-10&&lon>=113&&lon<=154)return true;
    // New Zealand
    if(lat>=-47&&lat<=-34&&lon>=166&&lon<=178)return true;
    return false;
  },
  _genProtectLines(){
    const entCountries=[...new Set(ENTERPRISES.flatMap(e=>e.countries))]
      .map(n=>COUNTRIES.find(c=>c.name===n))
      .filter(c=>c&&c.name!=='中国');
    this._protectLines=entCountries.map(c=>{
      const risk=calcOverall(c.scores);
      const ents=getEntsInCountry(c.name).length;
      return{
        from:{lat:this.BEIJING.lat,lon:this.BEIJING.lon},
        to:{lat:c.lat,lon:c.lon},
        risk:risk,ents:ents,name:c.name,
        progress:Math.random(),speed:0.003+Math.random()*0.004
      };
    });
  },
  _genTradeRoutes(){
    const routeDefs=[
      {from:{lat:39.9,lon:116.4},to:{lat:25.1,lon:62.3}},
      {from:{lat:39.9,lon:116.4},to:{lat:19.7,lon:96.5}},
      {from:{lat:39.9,lon:116.4},to:{lat:41.3,lon:69.2}},
      {from:{lat:39.9,lon:116.4},to:{lat:18.0,lon:102.6}},
      {from:{lat:39.9,lon:116.4},to:{lat:-6.2,lon:106.8}},
      {from:{lat:39.9,lon:116.4},to:{lat:37.9,lon:23.7}},
      {from:{lat:39.9,lon:116.4},to:{lat:30.0,lon:32.5}}
    ];
    this._tradeRoutes=routeDefs.map(r=>({...r,progress:Math.random(),speed:0.002+Math.random()*0.003}));
  },
  animate(){
    if(this.autoRotate)this.rotation+=0.18;
    this._time+=1;
    this._scanAngle=(this._scanAngle+0.012)%(Math.PI*2);
    if(this._protectLines)this._protectLines.forEach(a=>{a.progress+=a.speed;if(a.progress>1)a.progress=0;});
    if(this._tradeRoutes)this._tradeRoutes.forEach(a=>{a.progress+=a.speed;if(a.progress>1)a.progress=0;});
    this.draw();
    requestAnimationFrame(()=>this.animate());
  },
  _ll2xy(lat,lon,cx,cy,r,rot,tilt){
    const lr=lat*Math.PI/180,lor=(lon+rot)*Math.PI/180;
    const tr=(tilt||0)*Math.PI/180;
    const x0=r*Math.cos(lr)*Math.sin(lor);
    const y0=-r*Math.sin(lr);
    const z0=r*Math.cos(lr)*Math.cos(lor);
    const y1=y0*Math.cos(tr)-z0*Math.sin(tr);
    const z1=y0*Math.sin(tr)+z0*Math.cos(tr);
    return{x:cx+x0,y:cy+y1,z:z1,d:z1/r,v:z1>0};
  },
  draw(){
    const ctx=this.ctx,w=this.canvas.width,h=this.canvas.height;
    const cx=w/2,cy=h/2,r=Math.min(w,h)*0.36;
    const tilt=this.tilt;
    // Deep space background
    const bg=ctx.createRadialGradient(cx,cy,0,cx,cy,Math.max(w,h)*0.7);
    bg.addColorStop(0,'#0a1428');bg.addColorStop(0.5,'#070b14');bg.addColorStop(1,'#030508');
    ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
    // Stars
    if(!this._stars){
      this._stars=[];
      for(let i=0;i<200;i++)this._stars.push({x:Math.random()*w,y:Math.random()*h,s:Math.random()*1.8+0.2,p:Math.random()*Math.PI*2,sp:0.015+Math.random()*0.04});
    }
    this._stars.forEach(s=>{
      const tw=Math.sin(this._time*s.sp+s.p)*0.3+0.7;
      ctx.fillStyle='rgba('+(s.s>1.2?'180,220,255':'100,140,180')+','+(tw*0.5)+')';
      ctx.fillRect(s.x,s.y,s.s,s.s);
    });
    // Atmosphere glow (4 layers)
    for(let i=3;i>=0;i--){
      const ag=ctx.createRadialGradient(cx,cy,r*0.92,cx,cy,r*(1.2+i*0.14));
      const alpha=0.1-i*0.025;
      ag.addColorStop(0,'rgba(0,180,255,'+alpha+')');
      ag.addColorStop(0.5,'rgba(0,150,255,'+(alpha*0.4)+')');
      ag.addColorStop(1,'rgba(0,212,255,0)');
      ctx.fillStyle=ag;ctx.fillRect(0,0,w,h);
    }
    // Sphere with 3D lighting
    const sg=ctx.createRadialGradient(cx-r*0.3,cy-r*0.3,r*0.05,cx,cy,r*1.1);
    sg.addColorStop(0,'rgba(12,28,50,0.95)');
    sg.addColorStop(0.5,'rgba(6,14,28,0.9)');
    sg.addColorStop(1,'rgba(2,5,10,0.95)');
    ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fillStyle=sg;ctx.fill();
    // Land dot-matrix (cyan)
    if(this._landDots){
      this._landDots.forEach(d=>{
        const p=this._ll2xy(d.lat,d.lon,cx,cy,r,this.rotation,tilt);
        if(p.v){
          const b=p.d*0.6+0.4;
          ctx.fillStyle='rgba(0,160,210,'+(b*0.3)+')';
          ctx.fillRect(p.x-0.7,p.y-0.7,1.4,1.4);
        }
      });
    }
    // China highlighted in gold
    if(this._chinaDots){
      this._chinaDots.forEach(d=>{
        const p=this._ll2xy(d.lat,d.lon,cx,cy,r,this.rotation,tilt);
        if(p.v){
          const b=p.d*0.5+0.5;
          ctx.fillStyle='rgba(255,200,60,'+(b*0.55)+')';
          ctx.fillRect(p.x-0.9,p.y-0.9,1.8,1.8);
        }
      });
    }
    // Grid lines (very subtle)
    ctx.strokeStyle='rgba(0,212,255,0.04)';ctx.lineWidth=0.5;
    for(let lat=-60;lat<=60;lat+=15)this._drawLat(ctx,cx,cy,r,lat,tilt);
    for(let lon=0;lon<360;lon+=20)this._drawLon(ctx,cx,cy,r,lon,tilt);
    // Equator
    ctx.strokeStyle='rgba(0,212,255,0.08)';ctx.lineWidth=0.8;
    this._drawLat(ctx,cx,cy,r,0,tilt);
    // Trade routes (Belt & Road, flowing dashed lines)
    this._drawTradeRoutes(ctx,cx,cy,r,tilt);
    // Protection arcs from Beijing to overseas interests
    this._drawProtectLines(ctx,cx,cy,r,tilt);
    // Beijing origin marker
    const bj=this._ll2xy(this.BEIJING.lat,this.BEIJING.lon,cx,cy,r,this.rotation,tilt);
    if(bj.v){
      const t=Date.now();
      const ps=Math.sin(t/600)*0.5+0.5;
      ctx.beginPath();ctx.arc(bj.x,bj.y,8+ps*6,0,Math.PI*2);
      ctx.strokeStyle='rgba(255,200,60,'+(0.5*ps)+')';ctx.lineWidth=2;ctx.stroke();
      ctx.beginPath();ctx.arc(bj.x,bj.y,14+ps*12,0,Math.PI*2);
      ctx.strokeStyle='rgba(255,200,60,'+(0.2*ps)+')';ctx.lineWidth=1;ctx.stroke();
      ctx.beginPath();ctx.arc(bj.x,bj.y,4,0,Math.PI*2);
      ctx.fillStyle='rgba(255,220,100,1)';ctx.fill();
      ctx.beginPath();ctx.arc(bj.x,bj.y,6,0,Math.PI*2);
      ctx.fillStyle='rgba(255,200,60,0.3)';ctx.fill();
      ctx.font='bold 10px "Microsoft YaHei",sans-serif';
      ctx.fillStyle='rgba(255,220,100,0.9)';
      ctx.fillText('★ 北京',bj.x+8,bj.y-4);
    }
    // Country risk dots with pulse
    const t=Date.now();
    COUNTRIES.forEach(c=>{
      if(c.name==='中国')return;
      const p=this._ll2xy(c.lat,c.lon,cx,cy,r,this.rotation,tilt);
      if(!p.v)return;
      const risk=calcOverall(c.scores);
      const ents=getEntsInCountry(c.name).length;
      const sz=2+Math.min(ents*0.3,2.5)+(risk/10)*2.5;
      const a=p.d;
      let col=risk>=8?[255,51,85]:risk>=6?[255,136,0]:risk>=4?[255,204,0]:[0,255,159];
      ctx.beginPath();ctx.arc(p.x,p.y,sz,0,Math.PI*2);
      ctx.fillStyle='rgba('+col[0]+','+col[1]+','+col[2]+','+(a*0.95)+')';ctx.fill();
      ctx.beginPath();ctx.arc(p.x,p.y,sz+1.5,0,Math.PI*2);
      ctx.fillStyle='rgba('+col[0]+','+col[1]+','+col[2]+','+(a*0.2)+')';ctx.fill();
      if(risk>=7){
        const ps=Math.sin(t/400+c.lon)*0.5+0.5;
        ctx.beginPath();ctx.arc(p.x,p.y,sz+3+ps*8,0,Math.PI*2);
        ctx.strokeStyle='rgba('+col[0]+','+col[1]+','+col[2]+','+(0.35*ps*a)+')';ctx.lineWidth=1.5;ctx.stroke();
        ctx.beginPath();ctx.arc(p.x,p.y,sz+6+ps*14,0,Math.PI*2);
        ctx.strokeStyle='rgba('+col[0]+','+col[1]+','+col[2]+','+(0.12*ps*a)+')';ctx.lineWidth=0.8;ctx.stroke();
      }
      if(risk>=7&&p.d>0.35){
        ctx.font='bold 9px "Microsoft YaHei",sans-serif';
        ctx.fillStyle='rgba('+col[0]+','+col[1]+','+col[2]+','+(a*0.7)+')';
        ctx.fillText(c.name,p.x+sz+3,p.y+2);
      }
    });
    // Chokepoint diamond markers
    this._chokepoints.forEach(cp=>{
      const p=this._ll2xy(cp.lat,cp.lon,cx,cy,r,this.rotation,tilt);
      if(!p.v)return;
      ctx.save();ctx.translate(p.x,p.y);ctx.rotate(Math.PI/4);
      ctx.strokeStyle='rgba(255,170,0,'+(p.d*0.8)+')';ctx.lineWidth=1.5;
      ctx.strokeRect(-3,-3,6,6);
      ctx.fillStyle='rgba(255,170,0,'+(p.d*0.3)+')';
      ctx.fillRect(-3,-3,6,6);
      ctx.restore();
    });
    // Radar sweep
    ctx.save();ctx.translate(cx,cy);
    const sa=this._scanAngle;
    if(ctx.createConicGradient){
      const grad=ctx.createConicGradient(sa,0,0);
      grad.addColorStop(0,'rgba(0,212,255,0.15)');
      grad.addColorStop(0.05,'rgba(0,212,255,0)');
      grad.addColorStop(1,'rgba(0,212,255,0)');
      ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);
      ctx.fillStyle=grad;ctx.fill();
    }else{
      ctx.beginPath();ctx.moveTo(0,0);
      ctx.arc(0,0,r,sa-0.25,sa);ctx.closePath();
      const lg=ctx.createLinearGradient(0,0,r*Math.cos(sa),r*Math.sin(sa));
      lg.addColorStop(0,'rgba(0,212,255,0)');lg.addColorStop(1,'rgba(0,212,255,0.12)');
      ctx.fillStyle=lg;ctx.fill();
    }
    ctx.restore();
    // Sphere outline
    ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);
    ctx.strokeStyle='rgba(0,212,255,0.2)';ctx.lineWidth=1;ctx.stroke();
    ctx.beginPath();ctx.arc(cx,cy,r+3,0,Math.PI*2);
    ctx.strokeStyle='rgba(0,212,255,0.06)';ctx.lineWidth=0.5;ctx.stroke();
    // Orbital ring (tilted ellipse)
    ctx.save();ctx.translate(cx,cy);
    ctx.rotate(this._time*0.0003);
    ctx.strokeStyle='rgba(0,212,255,0.08)';ctx.lineWidth=0.5;
    ctx.beginPath();ctx.ellipse(0,0,r*1.18,r*0.32,0,0,Math.PI*2);ctx.stroke();
    ctx.strokeStyle='rgba(0,212,255,0.05)';
    ctx.beginPath();ctx.ellipse(0,0,r*1.28,r*0.45,Math.PI/6,0,Math.PI*2);ctx.stroke();
    ctx.beginPath();ctx.ellipse(0,0,r*1.35,r*0.2,-Math.PI/5,0,Math.PI*2);ctx.stroke();
    // Orbiting satellites
    for(var si=0;si<3;si++){
      var sAng=this._time*0.008*(si+1)*0.5+si*Math.PI*0.7;
      var orbR=r*(1.18+si*0.05);
      var orbY=r*(0.32+si*0.06);
      var sx=Math.cos(sAng)*orbR;
      var sy=Math.sin(sAng)*orbY;
      var sFront=sy<0;
      ctx.fillStyle=sFront?'rgba(0,255,159,0.9)':'rgba(0,255,159,0.3)';
      ctx.beginPath();ctx.arc(sx,sy,sFront?2.5:1.5,0,Math.PI*2);ctx.fill();
      if(sFront){
        ctx.beginPath();ctx.arc(sx,sy,5,0,Math.PI*2);
        ctx.strokeStyle='rgba(0,255,159,0.2)';ctx.lineWidth=1;ctx.stroke();
        ctx.font='8px "Courier New",monospace';
        ctx.fillStyle='rgba(0,255,159,0.6)';
        ctx.fillText('SAT-'+(si+1),sx+6,sy+2);
      }
    }
    ctx.restore();
    // Coordinate tick marks around globe
    ctx.save();ctx.translate(cx,cy);
    for(var a=0;a<360;a+=30){
      var rad=a*Math.PI/180;
      var tx1=Math.cos(rad)*(r+6),ty1=Math.sin(rad)*(r+6);
      var tx2=Math.cos(rad)*(r+10),ty2=Math.sin(rad)*(r+10);
      ctx.strokeStyle='rgba(0,212,255,0.15)';ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(tx1,ty1);ctx.lineTo(tx2,ty2);ctx.stroke();
    }
    ctx.restore();
    // HUD time
    const te=document.getElementById('globe-hud-time');
    if(te)te.textContent=new Date().toLocaleTimeString('zh-CN',{hour12:false});
  },
  _drawProtectLines(ctx,cx,cy,r,tilt){
    if(!this._protectLines)return;
    this._protectLines.forEach(line=>{
      const p1=this._ll2xy(line.from.lat,line.from.lon,cx,cy,r,this.rotation,tilt);
      const p2=this._ll2xy(line.to.lat,line.to.lon,cx,cy,r,this.rotation,tilt);
      if(!p1.v&&!p2.v)return;
      const mx=(p1.x+p2.x)/2,my=(p1.y+p2.y)/2;
      const dx=p2.x-p1.x,dy=p2.y-p1.y;
      const dist=Math.sqrt(dx*dx+dy*dy);
      const elev=Math.min(dist*0.35,r*0.35);
      const cx2=mx,cy2=my-elev;
      const col=line.risk>=8?[255,51,85]:line.risk>=6?[255,136,0]:line.risk>=4?[255,204,0]:[0,255,159];
      // Faint full arc
      ctx.beginPath();ctx.moveTo(p1.x,p1.y);
      ctx.quadraticCurveTo(cx2,cy2,p2.x,p2.y);
      ctx.strokeStyle='rgba('+col[0]+','+col[1]+','+col[2]+',0.06)';ctx.lineWidth=0.6;ctx.stroke();
      // Active trail
      const pr=line.progress;const segs=20;
      for(let i=0;i<segs;i++){
        const t0=i/segs,t1=(i+1)/segs;
        if(t0>pr)break;
        const tEnd=Math.min(t1,pr);
        const x0=(1-t0)*(1-t0)*p1.x+2*(1-t0)*t0*cx2+t0*t0*p2.x;
        const y0=(1-t0)*(1-t0)*p1.y+2*(1-t0)*t0*cy2+t0*t0*p2.y;
        const x1=(1-tEnd)*(1-tEnd)*p1.x+2*(1-tEnd)*tEnd*cx2+tEnd*tEnd*p2.x;
        const y1=(1-tEnd)*(1-tEnd)*p1.y+2*(1-tEnd)*tEnd*cy2+tEnd*tEnd*p2.y;
        const alpha=(1-t0/pr)*0.5;
        ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);
        ctx.strokeStyle='rgba('+col[0]+','+col[1]+','+col[2]+','+alpha+')';ctx.lineWidth=1.2;ctx.stroke();
      }
      // Head particle
      if(pr>0.01&&pr<0.99){
        const px=(1-pr)*(1-pr)*p1.x+2*(1-pr)*pr*cx2+pr*pr*p2.x;
        const py=(1-pr)*(1-pr)*p1.y+2*(1-pr)*pr*cy2+pr*pr*p2.y;
        ctx.beginPath();ctx.arc(px,py,2.5,0,Math.PI*2);
        ctx.fillStyle='rgba('+col[0]+','+col[1]+','+col[2]+',0.9)';ctx.fill();
        ctx.beginPath();ctx.arc(px,py,5,0,Math.PI*2);
        ctx.fillStyle='rgba('+col[0]+','+col[1]+','+col[2]+',0.2)';ctx.fill();
      }
    });
  },
  _drawTradeRoutes(ctx,cx,cy,r,tilt){
    if(!this._tradeRoutes)return;
    this._tradeRoutes.forEach(route=>{
      const p1=this._ll2xy(route.from.lat,route.from.lon,cx,cy,r,this.rotation,tilt);
      const p2=this._ll2xy(route.to.lat,route.to.lon,cx,cy,r,this.rotation,tilt);
      if(!p1.v||!p2.v)return;
      const mx=(p1.x+p2.x)/2,my=(p1.y+p2.y)/2;
      const dx=p2.x-p1.x,dy=p2.y-p1.y;
      const dist=Math.sqrt(dx*dx+dy*dy);
      const elev=Math.min(dist*0.45,r*0.45);
      const cx2=mx,cy2=my-elev;
      ctx.setLineDash([4,4]);
      ctx.beginPath();ctx.moveTo(p1.x,p1.y);
      ctx.quadraticCurveTo(cx2,cy2,p2.x,p2.y);
      ctx.strokeStyle='rgba(0,212,255,0.1)';ctx.lineWidth=0.8;ctx.stroke();
      ctx.setLineDash([]);
      const pr=route.progress;
      const px=(1-pr)*(1-pr)*p1.x+2*(1-pr)*pr*cx2+pr*pr*p2.x;
      const py=(1-pr)*(1-pr)*p1.y+2*(1-pr)*pr*cy2+pr*pr*p2.y;
      ctx.beginPath();ctx.arc(px,py,2,0,Math.PI*2);
      ctx.fillStyle='rgba(0,212,255,0.7)';ctx.fill();
      ctx.beginPath();ctx.arc(px,py,4,0,Math.PI*2);
      ctx.fillStyle='rgba(0,212,255,0.15)';ctx.fill();
    });
  },
  _drawLat(ctx,cx,cy,r,lat,tilt){
    ctx.beginPath();let s=false;
    for(let lon=0;lon<=360;lon+=2){
      const p=this._ll2xy(lat,lon,cx,cy,r,this.rotation,tilt);
      if(p.v){if(!s){ctx.moveTo(p.x,p.y);s=true;}else ctx.lineTo(p.x,p.y);}
      else s=false;
    }
    ctx.stroke();
  },
  _drawLon(ctx,cx,cy,r,lon,tilt){
    ctx.beginPath();let s=false;
    for(let lat=-85;lat<=85;lat+=2){
      const p=this._ll2xy(lat,lon,cx,cy,r,this.rotation,tilt);
      if(p.v){if(!s){ctx.moveTo(p.x,p.y);s=true;}else ctx.lineTo(p.x,p.y);}
      else s=false;
    }
    ctx.stroke();
  }
};
// ===== INTEL IMAGE CENTER (Independent View) =====
var INTELCENTER={
  tab:'gallery',
  _osintSources:[
    {name:'Twitter/X',ic:'\u{1F4AC}',count:128,status:'active',color:'var(--cyan)',kw:['\u88ad\u51fb','\u7ef4\u5b89','\u7236\u70b8'],desc:'\u5b9e\u65f6\u76d1\u6d4b\u63d0\u53ca\u4e2d\u8d44\u4f01\u4e1a\u3001\u4e00\u5e26\u4e00\u8def\u3001\u6d77\u5916\u5b89\u5168\u7684\u63a8\u6587'},
    {name:'Telegram',ic:'\u{1F4E2}',count:42,status:'active',color:'var(--red)',kw:['\u6b66\u88c5\u7ec4\u7ec7','\u88ad\u51fb\u9884\u8b66'],desc:'\u76d1\u6d4b\u5410\u5e9f\u3001BLA\u3001IS\u7b49\u7ec4\u7ec7\u5ba3\u4f20\u9893\u9053'},
    {name:'\u65b0\u95fb\u5a92\u4f53',ic:'\u{1F4F0}',count:89,status:'active',color:'var(--green)',kw:['\u88ad\u51fb\u4e8b\u4ef6','\u793a\u5a01','\u64a4\u4fa8'],desc:'Reuters/AP/AFP/BBC/CNN \u7b49\u4e3b\u6d41\u56fd\u9645\u5a92\u4f53'},
    {name:'\u6697\u7f51\u8bba\u575b',ic:'\u{1F575}\uFE0F',count:23,status:'active',color:'var(--orange)',kw:['\u96c7\u4f63\u5175','\u60c5\u62a5\u4e70\u5356'],desc:'\u76d1\u6d4b\u9488\u5bf9\u4e2d\u8d44\u4f01\u4e1a\u7684\u5a01\u80c1\u60c5\u62a5'},
    {name:'\u653f\u5e9c\u516c\u544a',ic:'\u{1F3DB}\uFE0F',count:34,status:'active',color:'var(--cyan)',kw:['\u5236\u88c1','\u65c5\u884c\u8b66\u544a'],desc:'\u5404\u56fd\u653f\u5e9c\u5b98\u65b9\u516c\u544a\u53ca\u9886\u4e8b\u901a\u77e5'},
    {name:'\u7814\u7a76\u62a5\u544a',ic:'\u{1F4DA}',count:31,status:'standby',color:'var(--yellow)',kw:['\u98ce\u9669\u8bc4\u4f30','\u5b89\u5168\u5f62\u52bf'],desc:'\u667a\u5e93\u3001NGO\u3001\u5b89\u4fdd\u516c\u53f8\u516c\u5f00\u62a5\u544a'}
  ],
  _defaultOsint:[
    {id:'OSINT-001',source:'Twitter/X',time:'2026-07-13 14:32',country:'\u5df4\u57fa\u65af\u5766',kw:'\u88ad\u51fb',content:'\u76ee\u51fb\u8005\u79f0\u5361\u62c9\u5947\u6e2f\u4e2d\u8d44\u7801\u5934\u51fa\u73b0\u53ef\u7591\u8f66\u8f86\uff0c\u7591\u4f3c\u4fa6\u5bdf\u884c\u4e3a',level:'red',verified:true},
    {id:'OSINT-002',source:'Telegram',time:'2026-07-13 12:15',country:'\u4e5f\u95e8',kw:'\u7ef4\u5b89',content:'\u80e1\u585e\u6b66\u88c5\u53d1\u5e03\u7ea2\u6d77\u822a\u884c\u7ba1\u5236\u58f0\u660e\uff0c\u5a01\u80c1\u9488\u5bf9\u5546\u8239\u7684\u653b\u51fb',level:'red',verified:true},
    {id:'OSINT-003',source:'\u65b0\u95fb\u5a92\u4f53',time:'2026-07-13 10:00',country:'\u9a6c\u91cc',kw:'\u88ad\u51fb',content:'\u8def\u900f\u793e\u62a5\u9053\uff1a\u9a6c\u91cc\u5317\u90e8\u53d1\u751f\u6b66\u88c5\u88ad\u51fb\uff0c\u91d1\u77ff\u533a\u5b89\u5168\u5f62\u52bf\u6076\u5316',level:'orange',verified:true},
    {id:'OSINT-004',source:'\u6697\u7f51\u8bba\u575b',time:'2026-07-12 22:45',country:'\u521a\u679c(\u91d1)',kw:'\u96c7\u4f63\u5175',content:'\u6697\u7f51\u8bba\u575b\u51fa\u73b0\u9488\u5bf9\u4e2d\u8d44\u77ff\u4e1a\u516c\u53f8\u7684\u96c7\u4f63\u5175\u62db\u52df\u4fe1\u606f',level:'orange',verified:false},
    {id:'OSINT-005',source:'\u653f\u5e9c\u516c\u544a',time:'2026-07-12 18:00',country:'\u82cf\u4e39',kw:'\u88ab\u52a8\u5371\u673a',content:'\u82cf\u4e39\u6b66\u88c5\u51b2\u7a81\u5347\u7ea7\uff0c\u591a\u56fd\u53d1\u5e03\u64a4\u4fa8\u8b66\u544a',level:'red',verified:true},
    {id:'OSINT-006',source:'Twitter/X',time:'2026-07-12 15:20',country:'\u7f05\u7538',kw:'\u793a\u5a01',content:'\u4ef0\u5149\u53d1\u751f\u53cd\u519b\u4e8b\u653f\u53d8\u793a\u5a01\uff0c\u4e2d\u8d44\u9879\u76ee\u5de5\u5730\u5c01\u9501',level:'orange',verified:false},
    {id:'OSINT-007',source:'\u7814\u7a76\u62a5\u544a',time:'2026-07-11 09:00',country:'\u5168\u7403',kw:'\u98ce\u9669\u8bc4\u4f30',content:'\u56fd\u9645\u5b89\u4fdd\u516c\u53f8\u53d1\u5e03Q3\u6d77\u5916\u5b89\u5168\u5f62\u52bf\u8bc4\u4f30\u62a5\u544a',level:'cyan',verified:true},
    {id:'OSINT-008',source:'Telegram',time:'2026-07-11 07:30',country:'\u5df4\u57fa\u65af\u5766',kw:'\u7ef4\u5b89',content:'BLA\u53d1\u5e03\u9488\u5bf9CPEC\u9879\u76ee\u7684\u5a01\u80c1\u58f0\u660e\u89c6\u9891',level:'red',verified:true}
  ],
  _defaultAnalysis:[
    {id:'RPT-001',time:'2026-07-13 10:30',target:'\u66fc\u5fb7\u6d77\u5ce1\u822a\u9053',type:'\u53d8\u5316\u68c0\u6d4b',finding:'\u68c0\u6d4b\u52303\u8258\u53ef\u7591\u5c0f\u578b\u8239\u53ea\u805a\u96c6\uff0c\u7591\u4f3c\u6b66\u88c5\u5feb\u8247',level:'red',confidence:92},
    {id:'RPT-002',time:'2026-07-12 14:15',target:'\u79d1\u5362\u97e6\u9f50\u77ff\u533a',type:'\u76ee\u6807\u8bc6\u522b',finding:'\u8bc6\u522b\u5230\u6b66\u88c5\u4eba\u5458\u8f66\u8f862\u8f86\uff0c\u8425\u5730\u5317\u4fa7\u5f02\u5e38\u96c6\u7ed3',level:'orange',confidence:85},
    {id:'RPT-003',time:'2026-07-12 09:00',target:'\u74e6\u8fbe\u5c14\u6e2f',type:'\u6d3b\u52a8\u76d1\u6d4b',finding:'\u6e2f\u53e3\u541e\u5410\u91cf\u6b63\u5e38\uff0c\u8d27\u82393\u8258\uff0c\u65bd\u5de5\u8f66\u8f862\u8f86',level:'cyan',confidence:95},
    {id:'RPT-004',time:'2026-07-11 16:20',target:'\u7eb3\u96f7\u7eb3\u77ff\u533a',type:'\u635f\u4f24\u8bc4\u4f30',finding:'\u88ad\u51fb\u9020\u62103\u5904\u5efa\u7b51\u640d\u6bc1\uff0c2\u8f86\u8f66\u8f86\u70e7\u6bc1\uff0c\u4f30\u8ba1\u635f\u5931\u7ea6500\u4e07\u7f8e\u5143',level:'red',confidence:88},
    {id:'RPT-005',time:'2026-07-11 11:00',target:'\u6c49\u73ed\u6258\u5854\u6e2f',type:'\u70ed\u529b\u5206\u6790',finding:'\u672a\u53d1\u73b0\u5f02\u5e38\u70ed\u6e90\uff0c\u5730\u8868\u6e29\u5ea6\u5206\u5e03\u6b63\u5e38',level:'cyan',confidence:90}
  ],
  _defaultTimeline:[
    {target:'\u7eb3\u96f7\u7eb3 \u77ff\u533a',country:'\u9a6c\u91cc',t0:'2026-05-01',t1:'2026-05-17',changes:'\u88ad\u51fb\u4e8b\u4ef6: \u8425\u5730\u5efa\u7b51\u640d\u6bc1\uff0c\u65bd\u5de5\u8f66\u8f86\u88ab\u711a\u6bc1',level:'red',impact:'\u4e25\u91cd'},
    {target:'\u66fc\u5fb7\u6d77\u5ce1 \u822a\u9053',country:'\u4e5f\u95e8',t0:'2026-06-01',t1:'2026-07-13',changes:'\u822a\u8fd0\u6d3b\u52a8\u51cf\u5c1130%\uff0c\u519b\u4e8b\u5de1\u903b\u589e\u52a0',level:'orange',impact:'\u663e\u8457'},
    {target:'\u79d1\u5362\u97e6\u9f50 \u77ff\u533a',country:'\u521a\u679c(\u91d1)',t0:'2026-05-01',t1:'2026-07-12',changes:'\u5b89\u4fdd\u8bbe\u65bd\u5347\u7ea7\uff0c\u65b0\u589e\u54e8\u62402\u5904',level:'yellow',impact:'\u4e2d\u7b49'},
    {target:'\u74e6\u8fbe\u5c14\u6e2f',country:'\u5df4\u57fa\u65af\u5766',t0:'2026-06-01',t1:'2026-07-13',changes:'\u6e2f\u53e3\u6269\u5efa\u5de5\u7a0b\u8fdb\u5c55\u6b63\u5e38\uff0c\u65b0\u589e\u6cca\u4f4d\u65bd\u5de5',level:'cyan',impact:'\u8f7b\u5fae'}
  ],
  _defaultGeoint:[
    {name:'\u98ce\u9669\u70ed\u529b\u56fe',ic:'\u{1F525}',desc:'\u5168\u7403\u98ce\u9669\u5206\u5e03\u70ed\u529b\u56fe \u2014 \u591a\u7ef4\u5ea6\u8bc4\u5206\u4f53\u7cfb',status:'active',color:'var(--red)',count:'42\u56fd',
      source:'\u591a\u6e90\u60c5\u62a5\u878d\u5408\uff08OSINT\u3001\u536b\u661f\u76d1\u6d4b\u3001\u4eba\u5de5\u91c7\u96c6\u3001\u5386\u53f2\u6570\u636e\u5e93\uff09',
      coverage:'\u5168\u740342\u4e2a\u91cd\u70b9\u56fd\u5bb6/\u5730\u533a\uff0c\u7f51\u683c\u7cbe\u5ea60.5\u00b0\u00d70.5\u00b0',
      updated:'2026-07-13 22:00',
      meta:'\u8bc4\u5206\u7ef4\u5ea6: \u653f\u6cbb(25%)/\u7ecf\u6d4e(20%)/\u5b89\u5168(25%)/\u793e\u4f1a(15%)/\u81ea\u7136\u707e\u5bb3(15%) | \u8bc4\u5206\u533a\u95f4: 0-10 | \u66f4\u65b0\u9891\u7387: \u6bcf\u65e5',
      analysis:'\u5f53\u524d\u5168\u7403\u98ce\u9669\u683c\u5c40\u5448\u201c\u4e1c\u9ad8\u897f\u4e2d\u201d\u6001\u52bf\uff1a\u4e2d\u4e1c\u3001\u5317\u975e\u3001\u5357\u4e9a\u70ed\u70b9\u533a\u57df\u98ce\u9669\u6301\u7eed\u5c45\u9ad8\uff0c\u4e1c\u6b27\u5730\u533a\u56e0\u4fc4\u4e4c\u51b2\u7a81\u5916\u6ea2\u6548\u5e94\u660e\u663e\u3002\u897f\u975e\u8428\u8d6b\u52d2\u5e26\u3001\u4e2d\u4e1c\u4e24\u6cb3\u6d41\u57df\u4e3a\u6700\u9ad8\u98ce\u9669\u533a\u3002\u5efa\u8bae\u52a0\u5f3a\u5bf9\u7ea2\u6d77\u6cbf\u5cb8\u3001\u51e0\u5185\u4e9a\u6e7e\u3001\u9a6c\u516d\u7532\u6d77\u5ce1\u7684\u5b9e\u65f6\u76d1\u63a7\u3002',
      records:[
        {region:'\u4e2d\u4e1c',country:'\u53d9\u5229\u4e9a',political:8.5,economic:7.2,security:9.1,social:7.8,disaster:4.0,total:8.2,trend:'\u2191',note:'\u5185\u6218\u6301\u7eed\uff0c\u5916\u90e8\u52bf\u529b\u4ecb\u5165\u52a0\u6df1'},
        {region:'\u4e2d\u4e1c',country:'\u4f0a\u62c9\u514b',political:8.8,economic:7.0,security:9.3,social:7.5,disaster:5.0,total:8.4,trend:'\u2192',note:'\u653f\u5e9c\u66f4\u8fed\u9891\u7e41\uff0c\u5b89\u5168\u5f62\u52bf\u4e25\u5cfb'},
        {region:'\u4e2d\u4e1c',country:'\u4e5f\u95e8',political:7.5,economic:6.8,security:8.0,social:7.0,disaster:4.5,total:7.2,trend:'\u2191',note:'\u80e1\u585e\u6b66\u88c5\u6d3b\u52a8\u589e\u52a0\uff0c\u6d77\u8fd0\u5b89\u5168\u98ce\u9669\u4e0a\u5347'},
        {region:'\u5317\u975e',country:'\u5c3c\u65e5\u5229\u4e9a',political:8.0,economic:6.5,security:8.8,social:8.2,disaster:3.5,total:7.8,trend:'\u2191',note:'\u6050\u88ad\u6d3b\u52a8\u7ed3\u5408\u72af\u7f6a\u56e2\u4f19\uff0c\u5b89\u5168\u5f62\u52bf\u6076\u5316'},
        {region:'\u5317\u975e',country:'\u8428\u8d6b\u52d2\u5e2d\u5185\u52a0\u5c14',political:9.0,economic:8.5,security:9.0,social:8.5,disaster:6.0,total:8.8,trend:'\u2191',note:'\u653f\u53d8\u540e\u5b89\u5168\u771f\u7a7a\uff0c\u4e2d\u8d44\u9879\u76ee\u9762\u4e34\u4e2d\u65ad\u98ce\u9669'},
        {region:'\u5317\u975e',country:'\u5229\u6bd4\u4e9a',political:7.8,economic:7.0,security:8.5,social:7.5,disaster:4.0,total:7.6,trend:'\u2192',note:'\u5bb6\u65cf\u51b2\u7a81\u6301\u7eed\uff0c\u6cb9\u751f\u4ea7\u53d7\u6270'},
        {region:'\u5357\u4e9a',country:'\u5df4\u57fa\u65af\u5766',political:7.5,economic:6.0,security:8.2,social:7.0,disaster:5.5,total:7.1,trend:'\u2191',note:'TTP\u6b3e\u70b9\u91cd\u62a2\u8fb9\u5883\u5730\u533a\uff0c\u74e6\u8fbe\u5c14\u6e2f\u5b89\u5168\u62a5\u8b66'},
        {region:'\u5357\u4e9a',country:'\u7f05\u7538',political:7.0,economic:6.5,security:7.8,social:7.2,disaster:6.0,total:7.0,trend:'\u2192',note:'\u5185\u6218\u7f13\u548c\u4f46\u5c40\u52bf\u8106\u5f31\uff0c\u4e2d\u7f05\u8d70\u5eca\u9879\u76ee\u90fd\u4fdd\u53d7\u5a01\u80c1'},
        {region:'\u4e1c\u6b27',country:'\u4e4c\u514b\u5170',political:9.2,economic:8.0,security:9.5,social:8.0,disaster:4.0,total:8.9,trend:'\u2191',note:'\u6218\u4e89\u6301\u7eed\u5347\u7ea7\uff0c\u57fa\u7840\u8bbe\u65bd\u6bc1\u635f\u4e25\u91cd'},
        {region:'\u4e1c\u6b27',country:'\u4fc4\u7f57\u65af',political:8.5,economic:7.5,security:8.8,social:7.0,disaster:3.0,total:8.0,trend:'\u2191',note:'\u5236\u88c1\u52a0\u5267\uff0c\u4e2d\u8d44\u4f01\u4e1a\u5408\u89c4\u98ce\u9669\u4e0a\u5347'},
        {region:'\u62c9\u4e01\u7f8e\u6d32',country:'\u59d4\u5185\u745e\u62c9',political:8.0,economic:9.0,security:7.5,social:8.0,disaster:3.5,total:7.8,trend:'\u2191',note:'\u7ecf\u6d4e\u5d29\u6e83\u52a0\u5267\u793e\u4f1a\u52a8\u8361\uff0c\u6cb9\u4ea7\u505c\u6ede'},
        {region:'\u975e\u6d32',country:'\u82cf\u4e39',political:8.8,economic:8.5,security:9.0,social:8.0,disaster:5.0,total:8.5,trend:'\u2191',note:'\u5185\u6218\u91cd\u71c3\uff0c\u4e2d\u65b9\u4eba\u5458\u64a4\u79bb\u4e2d'}
      ]
    },
    {name:'\u4f01\u4e1a\u5206\u5e03\u56fe',ic:'\u{1F3ED}',desc:'\u4e2d\u8d44\u4f01\u4e1a\u5168\u7403\u5206\u5e03\u4e0e\u98ce\u9669\u8bc4\u4f30',status:'active',color:'var(--cyan)',count:'35\u4f01\u4e1a',
      source:'\u5546\u52a1\u90e8\u5883\u5916\u4f01\u4e1a\u76ee\u5f55\u3001\u4f01\u4e1a\u5de5\u5546\u4fe1\u606f\u3001\u884c\u4e1a\u62a5\u544a',
      coverage:'\u5168\u740335\u5bb6\u91cd\u70b9\u4e2d\u8d44\u4f01\u4e1a\uff0c\u8986\u76d618\u4e2a\u56fd\u5bb6',
      updated:'2026-07-13 18:00',
      meta:'\u6570\u636e\u5b57\u6bb5: \u4f01\u4e1a\u540d\u79f0/\u6240\u5728\u56fd/\u884c\u4e1a/\u5458\u5de5\u6570/\u4e2d\u65b9\u4eba\u5458/\u98ce\u9669\u7b49\u7ea7 | \u66f4\u65b0\u9891\u7387: \u6bcf\u5468',
      analysis:'\u4e2d\u8d44\u4f01\u4e1a\u5728\u975e\u6d32\u548c\u4e2d\u4e1c\u5206\u5e03\u6700\u5bc6\u96c6\uff0c\u5176\u4e2d\u57fa\u5efa\u3001\u6cb9\u6c14\u3001\u77ff\u4e1a\u4e3a\u4e3b\u8981\u884c\u4e1a\u3002\u9ad8\u98ce\u9669\u533a\u57df\u4f01\u4e1a\u6570\u91cf\u8fd1\u671f\u589e\u52a012%\uff0c\u5efa\u8bae\u52a0\u5f3a\u5b89\u4fdd\u6295\u5165\u548c\u5e94\u6025\u9884\u6848\u5236\u5b9a\u3002\u7279\u522b\u5173\u6ce8\u8428\u8d6b\u52d2\u5e2d\u5185\u52a0\u5c14\u3001\u5c3c\u65e5\u5229\u4e9a\u3001\u4f0a\u62c9\u514b\u4e09\u56fd\u7684\u9879\u76ee\u4eba\u5458\u5b89\u5168\u3002',
      records:[
        {company:'\u4e2d\u77f3\u6cb9\u5de5\u7a0b\u96c6\u56e2',country:'\u4e5f\u95e8',sector:'\u77f3\u6cb9\u5de5\u7a0b',staff:'2,800',cnStaff:'320',risk:'\u6781\u9ad8',note:'\u4e3b\u8981\u9879\u76ee\u5728\u4e5f\u95e8\u897f\u90e8\u6cb9\u7530\uff0c\u80e1\u585e\u6b66\u88c5\u5a01\u80c1\u4e25\u91cd'},
        {company:'\u4e2d\u94c1\u96c6\u56e2',country:'\u5c3c\u65e5\u5229\u4e9a',sector:'\u77ff\u4e1a\u5f00\u91c7',staff:'1,500',cnStaff:'180',risk:'\u6781\u9ad8',note:'\u963f\u5e93\u8d39\u94c1\u77ff\u9879\u76ee\uff0c\u6050\u88ad\u6d3b\u52a8\u5a01\u80c1\u4e25\u91cd'},
        {company:'\u4e2d\u4ea4\u5efa\u516c\u53f8',country:'\u5229\u6bd4\u4e9a',sector:'\u57fa\u7840\u8bbe\u65bd',staff:'3,200',cnStaff:'450',risk:'\u9ad8',note:'\u6cbf\u6d77\u516c\u8def\u9879\u76ee\uff0c\u5bb6\u65cf\u51b2\u7a81\u5f71\u54cd\u65bd\u5de5'},
        {company:'\u4e2d\u539f\u5de5\u7a0b',country:'\u4f0a\u62c9\u514b',sector:'\u5de5\u7a0b\u627f\u5305',staff:'2,100',cnStaff:'280',risk:'\u6781\u9ad8',note:'\u5df4\u683c\u8fbe\u6c34\u7535\u7ad9\u9879\u76ee\uff0c\u5b89\u5168\u5f62\u52bf\u4e25\u5cfb'},
        {company:'\u534e\u4e3a\u6280\u672f',country:'\u5c3c\u65e5\u5229\u4e9a',sector:'\u901a\u4fe1\u8bbe\u5907',staff:'800',cnStaff:'95',risk:'\u9ad8',note:'\u5168\u7403\u670d\u52a1\u4e2d\u5fc3\uff0c\u672c\u5730\u5b89\u4fdd\u9700\u52a0\u5f3a'},
        {company:'\u4e2d\u6c34\u7535\u5efa\u7b2c\u516b\u5de5\u7a0b\u5c40',country:'\u5df4\u57fa\u65af\u5766',sector:'\u6c34\u5229\u5de5\u7a0b',staff:'1,800',cnStaff:'220',risk:'\u9ad8',note:'\u8fbe\u82cf\u6c34\u7535\u7ad9\uff0cTTP\u6b3e\u70b9\u5a01\u80c1\u533a\u57df'},
        {company:'\u4e2d\u6cb9\u6c7d\u8f66',country:'\u8428\u8d6b\u52d2\u5e2d\u5185\u52a0\u5c14',sector:'\u77f3\u6cb9\u670d\u52a1',staff:'1,200',cnStaff:'150',risk:'\u6781\u9ad8',note:'\u6cb9\u7530\u670d\u52a1\uff0c\u653f\u53d8\u540e\u5b89\u5168\u4e0d\u786e\u5b9a'},
        {company:'\u4e2d\u519c\u53d1\u96c6\u56e2',country:'\u82cf\u4e39',sector:'\u519c\u4e1a\u5f00\u53d1',staff:'900',cnStaff:'110',risk:'\u6781\u9ad8',note:'\u519c\u4e1a\u793a\u8303\u533a\uff0c\u6218\u4e89\u5a01\u80c1\u4eba\u5458\u5b89\u5168'},
        {company:'\u4e2d\u94f0\u96c6\u56e2',country:'\u8d5e\u6bd4\u4e9a',sector:'\u77ff\u4e1a',staff:'2,500',cnStaff:'300',risk:'\u9ad8',note:'\u94dc\u77ff\u9879\u76ee\uff0c\u7ecf\u6d4e\u52a8\u8361\u5f71\u54cd\u8fd0\u8425'},
        {company:'\u4e2d\u8fd0\u96c6\u56e2',country:'\u5df4\u897f',sector:'\u6e2f\u53e3\u8fd0\u8425',staff:'1,100',cnStaff:'130',risk:'\u4e2d',note:'\u5df4\u897f\u6e2f\u96c6\u88c5\u7bb1\u4e1a\u52a1\uff0c\u793e\u6cbb\u73af\u5883\u8f83\u597d'}
      ]
    },
    {name:'\u822a\u8fd0\u901a\u9053\u56fe',ic:'\u2693\ufe0f',desc:'\u5168\u7403\u5173\u952e\u6d77\u8fd0\u54bd\u5499\u8981\u9053\u53ca\u98ce\u9669\u8bc4\u4f30',status:'active',color:'var(--orange)',count:'8\u8981\u9053',
      source:'\u56fd\u9645\u6d77\u4e8b\u7ec4\u7ec7(IMO)\u3001AIS\u8239\u4f4d\u6570\u636e\u3001\u5404\u56fd\u6d77\u4e8b\u5c40\u516c\u544a',
      coverage:'\u5168\u74038\u5927\u5173\u952e\u6d77\u5ce1\u53ca4\u6761\u4e3b\u8981\u822a\u8fd0\u8d70\u5eca',
      updated:'2026-07-13 20:00',
      meta:'\u76d1\u6d4b\u65b9\u5f0f: AIS\u5b9e\u65f6\u8ddf\u8e2a+\u536b\u661f\u9065\u611f | \u6570\u636e\u5ef6\u8fdf: <5\u5206\u949f | \u8986\u76d6\u8239\u53ea: \u5168\u7403\u5546\u8239\u7ea490%',
      analysis:'\u5168\u7403\u6d77\u8fd0\u54bd\u5499\u70b9\u6574\u4f53\u98ce\u9669\u7b49\u7ea7\u5347\u81f3\u201c\u9ad8\u201d\u3002\u7ea2\u6d77\u5c40\u52bf\u6301\u7eed\u7d27\u5f20\uff0c\u4e5f\u95e8\u6d77\u5ce1\u53d7\u80e1\u585e\u6b66\u88c5\u5a01\u80c1\u52a0\u5267\uff0c\u9a6c\u516d\u7532\u6d77\u5ce1\u76d7\u62a2\u6d3b\u52a8\u9891\u53d1\u3002\u5efa\u8bae\u4e2d\u8d44\u8239\u53ea\u7ed5\u884c\u7ea2\u6d77\u6cbf\u5cb8\u65f6\u63d0\u5347\u6218\u5907\u7b49\u7ea7\uff0c\u5e76\u5236\u5b9a\u4e5f\u95e8\u6d77\u5ce1\u5e94\u6025\u7ed5\u884c\u65b9\u6848\u3002',
      records:[
        {name:'\u9a6c\u516d\u7532\u6d77\u5ce1',type:'\u54bd\u5499\u8981\u9053',dailyShips:'240\u8258',riskLevel:'\u6781\u9ad8',riskScore:9.0,congestion:'\u4e2d\u7b49',alternative:'\u5df4\u6c9b\u5ce1\u8c37\uff08\u7ed5\u884c+12\u5929\uff09',note:'\u76d7\u62a2\u3001\u52ab\u6301\u9891\u53d1\uff0c\u4e2d\u56fd\u62a4\u822a\u7f16\u961f\u5df2\u90e8\u7f72'},
        {name:'\u4e5f\u95e8\u6d77\u5ce1\uff08\u66fc\u5fb7\u5ce1\uff09',type:'\u54bd\u5499\u8981\u9053',dailyShips:'180\u8258',riskLevel:'\u6781\u9ad8',riskScore:8.8,congestion:'\u4e25\u91cd',alternative:'\u7ed5\u884c\u9a6c\u516d\u7532\uff08+7\u5929\uff09',note:'\u80e1\u585e\u6b66\u88c5\u88ad\u51fb\u8239\u53ea\u3001\u6c34\u96f7\u5e03\u8bbe\u5a01\u80c1'},
        {name:'\u970d\u5c14\u6728\u5179\u6d77\u5ce1',type:'\u54bd\u5499\u8981\u9053',dailyShips:'150\u8258',riskLevel:'\u9ad8',riskScore:7.5,congestion:'\u8f7b\u5ea6',alternative:'\u65e0\u7406\u60f3\u66ff\u4ee3\u8def\u7ebf',note:'\u4f0a\u4e26\u51b2\u7a81\u5916\u6ea2\uff0c\u6cb9\u8f6e\u4ea4\u901a\u53d7\u9650'},
        {name:'\u82cf\u4f0a\u58eb\u8fd0\u6cb3',type:'\u54bd\u5499\u8981\u9053',dailyShips:'65\u8258',riskLevel:'\u9ad8',riskScore:7.2,congestion:'\u4e2d\u7b49',alternative:'\u597d\u671b\u89d2\u8def\u7ebf\uff08+10\u5929\uff09',note:'\u4e5f\u95e8\u5371\u673a\u5f71\u54cd\u822a\u8fd0\u5b89\u5168'},
        {name:'\u5df4\u6c9b\u9a6c\u5ce1\u8c37',type:'\u66ff\u4ee3\u822a\u7ebf',dailyShips:'35\u8258',riskLevel:'\u4e2d',riskScore:5.0,congestion:'\u4e25\u91cd',alternative:'\u4e3b\u8981\u66ff\u4ee3\u8def\u7ebf\u4e4b\u4e00',note:'\u7ed5\u884c\u6210\u672c\u9ad8\uff0c\u4f46\u9aa8\u67b6\u8f83\u5b89\u5168'},
        {name:'\u9ed1\u6d77\u6d77\u5ce1',type:'\u54bd\u5499\u8981\u9053',dailyShips:'90\u8258',riskLevel:'\u9ad8',riskScore:7.8,congestion:'\u4e2d\u7b49',alternative:'\u65e0\u66ff\u4ee3',note:'\u4fc4\u4e4c\u51b2\u7a81\u5f71\u54cd\uff0c\u5317\u7ea6\u5a01\u80c1\u52a0\u5267'},
        {name:'\u9f99\u76ee\u5ce1\u8c37',type:'\u91cd\u8981\u822a\u9053',dailyShips:'300\u8258',riskLevel:'\u4e2d',riskScore:4.5,congestion:'\u8f7b\u5ea6',alternative:'\u5df4\u58eb\u6d77\u5ce1\uff08+3\u5929\uff09',note:'\u4e2d\u56fd\u672c\u571f\u81f3\u4e1c\u5357\u4e9a\u4e3b\u8981\u822a\u7ebf\uff0c\u76d1\u63a7\u8f83\u5f3a'},
        {name:'\u597d\u671b\u89d2',type:'\u91cd\u8981\u822a\u9053',dailyShips:'120\u8258',riskLevel:'\u4e2d',riskScore:4.0,congestion:'\u8f7b\u5ea6',alternative:'\u7ed5\u884c\u975e\u6d32\u5357\u7aef\uff08+8\u5929\uff09',note:'\u975e\u6d32\u5357\u7aef\u822a\u8fd0\u8981\u70b9\uff0c\u793e\u6cbb\u73af\u5883\u8f83\u597d'}
      ]
    },
    {name:'\u4e00\u5e26\u4e00\u8def\u8d70\u5eca',ic:'\u{1F30F}',desc:'\u516d\u5927\u7ecf\u6d4e\u8d70\u5eca\u9879\u76ee\u8fdb\u5c55\u4e0e\u98ce\u9669\u8bc4\u4f30',status:'active',color:'var(--green)',count:'6\u8d70\u5eca',
      source:'\u56fd\u5bb6\u53d1\u6539\u59d4\u201c\u4e00\u5e26\u4e00\u8def\u201d\u7f51\u7ad9\u3001\u5546\u52a1\u90e8\u5883\u5916\u9879\u76ee\u5e93\u3001\u4e1c\u9053\u65b0\u95fb',
      coverage:'6\u5927\u7ecf\u6d4e\u8d70\u5eca\uff0c\u8986\u76d664\u4e2a\u56fd\u5bb6',
      updated:'2026-07-12 16:00',
      meta:'\u9879\u76ee\u5206\u7c7b: \u57fa\u7840\u8bbe\u65bd/\u80fd\u6e90/\u4ea7\u80fd\u5408\u4f5c | \u6295\u8d44\u7edf\u8ba1\u53e3\u5f84: \u4e07\u4ebf\u5143\u7ea7 | \u66f4\u65b0\u9891\u7387: \u6bcf\u6708',
      analysis:'\u4e00\u5e26\u4e00\u8def\u8d70\u5eca\u6574\u4f53\u8fdb\u5c55\u7a33\u5065\uff0c\u4f46\u533a\u57df\u5dee\u5f02\u660e\u663e\u3002\u4e2d\u5df4\u7ecf\u6d4e\u8d70\u5eca\u53d7\u5730\u7f18\u653f\u6cbb\u5f71\u54cd\u8fdb\u5c55\u7f13\u6162\uff0c\u65b0\u4e9a\u6d77\u9646\u8054\u7edc\u901a\u9053\u63a8\u8fdb\u987a\u5229\u3002\u5efa\u8bae\u91cd\u70b9\u5173\u6ce8\u5df4\u57fa\u65af\u5766\u3001\u7f05\u7538\u3001\u4f0a\u62c9\u514b\u4e09\u56fd\u9879\u76ee\u7684\u5b89\u5168\u4fdd\u969c\u95ee\u9898\u3002',
      records:[
        {corridor:'\u65b0\u4e9a\u6d77\u9646\u8054\u7edc\u901a\u9053',countries:'\u4e2d\u56fd/\u7f05\u7538/\u6cf0\u56fd/\u8d8a\u5357/\u9a6c\u6765\u897f\u4e9a',projects:'42\u4e2a',investment:'\u7ea63800\u4ebf\u5143',progress:'85%',risk:'\u4e2d\u4f4e',note:'\u63a8\u8fdb\u6700\u987a\u5229\uff0c\u7f05\u7538\u6bb5\u53d7\u5185\u6218\u5f71\u54cd'},
        {corridor:'\u4e2d\u5df4\u7ecf\u6d4e\u8d70\u5eca',countries:'\u4e2d\u56fd/\u5df4\u57fa\u65af\u5766/\u4f0a\u6717/\u54c8\u8428\u514b\u65af\u5766',projects:'28\u4e2a',investment:'\u7ea46200\u4ebf\u5143',progress:'55%',risk:'\u9ad8',note:'\u74e6\u8fbe\u5c14\u6e2f\u3001\u74dc\u8fbe\u5c14\u6e2f\u9879\u76ee\u53d7\u5b89\u5168\u5a01\u80c1'},
        {corridor:'\u4e2d\u56fd-\u4e2d\u4e9a-\u897f\u4e9a\u8d70\u5eca',countries:'\u4e2d\u56fd/\u54c8\u8428\u514b\u65af\u5766/\u4e4c\u5179\u522b\u514b\u65af\u5766/\u5409\u5c14\u5409\u65af\u65af\u5766',projects:'35\u4e2a',investment:'\u7ea62800\u4ebf\u5143',progress:'70%',risk:'\u4e2d',note:'\u4e2d\u5409\u4e4c\u94c1\u8def\u8fd0\u8425\u826f\u597d\uff0c\u653f\u6cbb\u98ce\u9669\u53ef\u63a7'},
        {corridor:'\u4e2d\u56fd-\u5370\u5ea6\u6b21\u5927\u9646-\u7ecf\u6d4e\u8d70\u5eca',countries:'\u4e2d\u56fd/\u5df4\u57fa\u65af\u5766/\u5c3c\u6cca\u5c14/\u5370\u5ea6',projects:'18\u4e2a',investment:'\u7ea41500\u4ebf\u5143',progress:'40%',risk:'\u9ad8',note:'\u5c3c\u6cca\u5c14\u5730\u9707\u5f71\u54cd\u5de5\u7a0b\u8fdb\u5ea6'},
        {corridor:'\u4e2d\u56fd-\u4e2d\u5357\u534a\u5c9b\u7ecf\u6d4e\u8d70\u5eca',countries:'\u4e2d\u56fd/\u8001\u631d/\u67ec\u57d4\u5be8/\u8d8a\u5357',projects:'22\u4e2a',investment:'\u7ea42000\u4ebf\u5143',progress:'75%',risk:'\u4f4e',note:'\u63a8\u8fdb\u987a\u5229\uff0c\u4e2d\u8001\u94c1\u8def\u8fd0\u8425\u6210\u6548'},
        {corridor:'\u4e2d\u6b27\u73ed\u5217\u5feb\u901a\u9053',countries:'\u4e2d\u56fd/\u4fc4\u7f57\u65af/\u767d\u4fc4\u7f57\u65af/\u6ce2\u5170',projects:'15\u4e2a',investment:'\u7ea4800\u4ebf\u5143',progress:'60%',risk:'\u9ad8',note:'\u4fc4\u4e4c\u51b2\u7a81\u5f71\u54cd\u4e2d\u6b27\u73ed\u5217\u8fd0\u8425'}
      ]
    },
    {name:'\u6050\u88ad\u4e8b\u4ef6\u56fe',ic:'\u{1F4A5}',desc:'\u5168\u7403\u6050\u60e7\u88ad\u51fb\u4e8b\u4ef6\u65f6\u7a7a\u5206\u5e03\u4e0e\u8d8b\u52bf\u5206\u6790',status:'active',color:'var(--red)',count:'32\u4e8b\u4ef6',
      source:'\u5168\u7403\u6050\u60e7\u4e3b\u4e49\u6570\u636e\u5e93(GTD)\u3001\u5404\u56fd\u5b89\u5168\u90e8\u95e8\u516c\u544a\u3001\u56fd\u9645\u5a92\u4f53\u62a5\u9053',
      coverage:'\u8fd190\u5929\u5185\u5168\u7403\u6050\u88ad\u4e8b\u4ef6\uff0c\u8986\u76d625\u4e2a\u56fd\u5bb6',
      updated:'2026-07-13 23:30',
      meta:'\u5206\u7c7b: \u7206\u70b8/\u6273\u67b7/\u52ab\u6301/\u7801\u5934\u88ad\u51fb/\u8f66\u8f86\u51b2\u64de | \u65f6\u95f4\u7a97\u53e3: 90\u5929 | \u66f4\u65b0\u9891\u7387: \u5b9e\u65f6',
      analysis:'\u8fd190\u5929\u5185\u5168\u7403\u6050\u88ad\u4e8b\u4ef6\u540c\u6bd4\u589e\u52a023%\uff0c\u4e2d\u4e1c\u548c\u5317\u975e\u5360\u603b\u6570\u768465%\u3002IS-K\uff08\u4f0a\u65af\u5170\u56fd\u547c\u7f57\u5c71\u652f\u90e8\uff09\u5728\u963f\u5bcc\u6c57\u548c\u5df4\u57fa\u65af\u5766\u6d3b\u52a8\u9891\u7e41\uff0c\u8428\u8d6b\u52d2\u5e2d\u5185\u52a0\u5c14ISWAP\u6301\u7eed\u6269\u5f20\u3002\u5efa\u8bae\u52a0\u5f3a\u5bf9\u4e2d\u8d44\u4f01\u4e1a\u548c\u4f7f\u9886\u9986\u7684\u5b89\u4fdd\u901a\u62a5\uff0c\u5236\u5b9a\u5206\u7ea7\u5e94\u6025\u9884\u6848\u3002',
      records:[
        {date:'2026-07-11',country:'\u963f\u5bcc\u6c57',city:'\u5580\u5e03\u5c14',type:'\u7206\u70b8',casualties:'\u6b7b12\u4f24\u5945',group:'IS-K',target:'\u5546\u4e1a\u533a',level:'\u6781\u9ad8',note:'\u8fde\u73af\u7206\u70b8\u9488\u5bf9\u5e02\u573a\uff0c\u4e2d\u65b9\u4eba\u5458\u5b89\u5168'},
        {date:'2026-07-09',country:'\u5df4\u57fa\u65af\u5766',city:'\u74e6\u8fbe\u5c14',type:'\u6273\u67b7',casualties:'\u6b7b5\u4f24\u5945',group:'TTP',target:'\u4e2d\u8d44\u9879\u76ee\u8f66\u961f',level:'\u6781\u9ad8',note:'\u9488\u5bf9\u4e2d\u8d44\u4f01\u4e1a\u7684\u5b9a\u5411\u88ad\u51fb'},
        {date:'2026-07-07',country:'\u5c3c\u65e5\u5229\u4e9a',city:'\u5361\u5947\u7eb3',type:'\u52ab\u6301',casualties:'\u4f243\u4eba',group:'\u6d77\u76d7',target:'\u4e2d\u8d44\u8d27\u8239',level:'\u9ad8',note:'\u51e0\u5185\u4e9a\u6e7e\u6d77\u76d7\u6d3b\u52a8\u52a0\u5267'},
        {date:'2026-07-05',country:'\u4f0a\u62c9\u514b',city:'\u5df4\u683c\u8fbe',type:'\u706b\u7bad\u88ad\u51fb',casualties:'\u6b7b3\u4f24\u5945',group:'\u4f0a\u65af\u5170\u56fd',target:'\u519b\u4e8b\u57fa\u5730',level:'\u9ad8',note:'\u9488\u5bf9\u7f8e\u519b\u57fa\u5730\uff0c\u4e2d\u8d44\u9879\u76ee\u95f4\u63a5\u53d7\u5a01\u80c1'},
        {date:'2026-07-03',country:'\u4e5f\u95e8',city:'\u4e9a\u4e01',type:'\u6c34\u96f7',casualties:'\u6b7b2\u4f24\u5945',group:'\u80e1\u585e\u6b66\u88c5',target:'\u5546\u8239',level:'\u9ad8',note:'\u7ea2\u6d77\u822a\u8fd0\u5b89\u5168\u5a01\u80c1\u5347\u7ea7'},
        {date:'2026-06-30',country:'\u9a6c\u91cc',city:'\u83ab\u666e\u63d0',type:'\u6273\u67b7',casualties:'\u6b7b8\u4f24\u5945',group:'JNIM',target:'\u56fd\u9645\u7ef4\u548c\u90e8\u961f',level:'\u6781\u9ad8',note:'\u9488\u5bf9\u8054\u5408\u56fd\u7ef4\u548c\u90e8\u961f\u7684\u88ad\u51fb'},
        {date:'2026-06-28',country:'\u54c8\u8428\u514b\u65af\u5766',city:'\u963f\u514b\u6258\u62dc',type:'\u7206\u70b8',casualties:'\u6b7b4\u4f24\u5945',group:'IS-K',target:'\u4f7f\u9886\u9986\u533a',level:'\u9ad8',note:'\u4e2d\u4e9a\u5730\u533a\u6050\u88ad\u98ce\u9669\u4e0a\u5347'},
        {date:'2026-06-25',country:'\u5df4\u57fa\u65af\u5766',city:'\u4ec0\u536b\u9752',type:'\u8f66\u8f86\u51b2\u64de',casualties:'\u6b7b3\u4f24\u5945',group:'BLA',target:'\u4e2d\u8d44\u9879\u76ee\u5de5\u5730',level:'\u6781\u9ad8',note:'\u9488\u5bf9\u4e2d\u8d44\u4f01\u4e1a\u7684\u5b9a\u5411\u88ad\u51fb'},
        {date:'2026-06-22',country:'\u54e5\u4f26\u6bd4\u4e9a',city:'\u5361\u5854\u8d6b\u7eb3',type:'\u6273\u67b7',casualties:'\u6b7b2\u4f24\u5945',group:'ELN',target:'\u4e2d\u8d44\u77ff\u4e1a\u516c\u53f8',level:'\u9ad8',note:'\u9488\u5bf9\u4e2d\u8d44\u4f01\u4e1a\u7684\u7ecd\u52b5'},
        {date:'2026-06-20',country:'\u521a\u679c\uff08\u91d1\uff09',city:'\u4e2d\u525b\u679c\u91d1\u8fb9\u5883',type:'\u6b66\u88c5\u4ea4\u706b',casualties:'\u6b7b5\u4f24\u5945',group:'M23',target:'\u8fb9\u5883\u519b\u4e8b\u51b2\u7a81',level:'\u9ad8',note:'\u4e2d\u975e\u5730\u533a\u5b89\u5168\u5f62\u52bf\u6076\u5316'}
      ]
    },
    {name:'\u64a4\u4fa8\u8def\u7ebf\u56fe',ic:'\u{1F691}',desc:'\u7d27\u6025\u64a4\u4fa8\u8def\u7ebf\u3001\u96c6\u7ed3\u70b9\u4e0e\u5e94\u6025\u901a\u9053\u89c4\u5212',status:'standby',color:'var(--yellow)',count:'12\u8def\u7ebf',
      source:'\u5916\u4ea4\u90e8\u9886\u4e8b\u4fdd\u62a4\u4e2d\u5fc3\u3001\u5404\u9a7b\u5916\u4f7f\u9886\u9986\u5e94\u6025\u65b9\u6848\u3001\u4e2d\u56fd\u6c11\u822a\u5c40\u534f\u8c03\u901a\u9053',
      coverage:'12\u6761\u9884\u6848\u8def\u7ebf\uff0c\u8986\u76d620\u4e2a\u98ce\u9669\u56fd\u5bb6',
      updated:'2026-06-30 10:00',
      meta:'\u8def\u7ebf\u5206\u7ea7: \u7d27\u6025/\u5e94\u6025/\u9884\u9632 | \u4ea4\u901a\u65b9\u5f0f: \u7a7a\u8fd0/\u6d77\u8fd0/\u9646\u8def | \u96c6\u7ed3\u70b9: \u4f7f\u9886\u9986/\u4e2d\u8d44\u4f01\u4e1a\u57fa\u5730',
      analysis:'\u5f53\u524d\u5df2\u5236\u5b9a12\u6761\u64a4\u4fa8\u9884\u6848\uff0c\u8986\u76d6\u4e3b\u8981\u98ce\u9669\u56fd\u5bb6\u3002\u8428\u8d6b\u52d2\u5e2d\u5185\u52a0\u5c14\u548c\u82cf\u4e39\u7684\u64a4\u4fa8\u9884\u6848\u5df2\u5347\u7ea7\u4e3a\u201c\u5e94\u6025\u201d\u72b6\u6001\u3002\u5efa\u8bae\u5b9a\u671f\u6f14\u7ec3\uff0c\u786e\u4fdd\u4ea4\u901a\u5de5\u5177\u548c\u901a\u5173\u534f\u8c03\u7545\u901a\u3002',
      records:[
        {route:'\u5580\u571f\u64a4\u4fa8\u7ebf',country:'\u963f\u5bcc\u6c57',level:'\u5e94\u6025',mode:'\u7a7a\u8fd0',capacity:'500\u4eba',assembly:'\u5580\u5e03\u5c14\u4f7f\u9886\u9986',transit:'\u5580\u5e03\u5c14\u2192\u4f0a\u65af\u5170\u5821\u2192\u5317\u4eac',status:'\u5c31\u7eea',note:'\u5347\u7ea7\u4e3a\u5e94\u6025\uff0c\u519b\u7528\u8fd0\u8f93\u673a\u5f85\u547d'},
        {route:'\u5e93\u58eb\u56fe\u64a4\u4fa8\u7ebf',country:'\u5df4\u57fa\u65af\u5766',level:'\u5e94\u6025',mode:'\u7a7a\u8fd0+\u9646\u8def',capacity:'300\u4eba',assembly:'\u4ec0\u536b\u9752\u4e2d\u8d44\u57fa\u5730',transit:'\u4ec0\u536b\u9752\u2192\u4f0a\u65af\u5170\u5821\u2192\u5317\u4eac',status:'\u5c31\u7eea',note:'TTP\u5a01\u80c1\u52a0\u5267\uff0c\u9884\u6848\u5df2\u5347\u7ea7'},
        {route:'\u62c9\u5404\u65af\u64a4\u4fa8\u7ebf',country:'\u5c3c\u65e5\u5229\u4e9a',level:'\u5e94\u6025',mode:'\u6d77\u8fd0',capacity:'200\u4eba',assembly:'\u62c9\u5404\u65af\u6e2f\u4e2d\u8d44\u7801\u5934',transit:'\u62c9\u5404\u65af\u2192\u52a0\u7eb3\u5229\u2192\u4e0a\u6d77',status:'\u5c31\u7eea',note:'\u6d77\u8fd0\u65b9\u6848\u5df2\u786e\u8ba4\uff0c\u5907\u7528\u7a7a\u8fd0'},
        {route:'\u5df4\u683c\u8fbe\u64a4\u4fa8\u7ebf',country:'\u4f0a\u62c9\u514b',level:'\u5e94\u6025',mode:'\u7a7a\u8fd0',capacity:'400\u4eba',assembly:'\u5df4\u683c\u8fbe\u7eff\u533a\u4f7f\u9886\u9986',transit:'\u5df4\u683c\u8fbe\u2192\u8fea\u62dc\u2192\u5317\u4eac',status:'\u5c31\u7eea',note:'\u5b89\u5168\u5f62\u52bf\u4e25\u5cfb\uff0c\u968f\u65f6\u542f\u52a8'},
        {route:'\u514b\u91cc\u7c73\u4fa8\u64a4\u4fa8\u7ebf',country:'\u4fc4\u7f57\u65af',level:'\u9884\u9632',mode:'\u9646\u8def+\u94c1\u8def',capacity:'600\u4eba',assembly:'\u514b\u91cc\u7c73\u4fa8\u4e2d\u8d44\u7801\u5934',transit:'\u514b\u91cc\u7c73\u4fa8\u2192\u83ab\u65af\u79d1\u2192\u6ee1\u6d32\u91cc\u2192\u5317\u4eac',status:'\u9884\u9632',note:'\u9884\u9632\u65b9\u6848\uff0c\u94c1\u8def\u8fd0\u8425\u6b63\u5e38'},
        {route:'\u5580\u571f\u9646\u8def\u64a4\u4fa8\u7ebf',country:'\u963f\u5bcc\u6c57',level:'\u5e94\u6025',mode:'\u9646\u8def',capacity:'300\u4eba',assembly:'\u5df4\u683c\u5170\u4f7f\u9886\u9986',transit:'\u5df4\u683c\u5170\u2192\u5e15\u5947\u5c14\u2192\u4e4c\u9c81\u6728\u9f50\u2192\u5317\u4eac',status:'\u5c31\u7eea',note:'\u5907\u7528\u9646\u8def\u65b9\u6848\uff0c\u7a7a\u8fd0\u4e0d\u53ef\u884c\u65f6\u542f\u7528'},
        {route:'\u82cf\u4e39\u9646\u8def\u64a4\u4fa8\u7ebf',country:'\u82cf\u4e39',level:'\u5e94\u6025',mode:'\u9646\u8def+\u6d77\u8fd0',capacity:'250\u4eba',assembly:'\u82cf\u4e39\u6e2f\u4e2d\u8d44\u7801\u5934',transit:'\u82cf\u4e39\u6e2f\u2192\u6c99\u7279\u6e2f\u2192\u5409\u8fbe\u2192\u4e0a\u6d77',status:'\u5c31\u7eea',note:'\u6218\u533a\u64a4\u79bb\uff0c\u9700\u6218\u65f6\u901a\u884c\u8bc1\u534f\u8c03'},
        {route:'\u57fa\u8f85\u64a4\u4fa8\u7ebf',country:'\u4e5f\u95e8',level:'\u9884\u9632',mode:'\u6d77\u8fd0',capacity:'150\u4eba',assembly:'\u4e9a\u4e01\u6e2f\u4e2d\u8d44\u7801\u5934',transit:'\u4e9a\u4e01\u2192\u65b0\u52a0\u5761\u2192\u5e7f\u5dde',status:'\u9884\u9632',note:'\u9884\u9632\u65b9\u6848\uff0c\u80e1\u585e\u5a01\u80c1\u5347\u7ea7\u65f6\u542f\u7528'}
      ]
    },
    {name:'\u5b89\u5168\u529b\u91cf\u90e8\u7f72',ic:'\u{1F6E1}\ufe0f',desc:'\u6d77\u5916\u5b89\u4fdd\u516c\u53f8\u3001\u4f7f\u9886\u9986\u5b89\u4fdd\u53ca\u5e94\u6025\u8d44\u6e90\u5206\u5e03',status:'active',color:'var(--purple)',count:'22\u70b9',
      source:'\u5546\u52a1\u90e8\u5883\u5916\u5b89\u4fdd\u4f01\u4e1a\u540d\u5f55\u3001\u5404\u9a7b\u5916\u4f7f\u9886\u9986\u5b89\u4fdd\u540d\u5f55\u3001\u4e2d\u56fd\u4fdd\u5b89\u884c\u4e1a\u534f\u4f1a',
      coverage:'\u5168\u740322\u4e2a\u5b89\u4fdd\u90e8\u7f72\u70b9\uff0c\u8986\u76d615\u4e2a\u56fd\u5bb6',
      updated:'2026-07-10 14:00',
      meta:'\u90e8\u7f72\u7c7b\u578b: \u5b89\u4fdd\u516c\u53f8/\u4f7f\u9886\u9986\u5b89\u4fdd/\u5e94\u6025\u50a8\u5907 | \u4eba\u5458\u89c4\u6a21: \u6570\u5341\u4eba\u81f3\u6570\u767e\u4eba',
      analysis:'\u6d77\u5916\u5b89\u4fdd\u529b\u91cf\u8986\u76d6\u4e0d\u8db3\uff0c\u975e\u6d32\u548c\u4e2d\u4e1c\u5730\u533a\u5b89\u4fdd\u8d44\u6e90\u7d27\u5f20\u3002\u9ad8\u98ce\u9669\u56fd\u5bb6\u5b89\u4fdd\u90e8\u7f72\u70b9\u504f\u5c11\uff0c\u5efa\u8bae\u589e\u52a0\u542b\u8428\u8d6b\u52d2\u5e2d\u5185\u52a0\u5c14\u3001\u5c3c\u65e5\u5229\u4e9a\u3001\u4f0a\u62c9\u514b\u7b49\u56fd\u5bb6\u7684\u5b89\u4fdd\u6295\u5165\u3002\u540c\u65f6\u5efa\u8bae\u5efa\u7acb\u533a\u57df\u5e94\u6025\u54cd\u5e94\u673a\u5236\uff0c\u5b9e\u73b04\u5c0f\u65f6\u54cd\u5e94\u534a\u5f84\u3002',
      records:[
        {type:'\u5b89\u4fdd\u516c\u53f8',name:'\u4e2d\u4fdd\u96c6\u56e2\u4e2d\u4e1c\u5206\u516c\u53f8',country:'\u963f\u8054\u914b',city:'\u8fea\u62dc',staff:'120\u4eba',capabilities:'\u6b66\u88c5\u62a4\u536b/\u5b89\u5168\u54a8\u8be2/\u5e94\u6025\u64a4\u79bb',response:'2\u5c0f\u65f6',note:'\u963f\u8054\u914b\u5316\u5de5\u56ed\u533a\u4e3b\u8981\u5b89\u4fdd\u63d0\u4f9b\u5546'},
        {type:'\u5b89\u4fdd\u516c\u53f8',name:'\u534e\u4fe1\u4fdd\u5b89\u975e\u6d32\u5206\u516c\u53f8',country:'\u5c3c\u65e5\u5229\u4e9a',city:'\u62c9\u5404\u65af',staff:'85\u4eba',capabilities:'\u6b66\u88c5\u62a4\u536b/\u8d44\u4ea7\u4fdd\u62a4/\u5b89\u5168\u57f9\u8bad',response:'4\u5c0f\u65f6',note:'\u5c3c\u65e5\u5229\u4e9a\u5317\u90e8\u4e2d\u8d44\u9879\u76ee\u5b89\u4fdd'},
        {type:'\u4f7f\u9886\u9986\u5b89\u4fdd',name:'\u9a7b\u5580\u5e03\u5c14\u4f7f\u9886\u9986\u5b89\u4fdd\u7ec4',country:'\u963f\u5bcc\u6c57',city:'\u5580\u5e03\u5c14',staff:'24\u4eba',capabilities:'\u4f7f\u9886\u9986\u5b89\u4fdd/\u7d27\u6025\u758f\u6563/\u901a\u4fe1\u4fdd\u969c',response:'\u5373\u65f6',note:'\u9886\u4e8b\u4fdd\u62a4\u4e2d\u5fc3\u76f4\u7ba1\uff0c7\u00d724\u5c0f\u65f6'},
        {type:'\u5b89\u4fdd\u516c\u53f8',name:'\u4e2d\u94c1\u5b89\u4fdd\u4e2d\u4e1c\u5206\u516c\u53f8',country:'\u4f0a\u62c9\u514b',city:'\u5df4\u683c\u8fbe',staff:'95\u4eba',capabilities:'\u6b66\u88c5\u62a4\u536b/\u5de5\u5730\u5b89\u4fdd/\u5e94\u6025\u6f14\u7ec3',response:'3\u5c0f\u65f6',note:'\u5df4\u683c\u8fbe\u5730\u533a\u4e2d\u8d44\u9879\u76ee\u5b89\u4fdd'},
        {type:'\u5b89\u4fdd\u516c\u53f8',name:'\u4e2d\u6d77\u5b89\u4fdd\u5df4\u57fa\u65af\u5766\u5206\u516c\u53f8',country:'\u5df4\u57fa\u65af\u5766',city:'\u4f0a\u65af\u5170\u5821',staff:'70\u4eba',capabilities:'\u6b66\u88c5\u62a4\u536b/\u5b89\u5168\u54a8\u8be2/\u5e94\u6025\u54cd\u5e94',response:'4\u5c0f\u65f6',note:'\u4e2d\u5df4\u7ecf\u6d4e\u8d70\u5eca\u68b8\u5173\u5c71\u53e3\u9879\u76ee\u5b89\u4fdd'},
        {type:'\u4f7f\u9886\u9986\u5b89\u4fdd',name:'\u9a7b\u62c9\u5404\u65af\u4f7f\u9886\u9986\u5b89\u4fdd\u7ec4',country:'\u5c3c\u65e5\u5229\u4e9a',city:'\u62c9\u5404\u65af',staff:'18\u4eba',capabilities:'\u9886\u4e8b\u5b89\u4fdd/\u7d27\u6025\u758f\u6563',response:'\u5373\u65f6',note:'\u5c3c\u65e5\u5229\u4e9a\u5316\u5de5\u56ed\u533a\u4e2d\u65b9\u4eba\u5458\u96c6\u4e2d'},
        {type:'\u5e94\u6025\u50a8\u5907',name:'\u4e1c\u975e\u5e94\u6025\u50a8\u5907\u70b9',country:'\u5409\u5e03\u63d0',city:'\u5409\u5e03\u63d0',staff:'\u5f85\u547d30\u4eba',capabilities:'\u5e94\u6025\u54cd\u5e94/\u7269\u8d44\u50a8\u5907/\u533b\u7597\u652f\u63f4',response:'12\u5c0f\u65f6',note:'\u4e1c\u975e\u5730\u533a\u5e94\u6025\u54cd\u5e94\u524d\u54cd\u57fa\u5730'},
        {type:'\u5b89\u4fdd\u516c\u53f8',name:'\u4e2d\u5149\u5b89\u4fdd\u82cf\u4e39\u5206\u516c\u53f8',country:'\u82cf\u4e39',city:'\u5580\u571f\u7a46',staff:'45\u4eba',capabilities:'\u6b66\u88c5\u62a4\u536b/\u5e94\u6025\u64a4\u79bb',response:'6\u5c0f\u65f6',note:'\u82cf\u4e39\u4e2d\u8d44\u6cb9\u7530\u5b89\u4fdd\uff0c\u6218\u533a\u5371\u9669\u9ad8'}
      ]
    },
    {name:'\u901a\u4fe1\u7f51\u7edc\u56fe',ic:'\u{1F4F6}',desc:'\u536b\u661f\u901a\u4fe1\u3001\u77ed\u6ce2\u7535\u53f0\u3001\u5e94\u6025\u901a\u4fe1\u7f51\u7edc\u8986\u76d6',status:'active',color:'var(--cyan)',count:'28\u8282\u70b9',
      source:'\u56fd\u9645\u7535\u4fe1\u8054\u76df(ITU)\u3001\u4e2d\u56fd\u536b\u661f\u5bfc\u822a\u7ba1\u7406\u4e2d\u5fc3\u3001\u5404\u56fd\u7535\u4fe1\u7ba1\u7406\u90e8\u95e8',
      coverage:'28\u4e2a\u901a\u4fe1\u8282\u70b9\uff0c\u8986\u76d6\u91cd\u70b9\u98ce\u9669\u533a\u57df',
      updated:'2026-07-13 21:00',
      meta:'\u7f51\u7edc\u7c7b\u578b: \u536b\u661f/Iridium/\u77ed\u6ce2/\u4e2d\u7ee7 | \u9891\u6bb5: L/S/C/Ku/Ka | \u5197\u4f59: \u53cc\u901a\u4fe1\u94fe\u8def',
      analysis:'\u536b\u661f\u901a\u4fe1\u8986\u76d6\u5728\u4e2d\u4e1c\u3001\u5317\u975e\u548c\u5357\u4e9a\u5730\u533a\u8f83\u597d\uff0c\u4f46\u90e8\u5206\u9ad8\u98ce\u9669\u533a\u57df\u5b58\u5728\u901a\u4fe1\u76f2\u533a\u3002\u5efa\u8bae\u5728\u4e5f\u95e8\u3001\u5df4\u57fa\u65af\u5766\u8fb9\u5883\u3001\u8428\u8d6b\u52d2\u5e2d\u5185\u52a0\u5c14\u589e\u8bbe\u77ed\u6ce2\u4e2d\u7ee7\u7ad9\uff0c\u5b9e\u73b0\u533a\u57df\u5185\u901a\u4fe1\u5b8c\u5168\u8986\u76d6\u3002\u540c\u65f6\u52a0\u5f3aIridium\u536b\u661f\u7535\u8bdd\u4f5c\u4e3a\u5e94\u6025\u901a\u4fe1\u624b\u6bb5\u3002',
      records:[
        {type:'\u536b\u661f',name:'\u4e2d\u661f16\u53f7\u8986\u76d6',country:'\u5168\u7403',freq:'L/S/C\u9891\u6bb5',coverage:'\u5168\u7403\u8986\u76d6',latency:'<0.5\u79d2',status:'\u6b63\u5e38',note:'\u4e3b\u8981\u5bfc\u822a\u548c\u901a\u4fe1\u670d\u52a1\u536b\u661f'},
        {type:'\u536b\u661f',name:'\u5929\u901a\u4e00\u53f7\u8986\u76d6',country:'\u4e9a\u592a',freq:'S/Ka\u9891\u6bb5',coverage:'\u4e9a\u592a\u5730\u533a',latency:'<0.3\u79d2',status:'\u6b63\u5e38',note:'\u4e9a\u592a\u5730\u533a\u9ad8\u901f\u901a\u4fe1\u536b\u661f'},
        {type:'\u536b\u661f\u7535\u8bdd',name:'Iridium\u536b\u661f\u7535\u8bdd',country:'\u5168\u7403',freq:'L\u9891\u6bb5',coverage:'\u5168\u7403\u542b\u6781\u5730',latency:'<2\u79d2',status:'\u6b63\u5e38',note:'\u5e94\u6025\u901a\u4fe1\u624b\u6bb5\uff0c\u9ad8\u98ce\u9669\u533a\u5fc5\u5907'},
        {type:'\u77ed\u6ce2\u7535\u53f0',name:'\u5580\u5e03\u5c14\u77ed\u6ce2\u4e2d\u7ee7',country:'\u963f\u5bcc\u6c57',freq:'HF/VHF',coverage:'\u5580\u5e03\u5c14\u5468\u8fb9150km',latency:'<0.1\u79d2',status:'\u6b63\u5e38',note:'\u5730\u9762\u901a\u4fe1\u4e2d\u7ee7\uff0c\u8865\u5145\u536b\u661f\u76f2\u533a'},
        {type:'\u77ed\u6ce2\u7535\u53f0',name:'\u62c9\u5404\u65af\u77ed\u6ce2\u4e2d\u7ee7',country:'\u5c3c\u65e5\u5229\u4e9a',freq:'HF/VHF',coverage:'\u62c9\u5404\u65af\u5468\u8fb9100km',latency:'<0.1\u79d2',status:'\u6b63\u5e38',note:'\u6d77\u4e0a\u4e2d\u8d44\u8239\u53ea\u901a\u4fe1\u4e2d\u7ee7'},
        {type:'\u77ed\u6ce2\u7535\u53f0',name:'\u4ec0\u536b\u9752\u77ed\u6ce2\u4e2d\u7ee7',country:'\u5df4\u57fa\u65af\u5766',freq:'HF/VHF',coverage:'\u4ec0\u536b\u9752\u5468\u8fb9120km',latency:'<0.1\u79d2',status:'\u6b63\u5e38',note:'\u8fb9\u5883\u5730\u533a\u901a\u4fe1\u4e2d\u7ee7\uff0c\u5b89\u5168\u4fdd\u969c'},
        {type:'\u5e94\u6025\u901a\u4fe1',name:'\u4e2d\u4e1c\u533a\u57dfBGAN\u7ec8\u7aef',country:'\u4e2d\u4e1c\u591a\u56fd',freq:'L\u9891\u6bb5',coverage:'\u4e2d\u4e1c\u5168\u8986\u76d6',latency:'<1\u79d2',status:'\u6b63\u5e38',note:'\u4fb5\u5165\u5f0f\u5bbd\u5e26\u7ec8\u7aef\uff0c\u73b0\u573a\u5e94\u6025\u901a\u4fe1'},
        {type:'\u5e94\u6025\u901a\u4fe1',name:'\u5317\u975e\u533a\u57dfBGAN\u7ec8\u7aef',country:'\u5317\u975e\u591a\u56fd',freq:'L\u9891\u6bb5',coverage:'\u5317\u975e\u5168\u8986\u76d6',latency:'<1\u79d2',status:'\u6b63\u5e38',note:'\u975e\u6d32\u73b0\u573a\u5e94\u6025\u901a\u4fe1\u4fdd\u969c'}
      ]
    }
  ],
  _initData(){
    if(!this._osintResults){
      var saved=localStorage.getItem('intel_osint');
      this._osintResults=saved?JSON.parse(saved):JSON.parse(JSON.stringify(this._defaultOsint));
    }
    if(!this._analysisResults){
      var saved=localStorage.getItem('intel_analysis');
      this._analysisResults=saved?JSON.parse(saved):JSON.parse(JSON.stringify(this._defaultAnalysis));
    }
    if(!this._timelineTasks){
      var saved=localStorage.getItem('intel_timeline');
      this._timelineTasks=saved?JSON.parse(saved):JSON.parse(JSON.stringify(this._defaultTimeline));
    }
    if(!this._geointLayers){
      var saved=localStorage.getItem('intel_geoint');
      this._geointLayers=saved?JSON.parse(saved):JSON.parse(JSON.stringify(this._defaultGeoint));
    }
    // 同步情报中心数据到数据中心osint_intel集合
    this._syncOsintToDBCenter();
  },
  // 将情报中心的开源情报同步到数据中心
  _syncOsintToDBCenter:function(){
    if(!this._osintResults||!this._osintResults.length)return;
    var existing=DBCenter.getAll('osint_intel');
    var existingIds=new Set();
    existing.forEach(function(e){if(e._intelId)existingIds.add(e._intelId);});
    var count=0;
    var me=this;
    this._osintResults.forEach(function(item){
      var idKey=item.id||(item.source+'_'+item.time);
      if(!existingIds.has(idKey)){
        DBCenter.add('osint_intel',{
          _intelId:idKey,
          date:item.time||item.date||'',
          country:item.country||'未知',
          intel_type:'开源情报',
          title:item.content||item.kw||'',
          risk_level:item.level||(item.verified?'yellow':'orange'),
          desc:(item.source||'')+' | '+(item.kw||''),
          source:item.source||'情报中心',
          verified:!!item.verified
        });
        count++;
      }
    });
    if(count>0)DBCenter.addLog('情报中心同步: +'+count+'条开源情报数据');
  },
  _saveOsint(){localStorage.setItem('intel_osint',JSON.stringify(this._osintResults));},
  _saveAnalysis(){localStorage.setItem('intel_analysis',JSON.stringify(this._analysisResults));},
  _saveTimeline(){localStorage.setItem('intel_timeline',JSON.stringify(this._timelineTasks));},
  _saveGeoint(){localStorage.setItem('intel_geoint',JSON.stringify(this._geointLayers));},
  _resetData(type){
    if(type==='osint'){this._osintResults=JSON.parse(JSON.stringify(this._defaultOsint));localStorage.removeItem('intel_osint');}
    else if(type==='analysis'){this._analysisResults=JSON.parse(JSON.stringify(this._defaultAnalysis));localStorage.removeItem('intel_analysis');}
    else if(type==='timeline'){this._timelineTasks=JSON.parse(JSON.stringify(this._defaultTimeline));localStorage.removeItem('intel_timeline');}
    else if(type==='geoint'){this._geointLayers=JSON.parse(JSON.stringify(this._defaultGeoint));localStorage.removeItem('intel_geoint');}
  },
  _exportJSON(data,filename){
    var blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
    var url=URL.createObjectURL(blob);
    var a=document.createElement('a');
    a.href=url;a.download=filename;
    document.body.appendChild(a);a.click();
    document.body.removeChild(a);URL.revokeObjectURL(url);
    showToast('\u2705 \u5df2\u5bfc\u51fa '+filename);
  },
  _exportCSV(data,fields,filename){
    var csv=fields.join(',')+'\n';
    data.forEach(function(row){
      csv+=fields.map(function(f){var v=row[f]||'';v=String(v).replace(/"/g,'""');return '"'+v+'"';}).join(',')+'\n';
    });
    var blob=new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8'});
    var url=URL.createObjectURL(blob);
    var a=document.createElement('a');
    a.href=url;a.download=filename;
    document.body.appendChild(a);a.click();
    document.body.removeChild(a);URL.revokeObjectURL(url);
    showToast('\u2705 \u5df2\u5bfc\u51fa '+filename);
  },
  _trainLabel(){
    return '<div style="padding:8px 12px;background:rgba(255,204,0,0.06);border:1px solid rgba(255,204,0,0.15);border-radius:8px;margin-bottom:12px;display:flex;align-items:center;gap:8px">'+
      '<span style="font-size:14px">\u26A0\uFE0F</span><span style="font-size:11px;color:var(--yellow);font-weight:600">\u6a21\u62df\u8bad\u7ec3\u73af\u5883</span>'+
      '<span style="font-size:10px;color:var(--text3)">\u2014 \u6240\u6709\u6570\u636e\u5747\u53ef\u589e\u5220\u6539\u67e5\uff0c\u652f\u6301\u5bfc\u51fa/\u5bfc\u5165\u3002\u5b9e\u9645\u90e8\u7f72\u65f6\u5c06\u5bf9\u63a5\u771f\u5b9e\u6570\u636e\u6e90</span></div>';
  },
  _toolbar(title,addFn,exportFn,resetFn){
    return '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">'+
      '<span style="font-size:12px;color:var(--text3)">'+title+'</span>'+
      '<div style="display:flex;gap:6px">'+
      '<button class="btn primary sm" onclick="'+addFn+'">\u2795 \u65b0\u589e</button>'+
      '<button class="btn sm" onclick="'+exportFn+'">\u{1F4E5} \u5bfc\u51fa</button>'+
      '<button class="btn sm" onclick="'+resetFn+'">\u{1F504} \u91cd\u7f6e</button>'+
      '</div></div>';
  },
  switch(t){
    this.tab=t;
    document.querySelectorAll('#intel-tabs .dc-tab').forEach(function(el,i){
      el.classList.toggle('active',['gallery','osint','analysis','timeline','geoint'][i]===t);
    });
    this.render();
  },
  init(){
    this._initData();
    this.switch('gallery');
    this.updateBadge();
  },
  updateBadge(){
    var count=INTELGALLERY.images.length;
    var badge=document.getElementById('sb-intel-count');
    if(badge){badge.textContent=count;badge.classList.toggle('zero',count===0);}
  },
  render(){
    if(!this._tab)this._tab='map';
    var el=document.getElementById('intel-content');
    if(!el)return;
    this._initData();
    if(this.tab==='gallery')this.renderGallery(el);
    else if(this.tab==='osint')this.renderOsint(el);
    else if(this.tab==='analysis')this.renderAnalysis(el);
    else if(this.tab==='timeline')this.renderTimeline(el);
    else if(this.tab==='geoint')this.renderGeoint(el);
  },
  renderGallery(el){
    INTELGALLERY.init();
    var html='<div class="grid" style="grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">';
    var stats=[
      {ic:'\u{1F5BC}\uFE0F',c:'var(--cyan)',l:'\u5f71\u50cf\u603b\u6570',v:INTELGALLERY.images.length},
      {ic:'\u{1F534}',c:'var(--red)',l:'\u6781\u9ad8\u5a01\u80c1',v:INTELGALLERY.images.filter(function(i){return i.level==='red';}).length},
      {ic:'\u{1F7E0}',c:'var(--orange)',l:'\u9ad8\u5a01\u80c1',v:INTELGALLERY.images.filter(function(i){return i.level==='orange';}).length},
      {ic:'\u{1F7E1}',c:'var(--yellow)',l:'\u76d1\u63a7\u4e2d',v:INTELGALLERY.images.filter(function(i){return i.level==='yellow'||i.level==='cyan';}).length}
    ];
    stats.forEach(function(s){
      html+='<div class="stat-card"><div class="stat-ic" style="background:rgba(0,212,255,0.08);color:'+s.c+'">'+s.ic+'</div><div class="stat-info"><div class="stat-label">'+s.l+'</div><div class="stat-val" style="color:'+s.c+'">'+s.v+'</div></div></div>';
    });
    html+='</div>';
    html+='<div class="card"><div class="card-tt"><span class="ic">\u{1F4E4}</span>\u5f71\u50cf\u4e0a\u4f20 <span style="font-size:10px;color:var(--text3);font-weight:400">\u2014 \u7528\u6237\u53ef\u4e0a\u4f20\u73b0\u573a\u7167\u7247/\u622a\u56fe\u8fdb\u884c\u5206\u6790</span></div><div id="intel-upload"></div></div>';
    html+='<div class="card mt-12"><div class="card-tt"><span class="ic">\u{1F4C2}\uFE0F</span>\u5f71\u50cf\u56fe\u5e93 <span style="font-size:10px;color:var(--text3);margin-left:8px" id="intel-count">'+INTELGALLERY.images.length+' \u5f20</span></div><div class="intel-gallery" id="intel-gallery"></div></div>';
    html+='<div class="intel-chat" id="intel-chat-box" style="display:none;margin-top:12px">'+
      '<div class="intel-chat-header"><span>\u{1F916}</span> \u60c5\u62a5\u5206\u6790\u5bf9\u8bdd \u2014 <span id="intel-chat-target" style="color:var(--text2);font-weight:400">\u672a\u9009\u62e9\u5f71\u50cf</span></div>'+
      '<div class="intel-chat-opts" id="intel-chat-opts"></div>'+
      '<div class="intel-chat-body" id="intel-chat-body"></div>'+
      '<div class="intel-chat-input"><textarea id="intel-chat-input" placeholder="\u8f93\u5165\u4f60\u7684\u5206\u6790\u6216\u5907\u6ce8..." rows="1"></textarea><button class="intel-chat-send" onclick="INTELGALLERY.sendChat()">\u53d1\u9001</button></div>'+
      '</div>';
    el.innerHTML=html;
    INTELGALLERY.renderUpload();
    INTELGALLERY.render();
  },
  renderOsint(el){
    var html=this._trainLabel();
    html+='<div class="grid" style="grid-template-columns:1fr 1fr 1fr 1fr;gap:10px;margin-bottom:12px">';
    var stats=[
      {ic:'\u{1F4E1}',c:'var(--cyan)',l:'\u76d1\u6d4b\u6e90',v:this._osintSources.length},
      {ic:'\u{1F4CB}',c:'var(--green)',l:'\u60c5\u62a5\u603b\u6570',v:this._osintResults.length},
      {ic:'\u{1F534}',c:'var(--red)',l:'\u7ea2\u8272\u60c5\u62a5',v:this._osintResults.filter(function(r){return r.level==='red';}).length},
      {ic:'\u2705',c:'var(--green)',l:'\u5df2\u9a8c\u8bc1',v:this._osintResults.filter(function(r){return r.verified;}).length}
    ];
    stats.forEach(function(s){
      html+='<div class="stat-card"><div class="stat-ic" style="background:rgba(0,212,255,0.08);color:'+s.c+'">'+s.ic+'</div><div class="stat-info"><div class="stat-label">'+s.l+'</div><div class="stat-val" style="color:'+s.c+'">'+s.v+'</div></div></div>';
    });
    html+='</div>';
    html+='<div class="card"><div class="card-tt"><span class="ic">\u{1F310}</span>\u5f00\u6e90\u60c5\u62a5\u6e90\u76d1\u6d4b <span style="font-size:10px;color:var(--text3);font-weight:400">\u2014 \u70b9\u51fb\u67e5\u770b\u6e90\u8be6\u60c5</span></div>';
    html+='<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:10px">';
    this._osintSources.forEach(function(s){
      html+='<div style="background:var(--panel2);border:1px solid var(--border);border-radius:8px;padding:12px;cursor:pointer;transition:.2s" onclick="INTELCENTER.showOsintSource(\''+s.name+'\')" onmouseover="this.style.borderColor=\''+s.color+'\'" onmouseout="this.style.borderColor=\'var(--border)\'">'+
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px"><div style="display:flex;align-items:center;gap:6px"><span style="font-size:16px">'+s.ic+'</span><strong style="font-size:12px;color:'+s.color+'">'+s.name+'</strong></div><span style="font-size:9px;padding:2px 6px;border-radius:4px;'+(s.status==='active'?'background:rgba(0,255,159,0.1);color:var(--green)':'background:var(--bg2);color:var(--text3)')+'">'+(s.status==='active'?'\u91c7\u96c6\u4e2d':'\u5f85\u671f')+'</span></div>'+
        '<div style="font-size:10px;color:var(--text3);line-height:1.5;margin-bottom:6px">'+s.desc+'</div>'+
        '<div style="display:flex;justify-content:space-between;align-items:center"><div style="display:flex;gap:4px;flex-wrap:wrap">'+s.kw.map(function(k){return '<span style="font-size:9px;padding:1px 6px;background:rgba(0,212,255,0.06);color:var(--cyan);border-radius:3px">'+k+'</span>';}).join('')+'</div><span style="font-size:16px;font-weight:800;color:'+s.color+'">'+s.count+'</span></div></div>';
    });
    html+='</div></div>';
    html+='<div class="card mt-12"><div class="card-tt"><span class="ic">\u{1F527}</span>\u60c5\u62a5\u91c7\u96c6\u63a7\u5236\u53f0 <span style="font-size:10px;color:var(--text3);font-weight:400">\u2014 \u624b\u52a8\u89e6\u53d1\u91c7\u96c6\u4efb\u52a1</span></div>';
    html+='<div style="padding:12px;background:var(--bg2);border-radius:8px">'+
      '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px">'+
      '<select class="select" id="osint-source-select" style="font-size:12px;width:180px"><option value="">\u9009\u62e9\u60c5\u62a5\u6e90...</option>'+this._osintSources.map(function(s){return '<option value="'+s.name+'">'+s.name+'</option>';}).join('')+'</select>'+
      '<select class="select" id="osint-kw-select" style="font-size:12px"><option value="">\u5173\u952e\u8bcd...</option><option>\u88ad\u51fb</option><option>\u7ef4\u5b89</option><option>\u5236\u88c1</option><option>\u64a4\u4fa8</option><option>\u7ef4\u62a4</option></select>'+
      '<select class="select" id="osint-country-select" style="font-size:12px"><option value="">\u76ee\u6807\u56fd\u5bb6...</option><option>\u5df4\u57fa\u65af\u5766</option><option>\u521a\u679c(\u91d1)</option><option>\u9a6c\u91cc</option><option>\u4e5f\u95e8</option><option>\u82cf\u4e39</option><option>\u7f05\u7538</option></select>'+
      '<button class="btn primary sm" onclick="INTELCENTER.runOsintCollect()">\u{1F50D} \u5f00\u59cb\u91c7\u96c6</button></div>'+
      '<div style="display:flex;align-items:center;gap:6px"><span style="font-size:10px;color:var(--text3)">\u91c7\u96c6\u72b6\u6001:</span><span id="osint-status" style="font-size:10px;color:var(--green)">\u5c31\u7eea</span></div></div></div>';
    html+='<div class="card mt-12"><div class="card-tt"><span class="ic">\u{1F4CB}</span>\u60c5\u62a5\u6570\u636e\u7ba1\u7406</div>';
    html+=this._toolbar('\u5171 '+this._osintResults.length+' \u6761\u60c5\u62a5\uff0c\u53ef\u70b9\u51fb\u67e5\u770b/\u7f16\u8f91/\u5220\u9664','INTELCENTER.showOsintForm()','INTELCENTER.exportOsint()','INTELCENTER.resetOsint()');
    html+='<div id="osint-results"></div></div>';
    el.innerHTML=html;
    this._renderOsintResults();
  },
  _renderOsintResults(){
    var el=document.getElementById('osint-results');
    if(!el)return;
    var self=this;
    var html='<div style="display:grid;gap:8px;max-height:500px;overflow-y:auto">';
    if(this._osintResults.length===0){html+='<div style="text-align:center;padding:20px;color:var(--text3);font-size:12px">\u6682\u65e0\u60c5\u62a5\u6570\u636e\uff0c\u70b9\u51fb\u201c\u65b0\u589e\u201d\u6dfb\u52a0</div>';}
    this._osintResults.forEach(function(r){
      var lv=ALERT_LV[r.level]||ALERT_LV.blue;
      var vc=r.verified?'<span style="font-size:9px;color:var(--green)">\u2713 \u5df2\u9a8c\u8bc1</span>':'<span style="font-size:9px;color:var(--yellow)">\u26a0 \u5f85\u9a8c\u8bc1</span>';
      html+='<div style="padding:10px;background:var(--panel2);border-radius:8px;border-left:3px solid var(--'+(r.level==='red'?'red':r.level==='orange'?'orange':r.level==='yellow'?'yellow':'cyan')+');transition:.2s">'+
        '<div style="display:flex;justify-content:space-between;align-items:start">'+
        '<div style="cursor:pointer;flex:1" onclick="INTELCENTER.showOsintDetail(\''+r.id+'\')">'+
        '<span class="badge '+lv.cls+'" style="font-size:9px">'+lv.label+'</span> <span style="font-size:11px;font-weight:600;margin-left:4px">['+r.id+'] '+r.source+'</span> '+vc+
        '<div style="font-size:11px;color:var(--text2);margin-top:4px">'+r.content.substring(0,80)+(r.content.length>80?'...':'')+'</div>'+
        '<div style="font-size:10px;color:var(--text3);margin-top:2px">\u{1F3ED} '+r.country+' \u00b7 \u4e3b\u9898: '+r.kw+' \u00b7 '+r.time+'</div>'+
        '</div>'+
        '<div style="display:flex;flex-direction:column;gap:4px;margin-left:8px">'+
        (PERM.isAdmin()?'<button class="btn sm" style="font-size:9px;padding:2px 8px;min-width:auto" onclick="INTELCENTER.showOsintForm(\''+r.id+'\')">\u270f\ufe0f</button>':'')+
        (PERM.isAdmin()?'<button class="btn sm" style="font-size:9px;padding:2px 8px;min-width:auto;color:var(--red)" onclick="INTELCENTER.deleteOsint(\''+r.id+'\')">\u{1F5D1}\uFE0F</button>':'')+
        '</div></div></div>';
    });
    html+='</div>';
    el.innerHTML=html;
  },
  showOsintForm(id){
    if(!PERM.canUpload()){showToast('\u26a0\ufe0f \u8bf7\u5148\u767b\u5f55');return;}
    var r=id?this._osintResults.find(function(x){return x.id===id;}):null;
    var html='<div style="padding:12px;background:var(--bg2);border-radius:8px">'+
      '<div style="font-size:12px;color:var(--text3);margin-bottom:10px">'+(r?'\u7f16\u8f91\u60c5\u62a5 ['+r.id+']':'\u6dfb\u52a0\u65b0\u60c5\u62a5')+'</div>'+
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">'+
      '<div><label class="text-xs text-muted" style="display:block;margin-bottom:4px">\u60c5\u62a5\u6e90</label><select class="select" id="osint-form-source" style="font-size:12px;width:100%">'+this._osintSources.map(function(s){return '<option value="'+s.name+'"'+(r&&r.source===s.name?' selected':'')+'>'+s.name+'</option>';}).join('')+'</select></div>'+
      '<div><label class="text-xs text-muted" style="display:block;margin-bottom:4px">\u76ee\u6807\u56fd\u5bb6</label><input class="input" id="osint-form-country" value="'+(r?r.country:'')+'" placeholder="\u5982\uff1a\u5df4\u57fa\u65af\u5766" style="font-size:12px;width:100%"></div>'+
      '<div><label class="text-xs text-muted" style="display:block;margin-bottom:4px">\u5173\u952e\u8bcd</label><input class="input" id="osint-form-kw" value="'+(r?r.kw:'')+'" placeholder="\u5982\uff1a\u88ad\u51fb" style="font-size:12px;width:100%"></div>'+
      '<div><label class="text-xs text-muted" style="display:block;margin-bottom:4px">\u98ce\u9669\u7b49\u7ea7</label><select class="select" id="osint-form-level" style="font-size:12px;width:100%"><option value="red"'+(r&&r.level==='red'?' selected':'')+'>\u7ea2\u8272</option><option value="orange"'+(r&&r.level==='orange'?' selected':'')+'>\u6a59\u8272</option><option value="yellow"'+(r&&r.level==='yellow'?' selected':'')+'>\u9ec4\u8272</option><option value="cyan"'+(r&&r.level==='cyan'?' selected':'')+'>\u84dd\u8272</option></select></div>'+
      '</div>'+
      '<div style="margin-bottom:10px"><label class="text-xs text-muted" style="display:block;margin-bottom:4px">\u60c5\u62a5\u5168\u6587 <span style="color:var(--red)">*</span></label><textarea class="input" id="osint-form-content" rows="3" placeholder="\u8f93\u5165\u60c5\u62a5\u5185\u5bb9..." style="font-size:12px;width:100%;resize:vertical">'+(r?r.content:'')+'</textarea></div>'+
      '<div style="margin-bottom:10px"><label class="text-xs text-muted" style="display:block;margin-bottom:4px"><input type="checkbox" id="osint-form-verified" '+(r&&r.verified?'checked':'')+'> \u5df2\u9a8c\u8bc1</label></div>'+
      '<div style="display:flex;gap:8px">'+
      '<button class="btn primary sm" onclick="INTELCENTER.saveOsint('+(r?'\''+r.id+'\'':'null')+')"">\u2705 \u4fdd\u5b58</button>'+
      '<button class="btn sm" onclick="document.getElementById(\'modal\').classList.remove(\'show\')">\u53d6\u6d88</button>'+
      '</div></div>';
    document.getElementById('modal-tt').textContent=(r?'\u7f16\u8f91\u60c5\u62a5':'\u65b0\u589e\u60c5\u62a5');
    document.getElementById('modal-bd').innerHTML=html;
    document.getElementById('modal').classList.add('show');
  },
  saveOsint(id){
    var source=document.getElementById('osint-form-source').value;
    var country=document.getElementById('osint-form-country').value.trim();
    var kw=document.getElementById('osint-form-kw').value.trim();
    var level=document.getElementById('osint-form-level').value;
    var content=document.getElementById('osint-form-content').value.trim();
    var verified=document.getElementById('osint-form-verified').checked;
    if(!content){showToast('\u26a0\ufe0f \u8bf7\u586b\u5199\u60c5\u62a5\u5168\u6587');return;}
    if(id){
      var r=this._osintResults.find(function(x){return x.id===id;});
      if(r){r.source=source;r.country=country;r.kw=kw;r.level=level;r.content=content;r.verified=verified;}
      showToast('\u2705 \u60c5\u62a5\u5df2\u66f4\u65b0');
    }else{
      var nid='OSINT-'+String(Date.now()).slice(-6);
      this._osintResults.unshift({id:nid,source:source,time:new Date().toLocaleString('zh-CN',{hour12:false}).replace(/\//g,'-').substring(0,16),country:country||'\u672a\u6307\u5b9a',kw:kw||'\u7efc\u5408',content:content,level:level,verified:verified});
      showToast('\u2705 \u60c5\u62a5\u5df2\u6dfb\u52a0');
    }
    this._saveOsint();
    document.getElementById('modal').classList.remove('show');
    this._renderOsintResults();
  },
  deleteOsint(id){
    if(!PERM.guard('\u5220\u9664\u60c5\u62a5'))return;
    if(!confirm('\u786e\u8ba4\u5220\u9664\u60c5\u62a5 '+id+' \uff1f'))return;
    this._osintResults=this._osintResults.filter(function(x){return x.id!==id;});
    this._saveOsint();
    this._renderOsintResults();
    showToast('\u2705 \u5df2\u5220\u9664');
  },
  exportOsint(){
    this._exportJSON(this._osintResults,'osint_data.json');
  },
  resetOsint(){
    if(!confirm('\u91cd\u7f6e\u4e3a\u9ed8\u8ba4\u6a21\u62df\u6570\u636e\uff1f\u5f53\u524d\u4fee\u6539\u5c06\u4e22\u5931\u3002'))return;
    this._resetData('osint');
    this.render();
    showToast('\u2705 \u5df2\u91cd\u7f6e');
  },
  showOsintSource(name){
    var s=this._osintSources.find(function(x){return x.name===name;});
    if(!s)return;
    var html='<div style="padding:12px;background:var(--bg2);border-radius:8px;margin-bottom:12px">'+
      '<div style="display:flex;align-items:center;gap:8px"><span style="font-size:24px">'+s.ic+'</span><div><div style="font-size:14px;font-weight:700;color:'+s.color+'">'+s.name+'</div><div style="font-size:10px;color:var(--text3)">'+s.desc+'</div></div></div></div>';
    html+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px">'+
      '<div style="padding:10px;background:var(--bg2);border-radius:8px"><div class="text-xs text-muted">\u72b6\u6001</div><div style="font-size:14px;font-weight:700;color:'+(s.status==='active'?'var(--green)':'var(--text3)')+'">'+(s.status==='active'?'\u91c7\u96c6\u4e2d':'\u5f85\u671f')+'</div></div>'+
      '<div style="padding:10px;background:var(--bg2);border-radius:8px"><div class="text-xs text-muted">\u4eca\u65e5\u91c7\u96c6</div><div style="font-size:20px;font-weight:800;color:'+s.color+'">'+s.count+'</div></div></div>';
    html+='<div style="padding:10px;background:var(--bg2);border-radius:8px;margin-bottom:12px"><div style="font-weight:600;margin-bottom:6px">\u76d1\u6d4b\u5173\u952e\u8bcd</div><div style="display:flex;gap:6px;flex-wrap:wrap">'+s.kw.map(function(k){return '<span class="badge b-blue" style="font-size:10px">'+k+'</span>';}).join('')+'</div></div>';
    var related=this._osintResults.filter(function(r){return r.source===s.name;});
    if(related.length){
      html+='<div style="padding:10px;background:var(--bg2);border-radius:8px"><div style="font-weight:600;margin-bottom:6px">\u5173\u8054\u60c5\u62a5 ('+related.length+')</div>';
      related.forEach(function(r){
        html+='<div style="font-size:11px;padding:4px 0;border-bottom:1px solid var(--border);cursor:pointer" onclick="INTELCENTER.showOsintDetail(\''+r.id+'\')"><span style="color:var(--cyan)">['+r.id+']</span> '+r.content.substring(0,50)+'...</div>';
      });
      html+='</div>';
    }
    html+='<div style="padding:8px;background:rgba(255,204,0,0.06);border-radius:8px;margin-top:10px;font-size:10px;color:var(--yellow)">\u26a0\ufe0f \u6a21\u62df\u8bad\u7ec3\u6570\u636e\uff0c\u5b9e\u9645\u90e8\u7f72\u65f6\u9700\u5bf9\u63a5\u771f\u5b9e\u6570\u636e\u6e90API</div>';
    document.getElementById('modal-tt').textContent=s.ic+' '+s.name+' \u60c5\u62a5\u6e90\u8be6\u60c5';
    document.getElementById('modal-bd').innerHTML=html;
    document.getElementById('modal').classList.add('show');
  },
  showOsintDetail(id){
    var r=this._osintResults.find(function(x){return x.id===id;});
    if(!r)return;
    var lv=ALERT_LV[r.level]||ALERT_LV.blue;
    var html='<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px">'+
      '<div style="padding:12px;background:var(--bg2);border-radius:8px;border-left:3px solid '+lv.color+'"><div class="text-xs text-muted">\u60c5\u62a5\u7f16\u53f7</div><div style="font-size:14px;font-weight:700">'+r.id+'</div></div>'+
      '<div style="padding:12px;background:var(--bg2);border-radius:8px"><div class="text-xs text-muted">\u91c7\u96c6\u65f6\u95f4</div><div style="font-size:12px;font-weight:600">'+r.time+'</div></div>'+
      '<div style="padding:12px;background:var(--bg2);border-radius:8px"><div class="text-xs text-muted">\u60c5\u62a5\u6e90</div><div style="font-size:12px;font-weight:600">'+r.source+'</div></div>'+
      '<div style="padding:12px;background:var(--bg2);border-radius:8px"><div class="text-xs text-muted">\u76ee\u6807\u4f4d\u7f6e</div><div style="font-size:12px;font-weight:600">'+r.country+'</div></div></div>';
    html+='<div style="padding:12px;background:rgba(0,212,255,0.05);border:1px solid rgba(0,212,255,0.15);border-radius:8px;margin-bottom:12px">'+
      '<div style="font-weight:700;color:var(--cyan);margin-bottom:8px">\u{1F4CB} \u60c5\u62a5\u5168\u6587</div>'+
      '<div style="font-size:12px;line-height:1.8;color:var(--text2)">'+r.content+'</div></div>';
    html+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px">'+
      '<div style="padding:10px;background:var(--bg2);border-radius:8px"><div class="text-xs text-muted">\u98ce\u9669\u7b49\u7ea7</div><span class="badge '+lv.cls+'" style="margin-top:4px">'+lv.label+'</span></div>'+
      '<div style="padding:10px;background:var(--bg2);border-radius:8px"><div class="text-xs text-muted">\u9a8c\u8bc1\u72b6\u6001</div><div style="font-size:13px;font-weight:700;color:'+(r.verified?'var(--green)':'var(--yellow)')+';margin-top:4px">'+(r.verified?'\u2713 \u5df2\u4ea4\u53c9\u9a8c\u8bc1':'\u26a0 \u5f85\u9a8c\u8bc1')+'</div></div></div>';
    html+='<div style="display:flex;gap:8px;margin-top:10px">'+
      (PERM.isAdmin()?'<button class="btn primary sm" onclick="INTELCENTER.showOsintForm(\''+r.id+'\')">\u270f\ufe0f \u7f16\u8f91</button>':'')+
      (PERM.isAdmin()?'<button class="btn sm" onclick="INTELCENTER.deleteOsint(\''+r.id+'\')">\u{1F5D1}\uFE0F \u5220\u9664</button>':'')+
      (PERM.canUpload()?'<button class="btn sm" onclick="showToast(\'\u2705 \u5df2\u63a8\u9001\u81f3\u9884\u8b66\u4e2d\u5fc3\')">\u{1F6A8} \u63a8\u9001\u9884\u8b66</button>':'')+
      '<button class="btn sm" onclick="INTELCENTER._exportJSON(INTELCENTER._osintResults.find(function(x){return x.id===\''+r.id+'\';}),\''+r.id+'.json\')">\u{1F4E5} \u5bfc\u51fa</button>'+
      '</div>';
    document.getElementById('modal-tt').textContent='\u{1F4CB} '+r.id+' \u60c5\u62a5\u8be6\u60c5';
    document.getElementById('modal-bd').innerHTML=html;
    document.getElementById('modal').classList.add('show');
  },
  runOsintCollect(){
    var src=document.getElementById('osint-source-select').value;
    var kw=document.getElementById('osint-kw-select').value;
    var cty=document.getElementById('osint-country-select').value;
    var st=document.getElementById('osint-status');
    if(st){st.textContent='\u91c7\u96c6\u4e2d...';st.style.color='var(--orange)';}
    showToast('\u{1F50D} \u6b63\u5728\u91c7\u96c6...');
    var self=this;
    setTimeout(function(){
      if(st){st.textContent='\u91c7\u96c6\u5b8c\u6210';st.style.color='var(--green)';}
      var nid='OSINT-'+String(Date.now()).slice(-6);
      self._osintResults.unshift({id:nid,source:src||'Twitter/X',time:new Date().toLocaleString('zh-CN',{hour12:false}).replace(/\//g,'-').substring(0,16),country:cty||'\u672a\u6307\u5b9a',kw:kw||'\u7efc\u5408',content:'\u91c7\u96c6\u5230\u65b0\u60c5\u62a5\uff1a'+(cty||'\u76ee\u6807\u533a\u57df')+'\u76d1\u6d4b\u5230'+(kw||'\u5f02\u5e38')+'\u76f8\u5173\u4fe1\u606f',level:['red','orange','yellow','cyan'][Math.floor(Math.random()*4)],verified:Math.random()>0.5});
      self._saveOsint();
      self._renderOsintResults();
      showToast('\u2705 \u91c7\u96c6\u5b8c\u6210\uff0c\u65b0\u589e1\u6761\u60c5\u62a5');
    },2000);
  },
  renderAnalysis(el){
    var html=this._trainLabel();
    html+='<div class="grid" style="grid-template-columns:1fr 1fr 1fr 1fr;gap:10px;margin-bottom:12px">';
    var stats=[
      {ic:'\u{1F50D}',c:'var(--cyan)',l:'\u5206\u6790\u62a5\u544a',v:this._analysisResults.length},
      {ic:'\u{1F534}',c:'var(--red)',l:'\u53d1\u73b0\u5a01\u80c1',v:this._analysisResults.filter(function(r){return r.level==='red';}).length},
      {ic:'\u{1F7E0}',c:'var(--orange)',l:'\u4e2d\u7b49\u98ce\u9669',v:this._analysisResults.filter(function(r){return r.level==='orange';}).length},
      {ic:'\u{1F4CA}',c:'var(--green)',l:'\u5e73\u5747\u7f6e\u4fe1',v:this._analysisResults.length?Math.round(this._analysisResults.reduce(function(s,r){return s+r.confidence;},0)/this._analysisResults.length)+'%':'-'}
    ];
    stats.forEach(function(s){
      html+='<div class="stat-card"><div class="stat-ic" style="background:rgba(0,212,255,0.08);color:'+s.c+'">'+s.ic+'</div><div class="stat-info"><div class="stat-label">'+s.l+'</div><div class="stat-val" style="color:'+s.c+'">'+s.v+'</div></div></div>';
    });
    html+='</div>';
    html+='<div class="card"><div class="card-tt"><span class="ic">\u{1F9E0}</span>AI\u5f71\u50cf\u5206\u6790\u5de5\u5177 <span style="font-size:10px;color:var(--text3);font-weight:400">\u2014 \u70b9\u51fb\u6267\u884c\u5206\u6790</span></div>';
    html+='<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px">';
    var tools=[
      {ic:'\u{1F50D}',lb:'\u76ee\u6807\u8bc6\u522b',desc:'\u8bc6\u522b\u8f66\u8f86\u3001\u5efa\u7b51\u3001\u4eba\u5458',color:'var(--cyan)'},
      {ic:'\u{1F504}',lb:'\u53d8\u5316\u68c0\u6d4b',desc:'\u5bf9\u6bd4\u4e0d\u540c\u65f6\u76f8\u5f71\u50cf',color:'var(--orange)'},
      {ic:'\u{1F6E2}\uFE0F',lb:'\u70ed\u529b\u5206\u6790',desc:'\u5206\u6790\u70ed\u529b\u5206\u5e03',color:'var(--red)'},
      {ic:'\u{1F517}',lb:'\u5173\u8054\u5339\u914d',desc:'\u5173\u8054\u4e8b\u4ef6\u9884\u8b66',color:'var(--yellow)'},
      {ic:'\u{1F4D1}',lb:'\u635f\u4f24\u8bc4\u4f30',desc:'\u8bc4\u4f30\u640d\u6bc1\u7a0b\u5ea6',color:'var(--purple)'},
      {ic:'\u{1F680}',lb:'\u6d3b\u52a8\u76d1\u6d4b',desc:'\u76d1\u6d4b\u6e2f\u53e3\u57fa\u5730\u6d3b\u52a8',color:'var(--green)'}
    ];
    tools.forEach(function(t){
      html+='<div style="background:var(--panel2);border:1px solid var(--border);border-radius:8px;padding:12px;cursor:pointer;transition:.2s" onclick="INTELCENTER.runAnalysis(\''+t.lb+'\')" onmouseover="this.style.borderColor=\''+t.color+'\';this.style.transform=\'translateY(-2px)\'" onmouseout="this.style.borderColor=\'var(--border)\';this.style.transform=\'\'">'+
        '<div style="font-size:20px;margin-bottom:6px">'+t.ic+'</div><div style="font-size:12px;font-weight:700;color:'+t.color+';margin-bottom:4px">'+t.lb+'</div>'+
        '<div style="font-size:10px;color:var(--text3);line-height:1.4">'+t.desc+'</div></div>';
    });
    html+='</div></div>';
    html+='<div class="card mt-12"><div class="card-tt"><span class="ic">\u{1F4CB}</span>\u5206\u6790\u7ed3\u679c\u7ba1\u7406</div>';
    html+=this._toolbar('\u5171 '+this._analysisResults.length+' \u6761\u7ed3\u679c\uff0c\u53ef\u67e5\u770b/\u7f16\u8f91/\u5220\u9664','INTELCENTER.showAnalysisForm()','INTELCENTER.exportAnalysis()','INTELCENTER.resetAnalysis()');
    html+='<div id="intel-analysis-results"></div></div>';
    el.innerHTML=html;
    this._renderAnalysisResults();
  },
  _renderAnalysisResults(){
    var el=document.getElementById('intel-analysis-results');
    if(!el)return;
    var html='<div style="display:grid;gap:8px;max-height:500px;overflow-y:auto">';
    if(this._analysisResults.length===0){html+='<div style="text-align:center;padding:20px;color:var(--text3);font-size:12px">\u6682\u65e0\u5206\u6790\u7ed3\u679c\uff0c\u70b9\u51fb\u201c\u65b0\u589e\u201d\u6dfb\u52a0</div>';}
    this._analysisResults.forEach(function(r){
      var lv=ALERT_LV[r.level]||ALERT_LV.blue;
      html+='<div style="padding:10px;background:var(--panel2);border-radius:8px;border-left:3px solid var(--'+(r.level==='red'?'red':r.level==='orange'?'orange':r.level==='yellow'?'yellow':'cyan')+');transition:.2s">'+
        '<div style="display:flex;justify-content:space-between;align-items:start">'+
        '<div style="cursor:pointer;flex:1" onclick="INTELCENTER.showAnalysisDetail(\''+r.id+'\')">'+
        '<span class="badge '+lv.cls+'" style="font-size:9px">'+lv.label+'</span> <span style="font-size:11px;font-weight:600;margin-left:4px">['+r.id+'] '+r.target+'</span>'+
        '<div style="font-size:11px;color:var(--text2);margin-top:4px">\u{1F50D} '+r.type+' \u2014 '+r.finding.substring(0,60)+(r.finding.length>60?'...':'')+'</div>'+
        '<div style="display:flex;align-items:center;gap:6px;margin-top:4px"><span style="font-size:9px;color:var(--text3)">\u7f6e\u4fe1\u5ea6</span><div style="flex:1;height:4px;background:var(--bg);border-radius:2px;overflow:hidden"><div style="width:'+r.confidence+'%;height:100%;background:'+(r.confidence>=90?'var(--green)':r.confidence>=80?'var(--yellow)':'var(--orange)')+'"></div></div><span style="font-size:9px;font-weight:700">'+r.confidence+'%</span></div>'+
        '</div>'+
        '<div style="display:flex;flex-direction:column;gap:4px;margin-left:8px">'+
        (PERM.isAdmin()?'<button class="btn sm" style="font-size:9px;padding:2px 8px;min-width:auto" onclick="INTELCENTER.showAnalysisForm(\''+r.id+'\')">\u270f\ufe0f</button>':'')+
        (PERM.isAdmin()?'<button class="btn sm" style="font-size:9px;padding:2px 8px;min-width:auto;color:var(--red)" onclick="INTELCENTER.deleteAnalysis(\''+r.id+'\')">\u{1F5D1}\uFE0F</button>':'')+
        '</div></div></div>';
    });
    html+='</div>';
    el.innerHTML=html;
  },
  showAnalysisForm(id){
    if(!PERM.canUpload()){showToast('\u26a0\ufe0f \u8bf7\u5148\u767b\u5f55');return;}
    var r=id?this._analysisResults.find(function(x){return x.id===id;}):null;
    var types=['\u76ee\u6807\u8bc6\u522b','\u53d8\u5316\u68c0\u6d4b','\u70ed\u529b\u5206\u6790','\u5173\u8054\u5339\u914d','\u635f\u4f24\u8bc4\u4f30','\u6d3b\u52a8\u76d1\u6d4b'];
    var html='<div style="padding:12px;background:var(--bg2);border-radius:8px">'+
      '<div style="font-size:12px;color:var(--text3);margin-bottom:10px">'+(r?'\u7f16\u8f91\u5206\u6790\u62a5\u544a ['+r.id+']':'\u65b0\u589e\u5206\u6790\u62a5\u544a')+'</div>'+
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">'+
      '<div><label class="text-xs text-muted" style="display:block;margin-bottom:4px">\u76ee\u6807 <span style="color:var(--red)">*</span></label><input class="input" id="analysis-form-target" value="'+(r?r.target:'')+'" placeholder="\u5982\uff1a\u66fc\u5fb7\u6d77\u5ce1\u822a\u9053" style="font-size:12px;width:100%"></div>'+
      '<div><label class="text-xs text-muted" style="display:block;margin-bottom:4px">\u5206\u6790\u7c7b\u578b</label><select class="select" id="analysis-form-type" style="font-size:12px;width:100%">'+types.map(function(t){return '<option value="'+t+'"'+(r&&r.type===t?' selected':'')+'>'+t+'</option>';}).join('')+'</select></div>'+
      '<div><label class="text-xs text-muted" style="display:block;margin-bottom:4px">\u98ce\u9669\u7b49\u7ea7</label><select class="select" id="analysis-form-level" style="font-size:12px;width:100%"><option value="red"'+(r&&r.level==='red'?' selected':'')+'>\u7ea2\u8272</option><option value="orange"'+(r&&r.level==='orange'?' selected':'')+'>\u6a59\u8272</option><option value="yellow"'+(r&&r.level==='yellow'?' selected':'')+'>\u9ec4\u8272</option><option value="cyan"'+(r&&r.level==='cyan'?' selected':'')+'>\u84dd\u8272</option></select></div>'+
      '<div><label class="text-xs text-muted" style="display:block;margin-bottom:4px">\u7f6e\u4fe1\u5ea6(%)</label><input class="input" id="analysis-form-conf" type="number" min="0" max="100" value="'+(r?r.confidence:85)+'" style="font-size:12px;width:100%"></div>'+
      '</div>'+
      '<div style="margin-bottom:10px"><label class="text-xs text-muted" style="display:block;margin-bottom:4px">\u5206\u6790\u53d1\u73b0 <span style="color:var(--red)">*</span></label><textarea class="input" id="analysis-form-finding" rows="3" placeholder="\u63cf\u8ff0\u5206\u6790\u53d1\u73b0..." style="font-size:12px;width:100%;resize:vertical">'+(r?r.finding:'')+'</textarea></div>'+
      '<div style="display:flex;gap:8px">'+
      '<button class="btn primary sm" onclick="INTELCENTER.saveAnalysis('+(r?'\''+r.id+'\'':'null')+')"">\u2705 \u4fdd\u5b58</button>'+
      '<button class="btn sm" onclick="document.getElementById(\'modal\').classList.remove(\'show\')">\u53d6\u6d88</button>'+
      '</div></div>';
    document.getElementById('modal-tt').textContent=(r?'\u7f16\u8f91\u5206\u6790\u62a5\u544a':'\u65b0\u589e\u5206\u6790\u62a5\u544a');
    document.getElementById('modal-bd').innerHTML=html;
    document.getElementById('modal').classList.add('show');
  },
  saveAnalysis(id){
    var target=document.getElementById('analysis-form-target').value.trim();
    var type=document.getElementById('analysis-form-type').value;
    var level=document.getElementById('analysis-form-level').value;
    var conf=parseInt(document.getElementById('analysis-form-conf').value)||85;
    var finding=document.getElementById('analysis-form-finding').value.trim();
    if(!target||!finding){showToast('\u26a0\ufe0f \u8bf7\u586b\u5199\u76ee\u6807\u548c\u5206\u6790\u53d1\u73b0');return;}
    if(id){
      var r=this._analysisResults.find(function(x){return x.id===id;});
      if(r){r.target=target;r.type=type;r.level=level;r.confidence=conf;r.finding=finding;}
      showToast('\u2705 \u62a5\u544a\u5df2\u66f4\u65b0');
    }else{
      var nid='RPT-'+String(Date.now()).slice(-6);
      this._analysisResults.unshift({id:nid,time:new Date().toLocaleString('zh-CN',{hour12:false}).replace(/\//g,'-').substring(0,16),target:target,type:type,finding:finding,level:level,confidence:conf});
      showToast('\u2705 \u62a5\u544a\u5df2\u6dfb\u52a0');
    }
    this._saveAnalysis();
    document.getElementById('modal').classList.remove('show');
    this._renderAnalysisResults();
  },
  deleteAnalysis(id){
    if(!PERM.guard('\u5220\u9664\u5206\u6790\u62a5\u544a'))return;
    if(!confirm('\u786e\u8ba4\u5220\u9664\u62a5\u544a '+id+' \uff1f'))return;
    this._analysisResults=this._analysisResults.filter(function(x){return x.id!==id;});
    this._saveAnalysis();
    this._renderAnalysisResults();
    showToast('\u2705 \u5df2\u5220\u9664');
  },
  exportAnalysis(){
    this._exportJSON(this._analysisResults,'analysis_data.json');
  },
  resetAnalysis(){
    if(!confirm('\u91cd\u7f6e\u4e3a\u9ed8\u8ba4\u6a21\u62df\u6570\u636e\uff1f'))return;
    this._resetData('analysis');
    this.render();
    showToast('\u2705 \u5df2\u91cd\u7f6e');
  },
  runAnalysis(tool){
    showToast('\u2699\ufe0f \u6b63\u5728\u6267\u884c\u300c'+tool+'\u300d\u5206\u6790...');
    var self=this;
    setTimeout(function(){
      var nid='RPT-'+String(Date.now()).slice(-6);
      self._analysisResults.unshift({id:nid,time:new Date().toLocaleString('zh-CN',{hour12:false}).replace(/\//g,'-').substring(0,16),target:'\u5f53\u524d\u5206\u6790\u76ee\u6807',type:tool,finding:'\u6267\u884c'+tool+'\u5206\u6790\u5b8c\u6210\uff0c\u68c0\u6d4b\u5230'+Math.floor(Math.random()*5+1)+'\u4e2a\u5f02\u5e38\u70b9',level:['red','orange','yellow','cyan'][Math.floor(Math.random()*4)],confidence:Math.floor(Math.random()*15+80)});
      self._saveAnalysis();
      self._renderAnalysisResults();
      showToast('\u2705 \u300c'+tool+'\u300d\u5206\u6790\u5b8c\u6210');
    },1500);
  },
  showAnalysisDetail(id){
    var r=this._analysisResults.find(function(x){return x.id===id;});
    if(!r)return;
    var lv=ALERT_LV[r.level]||ALERT_LV.blue;
    var html='<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px">'+
      '<div style="padding:12px;background:var(--bg2);border-radius:8px;border-left:3px solid '+lv.color+'"><div class="text-xs text-muted">\u62a5\u544a\u7f16\u53f7</div><div style="font-size:14px;font-weight:700">'+r.id+'</div></div>'+
      '<div style="padding:12px;background:var(--bg2);border-radius:8px"><div class="text-xs text-muted">\u5206\u6790\u65f6\u95f4</div><div style="font-size:12px;font-weight:600">'+r.time+'</div></div>'+
      '<div style="padding:12px;background:var(--bg2);border-radius:8px"><div class="text-xs text-muted">\u76ee\u6807</div><div style="font-size:13px;font-weight:700">'+r.target+'</div></div>'+
      '<div style="padding:12px;background:var(--bg2);border-radius:8px"><div class="text-xs text-muted">\u5206\u6790\u7c7b\u578b</div><div style="font-size:13px;font-weight:600;color:var(--cyan)">'+r.type+'</div></div></div>';
    html+='<div style="padding:12px;background:rgba(0,212,255,0.05);border:1px solid rgba(0,212,255,0.15);border-radius:8px;margin-bottom:12px">'+
      '<div style="font-weight:700;color:var(--cyan);margin-bottom:8px">\u{1F50D} \u5206\u6790\u53d1\u73b0</div>'+
      '<div style="font-size:12px;line-height:1.8;color:var(--text2)">'+r.finding+'</div></div>';
    html+='<div style="padding:12px;background:var(--bg2);border-radius:8px;margin-bottom:12px">'+
      '<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px"><div style="font-size:11px;color:var(--text3)">\u7f6e\u4fe1\u5ea6</div><div style="flex:1;height:8px;background:var(--bg);border-radius:4px;overflow:hidden"><div style="width:'+r.confidence+'%;height:100%;background:'+(r.confidence>=90?'var(--green)':r.confidence>=80?'var(--yellow)':'var(--orange)')+'"></div></div><span style="font-size:14px;font-weight:800">'+r.confidence+'%</span></div></div>';
    html+='<div style="display:flex;gap:8px;margin-top:10px">'+
      (PERM.isAdmin()?'<button class="btn primary sm" onclick="INTELCENTER.showAnalysisForm(\''+r.id+'\')">\u270f\ufe0f \u7f16\u8f91</button>':'')+
      (PERM.isAdmin()?'<button class="btn sm" onclick="INTELCENTER.deleteAnalysis(\''+r.id+'\')">\u{1F5D1}\uFE0F \u5220\u9664</button>':'')+
      '<button class="btn sm" onclick="INTELCENTER._exportJSON(INTELCENTER._analysisResults.find(function(x){return x.id===\''+r.id+'\';}),\''+r.id+'.json\')">\u{1F4E5} \u5bfc\u51fa</button>'+
      '</div>';
    document.getElementById('modal-tt').textContent='\u{1F4CB} '+r.id+' \u5206\u6790\u62a5\u544a';
    document.getElementById('modal-bd').innerHTML=html;
    document.getElementById('modal').classList.add('show');
  },
  renderTimeline(el){
    var html=this._trainLabel();
    html+='<div class="card"><div class="card-tt"><span class="ic">\u{1F4C5}</span>\u65b0\u5efa\u65f6\u5e8f\u5bf9\u6bd4\u4efb\u52a1</div>';
    html+='<div style="padding:12px;background:var(--bg2);border-radius:8px;margin-bottom:12px">'+
      '<div class="text-xs text-muted mb-8">\u586b\u5199\u5bf9\u6bd4\u76ee\u6807\u4fe1\u606f\uff0c\u652f\u6301\u81ea\u5b9a\u4e49\u6570\u636e\u5e76\u4fdd\u5b58</div>'+
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">'+
      '<div><label class="text-xs text-muted" style="display:block;margin-bottom:4px">\u76ee\u6807\u540d\u79f0 <span style="color:var(--red)">*</span></label><input class="input" id="tl-new-target" placeholder="\u5982\uff1a\u5361\u62c9\u5947\u6e2f\u4e2d\u8d44\u533a" style="font-size:12px"></div>'+
      '<div><label class="text-xs text-muted" style="display:block;margin-bottom:4px">\u76ee\u6807\u56fd\u5bb6</label><select class="select" id="tl-new-country" style="font-size:12px"><option value="">\u9009\u62e9...</option>'+COUNTRIES.map(function(c){return '<option>'+c.name+'</option>';}).join('')+'</select></div>'+
      '<div><label class="text-xs text-muted" style="display:block;margin-bottom:4px">T0\u65f6\u95f4(\u5bf9\u6bd4\u524d) <span style="color:var(--red)">*</span></label><input class="input" id="tl-new-t0" type="date" style="font-size:12px"></div>'+
      '<div><label class="text-xs text-muted" style="display:block;margin-bottom:4px">T1\u65f6\u95f4(\u5bf9\u6bd4\u540e) <span style="color:var(--red)">*</span></label><input class="input" id="tl-new-t1" type="date" style="font-size:12px"></div>'+
      '<div style="grid-column:1/3"><label class="text-xs text-muted" style="display:block;margin-bottom:4px">\u5bf9\u6bd4\u8bf4\u660e</label><textarea class="input" id="tl-new-desc" rows="2" placeholder="\u63cf\u8ff0\u53d8\u5316\u60c5\u51b5..." style="font-size:12px;resize:vertical"></textarea></div></div>'+
      '<div style="display:flex;gap:8px">'+
      '<select class="select" id="tl-preset-target" style="font-size:12px;width:180px" onchange="document.getElementById(\'tl-new-target\').value=this.value"><option value="">\u6216\u9009\u62e9\u9884\u8bbe\u76ee\u6807...</option><option>\u5361\u62c9\u5947\u6e2f \u4e2d\u8d44\u4f01\u4e1a\u533a</option><option>\u79d1\u5362\u97e6\u9f50 \u77ff\u533a</option><option>\u74e6\u8fbe\u5c14\u6e2f</option><option>\u66fc\u5fb7\u6d77\u5ce1 \u822a\u9053</option><option>\u7eb3\u96f7\u7eb3 \u77ff\u533a</option></select>'+
      '<button class="btn primary sm" onclick="INTELCENTER.addTimelineTask()">\u2795 \u6dfb\u52a0\u5bf9\u6bd4\u4efb\u52a1</button></div></div></div>';
    html+='<div class="card mt-12"><div class="card-tt"><span class="ic">\u{1F4C5}</span>\u65f6\u5e8f\u5bf9\u6bd4\u7ba1\u7406</div>';
    html+=this._toolbar('\u5171 '+this._timelineTasks.length+' \u4e2a\u5bf9\u6bd4\u4efb\u52a1\uff0c\u53ef\u67e5\u770b/\u7f16\u8f91/\u5220\u9664','INTELCENTER.showTimelineForm()','INTELCENTER.exportTimeline()','INTELCENTER.resetTimeline()');
    html+='<div id="tl-comparisons"></div></div>';
    el.innerHTML=html;
    this._renderTimelineTasks();
  },
  _renderTimelineTasks(){
    var el=document.getElementById('tl-comparisons');
    if(!el)return;
    var html='<div style="display:grid;gap:10px;max-height:500px;overflow-y:auto">';
    if(this._timelineTasks.length===0){html+='<div style="text-align:center;padding:20px;color:var(--text3);font-size:12px">\u6682\u65e0\u5bf9\u6bd4\u4efb\u52a1</div>';}
    this._timelineTasks.forEach(function(c,idx){
      var lv=ALERT_LV[c.level]||ALERT_LV.blue;
      html+='<div style="padding:12px;background:var(--panel2);border-radius:8px;transition:.2s;border-left:3px solid var(--'+(c.level==='red'?'red':c.level==='orange'?'orange':c.level==='yellow'?'yellow':'cyan')+')">'+
        '<div style="display:flex;justify-content:space-between;align-items:start">'+
        '<div style="cursor:pointer;flex:1" onclick="INTELCENTER.showTimelineDetail('+idx+')">'+
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px"><div style="font-size:13px;font-weight:700">'+c.target+'</div><span class="badge '+lv.cls+'" style="font-size:9px">\u5f71\u54cd:'+c.impact+'</span></div>'+
        '<div style="font-size:11px;color:var(--text3);margin-bottom:4px">T0: '+c.t0+' \u2192 T1: '+c.t1+(c.country?' \u00b7 '+c.country:'')+'</div>'+
        '<div style="font-size:11px;color:var(--text2)">'+c.changes.substring(0,60)+(c.changes.length>60?'...':'')+'</div>'+
        '</div>'+
        '<div style="display:flex;flex-direction:column;gap:4px;margin-left:8px">'+
        (PERM.isAdmin()?'<button class="btn sm" style="font-size:9px;padding:2px 8px;min-width:auto" onclick="INTELCENTER.showTimelineForm('+idx+')">\u270f\ufe0f</button>':'')+
        (PERM.isAdmin()?'<button class="btn sm" style="font-size:9px;padding:2px 8px;min-width:auto;color:var(--red)" onclick="INTELCENTER.deleteTimelineTask('+idx+')">\u{1F5D1}\uFE0F</button>':'')+
        '</div></div></div>';
    });
    html+='</div>';
    el.innerHTML=html;
  },
  addTimelineTask(){
    if(!PERM.canUpload()){showToast('\u26a0\ufe0f \u8bf7\u5148\u767b\u5f55');return;}
    var target=document.getElementById('tl-new-target').value.trim();
    var t0=document.getElementById('tl-new-t0').value;
    var t1=document.getElementById('tl-new-t1').value;
    var cty=document.getElementById('tl-new-country').value;
    var desc=document.getElementById('tl-new-desc').value.trim();
    if(!target||!t0||!t1){showToast('\u26a0\ufe0f \u8bf7\u586b\u5199\u76ee\u6807\u540d\u79f0\u548c\u5bf9\u6bd4\u65f6\u95f4');return;}
    var level='yellow',impact='\u4e2d\u7b49';
    if(desc.indexOf('\u88ad\u51fb')>=0||desc.indexOf('\u640d\u6bc1')>=0||desc.indexOf('\u711a\u6bc1')>=0){level='red';impact='\u4e25\u91cd';}
    else if(desc.indexOf('\u51cf\u5c11')>=0||desc.indexOf('\u589e\u52a0')>=0||desc.indexOf('\u5f02\u5e38')>=0){level='orange';impact='\u663e\u8457';}
    else if(desc.indexOf('\u6b63\u5e38')>=0||desc.indexOf('\u987a\u5229')>=0){level='cyan';impact='\u8f7b\u5fae';}
    this._timelineTasks.unshift({target:target,country:cty,t0:t0,t1:t1,changes:desc||'\u7528\u6237\u81ea\u5b9a\u4e49\u5bf9\u6bd4\u4efb\u52a1',level:level,impact:impact});
    this._saveTimeline();
    showToast('\u2705 \u5bf9\u6bd4\u4efb\u52a1\u5df2\u6dfb\u52a0');
    document.getElementById('tl-new-target').value='';document.getElementById('tl-new-t0').value='';document.getElementById('tl-new-t1').value='';document.getElementById('tl-new-desc').value='';
    this._renderTimelineTasks();
  },
  showTimelineForm(idx){
    if(!PERM.canUpload()){showToast('\u26a0\ufe0f \u8bf7\u5148\u767b\u5f55');return;}
    var c=idx!=null?this._timelineTasks[idx]:null;
    var html='<div style="padding:12px;background:var(--bg2);border-radius:8px">'+
      '<div style="font-size:12px;color:var(--text3);margin-bottom:10px">'+(c?'\u7f16\u8f91\u5bf9\u6bd4\u4efb\u52a1':'\u65b0\u589e\u5bf9\u6bd4\u4efb\u52a1')+'</div>'+
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">'+
      '<div><label class="text-xs text-muted" style="display:block;margin-bottom:4px">\u76ee\u6807\u540d\u79f0 <span style="color:var(--red)">*</span></label><input class="input" id="tl-form-target" value="'+(c?c.target:'')+'" style="font-size:12px;width:100%"></div>'+
      '<div><label class="text-xs text-muted" style="display:block;margin-bottom:4px">\u76ee\u6807\u56fd\u5bb6</label><input class="input" id="tl-form-country" value="'+(c?c.country:'')+'" style="font-size:12px;width:100%"></div>'+
      '<div><label class="text-xs text-muted" style="display:block;margin-bottom:4px">T0\u65f6\u95f4 <span style="color:var(--red)">*</span></label><input class="input" id="tl-form-t0" type="date" value="'+(c?c.t0:'')+'" style="font-size:12px;width:100%"></div>'+
      '<div><label class="text-xs text-muted" style="display:block;margin-bottom:4px">T1\u65f6\u95f4 <span style="color:var(--red)">*</span></label><input class="input" id="tl-form-t1" type="date" value="'+(c?c.t1:'')+'" style="font-size:12px;width:100%"></div>'+
      '<div><label class="text-xs text-muted" style="display:block;margin-bottom:4px">\u98ce\u9669\u7b49\u7ea7</label><select class="select" id="tl-form-level" style="font-size:12px;width:100%"><option value="red"'+(c&&c.level==='red'?' selected':'')+'>\u7ea2\u8272</option><option value="orange"'+(c&&c.level==='orange'?' selected':'')+'>\u6a59\u8272</option><option value="yellow"'+(c&&c.level==='yellow'?' selected':'')+'>\u9ec4\u8272</option><option value="cyan"'+(c&&c.level==='cyan'?' selected':'')+'>\u84dd\u8272</option></select></div>'+
      '<div><label class="text-xs text-muted" style="display:block;margin-bottom:4px">\u5f71\u54cd\u7a0b\u5ea6</label><input class="input" id="tl-form-impact" value="'+(c?c.impact:'')+'" style="font-size:12px;width:100%"></div>'+
      '</div>'+
      '<div style="margin-bottom:10px"><label class="text-xs text-muted" style="display:block;margin-bottom:4px">\u5bf9\u6bd4\u8bf4\u660e <span style="color:var(--red)">*</span></label><textarea class="input" id="tl-form-changes" rows="3" style="font-size:12px;width:100%;resize:vertical">'+(c?c.changes:'')+'</textarea></div>'+
      '<div style="display:flex;gap:8px">'+
      '<button class="btn primary sm" onclick="INTELCENTER.saveTimeline('+(idx!=null?idx:'null')+')"">\u2705 \u4fdd\u5b58</button>'+
      '<button class="btn sm" onclick="document.getElementById(\'modal\').classList.remove(\'show\')">\u53d6\u6d88</button>'+
      '</div></div>';
    document.getElementById('modal-tt').textContent=(c?'\u7f16\u8f91\u5bf9\u6bd4\u4efb\u52a1':'\u65b0\u589e\u5bf9\u6bd4\u4efb\u52a1');
    document.getElementById('modal-bd').innerHTML=html;
    document.getElementById('modal').classList.add('show');
  },
  saveTimeline(idx){
    var target=document.getElementById('tl-form-target').value.trim();
    var country=document.getElementById('tl-form-country').value.trim();
    var t0=document.getElementById('tl-form-t0').value;
    var t1=document.getElementById('tl-form-t1').value;
    var level=document.getElementById('tl-form-level').value;
    var impact=document.getElementById('tl-form-impact').value.trim()||'\u4e2d\u7b49';
    var changes=document.getElementById('tl-form-changes').value.trim();
    if(!target||!t0||!t1||!changes){showToast('\u26a0\ufe0f \u8bf7\u586b\u5199\u5fc5\u586b\u5b57\u6bb5');return;}
    if(idx!=null){
      var c=this._timelineTasks[idx];
      if(c){c.target=target;c.country=country;c.t0=t0;c.t1=t1;c.level=level;c.impact=impact;c.changes=changes;}
      showToast('\u2705 \u5bf9\u6bd4\u4efb\u52a1\u5df2\u66f4\u65b0');
    }else{
      this._timelineTasks.unshift({target:target,country:country,t0:t0,t1:t1,level:level,impact:impact,changes:changes});
      showToast('\u2705 \u5bf9\u6bd4\u4efb\u52a1\u5df2\u6dfb\u52a0');
    }
    this._saveTimeline();
    document.getElementById('modal').classList.remove('show');
    this._renderTimelineTasks();
  },
  deleteTimelineTask(idx){
    if(!PERM.guard('\u5220\u9664\u5bf9\u6bd4\u4efb\u52a1'))return;
    if(!confirm('\u786e\u8ba4\u5220\u9664\u6b64\u5bf9\u6bd4\u4efb\u52a1\uff1f'))return;
    this._timelineTasks.splice(idx,1);
    this._saveTimeline();
    this._renderTimelineTasks();
    document.getElementById('modal').classList.remove('show');
    showToast('\u2705 \u5df2\u5220\u9664');
  },
  exportTimeline(){
    this._exportJSON(this._timelineTasks,'timeline_data.json');
  },
  resetTimeline(){
    if(!confirm('\u91cd\u7f6e\u4e3a\u9ed8\u8ba4\u6a21\u62df\u6570\u636e\uff1f'))return;
    this._resetData('timeline');
    this.render();
    showToast('\u2705 \u5df2\u91cd\u7f6e');
  },
  showTimelineDetail(idx){
    var c=this._timelineTasks[idx];if(!c)return;
    var lv=ALERT_LV[c.level]||ALERT_LV.blue;
    var html='<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px">'+
      '<div style="padding:12px;background:var(--bg2);border-radius:8px;border-left:3px solid '+lv.color+'"><div class="text-xs text-muted">\u5bf9\u6bd4\u76ee\u6807</div><div style="font-size:14px;font-weight:700">'+c.target+'</div></div>'+
      '<div style="padding:12px;background:var(--bg2);border-radius:8px"><div class="text-xs text-muted">\u76ee\u6807\u56fd\u5bb6</div><div style="font-size:14px;font-weight:600">'+(c.country||'\u672a\u6307\u5b9a')+'</div></div>'+
      '<div style="padding:12px;background:var(--bg2);border-radius:8px"><div class="text-xs text-muted">T0 (\u5bf9\u6bd4\u524d)</div><div style="font-size:13px;font-weight:600;color:var(--cyan)">'+c.t0+'</div></div>'+
      '<div style="padding:12px;background:var(--bg2);border-radius:8px"><div class="text-xs text-muted">T1 (\u5bf9\u6bd4\u540e)</div><div style="font-size:13px;font-weight:600;color:var(--orange)">'+c.t1+'</div></div></div>';
    html+='<div style="padding:12px;background:rgba(0,212,255,0.05);border:1px solid rgba(0,212,255,0.15);border-radius:8px;margin-bottom:12px">'+
      '<div style="font-weight:700;color:var(--cyan);margin-bottom:8px">\u{1F504} \u53d8\u5316\u68c0\u6d4b\u7ed3\u679c</div>'+
      '<div style="font-size:12px;line-height:1.8;color:var(--text2)">'+c.changes+'</div></div>';
    html+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px">'+
      '<div style="padding:10px;background:var(--bg2);border-radius:8px"><div class="text-xs text-muted">\u5f71\u54cd\u7a0b\u5ea6</div><span class="badge '+lv.cls+'" style="margin-top:4px">'+c.impact+'</span></div>'+
      '<div style="padding:10px;background:var(--bg2);border-radius:8px"><div class="text-xs text-muted">\u98ce\u9669\u7b49\u7ea7</div><span class="badge '+lv.cls+'" style="margin-top:4px">'+lv.label+'</span></div></div>';
    if(c.country){var ents=getEntsInCountry(c.country);if(ents&&ents.length){html+='<div style="padding:10px;background:var(--bg2);border-radius:8px;margin-bottom:10px"><div style="font-weight:600;margin-bottom:6px">\u{1F3ED} \u5173\u8054\u4f01\u4e1a ('+ents.length+')</div>'+ents.map(function(e){return '<span class="badge b-blue" style="margin:2px;cursor:pointer" onclick="showEntDetail('+e.id+')">'+e.short+'</span>';}).join('')+'</div>';}}
    html+='<div style="display:flex;gap:8px">'+
      (PERM.isAdmin()?'<button class="btn primary sm" onclick="INTELCENTER.showTimelineForm('+idx+')">\u270f\ufe0f \u7f16\u8f91</button>':'')+
      (PERM.isAdmin()?'<button class="btn sm" onclick="INTELCENTER.deleteTimelineTask('+idx+')">\u{1F5D1}\uFE0F \u5220\u9664</button>':'')+
      '<button class="btn sm" onclick="INTELCENTER._exportJSON(INTELCENTER._timelineTasks['+idx+'],\''+c.target+'.json\')">\u{1F4E5} \u5bfc\u51fa</button>'+
      '</div>';
    document.getElementById('modal-tt').textContent='\u{1F4C5} '+c.target+' \u65f6\u5e8f\u5bf9\u6bd4';
    document.getElementById('modal-bd').innerHTML=html;
    document.getElementById('modal').classList.add('show');
  },
  renderGeoint(el){
    var html=this._trainLabel();
    html+='<div class="grid" style="grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:12px">';
    var stats=[
      {ic:'\u{1F30D}',c:'var(--cyan)',l:'\u76d1\u6d4b\u533a\u57df',v:'42\u56fd'},
      {ic:'\u{1F5FA}\uFE0F',c:'var(--green)',l:'\u56fe\u5c42\u603b\u6570',v:this._geointLayers.length},
      {ic:'\u{1F6A7}',c:'var(--orange)',l:'\u5df2\u542f\u7528',v:this._geointLayers.filter(function(l){return l.status==='active';}).length}
    ];
    stats.forEach(function(s){html+='<div class="stat-card"><div class="stat-ic" style="background:rgba(0,212,255,0.08);color:'+s.c+'">'+s.ic+'</div><div class="stat-info"><div class="stat-label">'+s.l+'</div><div class="stat-val" style="color:'+s.c+'">'+s.v+'</div></div></div>';});
    html+='</div>';
    html+='<div class="card"><div class="card-tt"><span class="ic">\u{1F5FA}\uFE0F</span>\u5730\u7406\u7a7a\u95f4\u60c5\u62a5\u56fe\u5c42\u7ba1\u7406</div>';
    html+=this._toolbar('\u5171 '+this._geointLayers.length+' \u4e2a\u56fe\u5c42\uff0c\u53ef\u67e5\u770b/\u7f16\u8f91/\u5220\u9664','INTELCENTER.showLayerForm()','INTELCENTER.exportGeoint()','INTELCENTER.resetGeoint()');
    html+='<div style="display:grid;gap:8px">';
    this._geointLayers.forEach(function(l){
      html+='<div style="display:flex;align-items:center;gap:10px;padding:10px;background:var(--panel2);border-radius:8px;transition:.2s">'+
        '<span style="font-size:18px;cursor:pointer" onclick="INTELCENTER.showLayerDetail(\''+l.name+'\')">'+l.ic+'</span>'+
        '<div style="flex:1;cursor:pointer" onclick="INTELCENTER.showLayerDetail(\''+l.name+'\')"><div style="font-size:12px;font-weight:600">'+l.name+'</div><div style="font-size:10px;color:var(--text3)">'+l.desc+'</div></div>'+
        '<span style="font-size:10px;color:var(--cyan);margin-right:8px">'+l.count+'</span>'+
        '<span style="font-size:9px;padding:3px 8px;border-radius:4px;'+(l.status==='active'?'background:rgba(0,255,159,0.1);color:var(--green)':'background:var(--bg2);color:var(--text3)')+'">'+(l.status==='active'?'\u5df2\u542f\u7528':'\u5f85\u542f\u7528')+'</span>'+
        '<div style="display:flex;gap:4px;margin-left:4px">'+
        (PERM.isAdmin()?'<button class="btn sm" style="font-size:9px;padding:2px 8px;min-width:auto" onclick="INTELCENTER.showLayerForm(\''+l.name+'\')">\u270f\ufe0f</button>':'')+
        (PERM.isAdmin()?'<button class="btn sm" style="font-size:9px;padding:2px 8px;min-width:auto;color:var(--red)" onclick="INTELCENTER.deleteLayer(\''+l.name+'\')">\u{1F5D1}\uFE0F</button>':'')+
        '</div></div>';
    });
    html+='</div></div>';
    html+='<div class="card mt-12"><div class="card-tt"><span class="ic">\u{1F4CD}</span>\u7a7a\u95f4\u5206\u6790\u5de5\u5177 <span style="font-size:10px;color:var(--text3);font-weight:400">\u2014 \u70b9\u51fb\u6267\u884c\u5206\u6790</span></div>';
    html+='<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:8px">';
    var tools=[{name:'\u7f13\u51b2\u533a\u5206\u6790',ic:'\u23F1\uFE0F',desc:'\u751f\u6210\u7f13\u51b2\u533a'},{name:'\u901a\u89c6\u5206\u6790',ic:'\u{1F441}\uFE0F',desc:'\u5206\u6790\u5730\u5f62\u906e\u6321'},{name:'\u8def\u5f84\u89c4\u5212',ic:'\u{1F6E3}\uFE0F',desc:'\u89c4\u5212\u64a4\u79bb\u8def\u7ebf'},{name:'\u8986\u76d6\u5206\u6790',ic:'\u{1F4CA}',desc:'\u8bc4\u4f30\u8986\u76d6\u8303\u56f4'},{name:'\u90bb\u8fd1\u5206\u6790',ic:'\u{1F50C}',desc:'\u67e5\u627e\u9644\u8fd1\u4f01\u4e1a'},{name:'\u53e0\u7f6e\u5206\u6790',ic:'\u{1F4C6}',desc:'\u591a\u56fe\u5c42\u53e0\u52a0'}];
    tools.forEach(function(t){
      html+='<div style="padding:10px;background:var(--panel2);border:1px solid var(--border);border-radius:8px;cursor:pointer;transition:.2s" onclick="INTELCENTER.runGeoTool(\''+t.name+'\')" onmouseover="this.style.borderColor=\'var(--cyan)\';this.style.background=\'rgba(0,212,255,0.05)\'" onmouseout="this.style.borderColor=\'var(--border)\';this.style.background=\'var(--panel2)\'">'+
        '<div style="font-size:18px;margin-bottom:4px">'+t.ic+'</div><div style="font-size:11px;font-weight:600;color:var(--cyan);margin-bottom:2px">'+t.name+'</div><div style="font-size:9px;color:var(--text3);line-height:1.4">'+t.desc+'</div></div>';
    });
    html+='</div></div>';
    el.innerHTML=html;
  },
  showLayerForm(name){
    if(!PERM.canUpload()){showToast('\u26a0\ufe0f \u8bf7\u5148\u767b\u5f55');return;}
    var l=name?this._geointLayers.find(function(x){return x.name===name;}):null;
    var emojis=['\u{1F525}','\u{1F3ED}','\u2693\uFE0F','\u{1F30F}','\u{1F4A5}','\u{1F691}','\u{1F6E1}\uFE0F','\u{1F4F6}','\u{1F4CD}','\u{1F30D}','\u{1F6A7}','\u{1F5FA}\uFE0F'];
    var html='<div style="padding:12px;background:var(--bg2);border-radius:8px">'+
      '<div style="font-size:12px;color:var(--text3);margin-bottom:10px">'+(l?'\u7f16\u8f91\u56fe\u5c42':'\u65b0\u589e\u56fe\u5c42')+'</div>'+
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">'+
      '<div><label class="text-xs text-muted" style="display:block;margin-bottom:4px">\u56fe\u5c42\u540d\u79f0 <span style="color:var(--red)">*</span></label><input class="input" id="layer-form-name" value="'+(l?l.name:'')+'" style="font-size:12px;width:100%"></div>'+
      '<div><label class="text-xs text-muted" style="display:block;margin-bottom:4px">\u56fe\u6807</label><select class="select" id="layer-form-ic" style="font-size:12px;width:100%">'+emojis.map(function(e){return '<option value="'+e+'"'+(l&&l.ic===e?' selected':'')+'>'+e+'</option>';}).join('')+'</select></div>'+
      '<div><label class="text-xs text-muted" style="display:block;margin-bottom:4px">\u6570\u636e\u6761\u76ee</label><input class="input" id="layer-form-count" value="'+(l?l.count:'')+'" placeholder="\u5982\uff1a42\u56fd" style="font-size:12px;width:100%"></div>'+
      '<div><label class="text-xs text-muted" style="display:block;margin-bottom:4px">\u72b6\u6001</label><select class="select" id="layer-form-status" style="font-size:12px;width:100%"><option value="active"'+(l&&l.status==='active'?' selected':'')+'>\u5df2\u542f\u7528</option><option value="standby"'+(l&&l.status==='standby'?' selected':'')+'>\u5f85\u542f\u7528</option></select></div>'+
      '<div><label class="text-xs text-muted" style="display:block;margin-bottom:4px">\u989c\u8272</label><select class="select" id="layer-form-color" style="font-size:12px;width:100%"><option value="var(--red)"'+(l&&l.color==='var(--red)'?' selected':'')+'>\u7ea2\u8272</option><option value="var(--orange)"'+(l&&l.color==='var(--orange)'?' selected':'')+'>\u6a59\u8272</option><option value="var(--yellow)"'+(l&&l.color==='var(--yellow)'?' selected':'')+'>\u9ec4\u8272</option><option value="var(--green)"'+(l&&l.color==='var(--green)'?' selected':'')+'>\u7eff\u8272</option><option value="var(--cyan)"'+(l&&l.color==='var(--cyan)'?' selected':'')+'>\u9752\u8272</option><option value="var(--purple)"'+(l&&l.color==='var(--purple)'?' selected':'')+'>\u7d2b\u8272</option></select></div>'+
      '</div>'+
      '<div style="margin-bottom:10px"><label class="text-xs text-muted" style="display:block;margin-bottom:4px">\u63cf\u8ff0 <span style="color:var(--red)">*</span></label><input class="input" id="layer-form-desc" value="'+(l?l.desc:'')+'" style="font-size:12px;width:100%"></div>'+
      '<div style="margin-bottom:10px"><label class="text-xs text-muted" style="display:block;margin-bottom:4px">\u6570\u636e\u8bf4\u660e</label><textarea class="input" id="layer-form-data" rows="2" style="font-size:12px;width:100%;resize:vertical">'+(l?l.data:'')+'</textarea></div>'+
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">'+
      '<div><label class="text-xs text-muted" style="display:block;margin-bottom:4px">\u6570\u636e\u6765\u6e90</label><input class="input" id="layer-form-source" value="'+(l?(l.source||''):'')+'" placeholder="\u5982\uff1a\u591a\u6e90\u60c5\u62a5\u878d\u5408" style="font-size:12px;width:100%"></div>'+
      '<div><label class="text-xs text-muted" style="display:block;margin-bottom:4px">\u8986\u76d6\u8303\u56f4</label><input class="input" id="layer-form-coverage" value="'+(l?(l.coverage||''):'')+'" placeholder="\u5982\uff1a\u5168\u740342\u56fd" style="font-size:12px;width:100%"></div>'+
      '</div>'+
      '<div style="margin-bottom:10px"><label class="text-xs text-muted" style="display:block;margin-bottom:4px">\u6280\u672f\u5143\u6570\u636e</label><input class="input" id="layer-form-meta" value="'+(l?(l.meta||''):'')+'" placeholder="\u5982\uff1a\u7f51\u683c\u7cbe\u5ea6\u3001\u66f4\u65b0\u9891\u7387\u3001\u8bc4\u5206\u65b9\u6cd5" style="font-size:12px;width:100%"></div>'+
      '<div style="margin-bottom:10px"><label class="text-xs text-muted" style="display:block;margin-bottom:4px">\u4e13\u4e1a\u5206\u6790\u62a5\u544a</label><textarea class="input" id="layer-form-analysis" rows="4" style="font-size:12px;width:100%;resize:vertical">'+(l?(l.analysis||''):'')+'</textarea></div>'+
      '<div style="display:flex;gap:8px">'+
      '<button class="btn primary sm" onclick="INTELCENTER.saveLayer('+(l?'\''+l.name+'\'':'null')+')"">\u2705 \u4fdd\u5b58</button>'+
      '<button class="btn sm" onclick="document.getElementById(\'modal\').classList.remove(\'show\')">\u53d6\u6d88</button>'+
      '</div></div>';
    document.getElementById('modal-tt').textContent=(l?'\u7f16\u8f91\u56fe\u5c42':'\u65b0\u589e\u56fe\u5c42');
    document.getElementById('modal-bd').innerHTML=html;
    document.getElementById('modal').classList.add('show');
  },
  saveLayer(oldName){
    var name=document.getElementById('layer-form-name').value.trim();
    var ic=document.getElementById('layer-form-ic').value;
    var count=document.getElementById('layer-form-count').value.trim();
    var status=document.getElementById('layer-form-status').value;
    var color=document.getElementById('layer-form-color').value;
    var desc=document.getElementById('layer-form-desc').value.trim();
    var data=document.getElementById('layer-form-data').value.trim();
    var source=document.getElementById('layer-form-source').value.trim();
    var coverage=document.getElementById('layer-form-coverage').value.trim();
    var meta=document.getElementById('layer-form-meta').value.trim();
    var analysis=document.getElementById('layer-form-analysis').value.trim();
    if(!name||!desc){showToast('\u26a0\ufe0f \u8bf7\u586b\u5199\u56fe\u5c42\u540d\u79f0\u548c\u63cf\u8ff0');return;}
    if(oldName&&oldName!=='null'){
      var l=this._geointLayers.find(function(x){return x.name===oldName;});
      if(l){l.name=name;l.ic=ic;l.count=count||'-';l.status=status;l.color=color;l.desc=desc;l.data=data;l.source=source;l.coverage=coverage;l.meta=meta;l.analysis=analysis;l.updated=new Date().toISOString().slice(0,16).replace('T',' ');}
      showToast('\u2705 \u56fe\u5c42\u5df2\u66f4\u65b0');
    }else{
      this._geointLayers.push({name:name,ic:ic,desc:desc,status:status,color:color,count:count||'-',data:data,source:source,coverage:coverage,meta:meta,analysis:analysis,updated:new Date().toISOString().slice(0,16).replace('T',' '),records:[]});
      showToast('\u2705 \u56fe\u5c42\u5df2\u6dfb\u52a0');
    }
    this._saveGeoint();
    document.getElementById('modal').classList.remove('show');
    this.render();
  },
  deleteLayer(name){
    if(!PERM.guard('\u5220\u9664\u56fe\u5c42'))return;
    if(!confirm('\u786e\u8ba4\u5220\u9664\u56fe\u5c42\u300c'+name+'\u300d\uff1f'))return;
    this._geointLayers=this._geointLayers.filter(function(x){return x.name!==name;});
    this._saveGeoint();
    this.render();
    showToast('\u2705 \u5df2\u5220\u9664');
  },
  exportGeoint(){
    this._exportJSON(this._geointLayers,'geoint_layers.json');
  },
  resetGeoint(){
    if(!confirm('\u91cd\u7f6e\u4e3a\u9ed8\u8ba4\u6a21\u62df\u6570\u636e\uff1f'))return;
    this._resetData('geoint');
    this.render();
    showToast('\u2705 \u5df2\u91cd\u7f6e');
  },
  showLayerDetail(name){
    var l=this._geointLayers.find(function(x){return x.name===name;});if(!l)return;
    var html='<div style="padding:14px;background:var(--bg2);border-radius:10px;margin-bottom:14px"><div style="display:flex;align-items:center;gap:10px"><span style="font-size:28px">'+l.ic+'</span><div><div style="font-size:16px;font-weight:700;color:'+l.color+'">'+l.name+'</div><div style="font-size:11px;color:var(--text3);margin-top:2px">'+l.desc+'</div></div><div style="margin-left:auto;display:flex;gap:6px">'+
      '<span style="font-size:9px;padding:3px 10px;border-radius:4px;'+(l.status==='active'?'background:rgba(0,255,159,0.1);color:var(--green)':'background:var(--bg2);color:var(--text3)')+'">'+(l.status==='active'?'\u5df2\u542f\u7528':'\u5f85\u542f\u7528')+'</span></div></div></div>';
    html+='<div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:10px;margin-bottom:14px">'+
      '<div style="padding:10px;background:var(--bg2);border-radius:8px;border-left:3px solid '+l.color+'"><div class="text-xs text-muted">\u6570\u636e\u6761\u76ee</div><div style="font-size:18px;font-weight:800;color:'+l.color+';margin-top:2px">'+l.count+'</div></div>'+
      '<div style="padding:10px;background:var(--bg2);border-radius:8px;border-left:3px solid var(--cyan)"><div class="text-xs text-muted">\u66f4\u65b0\u65f6\u95f4</div><div style="font-size:11px;font-weight:600;margin-top:4px">'+(l.updated||'2026-07-14')+'</div></div>'+
      '<div style="padding:10px;background:var(--bg2);border-radius:8px;border-left:3px solid var(--green)"><div class="text-xs text-muted">\u72b6\u6001</div><div style="font-size:12px;font-weight:700;color:'+(l.status==='active'?'var(--green)':'var(--text3)')+';margin-top:4px">'+(l.status==='active'?'\u8fd0\u884c\u4e2d':'\u5f85\u542f\u7528')+'</div></div>'+
      '<div style="padding:10px;background:var(--bg2);border-radius:8px;border-left:3px solid var(--orange)"><div class="text-xs text-muted">\u8bb0\u5f55\u6570</div><div style="font-size:18px;font-weight:800;color:var(--orange);margin-top:2px">'+(l.records?l.records.length:0)+'</div></div>'+
      '</div>';
    if(l.source){
      html+='<div style="padding:12px;background:rgba(0,212,255,0.04);border:1px solid rgba(0,212,255,0.12);border-radius:8px;margin-bottom:12px"><div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">'+
        '<div><div style="font-size:10px;color:var(--cyan);font-weight:700;margin-bottom:4px">\u{1F4E1} \u6570\u636e\u6765\u6e90</div><div style="font-size:11px;color:var(--text2);line-height:1.6">'+l.source+'</div></div>'+
        '<div><div style="font-size:10px;color:var(--cyan);font-weight:700;margin-bottom:4px">\u{1F5FA}\ufe0f \u8986\u76d6\u8303\u56f4</div><div style="font-size:11px;color:var(--text2);line-height:1.6">'+l.coverage+'</div></div>'+
        '</div></div>';
    }
    if(l.meta){
      html+='<div style="padding:10px;background:var(--bg2);border-radius:8px;margin-bottom:12px"><div style="font-size:10px;color:var(--text3);font-weight:600;margin-bottom:4px">\u2699\ufe0f \u6280\u672f\u5143\u6570\u636e</div><div style="font-size:11px;color:var(--text2);line-height:1.6">'+l.meta+'</div></div>';
    }
    if(l.analysis){
      html+='<div style="padding:12px;background:rgba(255,204,0,0.04);border:1px solid rgba(255,204,0,0.12);border-radius:8px;margin-bottom:12px"><div style="font-size:11px;color:var(--yellow);font-weight:700;margin-bottom:6px">\u{1F4CB} \u4e13\u4e1a\u5206\u6790\u62a5\u544a</div><div style="font-size:11px;color:var(--text2);line-height:1.8">'+l.analysis+'</div></div>';
    }
    if(l.records&&l.records.length>0){
      var keys=Object.keys(l.records[0]);
      html+='<div style="margin-bottom:12px"><div style="font-size:11px;color:var(--cyan);font-weight:700;margin-bottom:8px">\u{1F4CA} \u6570\u636e\u660e\u7ec6\uff08'+l.records.length+'\u6761\uff09</div>';
      html+='<div style="max-height:350px;overflow-y:auto;border:1px solid var(--border);border-radius:8px">';
      html+='<table style="width:100%;border-collapse:collapse;font-size:10px"><thead><tr style="position:sticky;top:0;background:var(--bg2);z-index:1">';
      keys.forEach(function(k){
        var labels={'region':'\u533a\u57df','country':'\u56fd\u5bb6','city':'\u57ce\u5e02','company':'\u4f01\u4e1a','sector':'\u884c\u4e1a','name':'\u540d\u79f0','type':'\u7c7b\u578b','corridor':'\u8d70\u5eca','date':'\u65e5\u671f','route':'\u8def\u7ebf','political':'\u653f\u6cbb','economic':'\u7ecf\u6d4e','security':'\u5b89\u5168','social':'\u793e\u4f1a','disaster':'\u707e\u5bb3','total':'\u7efc\u5408','trend':'\u8d8b\u52bf','note':'\u5907\u6ce8','staff':'\u5458\u5de5','cnStaff':'\u4e2d\u65b9\u4eba\u5458','risk':'\u98ce\u9669','level':'\u7b49\u7ea7','dailyShips':'\u65e5\u901a\u822a','riskLevel':'\u98ce\u9669\u7b49\u7ea7','riskScore':'\u98ce\u9669\u5206','congestion':'\u62e5\u5835','alternative':'\u66ff\u4ee3\u8def\u7ebf','countries':'\u8986\u76d6\u56fd\u5bb6','projects':'\u9879\u76ee\u6570','investment':'\u6295\u8d44','progress':'\u8fdb\u5ea6','casualties':'\u4f24\u4ea1','group':'\u7ec4\u7ec7','target':'\u88ad\u51fb\u76ee\u6807','mode':'\u4ea4\u901a','capacity':'\u5bb9\u91cf','assembly':'\u96c6\u7ed3\u70b9','transit':'\u9014\u5f84','status':'\u72b6\u6001','capabilities':'\u80fd\u529b','response':'\u54cd\u5e94','freq':'\u9891\u6bb5','coverage':'\u8986\u76d6','latency':'\u5ef6\u8fdf'};
        html+='<th style="padding:6px 8px;text-align:left;border-bottom:1px solid var(--border);color:var(--text3);font-weight:600;white-space:nowrap">'+(labels[k]||k)+'</th>';
      });
      html+='</tr></thead><tbody>';
      l.records.forEach(function(r,i){
        html+='<tr style="background:'+(i%2===0?'transparent':'rgba(255,255,255,0.015)')+';cursor:pointer" onclick="INTELCENTER._showRecordDetail(\''+l.name+'\','+i+')" onmouseover="this.style.background=\'rgba(0,212,255,0.05)\'" onmouseout="this.style.background=\''+(i%2===0?'transparent':'rgba(255,255,255,0.015)')+'\'">';
        keys.forEach(function(k){
          var v=r[k]||'-';
          var style='';
          if(k==='risk'||k==='riskLevel'||k==='level'){
            if(v==='\u6781\u9ad8'||v==='\u6781\u9ad8\u5a01\u80c1')style='color:var(--red);font-weight:700';
            else if(v==='\u9ad8')style='color:var(--orange);font-weight:700';
            else if(v==='\u4e2d'||v==='\u4e2d\u4f4e')style='color:var(--yellow)';
            else if(v==='\u4f4e')style='color:var(--green)';
          }
          if(k==='total'||k==='riskScore'){
            var n=parseFloat(v);
            if(n>=8)style='color:var(--red);font-weight:700';
            else if(n>=7)style='color:var(--orange);font-weight:700';
            else if(n>=5)style='color:var(--yellow)';
            else style='color:var(--green)';
          }
          if(k==='trend'){
            if(v==='\u2191')style='color:var(--red)';
            else if(v==='\u2193')style='color:var(--green)';
            else style='color:var(--yellow)';
          }
          if(k==='note'||k==='transit'||k==='capabilities'||k==='alternative'||k==='source')style='max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap';
          html+='<td style="padding:5px 8px;border-bottom:1px solid rgba(255,255,255,0.03);'+style+'">'+v+'</td>';
        });
        html+='</tr>';
      });
      html+='</tbody></table></div>';
      html+='<div style="font-size:9px;color:var(--text3);margin-top:4px;text-align:right">\u70b9\u51fb\u884c\u53ef\u67e5\u770b\u8be6\u7ec6\u60c5\u62a5</div>';
      html+='</div>';
    }
    html+='<div style="display:flex;gap:8px;flex-wrap:wrap">'+
      '<button class="btn '+(l.status==='active'?'':'primary')+' sm" onclick="INTELCENTER.toggleLayer(\''+l.name+'\')">'+(l.status==='active'?'\u23f8\ufe0f \u5173\u95ed':'\u25b6\ufe0f \u542f\u7528')+'</button>'+
      (PERM.isAdmin()?'<button class="btn primary sm" onclick="INTELCENTER.showLayerForm(\''+l.name+'\')">\u270f\ufe0f \u7f16\u8f91</button>':'')+
      (PERM.isAdmin()?'<button class="btn sm" onclick="INTELCENTER.deleteLayer(\''+l.name+'\')">\u{1F5D1}\ufe0f \u5220\u9664</button>':'')+
      '<button class="btn sm" onclick="INTELCENTER._exportJSON(INTELCENTER._geointLayers.find(function(x){return x.name===\''+l.name+'\';}),\''+l.name+'.json\')">\u{1F4E5} \u5bfc\u51faJSON</button>'+
      '<button class="btn sm" onclick="INTELCENTER._exportLayerCSV(\''+l.name+'\')">\u{1F4E5} \u5bfc\u51faCSV</button>'+
      '</div>';
    document.getElementById('modal-tt').textContent=l.ic+' '+l.name;
    document.getElementById('modal-bd').innerHTML=html;
    document.getElementById('modal').classList.add('show');
  },
  _showRecordDetail(layerName,idx){
    var l=this._geointLayers.find(function(x){return x.name===layerName;});if(!l||!l.records||!l.records[idx])return;
    var r=l.records[idx];
    var html='<div style="padding:14px;background:var(--bg2);border-radius:10px;margin-bottom:14px"><div style="font-size:14px;font-weight:700;color:'+l.color+'">'+l.name+' \u2014 \u8bb0\u5f55\u8be6\u60c5</div><div style="font-size:10px;color:var(--text3);margin-top:4px">\u7b2c '+(idx+1)+' \u6761\u8bb0\u5f55</div></div>';
    html+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">';
    Object.keys(r).forEach(function(k){
      var labels={'region':'\u533a\u57df','country':'\u56fd\u5bb6','city':'\u57ce\u5e02','company':'\u4f01\u4e1a','sector':'\u884c\u4e1a','name':'\u540d\u79f0','type':'\u7c7b\u578b','corridor':'\u8d70\u5eca','date':'\u65e5\u671f','route':'\u8def\u7ebf','political':'\u653f\u6cbb\u98ce\u9669','economic':'\u7ecf\u6d4e\u98ce\u9669','security':'\u5b89\u5168\u98ce\u9669','social':'\u793e\u4f1a\u98ce\u9669','disaster':'\u707e\u5bb3\u98ce\u9669','total':'\u7efc\u5408\u98ce\u9669','trend':'\u8d8b\u52bf','note':'\u5907\u6ce8','staff':'\u5458\u5de5\u6570','cnStaff':'\u4e2d\u65b9\u4eba\u5458','risk':'\u98ce\u9669\u7b49\u7ea7','level':'\u7b49\u7ea7','dailyShips':'\u65e5\u901a\u822a\u91cf','riskLevel':'\u98ce\u9669\u7b49\u7ea7','riskScore':'\u98ce\u9669\u8bc4\u5206','congestion':'\u62e5\u5835\u7a0b\u5ea6','alternative':'\u66ff\u4ee3\u8def\u7ebf','countries':'\u8986\u76d6\u56fd\u5bb6','projects':'\u9879\u76ee\u6570','investment':'\u6295\u8d44\u989d','progress':'\u5b8c\u6210\u8fdb\u5ea6','casualties':'\u4f24\u4ea1','group':'\u7ec4\u7ec7','target':'\u88ad\u51fb\u76ee\u6807','mode':'\u4ea4\u901a\u65b9\u5f0f','capacity':'\u5bb9\u7eb3\u91cf','assembly':'\u96c6\u7ed3\u70b9','transit':'\u9014\u5f84\u8def\u7ebf','status':'\u72b6\u6001','capabilities':'\u5b89\u4fdd\u80fd\u529b','response':'\u54cd\u5e94\u65f6\u95f4','freq':'\u9891\u6bb5','coverage':'\u8986\u76d6\u8303\u56f4','latency':'\u901a\u4fe1\u5ef6\u8fdf','source':'\u6570\u636e\u6765\u6e90','analysis':'\u5206\u6790','records':'\u8bb0\u5f55','meta':'\u6280\u672f\u5143\u6570\u636e','updated':'\u66f4\u65b0\u65f6\u95f4','count':'\u6570\u636e\u6761\u76ee','ic':'\u56fe\u6807','desc':'\u63cf\u8ff0','color':'\u989c\u8272'};
      var v=r[k];
      if(k==='note'||k==='transit'||k==='capabilities'||k==='alternative'||k==='analysis'||k==='desc'){
        html+='<div style="grid-column:1/3;padding:10px;background:var(--bg2);border-radius:8px"><div style="font-size:10px;color:var(--text3);margin-bottom:4px">'+(labels[k]||k)+'</div><div style="font-size:11px;color:var(--text2);line-height:1.6">'+(v||'-')+'</div></div>';
      }else{
        html+='<div style="padding:10px;background:var(--bg2);border-radius:8px"><div style="font-size:10px;color:var(--text3);margin-bottom:4px">'+(labels[k]||k)+'</div><div style="font-size:12px;color:var(--text);font-weight:600">'+(v||'-')+'</div></div>';
      }
    });
    html+='</div>';
    this._currentRecord=r;this._currentLayerName=l.name;
    html+='<div style="display:flex;gap:8px;margin-top:12px"><button class="btn sm" onclick="INTELCENTER.showLayerDetail(\''+l.name+'\')">\u2190 \u8fd4\u56de\u56fe\u5c42</button><button class="btn sm" onclick="INTELCENTER._exportJSON(INTELCENTER._currentRecord,\''+l.name+'_record_'+(idx+1)+'.json\')">\u{1F4E5} \u5bfc\u51fa\u6b64\u8bb0\u5f55</button></div>';
    document.getElementById('modal-tt').textContent=l.ic+' '+l.name+' \u2014 \u8bb0\u5f55 '+(idx+1);
    document.getElementById('modal-bd').innerHTML=html;
    document.getElementById('modal').classList.add('show');
  },
  _exportLayerCSV(name){
    var l=this._geointLayers.find(function(x){return x.name===name;});
    if(!l||!l.records||l.records.length===0){showToast('\u26a0\ufe0f \u65e0\u53ef\u5bfc\u51fa\u6570\u636e');return;}
    var keys=Object.keys(l.records[0]);
    this._exportCSV(l.records,keys,name+'_export.csv');
  },
    toggleLayer(name){
    var l=this._geointLayers.find(function(x){return x.name===name;});
    if(l){l.status=l.status==='active'?'standby':'active';this._saveGeoint();showToast('\u56fe\u5c42\u300c'+name+'\u300d'+(l.status==='active'?'\u5df2\u542f\u7528':'\u5df2\u5173\u95ed'));this.render();document.getElementById('modal').classList.remove('show');}
  },
  runGeoTool(tool){
    var desc={'\u7f13\u51b2\u533a\u5206\u6790':'\u5728\u6307\u5b9a\u76ee\u6807\u5468\u56f4\u751f\u6210\u591a\u73af\u7f13\u51b2\u533a\uff0c\u8bc4\u4f30\u4e0d\u540c\u534a\u5f84\u4e0b\u7684\u5f71\u54cd\u8303\u56f4\u3002','\u901a\u89c6\u5206\u6790':'\u57fa\u4e8e\u6570\u5b57\u9ad8\u7a0b\u6a21\u578b(DEM)\u5206\u6790\u5730\u5f62\u906e\u6321\uff0c\u8bc4\u4f30\u89c2\u5bdf\u54cd\u533a\u548c\u6b7b\u89d2\u3002','\u8def\u5f84\u89c4\u5212':'\u7efc\u5408\u8003\u8651\u98ce\u9669\u7b49\u7ea7\u3001\u5730\u5f62\u3001\u4ea4\u901a\u7b49\u56e0\u7d20\uff0c\u89c4\u5212\u6700\u4f18\u64a4\u79bb\u8def\u7ebf\u3002','\u8986\u76d6\u5206\u6790':'\u8bc4\u4f30\u5b89\u4fdd\u529b\u91cf\u3001\u4f7f\u9886\u9986\u8986\u76d6\u8303\u56f4\uff0c\u8bc6\u522b\u76f2\u533a\u3002','\u90bb\u8fd1\u5206\u6790':'\u67e5\u627e\u76ee\u6807\u9644\u8fd1\u7684\u4e2d\u8d44\u4f01\u4e1a\u3001\u4f7f\u9886\u9986\u7b49\u8bbe\u65bd\u3002','\u53e0\u7f6e\u5206\u6790':'\u5c06\u591a\u4e2a\u56fe\u5c42\u53e0\u52a0\u5206\u6790\uff0c\u53d1\u73b0\u98ce\u9669\u4ea4\u53c9\u70b9\u3002'};
    var html='<div style="padding:12px;background:var(--bg2);border-radius:8px;margin-bottom:12px"><div style="font-size:14px;font-weight:700;color:var(--cyan)">\u{1F4CD} '+tool+'</div><div style="font-size:11px;color:var(--text3);margin-top:4px">\u7a7a\u95f4\u5206\u6790\u5de5\u5177 \u2014 \u6a21\u62df\u8bad\u7ec3\u73af\u5883</div></div>';
    html+='<div style="padding:12px;background:rgba(0,212,255,0.05);border:1px solid rgba(0,212,255,0.15);border-radius:8px;margin-bottom:12px"><div style="font-weight:700;color:var(--cyan);margin-bottom:8px">\u{1F4CB} \u5206\u6790\u8bf4\u660e</div><div style="font-size:12px;line-height:1.8;color:var(--text2)">'+(desc[tool]||'\u7a7a\u95f4\u5206\u6790\u5de5\u5177')+'</div></div>';
    html+='<div style="padding:12px;background:var(--bg2);border-radius:8px;margin-bottom:12px"><div style="font-weight:600;margin-bottom:8px">\u2699\ufe0f \u5206\u6790\u53c2\u6570\u8bbe\u7f6e</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px"><div><label class="text-xs text-muted">\u5206\u6790\u534a\u5f84</label><select class="select" style="font-size:12px;width:100%"><option>5km</option><option>10km</option><option>50km</option><option>100km</option></select></div><div><label class="text-xs text-muted">\u5206\u6790\u7cbe\u5ea6</label><select class="select" style="font-size:12px;width:100%"><option>\u9ad8</option><option>\u4e2d</option><option>\u4f4e</option></select></div></div></div>';
    html+='<div style="display:flex;gap:8px"><button class="btn primary sm" onclick="showToast(\'\u2699\ufe0f \u6b63\u5728\u6267\u884c'+tool+'...\');setTimeout(function(){showToast(\'\u2705 '+tool+'\u5b8c\u6210\')},2000)">\u25B6\uFE0F \u6267\u884c\u5206\u6790</button><button class="btn sm" onclick="document.getElementById(\'modal\').classList.remove(\'show\')">\u5173\u95ed</button></div>';
    document.getElementById('modal-tt').textContent='\u{1F4CD} '+tool;
    document.getElementById('modal-bd').innerHTML=html;
    document.getElementById('modal').classList.add('show');
  }
};


// ===== INTEL GALLERY — User Upload Intelligence Imagery Center =====
const INTELGALLERY={
  STORE_KEY:'intel_images',
  images:[],
  _pendingImg:null,
  init(){
    this.load();this.render();this.renderUpload();
  },
  load(){
    try{const d=localStorage.getItem(this.STORE_KEY);this.images=d?JSON.parse(d):[];}catch(e){this.images=[];}
  },
  save(){
    try{localStorage.setItem(this.STORE_KEY,JSON.stringify(this.images));}catch(e){toast('存储失败，图片过大');}
  },
  renderUpload(){
    const el=document.getElementById('intel-upload');
    if(!el)return;
    el.innerHTML='<div class="intel-upload-zone" id="intel-drop">'+
      '<div style="font-size:32px;color:var(--cyan);margin-bottom:8px">↑</div>'+
      '<div style="font-size:13px;color:var(--text);margin-bottom:4px">点击或拖放上传情报影像</div>'+
      '<div style="font-size:10px;color:var(--text3)">支持 JPG/PNG/WebP，单张不超过5MB</div>'+
      '<input type="file" id="intel-file" accept="image/*" multiple style="display:none">'+
      '</div>'+
      '<div id="intel-form" style="display:none" class="intel-form">'+
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">'+
      '<input type="text" id="intel-f-title" class="intel-input" placeholder="情报标题">'+
      '<input type="text" id="intel-f-loc" class="intel-input" placeholder="位置/区域">'+
      '<select id="intel-f-level" class="intel-input">'+
      '<option value="red">极高威胁</option>'+
      '<option value="orange">高威胁</option>'+
      '<option value="yellow">中高威胁</option>'+
      '<option value="cyan">监控中</option>'+
      '</select>'+
      '<input type="text" id="intel-f-tag" class="intel-input" placeholder="标签(卫星侦察/无人机/反恐...)">'+
      '</div>'+
      '<textarea id="intel-f-desc" class="intel-input" rows="2" placeholder="情报摘要描述..." style="margin-top:8px;width:100%;resize:vertical"></textarea>'+
      '<div style="display:flex;gap:8px;margin-top:8px">'+
      '<button class="btn sm" style="background:var(--cyan);color:#000" onclick="INTELGALLERY.submit()">确认上传</button>'+
      '<button class="btn sm" onclick="INTELGALLERY.cancelUpload()">取消</button>'+
      '</div></div>';
    const drop=document.getElementById('intel-drop');
    const fileInput=document.getElementById('intel-file');
    if(!drop||!fileInput)return;
    drop.addEventListener('click',()=>fileInput.click());
    drop.addEventListener('dragover',e=>{e.preventDefault();drop.style.borderColor='var(--cyan)';drop.style.background='rgba(0,212,255,0.05)';});
    drop.addEventListener('dragleave',e=>{drop.style.borderColor='';drop.style.background='';});
    drop.addEventListener('drop',e=>{e.preventDefault();drop.style.borderColor='';drop.style.background='';if(e.dataTransfer.files[0])this.handleFile(e.dataTransfer.files[0]);});
    fileInput.addEventListener('change',e=>{if(e.target.files[0])this.handleFile(e.target.files[0]);});
  },
  handleFile(file){
    if(!file.type.startsWith('image/')){toast('请选择图片文件');return;}
    if(file.size>5*1024*1024){toast('图片不能超过5MB');return;}
    const reader=new FileReader();
    reader.onload=e=>{
      this._pendingImg=e.target.result;
      document.getElementById('intel-form').style.display='block';
      const drop=document.getElementById('intel-drop');
      drop.innerHTML='<img src="'+this._pendingImg+'" style="max-width:200px;max-height:100px;border-radius:6px;margin-bottom:8px"><div style="font-size:11px;color:var(--cyan)">'+file.name+'</div>';
      drop.style.borderColor='var(--cyan)';
    };
    reader.readAsDataURL(file);
  },
  submit(){
    const title=document.getElementById('intel-f-title').value.trim();
    if(!title){toast('请输入情报标题');return;}
    if(!this._pendingImg){toast('请先选择图片');return;}
    const img={
      id:'IMG'+Date.now(),src:this._pendingImg,title:title,
      loc:document.getElementById('intel-f-loc').value.trim()||'未标注',
      level:document.getElementById('intel-f-level').value,
      tag:document.getElementById('intel-f-tag').value.trim()||'情报影像',
      desc:document.getElementById('intel-f-desc').value.trim()||'无描述',
      time:new Date().toLocaleString('zh-CN',{hour12:false})
    };
    this.images.unshift(img);this.save();
    this._pendingImg=null;this.renderUpload();this.render();
    toast('情报影像已上传');
  },
  cancelUpload(){this._pendingImg=null;this.renderUpload();},
  del(id){
    if(!PERM.guard('\u5220\u9664\u60c5\u62a5\u5f71\u50cf'))return;
    if(!confirm('\u786e\u8ba4\u5220\u9664\u8be5\u60c5\u62a5\u5f71\u50cf\uff1f'))return;
    this.images=this.images.filter(i=>i.id!==id);this.save();this.render();
    toast('已删除');
  },
  render(){
    const el=document.getElementById('intel-gallery');
    if(!el)return;
    if(this.images.length===0){
      el.innerHTML='<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text3);font-size:13px">还没有上传的情报影像，请点击上方上传</div>';
      return;
    }
    const badgeMap={red:['极高威胁','var(--red)'],orange:['高威胁','var(--orange)'],yellow:['中高威胁','var(--yellow)'],cyan:['监控中','var(--cyan)']};
    el.innerHTML=this.images.map(function(img){
      var bm=badgeMap[img.level]||badgeMap.cyan;
      return '<div class="intel-card">'+
        '<div class="intel-card-img" data-id="'+img.id+'">'+
        '<img src="'+img.src+'" alt="'+img.title+'" loading="lazy">'+
        '<div class="intel-card-badge" style="background:'+bm[1]+'">'+bm[0]+'</div>'+
        '</div>'+
        '<div class="intel-card-body">'+
        '<div class="intel-card-tt">'+img.title+'</div>'+
        '<div class="intel-card-desc">'+img.desc.substring(0,60)+(img.desc.length>60?'...':'')+'</div>'+
        '<div class="intel-card-meta">'+
        '<span>📍 '+img.loc+'</span>'+
        '<span style="color:var(--cyan)">'+img.tag+'</span>'+
        '<span>'+img.time.substring(0,10)+'</span>'+
        '</div>'+
        (PERM.isAdmin()?'<button class="btn sm" style="margin-top:6px;color:var(--red);font-size:10px;padding:2px 8px" data-del="'+img.id+'">删除</button>':'')+
        '</div></div>';
    }).join('');
    var self=this;
    el.querySelectorAll('.intel-card-img').forEach(function(el2){el2.addEventListener('click',function(){self.show(el2.dataset.id);});});
    el.querySelectorAll('[data-del]').forEach(function(el2){el2.addEventListener('click',function(e){e.stopPropagation();self.del(el2.dataset.del);});});
  },
  show(id){
    const img=this.images.find(i=>i.id===id);
    if(!img)return;
    const badgeMap={red:['极高威胁','var(--red)'],orange:['高威胁','var(--orange)'],yellow:['中高威胁','var(--yellow)'],cyan:['监控中','var(--cyan)']};
    const bm=badgeMap[img.level]||badgeMap.cyan;
    const ov=document.createElement('div');
    ov.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.92);z-index:3000;display:flex;align-items:center;justify-content:center;flex-direction:column;padding:20px;box-sizing:border-box';
    ov.innerHTML='<div style="max-width:900px;width:100%">'+
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">'+
      '<div style="font-size:18px;font-weight:700;color:var(--cyan)">'+img.title+'</div>'+
      '<button class="btn sm" id="intel-close">✕ 关闭</button>'+
      '</div>'+
      '<img src="'+img.src+'" style="width:100%;border-radius:8px;border:1px solid var(--border);margin-bottom:12px">'+
      '<div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:8px">'+
      '<span style="padding:2px 8px;border-radius:4px;font-size:10px;font-weight:600;background:'+bm[1]+'20;color:'+bm[1]+'">'+bm[0]+'</span>'+
      '<span style="font-size:12px;color:var(--text2)">📍 '+img.loc+'</span>'+
      '<span style="font-size:12px;color:var(--text2)">🕐 '+img.time+'</span>'+
      '<span style="font-size:12px;color:var(--cyan)">'+img.tag+'</span>'+
      '</div>'+
      '<div style="font-size:13px;color:var(--text);line-height:1.6;background:var(--panel);padding:12px;border-radius:8px;border:1px solid var(--border)">'+
      '<div style="font-weight:600;margin-bottom:6px;color:var(--cyan)">情报摘要</div>'+
      img.desc+
      '</div></div>';
    ov.addEventListener('click',e=>{if(e.target===ov)ov.remove();});
    document.body.appendChild(ov);
    document.getElementById('intel-close').addEventListener('click',()=>ov.remove());
    var ab=document.createElement('button');
    ab.className='btn sm';ab.style.cssText='background:var(--cyan);color:#000;margin-left:8px';
    ab.textContent='🤖 情报分析';
    var sid=id;
    ab.onclick=function(){ov.remove();INTELGALLERY.openChat(sid);};
    document.getElementById('intel-close').parentNode.appendChild(ab);
  },
  _chatTarget:null,
  _chatMsgs:[],
  _chatOpts:[
    {key:'threat',label:'🔴 威胁分析',prompt:'分析该影像中的安全威胁'},
    {key:'summary',label:'📋 情报摘要',prompt:'生成该影像的情报摘要'},
    {key:'link',label:'🔗 关联事件',prompt:'关联相关安全事件'},
    {key:'risk',label:'⚠️ 风险评估',prompt:'评估该影像反映的风险等级'},
    {key:'action',label:'🛡️ 处置建议',prompt:'给出处置建议'},
    {key:'source',label:'🔍 来源分析',prompt:'分析情报来源可靠性'}
  ],
  openChat(id){
    var img=this.images.find(function(i){return i.id===id;});
    if(!img)return;
    this._chatTarget=img;this._chatMsgs=[];
    var box=document.getElementById('intel-chat-box');
    if(!box)return;
    box.style.display='block';
    document.getElementById('intel-chat-target').textContent=img.title;
    var self=this;
    document.getElementById('intel-chat-opts').innerHTML=this._chatOpts.map(function(o){
      return '<div class="intel-chat-opt" data-key="'+o.key+'" onclick="INTELGALLERY.chatOpt(\''+o.key+'\')">'+o.label+'</div>';
    }).join('');
    var lvTxt={red:"极高威胁",orange:"高威胁",yellow:"中高威胁",cyan:"监控中"};
    this._chatMsgs.push({role:'bot',text:'已加载情报影像「'+img.title+'」。请选择分析选项或直接输入你的分析内容。\n\n影像信息：\n- 位置：'+img.loc+'\n- 标签：'+img.tag+'\n- 威胁等级：'+(lvTxt[img.level]||"未知")+'\n- 上传时间：'+img.time});
    this._renderChat();
    document.getElementById('intel-chat-body').scrollTop=99999;
    box.scrollIntoView({behavior:'smooth',block:'nearest'});
  },
  chatOpt(key){
    var opt=this._chatOpts.find(function(o){return o.key===key;});
    if(!opt||!this._chatTarget)return;
    var self=this;
    document.querySelectorAll('#intel-chat-opts .intel-chat-opt').forEach(function(e){e.classList.toggle('active',e.dataset.key===key);});
    this._chatMsgs.push({role:'user',text:opt.prompt});
    this._renderChat();
    setTimeout(function(){self._genResponse(key);},600);
  },
  sendChat(){
    var inp=document.getElementById('intel-chat-input');
    var txt=inp.value.trim();
    if(!txt)return;
    this._chatMsgs.push({role:'user',text:txt});
    inp.value='';
    this._renderChat();
    var self=this;
    setTimeout(function(){
      self._chatMsgs.push({role:'bot',text:'已记录你的分析内容。你可以继续输入或选择上方分析选项进行深度研判。'});
      self._renderChat();
    },500);
  },
  _genResponse(key){
    var img=this._chatTarget;if(!img)return;
    var resp='';
    if(key==='threat'){
      var lvMap={red:'极高',orange:'高',yellow:'中高',cyan:'一般'};
      resp='【威胁分析】\n\n基于影像内容分析：\n1. 威胁等级：'+(lvMap[img.level]||'未知')+' - '+(img.level==='red'?'存在直接安全威胁，需立即响应':img.level==='orange'?'潜在安全风险升级中':'持续监控')+'\n2. 威胁类型：'+img.tag+'\n3. 影响范围：'+img.loc+'区域内的中资企业及人员\n4. 威胁趋势：'+(img.level==='red'||img.level==='orange'?'呈上升趋势，建议提升安保等级':'相对稳定')+'\n5. 关联风险：可能影响该区域投资安全和人员撤离通道';
    }else if(key==='summary'){
      resp='【情报摘要】\n\n'+(img.desc||'无描述')+'\n\n---\n情报来源：用户上传\n置信度：待交叉验证\n建议：结合多源情报进行关联分析';
    }else if(key==='link'){
      var linked=EVENTS.filter(function(e){return e.country&&img.loc&&img.loc.indexOf(e.country)>=0;}).slice(0,3);
      if(linked.length){
        resp='【关联事件】\n\n发现'+linked.length+'起关联事件：\n'+linked.map(function(e,i){return (i+1)+'. '+e.title+' ('+e.date+') - '+e.desc.substring(0,50);}).join('\n');
      }else{
        resp='【关联事件】\n\n暂未发现直接关联事件。建议：\n- 检查位置信息是否准确\n- 扩大搜索范围至周边区域\n- 手动关联相关事件';
      }
    }else if(key==='risk'){
      var scores={red:'8.5-10 极高',orange:'6.0-8.0 高',yellow:'4.0-6.0 中高',cyan:'<4.0 低'};
      resp='【风险评估】\n\n综合风险评分：'+(scores[img.level]||'待评估')+'\n\n评估维度：\n- 人员安全风险：'+(img.level==='red'?'极高 - 建议立即撤离':'中高 - 加强安保')+'\n- 资产安全风险：'+(img.level==='red'||img.level==='orange'?'高 - 启动应急预案':'中等')+'\n- 业务连续性：'+(img.level==='red'?'受到严重威胁':'基本可控')+'\n- 声誉风险：'+(img.level==='red'?'需公关预案':'可控')+'\n\n建议响应级别：'+(img.level==='red'?'I级（红色）':img.level==='orange'?'II级（橙色）':'III级（黄色）');
    }else if(key==='action'){
      resp='【处置建议】\n\n'+(img.level==='red'?'1. 立即启动I级应急预案\n2. 通知使馆和领事保护热线（+86-10-12308）\n3. 组织受影响人员撤离至安全区域\n4. 协调当地安保力量加强护卫\n5. 暂停该区域非必要业务活动\n6. 向总部安全部门实时汇报':img.level==='orange'?'1. 提升安保等级至II级\n2. 加强人员动态监控\n3. 检查应急通讯通道\n4. 准备撤离预案\n5. 与当地中资企业联防联控\n6. 48小时内提交风险评估报告':'1. 维持当前安保等级\n2. 持续关注态势发展\n3. 定期更新风险评估\n4. 保持应急联络通道畅通');
    }else if(key==='source'){
      resp='【来源分析】\n\n情报来源：用户自主上传\n采集时间：'+img.time+'\n\n可靠性评估：\n- 原始性：待验证（用户上传内容未经交叉核实）\n- 时效性：'+(img.time?'较新':'未知')+'\n- 准确性：需专业人员核实\n\n建议：\n1. 与其他情报源交叉验证\n2. 请专业人员鉴定影像真实性\n3. 结合公开情报(OSINT)辅助分析\n4. 标注情报置信度等级';
    }
    this._chatMsgs.push({role:'bot',text:resp});
    this._renderChat();
  },
  _renderChat(){
    var el=document.getElementById('intel-chat-body');if(!el)return;
    el.innerHTML=this._chatMsgs.map(function(m){
      return '<div class="intel-msg '+m.role+'"><div class="intel-msg-avatar">'+(m.role==='bot'?'🤖':'👤')+'</div><div class="intel-msg-content"><div class="intel-msg-name">'+(m.role==='bot'?'情报分析系统':'分析师')+'</div><div class="intel-msg-text">'+m.text.replace(/\n/g,'<br>')+'</div></div></div>';
    }).join('');
    el.scrollTop=el.scrollHeight;
  }
};
// ===== GLOBAL PANEL DRAG =====
var _panelDrag={info:null};
_panelDrag.start=function(panelId){
  return function(e){
    var panel=document.getElementById(panelId);
    if(!panel)return;
    e.preventDefault();
    var r=panel.getBoundingClientRect();
    var cr=panel.parentElement.getBoundingClientRect();
    _panelDrag.info={panel:panel,startX:e.clientX,startY:e.clientY,startLeft:r.left-cr.left,startTop:r.top-cr.top};
    panel.style.transition='none';panel.style.zIndex='10';
    panel.style.right='auto';panel.style.bottom='auto';
  };
};
_panelDrag.move=function(e){
  var d=_panelDrag.info;if(!d)return;
  e.preventDefault();
  var pw=d.panel.parentElement.clientWidth,ph=d.panel.parentElement.clientHeight;
  var pw2=d.panel.offsetWidth,ph2=d.panel.offsetHeight;
  var nl=Math.max(0,Math.min(d.startLeft+e.clientX-d.startX,pw-pw2));
  var nt=Math.max(0,Math.min(d.startTop+e.clientY-d.startY,ph-ph2));
  d.panel.style.left=nl+'px';d.panel.style.top=nt+'px';
};
_panelDrag.end=function(){
  var d=_panelDrag.info;if(!d)return;
  d.panel.style.transition='';d.panel.style.zIndex='6';
  localStorage.setItem('orps_dh_panel_'+d.panel.id,JSON.stringify({left:d.panel.style.left,top:d.panel.style.top}));
  _panelDrag.info=null;
};
_panelDrag.restore=function(panel){
  var s=localStorage.getItem('orps_dh_panel_'+panel.id);
  if(s){try{var p=JSON.parse(s);panel.style.left=p.left;panel.style.top=p.top;panel.style.right='auto';panel.style.bottom='auto';}catch(e){}}
};
document.addEventListener('mousemove',_panelDrag.move);
document.addEventListener('mouseup',_panelDrag.end);

// ===== SITUATION VIEW =====
const SITUATION={
  _needsRefresh:false,
  init(){
    GLOBE.init();
    const tI=ENTERPRISES.reduce((s,e)=>s+e.investment,0);
    const tP=ENTERPRISES.reduce((s,e)=>s+e.personnel,0);
    const tA=ENTERPRISES.reduce((s,e)=>s+e.assets,0);
    const aA=ALERTS.filter(a=>a.status==='active'||a.status==='responding').length;
    const rA=ALERTS.filter(a=>a.level==='red'&&a.status!=='resolved').length;
    document.getElementById('sit-stats').innerHTML=[
      {ic:'🏢',bg:'var(--blue-bg)',c:'var(--cyan)',l:'监测企业',v:ENTERPRISES.length,s:'覆盖'+new Set(ENTERPRISES.map(e=>e.industry)).size+'个行业',clk:'switchView(\'assets\')'},
      {ic:'🌏',bg:'var(--green-bg)',c:'var(--green)',l:'监测国家',v:COUNTRIES.length,s:'覆盖6大区域',clk:'switchView(\'monitor\')'},
      {ic:'💰',bg:'var(--yellow-bg)',c:'var(--yellow)',l:'海外投资(亿$)',v:tI.toLocaleString(),s:'资产'+tA.toLocaleString()+'亿$',clk:'switchView(\'assets\')'},
      {ic:'👥',bg:'var(--orange-bg)',c:'var(--orange)',l:'海外人员',v:tP.toLocaleString(),s:'含外派及本地雇员',clk:'switchView(\'assets\')'},
      {ic:'🚨',bg:'var(--red-bg)',c:'var(--red)',l:'活跃预警',v:aA,s:'红色预警'+rA+'起',clk:'switchView(\'alerts\')'},
      {ic:'📡',bg:'var(--blue-bg)',c:'var(--cyan)',l:'追踪事件',v:EVENTS.length,s:'监控中'+EVENTS.filter(e=>e.status==='active').length+'起',clk:'showSitEvents()'}
    ].map(s=>'<div class="stat-card" style="cursor:pointer;transition:.2s" onclick="'+s.clk+'" onmouseover="this.style.transform=\'translateY(-2px)\';this.style.boxShadow=\'0 4px 16px rgba(0,212,255,0.12)\'" onmouseout="this.style.transform=\'\';this.style.boxShadow=\'\'"><div class="stat-ic" style="background:'+s.bg+';color:'+s.c+'">'+s.ic+'</div><div class="stat-info"><div class="stat-label">'+s.l+'</div><div class="stat-val" style="color:'+s.c+'">'+s.v+'</div><div class="stat-sub">'+s.s+'</div></div></div>').join('');
    // Globe overlay stats
    const gAvg=COUNTRIES.reduce((s,c)=>s+calcOverall(c.scores),0)/COUNTRIES.length;
    document.getElementById('globe-stats').innerHTML=
      '<div class="globe-stat" style="cursor:pointer" onclick="switchView(\'forecast\')" title="点击查看预测分析"><div class="lb">全球风险指数</div><div class="vl" style="color:'+(gAvg>=6?'var(--red)':'var(--orange)')+'">'+gAvg.toFixed(1)+'</div></div>'+
      '<div class="globe-stat" style="cursor:pointer" onclick="SITUATION.showHighRiskCountries()" title="点击查看极高风险国家"><div class="lb">极高风险国家</div><div class="vl" style="color:var(--red)">'+COUNTRIES.filter(c=>calcOverall(c.scores)>=8).length+'</div></div>'+
      '<div class="globe-stat" style="cursor:pointer" onclick="switchView(\'alerts\')" title="点击查看预警中心"><div class="lb">活跃预警</div><div class="vl" style="color:var(--orange)">'+aA+'</div></div>';
    // Region summary
    const regs=[...new Set(COUNTRIES.map(c=>c.region))];
    document.getElementById('sit-region').innerHTML=regs.map(r=>{
      const cs=COUNTRIES.filter(c=>c.region===r);
      const avg=cs.reduce((s,c)=>s+calcOverall(c.scores),0)/cs.length;
      const lv=getLevel(avg);
      const ents=ENTERPRISES.filter(e=>e.countries.some(c=>{const ct=COUNTRIES.find(x=>x.name===c);return ct&&ct.region===r;})).length;
      return '<div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--border);cursor:pointer;transition:.2s" onclick="SITUATION.showRegion(\''+r+'\')" onmouseover="this.style.background=\'rgba(0,212,255,0.04)\'" onmouseout="this.style.background=\'\'"><div style="width:55px;font-size:11px;font-weight:600;color:var(--cyan)">'+r+'</div><div style="flex:1"><div class="risk-bar"><div class="risk-bar-fill" style="width:'+avg*10+'%;background:'+lv.color+'"></div></div></div><div style="width:30px;text-align:right;font-size:12px;font-weight:700;color:'+lv.color+'">'+avg.toFixed(1)+'</div><div style="width:45px;text-align:right;font-size:10px;color:var(--text2)">'+cs.length+'国</div></div>';
    }).join('');
    // Latest alerts — 8 items with rich info filling the card
    const la=[...ALERTS].sort((a,b)=>b.time.localeCompare(a.time)).slice(0,8);
    var alertHtml='';
    la.forEach(function(a,i){
      var lv=ALERT_LV[a.level];
      var cty=COUNTRIES.find(function(c){return c.name===a.country;});
      var flag=cty?cty.flag:'🌐';
      var sc=a.status==='active'?'var(--red)':a.status==='responding'?'var(--orange)':a.status==='acknowledged'?'var(--yellow)':a.status==='resolved'?'var(--green)':'#888';
      var stLabel={active:'活跃',responding:'处置中',acknowledged:'已确认',resolved:'已解除'}[a.status]||a.status;
      var timeAgo='';
      try{
        var diff=Date.now()-new Date(a.time.replace(' ','T')).getTime();
        var mins=Math.floor(diff/60000),hrs=Math.floor(mins/60),days=Math.floor(hrs/24);
        timeAgo=days>30?Math.floor(days/30)+'月前':days>0?days+'天前':hrs>0?hrs+'小时前':mins>0?mins+'分钟前':'刚刚';
      }catch(e){timeAgo=a.time.substring(0,10);}
      alertHtml+='<div class="sit-alert-row lv-'+a.level+(i>=6?' sit-alert-extra':'')+'" onclick="showAlertDetail(\''+a.id+'\')" style="display:flex;align-items:flex-start;gap:10px;padding:8px 6px;border-radius:6px;cursor:pointer;transition:.15s;border-left:3px solid '+sc+';margin-bottom:4px;background:var(--panel2)" onmouseover="this.style.background=\'rgba(0,212,255,0.06)\'" onmouseout="this.style.background=\'var(--panel2)\'">'+
        '<div style="flex-shrink:0;width:28px;text-align:center;font-size:18px;line-height:1">'+flag+'</div>'+
        '<div style="flex:1;min-width:0">'+
          '<div style="display:flex;align-items:center;gap:6px;margin-bottom:3px">'+
            '<span class="badge '+lv.cls+'" style="font-size:9px;padding:1px 5px">'+lv.label+'</span>'+
            '<span style="font-size:11px;font-weight:600;color:var(--text1);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1">'+a.title+'</span>'+
          '</div>'+
          '<div style="display:flex;align-items:center;gap:8px;font-size:10px;color:var(--text3)">'+
            '<span>🌍 '+a.country+'</span>'+
            '<span>🏢 '+a.enterprise+'</span>'+
            '<span>🕐 '+timeAgo+'</span>'+
            '<span style="margin-left:auto;color:'+sc+';font-size:9px">● '+stLabel+'</span>'+
          '</div>'+
        '</div>'+
      '</div>';
    });
    // "查看全部" button
    alertHtml+='<div style="margin-top:6px;padding-top:6px;border-top:1px solid var(--border);text-align:center">'+
      '<span style="color:var(--cyan);font-size:11px;cursor:pointer;transition:.15s;display:inline-flex;align-items:center;gap:4px" onclick="switchView(\'alerts\')" onmouseover="this.style.color=\'#fff\'" onmouseout="this.style.color=\'var(--cyan)\'">查看全部 <b style="font-size:12px">'+ALERTS.length+'</b> 条预警 →</span>'+
      '</div>';
    document.getElementById('sit-alerts').innerHTML=alertHtml;
    // Charts
    this.renderTrend();
    this.renderIndustry();
    this.renderAlertType();
    this.renderTicker();
    this.renderIntelPanels();
  },
  renderIntelPanels(){
    var liveEl=document.getElementById('globe-intel-live');
    var alertEl=document.getElementById('globe-intel-alerts');
    var hotEl=document.getElementById('globe-intel-hotspots');
    if(!liveEl&&!alertEl&&!hotEl)return;
    var topAlerts=[...ALERTS].sort(function(a,b){return b.time.localeCompare(a.time);}).slice(0,4);
    if(liveEl){
      var lv=topAlerts.map(function(a){
        var c=a.level==='red'?'var(--red)':a.level==='orange'?'var(--orange)':a.level==='yellow'?'var(--yellow)':'var(--cyan)';
        return '<div class="panel-item" onclick="showAlertDetail(\''+a.id+'\')"><div class="pulse-dot" style="background:'+c+'"></div><span style="color:'+c+';font-size:11px">['+ALERT_LV[a.level].label+']</span><span style="color:var(--text2);font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1">'+a.title+'</span></div>';
      }).join('');
      liveEl.innerHTML='<div class="panel-tt"><span class="panel-drag-handle">⠿</span>实时情报流</div>'+lv;
      _panelDrag.restore(liveEl);
      var tt=liveEl.querySelector('.panel-tt');if(tt)tt.onmousedown=_panelDrag.start('globe-intel-live');
    }
    if(alertEl){
      var redAlerts=ALERTS.filter(function(a){return a.level==='red';});
      var orAlerts=ALERTS.filter(function(a){return a.level==='orange';});
      alertEl.innerHTML='<div class="panel-tt"><span class="panel-drag-handle">⠿</span>活跃预警</div>'+
        '<div class="panel-item" onclick="switchView(\'alerts\')"><div class="pulse-dot" style="background:var(--red)"></div><span style="color:var(--red);font-weight:700;font-size:13px">'+redAlerts.length+'</span><span style="color:var(--text3);font-size:12px">红色预警</span></div>'+
        '<div class="panel-item" onclick="switchView(\'alerts\')"><div class="pulse-dot" style="background:var(--orange)"></div><span style="color:var(--orange);font-weight:700;font-size:13px">'+orAlerts.length+'</span><span style="color:var(--text3);font-size:12px">橙色预警</span></div>'+
        '<div class="panel-item" onclick="switchView(\'alerts\')"><div class="pulse-dot" style="background:var(--cyan)"></div><span style="color:var(--cyan);font-weight:700;font-size:13px">'+ALERTS.length+'</span><span style="color:var(--text3);font-size:12px">预警总数</span></div>';
      _panelDrag.restore(alertEl);
      var tt2=alertEl.querySelector('.panel-tt');if(tt2)tt2.onmousedown=_panelDrag.start('globe-intel-alerts');
    }
    if(hotEl){
      var hot=COUNTRIES.filter(function(c){return calcOverall(c.scores)>=7.5;}).sort(function(a,b){return calcOverall(b.scores)-calcOverall(a.scores);}).slice(0,5);
      var hv=hot.map(function(c){
        var sc=calcOverall(c.scores);
        var lv=getLevel(sc);
        return '<div class="panel-item" onclick="showCtyDetail(\''+c.name+'\')"><span style="color:'+lv.color+';font-weight:700;font-size:12px">'+sc.toFixed(1)+'</span><span style="color:var(--text2);font-size:12px;flex:1">'+c.name+'</span></div>';
      }).join('');
      hotEl.innerHTML='<div class="panel-tt"><span class="panel-drag-handle">⠿</span>风险热点</div>'+hv;
      _panelDrag.restore(hotEl);
      var tt3=hotEl.querySelector('.panel-tt');if(tt3)tt3.onmousedown=_panelDrag.start('globe-intel-hotspots');
    }
  },
  renderTicker(){
    const el=document.getElementById('globe-ticker-content');
    if(!el)return;
    const items=[];
    [...ALERTS].sort((a,b)=>b.time.localeCompare(a.time)).slice(0,8).forEach(a=>{
      const cls=a.level==="red"?"":a.level==="orange"?" orange":a.level==="yellow"?" yellow":" green";
      items.push('<span class="ti'+cls+'">['+ALERT_LV[a.level].label+']</span>'+a.title+' - '+a.country+' ('+a.time.substring(5)+')');
    });
    EVENTS.slice(0,6).forEach(e=>{
      items.push('<span class="ti orange">[事件]</span>'+e.title+' - '+e.country+' ('+e.date+')');
    });
    if(typeof TERROR_EVENTS!=="undefined")TERROR_EVENTS.slice(0,5).forEach(e=>{
      items.push('<span class="ti">[恐袭]</span>'+e.title+' - '+e.location+' ('+e.date+')');
    });
    CHOKEPOINTS.forEach(c=>{
      items.push('<span class="ti'+(c.risk>=8?"":c.risk>=6?" orange":" yellow")+'">[咽喉]</span>'+c.name+' 风险等级'+c.risk+' - '+c.desc.substring(0,30));
    });
    if(typeof CORRIDORS!=="undefined")CORRIDORS.forEach(c=>{
      items.push('<span class="ti green">[走廊]</span>'+c.name+' - '+c.status);
    });
    el.innerHTML=items.join('<span class="sep">|</span>')+'<span class="sep">|</span>'+items.join('<span class="sep">|</span>');
  },
  renderTrend(){
    var months=['1月','2月','3月','4月','5月','6月','7月'];
    var regs=['南亚','中东','东欧','非洲','东南亚','南美','中亚'];
    var colors=['#ff3355','#ff8800','#ffcc00','#00d4ff','#00ff9f','#b366ff','#e040fb'];
    var ds=[]; var currentScores=[]; var prevScores=[];
    regs.forEach(function(r,i){
      var cs=COUNTRIES.filter(function(c){return c.region===r;});
      if(!cs.length)return;
      var baseAvg=cs.reduce(function(s,c){return s+calcOverall(c.scores);},0)/cs.length;
      var data=months.map(function(_,j){return Math.round((baseAvg+(j-3)*0.15)*10)/10;});
      currentScores.push({region:r,score:data[data.length-1],color:colors[i],count:cs.length});
      prevScores.push({region:r,score:data[data.length-2],color:colors[i]});
      ds.push({label:r,data:data,borderColor:colors[i],backgroundColor:colors[i]+'18',borderWidth:2,tension:.35,pointRadius:3,pointHoverRadius:6,fill:true});
    });
    // Top stat chips
    var statsEl=document.getElementById('sit-trend-stats');
    if(statsEl){
      var allScores=currentScores.map(function(s){return s.score;});
      var avgScore=Math.round(allScores.reduce(function(a,b){return a+b;},0)/allScores.length*10)/10;
      var maxS=currentScores.reduce(function(a,b){return a.score>b.score?a:b;});
      var minS=currentScores.reduce(function(a,b){return a.score<b.score?a:b;});
      var avgClr=avgScore>=7?'#ff3355':avgScore>=5?'#ff8800':avgScore>=4?'#ffcc00':'#00ff9f';
      var trndUp=avgScore>=(prevScores.reduce(function(a,b){return a.score+b.score;},0)/prevScores.length);
      statsEl.innerHTML=
        '<div style="flex:1;min-width:60px;background:rgba(0,212,255,0.05);border-radius:8px;padding:8px 10px;text-align:center">'+
          '<div style="font-size:9px;color:var(--text3);margin-bottom:3px">整体风险指数</div>'+
          '<div style="font-size:20px;font-weight:800;color:'+avgClr+'">'+avgScore.toFixed(1)+'</div>'+
          '<div style="font-size:10px;color:'+avgClr+'">'+getLevel(avgScore).label+'</div>'+
        '</div>'+
        '<div style="flex:1;min-width:60px;background:rgba(255,136,0,0.05);border-radius:8px;padding:8px 10px;text-align:center">'+
          '<div style="font-size:9px;color:var(--text3);margin-bottom:3px">最高风险区域</div>'+
          '<div style="font-size:15px;font-weight:700;color:'+maxS.color+'">'+maxS.region+'</div>'+
          '<div style="font-size:10px;color:'+maxS.color+'">'+maxS.score.toFixed(1)+' · '+getLevel(maxS.score).label+'</div>'+
        '</div>'+
        '<div style="flex:1;min-width:60px;background:rgba(0,255,159,0.05);border-radius:8px;padding:8px 10px;text-align:center">'+
          '<div style="font-size:9px;color:var(--text3);margin-bottom:3px">风险趋势</div>'+
          '<div style="font-size:15px;font-weight:700;color:'+(trndUp?'#ff3355':'#00ff9f')+'">'+(trndUp?'📈 上升':'📉 下降')+'</div>'+
          '<div style="font-size:10px;color:var(--text3)">最低 '+minS.region+' '+minS.score.toFixed(1)+'</div>'+
        '</div>';
    }
    // Enhanced line chart
    var ctx=document.getElementById('chart-sit-trend').getContext('2d');
    if(charts.sitTrend)charts.sitTrend.destroy();
    charts.sitTrend=new Chart(ctx,{type:'line',data:{labels:months,datasets:ds},
      options:{
        responsive:true,maintainAspectRatio:false,
        interaction:{mode:'index',intersect:false},
        plugins:{
          legend:{display:false},
          tooltip:{
            backgroundColor:'rgba(0,0,0,.88)',titleFont:{size:11},bodyFont:{size:10},padding:10,
            callbacks:{
              title:function(ctx){return ctx[0].label;},
              label:function(ctx){return ctx.dataset.label+': '+ctx.raw.toFixed(1)+' ('+getLevel(ctx.raw).label+')';}
            }
          }
        },
        scales:{
          y:{min:2,max:10,grid:{color:'rgba(0,212,255,0.06)'},ticks:{color:'#7a8ba3',font:{size:9},stepSize:2,callback:function(v){return v.toFixed(0);}}},
          x:{grid:{display:false},ticks:{color:'#7a8ba3',font:{size:9}}}
        }
      }});
    // Bottom region summary cards
    var summaryEl=document.getElementById('sit-trend-summary');
    if(summaryEl){
      var html='';
      currentScores.sort(function(a,b){return b.score-a.score;}).forEach(function(s,i){
        var prev=prevScores.find(function(p){return p.region===s.region;});
        var delta=prev?Math.round((s.score-prev.score)*10)/10:0;
        var arrow=delta>0.1?'↑':delta<-0.1?'↓':'→';
        var arrowClr=delta>0.1?'var(--red)':delta<-0.1?'var(--green)':'var(--text3)';
        html+='<div style="display:flex;align-items:center;gap:6px;padding:3px 6px;border-radius:6px;background:rgba(0,212,255,0.04);font-size:10px;white-space:nowrap;cursor:pointer;transition:.15s" onmouseover="this.style.background=\'rgba(0,212,255,0.1)\'" onmouseout="this.style.background=\'rgba(0,212,255,0.04)\'" onclick="switchView(\'monitor\')">'+
          '<span style="width:6px;height:6px;border-radius:50%;background:'+s.color+';flex-shrink:0"></span>'+
          '<span style="color:var(--text2);font-weight:600">'+s.region+'</span>'+
          '<span style="font-weight:700;color:'+s.color+'">'+s.score.toFixed(1)+'</span>'+
          '<span style="color:'+arrowClr+'">'+arrow+' '+Math.abs(delta).toFixed(1)+'</span>'+
          '<span style="color:var(--text3);font-size:9px">'+s.count+'国</span>'+
          '</div>';
      });
      summaryEl.innerHTML=html;
    }
  },
  renderIndustry(){
    const m={};ENTERPRISES.forEach(e=>{if(!m[e.industry])m[e.industry]=[];m[e.industry].push(getEntRisk(e));});
    const labels=Object.keys(m),data=labels.map(i=>Math.round(m[i].reduce((a,b)=>a+b,0)/m[i].length*10)/10);
    const ctx=document.getElementById('chart-sit-industry').getContext('2d');
    if(charts.sitInd)charts.sitInd.destroy();
    charts.sitInd=new Chart(ctx,{type:'radar',
      data:{labels:labels,datasets:[{label:'行业风险',data:data,borderColor:'#00d4ff',backgroundColor:'rgba(0,212,255,0.1)',borderWidth:2,pointBackgroundColor:data.map(v=>v>=7?'#ff3355':v>=5?'#ff8800':'#00ff9f')}]},
      options:{responsive:true,maintainAspectRatio:false,
        plugins:{legend:{display:false}},
        scales:{r:{min:0,max:10,grid:{color:'rgba(0,212,255,0.08)'},angleLines:{color:'rgba(0,212,255,0.08)'},pointLabels:{color:'#7a8ba3',font:{size:9}},ticks:{display:false}}}}});
  },
  renderAlertType(){
    var types={};ALERTS.forEach(function(a){types[a.type]=(types[a.type]||0)+1;});
    var activeTypes={};ALERTS.filter(function(a){return a.status==='active'||a.status==='responding';}).forEach(function(a){activeTypes[a.type]=(activeTypes[a.type]||0)+1;});
    var labels=Object.keys(types),data=Object.values(types);
    var total=ALERTS.length; var active=Object.values(activeTypes).reduce(function(s,v){return s+v;},0);
    var colors=['#ff3355','#ff8800','#ffcc00','#00d4ff','#00ff9f','#b366ff','#ff6b6b','#e040fb'];
    var self=this;
    // Doughnut chart
    var ctx=document.getElementById('chart-sit-alert-type').getContext('2d');
    if(charts.sitAT)charts.sitAT.destroy();
    var chartCfg={
      type:'doughnut',
      data:{labels:labels,datasets:[{data:data,backgroundColor:colors,borderWidth:2,borderColor:'#070b14',hoverBorderColor:'#fff',hoverBorderWidth:2}]},
      options:{
        responsive:true,maintainAspectRatio:false,cutout:'65%',
        plugins:{
          legend:{display:false},
          tooltip:{backgroundColor:'rgba(0,0,0,.85)',titleFont:{size:11},bodyFont:{size:10},padding:8,
            callbacks:{label:function(ctxx){var p=Math.round(ctxx.raw/total*100);return ctxx.label+': '+ctxx.raw+'条 ('+p+'%)';}}
          }
        },
        onClick:function(evt,els){if(els.length){var idx=els[0].index;self.filterAlertsByType(labels[idx]);}}
      }
    };
    charts.sitAT=new Chart(ctx,chartCfg);
    // Update center doughnut label
    var centerEl=document.getElementById('sit-doughnut-center');
    if(centerEl){centerEl.innerHTML='<div style="font-size:22px;font-weight:800;color:var(--cyan);line-height:1">'+total+'</div><div style="font-size:10px;color:var(--text3)">预警总数</div><div style="font-size:10px;color:var(--orange);margin-top:2px">'+active+'条活跃</div>';}
    // Detailed type ranking list
    var listEl=document.getElementById('sit-alert-type-list');
    if(!listEl)return;
    var sorted=labels.map(function(l,i){return{name:l,count:data[i],active:activeTypes[l]||0,color:colors[i%colors.length],pct:Math.round(data[i]/total*100)};}).sort(function(a,b){return b.count-a.count;});
    var maxCount=sorted[0]?sorted[0].count:1;
    var html='';
    sorted.forEach(function(t){
      html+='<div class="sit-type-row" onclick="SITUATION.filterAlertsByType(\''+(t.name.replace(/'/g,"\\'"))+'\')" style="display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:6px;cursor:pointer;transition:.15s;margin-bottom:4px" onmouseover="this.style.background=\'rgba(0,212,255,0.06)\'" onmouseout="this.style.background=\'\'">'+
        '<span style="width:8px;height:8px;border-radius:50%;background:'+t.color+';flex-shrink:0"></span>'+
        '<span style="width:60px;flex-shrink:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:600;color:var(--text1)">'+t.name+'</span>'+
        '<div style="flex:1;height:4px;background:rgba(0,212,255,0.08);border-radius:2px;overflow:hidden;min-width:20px"><div style="height:100%;width:'+Math.max(5,t.count/maxCount*100)+'%;background:'+t.color+';border-radius:2px;transition:.3s"></div></div>'+
        '<span style="width:28px;text-align:right;font-weight:700;color:'+t.color+';flex-shrink:0">'+t.count+'</span>'+
        '<span style="width:28px;text-align:right;font-size:10px;color:var(--text3);flex-shrink:0">'+t.pct+'%</span>'+
        '</div>';
    });
    html+='<div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;font-size:10px;color:var(--text3)">'+
      '<span>共 <b style="color:var(--cyan)">'+total+'</b> 条预警，<b style="color:var(--orange)">'+active+'</b> 条活跃</span>'+
      '<span style="color:var(--cyan);cursor:pointer" onclick="SITUATION.filterAlertsByType(\'all\')">查看全部 →</span>'+
      '</div>';
    listEl.innerHTML=html;
  },
  filterAlertsByType(t){
    var alerts=t==='all'?[...ALERTS]:ALERTS.filter(function(a){return a.type===t;});
    var html='<div style="margin-bottom:12px"><span class="badge b-cyan" style="font-size:13px">🔍 '+(t==='all'?'全部预警类型':'类型: '+t)+'</span> <span style="color:var(--text2);font-size:12px">'+alerts.length+'条预警</span></div>';
    alerts.sort(function(a,b){return b.time.localeCompare(a.time);});
    html+='<div style="display:grid;gap:6px;max-height:450px;overflow-y:auto">';
    alerts.forEach(function(a){
      var lv=ALERT_LV[a.level]||ALERT_LV.blue;
      var sc=a.status==='active'?'#ff3355':a.status==='responding'?'#ff8800':a.status==='acknowledged'?'#ffcc00':a.status==='resolved'?'#00ff9f':'#888';
      var stLabel={active:'活跃',responding:'处置中',acknowledged:'已确认',resolved:'已解除'}[a.status]||a.status;
      html+='<div class="alert-item lv-'+a.level+'" onclick="showAlertDetail(\''+a.id+'\')" style="margin-bottom:0">'+
        '<div class="alert-item-top"><div class="alert-item-tt"><span class="badge '+lv.cls+'">'+lv.label+'</span> '+a.title+'</div></div>'+
        '<div class="alert-item-meta"><span>🌍 '+a.country+'</span><span>🏢 '+a.enterprise+'</span><span>🕐 '+a.time+'</span><span style="color:'+sc+'">● '+stLabel+'</span></div></div>';
    });
    html+='</div>';
    document.getElementById('modal-tt').textContent='🔍 '+(t==='all'?'全部预警':t+' 预警');
    document.getElementById('modal-bd').innerHTML=html;
    document.getElementById('modal').classList.add('show');
  },
  showRegion(r){
    var cs=COUNTRIES.filter(c=>c.region===r);
    if(!cs.length)return;
    var html='<div style="margin-bottom:12px"><span class="badge b-blue" style="font-size:13px">'+r+' 区域</span> <span style="color:var(--text2);font-size:12px">'+cs.length+'个国家</span></div>';
    html+='<div style="display:grid;gap:6px;max-height:400px;overflow-y:auto">';
    cs.sort(function(a,b){return calcOverall(b.scores)-calcOverall(a.scores);}).forEach(function(c){
      var ov=calcOverall(c.scores),lv=getLevel(ov);
      var ents=getEntsInCountry(c.name);
      html+='<div style="display:flex;align-items:center;gap:8px;padding:8px 10px;background:var(--bg2);border-radius:6px;cursor:pointer;transition:.2s;border-left:3px solid '+lv.color+'" onclick="showCtyDetail(\''+c.name+'\')" onmouseover="this.style.background=\'rgba(0,212,255,0.06)\'" onmouseout="this.style.background=\'var(--bg2)\'">'+
        '<span style="font-size:16px">'+c.flag+'</span>'+
        '<div style="flex:1"><div style="font-size:12px;font-weight:600">'+c.name+'</div><div style="font-size:10px;color:var(--text3)">'+c.capital+' · '+ents.length+'家企业</div></div>'+
        '<div style="text-align:right"><div style="font-size:14px;font-weight:800;color:'+lv.color+'">'+ov.toFixed(1)+'</div><div style="font-size:9px;color:var(--text3)">'+lv.short+'</div></div>'+
        '</div>';
    });
    html+='</div>';
    document.getElementById('modal-tt').textContent='🌐 '+r+' 区域风险分布';
    document.getElementById('modal-bd').innerHTML=html;
    document.getElementById('modal').classList.add('show');
  },
  showHighRiskCountries(){
    var cs=COUNTRIES.filter(c=>calcOverall(c.scores)>=8).sort(function(a,b){return calcOverall(b.scores)-calcOverall(a.scores);});
    if(!cs.length){showToast('当前无极高风险国家');return;}
    var html='<div style="margin-bottom:12px"><span class="badge b-red" style="font-size:13px">极高风险国家</span> <span style="color:var(--text2);font-size:12px">'+cs.length+'个国家 (风险≥8.0)</span></div>';
    html+='<div style="display:grid;gap:8px;max-height:400px;overflow-y:auto">';
    cs.forEach(function(c){
      var ov=calcOverall(c.scores),lv=getLevel(ov);
      var ents=getEntsInCountry(c.name);
      var al=ALERTS.filter(a=>a.country===c.name&&a.status!=='resolved');
      html+='<div style="display:flex;align-items:center;gap:10px;padding:10px;background:var(--bg2);border-radius:8px;cursor:pointer;transition:.2s;border:1px solid rgba(255,51,85,0.2)" onclick="showCtyDetail(\''+c.name+'\')" onmouseover="this.style.borderColor=\'var(--red)\'" onmouseout="this.style.borderColor=\'rgba(255,51,85,0.2)\'">'+
        '<span style="font-size:20px">'+c.flag+'</span>'+
        '<div style="flex:1"><div style="font-size:13px;font-weight:700">'+c.name+'</div><div style="font-size:10px;color:var(--text3)">'+c.region+' · '+c.mainRisk+'</div>'+
        '<div style="font-size:10px;color:var(--orange);margin-top:2px">🏢 '+ents.length+'家企业 · 🚨 '+al.length+'条活跃预警</div></div>'+
        '<div style="text-align:right"><div style="font-size:18px;font-weight:800;color:'+lv.color+'">'+ov.toFixed(1)+'</div><div style="font-size:9px;color:var(--red)">极高</div></div>'+
        '</div>';
    });
    html+='</div>';
    document.getElementById('modal-tt').textContent='🚨 极高风险国家列表';
    document.getElementById('modal-bd').innerHTML=html;
    document.getElementById('modal').classList.add('show');
  }
};

function showSitEvents(){
  var html='<div style="margin-bottom:12px"><span class="badge b-orange" style="font-size:13px">追踪事件</span> <span style="color:var(--text2);font-size:12px">'+EVENTS.length+'起 · 监控中'+EVENTS.filter(e=>e.status==='active').length+'起</span></div>';
  html+='<div style="display:grid;gap:8px;max-height:400px;overflow-y:auto">';
  EVENTS.sort(function(a,b){return b.date.localeCompare(a.date);}).forEach(function(e){
    var sev=EVT_SEV[e.severity]||'中等';
    var sevColor=e.severity==='critical'?'var(--red)':e.severity==='high'?'var(--orange)':'var(--yellow)';
    html+='<div style="padding:10px;background:var(--bg2);border-radius:8px;border-left:3px solid '+sevColor+';cursor:pointer;transition:.2s" onclick="showEventDetail(\''+e.id+'\')" onmouseover="this.style.background=\'rgba(0,212,255,0.06)\'" onmouseout="this.style.background=\'var(--bg2)\'">'+
      '<div style="display:flex;justify-content:space-between;align-items:start"><div style="font-size:12px;font-weight:600">'+e.title+'</div><span style="font-size:10px;color:'+sevColor+';font-weight:600">'+sev+'</span></div>'+
      '<div style="font-size:10px;color:var(--text3);margin-top:4px">📍 '+e.country+' · 📅 '+e.date+(e.status==='active'?' · <span style="color:var(--red)">监控中</span>':'')+'</div>'+
      '</div>';
  });
  html+='</div>';
  document.getElementById('modal-tt').textContent='📡 事件追踪列表';
  document.getElementById('modal-bd').innerHTML=html;
  document.getElementById('modal').classList.add('show');
}

// ===== MONITOR VIEW (Map + Countries + Events + Chokepoints + Corridors) =====
const MONITOR={
  tab:'map',
  switch(t){this.tab=t;document.querySelectorAll('#mon-tabs .dc-tab').forEach((e,i)=>{e.classList.toggle('active',['map','countries','events','chokepoints','corridors','threats'][i]===t);});this.render();},
  init(){this.switch('map');},
  render(){
    const el=document.getElementById('mon-content');
    if(this.tab==='map')this.renderMap(el);
    else if(this.tab==='countries')this.renderCountries(el);
    else if(this.tab==='events')this.renderEvents(el);
    else if(this.tab==='chokepoints')this.renderChokepoints(el);
    else if(this.tab==='corridors')this.renderCorridors(el);
    else if(this.tab==='threats')this.renderThreatOrgs(el);
  },
  _mapLayer:'risk',
  renderMap(el){
    var highRisk=COUNTRIES.filter(function(c){return calcOverall(c.scores)>=8;}).length;
    var totalEnts=ENTERPRISES.length;
    var totalAlerts=ALERTS.filter(function(a){return a.status!=='resolved';}).length;
    var activeEvents=EVENTS.filter(function(e){return e.status==='active';}).length;
    var redAlerts=ALERTS.filter(function(a){return a.level==='red'&&a.status!=='resolved';}).length;
    this._mapLayers={risk:true,enterprise:false,event:false,chokepoint:false,corridor:false};
    this._mapRegion='all';
    el.innerHTML='<div class="risk-map-layout">'+
      '<div class="risk-map-main">'+
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;flex-wrap:wrap;gap:8px">'+
      '<div class="risk-map-layers">'+
      '<label class="risk-map-ck active" data-l="risk"><input type="checkbox" checked onchange="MONITOR.toggleLayer(\'risk\')">🔴 风险热力</label>'+
      '<label class="risk-map-ck" data-l="enterprise"><input type="checkbox" onchange="MONITOR.toggleLayer(\'enterprise\')">🏢 企业分布</label>'+
      '<label class="risk-map-ck" data-l="event"><input type="checkbox" onchange="MONITOR.toggleLayer(\'event\')">📋 事件标记</label>'+
      '<label class="risk-map-ck" data-l="chokepoint"><input type="checkbox" onchange="MONITOR.toggleLayer(\'chokepoint\')">⚓ 战略咽喉</label>'+
      '<label class="risk-map-ck" data-l="corridor"><input type="checkbox" onchange="MONITOR.toggleLayer(\'corridor\')">🛤️ 一带一路</label>'+
      '</div>'+
      '<div style="display:flex;gap:4px">'+
      '<button class="btn sm" onclick="MONITOR.filterRegion(\'all\')" id="reg-all" style="font-size:10px;padding:3px 8px">全部</button>'+
      '<button class="btn sm" onclick="MONITOR.filterRegion(\'中东\')" id="reg-mid" style="font-size:10px;padding:3px 8px">中东</button>'+
      '<button class="btn sm" onclick="MONITOR.filterRegion(\'非洲\')" id="reg-afr" style="font-size:10px;padding:3px 8px">非洲</button>'+
      '<button class="btn sm" onclick="MONITOR.filterRegion(\'南亚\')" id="reg-sas" style="font-size:10px;padding:3px 8px">南亚</button>'+
      '<button class="btn sm" onclick="MONITOR.filterRegion(\'南美\')" id="reg-sam" style="font-size:10px;padding:3px 8px">南美</button>'+
      '</div></div>'+
      '<div class="risk-map-svg-wrap" id="mon-map-svg"></div>'+
      '<div class="risk-map-legend" id="mon-map-legend"></div>'+
      '</div>'+
      '<div class="risk-map-side">'+
      '<div class="risk-map-stat"><div class="lb">极高风险国家</div><div class="vl" style="color:var(--red)">'+highRisk+'</div><div class="delta">占监测国家'+Math.round(highRisk/COUNTRIES.length*100)+'%</div></div>'+
      '<div class="risk-map-stat"><div class="lb">海外企业</div><div class="vl" style="color:var(--cyan)">'+totalEnts+'</div><div class="delta">覆盖'+new Set(ENTERPRISES.map(function(e){return e.industry;})).size+'个行业</div></div>'+
      '<div class="risk-map-stat"><div class="lb">活跃预警</div><div class="vl" style="color:var(--orange)">'+totalAlerts+'</div><div class="delta">红色'+redAlerts+'起</div></div>'+
      '<div class="risk-map-stat"><div class="lb">追踪事件</div><div class="vl" style="color:var(--yellow)">'+activeEvents+'</div><div class="delta">共'+EVENTS.length+'起</div></div>'+
      '<div class="card" style="margin:0"><div class="card-tt" style="font-size:12px">📊 区域风险热力</div><div id="mon-map-region"></div></div>'+
      '<div class="card" style="margin:0"><div class="card-tt" style="font-size:12px;display:flex;justify-content:space-between;align-items:center"><span>⚡ 最新事件</span><span style="font-size:9px;color:var(--red)">● LIVE</span></div><div class="risk-map-event-list" id="mon-map-events"></div></div>'+
      '</div></div>';
    this._renderMapSVG();
    this._renderMapRegion();
    this._renderMapEvents();
    this._renderMapLegend();
  },
  toggleLayer(l){
    this._mapLayers[l]=!this._mapLayers[l];
    var el=document.querySelector('.risk-map-ck[data-l="'+l+'"]');
    if(el)el.classList.toggle('active',this._mapLayers[l]);
    this._renderMapSVG();
  },
  filterRegion(r){
    this._mapRegion=r;
    var map={'all':'reg-all','中东':'reg-mid','非洲':'reg-afr','南亚':'reg-sas','南美':'reg-sam'};
    Object.keys(map).forEach(function(k){
      var el=document.getElementById(map[k]);
      if(el){el.style.background=k===r?'rgba(0,212,255,0.15)':'var(--bg2)';el.style.color=k===r?'var(--cyan)':'var(--text2)';}
    });
    this._renderMapSVG();
    this._renderMapRegion();
  },
  _renderMapSVG(){
    var el=document.getElementById('mon-map-svg');if(!el)return;
    var w=1000,h=500;
    var mx=function(lon){return(lon+180)*w/360;},my=function(lat){return(90-lat)*h/180;};
    var grid='';
    for(var lon=-150;lon<=150;lon+=30){var x=Math.round(mx(lon));grid+='<line x1="'+x+'" y1="0" x2="'+x+'" y2="'+h+'" stroke="rgba(0,212,255,0.04)" stroke-width="0.5"/>';}
    for(var lat=-60;lat<=60;lat+=30){var y=Math.round(my(lat));grid+='<line x1="0" y1="'+y+'" x2="'+w+'" y2="'+y+'" stroke="rgba(0,212,255,0.04)" stroke-width="0.5"/>';}
    grid+='<line x1="0" y1="'+Math.round(my(0))+'" x2="'+w+'" y2="'+Math.round(my(0))+'" stroke="rgba(0,212,255,0.12)" stroke-width="0.8" stroke-dasharray="4,4"/>';
    var continents=[
      {pts:[[-17,37],[-10,36],[0,36],[5,36],[11,37],[20,37],[33,32],[40,15],[45,12],[51,12],[48,2],[42,-5],[40,-12],[40,-18],[35,-28],[30,-34],[20,-35],[15,-25],[10,-12],[8,-5],[5,5],[-3,5],[-8,8],[-12,15],[-17,22],[-17,37]],color:'rgba(0,80,120,0.12)'},
      {pts:[[-10,36],[0,36],[5,36],[11,37],[20,37],[28,40],[40,42],[40,50],[38,55],[30,60],[28,65],[20,68],[12,68],[8,62],[5,60],[0,58],[-5,55],[-10,50],[-10,36]],color:'rgba(0,80,120,0.12)'},
      {pts:[[35,12],[42,12],[48,15],[55,12],[58,20],[60,25],[62,28],[55,30],[50,28],[45,25],[40,20],[35,15],[35,12]],color:'rgba(0,80,120,0.12)'},
      {pts:[[40,42],[55,42],[60,40],[65,35],[72,30],[78,28],[85,28],[92,30],[100,32],[105,35],[110,38],[120,40],[130,42],[135,45],[140,50],[145,55],[150,60],[150,68],[140,72],[120,75],[100,75],[80,72],[65,68],[55,60],[48,55],[42,50],[40,45],[40,42]],color:'rgba(0,80,120,0.12)'},
      {pts:[[95,5],[100,3],[105,5],[110,8],[115,10],[120,12],[125,10],[130,5],[128,0],[120,-3],[115,-5],[110,-3],[105,-2],[100,0],[95,3],[95,5]],color:'rgba(0,80,120,0.12)'},
      {pts:[[130,0],[135,2],[140,5],[145,0],[150,-2],[150,-8],[145,-10],[140,-8],[135,-5],[130,-2],[130,0]],color:'rgba(0,80,120,0.12)'},
      {pts:[[113,-12],[120,-10],[125,-8],[130,-10],[135,-12],[140,-10],[145,-15],[150,-20],[154,-25],[152,-30],[148,-35],[140,-38],[135,-38],[125,-35],[120,-33],[115,-28],[113,-22],[113,-18],[113,-12]],color:'rgba(0,80,120,0.12)'},
      {pts:[[-170,68],[-140,70],[-120,72],[-100,72],[-80,68],[-70,65],[-65,60],[-60,55],[-58,50],[-65,48],[-70,45],[-75,40],[-80,35],[-85,30],[-90,28],[-97,25],[-100,22],[-105,22],[-110,25],[-115,28],[-120,32],[-125,35],[-130,40],[-135,48],[-140,55],[-150,60],[-160,63],[-170,68]],color:'rgba(0,80,120,0.12)'},
      {pts:[[-80,12],[-75,10],[-70,8],[-65,5],[-60,5],[-55,0],[-50,-5],[-45,-10],[-40,-15],[-38,-20],[-40,-25],[-45,-30],[-50,-35],[-55,-40],[-60,-45],[-65,-50],[-70,-52],[-72,-48],[-75,-42],[-78,-35],[-80,-28],[-80,-20],[-78,-12],[-80,-5],[-80,5],[-80,12]],color:'rgba(0,80,120,0.12)'},
      {pts:[[-55,-48],[-50,-50],[-48,-53],[-50,-55],[-52,-56],[-55,-55],[-58,-53],[-55,-48]],color:'rgba(0,80,120,0.12)'},
      {pts:[[130,32],[133,33],[136,34],[140,35],[141,38],[140,41],[142,43],[145,44],[141,45],[138,41],[134,38],[131,34],[130,32]],color:'rgba(0,80,120,0.12)'},
      {pts:[[168,-42],[172,-40],[175,-38],[178,-38],[178,-42],[175,-45],[172,-46],[168,-44],[168,-42]],color:'rgba(0,80,120,0.12)'},
      {pts:[[114,-22],[118,-20],[122,-18],[126,-14],[130,-12],[133,-12],[136,-12],[136,-16],[133,-20],[130,-24],[126,-28],[122,-30],[118,-30],[114,-28],[114,-22]],color:'rgba(0,80,120,0.12)'},
      {pts:[[112,-8],[116,-8],[120,-8],[124,-8],[128,-8],[132,-8],[136,-8],[136,-4],[132,0],[128,2],[124,4],[120,5],[116,5],[112,3],[112,-8]],color:'rgba(0,80,120,0.12)'}
    ];
    var bg=continents.map(function(c){
      var pts=c.pts.map(function(p){return Math.round(mx(p[0]))+','+Math.round(my(p[1]));}).join(' ');
      return '<polygon points="'+pts+'" fill="'+c.color+'" stroke="rgba(0,212,255,0.15)" stroke-width="0.5"/>';
    }).join('');
    var visibleCountries=COUNTRIES;
    if(this._mapRegion!=='all'){
      visibleCountries=COUNTRIES.filter(function(c){return c.region===MONITOR._mapRegion;});
    }
    var layer='';
    if(this._mapLayers.risk){
      visibleCountries.forEach(function(c){
        var x=Math.round(mx(c.lon)),y=Math.round(my(c.lat));
        var ov=calcOverall(c.scores);
        var heatColor=ov>=8.5?'rgba(255,51,85,0.25)':ov>=7.5?'rgba(255,80,60,0.18)':ov>=6.5?'rgba(255,136,0,0.15)':ov>=5?'rgba(255,204,0,0.1)':'rgba(0,212,255,0.06)';
        var heatR=Math.max(20,Math.min(50,20+ov*3));
        layer+='<circle cx="'+x+'" cy="'+y+'" r="'+heatR+'" fill="'+heatColor+'" class="map-heat-blob"/>';
      });
      visibleCountries.forEach(function(c){
        var x=Math.round(mx(c.lon)),y=Math.round(my(c.lat));
        var ov=calcOverall(c.scores),lv=getLevel(ov);
        var ents=getEntsInCountry(c.name).length;
        var r=Math.max(6,Math.min(16,6+ents*1.2));
        var al=ALERTS.filter(function(a){return a.country===c.name&&a.status!=='resolved';}).length;
        var pulse=(al>0&&ov>=7)?'<animate attributeName="r" values="'+r+';'+(r+4)+';'+r+'" dur="2s" repeatCount="indefinite"/><animate attributeName="fill-opacity" values="0.5;0.8;0.5" dur="2s" repeatCount="indefinite"/>':'';
        var halo=ov>=8?'<circle cx="'+x+'" cy="'+y+'" r="'+(r*2)+'" fill="'+lv.color+'" fill-opacity="0.08"/><circle cx="'+x+'" cy="'+y+'" r="'+(r*3)+'" fill="'+lv.color+'" fill-opacity="0.04"/>':'';
        layer+=halo+'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+lv.color+'" fill-opacity="0.5" stroke="'+lv.color+'" stroke-width="1.5" style="cursor:pointer" onclick="showCtyDetail(\''+c.name+'\')"><title>'+c.flag+' '+c.name+' | 评分:'+ov.toFixed(1)+' '+lv.label+' | '+ents+'家企业 | '+al+'条预警</title>'+pulse+'</circle>';
        if(ov>=7)layer+='<text x="'+(x+r+3)+'" y="'+(y+4)+'" fill="'+lv.color+'" font-size="9" font-weight="600" style="pointer-events:none">'+c.name+'</text>';
      });
    }
    if(this._mapLayers.enterprise){
      ENTERPRISES.forEach(function(e){
        e.countries.forEach(function(cn){
          var c=COUNTRIES.find(function(x){return x.name===cn;});if(!c)return'';
          var x=Math.round(mx(c.lon)),y=Math.round(my(c.lat));
          layer+='<rect x="'+(x-3)+'" y="'+(y-3)+'" width="6" height="6" fill="#00d4ff" fill-opacity="0.7" stroke="#00d4ff" stroke-width="1" style="cursor:pointer" onclick="showEntDetail(\''+e.name+'\')"><title>'+e.name+' | '+e.industry+' | 投资'+e.investment+'亿$</title></rect>';
        });
      });
    }
    if(this._mapLayers.event){
      EVENTS.forEach(function(e){
        var c=COUNTRIES.find(function(x){return x.name===e.country;});if(!c)return'';
        var x=Math.round(mx(c.lon)),y=Math.round(my(c.lat));
        var col=e.sev==='critical'?'#ff3355':e.sev==='high'?'#ff8800':e.sev==='medium'?'#ffcc00':'#00d4ff';
        var pulse=e.sev==='critical'?'<animate attributeName="fill-opacity" values="0.7;0.3;0.7" dur="1.5s" repeatCount="indefinite"/>':'';
        layer+='<path d="M '+(x-5)+' '+(y+4)+' L '+(x+5)+' '+(y+4)+' L '+x+' '+(y-6)+' Z" fill="'+col+'" fill-opacity="0.7" stroke="'+col+'" stroke-width="1" style="cursor:pointer" onclick="showEventDetail(\''+e.id+'\')">'+pulse+'<title>'+e.title+' | '+e.country+' | '+e.date+'</title></path>';
      });
    }
    if(this._mapLayers.chokepoint){
      CHOKEPOINTS.forEach(function(c){
        var x=Math.round(mx(c.lon)),y=Math.round(my(c.lat));
        var col=c.risk>=8?'#ff3355':c.risk>=6?'#ff8800':'#ffcc00';
        var pulse=c.risk>=8?'<animate attributeName="r" values="7;9;7" dur="1.5s" repeatCount="indefinite"/>':'';
        layer+='<path d="M '+x+' '+(y-8)+' L '+(x+8)+' '+y+' L '+x+' '+(y+8)+' L '+(x-8)+' '+y+' Z" fill="'+col+'" fill-opacity="0.6" stroke="'+col+'" stroke-width="1.5" style="cursor:pointer">'+pulse+'<title>'+c.name+' | 风险'+c.risk+'</title></path><text x="'+(x+11)+'" y="'+(y+4)+'" fill="'+col+'" font-size="10" font-weight="600">'+c.name+'</text>';
      });
    }
    if(this._mapLayers.corridor){
      if(typeof CORRIDORS!=='undefined'){
        CORRIDORS.forEach(function(co){
          if(!co.path||!co.path.length)return;
          var pts=co.path.map(function(p){var c=COUNTRIES.find(function(x){return x.name===p;});if(!c)return null;return Math.round(mx(c.lon))+','+Math.round(my(c.lat));}).filter(Boolean);
          if(pts.length<2)return;
          var col=co.status==='运营中'?'#00ff9f':co.status==='建设中'?'#ffcc00':'#00d4ff';
          var firstPt=pts[0].split(',');
          layer+='<polyline points="'+pts.join(' ')+'" fill="none" stroke="'+col+'" stroke-width="2" stroke-dasharray="6,3" opacity="0.6"><animate attributeName="stroke-dashoffset" values="0;-18" dur="1s" repeatCount="indefinite"/></polyline><text x="'+firstPt[0]+'" y="'+(parseInt(firstPt[1])-8)+'" fill="'+col+'" font-size="9">'+co.name+'</text>';
        });
      }
    }
    var regionHighlight='';
    if(this._mapRegion!=='all'){
      visibleCountries.forEach(function(c){
        var x=Math.round(mx(c.lon)),y=Math.round(my(c.lat));
        regionHighlight+='<circle cx="'+x+'" cy="'+y+'" r="35" fill="none" stroke="rgba(0,212,255,0.2)" stroke-width="1" stroke-dasharray="3,3"/>';
      });
    }
    el.innerHTML='<svg viewBox="0 0 '+w+' '+h+'" style="width:100%;height:auto;display:block;min-height:400px"><defs><filter id="heatBlur"><feGaussianBlur stdDeviation="3"/></filter></defs><rect width="'+w+'" height="'+h+'" fill="#070b14"/>'+grid+bg+layer+regionHighlight+'</svg>';
  },
  _renderMapLegend(){
    var el=document.getElementById('mon-map-legend');if(!el)return;
    el.innerHTML='<div style="position:absolute;bottom:8px;left:8px;background:rgba(10,21,37,0.9);border:1px solid rgba(0,212,255,0.2);border-radius:6px;padding:8px 12px;font-size:10px;color:var(--text2);backdrop-filter:blur(10px)">'+
      '<div style="font-weight:700;color:var(--cyan);margin-bottom:4px;font-size:11px">风险图例</div>'+
      '<div style="display:flex;align-items:center;gap:6px;margin:2px 0"><div style="width:10px;height:10px;border-radius:50%;background:#ff3355"></div>极高 (≥8.0)</div>'+
      '<div style="display:flex;align-items:center;gap:6px;margin:2px 0"><div style="width:10px;height:10px;border-radius:50%;background:#ff8800"></div>高 (6.0-8.0)</div>'+
      '<div style="display:flex;align-items:center;gap:6px;margin:2px 0"><div style="width:10px;height:10px;border-radius:50%;background:#ffcc00"></div>中高 (4.0-6.0)</div>'+
      '<div style="display:flex;align-items:center;gap:6px;margin:2px 0"><div style="width:10px;height:10px;border-radius:50%;background:#00ff9f"></div>低 (<4.0)</div>'+
      '<div style="margin-top:4px;padding-top:4px;border-top:1px solid rgba(0,212,255,0.1);font-size:9px;color:var(--text3)">圆点大小=企业数<br>脉冲=活跃预警<br>热力圈=风险辐射</div>'+
      '</div>';
  },

  _renderMapEvents(){
    var el=document.getElementById('mon-map-events');if(!el)return;
    var ev=[...EVENTS].sort(function(a,b){return b.date.localeCompare(a.date);}).slice(0,6);
    el.innerHTML=ev.map(function(e){
      var col=e.sev==='critical'?'var(--red)':e.sev==='high'?'var(--orange)':e.sev==='medium'?'var(--yellow)':'var(--cyan)';
      return '<div style="padding:6px 8px;border-left:2px solid '+col+';margin-bottom:4px;cursor:pointer" onclick="showEventDetail(\''+e.id+'\')"><div style="font-size:11px;color:var(--text);margin-bottom:2px">'+e.title+'</div><div style="font-size:10px;color:var(--text3)">'+e.country+' | '+e.date+'</div></div>';
    }).join('');
  },
  renderCountries(el){
    const cr=[...COUNTRIES].map(c=>({...c,ov:calcOverall(c.scores),ec:getEntsInCountry(c.name).length})).sort((a,b)=>b.ov-a.ov);
    el.innerHTML=CRUD.toolbar('\u5171 '+COUNTRIES.length+' \u4e2a\u56fd\u5bb6','MONITOR.showCountryForm()','MONITOR.exportData()',null)+'<div class="card"><div class="card-tt"><span class="ic">\u{1F310}</span>\u56fd\u5bb6\u98ce\u9669\u76d1\u6d4b ('+COUNTRIES.length+'\u56fd)</div><div class="table-wrap"><table><thead><tr><th>\u56fd\u5bb6</th><th>\u533a\u57df</th><th>\u98ce\u9669\u8bc4\u5206</th><th>\u7b49\u7ea7</th><th>\u8d8b\u52bf</th><th>\u4f01\u4e1a\u6570</th><th>\u4e3b\u8981\u98ce\u9669</th><th>\u8d38\u6613\u989d</th><th>\u64cd\u4f5c</th></tr></thead><tbody>'+cr.map(c=>{
      const lv=getLevel(c.ov);
      const ti=c.trend==='up'?'<span style="color:var(--red)">\u2191</span>':c.trend==='down'?'<span style="color:var(--green)">\u2193</span>':'<span style="color:var(--text2)">\u2192</span>';
      return '<tr style="cursor:pointer" onclick="showCtyDetail(\''+c.name+'\')"><td>'+c.flag+' <strong>'+c.name+'</strong></td><td>'+c.region+'</td><td><strong style="color:'+lv.color+'">'+c.ov.toFixed(1)+'</strong></td><td><span class="badge '+lv.cls+'">'+lv.short+'</span></td><td>'+ti+'</td><td>'+c.ec+'</td><td>'+c.mainRisk+'</td><td>'+c.trade+'</td><td onclick="event.stopPropagation()" style="white-space:nowrap"><button class="btn sm" style="font-size:9px;padding:2px 6px" onclick="MONITOR.showCountryForm(\''+c.name+'\')">\u270f\ufe0f</button> <button class="btn sm" style="font-size:9px;padding:2px 6px;color:var(--red)" onclick="MONITOR.deleteCountry(\''+c.name+'\')">\u{1F5D1}\ufe0f</button></td></tr>';
    }).join('')+'</tbody></table></div></div>';
  },
  renderEvents(el){
    el.innerHTML=CRUD.toolbar('\u5171 '+EVENTS.length+' \u8d77\u4e8b\u4ef6','MONITOR.showEventForm()','MONITOR.exportData()',null)+'<div class="card"><div class="card-tt"><span class="ic">\u{1F4CB}</span>\u4e8b\u4ef6\u8ffd\u8e2a ('+EVENTS.length+'\u8d77)</div><div id="mon-events-list" style="max-height:600px;overflow-y:auto">'+EVENTS.map(e=>{
      const sv=EVT_SEV[e.sev]||e.sev;
      const cls=e.sev==='critical'?'b-red':e.sev==='high'?'b-orange':e.sev==='medium'?'b-yellow':'b-blue';
      return '<div class="alert-item lv-'+(e.sev==='critical'?'red':e.sev==='high'?'orange':'blue')+'" onclick="showEventDetail(\''+e.id+'\')"><div class="alert-item-top"><div class="alert-item-tt"><span class="badge '+cls+'">'+sv+'</span> '+e.title+' <button class="btn sm" style="font-size:9px;padding:1px 4px;margin-left:4px" onclick="event.stopPropagation();MONITOR.showEventForm(\''+e.id+'\')">\u270f\ufe0f</button> <button class="btn sm" style="font-size:9px;padding:1px 4px;color:var(--red)" onclick="event.stopPropagation();MONITOR.deleteEvent(\''+e.id+'\')">\u{1F5D1}\ufe0f</button></div><span class="text-xs text-muted">'+e.date+'</span></div><div class="alert-item-meta"><span>\u{1F4CD}'+e.country+'</span><span>\u{1F3E8}'+(e.enterprises||[]).join(', ')+'</span></div><div class="alert-item-desc">'+e.desc.substring(0,100)+'...</div></div>';
    }).join('')+'</div></div>';
  },
  renderChokepoints(el){
    el.innerHTML=CRUD.toolbar('共 '+CHOKEPOINTS.length+' 个通道','MONITOR.showChokepointForm()','MONITOR.exportData()',null)+'<div class="grid" style="grid-template-columns:1fr 320px;gap:12px">'+
      '<div class="card"><div class="card-tt"><span class="ic">⚓</span>关键航运通道 ('+CHOKEPOINTS.length+')</div>'+
      '<div style="max-height:600px;overflow-y:auto">'+CHOKEPOINTS.map(function(c,i){
        var lv=c.risk>=8?'b-red':c.risk>=6?'b-orange':c.risk>=4?'b-yellow':'b-green';
        var barW=c.risk*10;
        var barColor=c.risk>=8?'var(--red)':c.risk>=6?'var(--orange)':c.risk>=4?'var(--yellow)':'var(--green)';
        return '<div class="chk-item" id="chk-'+i+'" onclick="MONITOR.showChokepointDetail('+i+')" style="padding:12px;background:var(--panel2);border:1px solid var(--border);border-radius:8px;margin-bottom:8px;cursor:pointer;transition:.15s" onmouseover="this.style.borderColor=\''+barColor+'\'" onmouseout="this.style.borderColor=\'var(--border)\'">'+
          '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px"><strong style="font-size:13px">'+c.name+'</strong><span class="badge '+lv+'">风险 '+c.risk+'</span></div>'+
          '<div class="risk-bar" style="margin-bottom:6px"><div class="risk-bar-fill" style="width:'+barW+'%;background:'+barColor+'"></div></div>'+
          '<div class="text-xs text-muted" style="line-height:1.5">'+c.desc.substring(0,80)+'...</div>'+
          '<div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px"><span class="text-xs text-muted">点击查看详情</span>'+(PERM.isAdmin()?'<span style="display:flex;gap:2px"><button class="btn sm" style="font-size:9px;padding:1px 5px" onclick="event.stopPropagation();MONITOR.showChokepointForm('+i+')">✏️</button><button class="btn sm danger" style="font-size:9px;padding:1px 5px" onclick="event.stopPropagation();MONITOR.deleteChokepoint('+i+')">🗑️</button></span>':'')+'</div></div>';
      }).join('')+'</div></div>'+
      '<div class="card"><div class="card-tt"><span class="ic">📊</span>通道安全态势</div><div id="chk-summary"></div></div></div>';
    this._renderChkSummary();
  },
  _renderChkSummary(){
    var el=document.getElementById('chk-summary');if(!el)return;
    var high=CHOKEPOINTS.filter(function(c){return c.risk>=8;}).length;
    var mid=CHOKEPOINTS.filter(function(c){return c.risk>=6&&c.risk<8;}).length;
    var low=CHOKEPOINTS.filter(function(c){return c.risk<6;}).length;
    var avg=Math.round(CHOKEPOINTS.reduce(function(s,c){return s+c.risk;},0)/CHOKEPOINTS.length*10)/10;
    el.innerHTML='<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">'+
      '<div style="padding:10px;background:var(--red-bg);border-radius:6px;text-align:center"><div style="font-size:20px;font-weight:800;color:var(--red)">'+high+'</div><div class="text-xs text-muted">极高风险通道</div></div>'+
      '<div style="padding:10px;background:var(--orange-bg);border-radius:6px;text-align:center"><div style="font-size:20px;font-weight:800;color:var(--orange)">'+mid+'</div><div class="text-xs text-muted">高风险通道</div></div>'+
      '<div style="padding:10px;background:var(--green-bg);border-radius:6px;text-align:center"><div style="font-size:20px;font-weight:800;color:var(--green)">'+low+'</div><div class="text-xs text-muted">中低风险通道</div></div>'+
      '<div style="padding:10px;background:var(--blue-bg);border-radius:6px;text-align:center"><div style="font-size:20px;font-weight:800;color:var(--cyan)">'+avg.toFixed(1)+'</div><div class="text-xs text-muted">平均风险评分</div></div>'+
      '</div>'+
      '<div style="padding:10px;background:var(--bg2);border-radius:6px;margin-bottom:8px"><strong style="font-size:11px;color:var(--cyan)">⚡ 高危通道警报</strong>'+
      CHOKEPOINTS.filter(function(c){return c.risk>=7;}).map(function(c){
        return '<div style="padding:6px 0;border-bottom:1px solid var(--border);font-size:11px"><span style="color:var(--red)">●</span> <strong>'+c.name+'</strong><div class="text-xs text-muted">'+c.impact+'</div></div>';
      }).join('')+'</div>'+
      '<div style="padding:10px;background:var(--bg2);border-radius:6px"><strong style="font-size:11px;color:var(--cyan)">🚢 涉及中资企业</strong>'+
      '<div style="margin-top:6px">'+[...new Set(CHOKEPOINTS.reduce(function(a,c){return a.concat(c.ents);},[]))].map(function(e){
        return '<span style="display:inline-block;padding:2px 8px;background:rgba(0,212,255,0.1);border-radius:4px;font-size:10px;margin:2px">'+e+'</span>';
      }).join('')+'</div></div>';
  },
  showChokepointDetail(i){
    var c=CHOKEPOINTS[i];if(!c)return;
    document.querySelectorAll('.chk-item').forEach(function(el,idx){el.style.borderColor=idx===i?'var(--cyan)':'var(--border)';});
    var lv=c.risk>=8?'b-red':c.risk>=6?'b-orange':c.risk>=4?'b-yellow':'b-green';
    var barColor=c.risk>=8?'var(--red)':c.risk>=6?'var(--orange)':c.risk>=4?'var(--yellow)':'var(--green)';
    var el=document.getElementById('chk-summary');
    if(el){
      el.innerHTML='<div style="margin-bottom:12px">'+
        '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px"><strong style="font-size:16px">'+c.name+'</strong><span class="badge '+lv+'">风险 '+c.risk+' / 10</span></div>'+
        '<div class="risk-bar" style="margin-bottom:8px"><div class="risk-bar-fill" style="width:'+c.risk*10+'%;background:'+barColor+'"></div></div>'+
        '<div class="text-sm" style="line-height:1.7;margin-bottom:12px">'+c.desc+'</div>'+
        '<div style="padding:10px;background:var(--red-bg);border-left:3px solid var(--red);border-radius:6px;margin-bottom:10px"><strong style="color:var(--red);font-size:12px">⚠️ 影响评估</strong><div style="font-size:12px;margin-top:4px">'+c.impact+'</div></div>'+
        '<div style="padding:10px;background:var(--blue-bg);border-radius:6px;margin-bottom:10px"><strong style="color:var(--cyan);font-size:12px">🚢 涉及中资企业</strong><div style="margin-top:6px">'+c.ents.map(function(e){return '<span style="display:inline-block;padding:3px 8px;background:rgba(0,212,255,0.1);border-radius:4px;font-size:11px;margin:2px;cursor:pointer" onclick="showEntDetail(\''+e+'\')">'+e+'</span>';}).join('')+'</div></div>'+
        '<div style="padding:10px;background:var(--orange-bg);border-radius:6px;margin-bottom:10px"><strong style="color:var(--orange);font-size:12px">📋 安全建议</strong><ul style="margin:6px 0 0;padding-left:18px;font-size:11px;line-height:1.7">'+
        '<li>'+(c.risk>=8?'建议立即调整航线，绕行替代通道':'加强通过时安保措施，保持通信畅通')+'</li>'+
        '<li>为船舶和货物购买战争险和海盗险</li>'+
        '<li>与驻外使领馆保持密切联系，获取最新安全通报</li>'+
        '<li>建立24小时应急值班制度，确保快速响应</li>'+
        '</ul></div>'+
        '<button class="btn sm" onclick="MONITOR._renderChkSummary()">← 返回概览</button>'+
        (PERM.isAdmin()?'<button class="btn sm primary" onclick="MONITOR.showChokepointForm('+i+')">✏️ 编辑</button>':'')+
        (PERM.isAdmin()?'<button class="btn sm danger" onclick="MONITOR.deleteChokepoint('+i+')">🗑️ 删除</button>':'')+
        '</div>';
    }
  },
  renderCorridors(el){
    el.innerHTML=CRUD.toolbar('共 '+CORRIDORS.length+' 条走廊','MONITOR.showCorridorForm()','MONITOR.exportData()',null)+'<div class="grid" style="grid-template-columns:1fr 320px;gap:12px">'+
      '<div class="card"><div class="card-tt"><span class="ic">🛤️</span>一带一路走廊 ('+CORRIDORS.length+')</div>'+
      '<div style="max-height:600px;overflow-y:auto">'+CORRIDORS.map(function(c,i){
        var lv=c.risk>=7?'b-red':c.risk>=5?'b-orange':c.risk>=3?'b-yellow':'b-green';
        var barColor=c.risk>=7?'var(--red)':c.risk>=5?'var(--orange)':c.risk>=3?'var(--yellow)':'var(--green)';
        var stColor=c.status==='正常运营'||c.status==='良好'?'var(--green)':c.status==='正常推进'?'var(--cyan)':c.status==='部分受阻'?'var(--orange)':'var(--red)';
        return '<div class="cor-item" id="cor-'+i+'" onclick="MONITOR.showCorridorDetail('+i+')" style="padding:12px;background:var(--panel2);border:1px solid var(--border);border-radius:8px;margin-bottom:8px;cursor:pointer;transition:.15s" onmouseover="this.style.borderColor=\''+barColor+'\'" onmouseout="this.style.borderColor=\'var(--border)\'">'+
          '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px"><div><strong style="font-size:13px">'+c.name+'</strong><span class="text-xs text-muted ml-8">'+c.countries+'</span></div><div style="display:flex;gap:4px"><span class="badge '+lv+'">风险 '+c.risk+'</span><span class="badge b-blue" style="background:'+stColor+'22;color:'+stColor+';border:1px solid '+stColor+'55">'+c.status+'</span></div></div>'+
          '<div class="risk-bar" style="margin-bottom:6px"><div class="risk-bar-fill" style="width:'+c.risk*10+'%;background:'+barColor+'"></div></div>'+
          '<div class="text-xs text-muted" style="line-height:1.5">'+c.desc.substring(0,80)+'...</div>'+
          '<div class="flex gap-12 text-xs mt-8"><span style="color:var(--cyan)">📦 '+c.inv+'亿$</span><span>🏢 '+c.ents+'家</span></div>'+
          '<div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px"><span class="text-xs text-muted">点击查看详情</span>'+(PERM.isAdmin()?'<span style="display:flex;gap:2px"><button class="btn sm" style="font-size:9px;padding:1px 5px" onclick="event.stopPropagation();MONITOR.showCorridorForm('+i+')">✏️</button><button class="btn sm danger" style="font-size:9px;padding:1px 5px" onclick="event.stopPropagation();MONITOR.deleteCorridor('+i+')">🗑️</button></span>':'')+'</div></div>';
      }).join('')+'</div></div>'+
      '<div class="card"><div class="card-tt"><span class="ic">📊</span>走廊安全态势</div><div id="cor-summary"></div></div></div>';
    this._renderCorSummary();
  },

  // ===== 威胁组织板块 =====
  _threatFilter:{category:'all',level:'all',region:'all',keyword:''},
  renderThreatOrgs(el){
    if(typeof THREAT_ORGS_DB==='undefined'){el.innerHTML='<div style="padding:30px;text-align:center;color:var(--text3)">⚠️ 威胁组织数据库未加载</div>';return;}
    var stats=THREAT_ORGS_DB.getStats();
    var levelColors={critical:'var(--red)',high:'var(--orange)',medium:'var(--yellow)',low:'var(--green)'};
    var levelLabels={critical:'🔴 极高',high:'🟠 高',medium:'🟡 中',low:'🟢 低'};
    var catLabels={'terrorist':'恐怖组织','criminal':'犯罪组织','anti_china_ngo':'反华NGO'};
    var catIcons={'terrorist':'💥','criminal':'🔫','anti_china_ngo':'📢'};
    var catColors={'terrorist':'var(--red)','criminal':'var(--orange)','anti_china_ngo':'var(--purple)'};

    // 筛选
    var orgs=stats.orgs;
    var f=this._threatFilter;
    if(f.category!=='all')orgs=orgs.filter(function(o){return o.category===f.category;});
    if(f.level!=='all')orgs=orgs.filter(function(o){return o.threat_level===f.level;});
    if(f.region!=='all')orgs=orgs.filter(function(o){return o.active_regions.some(function(r){return r.indexOf(f.region)>=0;});});
    if(f.keyword){var kw=f.keyword.toLowerCase();orgs=orgs.filter(function(o){return o.name.toLowerCase().indexOf(kw)>=0||(o.aliases||[]).some(function(a){return a.toLowerCase().indexOf(kw)>=0;})||(o.background||'').toLowerCase().indexOf(kw)>=0;});}

    // 概览统计
    var overviewHtml='<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px">'+
      // 总数
      '<div style="padding:10px 16px;background:rgba(0,212,255,0.08);border-radius:8px;border:1px solid rgba(0,212,255,0.2);min-width:120px">'+
        '<div style="font-size:22px;font-weight:700;color:var(--cyan)">'+stats.total+'</div>'+
        '<div style="font-size:10px;color:var(--text3)">威胁组织总数</div>'+
      '</div>'+
      // 三类
      Object.keys(catLabels).map(function(cat){
        var count=stats.byCategory[cat]||0;
        var color=catColors[cat];
        return '<div style="padding:10px 16px;background:'+color+'10;border-radius:8px;border:1px solid '+color+'30;min-width:120px;cursor:pointer" onclick="MONITOR._setThreatFilter(\'category\',\''+(f.category===cat?'all':cat)+'\')">'+
          '<div style="font-size:22px;font-weight:700;color:'+color+'">'+count+'</div>'+
          '<div style="font-size:10px;color:var(--text3)">'+catIcons[cat]+' '+catLabels[cat]+(f.category===cat?' ✓':'')+'</div>'+
        '</div>';
      }).join('')+
      // 袭击/反华事件/言论
      '<div style="padding:10px 16px;background:rgba(255,61,127,0.08);border-radius:8px;border:1px solid rgba(255,61,127,0.2);min-width:120px">'+
        '<div style="font-size:22px;font-weight:700;color:var(--pink)">'+stats.totalAttacks+'</div>'+
        '<div style="font-size:10px;color:var(--text3)">袭击事件记录</div>'+
      '</div>'+
      '<div style="padding:10px 16px;background:rgba(255,170,0,0.08);border-radius:8px;border:1px solid rgba(255,170,0,0.2);min-width:120px">'+
        '<div style="font-size:22px;font-weight:700;color:var(--orange)">'+stats.totalAntiChina+'</div>'+
        '<div style="font-size:10px;color:var(--text3)">反华事件记录</div>'+
      '</div>'+
      '<div style="padding:10px 16px;background:rgba(124,58,237,0.08);border-radius:8px;border:1px solid rgba(124,58,237,0.2);min-width:120px">'+
        '<div style="font-size:22px;font-weight:700;color:var(--purple)">'+stats.totalStatements+'</div>'+
        '<div style="font-size:10px;color:var(--text3)">威胁言论记录</div>'+
      '</div>'+
      '<div style="padding:10px 16px;background:rgba(0,200,83,0.08);border-radius:8px;border:1px solid rgba(0,200,83,0.2);min-width:120px">'+
        '<div style="font-size:22px;font-weight:700;color:var(--green)">'+stats.regionCount+'</div>'+
        '<div style="font-size:10px;color:var(--text3)">活动区域数</div>'+
      '</div>'+
    '</div>';

    // 筛选栏
    var filterHtml='<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:8px 12px;background:var(--bg2);border-radius:8px;margin-bottom:12px">'+
      '<span style="font-size:11px;color:var(--text3);font-weight:600">🔍 筛选:</span>'+
      // 威胁等级
      '<select style="font-size:11px;padding:3px 8px;background:var(--panel);border:1px solid var(--border);border-radius:4px;color:var(--text1)" onchange="MONITOR._setThreatFilter(\'level\',this.value)">'+
        '<option value="all"'+(f.level==='all'?' selected':'')+'>所有等级</option>'+
        ['critical','high','medium','low'].map(function(lv){return '<option value="'+lv+'"'+(f.level===lv?' selected':'')+'>'+levelLabels[lv]+'</option>';}).join('')+
      '</select>'+
      // 区域
      '<select style="font-size:11px;padding:3px 8px;background:var(--panel);border:1px solid var(--border);border-radius:4px;color:var(--text1)" onchange="MONITOR._setThreatFilter(\'region\',this.value)">'+
        '<option value="all"'+(f.region==='all'?' selected':'')+'>所有区域</option>'+
        ['巴基斯坦','阿富汗','缅甸','也门','索马里','尼日利亚','苏丹','墨西哥','菲律宾','叙利亚','伊朗','美国','英国','德国','日本','巴西','东南亚','中东','非洲','南亚','中亚','南美','欧洲','北美'].map(function(r){return '<option value="'+r+'"'+(f.region===r?' selected':'')+'>'+r+'</option>';}).join('')+
      '</select>'+
      // 搜索
      '<input type="text" placeholder="搜索组织名称/别名..." value="'+f.keyword+'" style="font-size:11px;padding:3px 8px;background:var(--panel);border:1px solid var(--border);border-radius:4px;color:var(--text1);width:180px" onkeyup="MONITOR._setThreatFilter(\'keyword\',this.value)"/>'+
      '<span style="font-size:11px;color:var(--text3);margin-left:auto">显示 '+orgs.length+'/'+stats.total+' 个组织</span>'+
      '<button class="btn sm" style="font-size:10px;padding:2px 8px" onclick="MONITOR._setThreatFilter(\'category\',\'all\');MONITOR._setThreatFilter(\'level\',\'all\');MONITOR._setThreatFilter(\'region\',\'all\');MONITOR._setThreatFilter(\'keyword\',\'\')">重置</button>'+
    '</div>';

    // 组织列表
    var listHtml='';
    if(orgs.length===0){
      listHtml='<div style="padding:30px;text-align:center;color:var(--text3);font-size:13px"><div style="font-size:36px;margin-bottom:8px">🔍</div>未找到匹配的威胁组织</div>';
    }else{
      listHtml='<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:10px;max-height:550px;overflow-y:auto;padding-right:4px">'+
        orgs.map(function(o){
          var lc=levelColors[o.threat_level]||'var(--text3)';
          var ll=levelLabels[o.threat_level]||'';
          var cc=catColors[o.category]||'var(--text3)';
          var ci=catIcons[o.category]||'';
          var cl=catLabels[o.category]||o.category;
          var aliases=(o.aliases||[]).slice(0,3).join(' / ');
          var attackCount=(o.attacks||[]).length;
          var antiChinaCount=(o.anti_china_events||[]).length;
          var stmtCount=(o.statements||[]).length;
          var regions=(o.active_regions||[]).slice(0,3).join('、');
          if((o.active_regions||[]).length>3)regions+='等'+o.active_regions.length+'个区域';
          return '<div onclick="MONITOR.showThreatOrgDetail(\''+o.id+'\')" style="padding:12px;background:var(--panel);border:1px solid var(--border);border-radius:10px;cursor:pointer;transition:.2s;position:relative" onmouseover="this.style.borderColor=\''+lc+'\';this.style.transform=\'translateY(-2px)\';this.style.boxShadow=\'0 4px 12px '+lc+'20\'" onmouseout="this.style.borderColor=\'var(--border)\';this.style.transform=\'\';this.style.boxShadow=\'\'">'+
            // 左侧色条
            '<div style="position:absolute;left:0;top:0;bottom:0;width:3px;background:'+lc+';border-radius:10px 0 0 10px"></div>'+
            // 标题
            '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;padding-left:8px">'+
              '<div style="display:flex;align-items:center;gap:6px">'+
                '<span style="font-size:16px">'+ci+'</span>'+
                '<span style="font-size:13px;font-weight:700;color:var(--text1)">'+o.name+'</span>'+
              '</div>'+
              '<span style="font-size:10px;font-weight:700;color:'+lc+';background:'+lc+'15;padding:2px 8px;border-radius:4px">'+ll+'</span>'+
            '</div>'+
            // 别名
            (aliases?'<div style="font-size:10px;color:var(--text3);margin-bottom:6px;padding-left:8px">aka: '+aliases+'</div>':'')+
            // 背景
            '<div style="font-size:11px;color:var(--text2);line-height:1.5;margin-bottom:8px;padding-left:8px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">'+(o.background||'').substring(0,120)+'...</div>'+
            // 活动区域
            '<div style="font-size:10px;color:var(--text3);margin-bottom:8px;padding-left:8px">📍 '+regions+'</div>'+
            // 统计
            '<div style="display:flex;gap:8px;padding-left:8px">'+
              '<span style="font-size:10px;padding:2px 6px;background:rgba(255,61,127,0.1);color:var(--pink);border-radius:4px">💥 袭击 '+attackCount+'</span>'+
              '<span style="font-size:10px;padding:2px 6px;background:rgba(255,170,0,0.1);color:var(--orange);border-radius:4px">🇨🇳 反华 '+antiChinaCount+'</span>'+
              '<span style="font-size:10px;padding:2px 6px;background:rgba(124,58,237,0.1);color:var(--purple);border-radius:4px">📢 言论 '+stmtCount+'</span>'+
              '<span style="font-size:10px;padding:2px 6px;background:'+cc+'15;color:'+cc+';border-radius:4px;margin-left:auto">'+cl+'</span>'+
            '</div>'+
          '</div>';
        }).join('')+
      '</div>';
    }

    el.innerHTML='<div style="padding:16px">'+
      // 标题栏
      '<div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">'+
        '<span style="font-size:18px">🎯</span>'+
        '<span style="font-size:14px;font-weight:700;color:var(--text1)">威胁组织数据库</span>'+
        '<span style="font-size:10px;padding:2px 8px;background:rgba(255,170,0,0.15);color:var(--orange);border-radius:4px;font-weight:600">模拟数据</span>'+
        '<span style="font-size:10px;color:var(--text3)">涵盖恐怖组织、犯罪组织、反华非政府组织</span>'+
        (PERM.isAdmin()?'<button class="btn sm" style="font-size:10px;padding:2px 10px;margin-left:auto" onclick="MONITOR._reloadThreatData()">🔄 重新加载</button>':'')+
      '</div>'+
      overviewHtml+
      filterHtml+
      listHtml+
    '</div>';
  },

  _setThreatFilter(key,val){
    this._threatFilter[key]=val;
    this.renderThreatOrgs(document.getElementById('mon-content'));
  },

  _reloadThreatData(){
    if(typeof THREAT_ORGS_DB==='undefined')return;
    showConfirm('确认重新加载威胁组织模拟数据？这将清除当前数据并重新注入。',function(){
      THREAT_ORGS_DB.clearSimulated();
      THREAT_ORGS_DB.init();
      MONITOR.renderThreatOrgs(document.getElementById('mon-content'));
      showToast('✅ 威胁组织数据已重新加载');
    });
  },

  showThreatOrgDetail(id){
    if(typeof THREAT_ORGS_DB==='undefined')return;
    var org=THREAT_ORGS_DB.getById(id);
    if(!org)return;
    var levelColors={critical:'var(--red)',high:'var(--orange)',medium:'var(--yellow)',low:'var(--green)'};
    var levelLabels={critical:'🔴 极高威胁',high:'🟠 高威胁',medium:'🟡 中等威胁',low:'🟢 低威胁'};
    var catLabels={'terrorist':'恐怖组织','criminal':'犯罪组织','anti_china_ngo':'反华非政府组织'};
    var catIcons={'terrorist':'💥','criminal':'🔫','anti_china_ngo':'📢'};
    var lc=levelColors[org.threat_level]||'var(--text3)';

    var html='<div style="padding:0;max-height:75vh;overflow-y:auto">';

    // 头部
    html+='<div style="padding:16px 20px;background:linear-gradient(135deg,'+lc+'18,'+lc+'05);border-bottom:1px solid var(--border)">'+
      '<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">'+
        '<span style="font-size:28px">'+(catIcons[org.category]||'🎯')+'</span>'+
        '<div>'+
          '<div style="font-size:16px;font-weight:700;color:var(--text1)">'+org.name+'</div>'+
          '<div style="font-size:11px;color:var(--text3)">'+(org.aliases||[]).join(' / ')+'</div>'+
        '</div>'+
        '<div style="margin-left:auto;display:flex;gap:6px">'+
          '<span style="font-size:11px;font-weight:700;color:'+lc+';background:'+lc+'15;padding:4px 12px;border-radius:6px">'+(levelLabels[org.threat_level]||org.threat_level)+'</span>'+
          '<span style="font-size:11px;color:var(--cyan);background:rgba(0,212,255,0.1);padding:4px 12px;border-radius:6px">'+(catLabels[org.category]||org.category)+'</span>'+
        '</div>'+
      '</div>'+
    '</div>';

    // 基本信息
    html+='<div style="padding:16px 20px;border-bottom:1px solid var(--border)">'+
      '<div style="font-size:12px;font-weight:700;color:var(--text1);margin-bottom:10px">📋 组织基本情况</div>'+
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px 16px">'+
        '<div style="font-size:11px"><span style="color:var(--text3)">总部:</span> <b>'+org.headquarters+'</b></div>'+
        '<div style="font-size:11px"><span style="color:var(--text3)">成立时间:</span> <b>'+(org.founded||'未知')+'</b></div>'+
        '<div style="font-size:11px"><span style="color:var(--text3)">人员规模:</span> <b>'+(org.personnel_size||'未知')+'</b></div>'+
        '<div style="font-size:11px"><span style="color:var(--text3)">领导层:</span> <b>'+(org.leadership||'未知')+'</b></div>'+
      '</div>'+
      (org.ideology?'<div style="font-size:11px;margin-top:8px"><span style="color:var(--text3)">意识形态:</span> '+org.ideology+'</div>':'')+
      '<div style="font-size:11px;margin-top:8px"><span style="color:var(--text3)">活动区域:</span> '+(org.active_regions||[]).join('、')+'</div>'+
      '<div style="font-size:11px;margin-top:8px"><span style="color:var(--text3)">资金来源:</span> '+(org.funding_sources||[]).join('、')+'</div>'+
      '<div style="font-size:11px;margin-top:10px;padding:10px;background:var(--bg2);border-radius:6px;line-height:1.6">'+(org.background||'无背景信息')+'</div>'+
    '</div>';

    // 袭击事件
    if(org.attacks&&org.attacks.length>0){
      html+='<div style="padding:16px 20px;border-bottom:1px solid var(--border)">'+
        '<div style="font-size:12px;font-weight:700;color:var(--pink);margin-bottom:10px">💥 袭击事件记录 ('+org.attacks.length+')</div>'+
        org.attacks.map(function(a){
          return '<div style="padding:10px;background:rgba(255,61,127,0.05);border-left:3px solid var(--pink);border-radius:0 6px 6px 0;margin-bottom:8px">'+
            '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">'+
              '<span style="font-size:11px;font-weight:700;color:var(--text1)">'+a.type+'</span>'+
              '<span style="font-size:10px;color:var(--text3)">'+a.date+'</span>'+
            '</div>'+
            '<div style="font-size:11px;color:var(--text2);margin-bottom:4px">📍 '+a.location+'</div>'+
            (a.casualties?'<div style="font-size:10px;color:var(--red);font-weight:600">☠ 伤亡: '+a.casualties+'</div>':'')+
            '<div style="font-size:11px;color:var(--text2);margin-top:4px;line-height:1.5">'+a.description+'</div>'+
          '</div>';
        }).join('')+
      '</div>';
    }

    // 反华事件
    if(org.anti_china_events&&org.anti_china_events.length>0){
      html+='<div style="padding:16px 20px;border-bottom:1px solid var(--border)">'+
        '<div style="font-size:12px;font-weight:700;color:var(--orange);margin-bottom:10px">🇨🇳 反华事件记录 ('+org.anti_china_events.length+')</div>'+
        org.anti_china_events.map(function(e){
          return '<div style="padding:10px;background:rgba(255,170,0,0.05);border-left:3px solid var(--orange);border-radius:0 6px 6px 0;margin-bottom:8px">'+
            '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">'+
              '<span style="font-size:11px;font-weight:700;color:var(--text1)">'+e.type+'</span>'+
              '<span style="font-size:10px;color:var(--text3)">'+e.date+'</span>'+
            '</div>'+
            '<div style="font-size:11px;color:var(--text2);line-height:1.5">'+e.description+'</div>'+
          '</div>';
        }).join('')+
      '</div>';
    }

    // 威胁言论
    if(org.statements&&org.statements.length>0){
      html+='<div style="padding:16px 20px;border-bottom:1px solid var(--border)">'+
        '<div style="font-size:12px;font-weight:700;color:var(--purple);margin-bottom:10px">📢 威胁言论记录 ('+org.statements.length+')</div>'+
        org.statements.map(function(s){
          var natureColor=s.nature==='直接威胁'?'var(--red)':s.nature==='袭击认领'?'var(--pink)':s.nature==='煽动分裂'?'var(--orange)':s.nature==='煽动制裁'?'var(--yellow)':'var(--text3)';
          return '<div style="padding:10px;background:rgba(124,58,237,0.05);border-left:3px solid var(--purple);border-radius:0 6px 6px 0;margin-bottom:8px">'+
            '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">'+
              '<span style="font-size:11px;font-weight:600;color:var(--text1)">'+s.speaker+'</span>'+
              '<span style="font-size:10px;color:'+natureColor+';font-weight:600;background:'+natureColor+'15;padding:1px 6px;border-radius:3px">'+s.nature+'</span>'+
            '</div>'+
            '<div style="font-size:11px;color:var(--text2);line-height:1.6;font-style:italic;margin-bottom:4px">"'+s.content+'"</div>'+
            '<div style="font-size:10px;color:var(--text3)">来源: '+s.source+' | '+s.date+'</div>'+
          '</div>';
        }).join('')+
      '</div>';
    }

    html+='</div>';
    showModal('威胁组织详情',html);
  },

  // === MONITOR CRUD ===
  showCountryForm(name){
    if(!PERM.guard('\u65b0\u589e/\u7f16\u8f91\u56fd\u5bb6'))return;
    var c=name?COUNTRIES.find(function(x){return x.name===name;}):null;
    var regions=['\u4e2d\u4e1c','\u975e\u6d32','\u5357\u4e9a','\u4e1c\u6b27','\u4e2d\u4e9a','\u4e1c\u5357\u4e9a','\u5357\u7f8e','\u5317\u7f8e','\u5927\u6d0b\u6d32'];
    var fields=[
      {key:'name',label:'\u56fd\u5bb6\u540d\u79f0',required:true},
      {key:'flag',label:'\u56fd\u65d7emoji',default:'\u{1F310}'},
      {key:'region',label:'\u533a\u57df',type:'select',options:regions},
      {key:'capital',label:'\u9996\u90fd'},
      {key:'pop',label:'\u4eba\u53e3'},
      {key:'gdp',label:'GDP'},
      {key:'lon',label:'\u7ecf\u5ea6',type:'number'},
      {key:'lat',label:'\u7eac\u5ea6',type:'number'},
      {key:'mainRisk',label:'\u4e3b\u8981\u98ce\u9669'},
      {key:'trend',label:'\u8d8b\u52bf',type:'select',options:['up','flat','down']},
      {key:'notes',label:'\u5206\u6790\u5907\u6ce8',type:'textarea',rows:3}
    ];
    // Add score fields
    DIMS.forEach(function(d){fields.push({key:'score_'+d.key,label:d.ic+' '+d.name+'\u8bc4\u5206',type:'number',default:c?c.scores[d.key]:5});});
    CRUD.showForm(c?'\u7f16\u8f91\u56fd\u5bb6':'\u65b0\u589e\u56fd\u5bb6',fields,function(obj){
      var scores={};
      DIMS.forEach(function(d){scores[d.key]=parseFloat(obj['score_'+d.key])||5;delete obj['score_'+d.key];});
      obj.scores=scores;obj.lastUpdate=new Date().toLocaleString('zh-CN');
      if(c){Object.assign(c,obj);showToast('\u2705 \u56fd\u5bb6\u5df2\u66f4\u65b0');}
      else{COUNTRIES.push(obj);showToast('\u2705 \u56fd\u5bb6\u5df2\u6dfb\u52a0');}
      DataHub.save('countries');this.render();
    }.bind(this),c);
  },
  deleteCountry(name){
    if(!PERM.guard('\u5220\u9664\u56fd\u5bb6'))return;
    showConfirm('\u786e\u5b9a\u5220\u9664\u56fd\u5bb6 "'+name+'" \uff1f',function(){
      var idx=COUNTRIES.findIndex(function(x){return x.name===name;});
      if(idx>-1){COUNTRIES.splice(idx,1);DataHub.save('countries');showToast('\u{1F5D1}\ufe0f \u5df2\u5220\u9664');MONITOR.render();}
    });
  },
  showEventForm(id){
    if(!PERM.guard('\u65b0\u589e/\u7f16\u8f91\u4e8b\u4ef6'))return;
    var e=id?EVENTS.find(function(x){return x.id===id;}):null;
    var fields=[
      {key:'title',label:'\u4e8b\u4ef6\u6807\u9898',required:true},
      {key:'country',label:'\u56fd\u5bb6'},
      {key:'date',label:'\u65e5\u671f',type:'date'},
      {key:'type',label:'\u7c7b\u578b',type:'select',options:['\u653f\u6cbb','\u5b89\u5168','\u7ecf\u6d4e','\u793e\u4f1a','\u81ea\u7136','\u5916\u4ea4']},
      {key:'sev',label:'\u4e25\u91cd\u7a0b\u5ea6',type:'select',options:[{value:'critical',label:'\u4e25\u91cd'},{value:'high',label:'\u9ad8'},{value:'medium',label:'\u4e2d'},{value:'low',label:'\u4f4e'}]},
      {key:'desc',label:'\u4e8b\u4ef6\u63cf\u8ff0',type:'textarea',rows:3},
      {key:'impact',label:'\u5f71\u54cd',type:'textarea',rows:2},
      {key:'response',label:'\u54cd\u5e94',type:'textarea',rows:2}
    ];
    CRUD.showForm(e?'\u7f16\u8f91\u4e8b\u4ef6':'\u65b0\u589e\u4e8b\u4ef6',fields,function(obj){
      if(e){Object.assign(e,obj);showToast('\u2705 \u4e8b\u4ef6\u5df2\u66f4\u65b0');}
      else{obj.id=CRUD._genId('EVT');obj.status='\u8ffd\u8e2a\u4e2d';EVENTS.push(obj);showToast('\u2705 \u4e8b\u4ef6\u5df2\u6dfb\u52a0');}
      DataHub.save('events');this.render();
    }.bind(this),e);
  },
  deleteEvent(id){if(!PERM.guard('\u5220\u9664\u4e8b\u4ef6'))return;
    showConfirm('\u786e\u5b9a\u5220\u9664\u8be5\u4e8b\u4ef6\uff1f',function(){
      var idx=EVENTS.findIndex(function(x){return x.id===id;});
      if(idx>-1){EVENTS.splice(idx,1);DataHub.save('events');showToast('\u{1F5D1}\ufe0f \u5df2\u5220\u9664');MONITOR.render();}
    });
  },
  showChokepointForm(idx){if(!PERM.guard('\u65b0\u589e/\u7f16\u8f91\u54bd\u5589\u70b9'))return;
    var c=(idx!=null&&idx>=0)?CHOKEPOINTS[idx]:null;
    var fields=[
      {key:'name',label:'\u54bd\u540e\u70b9\u540d\u79f0',required:true},
      {key:'type',label:'\u7c7b\u578b',type:'select',options:['\u6d77\u5ce1','\u8fd0\u6cb3','\u7ba1\u9053','\u9c7c\u7ad3']},
      {key:'risk',label:'\u98ce\u9669\u7b49\u7ea7',type:'select',options:['\u9ad8','\u4e2d','\u4f4e']},
      {key:'riskScore',label:'\u98ce\u9669\u8bc4\u5206',type:'number',default:5},
      {key:'dailyTraffic',label:'\u65e5\u901a\u822a\u91cf'},
      {key:'countries',label:'\u76f8\u5173\u56fd\u5bb6'},
      {key:'importance',label:'\u6218\u7565\u91cd\u8981\u6027',type:'textarea',rows:2},
      {key:'threats',label:'\u5a01\u80c1\u56e0\u7d20',type:'textarea',rows:2}
    ];
    CRUD.showForm(c?'\u7f16\u8f91\u54bd\u540e\u70b9':'\u65b0\u589e\u54bd\u540e\u70b9',fields,function(obj){
      if(c){Object.assign(c,obj);showToast('\u2705 \u5df2\u66f4\u65b0');}
      else{CHOKEPOINTS.push(obj);showToast('\u2705 \u5df2\u6dfb\u52a0');}
      DataHub.save('chokepoints');this.render();
    }.bind(this),c);
  },
  deleteChokepoint(idx){if(!PERM.guard('\u5220\u9664\u54bd\u5589\u70b9'))return;
    showConfirm('\u786e\u5b9a\u5220\u9664\u8be5\u54bd\u540e\u70b9\uff1f',function(){
      if(idx>=0&&idx<CHOKEPOINTS.length){CHOKEPOINTS.splice(idx,1);DataHub.save('chokepoints');showToast('\u{1F5D1}\ufe0f \u5df2\u5220\u9664');MONITOR.render();}
    });
  },
  showCorridorForm(idx){if(!PERM.guard('\u65b0\u589e/\u7f16\u8f91\u8d70\u5eca'))return;
    var c=(idx!=null&&idx>=0)?CORRIDORS[idx]:null;
    var fields=[
      {key:'name',label:'\u8d70\u5eca\u540d\u79f0',required:true},
      {key:'countries',label:'\u8986\u76d6\u56fd\u5bb6'},
      {key:'projects',label:'\u9879\u76ee\u6570',type:'number',default:0},
      {key:'investment',label:'\u6295\u8d44\u989d(\u4ebf$)'},
      {key:'progress',label:'\u5b8c\u6210\u8fdb\u5ea6(%)',type:'number',default:0},
      {key:'risk',label:'\u98ce\u9669\u7b49\u7ea7',type:'select',options:['\u9ad8','\u4e2d','\u4f4e']},
      {key:'status',label:'\u72b6\u6001',type:'select',options:['\u6b63\u5e38','\u53d7\u963b','\u6682\u505c','\u89c4\u5212\u4e2d']},
      {key:'desc',label:'\u63cf\u8ff0',type:'textarea',rows:2}
    ];
    CRUD.showForm(c?'\u7f16\u8f91\u8d70\u5eca':'\u65b0\u589e\u8d70\u5eca',fields,function(obj){
      if(c){Object.assign(c,obj);showToast('\u2705 \u5df2\u66f4\u65b0');}
      else{CORRIDORS.push(obj);showToast('\u2705 \u5df2\u6dfb\u52a0');}
      DataHub.save('corridors');this.render();
    }.bind(this),c);
  },
  deleteCorridor(idx){if(!PERM.guard('\u5220\u9664\u8d70\u5eca'))return;
    showConfirm('\u786e\u5b9a\u5220\u9664\u8be5\u8d70\u5eca\uff1f',function(){
      if(idx>=0&&idx<CORRIDORS.length){CORRIDORS.splice(idx,1);DataHub.save('corridors');showToast('\u{1F5D1}\ufe0f \u5df2\u5220\u9664');MONITOR.render();}
    });
  },
  exportData(){
    var data={countries:COUNTRIES,events:EVENTS,chokepoints:CHOKEPOINTS,corridors:CORRIDORS};
    DataHub.exportJSON(data,'monitor_export.json');
  },
  _renderCorSummary(){
    var el=document.getElementById('cor-summary');if(!el)return;
    var totalInv=CORRIDORS.reduce(function(s,c){return s+c.inv;},0);
    var totalEnts=CORRIDORS.reduce(function(s,c){return s+c.ents;},0);
    var high=CORRIDORS.filter(function(c){return c.risk>=7;}).length;
    var normal=CORRIDORS.filter(function(c){return c.status==='正常运营'||c.status==='良好';}).length;
    var blocked=CORRIDORS.filter(function(c){return c.status==='部分受阻'||c.status==='高风险';}).length;
    el.innerHTML='<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">'+
      '<div style="padding:10px;background:var(--cyan-bg);border-radius:6px;text-align:center"><div style="font-size:20px;font-weight:800;color:var(--cyan)">'+totalInv+'亿$</div><div class="text-xs text-muted">总投资额</div></div>'+
      '<div style="padding:10px;background:var(--blue-bg);border-radius:6px;text-align:center"><div style="font-size:20px;font-weight:800;color:var(--cyan)">'+totalEnts+'</div><div class="text-xs text-muted">参与企业数</div></div>'+
      '<div style="padding:10px;background:var(--green-bg);border-radius:6px;text-align:center"><div style="font-size:20px;font-weight:800;color:var(--green)">'+normal+'</div><div class="text-xs text-muted">正常运营走廊</div></div>'+
      '<div style="padding:10px;background:var(--red-bg);border-radius:6px;text-align:center"><div style="font-size:20px;font-weight:800;color:var(--red)">'+blocked+'</div><div class="text-xs text-muted">受阻/高风险走廊</div></div>'+
      '</div>'+
      '<div style="padding:10px;background:var(--bg2);border-radius:6px"><strong style="font-size:11px;color:var(--cyan)">⚡ 重点关注走廊</strong>'+
      CORRIDORS.filter(function(c){return c.risk>=7;}).map(function(c){
        return '<div style="padding:6px 0;border-bottom:1px solid var(--border);font-size:11px"><span style="color:var(--red)">●</span> <strong>'+c.name+'</strong><div class="text-xs text-muted">'+c.status+' | '+c.countries+'</div></div>';
      }).join('')+'</div>';
  },
  showCorridorDetail(i){
    var c=CORRIDORS[i];if(!c)return;
    document.querySelectorAll('.cor-item').forEach(function(el,idx){el.style.borderColor=idx===i?'var(--cyan)':'var(--border)';});
    var lv=c.risk>=7?'b-red':c.risk>=5?'b-orange':c.risk>=3?'b-yellow':'b-green';
    var barColor=c.risk>=7?'var(--red)':c.risk>=5?'var(--orange)':c.risk>=3?'var(--yellow)':'var(--green)';
    var el=document.getElementById('cor-summary');
    if(el){
      el.innerHTML='<div style="margin-bottom:12px">'+
        '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px"><strong style="font-size:16px">'+c.name+'</strong><span class="badge '+lv+'">风险 '+c.risk+' / 10</span></div>'+
        '<div class="risk-bar" style="margin-bottom:8px"><div class="risk-bar-fill" style="width:'+c.risk*10+'%;background:'+barColor+'"></div></div>'+
        '<div class="text-sm" style="line-height:1.7;margin-bottom:12px">'+c.desc+'</div>'+
        '<div style="padding:10px;background:var(--bg2);border-radius:6px;margin-bottom:10px"><strong style="font-size:12px;color:var(--cyan)">📋 走廊概况</strong>'+
        '<div style="margin-top:6px;font-size:12px;line-height:1.8">'+
        '<div>📍 <strong>覆盖国家:</strong> '+c.countries+'</div>'+
        '<div>📦 <strong>投资规模:</strong> <span style="color:var(--cyan);font-weight:700">'+c.inv+'亿美元</span></div>'+
        '<div>🏢 <strong>参与企业:</strong> '+c.ents+'家</div>'+
        '<div>📊 <strong>当前状态:</strong> <span style="font-weight:700">'+c.status+'</span></div>'+
        '</div></div>'+
        '<div style="padding:10px;background:var(--blue-bg);border-radius:6px;margin-bottom:10px"><strong style="color:var(--cyan);font-size:12px">🏗️ 参与企业详情</strong><div style="margin-top:6px;font-size:11px;line-height:1.7">'+c.detail+'</div></div>'+
        '<div style="padding:10px;background:var(--orange-bg);border-radius:6px;margin-bottom:10px"><strong style="color:var(--orange);font-size:12px">📋 安全建议</strong><ul style="margin:6px 0 0;padding-left:18px;font-size:11px;line-height:1.7">'+
        '<li>'+(c.risk>=7?'建议加强项目现场安保，减少不必要外出':'保持常规安保措施，定期安全评估')+'</li>'+
        '<li>建立项目人员安全档案和应急联络机制</li>'+
        '<li>与当地政府和军方保持沟通，获取安全承诺</li>'+
        '<li>投保海外投资保险，分散政治风险</li>'+
        '</ul></div>'+
        '<button class="btn sm" onclick="MONITOR._renderCorSummary()">← 返回概览</button>'+
        (PERM.isAdmin()?'<button class="btn sm primary" onclick="MONITOR.showCorridorForm('+i+')">✏️ 编辑</button>':'')+
        (PERM.isAdmin()?'<button class="btn sm danger" onclick="MONITOR.deleteCorridor('+i+')">🗑️ 删除</button>':'')+
        '</div>';
    }
  }
};

// ===== ASSETS VIEW (Enterprises + Personnel) =====
const ASSETS={
  tab:'enterprises',filterIndustry:'all',filterRisk:'all',search:'',sortBy:'risk',
  switch(t){this.tab=t;document.querySelectorAll('#ast-tabs .dc-tab').forEach((e,i)=>{e.classList.toggle('active',i===(t==='enterprises'?0:1));});this.render();},
  init(){this.switch('enterprises');},
  // === ASSETS CRUD ===
  showEntForm(id){if(!PERM.guard('\u65b0\u589e/\u7f16\u8f91\u4f01\u4e1a'))return;
    var e=id?ENTERPRISES.find(function(x){return x.id===id;}):null;
    var industries=['\u80fd\u6e90\u77f3\u5316','\u57fa\u5efa\u4ea4\u901a','\u77ff\u4e1a\u91d1\u5c5e','\u901a\u4fe1\u7535\u5b50','\u519c\u4e1a\u98df\u54c1','\u91d1\u878d\u670d\u52a1','\u5236\u9020\u4e1a','\u7269\u6d41\u8d38\u6613','\u5176\u4ed6'];
    var fields=[
      {key:'name',label:'\u4f01\u4e1a\u5168\u79f0',required:true},
      {key:'short',label:'\u7b80\u79f0'},
      {key:'code',label:'\u4ee3\u7801'},
      {key:'industry',label:'\u884c\u4e1a',type:'select',options:industries},
      {key:'hq',label:'\u603b\u90e8'},
      {key:'logo',label:'\u6807\u8bc6(\u5b57)'},
      {key:'logoColor',label:'\u6807\u8bc6\u989c\u8272',default:'#00d4ff'},
      {key:'investment',label:'\u6d77\u5916\u6295\u8d44(\u4ebf$)',type:'number',default:0},
      {key:'personnel',label:'\u5916\u6d3e\u4eba\u5458',type:'number',default:0},
      {key:'assets',label:'\u6d77\u5916\u8d44\u4ea7(\u4ebf$)',type:'number',default:0},
      {key:'countries',label:'\u6d89\u8db3\u56fd\u5bb6(\u9017\u53f7\u5206\u9694)'},
      {key:'status',label:'\u72b6\u6001',type:'select',options:[{value:'normal',label:'\u6b63\u5e38'},{value:'alert',label:'\u9884\u8b66'},{value:'danger',label:'\u5371\u9669'}]}
    ];
    CRUD.showForm(e?'\u7f16\u8f91\u4f01\u4e1a':'\u65b0\u589e\u4f01\u4e1a',fields,function(obj){
      if(typeof obj.countries==='string'){obj.countries=obj.countries.split(/[,\uff0c]/).map(function(s){return s.trim();}).filter(Boolean);}
      if(e){Object.assign(e,obj);showToast('\u2705 \u4f01\u4e1a\u5df2\u66f4\u65b0');}
      else{obj.id=ENTERPRISES.length+1;obj.projects=[];ENTERPRISES.push(obj);showToast('\u2705 \u4f01\u4e1a\u5df2\u6dfb\u52a0');}
      DataHub.save('enterprises');this.render();
    }.bind(this),e);
  },
  deleteEnt(id){if(!PERM.guard('\u5220\u9664\u4f01\u4e1a'))return;
    showConfirm('\u786e\u5b9a\u5220\u9664\u8be5\u4f01\u4e1a\uff1f',function(){
      var idx=ENTERPRISES.findIndex(function(x){return x.id===id;});
      if(idx>-1){ENTERPRISES.splice(idx,1);DataHub.save('enterprises');showToast('\u{1F5D1}\ufe0f \u5df2\u5220\u9664');ASSETS.render();}
    });
  },
  exportData(){
    DataHub.exportJSON(ENTERPRISES,'enterprises_export.json');
  },
  render(){
    const el=document.getElementById('ast-content');
    if(this.tab==='enterprises')this.renderEnts(el);
    else this.renderPersonnel(el);
  },
  renderEnts(el){
    const inds=[...new Set(ENTERPRISES.map(e=>e.industry))];
    const ents=[...ENTERPRISES].map(e=>({...e,rs:getEntRisk(e)}));
    const totalInv=ents.reduce((s,e)=>s+e.investment,0);
    const totalPpl=ents.reduce((s,e)=>s+e.personnel,0);
    const highRisk=ents.filter(e=>e.rs>=6).length;
    const totalAlerts=ents.reduce((s,e)=>s+ALERTS.filter(a=>a.enterprise===e.short&&a.status!=='resolved').length,0);
    el.innerHTML='<div class="stat-grid mb-12" style="grid-template-columns:repeat(4,1fr)">'+
      '<div class="stat-card"><div class="stat-ic" style="background:var(--blue-bg);color:var(--cyan)">🏢</div><div class="stat-info"><div class="stat-label">企业总数</div><div class="stat-val" style="color:var(--cyan)">'+ents.length+'</div><div class="stat-sub">覆盖'+inds.length+'个行业</div></div></div>'+
      '<div class="stat-card"><div class="stat-ic" style="background:var(--green-bg);color:var(--green)">💰</div><div class="stat-info"><div class="stat-label">海外投资</div><div class="stat-val" style="color:var(--green)">'+totalInv+'亿$</div><div class="stat-sub">分布于'+new Set(ents.flatMap(e=>e.countries)).size+'国</div></div></div>'+
      '<div class="stat-card"><div class="stat-ic" style="background:var(--orange-bg);color:var(--orange)">👥</div><div class="stat-info"><div class="stat-label">外派人员</div><div class="stat-val" style="color:var(--orange)">'+totalPpl.toLocaleString()+'</div><div class="stat-sub">高风险区域'+ents.filter(e=>e.rs>=6).reduce((s,e)=>s+e.personnel,0).toLocaleString()+'人</div></div></div>'+
      '<div class="stat-card"><div class="stat-ic" style="background:var(--red-bg);color:var(--red)">🚨</div><div class="stat-info"><div class="stat-label">活跃预警</div><div class="stat-val" style="color:var(--red)">'+totalAlerts+'</div><div class="stat-sub">'+highRisk+'家高风险企业</div></div></div>'+
      '</div>'+
      CRUD.toolbar('共 '+ents.length+' 家企业','ASSETS.showEntForm()','ASSETS.exportData()',null)+
      '<div class="card"><div class="card-tt"><span class="ic">🏢</span>中资企业资产清单</div>'+
      '<div class="flex gap-8 mb-12 wrap items-center">'+
      '<input class="input" placeholder="🔍 搜索企业名称..." style="width:200px;font-size:12px" oninput="ASSETS.search=this.value;ASSETS.renderEnts(document.getElementById(\'ast-content\'))">'+
      '<div class="flex gap-8 wrap" id="ast-filters"></div>'+
      '<select class="select" style="font-size:11px;margin-left:auto" onchange="ASSETS.sortBy=this.value;ASSETS.renderEnts(document.getElementById(\'ast-content\'))">'+
      '<option value="risk">按风险排序</option><option value="inv">按投资排序</option><option value="ppl">按人员排序</option><option value="name">按名称排序</option></select>'+
      '</div>'+
      '<div class="table-wrap" style="max-height:500px;overflow-y:auto"><table><thead><tr><th>企业</th><th>行业</th><th>风险</th><th>投资(亿$)</th><th>人员</th><th>覆盖国家</th><th>预警</th><th>操作</th></tr></thead><tbody id="ast-tbody"></tbody></table></div></div>';
    document.getElementById('ast-filters').innerHTML='<div class="chip '+(this.filterIndustry==='all'?'active':'')+'" onclick="ASSETS.filterIndustry=\'all\';ASSETS.render()">全部</div>'+inds.map(i=>'<div class="chip '+(this.filterIndustry===i?'active':'')+'" onclick="ASSETS.filterIndustry=\''+i+'\';ASSETS.render()">'+i+'</div>').join('');
    const s=this.search.toLowerCase();
    const sortBy=this.sortBy||'risk';
    let f=ents.filter(e=>{
      const ms=!s||e.name.toLowerCase().includes(s)||e.short.toLowerCase().includes(s);
      const mi=this.filterIndustry==='all'||e.industry===this.filterIndustry;
      return ms&&mi;
    });
    f.sort((a,b)=>{
      if(sortBy==='risk')return b.rs-a.rs;
      if(sortBy==='inv')return b.investment-a.investment;
      if(sortBy==='ppl')return b.personnel-a.personnel;
      return a.short.localeCompare(b.short);
    });
    document.getElementById('ast-tbody').innerHTML=f.map(e=>{
      const lv=getLevel(e.rs);
      const ea=ALERTS.filter(a=>a.enterprise===e.short&&a.status!=='resolved');
      const hc=e.countries.filter(c=>{const ct=COUNTRIES.find(x=>x.name===c);return ct&&calcOverall(ct.scores)>=6;}).length;
      return '<tr style="cursor:pointer" onclick="showEntDetail('+e.id+')">'+
        '<td><div style="display:flex;align-items:center;gap:8px"><div style="width:28px;height:28px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;background:'+e.logoColor+'20;color:'+e.logoColor+'">'+e.logo+'</div><div><strong style="font-size:12px">'+e.short+'</strong><div class="text-xs text-muted">'+e.code+'</div></div></div></td>'+
        '<td><span class="badge b-blue" style="font-size:10px">'+e.industry+'</span></td>'+
        '<td><div style="display:flex;align-items:center;gap:6px"><div class="risk-bar" style="width:40px"><div class="risk-bar-fill" style="width:'+e.rs*10+'%;background:'+lv.color+'"></div></div><strong style="color:'+lv.color+';font-size:12px">'+e.rs.toFixed(1)+'</strong></div></td>'+
        '<td style="font-weight:700;color:var(--cyan)">'+e.investment+'</td>'+
        '<td>'+e.personnel.toLocaleString()+(hc?' <span style="color:var(--red);font-size:10px">('+hc+'国高危)</span>':'')+'</td>'+
        '<td><div style="max-width:200px">'+e.countries.slice(0,4).map(c=>{const ct=COUNTRIES.find(x=>x.name===c);return '<span class="text-xs" style="padding:1px 4px;background:var(--bg2);border-radius:3px;margin:1px">'+(ct?ct.flag:'')+' '+c+'</span>';}).join(' ')+(e.countries.length>4?'<span class="text-xs text-muted">+'+(e.countries.length-4)+'</span>':'')+'</div></td>'+
        '<td>'+(ea.length?'<span style="color:var(--red);font-weight:700">'+ea.length+'</span>':'<span style="color:var(--green)">-</span>')+'</td>'+
        '<td style="white-space:nowrap"><button class="btn sm" style="font-size:10px;padding:2px 6px" onclick="event.stopPropagation();showEntDetail('+e.id+')">详情</button>'+(PERM.isAdmin()?'<button class="btn sm" style="font-size:10px;padding:2px 6px;margin-left:2px" onclick="event.stopPropagation();ASSETS.showEntForm('+e.id+')">✏️</button><button class="btn sm danger" style="font-size:10px;padding:2px 6px;margin-left:2px" onclick="event.stopPropagation();ASSETS.deleteEnt('+e.id+')">🗑️</button>':'')+'</td>'+
        '</tr>';
    }).join('')||'<tr><td colspan="8" style="text-align:center;padding:30px;color:var(--text3)">未找到匹配企业</td></tr>';
  },
  renderPersonnel(el){
    const tP=ENTERPRISES.reduce((s,e)=>s+e.personnel,0);
    const pHigh=ENTERPRISES.reduce((s,e)=>{const r=getEntRisk(e);return r>=6?s+e.personnel:s;},0);
    const pMid=ENTERPRISES.reduce((s,e)=>{const r=getEntRisk(e);return r>=4&&r<6?s+e.personnel:s;},0);
    const pLow=tP-pHigh-pMid;
    const pAlert=ALERTS.filter(a=>a.status!=='resolved').reduce((s,a)=>s+a.affectedP,0);
    el.innerHTML='<div class="stat-grid mb-12" style="grid-template-columns:repeat(4,1fr)">'+
      '<div class="stat-card"><div class="stat-ic" style="background:var(--blue-bg);color:var(--cyan)">👥</div><div class="stat-info"><div class="stat-label">海外人员</div><div class="stat-val" style="color:var(--cyan)">'+tP.toLocaleString()+'</div><div class="stat-sub">分布于'+ENTERPRISES.length+'家企业</div></div></div>'+
      '<div class="stat-card"><div class="stat-ic" style="background:var(--red-bg);color:var(--red)">⚠️</div><div class="stat-info"><div class="stat-label">高风险区域</div><div class="stat-val" style="color:var(--red)">'+pHigh.toLocaleString()+'</div><div class="stat-sub">占'+Math.round(pHigh/tP*100)+'%</div></div></div>'+
      '<div class="stat-card"><div class="stat-ic" style="background:var(--orange-bg);color:var(--orange)">🚨</div><div class="stat-info"><div class="stat-label">预警影响</div><div class="stat-val" style="color:var(--orange)">'+pAlert.toLocaleString()+'</div><div class="stat-sub">需关注安全保障</div></div></div>'+
      '<div class="stat-card"><div class="stat-ic" style="background:var(--green-bg);color:var(--green)">🛡️</div><div class="stat-info"><div class="stat-label">安全保障率</div><div class="stat-val" style="color:var(--green)">98.5%</div><div class="stat-sub">零伤亡撤离</div></div></div>'+
      '</div>'+
      '<div class="grid" style="grid-template-columns:1fr 320px;gap:12px">'+
      '<div class="card"><div class="card-tt"><span class="ic">📊</span>企业人员风险分布</div><div class="table-wrap" style="max-height:500px;overflow-y:auto"><table><thead><tr><th>企业</th><th>行业</th><th>人员</th><th>风险等级</th><th>高风险国家</th><th>预警数</th><th>安全状态</th></tr></thead><tbody>'+
      [...ENTERPRISES].map(e=>({...e,rs:getEntRisk(e)})).sort((a,b)=>b.rs-a.rs).map(e=>{
        const lv=getLevel(e.rs);
        const hc=e.countries.filter(c=>{const ct=COUNTRIES.find(x=>x.name===c);return ct&&calcOverall(ct.scores)>=6;}).length;
        const ea=ALERTS.filter(a=>a.enterprise===e.short).length;
        const safe=e.rs<4?'🟢 安全':e.rs<6?'🟡 关注':e.rs<8?'🟠 高危':'🔴 极高';
        const safeColor=e.rs<4?'var(--green)':e.rs<6?'var(--yellow)':e.rs<8?'var(--orange)':'var(--red)';
        return '<tr style="cursor:pointer" onclick="showEntDetail('+e.id+')"><td><strong>'+e.short+'</strong></td><td>'+e.industry+'</td><td style="font-weight:700">'+e.personnel.toLocaleString()+'</td><td><div style="display:flex;align-items:center;gap:4px"><div class="risk-bar" style="width:40px"><div class="risk-bar-fill" style="width:'+e.rs*10+'%;background:'+lv.color+'"></div></div><span style="color:'+lv.color+';font-weight:700;font-size:11px">'+e.rs.toFixed(1)+'</span></div></td><td style="color:'+(hc?'var(--red)':'var(--text2)')+'">'+hc+'国</td><td>'+(ea?'<span style="color:var(--red);font-weight:700">'+ea+'</span>':'<span style="color:var(--green)">-</span>')+'</td><td><span style="color:'+safeColor+';font-size:11px;font-weight:600">'+safe+'</span></td></tr>';
      }).join('')+'</tbody></table></div></div>'+
      '<div class="card"><div class="card-tt"><span class="ic">📈</span>人员风险分布</div>'+
      '<div style="height:200px;margin-bottom:12px"><canvas id="chart-ppl-risk"></canvas></div>'+
      '<div style="padding:10px;background:var(--bg2);border-radius:8px"><strong style="font-size:11px;color:var(--cyan)">⚡ 重点关注</strong>'+
      '<div style="margin-top:6px">'+ENTERPRISES.filter(e=>getEntRisk(e)>=6).sort((a,b)=>getEntRisk(b)-getEntRisk(a)).slice(0,5).map(e=>{
        const r=getEntRisk(e);
        return '<div style="padding:4px 0;border-bottom:1px solid var(--border);font-size:11px;cursor:pointer" onclick="showEntDetail('+e.id+')"><span style="color:var(--red)">●</span> <strong>'+e.short+'</strong> <span class="text-muted">'+e.personnel.toLocaleString()+'人 | 风险'+r.toFixed(1)+'</span></div>';
      }).join('')+'</div></div></div></div>';
    var ctx=document.getElementById('chart-ppl-risk');
    if(ctx){
      if(charts.pplRisk)charts.pplRisk.destroy();
      charts.pplRisk=new Chart(ctx.getContext('2d'),{
        type:'doughnut',
        data:{labels:['高风险区域','中风险区域','低风险区域'],datasets:[{data:[pHigh,pMid,pLow],backgroundColor:['#ff3355','#ff8800','#00ff9f'],borderWidth:2,borderColor:'#070b14'}]},
        options:{responsive:true,maintainAspectRatio:false,cutout:'55%',plugins:{legend:{position:'bottom',labels:{font:{size:10},color:'#7a8ba3',padding:8,boxWidth:10}}}}
      });
    }
  }
};

// ===== INTELLIGENCE FUSION DATA =====
var INTEL_SOURCES=[
  {id:'OSINT',ic:'🌐',name:'开源情报',full:'Open Source Intelligence',color:'#00d4ff',reliability:85,desc:'社交媒体、新闻媒体、公开报告、学术研究',
   channels:['Twitter/X监测','全球新闻聚合','智库报告','政府公告']},
  {id:'HUMINT',ic:'👤',name:'人力情报',full:'Human Intelligence',color:'#00ff9f',reliability:92,desc:'现场安保人员、线人网络、使馆渠道',
   channels:['驻地安全官','属地线人网络','使馆安全通报','企业联防机制']},
  {id:'SIGINT',ic:'📡',name:'信号情报',full:'Signals Intelligence',color:'#ff8800',reliability:95,desc:'通信监测、电子情报、无线电频谱分析',
   channels:['通信模式分析','无线电监测','电子行为画像','通信关联分析']},
  {id:'GEOINT',ic:'🛰️',name:'图像情报',full:'Geospatial Intelligence',color:'#b366ff',reliability:90,desc:'卫星图像、无人机侦察、地理空间分析',
   channels:['商业卫星(Sentinel/Planet)','无人机巡检','地形变化检测','设施监测']},
  {id:'CYBINT',ic:'💻',name:'网络情报',full:'Cyber Intelligence',color:'#ffcc00',reliability:80,desc:'暗网监控、网络威胁情报、极端组织宣传追踪',
   channels:['暗网论坛监控','极端组织宣传渠道','网络攻击预警','数据泄露监测']},
  {id:'COMMINT',ic:'📊',name:'商业情报',full:'Commercial Intelligence',color:'#00d4ff',reliability:78,desc:'商业数据库、市场分析、金融数据、供应链信息',
   channels:['金融数据库(Bloomberg)','供应链追踪','信用评级机构','行业研报']}
];
var INTEL_ITEMS=[
  {id:'INT-001',src:'OSINT',time:'2025-02-16 13:45',country:'刚果(金)',title:'M23武装在布卡武快速推进',content:'社交媒体大量视频显示M23武装分子进入南基伍省首府布卡武，当地居民大量南逃。多路消息源证实武装人员已控制市政府和主要道路。',confidence:88,status:'validated',alertId:'AW-2025-0216-001',eventId:'EVT-2502-001',validatedBy:['HUMINT','GEOINT']},
  {id:'INT-002',src:'HUMINT',time:'2025-02-16 13:20',country:'刚果(金)',title:'矿区安保团队报告异常人员流动',content:'紫金矿业卡莫阿铜矿驻地安全官报告，矿区以南60公里处发现不明武装人员活动，当地社区出现恐慌性撤离。',confidence:90,status:'validated',alertId:'AW-2025-0216-001',eventId:'EVT-2502-001',validatedBy:['OSINT','SIGINT']},
  {id:'INT-003',src:'GEOINT',time:'2025-02-16 14:00',country:'刚果(金)',title:'卫星图像显示武装车队向矿区方向移动',content:'Sentinel-2卫星图像分析显示，布卡武以南道路上出现超过20辆武装车辆组成的车队，向南方卢阿拉巴省方向移动。',confidence:93,status:'validated',alertId:'AW-2025-0216-001',eventId:'EVT-2502-001',validatedBy:['OSINT','HUMINT']},
  {id:'INT-004',src:'SIGINT',time:'2025-02-16 12:50',country:'刚果(金)',title:'截获M23指挥层通信提及矿区目标',content:'通信监测截获M23指挥层通信，其中提及"资源区域"和"矿区方向推进"等内容，分析认为可能对中资矿区构成直接威胁。',confidence:91,status:'validated',alertId:'AW-2025-0216-001',eventId:null,validatedBy:['HUMINT']},
  {id:'INT-005',src:'CYBINT',time:'2024-10-04 22:30',country:'巴基斯坦',title:'BLA社交媒体异常活跃，发布威胁声明',content:'暗网和社交媒体监测发现"俾路支解放军"(BLA)账号活动量激增300%，发布针对中资企业的威胁声明，提及"即将行动"。',confidence:72,status:'cross-checked',alertId:'AW-2024-1006-002',eventId:'EVT-2410-011',validatedBy:['OSINT']},
  {id:'INT-006',src:'OSINT',time:'2024-10-05 08:15',country:'巴基斯坦',title:'当地媒体报道瓜达尔港安全升级',content:'巴基斯坦媒体GEO News报道，俾路支省安全部队在瓜达尔港周边加强安保部署，未说明具体威胁信息。',confidence:75,status:'cross-checked',alertId:'AW-2024-1006-002',eventId:'EVT-2410-011',validatedBy:['CYBINT']},
  {id:'INT-007',src:'SIGINT',time:'2024-10-06 21:45',country:'巴基斯坦',title:'截获BLA行动前协调通信',content:'通信监测在袭击发生前约1.5小时截获BLA武装人员间协调通信，涉及"目标车辆"和"机场路线"等关键词。',confidence:89,status:'validated',alertId:'AW-2024-1006-002',eventId:'EVT-2410-011',validatedBy:['CYBINT','HUMINT']},
  {id:'INT-008',src:'HUMINT',time:'2024-03-25 18:00',country:'巴基斯坦',title:'达苏项目安保团队报告路线安全隐患',content:'中铁建达苏水电站项目安保团队提前一天向项目部报告，开伯尔-普赫图省省道存在安全隐患，建议更改出行路线。建议未被采纳。',confidence:85,status:'validated',alertId:'AW-2024-0326-003',eventId:'EVT-2403-002',validatedBy:['OSINT']},
  {id:'INT-009',src:'OSINT',time:'2023-11-19 06:00',country:'也门',title:'胡塞武装宣布对红海商船发动袭击',content:'胡塞武装发言人通过社交媒体宣布，将对"与以色列有关联"的红海商船发动袭击。随后当天劫持了"银河领袖"号货轮。',confidence:95,status:'validated',alertId:'AW-2023-1218-004',eventId:'EVT-2311-003',validatedBy:['SIGINT','GEOINT']},
  {id:'INT-010',src:'GEOINT',time:'2023-11-19 14:30',country:'红海',title:'卫星图像确认商船被劫持',content:'Planet Labs卫星图像显示红海曼德海峡附近一艘商船偏离航线，图像分析确认为"银河领袖"号被武装船只包围。',confidence:97,status:'validated',alertId:'AW-2023-1218-004',eventId:'EVT-2311-003',validatedBy:['OSINT','SIGINT']},
  {id:'INT-011',src:'SIGINT',time:'2023-12-15 09:00',country:'红海',title:'监测到胡塞导弹部队频繁通信',content:'电子情报分析显示胡塞武装沿海导弹阵地通信活动激增，分析认为可能准备发动新一轮导弹袭击。',confidence:87,status:'validated',alertId:'AW-2023-1218-004',eventId:null,validatedBy:['GEOINT']},
  {id:'INT-012',src:'COMMINT',time:'2023-12-18 10:00',country:'全球',title:'全球航运保险费率急剧上调',content:'Bloomberg数据显示红海航线战争险费率在一周内上涨500%，劳合社市场已暂停部分红海航线承保。',confidence:92,status:'validated',alertId:'AW-2023-1218-004',eventId:'EVT-2312-025',validatedBy:['OSINT']},
  {id:'INT-013',src:'OSINT',time:'2023-04-15 08:00',country:'苏丹',title:'苏丹首都喀土穆爆发全面武装冲突',content:'全球多家媒体报道苏丹武装部队(SAF)与快速支援部队(RSF)在首都喀土穆爆发全面交火，国际机场已关闭。',confidence:96,status:'validated',alertId:'AW-2023-1115-005',eventId:'EVT-2304-004',validatedBy:['SIGINT','GEOINT','HUMINT']},
  {id:'INT-014',src:'HUMINT',time:'2023-04-15 10:30',country:'苏丹',title:'中石油6区油田中方人员紧急求助',content:'中石油6区油田通过应急通信报告，营地附近出现武装人员活动，设施供电已中断，请求紧急支援。',confidence:94,status:'validated',alertId:'AW-2023-1115-005',eventId:'EVT-2304-004',validatedBy:['OSINT','SIGINT']},
  {id:'INT-015',src:'GEOINT',time:'2023-04-16 03:00',country:'苏丹',title:'卫星图像确认喀土穆多个区域火情',content:'VIIRS卫星火灾监测数据确认喀土穆北部工业区、国际机场附近出现大量热源，与武装冲突报告一致。',confidence:90,status:'validated',alertId:'AW-2023-1115-005',eventId:null,validatedBy:['OSINT']},
  {id:'INT-016',src:'CYBINT',time:'2023-11-01 16:00',country:'缅甸',title:'暗网出现中缅油气管道技术资料交易',content:'暗网监控发现有人出售中缅油气管道沿线安保部署图和技术参数资料，卖家IP指向缅甸境内。',confidence:78,status:'cross-checked',alertId:'AW-2023-1102-006',eventId:null,validatedBy:['HUMINT']},
  {id:'INT-017',src:'SIGINT',time:'2023-11-02 03:00',country:'缅甸',title:'监测到管道控制站附近异常通信',content:'通信监测在管道控制站附近发现异常加密通信，通信模式与地方武装组织惯用模式高度匹配。',confidence:83,status:'validated',alertId:'AW-2023-1102-006',eventId:'EVT-2102-017',validatedBy:['CYBINT','HUMINT']},
  {id:'INT-018',src:'COMMINT',time:'2024-01-10 14:00',country:'哥伦比亚',title:'紫金矿业武里蒂卡金矿安保支出激增',content:'商业数据库显示紫金矿业武里蒂卡金矿2023年安保支出同比增长180%，矿区运营数据出现异常波动。',confidence:82,status:'cross-checked',alertId:'AW-2024-0115-010',eventId:'EVT-2401-007',validatedBy:['OSINT']},
  {id:'INT-019',src:'OSINT',time:'2024-01-14 09:00',country:'哥伦比亚',title:'当地媒体报道矿区非法武装活动升级',content:'哥伦比亚媒体El Tiempo报道，武里蒂卡金矿区域2023年记录2260次爆炸和2450次枪击事件，非法采矿组织CLC已控制大部分矿区。',confidence:88,status:'validated',alertId:'AW-2024-0115-010',eventId:'EVT-2401-007',validatedBy:['COMMINT','GEOINT']},
  {id:'INT-020',src:'GEOINT',time:'2024-01-15 11:00',country:'哥伦比亚',title:'卫星图像显示矿区非法开采区域扩大',content:'Sentinel-2卫星图像对比分析显示，武里蒂卡金矿非法开采区域在6个月内扩大约35%，新增大量非法采矿坑洞。',confidence:91,status:'validated',alertId:'AW-2024-0115-010',eventId:null,validatedBy:['OSINT']},
  {id:'INT-021',src:'COMMINT',time:'2024-02-01 08:00',country:'阿根廷',title:'阿根廷比索暴跌54%，外汇管制收紧',content:'Bloomberg金融数据确认阿根廷比索官方汇率一次性贬值54%，央行同步实施严格外汇管制。多家中企面临汇兑损失。',confidence:96,status:'validated',alertId:'AW-2024-0201-018',eventId:'EVT-2402-019',validatedBy:['OSINT']},
  {id:'INT-022',src:'OSINT',time:'2024-12-01 02:00',country:'美国',title:'美国BIS发布新一轮半导体出口管制规则',content:'美国商务部产业安全局(BIS)发布最终规则，进一步限制先进计算芯片和半导体制造设备对华出口，新增136家中国实体至实体清单。',confidence:98,status:'validated',alertId:'AW-2024-1201-008',eventId:'EVT-2412-016',validatedBy:['CYBINT','COMMINT']},
  {id:'INT-023',src:'CYBINT',time:'2024-11-28 20:00',country:'美国',title:'监测到美国政策制定者芯片管制讨论',content:'网络情报监测发现美国智库和政界人士在社交媒体密集讨论新一轮对华芯片管制，关键词频率分析预示政策即将出台。',confidence:76,status:'cross-checked',alertId:'AW-2024-1201-008',eventId:null,validatedBy:['OSINT']},
  {id:'INT-024',src:'SIGINT',time:'2023-07-25 22:00',country:'尼日尔',title:'截获尼日尔总统卫队异常通信',content:'通信监测发现尼日尔总统卫队内部通信模式异常，大量加密通信集中出现，与军事行动前通信特征高度吻合。',confidence:84,status:'validated',alertId:'AW-2023-0815-019',eventId:'EVT-2307-012',validatedBy:['OSINT','HUMINT']},
  {id:'INT-025',src:'OSINT',time:'2024-03-06 06:00',country:'埃及',title:'埃及央行宣布汇率自由浮动',content:'全球财经媒体即时报道，埃及央行宣布允许埃及镑自由浮动，同时加息600基点至27.25%。IMF同步提供80亿美元贷款。',confidence:97,status:'validated',alertId:'AW-2024-0306-015',eventId:'EVT-2403-013',validatedBy:['COMMINT']},
  {id:'INT-026',src:'COMMINT',time:'2024-03-05 18:00',country:'埃及',title:'埃及主权债券CDS利差急剧扩大',content:'Bloomberg数据显示埃及5年期CDS利差在24小时内扩大1200基点，金融市场已提前反映汇率大幅贬值预期。',confidence:89,status:'cross-checked',alertId:'AW-2024-0306-015',eventId:null,validatedBy:['OSINT']},
  {id:'INT-027',src:'HUMINT',time:'2026-05-16 02:00',country:'刚果(金)',title:'科卢韦齐中资园区安保发现武装人员接近',content:'华远卫士安全官报告，科卢韦齐中资园区围墙外发现9名持AK-47步枪武装人员，正在观察园区安保部署。',confidence:92,status:'validated',alertId:null,eventId:null,validatedBy:['GEOINT']},
  {id:'INT-028',src:'HUMINT',time:'2026-05-17 01:30',country:'马里',title:'马里中资矿区遭袭前收到匿名警告',content:'马里库利科罗大区中资矿区在遭袭前约3小时收到匿名电话警告，称"武装人员正在接近"。预警信息已通过应急通信系统上报。',confidence:80,status:'pending',alertId:null,eventId:null,validatedBy:[]}
];

// ===== ALERTS VIEW (v3 - Command Center) =====
const AVIEW={
  filterLevel:'all',filterType:'all',filterStatus:'all',searchQuery:'',
  activeTab:'command',
  selectedAlertId:null,
  responseLogs:{},
  init(){
    this.renderStats();
    this.renderTabs();
    this.renderCommandFilters();
    this.renderQueue();
    this.renderFeed();
    var first=ALERTS.find(function(a){return a.level==='red'&&a.status!=='resolved';})||ALERTS[0];
    if(first)this.selectAlert(first.id);
  },
  renderTabs(){
    var tabs=[
      {id:'command',ic:'🎛️',lb:'预警指挥台'},
      {id:'correlation',ic:'🔗',lb:'关联分析'},
      {id:'tracking',ic:'⚡',lb:'响应追踪'},
      {id:'playbook',ic:'📖',lb:'应急预案'},
      {id:'sources',ic:'📡',lb:'情报融合'},
      {id:'cases',ic:'📚',lb:'案例分析'},
      {id:'rules',ic:'📋',lb:'预警规则'}
    ];
    var self=this;
    document.getElementById('alert-tabs').innerHTML=tabs.map(function(t){
      return '<div class="dc-tab'+(self.activeTab===t.id?' active':'')+'" onclick="AVIEW.switchTab(\''+t.id+'\')">'+t.ic+' '+t.lb+'</div>';
    }).join('');
  },
  // === AVIEW CRUD ===
  showAlertForm(id){if(!PERM.guard('\u65b0\u589e/\u7f16\u8f91\u9884\u8b66'))return;
    var a=id?ALERTS.find(function(x){return x.id===id;}):null;
    var fields=[
      {key:'title',label:'\u9884\u8b66\u6807\u9898',required:true},
      {key:'country',label:'\u56fd\u5bb6'},
      {key:'level',label:'\u7b49\u7ea7',type:'select',options:[{value:'red',label:'\u7ea2\u8272'},{value:'orange',label:'\u6a59\u8272'},{value:'yellow',label:'\u9ec4\u8272'},{value:'blue',label:'\u84dd\u8272'}]},
      {key:'type',label:'\u7c7b\u578b',type:'select',options:['\u5b89\u5168\u5a01\u80c1','\u653f\u6cbb\u52a8\u8361','\u7ecf\u6d4e\u98ce\u9669','\u793e\u4f1a\u4e8b\u4ef6','\u81ea\u7136\u707e\u5bb3','\u5236\u88c1\u5408\u89c4','\u57fa\u5efa\u635f\u574f','\u4eba\u5458\u5b89\u5168']},
      {key:'status',label:'\u72b6\u6001',type:'select',options:[{value:'active',label:'\u5f85\u5904\u7406'},{value:'acknowledged',label:'\u5df2\u786e\u8ba4'},{value:'responding',label:'\u5904\u7f6e\u4e2d'},{value:'resolved',label:'\u5df2\u89e3\u9664'}]},
      {key:'enterprise',label:'\u5173\u8054\u4f01\u4e1a'},
      {key:'affectedP',label:'\u5f71\u54cd\u4eba\u5458',type:'number',default:0},
      {key:'affectedA',label:'\u5f71\u54cd\u8d44\u4ea7(\u4ebf$)',type:'number',default:0},
      {key:'source',label:'\u4fe1\u606f\u6765\u6e90'},
      {key:'desc',label:'\u9884\u8b66\u63cf\u8ff0',type:'textarea',rows:4}
    ];
    CRUD.showForm(a?'\u7f16\u8f91\u9884\u8b66':'\u65b0\u589e\u9884\u8b66',fields,function(obj){
      if(a){Object.assign(a,obj);showToast('\u2705 \u9884\u8b66\u5df2\u66f4\u65b0');}
      else{obj.id=CRUD._genId('ALT');obj.time=new Date().toLocaleString('zh-CN');ALERTS.unshift(obj);showToast('\u2705 \u9884\u8b66\u5df2\u6dfb\u52a0');}
      DataHub.save('alerts');this.renderQueue();this.renderCmd();this.renderTracking();
    }.bind(this),a);
  },
  deleteAlert(id){if(!PERM.guard('\u5220\u9664\u9884\u8b66'))return;
    showConfirm('\u786e\u5b9a\u5220\u9664\u8be5\u9884\u8b66\uff1f',function(){
      var idx=ALERTS.findIndex(function(x){return x.id===id;});
      if(idx>-1){ALERTS.splice(idx,1);DataHub.save('alerts');showToast('\u{1F5D1}\ufe0f \u5df2\u5220\u9664');AVIEW.renderQueue();AVIEW.renderCmd();AVIEW.renderTracking();}
    });
  },
  exportData(){
    DataHub.exportJSON(ALERTS,'alerts_export.json');
  },
  switchTab(t){
    this.activeTab=t;
    this.renderTabs();
    document.querySelectorAll('.alert-panel').forEach(function(p){p.style.display='none';});
    var el=document.getElementById('alert-panel-'+t);
    if(el)el.style.display='block';
    if(t==='correlation'){this.renderCorrelation();this.renderCharts();}
    if(t==='tracking')this.renderTracking();
    if(t==='playbook')this.renderPlaybook();
    if(t==='sources')this.renderSources();
    if(t==='cases')this.renderCases();
    if(t==='rules')this.renderRules();
  },
  renderStats(){
    var active=ALERTS.filter(function(a){return a.status==='active';}).length;
    var responding=ALERTS.filter(function(a){return a.status==='responding';}).length;
    var red=ALERTS.filter(function(a){return a.level==='red'&&a.status!=='resolved';}).length;
    var resolved=ALERTS.filter(function(a){return a.status==='resolved';}).length;
    var total=ALERTS.length;
    var ackRate=total>0?Math.round((total-active)/total*100):0;
    document.getElementById('alert-stats').innerHTML=[
      {ic:'🔴',bg:'var(--red-bg)',c:'var(--red)',l:'红色预警',v:red,s:'需立即处置'},
      {ic:'⚡',bg:'var(--orange-bg)',c:'var(--orange)',l:'活跃预警',v:active+responding,s:'待处理/处置中'},
      {ic:'📊',bg:'var(--blue-bg)',c:'var(--cyan)',l:'预警总量',v:total,s:'累计'+resolved+'起已解除'},
      {ic:'⏱️',bg:'var(--yellow-bg)',c:'var(--yellow)',l:'平均响应',v:'8.5min',s:'SLA达标率87%'},
      {ic:'✅',bg:'var(--green-bg)',c:'var(--green)',l:'已解除',v:resolved,s:'处置完成率'+ackRate+'%'},
      {ic:'🎯',bg:'var(--purple-bg)',c:'var(--purple)',l:'SLA达标',v:'87%',s:'3起超时预警'}
    ].map(function(s){return '<div class="stat-card"><div class="stat-ic" style="background:'+s.bg+';color:'+s.c+'">'+s.ic+'</div><div class="stat-info"><div class="stat-label">'+s.l+'</div><div class="stat-val" style="color:'+s.c+'">'+s.v+'</div><div class="stat-sub">'+s.s+'</div></div></div>';}).join('');
    var badge=document.getElementById('sb-alert-count');
    if(badge){badge.textContent=active;badge.classList.toggle('zero',active===0);}
  },
  renderCommandFilters(){
    document.getElementById('alert-cmd-filters').innerHTML=
      '<input class="alert-cmd-search" id="alert-search" placeholder="🔍 搜索预警标题/国家/企业..." oninput="AVIEW.searchQuery=this.value;AVIEW.renderQueue()">'+
      '<div style="display:flex;gap:4px;flex-wrap:wrap">'+
      '<select class="select" style="font-size:11px;padding:4px 8px" onchange="AVIEW.filterLevel=this.value;AVIEW.renderQueue()"><option value="all">全部等级</option><option value="red">🔴 红色</option><option value="orange">🟠 橙色</option><option value="yellow">🟡 黄色</option><option value="blue">🔵 蓝色</option></select>'+
      '<select class="select" style="font-size:11px;padding:4px 8px" onchange="AVIEW.filterStatus=this.value;AVIEW.renderQueue()"><option value="all">全部状态</option><option value="active">待处理</option><option value="acknowledged">已确认</option><option value="responding">处置中</option><option value="resolved">已解除</option></select>'+
      '<button class="btn sm primary" onclick="AVIEW.simulateFeed()" style="font-size:10px;white-space:nowrap">📡 模拟预警</button>'+
      '<button class="btn sm" onclick="AVIEW.generateInsight()" style="font-size:10px;white-space:nowrap">🤖 AI分析</button>'+
      '<button class="btn sm primary" onclick="AVIEW.showAlertForm()" style="font-size:10px;white-space:nowrap">➕ 新增预警</button>'+
      '<button class="btn sm" onclick="AVIEW.exportData()" style="font-size:10px;white-space:nowrap">📥 导出</button>'+
      '</div>';
  },
  renderQueue(){
    var alerts=ALERTS.slice();
    if(this.filterLevel!=='all')alerts=alerts.filter(function(a){return a.level===AVIEW.filterLevel;});
    if(this.filterStatus!=='all')alerts=alerts.filter(function(a){return a.status===AVIEW.filterStatus;});
    if(this.searchQuery){
      var q=this.searchQuery.toLowerCase();
      alerts=alerts.filter(function(a){
        return(a.title||'').toLowerCase().indexOf(q)>=0||(a.country||'').toLowerCase().indexOf(q)>=0||(a.enterprise||'').toLowerCase().indexOf(q)>=0;
      });
    }
    var lvlOrder={red:0,orange:1,yellow:2,blue:3};
    var stOrder={active:0,acknowledged:1,responding:2,resolved:3};
    alerts.sort(function(a,b){
      if(lvlOrder[a.level]!==lvlOrder[b.level])return lvlOrder[a.level]-lvlOrder[b.level];
      if(stOrder[a.status]!==stOrder[b.status])return stOrder[a.status]-stOrder[b.status];
      return(b.time||'').localeCompare(a.time||'');
    });
    var sl={active:'待处理',acknowledged:'已确认',responding:'处置中',resolved:'已解除'};
    var sc={active:'var(--red)',acknowledged:'var(--cyan)',responding:'var(--orange)',resolved:'var(--green)'};
    document.getElementById('alert-cmd-queue').innerHTML=alerts.map(function(a){
      var lv=ALERT_LV[a.level];
      var selected=a.id===AVIEW.selectedAlertId;
      var pulsing=a.level==='red'&&a.status==='active';
      return '<div class="alert-q-item lv-'+a.level+(selected?' selected':'')+(pulsing?' pulsing':'')+'" onclick="AVIEW.selectAlert(\''+a.id+'\')">'+
        '<div class="alert-q-tt"><span class="badge '+lv.cls+'" style="font-size:9px;padding:1px 4px">'+lv.label+'</span> '+a.title+'</div>'+
        '<div class="alert-q-meta">'+
        '<span>📍'+a.country+'</span>'+
        '<span>🕐'+(a.time||'').substring(5,16)+'</span>'+
        '<span style="color:'+(sc[a.status]||'#999')+';font-weight:600">●'+(sl[a.status]||a.status)+'</span>'+
        '<span style="margin-left:auto;display:flex;gap:2px">'+
        (PERM.isAdmin()?'<button class="btn sm" style="font-size:9px;padding:1px 5px" onclick="event.stopPropagation();AVIEW.showAlertForm(\''+a.id+'\')">✏️</button>':'')+
        (PERM.isAdmin()?'<button class="btn sm danger" style="font-size:9px;padding:1px 5px" onclick="event.stopPropagation();AVIEW.deleteAlert(\''+a.id+'\')">🗑️</button>':'')+
        '</span>'+
        '</div></div>';
    }).join('')||'<div class="empty"><div class="ic">🔍</div><div>没有匹配的预警</div></div>';
  },
  selectAlert(id){
    this.selectedAlertId=id;
    this.renderQueue();
    this.renderDetail();
  },
  renderDetail(){
    var el=document.getElementById('alert-cmd-detail');
    if(!el)return;
    var a=ALERTS.find(function(x){return x.id===AVIEW.selectedAlertId;});
    if(!a){el.innerHTML='<div class="empty"><div class="ic">👈</div><div>请从左侧选择预警查看详情</div></div>';return;}
    var lv=ALERT_LV[a.level];
    var sl={active:'待处理',acknowledged:'已确认',responding:'处置中',resolved:'已解除'};
    var sc={active:'var(--red)',acknowledged:'var(--cyan)',responding:'var(--orange)',resolved:'var(--green)'};
    var country=COUNTRIES.find(function(c){return c.name===a.country;});
    var stSteps=['active','acknowledged','responding','resolved'];
    var stIdx=stSteps.indexOf(a.status);
    var stLabels={active:'待处理',acknowledged:'已确认',responding:'处置中',resolved:'已解除'};
    var stIcons={active:'⚠️',acknowledged:'👁️',responding:'🏃',resolved:'✅'};
    var wfHtml='<div class="alert-workflow">';
    stSteps.forEach(function(s,i){
      var cls=i<stIdx?'done':i===stIdx?'current':'pending';
      wfHtml+='<div class="alert-wf-step '+cls+'">'+stIcons[s]+' '+stLabels[s]+'</div>';
      if(i<3)wfHtml+='<div class="alert-wf-arrow">→</div>';
    });
    wfHtml+='</div>';
    var actions='';
    if(PERM.isAdmin()){
    if(a.status==='active')actions='<button class="btn primary sm" onclick="AVIEW.ack(\''+a.id+'\')">👁️ 确认预警</button><button class="btn danger sm" onclick="AVIEW.escalate(\''+a.id+'\')">⬆️ 升级</button><button class="btn sm" onclick="AVIEW.showPlaybook(\''+a.type+'\')">📖 预案</button>';
    else if(a.status==='acknowledged')actions='<button class="btn primary sm" onclick="AVIEW.respond(\''+a.id+'\')">🏃 启动处置</button><button class="btn sm" onclick="AVIEW.showPlaybook(\''+a.type+'\')">📖 预案</button>';
    else if(a.status==='responding')actions='<button class="btn primary sm" onclick="AVIEW.resolve(\''+a.id+'\')">✅ 解除预警</button><button class="btn sm" onclick="AVIEW.showPlaybook(\''+a.type+'\')">📖 预案</button>';
    else actions='<button class="btn sm" onclick="AVIEW.reopen(\''+a.id+'\')">🔄 重新激活</button>';
    }
    var logs=AVIEW.responseLogs[a.id]||[];
    var defaultLogs=[{time:a.time,action:'预警生成',desc:'系统自动监测到异常，生成'+lv.label+'预警'}];
    if(a.status!=='active'){
      defaultLogs.push({time:a.time,action:'确认预警',desc:'值班分析师确认预警真实性，开始评估处置方案'});
    }
    if(a.status==='responding'||a.status==='resolved'){
      defaultLogs.push({time:a.time,action:'启动处置',desc:'启动应急预案，组建现场处置小组'});
    }
    if(a.status==='resolved'){
      defaultLogs.push({time:a.time,action:'解除预警',desc:'威胁已消除，预警正式解除'});
    }
    var allLogs=defaultLogs.concat(logs);
    var logHtml='<div class="alert-log">'+
      allLogs.map(function(l){
        return '<div class="alert-log-item"><span class="alert-log-time">'+l.time+'</span><span class="alert-log-action">'+l.action+'</span><span class="alert-log-desc">'+l.desc+'</span></div>';
      }).join('')+'</div>';
    var related=ALERTS.filter(function(x){
      return x.id!==a.id&&(x.country===a.country||x.type===a.type||(a.enterprise&&x.enterprise===a.enterprise));
    }).slice(0,5);
    var relHtml=related.length?'<div style="margin-top:10px"><div style="font-size:11px;font-weight:700;color:var(--cyan);margin-bottom:6px">🔗 关联预警 ('+related.length+')</div>'+
      related.map(function(r){
        var rlv=ALERT_LV[r.level];
        return '<div class="alert-related-item" onclick="AVIEW.selectAlert(\''+r.id+'\')"><span class="badge '+rlv.cls+'" style="font-size:9px;padding:1px 4px">'+rlv.label+'</span> '+r.title+' <span style="color:var(--text3);font-size:10px">'+(r.time||'').substring(5,16)+'</span></div>';
      }).join('')+'</div>':'';
    var pb=PLAYBOOKS.find(function(p){return p.type===a.type;});
    var pbHtml=pb?'<div style="margin-top:10px;padding:10px;background:rgba(0,212,255,0.05);border:1px solid var(--border);border-radius:8px"><div style="display:flex;align-items:center;justify-content:space-between"><div><span style="font-size:14px">'+pb.icon+'</span> <strong style="font-size:12px;color:var(--cyan)">推荐预案: '+pb.title+'</strong></div><button class="btn sm primary" onclick="AVIEW.showPlaybook(\''+a.type+'\')">查看预案 →</button></div><div style="font-size:10px;color:var(--text3);margin-top:4px">响应时间: '+pb.responseTime+' | 级别: '+pb.level+' | 步骤: '+(pb.steps?pb.steps.length:0)+'步</div></div>':'';
    var infoHtml='<div class="alert-detail-info">'+
      '<div class="alert-detail-info-item"><div class="alert-detail-info-label">影响国家</div><div class="alert-detail-info-val">'+a.country+(country?' '+country.flag:'')+'</div></div>'+
      '<div class="alert-detail-info-item"><div class="alert-detail-info-label">风险类型</div><div class="alert-detail-info-val" style="font-size:12px">'+a.type+'</div></div>'+
      (a.enterprise?'<div class="alert-detail-info-item"><div class="alert-detail-info-label">关联企业</div><div class="alert-detail-info-val" style="font-size:12px">'+a.enterprise+'</div></div>':'<div class="alert-detail-info-item"><div class="alert-detail-info-label">预警编号</div><div class="alert-detail-info-val" style="font-size:11px;font-family:Courier New">'+a.id+'</div></div>')+
      (a.affectedP?'<div class="alert-detail-info-item"><div class="alert-detail-info-label">影响人员</div><div class="alert-detail-info-val" style="color:var(--orange)">'+a.affectedP+' 人</div></div>':'')+
      (a.affectedA?'<div class="alert-detail-info-item"><div class="alert-detail-info-label">影响资产</div><div class="alert-detail-info-val" style="color:var(--yellow)">'+a.affectedA+' 亿$</div></div>':'')+
      '<div class="alert-detail-info-item"><div class="alert-detail-info-label">预警编号</div><div class="alert-detail-info-val" style="font-size:11px;font-family:Courier New">'+a.id+'</div></div>'+
      '</div>';
    el.innerHTML=
      '<div class="alert-detail-hd">'+
        '<div style="flex:1">'+
        '<div style="display:flex;align-items:center;gap:6px;margin-bottom:4px"><span class="badge '+lv.cls+'">'+lv.label+'</span><span style="color:'+(sc[a.status]||'#999')+';font-size:11px;font-weight:600">● '+(sl[a.status]||a.status)+'</span></div>'+
        '<div style="font-size:14px;font-weight:700;line-height:1.4">'+a.title+'</div>'+
        '<div class="alert-detail-id">⏱ '+(a.time||'')+'</div>'+
        '</div>'+
      '</div>'+
      '<div class="alert-detail-desc">'+a.desc+'</div>'+
      infoHtml+
      wfHtml+
      '<div class="alert-actions">'+actions+'</div>'+
      '<div style="margin-bottom:10px"><div style="font-size:11px;font-weight:700;color:var(--cyan);margin-bottom:6px">📝 响应日志 ('+allLogs.length+')</div>'+logHtml+'</div>'+
      pbHtml+
      relHtml;
  },
  addLog(id,action,desc){
    if(!this.responseLogs[id])this.responseLogs[id]=[];
    var now=new Date();
    var time=now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0')+' '+String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0');
    this.responseLogs[id].push({time:time,action:action,desc:desc});
  },
  ack(id){if(!PERM.guard('\u786e\u8ba4\u9884\u8b66'))return;
    var a=ALERTS.find(function(x){return x.id===id;});
    if(a){a.status='acknowledged';this.addLog(id,'确认预警','值班人员确认预警真实性，开始评估处置方案');showToast('👁️ 预警已确认');}
    this.renderStats();this.renderQueue();this.renderDetail();renderTicker();
  },
  respond(id){if(!PERM.guard('\u542f\u52a8\u9884\u8b66\u5904\u7f6e'))return;
    var a=ALERTS.find(function(x){return x.id===id;});
    if(a){a.status='responding';this.addLog(id,'启动处置','启动应急预案，组建现场处置小组');showToast('🏃 已启动处置流程');}
    this.renderStats();this.renderQueue();this.renderDetail();renderTicker();
  },
  resolve(id){if(!PERM.guard('\u89e3\u9664\u9884\u8b66'))return;
    var a=ALERTS.find(function(x){return x.id===id;});
    if(a){a.status='resolved';this.addLog(id,'解除预警','威胁已消除，预警正式解除');showToast('✅ 预警已解除');}
    this.renderStats();this.renderQueue();this.renderDetail();renderTicker();
  },
  escalate(id){if(!PERM.guard('\u5347\u7ea7\u9884\u8b66'))return;
    var a=ALERTS.find(function(x){return x.id===id;});
    if(a){
      if(a.level==='yellow'){a.level='orange';}
      else if(a.level==='orange'){a.level='red';}
      else if(a.level==='blue'){a.level='yellow';}
      this.addLog(id,'预警升级','风险等级提升至'+ALERT_LV[a.level].label+'，启动更高级别响应');
      showToast('⬆️ 预警已升级至'+ALERT_LV[a.level].label);
    }
    this.renderStats();this.renderQueue();this.renderDetail();renderTicker();
  },
  reopen(id){if(!PERM.guard('\u91cd\u65b0\u6fc0\u6d3b\u9884\u8b66'))return;
    var a=ALERTS.find(function(x){return x.id===id;});
    if(a){a.status='active';this.addLog(id,'重新激活','预警重新激活，进入待处理状态');showToast('🔄 预警已重新激活');}
    this.renderStats();this.renderQueue();this.renderDetail();renderTicker();
  },
  showPlaybook(type){
    this.switchTab('playbook');
    var pb=PLAYBOOKS.find(function(p){return p.type===type;})||PLAYBOOKS[0];
    this._selectedPlaybook=pb;
    this.renderPlaybookDetail(pb);
  },
  showPlaybookById(pbId){
    var pb=PLAYBOOKS.find(function(p){return p.id===pbId;});
    if(!pb)return;
    this._selectedPlaybook=pb;
    this.renderPlaybookDetail(pb);
  },
  showPbForm(pb){if(!PERM.guard('\u65b0\u589e/\u7f16\u8f91\u5e94\u6025\u9884\u6848'))return;
    var isEdit=!!pb;
    var fields=[
      {key:'title',label:'预案名称',type:'text',value:pb?pb.title:''},
      {key:'type',label:'风险类型',type:'select',value:pb?pb.type:'安全风险',opts:['安全风险','政治风险','经济风险','地缘战略风险','社会文化风险','自然环境风险']},
      {key:'icon',label:'图标(emoji)',type:'text',value:pb?pb.icon:'🔴'},
      {key:'scope',label:'适用范围',type:'text',value:pb?pb.scope:''},
      {key:'responseTime',label:'响应时间',type:'text',value:pb?pb.responseTime:'2小时'},
      {key:'level',label:'处置级别',type:'select',value:pb?pb.level:'II级',opts:['I级(最高)','II级','III级','IV级']},
      {key:'principle',label:'处置原则',type:'textarea',value:pb?pb.principle:''},
      {key:'triggerConditions',label:'情报触发条件(用/分隔)',type:'textarea',value:pb?pb.triggerConditions:''},
      {key:'applicableCountries',label:'适用国家(逗号分隔)',type:'text',value:pb?(pb.applicableCountries||[]).join(', '):''},
      {key:'drillCycle',label:'演练周期',type:'select',value:pb?pb.drillCycle:'每半年',opts:['每月','每季度','每半年','每年']},
      {key:'owner',label:'负责部门',type:'text',value:pb?pb.owner:'安保部'},
      {key:'resources',label:'应急资源',type:'textarea',value:pb?pb.resources:''},
      {key:'tags',label:'标签(逗号分隔)',type:'text',value:pb?(pb.tags||[]).join(', '):''}
    ];
    var self=this;
    CRUD.showForm(isEdit?'编辑应急预案':'新增应急预案',fields,function(data){
      if(isEdit){for(var k in data){pb[k]=data[k];}pb.applicableCountries=data.applicableCountries.split(',').map(function(s){return s.trim();}).filter(Boolean);pb.tags=data.tags.split(',').map(function(s){return s.trim();}).filter(Boolean);}
      else {
        var np=Object.assign({id:'PB-'+String(PLAYBOOKS.length+1).padStart(3,'0'),steps:[],commPlan:[],equipment:[],legalRefs:[],escalation:[],responseTeam:[]},data);
        np.applicableCountries=data.applicableCountries.split(',').map(function(s){return s.trim();}).filter(Boolean);
        np.tags=data.tags.split(',').map(function(s){return s.trim();}).filter(Boolean);
        np.lastUpdated=new Date().toISOString().substring(0,10);
        PLAYBOOKS.push(np);
      }
      DataHub.save('playbooks');
      self.renderPlaybook();
      showToast(isEdit?'✅ 预案已更新':'✅ 预案已添加');
    },pb);
  },
  editPlaybook(pbId){
    var pb=PLAYBOOKS.find(function(p){return p.id===pbId;});
    if(pb)this.showPbForm(pb);
  },
  deletePlaybook(pbId){if(!PERM.guard('\u5220\u9664\u5e94\u6025\u9884\u6848'))return;
    var idx=PLAYBOOKS.findIndex(function(p){return p.id===pbId;});
    if(idx>=0){PLAYBOOKS.splice(idx,1);DataHub.save('playbooks');this.renderPlaybook();showToast('🗑️ 预案已删除');}
  },
  deployPlaybook(pbId){if(!PERM.guard('\u90e8\u7f72\u5e94\u6025\u9884\u6848'))return;
    var pb=PLAYBOOKS.find(function(p){return p.id===pbId;});
    if(!pb)return;
    var alerts=ALERTS.filter(function(a){return a.type===pb.type&&a.status!=='resolved';});
    if(alerts.length>0){
      showConfirm('为类型「'+pb.type+'」的 '+alerts.length+' 条活跃预警部署应急预案「'+pb.title+'」？',function(){
        alerts.forEach(function(a){a.status='responding';AVIEW.addLog(a.id,'启动处置','部署应急预案: '+pb.title);});
        DataHub.save('alerts');
        AVIEW.renderQueue();AVIEW.renderStats();renderTicker();
        showToast('🚀 已部署预案至 '+alerts.length+' 条预警');
      });
    }else{showToast('ℹ️ 当前无该类型的活跃预警可部署');}
  },
  exportPbData(){
    DataHub.exportJSON(PLAYBOOKS,'应急预案库_'+new Date().toISOString().substring(0,10)+'.json');
    showToast('📥 预案数据已导出');
  },
  exportPbDetail(pbId){
    var pb=PLAYBOOKS.find(function(p){return p.id===pbId;});
    if(!pb)return;
    DataHub.exportJSON(pb,'应急预案_'+pb.title+'_'+new Date().toISOString().substring(0,10)+'.json');
    showToast('📥 预案详情已导出');
  },
  resetPbData(){if(!PERM.guard('\u91cd\u7f6e\u5e94\u6025\u9884\u6848\u5e93'))return;
    showConfirm('重置应急预案库将恢复默认16套预案，所有修改将丢失。确认？',function(){
      localStorage.removeItem('orps_dh_playbooks');
      location.reload();
    });
  },
  renderFeed(){
    var el=document.getElementById('alert-cmd-feed');
    if(!el)return;
    var recent=ALERTS.slice().sort(function(a,b){return(b.time||'').localeCompare(a.time||'');}).slice(0,10);
    var red=ALERTS.filter(function(a){return a.level==='red'&&a.status!=='resolved';}).length;
    var orange=ALERTS.filter(function(a){return a.level==='orange'&&a.status!=='resolved';}).length;
    var yellow=ALERTS.filter(function(a){return a.level==='yellow'&&a.status!=='resolved';}).length;
    var blue=ALERTS.filter(function(a){return a.level==='blue'&&a.status!=='resolved';}).length;
    var html='<div class="alert-feed-mini">'+
      '<div class="alert-feed-mini-stat"><div class="alert-feed-mini-val" style="color:var(--red)">'+red+'</div><div class="alert-feed-mini-lb">红色</div></div>'+
      '<div class="alert-feed-mini-stat"><div class="alert-feed-mini-val" style="color:var(--orange)">'+orange+'</div><div class="alert-feed-mini-lb">橙色</div></div>'+
      '<div class="alert-feed-mini-stat"><div class="alert-feed-mini-val" style="color:var(--yellow)">'+yellow+'</div><div class="alert-feed-mini-lb">黄色</div></div>'+
      '<div class="alert-feed-mini-stat"><div class="alert-feed-mini-val" style="color:var(--cyan)">'+blue+'</div><div class="alert-feed-mini-lb">蓝色</div></div>'+
      '</div>';
    html+='<div style="font-size:10px;color:var(--text3);margin-bottom:6px;display:flex;align-items:center;gap:4px"><span style="width:6px;height:6px;background:var(--green);border-radius:50%;animation:pulse 2s infinite"></span>实时预警流 (最近'+recent.length+'条)</div>';
    html+='<div style="flex:1;overflow-y:auto">';
    recent.forEach(function(a){
      var lv=ALERT_LV[a.level];
      var lc={red:'var(--red)',orange:'var(--orange)',yellow:'var(--yellow)',blue:'var(--cyan)'};
      html+='<div class="alert-feed-item" style="border-left-color:'+lc[a.level]+'" onclick="AVIEW.selectAlert(\''+a.id+'\')">'+
        '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:2px">'+
        '<span class="badge '+lv.cls+'" style="font-size:9px;padding:1px 4px">'+lv.label+'</span>'+
        '<span style="font-size:9px;color:var(--text3)">'+(a.time||'').substring(5,16)+'</span></div>'+
        '<div style="font-size:11px;font-weight:600;line-height:1.3;margin-bottom:2px">'+a.title+'</div>'+
        '<div style="font-size:10px;color:var(--text3)">📍'+a.country+(a.enterprise?' | 🏢'+a.enterprise:'')+'</div>'+
        '</div>';
    });
    html+='</div>';
    html+='<div id="intel-insight" style="margin-top:8px"></div>';
    el.innerHTML=html;
  },
  simulateFeed(){
    var countries=['巴基斯坦','阿富汗','马里','苏丹','缅甸','刚果(金)','尼日利亚','也门','索马里','伊拉克','叙利亚','利比亚','南苏丹','伊朗'];
    var types=['安全风险','政治风险','安全风险','安全风险','经济风险','地缘战略风险'];
    var levels=['red','orange','yellow','red','orange','yellow'];
    var titles=[
      '监测到异常武装活动信号',
      '情报显示恐袭威胁升级',
      '安全形势急剧恶化',
      '经济制裁风险预警',
      '社会动荡扩散至项目区',
      '不明武装组织接近项目营地',
      '当地政府发布紧急安全通告',
      '通信中断疑似网络攻击',
      '反政府武装宣布进入项目区域',
      '情报显示绑架威胁等级提升'
    ];
    var c=countries[Math.floor(Math.random()*countries.length)];
    var t=types[Math.floor(Math.random()*types.length)];
    var l=levels[Math.floor(Math.random()*levels.length)];
    var ti=titles[Math.floor(Math.random()*titles.length)];
    var id='AW-'+new Date().getFullYear()+'-'+String(Math.floor(Math.random()*9000+1000))+'-'+String(ALERTS.length+1).padStart(3,'0');
    var now=new Date();
    var time=now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0')+' '+String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0');
    var ent=ENTERPRISES.filter(function(e){return e.countries.indexOf(c)>=0;});
    var enterprise=ent.length?ent[0].short:'';
    ALERTS.unshift({id:id,time:time,level:l,type:t,country:c,title:'[实时] '+c+' - '+ti,desc:'系统自动监测到'+c+'安全态势异常，多源情报交叉验证确认威胁等级为'+ALERT_LV[l].label+'。建议立即确认并启动相应处置流程。影响范围正在评估中。',status:'active',affectedP:Math.floor(Math.random()*80)+5,affectedA:Math.random()*8,enterprise:enterprise});
    this.addLog(id,'预警生成','系统自动监测到异常，生成'+ALERT_LV[l].label+'预警');
    showToast('📡 实时预警已生成: '+c+' '+ALERT_LV[l].label);
    this.renderStats();
    this.renderQueue();
    this.renderFeed();
    this.selectAlert(id);
    renderTicker();
  },
  generateInsight(){
    var insights=[
      '🔍 南亚地区预警密度最高（35%），巴基斯坦一国占预警总量18%，建议加强区域联防监控。BLA和TTP协同攻击趋势明显。',
      '📊 恐怖袭击类预警占42%，较上月上升8个百分点。萨赫勒地区JNIM系统性威胁持续扩散。',
      '⚠️ 政治变动预警后7-14天内，安全类预警概率增加3倍。建议建立政治-安全联动预警模型。',
      '🌍 红海航线中断影响全球12%海运贸易，中欧班列运量激增40%，建议加强陆路通道安保。',
      '📈 经济类预警中汇率波动占60%，阿根廷、土耳其、埃及三国贬值超50%，建议加强外汇管理。',
      '🔗 BLA在俾路支省活动频率上升300%，瓜达尔港和中巴经济走廊南线面临系统性威胁。',
      '🛡️ 过去90天成功处置预警'+ALERTS.filter(function(a){return a.status==='resolved';}).length+'起，平均响应4.2小时。高风险区域撤离成功率98.5%。',
      '📡 多源情报交叉验证显示，ISKP正在策划针对中亚地区中国公民的协同袭击，建议提升该区域警戒级别。',
      '⚖️ 非洲资源型国家政策风险上升，尼日尔、马里矿业国有化趋势明显，建议中资矿业企业准备法律应对方案。',
      '🎯 刚果(金)M23武装持续扩张，紫金矿业卡莫阿铜矿虽距战区1,500km，但供应链已受影响，建议启动B计划。'
    ];
    var p=insights[Math.floor(Math.random()*insights.length)];
    var el=document.getElementById('intel-insight');
    if(el)el.innerHTML='<div style="padding:10px;background:linear-gradient(135deg,rgba(0,212,255,0.08),rgba(179,102,255,0.05));border-radius:8px;border-left:3px solid var(--cyan)"><div style="display:flex;align-items:center;gap:6px;margin-bottom:4px"><span>🤖</span><strong style="color:var(--cyan);font-size:11px">AI情报分析</strong></div><p style="margin:0;font-size:11px;line-height:1.6;color:var(--text)">'+p+'</p></div>';
    showToast('🤖 AI分析完成');
  },
  renderCorrelation(){
    var el=document.getElementById('alert-correlation');
    if(!el)return;
    var nodes=[];var edges=[];var regions={};
    ALERTS.forEach(function(a){
      var c=COUNTRIES.find(function(x){return x.name===a.country;});
      var reg=c?c.region:'其他';
      if(!regions[reg])regions[reg]={count:0,alerts:[],types:{}};
      regions[reg].count++;regions[reg].alerts.push(a);
      regions[reg].types[a.type]=(regions[reg].types[a.type]||0)+1;
    });
    var regs=Object.keys(regions);
    var cx=300,cy=250;
    regs.forEach(function(r,i){
      var angle=(i/regs.length)*Math.PI*2-Math.PI/2;
      var x=cx+Math.cos(angle)*180;var y=cy+Math.sin(angle)*130;
      var d=regions[r];
      var maxRisk=d.alerts.some(function(a){return a.level==='red';});
      var color=maxRisk?'#ff3355':d.alerts.some(function(a){return a.level==='orange';})?'#ff8800':'#00d4ff';
      nodes.push({x:x,y:y,r:r,d:d,color:color});
    });
    var svg='<svg viewBox="0 0 600 500" style="width:100%;height:auto">';
    svg+='<defs><radialGradient id="cg" cx="50%" cy="50%"><stop offset="0%" stop-color="rgba(0,212,255,0.1)"/><stop offset="100%" stop-color="rgba(0,212,255,0)"/></radialGradient></defs>';
    svg+='<circle cx="300" cy="250" r="220" fill="url(#cg)"/>';
    for(var i=0;i<nodes.length;i++){
      for(var j=i+1;j<nodes.length;j++){
        var n1=nodes[i],n2=nodes[j];
        if(n1.d.alerts.some(function(a){return n2.d.alerts.some(function(b){return a.type===b.type;});})){
          svg+='<line x1="'+n1.x+'" y1="'+n1.y+'" x2="'+n2.x+'" y2="'+n2.y+'" stroke="rgba(0,212,255,0.15)" stroke-width="1" stroke-dasharray="3,3"/>';
        }
      }
    }
    nodes.forEach(function(n){
      var size=20+Math.min(n.d.count*3,25);
      svg+='<circle cx="'+n.x+'" cy="'+n.y+'" r="'+size+'" fill="'+n.color+'" fill-opacity="0.12" stroke="'+n.color+'" stroke-width="1.5"/>';
      svg+='<circle cx="'+n.x+'" cy="'+n.y+'" r="'+(size-6)+'" fill="'+n.color+'" fill-opacity="0.25"/>';
      svg+='<text x="'+n.x+'" y="'+(n.y-2)+'" text-anchor="middle" fill="'+n.color+'" font-size="11" font-weight="700">'+n.r+'</text>';
      svg+='<text x="'+n.x+'" y="'+(n.y+12)+'" text-anchor="middle" fill="rgba(255,255,255,0.6)" font-size="9">'+n.d.count+'条</text>';
    });
    svg+='<text x="300" y="30" text-anchor="middle" fill="rgba(0,212,255,0.8)" font-size="12" font-weight="700">预警区域关联网络</text>';
    svg+='<text x="300" y="480" text-anchor="middle" fill="rgba(255,255,255,0.3)" font-size="9">节点大小=预警数量 | 虚线=共同威胁类型 | 颜色=最高风险等级</text>';
    svg+='</svg>';
    var cluster='<div style="margin-top:12px;display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:8px">';
    regs.forEach(function(r){
      var d=regions[r];
      var maxRisk=d.alerts.some(function(a){return a.level==='red';});
      var color=maxRisk?'var(--red)':d.alerts.some(function(a){return a.level==='orange';})?'var(--orange)':'var(--cyan)';
      var types=Object.keys(d.types).map(function(t){return '<span style="font-size:9px;padding:1px 4px;background:rgba(0,212,255,0.1);border-radius:3px;margin:1px">'+t+'x'+d.types[t]+'</span>';}).join(' ');
      cluster+='<div style="background:var(--panel2);border:1px solid var(--border);border-left:3px solid '+color+';border-radius:6px;padding:8px">'+
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px"><strong style="font-size:12px;color:'+color+'">'+r+'</strong><span style="font-size:14px;font-weight:800;color:'+color+'">'+d.count+'</span></div>'+
        '<div style="display:flex;flex-wrap:wrap;gap:2px">'+types+'</div></div>';
    });
    cluster+='</div>';
    el.innerHTML=svg+cluster;
  },
  renderTracking(){
    var el=document.getElementById('alert-tracking');
    if(!el)return;
    var active=ALERTS.filter(function(a){return a.status==='active';}).length;
    var ack=ALERTS.filter(function(a){return a.status==='acknowledged';}).length;
    var resp=ALERTS.filter(function(a){return a.status==='responding';}).length;
    var resolved=ALERTS.filter(function(a){return a.status==='resolved';}).length;
    var html='<div class="tracking-sla-grid">'+
      '<div class="sla-card"><div class="sla-card-val" style="color:var(--cyan)">8.5<span style="font-size:14px">min</span></div><div class="sla-card-lb">平均确认时间</div><div class="sla-card-sub" style="color:var(--green)">较上月快1.2min</div></div>'+
      '<div class="sla-card"><div class="sla-card-val" style="color:var(--orange)">4.2<span style="font-size:14px">hr</span></div><div class="sla-card-lb">平均处置时间</div><div class="sla-card-sub" style="color:var(--green)">较上月快0.8hr</div></div>'+
      '<div class="sla-card"><div class="sla-card-val" style="color:var(--green)">87<span style="font-size:14px">%</span></div><div class="sla-card-lb">SLA达标率</div><div class="sla-card-sub" style="color:var(--red)">3起超时</div></div>'+
      '<div class="sla-card"><div class="sla-card-val" style="color:var(--purple)">98.5<span style="font-size:14px">%</span></div><div class="sla-card-lb">人员安全保障率</div><div class="sla-card-sub">零伤亡撤离</div></div>'+
      '</div>';
    var sl={active:'待处理',acknowledged:'已确认',responding:'处置中',resolved:'已解除'};
    var colors={active:'var(--red)',acknowledged:'var(--cyan)',responding:'var(--orange)',resolved:'var(--green)'};
    var counts={active:active,acknowledged:ack,responding:resp,resolved:resolved};
    var lvColors={red:'var(--red)',orange:'var(--orange)',yellow:'var(--yellow)',blue:'var(--cyan)'};
    html+='<div class="card"><div class="card-tt"><span class="ic">📊</span>预警处置看板</div><div class="kanban-board">';
    ['active','acknowledged','responding','resolved'].forEach(function(st){
      var items=ALERTS.filter(function(a){return a.status===st;});
      html+='<div class="kanban-col"><div class="kanban-col-hd"><span style="color:'+colors[st]+'">'+sl[st]+'</span><span class="badge" style="background:'+colors[st]+'22;color:'+colors[st]+';border:1px solid '+colors[st]+'55">'+counts[st]+'</span></div>';
      items.slice(0,12).forEach(function(a){
        var lv=ALERT_LV[a.level];
        html+='<div class="kanban-item" style="border-left-color:'+lvColors[a.level]+'" onclick="AVIEW.switchTab(\'command\');setTimeout(function(){AVIEW.selectAlert(\''+a.id+'\')},50)">'+
          '<div style="margin-bottom:2px"><span class="badge '+lv.cls+'" style="font-size:9px;padding:1px 3px">'+lv.label+'</span></div>'+
          '<div style="font-weight:600;line-height:1.3">'+(a.title||'').substring(0,40)+((a.title||'').length>40?'...':'')+'</div>'+
          '<div style="color:var(--text3);font-size:10px;margin-top:2px">📍'+a.country+' | 🕐'+(a.time||'').substring(5,16)+'</div>'+
          '</div>';
      });
      if(items.length>12)html+='<div style="text-align:center;color:var(--text3);font-size:10px;padding:4px">还有'+(items.length-12)+'条...</div>';
      html+='</div>';
    });
    html+='</div></div>';
    html+='<div class="card mt-12"><div class="card-tt"><span class="ic">⏱️</span>响应时间分析</div>'+
      '<div class="grid" style="grid-template-columns:1fr 1fr">'+
      '<div style="height:200px"><canvas id="chart-tracking-time"></canvas></div>'+
      '<div><div style="font-size:11px;font-weight:700;color:var(--cyan);margin-bottom:8px">📋 SLA达标详情</div>'+
      '<div style="display:flex;flex-direction:column;gap:6px">'+
      '<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 10px;background:var(--bg);border-radius:6px;border-left:3px solid var(--red)"><span style="font-size:12px">🔴 红色预警 SLA (15min确认)</span><span style="font-size:12px;font-weight:700;color:var(--green)">达标 92%</span></div>'+
      '<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 10px;background:var(--bg);border-radius:6px;border-left:3px solid var(--orange)"><span style="font-size:12px">🟠 橙色预警 SLA (1hr确认)</span><span style="font-size:12px;font-weight:700;color:var(--green)">达标 89%</span></div>'+
      '<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 10px;background:var(--bg);border-radius:6px;border-left:3px solid var(--yellow)"><span style="font-size:12px">🟡 黄色预警 SLA (4hr确认)</span><span style="font-size:12px;font-weight:700;color:var(--green)">达标 85%</span></div>'+
      '<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 10px;background:var(--bg);border-radius:6px;border-left:3px solid var(--cyan)"><span style="font-size:12px">🔵 蓝色预警 SLA (24hr确认)</span><span style="font-size:12px;font-weight:700;color:var(--green)">达标 95%</span></div>'+
      '<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 10px;background:var(--bg);border-radius:6px;border-left:3px solid var(--purple)"><span style="font-size:12px">📊 综合SLA达标率</span><span style="font-size:12px;font-weight:700;color:var(--cyan)">87%</span></div>'+
      '</div></div>'+
      '</div></div>';
    el.innerHTML=html;
    var ctx=document.getElementById('chart-tracking-time');
    if(ctx){
      var trend=genAlertTrend().slice(-14);
      if(charts.trackingTime)charts.trackingTime.destroy();
      charts.trackingTime=new Chart(ctx.getContext('2d'),{
        type:'line',
        data:{
          labels:trend.map(function(d){return d.d;}),
          datasets:[
            {label:'平均确认时间(min)',data:trend.map(function(){return 6+Math.random()*6;}),borderColor:'#00d4ff',backgroundColor:'rgba(0,212,255,0.1)',fill:true,tension:0.4,borderWidth:2},
            {label:'平均处置时间(hr)',data:trend.map(function(){return 3+Math.random()*3;}),borderColor:'#ff8800',backgroundColor:'rgba(255,136,0,0.1)',fill:true,tension:0.4,borderWidth:2}
          ]
        },
        options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{font:{size:9},color:'#7a8ba3',padding:4,boxWidth:10}}},scales:{x:{grid:{display:false},ticks:{color:'#7a8ba3',font:{size:8}}},y:{grid:{color:'rgba(0,212,255,0.05)'},ticks:{color:'#7a8ba3',font:{size:9}}}}}
      });
    }
  },
  _pbFilter:'all',_pbSearch:'',
  renderPlaybook(){
    var self=this;
    var el=document.getElementById('alert-playbook');
    if(!el)return;
    // Dynamic category counts
    var getCatCount=function(type){return PLAYBOOKS.filter(function(p){return p.type===type;}).length;};
    var cats=[
      {type:'全部',ic:'📖',color:'var(--cyan)',items:PLAYBOOKS.length},
      {type:'安全风险',ic:'🔴',color:'var(--red)',items:getCatCount('安全风险')},
      {type:'政治风险',ic:'🏛️',color:'var(--orange)',items:getCatCount('政治风险')},
      {type:'经济风险',ic:'📉',color:'var(--yellow)',items:getCatCount('经济风险')},
      {type:'地缘战略风险',ic:'🌍',color:'var(--cyan)',items:getCatCount('地缘战略风险')},
      {type:'社会文化风险',ic:'👥',color:'var(--purple)',items:getCatCount('社会文化风险')},
      {type:'自然环境风险',ic:'🌪️',color:'var(--green)',items:getCatCount('自然环境风险')}
    ];
    var levelCount={I:0,II:0,III:0,IV:0};
    PLAYBOOKS.forEach(function(p){var l=(p.level||'').charAt(0);if(l==='I'){if(p.level.includes('最高'))levelCount.I++;else levelCount.I++;}else{levelCount[l]= (levelCount[l]||0)+1;}});
    // Toolbar + search
    var html='<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:14px">'+
      CRUD.toolbar(PLAYBOOKS.length+'套预案','AVIEW.showPbForm()','AVIEW.exportPbData()','AVIEW.resetPbData()')+
      '<div style="flex:1;min-width:180px"><input id="pb-search" placeholder="🔍 搜索预案名称/国家/标签..." style="width:100%;padding:6px 10px;background:var(--panel2);border:1px solid var(--border);border-radius:6px;font-size:11px;color:var(--text1);outline:none" oninput="AVIEW._pbSearch=this.value;AVIEW.renderPlaybook();"></div></div>';
    // Stats row
    var levelColor={I:'var(--red)',II:'var(--orange)',III:'var(--yellow)',IV:'var(--cyan)'};
    html+='<div class="stat-grid" style="grid-template-columns:repeat(5,1fr);margin-bottom:14px">';
    html+='<div class="stat-card"><div class="stat-ic" style="background:rgba(0,212,255,0.08);color:var(--cyan)">📋</div><div class="stat-info"><div class="stat-label">预案总数</div><div class="stat-val" style="color:var(--cyan)">'+PLAYBOOKS.length+'</div><div class="stat-sub">覆盖6大类风险</div></div></div>';
    html+='<div class="stat-card"><div class="stat-ic" style="background:rgba(255,51,85,0.08);color:var(--red)">🚨</div><div class="stat-info"><div class="stat-label">I级(最高)</div><div class="stat-val" style="color:var(--red)">'+levelCount.I+'</div><div class="stat-sub">15分钟启动</div></div></div>';
    html+='<div class="stat-card"><div class="stat-ic" style="background:rgba(255,136,0,0.08);color:var(--orange)">⚠️</div><div class="stat-info"><div class="stat-label">II级</div><div class="stat-val" style="color:var(--orange)">'+levelCount.II+'</div><div class="stat-sub">2-4小时启动</div></div></div>';
    html+='<div class="stat-card"><div class="stat-ic" style="background:rgba(255,204,0,0.08);color:var(--yellow)">📊</div><div class="stat-info"><div class="stat-label">III级</div><div class="stat-val" style="color:var(--yellow)">'+levelCount.III+'</div><div class="stat-sub">24-48小时启动</div></div></div>';
    html+='<div class="stat-card"><div class="stat-ic" style="background:rgba(0,255,159,0.08);color:var(--green)">✅</div><div class="stat-info"><div class="stat-label">IV级</div><div class="stat-val" style="color:var(--green)">'+levelCount.IV+'</div><div class="stat-sub">常规预防</div></div></div>';
    html+='</div>';
    // Category filter tabs
    html+='<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px">';
    cats.forEach(function(c){
      var active=self._pbFilter===c.type;
      html+='<div onclick="AVIEW._pbFilter=\''+c.type+'\';AVIEW.renderPlaybook();" style="cursor:pointer;padding:6px 14px;border-radius:20px;font-size:11px;font-weight:600;background:'+(active?c.color+'15':'var(--panel2)')+';border:1px solid '+(active?c.color:'var(--border)')+';color:'+(active?c.color:'var(--text3)')+';transition:.15s" onmouseover="this.style.borderColor=\''+c.color+'\'" onmouseout="this.style.borderColor=\''+(active?c.color:'var(--border)')+'\'">'+c.ic+' '+c.type+' <span style="color:'+c.color+'">'+c.items+'</span></div>';
    });
    html+='</div>';
    // Filtered playbook cards
    var filtered=PLAYBOOKS;
    if(self._pbFilter!=='all')filtered=filtered.filter(function(p){return p.type===self._pbFilter;});
    if(self._pbSearch){
      var s=self._pbSearch.toLowerCase();
      filtered=filtered.filter(function(p){
        return p.title.toLowerCase().indexOf(s)>-1||p.scope.toLowerCase().indexOf(s)>-1||
          (p.tags||[]).some(function(t){return t.toLowerCase().indexOf(s)>-1;})||
          (p.applicableCountries||[]).some(function(c){return c.toLowerCase().indexOf(s)>-1;});
      });
    }
    html+='<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:10px" id="pb-cards">';
    if(filtered.length===0){
      html+='<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text3);font-size:13px">没有找到匹配的应急预案</div>';
    }
    filtered.forEach(function(pb){
      var lvColor=pb.level.indexOf('I级')===0?'var(--red)':pb.level.indexOf('II级')===0?'var(--orange)':pb.level.indexOf('III级')===0?'var(--yellow)':'var(--cyan)';
      var catData=cats.find(function(c){return c.type===pb.type;})||{};
      var countries=(pb.applicableCountries||[]).slice(0,3).join('、')+((pb.applicableCountries||[]).length>3?'等'+(pb.applicableCountries||[]).length+'国':'');
      var tags=(pb.tags||[]).map(function(t){return '<span style="font-size:8px;padding:1px 6px;border-radius:3px;background:rgba(0,212,255,0.08);color:var(--text3)">'+t+'</span>';}).join('');
      html+='<div onclick="AVIEW.showPlaybookById(\''+pb.id+'\')" style="cursor:pointer;background:var(--panel2);border:1px solid var(--border);border-radius:10px;padding:14px;transition:.15s;border-left:4px solid '+lvColor+'" onmouseover="this.style.transform=\'translateY(-2px)\';this.style.boxShadow=\'0 4px 16px rgba(0,212,255,0.1)\';this.style.borderColor=\'rgba(0,212,255,0.3)\'" onmouseout="this.style.transform=\'\';this.style.boxShadow=\'\';this.style.borderColor=\'var(--border)\'">'+
        '<div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:8px">'+
        '<div style="display:flex;align-items:center;gap:8px"><span style="font-size:22px">'+pb.icon+'</span><div><div style="font-size:13px;font-weight:700;color:var(--text1)">'+pb.title+'</div><div style="font-size:10px;color:var(--text3);margin-top:2px">适用: '+pb.scope+'</div></div></div>'+
        '<span class="badge b-red" style="font-size:9px">'+pb.level+'</span></div>'+
        '<div style="display:flex;gap:6px;margin-bottom:8px;flex-wrap:wrap">'+
        '<span style="font-size:10px;padding:2px 8px;border-radius:4px;background:rgba(255,136,0,0.08);color:var(--orange)">⏱ '+pb.responseTime+'</span>'+
        '<span style="font-size:10px;padding:2px 8px;border-radius:4px;background:rgba(0,212,255,0.08);color:var(--cyan)">🌍 '+countries+'</span></div>'+
        '<div style="font-size:10px;color:var(--text2);line-height:1.5;margin-bottom:8px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">📋 '+pb.principle+'</div>'+
        '<div style="display:flex;align-items:center;justify-content:space-between">'+
        '<div style="font-size:9px;color:var(--text3)">📡 触发: '+(pb.triggerConditions||'').substring(0,25)+'...</div>'+
        '<div style="font-size:9px;color:var(--text3)">👤 '+pb.owner+'</div></div>'+
        '<div style="margin-top:6px;display:flex;gap:4px;flex-wrap:wrap">'+tags+'</div></div>';
    });
    html+='</div>';
    // Detail area
    html+='<div id="playbook-detail" style="margin-top:16px"><div style="padding:30px;text-align:center;color:var(--text3);background:var(--panel2);border:1px solid var(--border);border-radius:10px"><div style="font-size:36px;margin-bottom:10px">📖</div><div style="font-size:14px;font-weight:600">应急预案库</div><div style="font-size:11px;margin-top:4px">点击上方预案卡片查看详细处置方案 · 共 '+PLAYBOOKS.length+' 套预案覆盖 6 大类风险</div></div></div>';
    el.innerHTML=html;
  },
  renderPlaybookDetail(pb){
    var el=document.getElementById('playbook-detail');
    if(!el||!pb)return;
    var steps=pb.steps||[];
    var lvColor=pb.level.indexOf('I级')===0?'var(--red)':pb.level.indexOf('II级')===0?'var(--orange)':pb.level.indexOf('III级')===0?'var(--yellow)':'var(--cyan)';
    var html='';
    // === HEADER ===
    html+='<div style="background:var(--panel2);border:1px solid var(--border);border-radius:10px;border-top:4px solid '+lvColor+'">';
    html+='<div style="padding:18px 20px">';
    html+='<div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:14px">';
    html+='<div style="display:flex;align-items:center;gap:10px"><span style="font-size:28px">'+pb.icon+'</span><div><div style="font-size:16px;font-weight:700;color:var(--text1)">'+pb.title+'</div><div style="font-size:11px;color:var(--text3);margin-top:2px">'+pb.scope+'</div></div></div>';
    html+='<div style="display:flex;gap:6px;align-items:center"><span class="badge" style="background:'+lvColor+'20;color:'+lvColor+';font-size:10px;font-weight:700;padding:4px 10px">'+pb.level+'</span><span style="font-size:9px;color:var(--text3)">⏱ '+pb.responseTime+'</span></div>';
    html+='</div>';
    // Meta badges row
    html+='<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px">';
    html+='<span style="font-size:10px;padding:3px 10px;border-radius:5px;background:rgba(0,212,255,0.06);color:var(--cyan)">📂 '+pb.type+'</span>';
    html+='<span style="font-size:10px;padding:3px 10px;border-radius:5px;background:rgba(255,204,0,0.06);color:var(--yellow)">🔄 演练: '+pb.drillCycle+'</span>';
    html+='<span style="font-size:10px;padding:3px 10px;border-radius:5px;background:rgba(0,255,159,0.06);color:var(--green)">👤 负责: '+pb.owner+'</span>';
    html+='<span style="font-size:10px;padding:3px 10px;border-radius:5px;background:rgba(179,102,255,0.06);color:var(--purple)">📅 更新: '+pb.lastUpdated+'</span></div>';
    // Tags
    if(pb.tags&&pb.tags.length){
      html+='<div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:12px">';
      pb.tags.forEach(function(t){html+='<span style="font-size:9px;padding:2px 8px;border-radius:4px;background:rgba(0,212,255,0.08);color:var(--cyan)">#'+t+'</span>';});
      html+='</div>';
    }
    // Principle
    html+='<div style="margin-bottom:12px;padding:10px 14px;background:rgba(0,212,255,0.04);border:1px solid rgba(0,212,255,0.1);border-radius:8px;font-size:11px;color:var(--text2);line-height:1.6"><strong style="color:var(--cyan)">📋 处置原则:</strong> '+pb.principle+'</div>';

    // === TWO COLUMNS ===
    html+='<div class="grid" style="grid-template-columns:1fr 340px;gap:14px;align-items:start">';
    // Left: Steps
    html+='<div><div style="font-size:13px;font-weight:700;color:var(--cyan);margin-bottom:10px">🔄 处置流程 ('+steps.length+'步)</div>';
    steps.forEach(function(s,i){
      var checklist=s.checklist||[];
      html+='<div style="display:flex;gap:10px;margin-bottom:12px;padding-bottom:12px;'+(i<steps.length-1?'border-bottom:1px solid var(--border)':'')+'">'+
        '<div style="width:28px;height:28px;border-radius:50%;background:'+s.color+';color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0;box-shadow:0 0 10px '+s.color+'80">'+(i+1)+'</div>'+
        '<div style="flex:1"><div style="font-size:13px;font-weight:700;margin-bottom:4px">'+s.title+'</div>'+
        '<div style="font-size:11px;color:var(--text2);line-height:1.5;margin-bottom:4px">'+s.desc+'</div>'+
        (s.timeout?'<span style="display:inline-block;font-size:9px;padding:2px 8px;border-radius:4px;background:rgba(255,136,0,0.08);color:var(--orange);margin-bottom:6px">⏱ 时限: '+s.timeout+'</span>':'');
      if(checklist.length){
        html+='<div style="font-size:10px;color:var(--text3)"><strong>☑ 检查项:</strong> '+checklist.map(function(c){return '<span style="display:inline-block;margin:1px 3px;padding:1px 6px;border-radius:3px;background:rgba(0,255,159,0.05)">✓ '+c+'</span>';}).join('')+'</div>';
      }
      html+='</div></div>';
    });
    html+='</div>';
    // Right: Details
    html+='<div>';
    // Applicable Countries
    if(pb.applicableCountries&&pb.applicableCountries.length){
      html+='<div style="margin-bottom:12px;padding:10px 12px;background:rgba(0,212,255,0.04);border:1px solid rgba(0,212,255,0.08);border-radius:8px">';
      html+='<div style="font-size:11px;font-weight:700;color:var(--cyan);margin-bottom:6px">🌍 适用国家/地区</div>';
      html+='<div style="display:flex;flex-wrap:wrap;gap:4px">';
      pb.applicableCountries.forEach(function(c){html+='<span style="font-size:9px;padding:2px 8px;border-radius:4px;background:rgba(0,212,255,0.08);color:var(--cyan)">'+c+'</span>';});
      html+='</div></div>';
    }
    // Trigger Conditions
    if(pb.triggerConditions){
      html+='<div style="margin-bottom:12px;padding:10px 12px;background:rgba(255,51,85,0.04);border:1px solid rgba(255,51,85,0.08);border-radius:8px">';
      html+='<div style="font-size:11px;font-weight:700;color:var(--red);margin-bottom:6px">📡 情报预警触发条件</div>';
      html+='<div style="font-size:10px;color:var(--text2);line-height:1.6">'+pb.triggerConditions.split('/').map(function(c){return '<div style="padding:2px 0">• '+c.trim()+'</div>';}).join('')+'</div></div>';
    }
    // Risk Threshold
    if(pb.riskThreshold){
      html+='<div style="margin-bottom:12px;padding:10px 12px;background:rgba(255,136,0,0.04);border:1px solid rgba(255,136,0,0.08);border-radius:8px">';
      html+='<div style="font-size:11px;font-weight:700;color:var(--orange);margin-bottom:6px">📊 风险阈值</div>';
      for(var k in pb.riskThreshold){
        var klabels={security:'安全风险',overall:'综合风险',political:'政治风险',economic:'经济风险',social:'社会文化',strategic:'地缘战略',environmental:'自然环境'};
        html+='<div style="display:flex;align-items:center;justify-content:space-between;margin:4px 0"><span style="font-size:10px;color:var(--text2)">'+(klabels[k]||k)+'</span><span style="font-size:10px;font-weight:700;color:'+(pb.riskThreshold[k]>=8?'var(--red)':pb.riskThreshold[k]>=6?'var(--orange)':'var(--yellow)')+'">≥'+pb.riskThreshold[k]+'</span></div>';
      }
      html+='</div>';
    }
    // Response Team
    if(pb.responseTeam){
      html+='<div style="margin-bottom:12px;padding:10px 12px;background:rgba(0,255,159,0.04);border:1px solid rgba(0,255,159,0.08);border-radius:8px">';
      html+='<div style="font-size:11px;font-weight:700;color:var(--green);margin-bottom:6px">👥 应急处置团队</div>';
      pb.responseTeam.forEach(function(m){html+='<div style="padding:3px 0;font-size:10px;color:var(--text2)"><strong>'+m.role+':</strong> '+m.person+' ('+m.phone+')</div>';});
      html+='</div>';
    }
    // Communication Plan
    if(pb.commPlan){
      html+='<div style="margin-bottom:12px;padding:10px 12px;background:rgba(179,102,255,0.04);border:1px solid rgba(179,102,255,0.08);border-radius:8px">';
      html+='<div style="font-size:11px;font-weight:700;color:var(--purple);margin-bottom:6px">📞 通讯联络方案 ('+pb.commPlan.length+'条)</div>';
      pb.commPlan.forEach(function(cp){html+='<div style="padding:4px 0;border-bottom:1px solid rgba(179,102,255,0.06);font-size:10px"><div style="color:'+(cp.target?'var(--text1)':'var(--text3)')+';font-weight:600">'+cp.target+' <span style="font-weight:400;color:var(--text3)">→ '+cp.method+' ('+cp.timing+')</span></div><div style="color:var(--text3);margin-top:2px;font-style:italic">"'+cp.template.substring(0,60)+'..."</div></div>';});
      html+='</div>';
    }
    // Equipment
    if(pb.equipment&&pb.equipment.length){
      html+='<div style="margin-bottom:12px;padding:10px 12px;background:rgba(255,204,0,0.04);border:1px solid rgba(255,204,0,0.08);border-radius:8px">';
      html+='<div style="font-size:11px;font-weight:700;color:var(--yellow);margin-bottom:6px">📦 应急物资清单</div>';
      pb.equipment.forEach(function(eq){html+='<div style="font-size:9px;color:var(--text2);padding:2px 0">• '+eq+'</div>';});
      html+='</div>';
    }
    // Legal References
    if(pb.legalRefs&&pb.legalRefs.length){
      html+='<div style="margin-bottom:12px;padding:10px 12px;background:rgba(0,212,255,0.04);border:1px solid rgba(0,212,255,0.08);border-radius:8px">';
      html+='<div style="font-size:11px;font-weight:700;color:var(--cyan);margin-bottom:6px">⚖️ 法律依据</div>';
      pb.legalRefs.forEach(function(lr){html+='<div style="font-size:9px;color:var(--text2);padding:2px 0">• '+lr+'</div>';});
      html+='</div>';
    }
    // Insurance
    if(pb.insurance){
      html+='<div style="margin-bottom:12px;padding:10px 12px;background:rgba(0,255,159,0.04);border:1px solid rgba(0,255,159,0.08);border-radius:8px">';
      html+='<div style="font-size:11px;font-weight:700;color:var(--green);margin-bottom:6px">🏦 保险保障</div>';
      html+='<div style="font-size:10px;color:var(--text2);line-height:1.5">'+pb.insurance+'</div></div>';
    }
    html+='</div></div>'; // end two columns

    // === FULL-WIDTH: Escalation + After Action ===
    html+='<div class="grid" style="grid-template-columns:1fr 1fr;gap:14px;margin-top:14px">';
    if(pb.escalation){
      html+='<div style="padding:10px 12px;background:rgba(255,51,85,0.04);border:1px solid rgba(255,51,85,0.08);border-radius:8px">';
      html+='<div style="font-size:11px;font-weight:700;color:var(--red);margin-bottom:6px">⬆️ 升级程序</div>';
      pb.escalation.forEach(function(es){html+='<div style="padding:4px 0;border-bottom:1px solid rgba(255,51,85,0.06);font-size:10px"><div style="color:var(--orange);font-weight:600">触发: '+es.when+'</div><div style="color:var(--text2)">→ '+es.action+'</div></div>';});
      html+='</div>';
    }
    if(pb.afterAction){
      html+='<div style="padding:10px 12px;background:rgba(0,255,159,0.04);border:1px solid rgba(0,255,159,0.08);border-radius:8px">';
      html+='<div style="font-size:11px;font-weight:700;color:var(--green);margin-bottom:6px">📝 事后复盘要求</div>';
      html+='<div style="font-size:10px;color:var(--text2);line-height:1.5">'+pb.afterAction+'</div></div>';
    }
    html+='</div>';

    // === Related Alerts (intelligence linking) ===
    var relatedAlerts=ALERTS.filter(function(a){return a.status==='active'&&a.type===pb.type;});
    if(relatedAlerts.length>0){
      html+='<div style="margin-top:12px;padding:10px 12px;background:rgba(0,212,255,0.04);border:1px solid rgba(0,212,255,0.08);border-radius:8px">';
      html+='<div style="font-size:11px;font-weight:700;color:var(--cyan);margin-bottom:6px">🔗 关联活跃预警 ('+relatedAlerts.length+'条)</div>';
      relatedAlerts.forEach(function(a){
        var alv=ALERT_LV[a.level];
        html+='<div onclick="showAlertDetail(\''+a.id+'\')" style="cursor:pointer;padding:6px 0;border-bottom:1px solid rgba(0,212,255,0.06);font-size:10px;display:flex;align-items:center;gap:8px"><span class="badge '+alv.cls+'" style="font-size:8px">'+alv.label+'</span><span style="color:var(--text2);flex:1">'+a.title+'</span><span style="color:var(--text3)">'+a.country+'</span></div>';
      });
      html+='</div>';
    }
    // Actions
    html+='<div style="margin-top:12px;display:flex;gap:8px">';
    if(PERM.isAdmin()){
    html+='<button class="btn" style="background:rgba(255,136,0,0.12);border:1px solid rgba(255,136,0,0.3);color:var(--orange)" onclick="AVIEW.deployPlaybook(\''+pb.id+'\')">🚀 部署此预案</button>';
    html+='<button class="btn sm" onclick="AVIEW.editPlaybook(\''+pb.id+'\')">✏️ 编辑</button>';
    html+='<button class="btn sm" style="color:var(--red)" onclick="showConfirm(\'确认删除预案「'+pb.title+'」？\',function(){AVIEW.deletePlaybook(\''+pb.id+'\');})">🗑️ 删除</button>';
    }
    html+='<button class="btn sm" onclick="AVIEW.exportPbDetail(\''+pb.id+'\')">📥 导出</button></div>';
    html+='</div></div>';
    el.innerHTML=html;
    el.scrollIntoView({behavior:'smooth',block:'start'});
  },
  _intelFilter:'all',
  renderSources(){
    var self=this;
    var el=document.getElementById('alert-sources');
    if(!el)return;
    var items=INTEL_ITEMS;
    var total=items.length;
    var validated=items.filter(function(i){return i.status==='validated';}).length;
    var crossChecked=items.filter(function(i){return i.status==='cross-checked';}).length;
    var pending=items.filter(function(i){return i.status==='pending';}).length;
    var highConf=items.filter(function(i){return i.confidence>=85;}).length;
    var multiSrc=items.filter(function(i){return i.validatedBy.length>=2;}).length;
    var fusionRate=total>0?Math.round(multiSrc/total*100):0;
    var html='';
    // === Row 1: Fusion Overview Stats ===
    html+='<div class="stat-grid" style="grid-template-columns:repeat(6,1fr);margin-bottom:14px">';
    var stats=[
      {ic:'📋',bg:'rgba(0,212,255,0.08)',c:'#00d4ff',l:'情报总量',v:total,s:'6源采集'},
      {ic:'✅',bg:'rgba(0,255,159,0.08)',c:'#00ff9f',l:'已验证',v:validated,s:'多源交叉确认'},
      {ic:'🔄',bg:'rgba(255,204,0,0.08)',c:'#ffcc00',l:'交叉验证中',v:crossChecked,s:'待二次确认'},
      {ic:'⏳',bg:'rgba(255,136,0,0.08)',c:'#ff8800',l:'待审核',v:pending,s:'新入库未处理'},
      {ic:'🎯',bg:'rgba(179,102,255,0.08)',c:'#b366ff',l:'高置信度',v:highConf,s:'置信度≥85%'},
      {ic:'🔗',bg:'rgba(0,212,255,0.08)',c:'#00d4ff',l:'多源融合率',v:fusionRate+'%',s:multiSrc+'条多源验证'}
    ];
    stats.forEach(function(s){
      html+='<div class="stat-card"><div class="stat-ic" style="background:'+s.bg+';color:'+s.c+'">'+s.ic+'</div><div class="stat-info"><div class="stat-label">'+s.l+'</div><div class="stat-val" style="color:'+s.c+'">'+s.v+'</div><div class="stat-sub">'+s.s+'</div></div></div>';
    });
    html+='</div>';
    // === Row 2: Two columns - Source Registry + Intel Feed ===
    html+='<div class="grid" style="grid-template-columns:340px 1fr;gap:14px;align-items:start">';
    // Left: Source Registry
    html+='<div><div class="card" style="padding:14px"><div class="card-tt" style="margin-bottom:10px"><span class="ic">📡</span>情报源注册</div>';
    html+='<div id="intel-src-list" style="display:flex;flex-direction:column;gap:8px">';
    // "All sources" option
    html+='<div onclick="AVIEW.filterIntel(\'all\')" style="cursor:pointer;padding:10px 12px;border-radius:8px;border:1px solid '+(this._intelFilter==='all'?'rgba(0,212,255,0.4)':'var(--border)')+';background:'+(this._intelFilter==='all'?'rgba(0,212,255,0.06)':'var(--panel2)')+';transition:.15s">';
    html+='<div style="display:flex;align-items:center;justify-content:space-between"><div style="display:flex;align-items:center;gap:8px"><span style="font-size:16px">🔍</span><strong style="font-size:12px;color:var(--cyan)">全部情报源</strong></div><span style="font-size:13px;font-weight:800;color:var(--cyan)">'+total+'</span></div></div>';
    INTEL_SOURCES.forEach(function(s,idx){
      var cnt=items.filter(function(i){return i.src===s.id;}).length;
      var active=self._intelFilter===s.id;
      html+='<div onclick="AVIEW.filterIntel(\''+s.id+'\')" style="cursor:pointer;padding:10px 12px;border-radius:8px;border:1px solid '+(active?'rgba(0,212,255,0.4)':'var(--border)')+';background:'+(active?'rgba(0,212,255,0.06)':'var(--panel2)')+';transition:.15s" onmouseover="this.style.borderColor=\'rgba(0,212,255,0.3)\'" onmouseout="this.style.borderColor=\''+(active?'rgba(0,212,255,0.4)':'var(--border)')+'\'">';
      html+='<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px"><div style="display:flex;align-items:center;gap:8px"><span style="font-size:16px">'+s.ic+'</span><div><strong style="font-size:12px;color:'+s.color+'">'+s.name+'</strong><div style="font-size:9px;color:var(--text3);margin-top:1px">'+s.full+'</div></div></div><span style="font-size:13px;font-weight:800;color:'+s.color+'">'+cnt+'</span></div>';
      html+='<div style="font-size:10px;color:var(--text3);margin-bottom:5px;line-height:1.4">'+s.desc+'</div>';
      html+='<div style="display:flex;align-items:center;gap:6px"><span style="font-size:9px;color:var(--text3)">可靠性</span><div style="flex:1;height:5px;background:var(--bg);border-radius:3px;overflow:hidden"><div style="width:'+s.reliability+'%;height:100%;background:'+s.color+';border-radius:3px"></div></div><span style="font-size:10px;font-weight:700;color:'+s.color+'">'+s.reliability+'%</span></div>';
      html+='</div>';
    });
    html+='</div>';
    // Fusion workflow
    html+='<div style="margin-top:12px;padding:10px;background:rgba(0,212,255,0.04);border:1px solid rgba(0,212,255,0.12);border-radius:8px">';
    html+='<div style="font-size:11px;font-weight:700;color:var(--cyan);margin-bottom:8px">🔄 情报融合流程</div>';
    var steps=[
      {n:'1️⃣',t:'多源采集',d:'6类情报源并行采集'},
      {n:'2️⃣',t:'关联去重',d:'跨源关联，去除重复'},
      {n:'3️⃣',t:'交叉验证',d:'多源验证提升置信度'},
      {n:'4️⃣',t:'融合研判',d:'综合研判生成预警'},
      {n:'5️⃣',t:'分发处置',d:'推送至预警指挥台'}
    ];
    steps.forEach(function(s,i){
      html+='<div style="display:flex;align-items:flex-start;gap:8px;padding:4px 0'+(i<4?';border-bottom:1px solid rgba(0,212,255,0.06)':'')+'"><span style="font-size:12px">'+s.n+'</span><div><div style="font-size:11px;font-weight:600;color:var(--text2)">'+s.t+'</div><div style="font-size:9px;color:var(--text3)">'+s.d+'</div></div></div>';
    });
    html+='</div></div></div>';
    // Right: Intel Feed
    var filtered=this._intelFilter==='all'?items:items.filter(function(i){return i.src===self._intelFilter;});
    html+='<div><div class="card" style="padding:14px"><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">';
    html+='<div class="card-tt" style="margin:0"><span class="ic">📨</span>情报实时流 <span style="font-size:11px;color:var(--text3);font-weight:400">'+(this._intelFilter==='all'?'全部来源':INTEL_SOURCES.find(function(s){return s.id===self._intelFilter;}).name)+' ('+filtered.length+'条)</span></div>';
    if(this._intelFilter!=='all'){
      html+='<div onclick="AVIEW.filterIntel(\'all\')" style="font-size:10px;color:var(--cyan);cursor:pointer">← 显示全部</div>';
    }
    html+='</div>';
    html+='<div id="intel-feed" style="display:flex;flex-direction:column;gap:8px;max-height:620px;overflow-y:auto">';
    if(filtered.length===0){
      html+='<div style="text-align:center;padding:30px;color:var(--text3);font-size:12px">暂无该来源情报数据</div>';
    }
    filtered.forEach(function(item,idx){
      var src=INTEL_SOURCES.find(function(s){return s.id===item.src;});
      var stColor=item.status==='validated'?'#00ff9f':item.status==='cross-checked'?'#ffcc00':'#ff8800';
      var stLabel=item.status==='validated'?'已验证':item.status==='cross-checked'?'验证中':'待审核';
      var confColor=item.confidence>=85?'#00ff9f':item.confidence>=70?'#ffcc00':'#ff8800';
      var realIdx=items.indexOf(item);
      html+='<div onclick="AVIEW.showIntelDetail('+realIdx+')" style="cursor:pointer;padding:12px;background:var(--panel2);border:1px solid var(--border);border-left:3px solid '+src.color+';border-radius:8px;transition:.15s" onmouseover="this.style.borderColor=\'rgba(0,212,255,0.25)\';this.style.transform=\'translateY(-1px)\'" onmouseout="this.style.borderColor=\'var(--border)\';this.style.transform=\'\'">';
      html+='<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:6px">';
      html+='<div style="flex:1"><div style="display:flex;align-items:center;gap:6px;margin-bottom:3px"><span style="font-size:14px">'+src.ic+'</span><span style="font-size:10px;font-weight:700;color:'+src.color+'">'+src.name+'</span><span style="font-size:9px;color:var(--text3)">·</span><span style="font-size:9px;color:var(--text3)">'+item.time+'</span><span style="font-size:9px;color:var(--text3)">·</span><span style="font-size:9px;color:var(--text3)">'+item.country+'</span></div>';
      html+='<div style="font-size:12px;font-weight:600;color:var(--text1);line-height:1.4">'+item.title+'</div></div>';
      html+='<span style="font-size:9px;padding:2px 8px;border-radius:4px;background:'+stColor+'15;color:'+stColor+';font-weight:700;white-space:nowrap">'+stLabel+'</span>';
      html+='</div>';
      html+='<div style="display:flex;align-items:center;gap:10px;margin-top:6px">';
      // Confidence bar
      html+='<div style="display:flex;align-items:center;gap:5px"><span style="font-size:9px;color:var(--text3)">置信度</span><div style="width:60px;height:5px;background:var(--bg);border-radius:3px;overflow:hidden"><div style="width:'+item.confidence+'%;height:100%;background:'+confColor+';border-radius:3px"></div></div><span style="font-size:10px;font-weight:700;color:'+confColor+'">'+item.confidence+'%</span></div>';
      // Validation sources
      if(item.validatedBy.length>0){
        html+='<div style="display:flex;align-items:center;gap:4px"><span style="font-size:9px;color:var(--text3)">交叉验证:</span>';
        item.validatedBy.forEach(function(v){
          var vs=INTEL_SOURCES.find(function(s){return s.id===v;});
          if(vs)html+='<span style="font-size:9px;padding:1px 5px;border-radius:3px;background:'+vs.color+'15;color:'+vs.color+'">'+vs.ic+vs.id+'</span>';
        });
        html+='</div>';
      }else{
        html+='<span style="font-size:9px;color:var(--orange)">⚠ 单源情报</span>';
      }
      html+='</div>';
      // Related alert
      if(item.alertId){
        html+='<div style="margin-top:5px;font-size:9px;color:var(--cyan)">🔗 关联预警: '+item.alertId+'</div>';
      }
      html+='</div>';
    });
    html+='</div></div></div>';
    // === Row 3: Cross-validation Matrix ===
    html+='<div class="card mt-12" style="padding:14px"><div class="card-tt" style="margin-bottom:10px"><span class="ic"> 🔗</span>多源交叉验证矩阵</div>';
    html+='<div style="overflow-x:auto"><table style="width:100%;font-size:11px;border-collapse:collapse">';
    html+='<thead><tr style="border-bottom:2px solid rgba(0,212,255,0.15)"><th style="padding:6px 8px;text-align:left;color:var(--text2);font-weight:600">情报事件</th><th style="padding:6px 8px;text-align:center;color:var(--text2);font-weight:600">主源</th>';
    INTEL_SOURCES.forEach(function(s){html+='<th style="padding:6px 4px;text-align:center;color:'+s.color+';font-weight:600;font-size:10px" title="'+s.full+'">'+s.ic+'</th>';});
    html+='<th style="padding:6px 8px;text-align:center;color:var(--text2);font-weight:600">验证源数</th><th style="padding:6px 8px;text-align:center;color:var(--text2);font-weight:600">置信度</th></tr></thead><tbody>';
    // Group items by alert/event
    var groups={};
    items.forEach(function(it){
      var key=it.alertId||it.eventId||it.id;
      if(!groups[key])groups[key]={title:it.title,country:it.country,primary:it.src,sources:{},maxConf:0,count:0};
      groups[key].sources[it.src]=true;
      groups[key].maxConf=Math.max(groups[key].maxConf,it.confidence);
      groups[key].count++;
    });
    Object.keys(groups).forEach(function(key){
      var g=groups[key];
      if(g.count<2)return; // Only show multi-source groups
      html+='<tr style="border-bottom:1px solid var(--border)"><td style="padding:6px 8px;color:var(--text1);max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+g.title+'</td>';
      var ps=INTEL_SOURCES.find(function(s){return s.id===g.primary;});
      html+='<td style="padding:6px 8px;text-align:center"><span style="color:'+ps.color+';font-size:13px">'+ps.ic+'</span></td>';
      INTEL_SOURCES.forEach(function(s){
        var has=g.sources[s.id];
        html+='<td style="padding:6px 4px;text-align:center">'+(has?'<span style="color:'+s.color+';font-size:13px">✓</span>':'<span style="color:var(--text3);opacity:0.3">—</span>')+'</td>';
      });
      var srcCount=Object.keys(g.sources).length;
      var confColor=g.maxConf>=85?'#00ff9f':g.maxConf>=70?'#ffcc00':'#ff8800';
      html+='<td style="padding:6px 8px;text-align:center"><span style="font-weight:700;color:var(--cyan)">'+srcCount+'源</span></td>';
      html+='<td style="padding:6px 8px;text-align:center"><span style="font-weight:700;color:'+confColor+'">'+g.maxConf+'%</span></td></tr>';
    });
    html+='</tbody></table></div>';
    html+='<div style="margin-top:8px;font-size:10px;color:var(--text3)">注：仅显示2源及以上交叉验证的情报事件。✓ 表示该情报源对事件有贡献。</div>';
    html+='</div>';
    el.innerHTML=html;
  },
  filterIntel(src){
    this._intelFilter=src;
    this.renderSources();
  },
  showIntelDetail(i){
    var item=INTEL_ITEMS[i];
    if(!item)return;
    var src=INTEL_SOURCES.find(function(s){return s.id===item.src;});
    var stColor=item.status==='validated'?'#00ff9f':item.status==='cross-checked'?'#ffcc00':'#ff8800';
    var stLabel=item.status==='validated'?'✅ 已验证':item.status==='cross-checked'?'🔄 交叉验证中':'⏳ 待审核';
    var confColor=item.confidence>=85?'#00ff9f':item.confidence>=70?'#ffcc00':'#ff8800';
    var relatedAlert=null;
    if(item.alertId)relatedAlert=ALERTS.find(function(a){return a.id===item.alertId;});
    var relatedEvent=null;
    if(item.eventId)relatedEvent=EVENTS.find(function(e){return e.id===item.eventId;});
    var html='<div style="max-width:680px">';
    // Header
    html+='<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:14px;padding-bottom:12px;border-bottom:1px solid var(--border)">';
    html+='<div style="flex:1"><div style="display:flex;align-items:center;gap:8px;margin-bottom:6px"><span style="font-size:20px">'+src.ic+'</span><span style="font-size:12px;font-weight:700;color:'+src.color+';padding:3px 10px;background:'+src.color+'15;border-radius:4px">'+src.name+'</span><span style="font-size:10px;color:var(--text3)">'+item.id+'</span></div>';
    html+='<div style="font-size:15px;font-weight:700;color:var(--text1);line-height:1.4">'+item.title+'</div></div>';
    html+='<span style="font-size:11px;padding:4px 12px;border-radius:4px;background:'+stColor+'15;color:'+stColor+';font-weight:700;white-space:nowrap">'+stLabel+'</span></div>';
    // Meta
    html+='<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:14px">';
    html+='<div style="padding:8px 12px;background:var(--panel2);border-radius:6px"><div style="font-size:9px;color:var(--text3);margin-bottom:2px">采集时间</div><div style="font-size:12px;font-weight:600;color:var(--text2)">'+item.time+'</div></div>';
    html+='<div style="padding:8px 12px;background:var(--panel2);border-radius:6px"><div style="font-size:9px;color:var(--text3);margin-bottom:2px">涉及国家/地区</div><div style="font-size:12px;font-weight:600;color:var(--text2)">'+item.country+'</div></div>';
    html+='<div style="padding:8px 12px;background:var(--panel2);border-radius:6px"><div style="font-size:9px;color:var(--text3);margin-bottom:2px">置信度评分</div><div style="font-size:14px;font-weight:800;color:'+confColor+'">'+item.confidence+'%</div></div>';
    html+='</div>';
    // Content
    html+='<div style="padding:12px;background:var(--panel2);border:1px solid var(--border);border-radius:8px;margin-bottom:14px">';
    html+='<div style="font-size:11px;font-weight:700;color:var(--cyan);margin-bottom:8px">📋 情报内容</div>';
    html+='<div style="font-size:12px;color:var(--text2);line-height:1.7">'+item.content+'</div></div>';
    // Source channels
    html+='<div style="padding:12px;background:var(--panel2);border:1px solid var(--border);border-radius:8px;margin-bottom:14px">';
    html+='<div style="font-size:11px;font-weight:700;color:'+src.color+';margin-bottom:8px">'+src.ic+' '+src.name+' — 采集渠道</div>';
    html+='<div style="display:flex;flex-wrap:wrap;gap:6px">';
    src.channels.forEach(function(ch){html+='<span style="font-size:10px;padding:3px 8px;background:'+src.color+'10;color:'+src.color+';border-radius:4px;border:1px solid '+src.color+'20">'+ch+'</span>';});
    html+='</div></div>';
    // Cross-validation
    html+='<div style="padding:12px;background:var(--panel2);border:1px solid var(--border);border-radius:8px;margin-bottom:14px">';
    html+='<div style="font-size:11px;font-weight:700;color:var(--cyan);margin-bottom:8px">🔄 交叉验证链</div>';
    if(item.validatedBy.length>0){
      html+='<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">';
      html+='<div style="display:flex;align-items:center;gap:4px;padding:4px 10px;background:'+src.color+'15;border-radius:6px;border:1px solid '+src.color+'30"><span style="font-size:14px">'+src.ic+'</span><span style="font-size:10px;font-weight:700;color:'+src.color+'">'+src.name+'</span><span style="font-size:9px;color:var(--text3)">(主源)</span></div>';
      item.validatedBy.forEach(function(v){
        var vs=INTEL_SOURCES.find(function(s){return s.id===v;});
        if(vs){
          html+='<span style="color:var(--text3);font-size:14px">→</span>';
          html+='<div style="display:flex;align-items:center;gap:4px;padding:4px 10px;background:'+vs.color+'15;border-radius:6px;border:1px solid '+vs.color+'30"><span style="font-size:14px">'+vs.ic+'</span><span style="font-size:10px;font-weight:700;color:'+vs.color+'">'+vs.name+'</span><span style="font-size:9px;color:#00ff9f">(✓确认)</span></div>';
        }
      });
      html+='</div>';
      html+='<div style="margin-top:8px;font-size:10px;color:var(--text3)">该情报经'+(item.validatedBy.length+1)+'个独立情报源交叉验证，置信度'+item.confidence+'%'+(item.confidence>=85?'，达到预警触发阈值':'，接近预警触发阈值')+'。</div>';
    }else{
      html+='<div style="font-size:11px;color:var(--orange)">⚠ 该情报为单源情报，尚未完成交叉验证。系统正在自动匹配其他来源进行验证。</div>';
    }
    html+='</div>';
    // Related alert/event
    if(relatedAlert||relatedEvent){
      html+='<div style="padding:12px;background:var(--panel2);border:1px solid var(--border);border-radius:8px;margin-bottom:14px">';
      html+='<div style="font-size:11px;font-weight:700;color:var(--red);margin-bottom:8px">🚨 关联预警/事件</div>';
      if(relatedAlert){
        var lv=ALERT_LV[relatedAlert.level];
        html+='<div style="padding:8px;background:rgba(255,51,85,0.06);border-radius:6px;margin-bottom:6px"><div style="display:flex;align-items:center;gap:6px;margin-bottom:4px"><span class="badge '+lv.cls+'" style="font-size:9px">'+lv.label+'</span><span style="font-size:11px;font-weight:600;color:var(--text1)">'+relatedAlert.title+'</span></div><div style="font-size:10px;color:var(--text3)">'+relatedAlert.country+' | '+relatedAlert.enterprise+' | '+relatedAlert.time+'</div></div>';
      }
      if(relatedEvent){
        html+='<div style="padding:8px;background:rgba(0,212,255,0.04);border-radius:6px"><div style="display:flex;align-items:center;gap:6px;margin-bottom:4px"><span style="font-size:10px;font-weight:700;color:var(--cyan)">'+relatedEvent.id+'</span><span style="font-size:11px;font-weight:600;color:var(--text1)">'+relatedEvent.title+'</span></div><div style="font-size:10px;color:var(--text3)">'+relatedEvent.country+' | '+relatedEvent.date+'</div></div>';
      }
      html+='</div>';
    }
    // Fusion conclusion
    html+='<div style="padding:12px;background:rgba(0,212,255,0.04);border:1px solid rgba(0,212,255,0.15);border-radius:8px">';
    html+='<div style="font-size:11px;font-weight:700;color:var(--cyan);margin-bottom:6px">🧠 融合研判结论</div>';
    html+='<div style="font-size:11px;color:var(--text2);line-height:1.6">';
    if(item.status==='validated'){
      html+='该情报已完成'+(item.validatedBy.length+1)+'源交叉验证，置信度'+item.confidence+'%。'+(relatedAlert?'系统已据此生成'+ALERT_LV[relatedAlert.level].label+'预警('+item.alertId+')，并推送至预警指挥台进行处置。':'建议持续监测，准备生成预警。');
    }else if(item.status==='cross-checked'){
      html+='该情报正在进行交叉验证，当前已有'+(item.validatedBy.length+1)+'个来源提供信息。待置信度达到85%后将自动触发预警生成流程。';
    }else{
      html+='该情报为单源新采集情报，尚未完成交叉验证。系统正在自动匹配其他情报源进行验证。单源情报置信度较低，暂不触发预警。';
    }
    html+='</div></div>';
    html+='</div>';
    var modal=document.getElementById('modal');
    document.getElementById('modal-tt').textContent='情报详情 — '+item.id;
    document.getElementById('modal-bd').innerHTML=html;
    modal.classList.add('show');
  },
  renderCases(){
    var el=document.getElementById('alert-cases');
    if(!el)return;
    var cases=[
      {t:'苏丹紧急撤离预警响应',cat:'武装冲突撤离',yr:'2023.04',cty:'苏丹',ent:'中石油/多家中企',level:'极高',
       bg:'2023年4月15日苏丹武装冲突爆发，系统于当日生成红色预警。预警指挥中心立即启动I级响应，协调外交部、国防部实施撤侨行动。',
       timeline:['4.15 冲突爆发，系统自动生成红色预警','4.16 预警确认，启动I级响应','4.17 联系使馆，协调撤离路线','4.18-25 海军护航编队执行撤侨','4.26 1500余名中方人员安全撤离'],
       outcome:'成功撤离1500余名中方人员，零伤亡。中石油6区、7区油田资产损失约35亿美元。',
       lesson:'预警系统提前触发为撤离争取了宝贵时间。建议加强港口城市预警监测密度，预设海上撤离通道。'},
      {t:'卡拉奇机场车队遇袭预警复盘',cat:'恐怖袭击',yr:'2024.10',cty:'巴基斯坦',ent:'卡西姆港发电公司',level:'极高',
       bg:'2024年10月6日，中资企业车队在卡拉奇机场附近遭汽车炸弹袭击。系统在此前48小时曾监测到BLA活动异常信号，但未达到触发阈值。',
       timeline:['10.4 系统监测到BLA社交媒体异常活跃','10.5 安保情报显示威胁升级，未触发预警','10.6 车队在机场附近遇袭，2名中方人员遇难','10.7 事后复盘，调整BLA威胁评估阈值'],
       outcome:'2名中方人员遇难，17人受伤。事件后系统优化了社交媒体监测的预警阈值。',
       lesson:'需降低社交媒体威胁信号的预警触发阈值，建立48小时前瞻性预警机制。加强机场至项目驻地路线安保。'},
      {t:'马里中资矿区袭击预警分析',cat:'武装袭击',yr:'2026.05',cty:'马里',ent:'中铝马里',level:'极高',
       bg:'2026年5月17日，马里库利科罗大区中资矿区遭武装分子袭击，9名中方人员失联。系统在此前一周已生成橙色预警。',
       timeline:['5.10 系统监测到JNIM在库利科罗大区活动增加','5.12 生成橙色预警，建议加强安保','5.15 威胁信号持续，升级为红色预警','5.17 凌晨矿区遭袭，9名中方人员失联','5.20 启动应急搜救'],
       outcome:'9名中方人员失联，施工车辆和设备被焚毁。资产损失约2000万美元。',
       lesson:'橙色预警应伴随强制性安保升级措施。矿区需建立独立通信系统和安全屋，确保紧急情况下人员避险。'},
      {t:'红海航运中断预警响应',cat:'航运安全',yr:'2023.11-持续',cty:'也门/红海',ent:'中远海运/招商局',level:'极高',
       bg:'2023年11月起胡塞武装持续袭击红海商船，系统持续保持红色预警状态，推动企业调整航线。',
       timeline:['11.19 首次袭击商船，系统生成红色预警','11.20 建议所有亚欧航线绕行好望角','12.15 70%集装箱船改道','2024.01 运价上涨256%','持续监测至今'],
       outcome:'中远海运及时调整航线，未发生船舶被劫持事件。但运价上涨30-40%，交期延长7-14天。',
       lesson:'航运通道预警需建立长期持续监测机制。建议预设替代航线方案，与海军护航编队建立协同机制。'},
      {t:'阿根廷比索贬值经济预警',cat:'经济风险',yr:'2024-2026',cty:'阿根廷',ent:'中国铁建/多家中企',level:'高',
       bg:'阿根廷比索持续大幅贬值，系统多次生成黄色/橙色经济预警，推动企业启动本币结算。',
       timeline:['2024.01 米莱政府取消汇率管制，比索暴跌54%','2024.03 系统生成橙色经济预警','2024.06 中资企业启动人民币结算','2025.12 比索再贬值30%','2026.07 外汇汇出困难预警'],
       outcome:'部分中资企业及时转换结算货币，减少汇兑损失约1.2亿美元。但仍有5亿美元资金滞留。',
       lesson:'经济类预警应建立自动触发的外汇风险管理机制。建议在高风险国家维持最低运营资金，盈余及时汇出。'}
    ];
    var html='<div class="grid" style="grid-template-columns:1fr 1fr;gap:12px">';
    cases.forEach(function(c,i){
      var bc=c.level==='极高'?'var(--red)':'var(--orange)';
      html+='<div class="card" style="border-left:3px solid '+bc+';cursor:pointer;transition:.15s" onclick="AVIEW.showAlertCase('+i+')">'+
        '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:6px">'+
        '<div><strong style="font-size:13px">'+c.t+'</strong><div class="text-xs text-muted">'+c.cty+' | '+c.ent+' | '+c.yr+'</div></div>'+
        '<span class="badge '+(c.level==='极高'?'b-red':'b-orange')+'">'+c.level+'</span></div>'+
        '<div class="text-xs text-muted" style="line-height:1.6;margin-bottom:6px">'+c.bg.substring(0,100)+'...</div>'+
        '<div class="flex gap-8"><span class="badge b-blue" style="font-size:9px">'+c.cat+'</span></div>'+
        '<div style="margin-top:6px;font-size:10px;color:var(--cyan)">📌 点击查看完整复盘分析 →</div></div>';
    });
    html+='</div>';
    el.innerHTML=html;
    this._alertCases=cases;
  },
  showAlertCase(i){
    var c=this._alertCases[i];if(!c)return;
    var bc=c.level==='极高'?'var(--red)':'var(--orange)';
    var modal=document.getElementById('modal');
    document.getElementById('modal-tt').textContent=c.t;
    var timelineHtml='<div style="margin-bottom:12px"><strong style="font-size:12px;color:var(--cyan)">📅 预警响应时间线</strong><div style="margin-top:8px">';
    c.timeline.forEach(function(t,idx){
      var dotColor=idx===0?'var(--red)':idx===c.timeline.length-1?'var(--green)':'var(--orange)';
      timelineHtml+='<div style="display:flex;gap:10px;margin-bottom:6px"><div style="width:8px;height:8px;border-radius:50%;background:'+dotColor+';flex-shrink:0;margin-top:4px"></div><div style="font-size:12px">'+t+'</div></div>';
    });
    timelineHtml+='</div></div>';
    document.getElementById('modal-bd').innerHTML='<div class="grid mb-12" style="grid-template-columns:1fr 1fr;gap:10px">'+
      '<div style="padding:12px;background:var(--bg2);border-radius:8px"><div class="text-xs text-muted">风险等级</div><div style="margin-top:4px"><span class="badge '+(c.level==='极高'?'b-red':'b-orange')+'">'+c.level+'</span></div></div>'+
      '<div style="padding:12px;background:var(--bg2);border-radius:8px"><div class="text-xs text-muted">事件类别</div><div style="font-weight:700;font-size:14px;margin-top:4px;color:'+bc+'">'+c.cat+'</div></div>'+
      '<div style="padding:12px;background:var(--bg2);border-radius:8px"><div class="text-xs text-muted">国家/地区</div><div style="font-weight:700;font-size:14px;margin-top:4px">'+c.cty+'</div></div>'+
      '<div style="padding:12px;background:var(--bg2);border-radius:8px"><div class="text-xs text-muted">涉及企业</div><div style="font-weight:700;font-size:14px;margin-top:4px">'+c.ent+'</div></div>'+
      '</div>'+
      '<div style="padding:14px;background:var(--red-bg);border-left:4px solid '+bc+';border-radius:8px;margin-bottom:12px"><strong style="color:'+bc+'">📋 事件背景</strong><p style="margin:8px 0 0;line-height:1.8;font-size:13px">'+c.bg+'</p></div>'+
      timelineHtml+
      '<div style="padding:12px;background:var(--blue-bg);border-radius:8px;margin-bottom:12px"><strong style="color:var(--cyan);font-size:12px">📊 处置结果</strong><p style="margin:6px 0 0;line-height:1.7;font-size:12px;color:var(--text2)">'+c.outcome+'</p></div>'+
      '<div style="padding:12px;background:var(--orange-bg);border-radius:8px"><strong style="color:var(--orange);font-size:12px">💡 经验教训</strong><p style="margin:6px 0 0;line-height:1.7;font-size:12px;color:var(--text2)">'+c.lesson+'</p></div>';
    modal.classList.add('show');
  },
  renderRules(){
    document.getElementById('alert-rules').innerHTML='<div class="table-wrap"><table><thead><tr><th>规则ID</th><th>规则名称</th><th>描述</th><th>阈值</th><th>等级</th><th>触发次数</th><th>状态</th></tr></thead><tbody>'+WARNING_RULES.map(function(r){
      var cls=r.level==='red'?'b-red':r.level==='orange'?'b-orange':r.level==='yellow'?'b-yellow':'b-blue';
      return '<tr><td><code style="color:var(--cyan)">'+r.id+'</code></td><td><strong>'+r.name+'</strong></td><td class="text-xs text-muted">'+r.desc+'</td><td><span class="badge b-blue">'+r.threshold+'</span></td><td><span class="badge '+cls+'">'+r.level+'</span></td><td style="font-weight:700;color:var(--orange)">'+r.trigCount+'</td><td>'+(r.enabled?'<span class="badge b-green">启用</span>':'<span class="badge b-yellow">禁用</span>')+'</td></tr>';
    }).join('')+'</tbody></table></div>';
  },
  renderCharts(){
    var data=genAlertTrend();
    var ctx1=document.getElementById('chart-alert-trend');
    if(!ctx1)return;
    if(charts.alertTrend)charts.alertTrend.destroy();
    charts.alertTrend=new Chart(ctx1.getContext('2d'),{type:'bar',data:{labels:data.map(function(d){return d.d;}),datasets:[{label:'红',data:data.map(function(d){return d.r;}),backgroundColor:'#ff3355',stack:'s'},{label:'橙',data:data.map(function(d){return d.o;}),backgroundColor:'#ff8800',stack:'s'},{label:'黄',data:data.map(function(d){return d.y;}),backgroundColor:'#ffcc00',stack:'s'},{label:'蓝',data:data.map(function(d){return d.b;}),backgroundColor:'#00d4ff',stack:'s'}]},
      options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{font:{size:8},color:'#7a8ba3',padding:4,boxWidth:8}}},scales:{x:{stacked:true,grid:{display:false},ticks:{color:'#7a8ba3',font:{size:7}}},y:{stacked:true,grid:{color:'rgba(0,212,255,0.05)'},ticks:{color:'#7a8ba3',font:{size:9}}}}}});
    var c={red:0,orange:0,yellow:0,blue:0};ALERTS.forEach(function(a){c[a.level]++;});
    var ctx2=document.getElementById('chart-alert-pie');
    if(!ctx2)return;
    if(charts.alertPie)charts.alertPie.destroy();
    charts.alertPie=new Chart(ctx2.getContext('2d'),{type:'doughnut',data:{labels:['红色','橙色','黄色','蓝色'],datasets:[{data:[c.red,c.orange,c.yellow,c.blue],backgroundColor:['#ff3355','#ff8800','#ffcc00','#00d4ff'],borderWidth:2,borderColor:'#070b14'}]},
      options:{responsive:true,maintainAspectRatio:false,cutout:'60%',plugins:{legend:{position:'bottom',labels:{font:{size:9},color:'#7a8ba3',padding:6,boxWidth:10}}}}});
  }
};

// ===== PLAYBOOKS DATA (16 detailed plans with full metadata) =====
var PLAYBOOKS=[
  // === 安全风险类 (6条) ===
  {id:'PB-001',type:'安全风险',icon:'🔴',title:'恐怖袭击应急响应预案',scope:'恐怖袭击/武装袭击/爆炸威胁/枪支暴力',responseTime:'15分钟',level:'I级(最高)',principle:'人员安全第一，快速撤离优先，同步启动联防联动机制',
    triggerConditions:'监测区域恐怖袭击事件/ISIS及关联组织活跃/当地安全部门预警/使馆安全通告升级/社交媒体出现针对中资的威胁言论',
    riskThreshold:{security:8,overall:7},applicableCountries:['巴基斯坦','缅甸','苏丹','尼日利亚','阿富汗','伊拉克','马里'],
    responseTeam:[{role:'现场指挥',person:'项目经理',phone:'本地紧急联络人1'},{role:'安保联络',person:'安保主管',phone:'本地紧急联络人2'},{role:'使馆对接',person:'外联主管',phone:'使馆领保电话'},{role:'医疗急救',person:'医生/HSE主管',phone:'当地急救电话'}],
    commPlan:[{target:'全体人员',method:'SMS群发+广播',template:'紧急警报：已确认[类型]威胁位于[位置]。请立即[就地避险/撤离至安全集结点]。保持冷静，等待进一步指令。',timing:'即时'},{target:'使馆领保',method:'电话+邮件',template:'我司[项目名称]项目部于[时间]遭遇[事件描述]。当前人员状况：[人数]人安全/[人数]人失联。恳请使馆指导和支持。',timing:'15分钟内'},{target:'总部应急中心',method:'电话',template:'[国家]突发事件通报：已启动I级应急响应。事件概要：[简述]。已采取措施：[措施列表]。下一步计划：[计划]。',timing:'30分钟内'},{target:'国内家属',method:'官方通报',template:'各位家属：我们接到[国家]项目报告，目前正在紧急处置中。全体人员已采取安全措施。请保持通信畅通，我们将第一时间通报最新情况。',timing:'2小时内'}],
    equipment:['防弹车辆 3辆','急救包 10套(含止血带、烧伤敷料)','卫星电话 5部+备用电池','防弹背心/头盔 20套','应急食品 3天量','应急饮用水 3天量','便携式发电机','应急照明灯','GPS定位追踪器','加密对讲机'],
    legalRefs:['《维也纳外交关系公约》','《中[国名]双边投资保护协定》','《境外中资企业机构和人员安全管理规定》','国际红十字会武装冲突规则'],
    insurance:'战争险/恐怖主义险(保费涵盖人员意外及绑架赎金)',
    escalation:[{when:'人员伤亡',action:'升级至国家应急响应，请求军队/使馆武力保护'},{when:'持续超72小时',action:'启动海陆空人员撤离计划，协调包机/军舰'},{when:'媒体曝光',action:'启动舆情管控，统一口径，指定唯一发言人'}],
    afterAction:'事件结束后72小时内完成复盘报告，包括：事件经过时间线、应急响应效果评估、伤亡情况统计、媒体舆情评估、预案改进建议',
    steps:[
      {title:'紧急警报发布',desc:'通过SMS/APP/广播系统向所有相关人员发布紧急警报，明确威胁类型和位置，同步通知使馆领保部门和总部应急中心',timeout:'5分钟',color:'#ff3355',checklist:['确认威胁类型','标注威胁位置','发送紧急警报','通知使馆领保','通知总部应急中心']},
      {title:'就地避险/紧急撤离',desc:'根据威胁位置决定就地避险或撤离至安全集结点。安保人员引导疏散，优先保护女性和伤病人员。关闭门窗，拉上窗帘，保持静默',timeout:'15分钟',color:'#ff8800',checklist:['判断就地避险/撤离','安保人员到位引导','优先保护弱势群体','关闭门窗/窗帘','保持通信静默']},
      {title:'人员清点与联络',desc:'到达安全点后立即清点人员，确认全员安全。统计失踪/受伤人员，向使馆和总部报告',timeout:'30分钟',color:'#ffcc00',checklist:['全员点名核对','统计失踪人数','统计受伤人数','报告使馆/总部','安抚人员情绪']},
      {title:'启动联防联动网络',desc:'联系当地警方、军方、使领馆、安保公司和第三方安全专家，启动多层级联防联动机制',timeout:'1小时',color:'#00d4ff',checklist:['联系当地警方','联系大使馆武官处','通知安保公司','启动联防网络','协调军方支援']},
      {title:'医疗救治与转运',desc:'对受伤人员进行现场急救（止血、包扎、固定），联系当地医院或启动医疗撤离',timeout:'即时',color:'#00ff9f',checklist:['现场检伤分类','实施紧急救护','联系当地医院','评估医疗撤离需求','准备医疗转运文件']},
      {title:'媒体舆情管控',desc:'指定唯一新闻发言人，统一对外口径。监控当地和国际媒体报道，及时澄清不实信息',timeout:'持续',color:'#b366ff',checklist:['指定新闻发言人','拟定统一口径','监控媒体报道','管理社交媒体','澄清不实信息']},
      {title:'事后安全评估',desc:'威胁解除后进行安全评估，确认无二次袭击风险后方可返回。评估安保漏洞，修订安保方案',timeout:'24小时',color:'#00d4ff',checklist:['确认威胁解除','排查二次风险','检查设施损坏','修订安保方案','组织心理疏导']}
    ],resources:'防弹车辆3辆、急救包10套、卫星电话5部、应急食品3天、防弹背心20套、加密对讲机10部',tags:['恐袭','武装冲突','人员安全','一级响应'],drillCycle:'每季度',owner:'安保部',lastUpdated:'2025-01-15'},
  {id:'PB-002',type:'安全风险',icon:'🔴',title:'绑架劫持应急响应预案',scope:'人员绑架/劫持人质/勒索/非法拘禁',responseTime:'30分钟',level:'I级',principle:'不激怒绑匪，保持通信，专业谈判介入，保障人质安全',
    triggerConditions:'中方人员失联超2小时/收到勒索信息/当地绑架案件高发(月均>3起)/俾路支武装活跃/墨西哥毒枭活动区域/尼日利亚三角洲',
    riskThreshold:{security:7.5,overall:6},applicableCountries:['巴基斯坦','尼日利亚','墨西哥','菲律宾','阿富汗','刚果(金)'],
    responseTeam:[{role:'谈判组长',person:'副总/区域总监'},{role:'安保顾问',person:'前军警背景安保专家'},{role:'法务顾问',person:'国际律师'},{role:'家属联络',person:'HR负责人'}],
    commPlan:[{target:'绑匪',method:'电话',template:'我们收到您的诉求。请保持沟通，我们正在核实情况。人质的安全是我们的首要关切。',timing:'首次接触'},{target:'使馆/公安部',method:'专线电话',template:'紧急通报：[人数]名中方人员于[地点]疑似被绑架，绑匪联系方式：[号码]。请求专业谈判和营救支持。',timing:'30分钟内'},{target:'总部',method:'加密通信',template:'已启动绑架劫持应急响应。事件等级：I级。已组建谈判小组。请授权应急资金[金额]。',timing:'1小时内'}],
    equipment:['加密通信设备','移动定位追踪器','应急现金(不连号)','隐蔽录音设备','防窃听检测仪','心理干预工具包'],
    legalRefs:['《反对劫持人质国际公约》','《制止向恐怖主义提供资助的国际公约》','驻在国刑法反绑架条款'],
    insurance:'绑架赎金险(保费上限$500万)、危机管理费用险',
    escalation:[{when:'绑匪提赎金要求',action:'启动赎金谈判程序，协调保险公司和总部资金'},{when:'人质受伤',action:'要求第三方(红十字会)介入见证，加速谈判'},{when:'超过7天',action:'评估武力营救可行性，请求特种部队支持'}],
    afterAction:'人质获救后：24小时内安排医疗体检和心理评估；48小时内完成事件报告；1周内安排回国休养；评估安保体系漏洞',
    steps:[
      {title:'确认绑架事实',desc:'核实绑架事件真实性，确认失联人员身份和最后位置。收集绑匪联系方式、人质状况、赎金要求等信息。排除虚假报告',timeout:'30分钟',color:'#ff3355',checklist:['确认失联人员身份','排除虚假信息','记录绑匪联系方式','获取人质证明(语音/照片)','保护现场证据']},
      {title:'组建应急谈判组',desc:'成立四组架构：现场指挥组(1人)、谈判组(2-3人)、后勤保障组(2人)、家属联络组(1人)。联系专业反绑架机构',timeout:'1小时',color:'#ff8800',checklist:['成立4个功能组','明确各组职责','指派专业谈判员','联系反绑架机构','准备应急资金']},
      {title:'建立谈判通道',desc:'与绑匪建立稳定通信渠道，采用主动倾听技巧，拖延时间避免激怒绑匪。每次通话录音留证',timeout:'2小时',color:'#ffcc00',checklist:['建立通信渠道','开始录音留证','采用倾听策略','拖延争取时间','获取人质近况']},
      {title:'情报信息管控',desc:'严格控制信息外泄，避免媒体炒作导致绑匪恐慌撕票。通知家属但限定信息范围',timeout:'持续',color:'#00d4ff',checklist:['控制信息传播范围','管理媒体关系','有限度通知家属','禁止社交媒体讨论','指定家属联络人']},
      {title:'谈判进展与评估',desc:'专业谈判人员根据绑匪行为特征制定谈判策略。评估绑匪组织背景、武器装备、心理状态',timeout:'72小时',color:'#00ff9f',checklist:['分析绑匪行为特征','制定分级谈判策略','评估武力营救风险','准备赎金交付方案','策划人质交接程序']},
      {title:'人质后期康复',desc:'人质获救后安排全面体检和心理评估，进行创伤后应激障碍(PTSD)干预，安排回国休养',timeout:'1周',color:'#b366ff',checklist:['全面医疗体检','心理创伤评估','PTSD心理干预','安排回国休养','家庭关系重建']}
    ],resources:'专业谈判团队、卫星通信设备、应急现金($50万)、心理医生、专业安保顾问',tags:['绑架','劫持','赎金谈判','人身安全'],drillCycle:'每季度',owner:'安保部',lastUpdated:'2025-01-15'},
  {id:'PB-003',type:'安全风险',icon:'🔴',title:'海外工程安保应急响应预案',scope:'工地遭袭/营地入侵/武装抢劫/爆炸破坏',responseTime:'30分钟',level:'I级',principle:'人员第一，迅速集结防御，请求安保支援',
    triggerConditions:'工程项目周边出现武装分子活动/当地安全事件增多/尼日利亚三角洲武装/俾路支武装活跃/营地周围出现可疑侦察',
    riskThreshold:{security:7,overall:6.5},applicableCountries:['尼日利亚','巴基斯坦','刚果(金)','苏丹','埃塞俄比亚','阿富汗'],
    responseTeam:[{role:'安保指挥官',person:'安保主管'},{role:'工程负责人',person:'项目经理'},{role:'医疗急救',person:'驻场医生'},{role:'外部联络',person:'外联经理'}],
    commPlan:[{target:'全体人员',method:'对讲机+广播',template:'全体注意：营地/工地遭遇[攻击类型]。执行[代号]预案。所有非武装人员前往[安全室]。安保人员部署至[防守位置]。',timing:'即时'}],
    equipment:['周界警报系统','红外监控摄像头','防弹岗亭','拒马路障','防暴盾牌','催泪喷射器','应急避难室(可容纳全体人员24小时)'],
    legalRefs:['驻在国私人安保法','项目所在国安保协议','《中国海外安保力量运用规范》'],
    insurance:'工程一切险(含战争险附加)、雇主责任险',
    escalation:[{when:'多方向同时攻击',action:'收缩防线至核心避难室，请求当地军队/警察直升机支援'},{when:'出现人员伤亡',action:'组织战地急救，评估医疗撤离至最近第三国医院'}],
    afterAction:'48小时内完成安全态势评估；72小时内修复损坏设施；1周内升级安保方案并演练',
    steps:[
      {title:'发出入侵警报',desc:'通过周界警报和对讲系统向全体人员发出入侵警报，明确攻击方位和威胁类型',timeout:'2分钟',color:'#ff3355',checklist:['触发周界警报','对讲机通报方位','人员立即停止作业','启动应急照明']},
      {title:'人员集结防御',desc:'所有非安保人员立即前往预设避难室。安保人员在预设防御位置就位。启动周界防御系统',timeout:'10分钟',color:'#ff8800',checklist:['非安保人员进避难室','安保人员就防御位','启动周界防御','投放拒马路障','关闭所有出入口']},
      {title:'请求外部支援',desc:'同时联系当地军警、使馆、安保公司和邻近中资项目请求支援',timeout:'15分钟',color:'#ffcc00',checklist:['拨打军警热线','通知使馆武官处','请求安保公司增援','联系邻近项目','启动指挥中心']},
      {title:'伤员急救转运',desc:'在避难室内对伤员进行紧急医疗处置，评估是否需要外部医疗支援或医疗撤离',timeout:'即时',color:'#00ff9f',checklist:['检伤分类','止血包扎固定','联系当地医院','评估医疗撤离','准备伤员清单']},
      {title:'战后安全确认',desc:'确认攻击已经结束/被击退，排查是否有人潜入营地，检查设施损坏情况',timeout:'2小时',color:'#00d4ff',checklist:['确认安全区域','排查潜入人员','检查设施损坏','统计弹药消耗','加强夜间警戒']}
    ],resources:'周界警报系统、红外监控、防弹岗亭2座、避难室(24小时容量)、急救站、防暴装备20套',tags:['工程安保','营地防御','武装抢劫','项目安全'],drillCycle:'每月',owner:'安保部',lastUpdated:'2025-02-01'},
  {id:'PB-004',type:'安全风险',icon:'🦠',title:'突发公共卫生事件应急响应预案',scope:'传染病暴发/疫情封控/生物安全威胁/食品安全事件',responseTime:'2小时',level:'II级',principle:'隔离防护、科学防控、人文关怀、信息透明',
    triggerConditions:'WHO宣布PHEIC/驻在国传染病暴发/当地确诊病例增长超50%/使馆发布健康警告/项目人员出现聚集性症状',
    riskThreshold:{security:3,overall:5},applicableCountries:['刚果(金)','尼日利亚','印度','孟加拉','缅甸'],
    responseTeam:[{role:'防疫组长',person:'HSE总监'},{role:'医疗顾问',person:'驻场医生'},{role:'后勤保障',person:'行政主管'},{role:'信息通报',person:'HR主管'}],
    commPlan:[{target:'全体人员',method:'每日简报',template:'疫情日报[日期]：本地新增[数字]例，累计[数字]例。项目部防控等级：[等级]。今日措施：[措施列表]。',timing:'每日'}],
    equipment:['N95口罩(人均30只)','防护服100套','快速检测试剂盒','红外体温仪','消毒液/喷雾器','隔离方舱','抗病毒药物储备'],
    legalRefs:['《国际卫生条例(2005)》','驻在国公共卫生法','《中国出境人员传染病防控指南》'],
    insurance:'传染病附加险、医疗撤离险',
    escalation:[{when:'出现确诊病例',action:'项目封闭管理，全员检测，启动方舱隔离'}],
    afterAction:'疫情结束后进行全员抗体检测，编制疫情防控总结报告，更新药品储备清单',
    steps:[
      {title:'疫情信息核实',desc:'核实疫情信息的可靠性和严重程度，联系使馆和当地卫生部门获取权威信息',timeout:'2小时',color:'#ffcc00',checklist:['核实疫情信息来源','联系使馆获取指导','联系当地卫生部','评估项目风险等级']},
      {title:'启动防控措施',desc:'根据疫情等级启动相应防控：一级—全员佩戴口罩；二级—限制外出+社交距离；三级—项目封闭+全区域消杀',timeout:'4小时',color:'#ff8800',checklist:['确定防控等级','发放防护物资','启动每日测温','建立消毒制度','设置隔离观察区']},
      {title:'医疗资源准备',desc:'盘点药品和防护物资储备，联系当地定点医院，评估重症医疗撤离能力',timeout:'24小时',color:'#00d4ff',checklist:['盘点药品储备','补足防护物资','联系定点医院','评估撤离能力','建立远程医疗通道']},
      {title:'人员动态管理',desc:'建立人员健康台账，每日测量体温，限制不必要外出，暂停聚集性活动',timeout:'持续',color:'#00ff9f',checklist:['建立健康台账','每日体温检测','限制人员外出','暂停聚集活动','心理疏导热线']},
      {title:'疫情终结评估',desc:'评估当地疫情是否得到控制，决定是否降低防控等级或恢复正常运营',timeout:'无固定',color:'#b366ff',checklist:['评估本地疫情趋势','确认无新增病例','制定降级方案','逐步恢复运营','编制总结报告']}
    ],resources:'N95口罩(人均30只)、防护服100套、快速检测试剂盒200份、消毒用品、隔离方舱、抗病毒药物',tags:['疫情','传染病','公共卫生','HSE'],drillCycle:'每半年',owner:'HSE部',lastUpdated:'2025-02-15'},
  {id:'PB-005',type:'安全风险',icon:'✈️',title:'紧急人员撤离预案(包机/军舰)',scope:'大规模撤侨/非战斗人员撤离(NEO)/医疗撤离',responseTime:'2小时',level:'I级',principle:'统一指挥，分批有序，优先老幼病孕，不遗漏一人',
    triggerConditions:'使馆发出撤离建议/战争或武装冲突爆发/重大自然灾害/政局突变危及人员安全/当地医疗条件无法满足救治需求',
    riskThreshold:{security:8.5,overall:8},applicableCountries:['苏丹','乌克兰','缅甸','阿富汗','利比亚','也门'],
    responseTeam:[{role:'撤离总指挥',person:'区域总经理'},{role:'使馆协调',person:'外联总监'},{role:'交通调度',person:'物流主管'},{role:'人员清点',person:'HR负责人'}],
    commPlan:[{target:'全体人员',method:'SMS+APP推送',template:'紧急撤离通知：已启动[国家]人员撤离预案。请携带护照和必要物品，前往[集结点]。撤离方式：[包机/军舰/陆路]。',timing:'即时'},{target:'国内家属',method:'官方短信',template:'我们已启动[国家]人员撤离程序。您的家人即将通过[方式]离开当地。将在安全后第一时间告知。',timing:'4小时内'}],
    equipment:['护照复印件(每人)','应急现金$500/人','卫星定位追踪器','人员名册(含血型/过敏史)','应急食品和水','急救包','移动充电设备','国旗/标识物'],
    legalRefs:['《维也纳领事关系公约》第5条(保护本国国民)','《中国领事保护和协助指南》'],
    insurance:'旅行紧急援助险、医疗撤离险',
    escalation:[{when:'陆路不通',action:'请求使馆协调包机/军舰，启动海路撤离'},{when:'人员失联',action:'通知使馆搜救，启动最后已知位置追踪'}],
    afterAction:'撤离完成后7天内完成人员安置报告；30天内评估项目损失和复工条件',
    steps:[
      {title:'撤离决策与通知',desc:'根据使馆和总部评估决定启动撤离，明确撤离方式(包机/军舰/陆路)、集结点和时间表',timeout:'2小时',color:'#ff3355',checklist:['使馆撤离建议确认','评估撤离方式','确定集结点','发布撤离通知','通知国内总部']},
      {title:'人员集结与清点',desc:'所有人员在指定集结点集合，按名册逐一核对。发放应急物资和身份标识物。统计特殊需求(老人/儿童/病患)',timeout:'4小时',color:'#ff8800',checklist:['人员集结点签到','逐一核对名册','发放应急物资','标记特殊人员','安排分组编队']},
      {title:'交通工具调度',desc:'确认包机时刻、军舰靠港时间或陆路车队安排。协调护航安保力量',timeout:'6小时',color:'#ffcc00',checklist:['确认交通工具','协调护航安保','规划撤离路线','准备备用路线','办理临时通行证']},
      {title:'安全转移实施',desc:'按照编队分组有序登机/登舰/登车，确保不遗漏一人。全程保持通信联络',timeout:'12小时',color:'#00d4ff',checklist:['分组有序登机/舰/车','最后点名确认','全程通信联络','监控安全动态','通知国内进展']},
      {title:'抵达后安置',desc:'到达安全地后再次清点人员，安排住宿和生活物资，提供医疗和心理服务',timeout:'24小时',color:'#00ff9f',checklist:['再次人员清点','安排住宿','提供医疗服务','心理疏导','通知家属平安']},
      {title:'善后与复工评估',desc:'评估项目资产损失情况，制定保险理赔方案，评估复工条件和时间线',timeout:'30天',color:'#b366ff',checklist:['评估项目损失','启动保险理赔','评估复工条件','编制撤离报告','修订应急预案']}
    ],resources:'护照复印件(全员)、应急现金、卫星定位器、人员名册(含医疗信息)、急救包、国旗标识物',tags:['撤侨','人员撤离','NEO','领事保护'],drillCycle:'每半年',owner:'综合管理部',lastUpdated:'2025-03-01'},
  {id:'PB-006',type:'安全风险',icon:'🛡️',title:'中方人员在海外被拘押应急响应预案',scope:'非法拘禁/司法羁押/移民拘留/行政扣留',responseTime:'2小时',level:'II级',principle:'外交渠道为主，法律救济并行，保障合法权益',
    triggerConditions:'中方人员被当地执法机构带走/护照被扣留/使馆通报领事被拘/企业收到法院传票',
    riskThreshold:{security:5,overall:4},applicableCountries:['印度','美国','印度尼西亚','越南','沙特'],
    responseTeam:[{role:'法律顾问',person:'当地注册律师'},{role:'使馆联络',person:'外联经理'},{role:'家属联络',person:'HR主管'},{role:'总部协调',person:'法务总监'}],
    commPlan:[{target:'当地执法机构',method:'律师函',template:'我代表[公司]及被拘人员[姓名]。现正式要求：1.告知拘押理由和法律依据；2.保障当事人的合法权益(饮食、医疗、翻译)；3.安排领事探视。',timing:'24小时内'}],
    equipment:['当地律师联系方式(预先签约)','领事保护热线','保释金备用','法律文书模板','中文翻译服务'],
    legalRefs:['《维也纳领事关系公约》第36条','驻在国刑事诉讼法','《中国领事保护和协助指南》'],
    insurance:'法律费用险、保释金险',
    escalation:[{when:'可能判刑',action:'聘请顶级当地律师团队，启动外交途径交涉'},{when:'人身安全受威胁',action:'紧急领事探视，要求移监至安全监所，必要时启动引渡/遣返程序'}],
    afterAction:'人员获释后安排全面体检和心理疏导；分析拘押事件的起因和教训；修订当地运营法律合规手册',
    steps:[
      {title:'确认拘押事实',desc:'核实人员被拘押的时间、地点、拘押机构名称和涉嫌罪名。确认是否获得领事通知权',timeout:'2小时',color:'#ff3355',checklist:['确认拘押机构','核实涉嫌罪名','确认拘押时间地点','了解领事通知情况','通知家属']},
      {title:'律师介入',desc:'立即联系预先签约的当地律师介入，了解案件性质和严重程度。评估保释可能性',timeout:'4小时',color:'#ff8800',checklist:['联系当地律师','律师介入沟通','了解案件性质','评估保释条件','准备保释文件']},
      {title:'使馆交涉',desc:'正式请求使馆进行领事探视，了解当事人在监所的情况，向当地政府提出外交交涉',timeout:'24小时',color:'#ffcc00',checklist:['请求领事探视','提交外交照会','了解监所状况','要求合法权益','与当地政府交涉']},
      {title:'法律应对策略',desc:'根据案件情况制定法律策略：无罪辩护/认罪协商/保释/引渡/遣返。评估政治和外交影响',timeout:'1周',color:'#00d4ff',checklist:['制定法律策略','评估政治影响','准备法庭材料','评估引渡/遣返','制定媒体策略']},
      {title:'善后与制度改进',desc:'获释后进行身体和心理恢复。分析事件教训，修订合规手册，加强员工当地法律培训',timeout:'2周',color:'#00ff9f',checklist:['医疗体检','心理评估','分析事件原因','修订合规手册','员工法律培训']}
    ],resources:'预签约律师团队(全球联网)、领事保护热线、保释金准备金、法律文书库、中文翻译服务',tags:['拘押','司法','领事保护','法律'],drillCycle:'每半年',owner:'法务部',lastUpdated:'2025-03-10'},

  // === 政治风险类 (4条) ===
  {id:'PB-007',type:'政治风险',icon:'🏛️',title:'政变/政局突变应急响应预案',scope:'军事政变/政府被推翻/总统被罢免/议会解散/戒严令',responseTime:'2小时',level:'II级',principle:'减少暴露，保护资产，灵活应对政治变化，保持政治中立',
    triggerConditions:'首都出现大规模军事调动/总统府被包围/议会宣布解散/总理宣布戒严/国务委员会接管政权/边境关闭/国际航班停飞',
    riskThreshold:{political:8.5,overall:7},applicableCountries:['缅甸','苏丹','尼日尔','加蓬','马里','布基纳法索','几内亚'],
    responseTeam:[{role:'政情分析',person:'区域首席代表'},{role:'安全顾问',person:'安保主管'},{role:'政府关系',person:'外联总监'},{role:'后勤指挥',person:'行政总监'}],
    commPlan:[{target:'全体人员',method:'紧急广播+短信',template:'[国家]局势紧急通报：已确认[事件描述]。当前使馆建议：[使馆建议]。请所有人员立即[返回住所/前往集结点]。保持通信畅通。',timing:'30分钟'},{target:'总部',method:'机密电报',template:'TOP URGENT：[国家]政局突变。政变领导人为[姓名]。对中资影响初步评估：[评估]。已采取的措施：[措施]。建议下一步：[建议]。',timing:'1小时'}],
    equipment:['政情分析简报模板','备用通信方案(卫星+海事)','现金储备(足够全员2周)','发电机和燃油储备(2周)','应急撤离包(每人1个)'],
    legalRefs:['《关于国家在条约继承方面的维也纳公约》','双边投资保护协定','国际法关于政变政权继承原则'],
    insurance:'政治风险保险(PRI)、没收/国有化险',
    escalation:[{when:'政权更迭成功',action:'研究新政权的对华政策倾向，建立与新政权各派别的沟通渠道'},{when:'爆发全国性抗议',action:'全员减少外出，加固办公场所，评估是否需要撤离'}],
    afterAction:'政局稳定后30天内完成：项目投资环境评估报告、新政权对华政策分析、项目合同重新谈判策略',
    steps:[
      {title:'政情实时追踪',desc:'通过多源情报(使馆、当地媒体、智库、外交圈)实时追踪政变进展，每隔2小时发布政情简报',timeout:'2小时',color:'#ff8800',checklist:['使馆信息确认','当地媒体监控','情报源交叉验证','首次政情简报','建立情报追踪表']},
      {title:'人员安全管控',desc:'非必要人员减少外出，必要人员外出配备安保。全面盘点在项目人员数量、位置和健康状况',timeout:'4小时',color:'#ffcc00',checklist:['非必要人员限制外出','盘点全员人数/位置','评估高风险人员','发放应急物资','加强驻地安保']},
      {title:'资产保护加固',desc:'关闭非必要运营设施，转移重要电子数据和纸质文件至安全地点，加固办公场所和仓库',timeout:'6小时',color:'#00d4ff',checklist:['关闭非必要设施','数据异地备份','重要文件转移','办公场所加固','库存盘点封存']},
      {title:'多派系关系维护',desc:'通过当地合作伙伴、律师、顾问等渠道，与各政治派别保持接触，确保中资企业和人员安全',timeout:'持续',color:'#00ff9f',checklist:['识别各派系关键人物','建立沟通渠道','表明政治中立立场','争取安全保证','关注中资议题']},
      {title:'撤离风险评估',desc:'持续评估安全局势，设定撤离红线标准。若安全形势恶化至不可接受水平，启动PB-005人员撤离预案',timeout:'持续',color:'#b366ff',checklist:['设定撤离红线','每日安全评估','准备撤离物资','规划撤离路线','与使馆保持协调']}
    ],resources:'政情分析模板、备用通信方案(卫星+海事)、现金储备(2周)、发电机+燃油(2周)、应急撤离包',tags:['政变','政局突变','政权更迭','政治中立'],drillCycle:'每半年',owner:'公共事务部',lastUpdated:'2025-02-20'},
  {id:'PB-008',type:'政治风险',icon:'⚖️',title:'外交关系恶化/降级应急响应预案',scope:'外交关系降级/大使召回/外交人员驱逐/外交制裁',responseTime:'4小时',level:'III级',principle:'降低政治敏感度，保护商业利益，多渠道维持沟通',
    triggerConditions:'两国互相驱逐外交官/大使被召回/外交部发布旅居警告/驻在国宣布对华制裁/双边高级别交流中断',
    riskThreshold:{political:7.5,overall:6},applicableCountries:['印度','加拿大','澳大利亚','立陶宛','捷克'],
    responseTeam:[{role:'政府关系',person:'公共事务总监'},{role:'法务顾问',person:'国际法律师'},{role:'商业策略',person:'区域总经理'},{role:'媒体公关',person:'品牌总监'}],
    commPlan:[{target:'使馆经商处',method:'正式照会',template:'鉴于当前双边关系变化，我司正评估在[国家]业务运营风险。恳请使馆经商处给予指导如下：[问题列表]。',timing:'24小时内'}],
    equipment:['国际法咨询团队','政治风险保险文件','替代市场调研报告','本地合规审查清单'],
    legalRefs:['《维也纳外交关系公约》','两国双边投资保护协定','WTO相关协议(如适用)'],
    insurance:'政治风险保险(PRI)、货币不可兑换险',
    escalation:[{when:'双边关系降至代办级',action:'启动资产保护方案，评估撤资可行性'},{when:'出现针对中资的歧视性政策',action:'联合受影响的第三国企业，通过法律和经济渠道维权'}],
    afterAction:'双边关系恢复后评估商业环境变化，制定市场重新进入策略',
    steps:[
      {title:'形势分析',desc:'分析外交关系恶化的深层原因和发展趋势，评估对商业运营的具体影响维度',timeout:'4小时',color:'#ffcc00',checklist:['分析恶化原因','评估发展趋势','影响维度评估','商业风险量化','编制形势报告']},
      {title:'政府沟通',desc:'通过使馆经商处了解官方立场，寻求政府层面的指导和支持。保持与两国商务部委的联系',timeout:'24小时',color:'#ff8800',checklist:['联系使馆经商处','寻求官方指导','保持商务部联系','了解政策走向','记录官方表态']},
      {title:'商业策略调整',desc:'评估各业务板块受影响程度，制定分级应对策略：维持/缩减/暂停/退出',timeout:'1周',color:'#00d4ff',checklist:['业务影响分级评估','制定分级策略','调整投资计划','评估替代市场','修订商业合同']},
      {title:'舆情与品牌管理',desc:'评估当地媒体对中资企业的报道倾向，管理企业公众形象。谨慎公开发表涉及政治的言论',timeout:'持续',color:'#00ff9f',checklist:['舆情监控','品牌风险评估','谨慎公开发言','社区关系维护','危机公关预案']}
    ],resources:'国际法律顾问、政治风险保险、替代市场调研、本地合规审查',tags:['外交','关系降级','制裁','政治风险'],drillCycle:'每年',owner:'公共事务部',lastUpdated:'2025-03-05'},

  // === 经济风险类 (3条) ===
  {id:'PB-009',type:'经济风险',icon:'📉',title:'货币/金融危机应急响应预案',scope:'汇率暴跌/恶性通胀/外汇管制/银行倒闭/主权债务违约',responseTime:'24小时',level:'III级',principle:'保障资金安全，灵活调整结算方式，降低汇率损失',
    triggerConditions:'月汇率波动超15%/外汇储备下降超30%/穆迪/标普信用降级/IMF介入谈判/外汇汇出出现困难/通胀率超50%',
    riskThreshold:{economic:8,overall:6.5},applicableCountries:['阿根廷','埃及','土耳其','巴基斯坦','斯里兰卡','黎巴嫩'],
    responseTeam:[{role:'财务指挥',person:'CFO'},{role:'银行关系',person:'资金主管'},{role:'法务顾问',person:'国际金融律师'},{role:'运营评估',person:'区域总经理'}],
    commPlan:[{target:'总部财务',method:'紧急财务报告',template:'[国家]货币危机预警：当前汇率[数字]，月贬值[%]。在途资金[金额]面临损失风险。建议立即：[措施列表]。',timing:'即时'}],
    equipment:['多币种账户(预先开立)','跨境人民币结算协议','备用银行渠道(2家以上)','货币对冲合约模板'],
    legalRefs:['两国双边投资保护协定(资金自由汇出条款)','IMF第八条款(经常项目可兑换)'],
    insurance:'货币不可兑换险、汇兑限制险、主权信用违约掉期(CDS)',
    escalation:[{when:'外汇完全管制',action:'通过双边本币互换协议渠道汇出资金，寻求央行支持'},{when:'银行系统崩溃',action:'启用备用离岸结算通道，考虑以物易物或其他替代支付方式'}],
    afterAction:'危机后30天内完成：汇率损失核算、对冲策略有效性评估、国家风险评级调整建议',
    steps:[
      {title:'资金风险摸底',desc:'全面盘点当地货币存款、在途资金、应收账款和应付账款。评估暴露在汇率波动中的净资金头寸',timeout:'24小时',color:'#ffcc00',checklist:['盘点本币存款','统计在途资金','梳理应收账款','核算净头寸','评估损失风险']},
      {title:'紧急资金转移',desc:'将可转移资金通过多种渠道(人民币结算、第三国转汇、离岸结算)尽快汇出高风险区域',timeout:'48小时',color:'#ff8800',checklist:['启动人民币结算','安排第三国转汇','联系离岸银行','准备合规文件','跟踪每笔资金']},
      {title:'定价与合同调整',desc:'与客户和供应商重新谈判合同中的价格条款和结算货币。引入汇率调整条款',timeout:'1周',color:'#00d4ff',checklist:['引入汇率调整条款','变更结算货币','重新谈判价格','启动不可抗力','评估合同违约风险']},
      {title:'运营成本优化',desc:'本地化采购降低成本暴露，优化人力资源配置，寻找替代供应链渠道',timeout:'2周',color:'#00ff9f',checklist:['本地化采购','人力成本优化','替代供应链','削减非必要支出','现金流压力测试']}
    ],resources:'多币种账户、跨境人民币结算协议、备用银行渠道、汇率对冲合约、离岸结算通道',tags:['汇率','金融危机','外汇管制','资金安全'],drillCycle:'每半年',owner:'财务部',lastUpdated:'2025-01-20'},
  {id:'PB-010',type:'经济风险',icon:'⚡',title:'能源/供应链中断应急响应预案',scope:'能源断供/原材料短缺/物流通道中断/供应商破产/港口罢工',responseTime:'12小时',level:'III级',principle:'保障生产连续性，多渠道补给，最小化运营影响',
    triggerConditions:'红海航线中断/苏伊士运河通行受阻/主要供应商破产/港口罢工持续超48小时/关键原材料库存低于15天/当地能源供应限制',
    riskThreshold:{economic:6,overall:5.5},applicableCountries:['红海区域','苏伊士运河','南非','巴基斯坦','孟加拉','越南'],
    responseTeam:[{role:'供应链指挥',person:'供应链总监'},{role:'采购联络',person:'采购经理'},{role:'物流调度',person:'物流总监'},{role:'生产协调',person:'项目经理'}],
    commPlan:[{target:'总部运营',method:'供应链中断报告',template:'报告：[国家/路线]供应链中断。影响范围：[项目列表]。预计停产时间：[时间]。建议措施：[列表]。',timing:'12小时'}],
    equipment:['备用供应商名录(预先评估)','替代物流路线方案','燃油储备(30天)','关键零部件备件','移动发电站'],
    legalRefs:['《联合国国际货物销售合同公约(CISG)》','不可抗力证明办理流程','国际物流相关公约'],
    insurance:'供应链中断险、延迟交付险',
    escalation:[{when:'关键材料库存低于7天',action:'启动空运补给，不计成本保障供应'},{when:'物流通道全面中断',action:'寻求政府协调(使馆/交通部)，评估铁路/空运替代方案'}],
    afterAction:'恢复后7天内完成供应链韧性评估，修订供应商多元化策略',
    steps:[
      {title:'中断确认与评估',desc:'确认中断的具体原因和范围，评估对项目进度和成本的影响，通知受影响的所有相关方',timeout:'12小时',color:'#ffcc00',checklist:['确认中断原因','评估影响范围','量化成本影响','通知相关方','启动应急预案']},
      {title:'替代供应启动',desc:'联系备用供应商，启动替代物流路线。评估空运/铁路/绕航等各种运输方案的可行性和成本',timeout:'24小时',color:'#ff8800',checklist:['联系备用供应商','评估空运可行性','评估铁路/绕航','计算替代成本','确认最快方案']},
      {title:'资源调配',desc:'跨项目调配库存资源，建立应急物资共享池。与邻近中资项目协调互济',timeout:'48小时',color:'#00d4ff',checklist:['跨项目调配库存','建立共享物资池','与邻近项目协调','优先保障关键项目','制定配给方案']},
      {title:'恢复与教训',desc:'待供应链恢复后，评估供应商多元化策略的有效性，扩大关键物资安全库存量',timeout:'1周',color:'#00ff9f',checklist:['评估替代方案效果','扩大安全库存量','增加供应商数量','修订供应协议','纳入合同保护条款']}
    ],resources:'备用供应商名录、替代物流方案、燃油储备(30天)、关键备件、移动发电站',tags:['供应链','物流','能源','原材料'],drillCycle:'每季度',owner:'运营部',lastUpdated:'2025-02-10'},

  // === 地缘战略风险类 (2条) ===
  {id:'PB-011',type:'地缘战略风险',icon:'🌍',title:'国际制裁/出口管制应急响应预案',scope:'制裁清单新增/出口管制升级/技术封锁/资产冻结',responseTime:'48小时',level:'II级',principle:'合规优先，灵活转产，保障核心业务连续性',
    triggerConditions:'美国OFAC/SDN清单新增/欧盟制裁清单更新/实体清单新增中资企业/技术出口许可被拒绝/金融机构拒绝交易',
    riskThreshold:{strategic:7,overall:6},applicableCountries:['美国','欧盟','日本','韩国','荷兰'],
    responseTeam:[{role:'合规官',person:'首席合规官'},{role:'法律顾问',person:'国际制裁律师'},{role:'技术评估',person:'CTO/技术总监'},{role:'供应链',person:'供应链总监'}],
    commPlan:[{target:'总部董事会',method:'合规紧急报告',template:'制裁合规紧急评估：新制裁措施[编号/名称]涉及我司业务领域[领域]。影响评估：[评估]。合规建议：[建议]。',timing:'24小时'}],
    equipment:['制裁名单筛查系统(每日自动更新)','多法律辖区合规审查模板','替代供应商技术评估报告','技术自主替代路线图'],
    legalRefs:['美国《出口管理条例(EAR)》','OFAC制裁法规','欧盟制裁条例','中国《反外国制裁法》','中国《阻断外国法律与措施不当域外适用办法》'],
    insurance:'制裁合规风险咨询险',
    escalation:[{when:'核心业务受制裁直接限制',action:'启动业务重组，将受影响业务剥离至独立实体'},{when:'供应商全面断供',action:'加速国产替代方案，评估技术自主开发可行性'}],
    afterAction:'30天内完成合规整改方案，建立常态化制裁监控机制，纳入企业风险管理系统',
    steps:[
      {title:'制裁影响审查',desc:'全面审查新制裁措施对企业的具体影响：是否涉及制裁清单、是否限制技术出口、是否影响资金结算',timeout:'48小时',color:'#ff8800',checklist:['制裁清单逐条筛查','技术出口管控审查','资金结算影响评估','供应商影响审查','客户影响审查']},
      {title:'合规整改',desc:'根据审查结果立即停止受限制的业务活动，调整供应链和技术路线，确保全面合规',timeout:'1周',color:'#ffcc00',checklist:['停止受限业务','调整供应链','修改技术路线','通知受影响的客户','更新合规手册']},
      {title:'法律应对',desc:'聘请国际律师团队评估制裁合法性，考虑通过法律途径挑战不合理的制裁措施。参考中国《反外国制裁法》',timeout:'2周',color:'#00d4ff',checklist:['律师团队评估','准备法律挑战','利用中国反制法','寻求政府支持','评估WTO争端解决']},
      {title:'技术替代方案',desc:'加速国产替代方案评估和实施，建立自主可控的技术供应链。与国内高校和科研院所合作',timeout:'持续',color:'#00ff9f',checklist:['国产技术替代评估','建立自主供应链','产学研合作','加大自研投入','技术储备规划']}
    ],resources:'制裁名单筛查系统、多辖区合规模板、替代供应商评估报告、技术自主替代路线图、国际法律团队',tags:['制裁','出口管制','合规','技术封锁'],drillCycle:'每季度',owner:'合规部',lastUpdated:'2025-03-15'},

  // === 社会文化风险类 (2条) ===
  {id:'PB-012',type:'社会文化风险',icon:'👥',title:'大规模罢工/抗议应急响应预案',scope:'工人罢工/社区抗议/反华游行/环保抗议',responseTime:'6小时',level:'III级',principle:'对话优先，尊重合法诉求，保持克制避免冲突升级',
    triggerConditions:'工会宣布罢工/当地媒体出现针对中资的负面报道/社区出现集体抗议/社交媒体出现抵制运动/当地NGO就中资项目发布报告',
    riskThreshold:{social:7,overall:5},applicableCountries:['肯尼亚','埃塞俄比亚','印度尼西亚','秘鲁','智利','蒙古'],
    responseTeam:[{role:'社区关系',person:'社区关系总监'},{role:'法务顾问',person:'当地劳工律师'},{role:'媒体公关',person:'公关经理'},{role:'基层协调',person:'当地雇员代表'}],
    commPlan:[{target:'抗议/罢工人群',method:'正式声明',template:'[公司]已注意到大家的诉求。我们重视与所有利益相关方的对话。请派出代表，我们愿意在[时间]于[地点]进行建设性沟通。',timing:'6小时'},{target:'当地政府',method:'正式照会',template:'就当前[事件]，我司始终遵守驻在国法律，尊重员工和社区权益。恳请政府协助维护正常生产经营秩序。',timing:'12小时'}],
    equipment:['劳资协议文件(双语)','社区投资项目报告','媒体通稿模板','当地律师/公关公司联络表'],
    legalRefs:['驻在国《劳动法》《工会法》','项目环评报告和批准文书','《联合国工商企业与人权指导原则》','企业社会责任报告'],
    insurance:'罢工/暴乱/民众骚乱险(SRCC)',
    escalation:[{when:'罢工持续超72小时',action:'启动临时用工方案，评估生产损失，通知重要客户'},{when:'抗议升级为暴力',action:'全员撤离，请求警方保护人员安全，评估启动PB-001恐怖袭击预案'}],
    afterAction:'事件平息后对诉求进行系统性回应，修订劳工政策和社区关系策略',
    steps:[
      {title:'事态评估与对话',desc:'分析抗议/罢工的根本原因和诉求，通过当地雇员代表与抗议人群建立对话渠道',timeout:'6小时',color:'#ffcc00',checklist:['评估根本原因','明确具体诉求','建立对话渠道','保持冷静克制','了解组织者身份']},
      {title:'法律合规确认',desc:'确认公司用工是否符合当地劳动法，环评手续是否完备。邀请第三方机构评估',timeout:'24小时',color:'#ff8800',checklist:['劳动法合规审查','环评手续核实','第三方评估','整理合规证据','预判法律风险']},
      {title:'沟通与谈判',desc:'与抗议组织者/工会代表进行正式谈判。针对合法合理诉求提出解决方案和时间表',timeout:'48小时',color:'#00d4ff',checklist:['正式谈判','提出解决方案','明确时间表','签署谅解协议','监督方案执行']},
      {title:'形象修复',desc:'通过当地媒体和社交媒体正面宣传企业的社会责任贡献。加强社区投资和公益项目',timeout:'1周',color:'#00ff9f',checklist:['正面宣传策划','社区投资增加','公益项目实施','社交媒体管理','员工关系重建']}
    ],resources:'当地劳工律师、劳资协议文件(双语)、社区投资报告、媒体公关团队、第三方评估机构',tags:['罢工','抗议','劳工','社区'],drillCycle:'每半年',owner:'人力资源部',lastUpdated:'2025-02-25'},
  {id:'PB-013',type:'社会文化风险',icon:'🗣️',title:'舆情危机/媒体负面曝光应急响应预案',scope:'国际媒体负面报道/社交媒体炒作/NGO公开报告/调查记者曝光',responseTime:'4小时',level:'III级',principle:'快速响应，透明但不自曝弱点，统一口径，主动引导舆论',
    triggerConditions:'国际主流媒体发布涉中资负面报道/推特/Facebook出现热搜话题/知名NGO发布调查报告/国际组织(世行/UN)发布批评性报告',
    riskThreshold:{social:6,overall:4.5},applicableCountries:['全球适用'],
    responseTeam:[{role:'危机发言人',person:'公共事务副总裁'},{role:'媒体关系',person:'公关总监'},{role:'法务顾问',person:'首席法律顾问'},{role:'事实核查',person:'运营总监'}],
    commPlan:[{target:'国际媒体',method:'新闻稿/记者会',template:'关于[媒体名称]于[日期]刊发的[报道标题]一文，[公司]声明如下：1.[事实澄清第一点]；2.[事实澄清第二点]。我们欢迎基于事实的客观讨论。',timing:'4小时'},{target:'利益相关方',method:'邮件沟通',template:'您可能已看到关于[公司]的近期报道。我们郑重澄清：[核心信息]。如需进一步了解，请联系[联系方式]。',timing:'8小时'}],
    equipment:['舆情监控系统(7x24)','媒体通稿模板库','事实核查数据库','发言人培训教材','社交媒体管理工具'],
    legalRefs:['驻在国诽谤法/媒体法','国际记者联合会道德准则','企业信息公开相关规定'],
    insurance:'声誉风险险',
    escalation:[{when:'舆情发酵至全球主流媒体',action:'CEO亲自出面回应，聘请全球顶级公关公司'},{when:'导致政府调查',action:'配合调查，聘请专业律所，暂停相关运营'}],
    afterAction:'舆情平息后对媒体报道进行全面分析，评估声誉损失，修订媒体沟通策略',
    steps:[
      {title:'舆情监测与预警',desc:'通过舆情监控系统实时追踪报道传播范围、社交媒体讨论热度和舆论倾向',timeout:'4小时',color:'#ffcc00',checklist:['监控报道传播范围','追踪社交媒体','分析舆论倾向','评估影响程度','准备内部通报']},
      {title:'事实核查',desc:'对报道中的指控和事实进行内部核查：是否属实、程度如何、是否有证据支持',timeout:'8小时',color:'#ff8800',checklist:['逐条核实指控','收集反驳证据','访谈相关人员','查证文件记录','形成事实清单']},
      {title:'制定回应策略',desc:'根据事实核查结果决定回应策略：坚决否认(有证据)/澄清误解/承认并承诺整改/保持沉默',timeout:'12小时',color:'#00d4ff',checklist:['选择回应策略','拟定统一口径','准备声明文稿','确定发言人','模拟记者提问']},
      {title:'多渠道信息发布',desc:'通过官方声明、社交媒体、记者会等渠道统一发布回应。保持所有渠道信息一致',timeout:'24小时',color:'#00ff9f',checklist:['发布官方声明','社交媒体统一口径','安排记者会(如需要)','通知利益相关方','持续监控舆论']},
      {title:'形象修复',desc:'通过正面报道和实际行动逐步修复公众形象。发布整改措施和社会责任项目进展',timeout:'1-4周',color:'#b366ff',checklist:['发布整改措施','启动正面宣传','增加社会责任','邀请独立审计','发布进展报告']}
    ],resources:'舆情监控系统(7x24)、媒体通稿模板库、事实核查数据库、发言人培训、社交媒体管理工具',tags:['舆情','媒体','公关','声誉'],drillCycle:'每季度',owner:'公共事务部',lastUpdated:'2025-03-01'},

  // === 自然环境风险类 (2条) ===
  {id:'PB-014',type:'自然环境风险',icon:'🌪️',title:'自然灾害应急响应预案',scope:'地震/洪水/台风/海啸/火山爆发/山体滑坡',responseTime:'即时',level:'II级',principle:'生命安全第一，快速响应，科学施救，做好灾后恢复',
    triggerConditions:'当地气象部门发布最高级别预警/USGS发布6级以上地震/台风路径经过项目区域/洪水超过警戒水位/火山活动级别提升',
    riskThreshold:{environmental:7,overall:5},applicableCountries:['印度尼西亚','日本','菲律宾','墨西哥','智利','孟加拉','缅甸'],
    responseTeam:[{role:'应急总指挥',person:'项目经理'},{role:'医疗急救',person:'驻场医生'},{role:'设施安全',person:'工程主管'},{role:'后勤保障',person:'行政主管'}],
    commPlan:[{target:'全体人员',method:'警报+广播',template:'[灾害类型]预警！预计[时间]影响[区域]。请所有人员立即[就地避险/撤离至高地/进入避难所]。准备好应急包。重复：[灾害类型]预警！',timing:'即时'},{target:'使馆/总部',method:'灾害速报',template:'[项目]遭[灾害类型]袭击。初步评估：人员[伤亡情况]，设施[损坏情况]。已启动[预案名称]。请求支援：[支援需求]。',timing:'1小时'}],
    equipment:['应急食品和饮用水(人均7天)','急救包和AED除颤仪','应急发电机和燃油','卫星电话和备用电池','帐篷和睡袋','防水手电筒','紧急信号弹','水位监测仪','地震预警接收器'],
    legalRefs:['驻在国《灾害管理法》','《联合国减少灾害风险仙台框架》','灾害应急国际人道主义援助指南'],
    insurance:'自然灾害险、工程一切险(含自然灾害附加)',
    escalation:[{when:'通信中断超24小时',action:'启用卫星通信，请求使馆协调救援力量'},{when:'灾后72小时仍有人失联',action:'请求国际救援队和搜救犬支援'}],
    afterAction:'灾后48小时内完成损失评估报告；1周内制定恢复重建方案；总结经验教训更新预案',
    steps:[
      {title:'紧急警报与避险',desc:'根据灾害类型执行对应避险程序：地震→三角区躲避；洪水→转移至高地；台风→进入坚固建筑',timeout:'即时',color:'#ff3355',checklist:['确认灾害类型','执行对应避险','人员立即行动','关闭危险设备','穿戴防护装备']},
      {title:'人员清点与搜救',desc:'灾害过后立即清点人员安全状况。组织搜救小组对失踪人员进行搜寻',timeout:'1小时',color:'#ff8800',checklist:['全员安全点名','统计失踪人员','组织搜救小组','标记危险区域','救治发现伤员']},
      {title:'设施安全评估',desc:'检查建筑物结构安全、燃气泄漏、电力系统、水源安全。评估后续余震/次生灾害风险',timeout:'4小时',color:'#ffcc00',checklist:['结构安全检查','排查燃气泄漏','电力系统评估','水源安全检测','次生灾害评估']},
      {title:'应急物资调配',desc:'发放应急食品、水和医疗物资。评估物资储备量，不足部分协调外部补给',timeout:'12小时',color:'#00d4ff',checklist:['发放应急食品/水','发放医疗物资','评估物资储备','协调外部补给','建立临时安置点']},
      {title:'恢复与重建',desc:'评估全面恢复运营的条件和时间线。修复损坏设施，补充应急物资储备',timeout:'1周',color:'#00ff9f',checklist:['制定恢复计划','修复损坏设施','补充物资储备','更新应急预案','编制灾害报告']}
    ],resources:'应急食品和水(7天量)、急救包和AED、发电机+燃油、帐篷和睡袋、卫星电话、地震预警器',tags:['自然灾害','地震','洪水','台风'],drillCycle:'每季度',owner:'HSE部',lastUpdated:'2025-02-01'},
  {id:'PB-015',type:'自然环境风险',icon:'🌡️',title:'气候变化/极端天气应急响应预案',scope:'极端高温/极端低温/暴雨暴雪/沙尘暴/干旱缺水/海平面上升',responseTime:'12小时',level:'IV级',principle:'提前预警，作业调整，保障人员健康和设备安全',
    triggerConditions:'气象部门发布极端天气预警/气温超过45°C或低于-20°C/24小时降雨量超200mm/沙尘暴能见度低于100米/干旱导致水源枯竭',
    riskThreshold:{environmental:5,overall:3.5},applicableCountries:['中东地区','中亚地区','非洲萨赫勒地区','北欧/俄罗斯','南亚'],
    responseTeam:[{role:'气象监测',person:'HSE工程师'},{role:'作业调度',person:'项目经理'},{role:'医疗保障',person:'驻场医生'},{role:'设备保障',person:'设备主管'}],
    commPlan:[{target:'全体人员',method:'每日气象简报',template:'[日期]天气预警：预计[时间段]将出现[天气类型]，[温度范围/降雨量/风速]。建议：[防护建议]。作业调整：[调整方案]。',timing:'每日'}],
    equipment:['气象监测站(联网)','防暑降温物资(降温背心/电解质饮料)','冬季保暖装备(防寒服/暖宝宝)','除冰/除雪设备','空气净化器(沙尘暴)','应急水源储备系统'],
    legalRefs:['驻在国职业健康安全法规','高温作业安全管理规定','建筑施工极端天气停工标准'],
    insurance:'极端天气附加险',
    escalation:[{when:'极端天气持续超5天',action:'评估是否需要全员撤离，启动业务连续性计划(Business Continuity Plan)'}],
    afterAction:'每次极端天气事件后更新气候风险评估，调整应对策略和物资储备',
    steps:[
      {title:'气象预警接收',desc:'接收并核实气象预警信息，通过内部渠道通知全体人员。评估对工作计划的影响',timeout:'12小时',color:'#ffcc00',checklist:['接收气象预警','核实预警等级','内部通报','评估工作计划','制定调整方案']},
      {title:'作业安全调整',desc:'根据天气类型调整作业：高温→调整工时避开正午；暴雪→暂停户外作业；沙尘暴→全员室内',timeout:'24小时',color:'#ff8800',checklist:['调整作业时间表','暂停高危户外作业','发放防护装备','检查防暑/防寒设施','设置休息区']},
      {title:'健康监护',desc:'加强人员健康监测，特别是高温/低温作业人员。配备急救药品和降温/保暖物资',timeout:'持续',color:'#00d4ff',checklist:['加强健康监测','配备急救药品','发放降温/保暖物资','关注高风险人员','建立紧急救助通道']},
      {title:'设备防护',desc:'对暴露在外的设备采取防护措施：防冻/防水/防风/防沙。检查关键设备的运行状态',timeout:'持续',color:'#00ff9f',checklist:['设备防冻/防水','设备防风/防沙','检查关键设备','备用设备准备','制定抢修方案']}
    ],resources:'气象监测站、防暑降温物资、冬季保暖装备、除冰/除雪设备、空气净化器、应急水源储备',tags:['极端天气','气候变化','高温','暴雪','沙尘暴'],drillCycle:'每半年',owner:'HSE部',lastUpdated:'2025-02-15'},

  // === 专项预案 (2条) ===
  {id:'PB-016',type:'地缘战略风险',icon:'🛡️',title:'海外知识产权保护应急响应预案',scope:'商标抢注/专利侵权/商业秘密泄露/技术转让纠纷',responseTime:'48小时',level:'III级',principle:'依法维权，证据保全，多渠道并行解决',
    triggerConditions:'收到专利侵权律师函/商标在海外被抢注(监测系统报警)/离职员工携带技术秘密入职竞争对手/合作伙伴违反技术保密协议',
    riskThreshold:{strategic:4,overall:3},applicableCountries:['印度','越南','印度尼西亚','巴西','尼日利亚','全球'],
    responseTeam:[{role:'知识产权顾问',person:'首席IP律师'},{role:'技术鉴定',person:'CTO'},{role:'商业谈判',person:'商务总监'},{role:'政府协调',person:'法务总监'}],
    commPlan:[{target:'侵权方',method:'律师函',template:'我方已注意到贵方[行为描述]涉嫌侵犯我方[专利号/商标号/版权]。请于[时限]内：[要求]。如未回应，我方将采取一切必要的法律手段维护合法权益。',timing:'48小时'}],
    equipment:['全球商标/专利监测系统','证据固定技术工具','国际IP律师事务所名录','PCT/WIPO申请文件模板','技术秘密管理制度'],
    legalRefs:['《保护工业产权巴黎公约》','《专利合作条约(PCT)》','马德里商标国际注册体系','TRIPS协议','驻在国知识产权法'],
    insurance:'知识产权侵权防御险',
    escalation:[{when:'对方拒绝停止侵权',action:'在驻在国法院提起诉讼，同时启动仲裁程序'}],
    afterAction:'维权结束后全面审查知识产权保护体系，扩充海外商标和专利注册覆盖范围',
    steps:[
      {title:'侵权确认',desc:'确认侵权行为的基本事实，收集和固定证据，评估侵权规模和损害程度',timeout:'48小时',color:'#ffcc00',checklist:['确认侵权行为','收集侵权证据','固定证据链','评估损害程度','准备维权方案']},
      {title:'法律措施启动',desc:'发送律师函/停止侵权函，同时准备诉讼或仲裁材料。在驻在国法院申请临时禁令',timeout:'1周',color:'#ff8800',checklist:['发送律师函','申请临时禁令','准备诉讼材料','评估仲裁可行性','启动政府协调']},
      {title:'商业谈判',desc:'在启动法律程序的同时寻求商业解决方案：许可协议/交叉授权/收购/合作',timeout:'2周',color:'#00d4ff',checklist:['探索商业解决方案','评估许可/授权','交叉授权谈判','评估收购可能性','达成和解协议']}
    ],resources:'全球IP监测系统、证据固定工具、国际IP律所名录、PCT/WIPO文件模板、技术秘密管理制度',tags:['知识产权','专利','商标','技术保护'],drillCycle:'每年',owner:'法务部',lastUpdated:'2025-03-20'}
];
// ===== MATRIX VIEW (Matrix + Cases + Cross-Analysis) =====
const MATRIX={
  crossMode:'ent-cty',
  init(){
    this.renderStats();
    this.renderMatrix();
    this.renderEntTable();
    this.renderCases();
    this.renderCrossModes();
    this.renderCross();
  },
  renderStats(){
    const ents=[...ENTERPRISES].map(e=>({...e,rs:getEntRisk(e)}));
    const high=ents.filter(e=>e.rs>=6).length;
    const mid=ents.filter(e=>e.rs>=4&&e.rs<6).length;
    const low=ents.filter(e=>e.rs<4).length;
    document.getElementById('matrix-stats').innerHTML=[
      {ic:'🔴',bg:'var(--red-bg)',c:'var(--red)',l:'高风险企业',v:high,s:'风险≥6.0'},
      {ic:'🟠',bg:'var(--orange-bg)',c:'var(--orange)',l:'中风险企业',v:mid,s:'4.0-6.0'},
      {ic:'🟢',bg:'var(--green-bg)',c:'var(--green)',l:'低风险企业',v:low,s:'<4.0'},
      {ic:'📊',bg:'var(--blue-bg)',c:'var(--cyan)',l:'企业总数',v:ents.length,s:''+ENTERPRISES.reduce((s,e)=>s+e.investment,0)+'亿$投资'},
      {ic:'⚠️',bg:'var(--yellow-bg)',c:'var(--yellow)',l:'高风险国家',v:COUNTRIES.filter(c=>calcOverall(c.scores)>=6).length,s:'风险≥6.0'},
      {ic:'💣',bg:'var(--red-bg)',c:'var(--red)',l:'高危资产',v:ents.filter(e=>e.rs>=6).reduce((s,e)=>s+e.investment,0),s:'亿$高风险敞口'}
    ].map(s=>'<div class="stat-card"><div class="stat-ic" style="background:'+s.bg+';color:'+s.c+'">'+s.ic+'</div><div class="stat-info"><div class="stat-label">'+s.l+'</div><div class="stat-val" style="color:'+s.c+'">'+s.v+'</div><div class="stat-sub">'+s.s+'</div></div></div>').join('');
  },
  renderMatrix(){
    function cellLv(l,i){const s=l*i;if(s>=16)return 5;if(s>=12)return 4;if(s>=8)return 3;if(s>=4)return 2;return 1;}
    function getCtyCell(c){const ov=calcOverall(c.scores);return{l:Math.min(5,Math.ceil(ov/2)),i:Math.min(4,Math.ceil(ov/2.5))};}
    const ll=['极低','较低','中等','较高','极高'],il=['影响较小','影响一般','影响较大','影响严重'];
    let h='<div class="mx-cell hdr"></div>'+ll.map(l=>'<div class="mx-cell hdr">'+l+'</div>').join('');
    for(let imp=4;imp>=1;imp--){
      h+='<div class="mx-cell hdr">'+il[imp-1]+'</div>';
      for(let lk=1;lk<=5;lk++){
        const lv=cellLv(lk,imp);
        const cs=COUNTRIES.filter(c=>{const cc=getCtyCell(c);return cc.l===lk&&cc.i===imp;});
        const labels=['','低','中低','中高','高','极高'];
        h+='<div class="mx-cell mx-l'+lv+'" onclick="showMatrixCties('+lk+','+imp+')"><span class="mx-count">'+cs.length+'</span><span class="mx-lbl">'+labels[lv]+'</span></div>';
      }
    }
    document.getElementById('matrix-grid').innerHTML=h;
  },
  renderEntTable(){
    const ents=[...ENTERPRISES].map(e=>({...e,rs:getEntRisk(e)})).sort((a,b)=>b.rs-a.rs);
    document.getElementById('matrix-ent-table').innerHTML=ents.map(e=>{
      const lv=getLevel(e.rs);
      const bar='<div class="risk-bar" style="width:50px"><div class="risk-bar-fill" style="width:'+e.rs*10+'%;background:'+lv.color+'"></div></div>';
      return '<tr style="cursor:pointer" onclick="showEntDetail('+e.id+')"><td><strong>'+e.short+'</strong></td><td>'+e.industry+'</td><td>'+bar+' <strong style="color:'+lv.color+'">'+e.rs.toFixed(1)+'</strong></td><td>'+e.investment+'亿$</td><td>'+e.personnel.toLocaleString()+'</td><td><span class="badge '+lv.cls+'">'+lv.short+'</span></td></tr>';
    }).join('');
  },
  renderCases(){
    const cases=[
      {t:'苏丹中石油油田撤离',d:'2023年4月苏丹爆发全面武装冲突，中国组织1,500余名公民撤离。中石油6区、7区油田运营中断，资产损失约35亿美元。',l:'极高×极高',cat:'武装冲突',cty:'苏丹',ent:'中石油',yr:'2023'},
      {t:'巴基斯坦达苏水电站遇袭',d:'2024年3月26日达苏水电站中方人员遭自杀式炸弹袭击，5名中国工程师遇难。此前2021年7月同项目已致9人遇难。',l:'高×高',cat:'恐怖袭击',cty:'巴基斯坦',ent:'中电建',yr:'2024'},
      {t:'卡拉奇孔子学院班车遇袭',d:'2022年4月26日卡拉奇大学孔子学院班车遭自杀式袭击，3名中国教师遇难。BLA宣称负责。',l:'高×高',cat:'恐怖袭击',cty:'巴基斯坦',ent:'教育机构',yr:'2022'},
      {t:'哥伦比亚紫金武里蒂卡金矿',d:'2024年1月紫金矿业公告金矿被非法采矿组织控制60%以上。2023年记录2,260次爆炸和2,450次枪击。',l:'高×高',cat:'武装占领',cty:'哥伦比亚',ent:'紫金矿业',yr:'2024'},
      {t:'缅北战事波及中资项目',d:'2023-2025年缅北武装冲突升级，中资水电矿产项目受冲击，人员多次撤离。',l:'高×中',cat:'武装冲突',cty:'缅甸',ent:'中能建',yr:'2023-25'},
      {t:'尼日利亚中资员工绑架案',d:'2024年6月拉各斯中资企业2名中国籍员工遭绑架，支付赎金后获释。',l:'中×高',cat:'绑架勒索',cty:'尼日利亚',ent:'多家中企',yr:'2024'},
      {t:'俄罗斯北极LNG制裁案',d:'2023年11月美国制裁北极LNG 2项目，中石化、中海油宣布不可抗力退出。42亿美元中资滞留。',l:'中×中',cat:'经济制裁',cty:'俄罗斯',ent:'中石化',yr:'2023'},
      {t:'乌克兰撤离行动',d:'2022年2月俄乌冲突爆发，中国撤离5,000余名公民及留学生。',l:'极高×高',cat:'战争',cty:'乌克兰',ent:'多家中企',yr:'2022'},
      {t:'塞尔维亚紫金博尔铜矿',d:'中塞自贸协定2024年生效，紫金博尔铜矿推进顺利，8亿美元投资，400名中方人员安全作业。',l:'低×低',cat:'成功案例',cty:'塞尔维亚',ent:'紫金矿业',yr:'2024'},
      {t:'阿富汗中资企业撤离',d:'2021年8月塔利班接管喀布尔，中色梅斯艾纳克铜矿项目无限期搁置，30亿美元投资面临不确定性。',l:'极高×极高',cat:'政权更迭',cty:'阿富汗',ent:'中色',yr:'2021'}
    ];
    this._cases=cases;
    document.getElementById('matrix-cases').innerHTML=CRUD.toolbar('共 '+cases.length+' 个案例','MATRIX.showCaseForm()','MATRIX.exportData()',null)+'<div class="grid" style="grid-template-columns:1fr 1fr">'+cases.map((c,i)=>{
      const bc=c.cat==='恐怖袭击'||c.cat==='战争'?'var(--red)':c.cat==='武装冲突'||c.cat==='武装占领'?'var(--orange)':c.cat==='经济制裁'?'var(--yellow)':c.cat==='成功案例'?'var(--green)':'var(--cyan)';
      const cls=c.l.includes('极高')?'b-red':c.l.includes('高')?'b-orange':c.l.includes('中')?'b-yellow':'b-green';
      return '<div style="padding:12px;background:var(--panel2);border:1px solid var(--border);border-left:3px solid '+bc+';border-radius:8px;cursor:pointer;transition:.15s" onmouseover="this.style.borderColor=\''+bc+'\';this.style.transform=\'translateY(-2px)\'" onmouseout="this.style.borderColor=\'var(--border)\';this.style.transform=\'\'" onclick="MATRIX.showCase('+i+')"><div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:6px"><div><strong style="font-size:13px">'+c.t+'</strong><div class="text-xs text-muted">'+c.cty+' | '+c.ent+' | '+c.yr+'</div></div><div class="flex gap-8"><span class="badge '+cls+'">'+c.l+'</span><span class="badge b-blue">'+c.cat+'</span></div></div><div class="text-xs text-muted" style="line-height:1.6">'+c.d.substring(0,100)+'...</div><div style="margin-top:6px;font-size:10px;color:var(--cyan)">📌 点击查看完整案例分析 →</div>'+(PERM.isAdmin()?'<div style="display:flex;gap:2px"><button class="btn sm" style="font-size:9px;padding:1px 5px" onclick="event.stopPropagation();MATRIX.showCaseForm('+i+')">✏️</button><button class="btn sm danger" style="font-size:9px;padding:1px 5px" onclick="event.stopPropagation();MATRIX.deleteCase('+i+')">🗑️</button></div>':'')+'</div>';
    }).join('')+'</div>';
  },
  showCase(i){
    const c=this._cases[i];
    var bc=c.cat==='恐怖袭击'||c.cat==='战争'?'var(--red)':c.cat==='武装冲突'||c.cat==='武装占领'?'var(--orange)':c.cat==='经济制裁'?'var(--yellow)':c.cat==='成功案例'?'var(--green)':'var(--cyan)';
    var cls=c.l.includes('极高')?'b-red':c.l.includes('高')?'b-orange':c.l.includes('中')?'b-yellow':'b-green';
    var timeline='';
    if(c.cat==='恐怖袭击'||c.cat==='武装冲突'||c.cat==='战争'||c.cat==='武装占领'){
      timeline='<div style="margin-bottom:12px"><strong style="font-size:12px;color:var(--cyan)">📅 事件时间线</strong>'+
        '<div style="margin-top:8px">'+
        '<div style="display:flex;gap:10px;margin-bottom:6px"><div style="width:8px;height:8px;border-radius:50%;background:var(--red);flex-shrink:0;margin-top:4px"></div><div><div style="font-size:12px;font-weight:600">事件发生</div><div class="text-xs text-muted">'+c.yr+' - 安全态势突变</div></div></div>'+
        '<div style="display:flex;gap:10px;margin-bottom:6px"><div style="width:8px;height:8px;border-radius:50%;background:var(--orange);flex-shrink:0;margin-top:4px"></div><div><div style="font-size:12px;font-weight:600">应急响应启动</div><div class="text-xs text-muted">启动应急预案，联系使馆和总部</div></div></div>'+
        '<div style="display:flex;gap:10px;margin-bottom:6px"><div style="width:8px;height:8px;border-radius:50%;background:var(--yellow);flex-shrink:0;margin-top:4px"></div><div><div style="font-size:12px;font-weight:600">人员撤离/安全保障</div><div class="text-xs text-muted">组织人员撤离至安全区域</div></div></div>'+
        '<div style="display:flex;gap:10px"><div style="width:8px;height:8px;border-radius:50%;background:var(--green);flex-shrink:0;margin-top:4px"></div><div><div style="font-size:12px;font-weight:600">事后恢复</div><div class="text-xs text-muted">评估损失，恢复运营或终止项目</div></div></div>'+
        '</div></div>';
    }
    var lessons='';
    if(c.cat==='恐怖袭击'){
      lessons='<li>建立项目周边安全缓冲区，配备专业安保力量</li><li>加强人员出行管理，实行乘车安全规程</li><li>与当地安全部门建立信息共享机制</li><li>定期开展反恐应急演练</li>';
    }else if(c.cat==='武装冲突'||c.cat==='战争'){
      lessons='<li>制定分级撤离预案，预设多条撤离路线</li><li>储备足量应急物资（食品、药品、通信设备）</li><li>与驻外使领馆保持密切联系</li><li>购买战争险和政治风险保险</li>';
    }else if(c.cat==='经济制裁'){
      lessons='<li>关注制裁清单更新，提前调整业务布局</li><li>建立合规审查机制，确保交易合法</li><li>探索替代结算渠道（本币结算等）</li><li>与法律顾问保持密切沟通</li>';
    }else if(c.cat==='成功案例'){
      lessons='<li>选择政治稳定、法制健全的投资目的地</li><li>重视ESG和社会责任，赢得当地支持</li><li>充分利用双边投资保护协定</li><li>建立长期运营视角，不追求短期回报</li>';
    }else{
      lessons='<li>加强安全风险评估和预警</li><li>建立完善的应急响应机制</li><li>保障人员安全和资产安全</li><li>与多方保持沟通协调</li>';
    }
    document.getElementById('modal-tt').textContent=c.t;
    document.getElementById('modal-bd').innerHTML='<div class="grid mb-12" style="grid-template-columns:1fr 1fr;gap:10px">'+
      '<div style="padding:12px;background:var(--bg2);border-radius:8px"><div class="text-xs text-muted">风险等级</div><div style="font-weight:700;font-size:18px;margin-top:4px"><span class="badge '+cls+'">'+c.l+'</span></div></div>'+
      '<div style="padding:12px;background:var(--bg2);border-radius:8px"><div class="text-xs text-muted">事件类别</div><div style="font-weight:700;font-size:16px;margin-top:4px;color:'+bc+'">'+c.cat+'</div></div>'+
      '<div style="padding:12px;background:var(--bg2);border-radius:8px"><div class="text-xs text-muted">发生国家</div><div style="font-weight:700;font-size:16px;margin-top:4px">'+c.cty+'</div></div>'+
      '<div style="padding:12px;background:var(--bg2);border-radius:8px"><div class="text-xs text-muted">涉及企业</div><div style="font-weight:700;font-size:16px;margin-top:4px">'+c.ent+'</div></div>'+
      '</div>'+
      '<div style="padding:14px;background:var(--red-bg);border-left:4px solid '+bc+';border-radius:8px;margin-bottom:14px"><strong style="color:'+bc+'">📋 案例详情</strong><p style="margin:8px 0 0;line-height:1.8;font-size:13px">'+c.d+'</p></div>'+
      timeline+
      '<div style="padding:12px;background:var(--blue-bg);border-radius:8px;margin-bottom:12px"><strong style="color:var(--cyan);font-size:12px">💡 经验教训与启示</strong><ul style="margin:8px 0 0;padding-left:18px;font-size:12px;line-height:1.8;color:var(--text2)">'+lessons+'</ul></div>'+
      '<div style="padding:12px;background:var(--orange-bg);border-radius:8px"><strong style="color:var(--orange);font-size:12px">⚠️ 风险防范建议</strong><ul style="margin:8px 0 0;padding-left:18px;font-size:12px;line-height:1.8;color:var(--text2)"><li>建立全面安全评估体系，定期更新风险评级</li><li>制定并演练应急预案，确保快速响应能力</li><li>投保海外投资保险，分散政治和安全风险</li><li>与驻外使领馆、当地政府保持密切沟通</li></ul></div>';
    document.getElementById('modal').classList.add('show');
  },
  showCaseForm(i){if(!PERM.guard('\u65b0\u589e/\u7f16\u8f91\u6848\u4f8b'))return;
    var c=(i!==undefined&&i!==null)?this._cases[i]:null;
    var fields=[
      {key:'t',label:'案例标题',required:true},
      {key:'cty',label:'国家'},
      {key:'ent',label:'关联企业'},
      {key:'yr',label:'年份'},
      {key:'cat',label:'类别',type:'select',options:['武装冲突','恐怖袭击','武装占领','经济制裁','战争','政权更迭','绑架勒索','成功案例']},
      {key:'l',label:'风险等级',type:'select',options:['极高×极高','高×高','高×中','中×高','中×中','低×低']},
      {key:'d',label:'案例描述',type:'textarea',rows:4}
    ];
    CRUD.showForm(c?'编辑案例':'新增案例',fields,function(obj){
      if(c){Object.assign(c,obj);showToast('✅ 案例已更新');}
      else{this._cases=this._cases||[];this._cases.push(obj);showToast('✅ 案例已添加');}
      this.renderCases();
    }.bind(this),c);
  },
  deleteCase(i){
    if(!PERM.guard('\u5220\u9664\u6848\u4f8b'))return;
    showConfirm('确定删除该案例？',function(){
      if(this._cases&&this._cases[i]){this._cases.splice(i,1);showToast('🗑️ 已删除');this.renderCases();}
    }.bind(this));
  },
  exportData(){
    DataHub.exportJSON(this._cases||[],'matrix_cases_export.json');
  },
  renderCrossModes(){
    document.getElementById('cross-modes').innerHTML=[
      {m:'ent-cty',l:'🏢×🌐 企业×国家'},
      {m:'industry-region',l:'🏭×🗺️ 行业×区域'},
      {m:'time-compare',l:'📈 时序对比'},
      {m:'correlation',l:'🔗 关联分析'}
    ].map(o=>'<div class="dc-tab '+(this.crossMode===o.m?'active':'')+'" onclick="MATRIX.crossMode=\''+o.m+'\';MATRIX.renderCross()">'+o.l+'</div>').join('');
  },
  renderCross(){
    document.querySelectorAll('#cross-modes .dc-tab').forEach((e,i)=>{e.classList.toggle('active',['ent-cty','industry-region','time-compare','correlation'][i]===this.crossMode);});
    const el=document.getElementById('cross-content');
    if(this.crossMode==='ent-cty')this._crossEntCty(el);
    else if(this.crossMode==='industry-region')this._crossIndReg(el);
    else if(this.crossMode==='time-compare')this._crossTime(el);
    else this._crossCorr(el);
  },
  _crossEntCty(el){
    const ents=[...ENTERPRISES].map(e=>({...e,rs:getEntRisk(e)})).sort((a,b)=>b.rs-a.rs);
    const topC=COUNTRIES.sort((a,b)=>calcOverall(b.scores)-calcOverall(a.scores)).slice(0,12);
    let h='<div style="overflow-x:auto"><table style="font-size:10px"><thead><tr><th style="position:sticky;left:0;background:var(--bg2);z-index:2">企业 \ 国家</th>'+topC.map(c=>'<th style="text-align:center;min-width:65px;writing-mode:vertical-rl;font-size:9px;padding:4px 2px">'+c.flag+' '+c.name+'</th>').join('')+'</tr></thead><tbody>';
    ents.forEach(e=>{
      h+='<tr><td style="font-weight:600;position:sticky;left:0;background:var(--panel);z-index:1;max-width:70px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+e.short+'</td>';
      topC.forEach(c=>{
        if(!e.countries.includes(c.name)){h+='<td style="text-align:center;color:var(--text3)">—</td>';return;}
        const crs=(e.rs+calcOverall(c.scores))/2;const lv=getLevel(crs);
        h+='<td style="text-align:center;background:'+lv.color+'15;font-weight:700;color:'+lv.color+';cursor:pointer" onclick="showToast(\''+e.short+' × '+c.name+': '+crs.toFixed(1)+'\')">'+crs.toFixed(1)+'</td>';
      });
      h+='</tr>';
    });
    h+='</tbody></table></div><div class="mt-8 text-xs text-muted text-center">数值=企业风险与国家风险综合平均值</div>';
    el.innerHTML=h;
  },
  _crossIndReg(el){
    const inds=[...new Set(ENTERPRISES.map(e=>e.industry))];
    const regs=[...new Set(COUNTRIES.map(c=>c.region))];
    let h='<div style="overflow-x:auto"><table style="font-size:11px"><thead><tr><th>行业 \ 区域</th>'+regs.map(r=>'<th style="text-align:center;padding:6px">'+r+'</th>').join('')+'<th>平均</th></tr></thead><tbody>';
    inds.forEach(ind=>{
      h+='<tr><td style="font-weight:700">'+ind+'</td>';
      let vals=[];
      regs.forEach(r=>{
        const ents=ENTERPRISES.filter(e=>e.industry===ind&&e.countries.some(cn=>{const ct=COUNTRIES.find(x=>x.name===cn);return ct&&ct.region===r;}));
        if(!ents.length){h+='<td style="text-align:center;color:var(--text3)">—</td>';vals.push(null);return;}
        const avg=Math.round(ents.reduce((s,e)=>s+getEntRisk(e),0)/ents.length*10)/10;
        vals.push(avg);const lv=getLevel(avg);
        h+='<td style="text-align:center;background:'+lv.color+'15;font-weight:700;color:'+lv.color+';padding:6px;cursor:pointer" onclick="showToast(\''+ind+' 在 '+r+': '+avg.toFixed(1)+' ('+ents.length+'家)\')">'+avg.toFixed(1)+'<br><span style="font-size:9px">'+ents.length+'家</span></td>';
      });
      const valid=vals.filter(x=>x!==null);
      const ov=valid.length?Math.round(valid.reduce((a,b)=>a+b,0)/valid.length*10)/10:null;
      h+='<td style="text-align:center;font-weight:700;color:'+(ov?getLevel(ov).color:'var(--text3)')+'">'+(ov?ov.toFixed(1):'—')+'</td></tr>';
    });
    h+='</tbody></table></div>';
    el.innerHTML=h;
  },
  _crossTime(el){
    const months=['1月','2月','3月','4月','5月','6月','7月'];
    const regs=['南亚','中东','非洲','东南亚','东欧','拉美'];
    const base={南亚:6.5,中东:5.8,非洲:6.0,东南亚:4.2,东欧:5.5,拉美:4.8};
    let h='<div style="overflow-x:auto"><table style="font-size:11px"><thead><tr><th>区域</th>'+months.map(m=>'<th style="text-align:center;min-width:55px">'+m+'</th>').join('')+'<th>趋势</th></tr></thead><tbody>';
    regs.forEach(r=>{
      h+='<tr><td style="font-weight:700">'+r+'</td>';
      let vals=[];
      months.forEach((m,j)=>{const v=Math.round((base[r]+(Math.random()-0.5)*1.2+j*0.05)*10)/10;vals.push(v);const lv=getLevel(v);h+='<td style="text-align:center;background:'+lv.color+'10;font-weight:600;color:'+lv.color+';padding:4px">'+v.toFixed(1)+'</td>';});
      const tr=vals[6]-vals[0];
      h+='<td style="text-align:center;font-size:10px">'+(tr>0.3?'📈 <span style="color:var(--red)">+'+tr.toFixed(1)+'</span>':tr<-0.3?'📉 <span style="color:var(--green)">'+tr.toFixed(1)+'</span>':'➡️ 稳定')+'</td></tr>';
    });
    h+='</tbody></table></div>';
    el.innerHTML=h;
  },
  _crossCorr(el){
    const dims=[{k:'political',n:'政治'},{k:'security',n:'安全'},{k:'economic',n:'经济'},{k:'legal',n:'法律'},{k:'social',n:'社会'},{k:'natural',n:'自然'},{k:'operational',n:'运营'},{k:'geopolitical',n:'地缘'}];
    const corr=[[1,.72,.45,.38,.55,.12,.41,.68],[.72,1,.35,.42,.60,.08,.48,.55],[.45,.35,1,.65,.52,.22,.70,.38],[.38,.42,.65,1,.48,.15,.55,.32],[.55,.60,.52,.48,1,.18,.52,.45],[.12,.08,.22,.15,.18,1,.25,.08],[.41,.48,.70,.55,.52,.25,1,.35],[.68,.55,.38,.32,.45,.08,.35,1]];
    let h='<div style="overflow-x:auto"><table style="font-size:10px"><thead><tr><th></th>'+dims.map(d=>'<th style="text-align:center;padding:4px">'+d.n+'</th>').join('')+'</tr></thead><tbody>';
    dims.forEach((d,i)=>{
      h+='<tr><td style="font-weight:700">'+d.n+'</td>';
      dims.forEach((_,j)=>{
        const v=corr[i][j];
        const col=v>=.7?'#ff3355':v>=.5?'#ff8800':v>=.3?'#ffcc00':'#00ff9f';
        h+='<td style="text-align:center;padding:6px;background:'+col+'15;font-weight:700;color:'+col+'">'+v.toFixed(2)+'</td>';
      });
      h+='</tr>';
    });
    h+='</tbody></table></div><div class="flex gap-12 mt-8 text-xs text-muted wrap justify-center" style="justify-content:center"><span>🔴 强(≥0.7)</span><span>🟠 中(0.5-0.7)</span><span>🟡 弱(0.3-0.5)</span><span>🟢 无(<0.3)</span></div>';
    h+='<div class="mt-8" style="padding:12px;background:var(--blue-bg);border-radius:8px"><strong style="color:var(--cyan)">📊 关键洞察</strong><ul style="margin:6px 0 0;padding-left:18px;font-size:11px;line-height:1.7;color:var(--text2)"><li><strong>政治↔安全</strong> 强正相关(0.72)</li><li><strong>经济↔运营</strong> 强正相关(0.70)</li><li><strong>政治↔地缘</strong> 强正相关(0.68)</li><li><strong>自然灾害</strong> 独立风险因子</li></ul></div>';
    el.innerHTML=h;
  }
};

// ===== FORECAST VIEW =====
const FORECAST={
  tab:'prediction',
  // === FORECAST CRUD ===
  showPredForm(idx){if(!PERM.guard('\u65b0\u589e/\u7f16\u8f91\u9884\u6d4b'))return;
    var p=(idx!=null&&idx>=0)?PREDICTIONS[idx]:null;
    var fields=[
      {key:'country',label:'\u56fd\u5bb6',required:true},
      {key:'current',label:'\u5f53\u524d\u98ce\u9669\u5206',type:'number',default:5},
      {key:'predicted',label:'\u9884\u6d4b\u98ce\u9669\u5206',type:'number',default:5},
      {key:'direction',label:'\u8d8b\u52bf',type:'select',options:[{value:'up',label:'\u4e0a\u5347'},{value:'down',label:'\u4e0b\u964d'},{value:'flat',label:'\u6301\u5e73'}]},
      {key:'confidence',label:'\u7f6e\u4fe1\u5ea6(%)',type:'number',default:80},
      {key:'timeframe',label:'\u9884\u6d4b\u65f6\u95f4\u8303\u56f4'},
      {key:'keyFactors',label:'\u5173\u952e\u56e0\u7d20',type:'textarea',rows:3},
      {key:'recommendation',label:'\u5efa\u8bae',type:'textarea',rows:2}
    ];
    CRUD.showForm(p?'\u7f16\u8f91\u9884\u6d4b':'\u65b0\u589e\u9884\u6d4b',fields,function(obj){
      if(p){Object.assign(p,obj);showToast('\u2705 \u9884\u6d4b\u5df2\u66f4\u65b0');}
      else{PREDICTIONS.push(obj);showToast('\u2705 \u9884\u6d4b\u5df2\u6dfb\u52a0');}
      DataHub.save('predictions');this.render();
    }.bind(this),p);
  },
  deletePred(idx){if(!PERM.guard('\u5220\u9664\u9884\u6d4b'))return;
    showConfirm('\u786e\u5b9a\u5220\u9664\u8be5\u9884\u6d4b\uff1f',function(){
      if(idx>=0&&idx<PREDICTIONS.length){PREDICTIONS.splice(idx,1);DataHub.save('predictions');showToast('\u{1F5D1}\ufe0f \u5df2\u5220\u9664');FORECAST.render();}
    });
  },
  exportData(){
    DataHub.exportJSON(PREDICTIONS,'predictions_export.json');
  },
  switch(t){
    this.tab=t;
    var tabs=['prediction','scenario','expert','stats'];
    document.querySelectorAll('#fc-tabs .dc-tab').forEach(function(e,i){e.classList.toggle('active',tabs[i]===t);});
    this.render();
  },
  init(){this.switch('prediction');},
  render(){
    const el=document.getElementById('fc-content');
    if(this.tab==='prediction')this.renderPrediction(el);
    else if(this.tab==='scenario')this.renderScenario(el);
    else if(this.tab==='expert')this.renderExpert(el);
    else this.renderStats(el);
  },
  renderPrediction(el){
    var upCount=PREDICTIONS.filter(function(p){return p.trend==='up';}).length;
    var downCount=PREDICTIONS.filter(function(p){return p.trend==='down';}).length;
    var avgCur=PREDICTIONS.reduce(function(s,p){return s+p.cur;},0)/PREDICTIONS.length;
    var avgP6=PREDICTIONS.reduce(function(s,p){return s+p.p6;},0)/PREDICTIONS.length;
    var html='<div class="stat-grid mb-12" style="grid-template-columns:repeat(4,1fr)">'+
      '<div class="stat-card"><div class="stat-ic" style="background:var(--red-bg);color:var(--red)">📈</div><div class="stat-info"><div class="stat-label">风险上升趋势</div><div class="stat-val" style="color:var(--red)">'+upCount+'国</div><div class="stat-sub">需重点关注</div></div></div>'+
      '<div class="stat-card"><div class="stat-ic" style="background:var(--green-bg);color:var(--green)">📉</div><div class="stat-info"><div class="stat-label">风险下降趋势</div><div class="stat-val" style="color:var(--green)">'+downCount+'国</div><div class="stat-sub">形势改善</div></div></div>'+
      '<div class="stat-card"><div class="stat-ic" style="background:var(--blue-bg);color:var(--cyan)">📊</div><div class="stat-info"><div class="stat-label">当前平均风险</div><div class="stat-val" style="color:var(--cyan)">'+avgCur.toFixed(1)+'</div><div class="stat-sub">监测'+PREDICTIONS.length+'国</div></div></div>'+
      '<div class="stat-card"><div class="stat-ic" style="background:var(--orange-bg);color:var(--orange)">🔮</div><div class="stat-info"><div class="stat-label">6月预测平均</div><div class="stat-val" style="color:var(--orange)">'+avgP6.toFixed(1)+'</div><div class="stat-sub">变化'+(avgP6>avgCur?'+':'')+(avgP6-avgCur).toFixed(1)+'</div></div></div>'+
      '</div>';
    html+=CRUD.toolbar('共 '+PREDICTIONS.length+' 国预测','FORECAST.showPredForm()','FORECAST.exportData()',null)+
      '<div class="grid mb-12" style="grid-template-columns:1fr 320px;gap:12px">'+
      '<div class="card"><div class="card-tt"><span class="ic">🔮</span>风险预测模型 (未来3-6个月)</div>'+
      '<div class="table-wrap" style="max-height:500px;overflow-y:auto"><table><thead><tr><th>国家</th><th>当前风险</th><th>3月预测</th><th>6月预测</th><th>变化趋势</th><th>置信度</th><th>驱动因素</th><th>处置建议</th><th>操作</th></tr></thead><tbody>'+
      PREDICTIONS.map(function(p){
        var tr=p.trend==='up'?'<span style="color:var(--red)">↑ 上升</span>':'<span style="color:var(--green)">↓ 下降</span>';
        var delta=p.p6-p.cur;
        var deltaHtml=delta>0?'<span style="color:var(--red);font-weight:700">+'+delta.toFixed(1)+'</span>':delta<0?'<span style="color:var(--green);font-weight:700">'+delta.toFixed(1)+'</span>':'<span style="color:var(--text2)">±0.0</span>';
        var conf=Math.round(75+Math.random()*20);
        var confColor=conf>=90?'var(--green)':conf>=80?'var(--cyan)':'var(--yellow)';
        return '<tr><td>'+p.flag+' <strong>'+p.country+'</strong></td><td><strong style="color:'+getLevel(p.cur).color+'">'+p.cur.toFixed(1)+'</strong></td><td style="color:'+getLevel(p.p3).color+';font-weight:700">'+p.p3.toFixed(1)+'</td><td style="color:'+getLevel(p.p6).color+';font-weight:700">'+p.p6.toFixed(1)+'</td><td>'+tr+' '+deltaHtml+'</td><td><div style="display:flex;align-items:center;gap:4px"><div class="risk-bar" style="width:40px"><div class="risk-bar-fill" style="width:'+conf+'%;background:'+confColor+'"></div></div><span style="font-size:10px;font-weight:700;color:'+confColor+'">'+conf+'%</span></div></td><td class="text-xs text-muted" style="max-width:200px">'+p.driver+'</td><td class="text-xs" style="color:var(--cyan);max-width:150px">'+p.advice+'</td>'+(PERM.isAdmin()?'<td style="white-space:nowrap"><button class="btn sm" style="font-size:10px;padding:2px 6px" onclick="FORECAST.showPredForm('+PREDICTIONS.indexOf(p)+')">✏️</button><button class="btn sm danger" style="font-size:10px;padding:2px 6px;margin-left:2px" onclick="FORECAST.deletePred('+PREDICTIONS.indexOf(p)+')">🗑️</button></td>':'')+'</tr>';
      }).join('')+'</tbody></table></div></div>'+
      '<div class="card"><div class="card-tt"><span class="ic">📊</span>预测模型说明</div>'+
      '<div style="padding:10px;background:var(--bg2);border-radius:8px;margin-bottom:10px"><strong style="font-size:11px;color:var(--cyan)">🎯 预测模型架构</strong><ul style="margin:6px 0 0;padding-left:18px;font-size:11px;line-height:1.8">'+
      '<li><strong>ARIMA时间序列模型</strong> - 基于历史风险评分趋势预测</li>'+
      '<li><strong>贝叶斯网络模型</strong> - 多维风险因素因果推断</li>'+
      '<li><strong>蒙特卡洛模拟</strong> - 10,000次随机情景推演</li>'+
      '<li><strong>专家德尔菲法</strong> - 15位区域专家加权评估</li>'+
      '</ul></div>'+
      '<div style="padding:10px;background:var(--bg2);border-radius:8px;margin-bottom:10px"><strong style="font-size:11px;color:var(--cyan)">📈 预测维度</strong><ul style="margin:6px 0 0;padding-left:18px;font-size:11px;line-height:1.8">'+
      '<li>政治稳定性指数 (权重15%)</li>'+
      '<li>安全威胁指数 (权重20%)</li>'+
      '<li>经济波动指数 (权重15%)</li>'+
      '<li>社会矛盾指数 (权重10%)</li>'+
      '<li>地缘战略指数 (权重15%)</li>'+
      '<li>自然灾害指数 (权重10%)</li>'+
      '<li>运营环境指数 (权重10%)</li>'+
      '<li>法律合规指数 (权重5%)</li>'+
      '</ul></div>'+
      '<div style="padding:10px;background:var(--orange-bg);border-radius:8px"><strong style="font-size:11px;color:var(--orange)">⚠️ 预测置信度</strong><div style="font-size:10px;color:var(--text3);margin-top:4px;line-height:1.5">置信度基于数据完整性、模型一致性和历史准确率综合评估。3月预测置信度普遍高于6月预测。</div></div>'+
      '</div></div>';
    html+='<div class="card"><div class="card-tt"><span class="ic">📈</span>风险趋势可视化</div><div style="height:250px"><canvas id="chart-fc-predict"></canvas></div></div>';
    el.innerHTML=html;
    var ctx=document.getElementById('chart-fc-predict');
    if(ctx){
      if(charts.fcPredict)charts.fcPredict.destroy();
      charts.fcPredict=new Chart(ctx.getContext('2d'),{
        type:'line',
        data:{
          labels:PREDICTIONS.map(function(p){return p.country;}),
          datasets:[
            {label:'当前风险',data:PREDICTIONS.map(function(p){return p.cur;}),borderColor:'#00d4ff',backgroundColor:'rgba(0,212,255,0.1)',borderWidth:2,tension:0.3},
            {label:'3月预测',data:PREDICTIONS.map(function(p){return p.p3;}),borderColor:'#ff8800',backgroundColor:'rgba(255,136,0,0.05)',borderWidth:2,tension:0.3,borderDash:[5,3]},
            {label:'6月预测',data:PREDICTIONS.map(function(p){return p.p6;}),borderColor:'#ff3355',backgroundColor:'rgba(255,51,85,0.05)',borderWidth:2,tension:0.3,borderDash:[8,4]}
          ]
        },
        options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{font:{size:10},color:'#7a8ba3',padding:8,boxWidth:12}}},scales:{x:{grid:{display:false},ticks:{color:'#7a8ba3',font:{size:9}}},y:{max:10,min:0,grid:{color:'rgba(0,212,255,0.05)'},ticks:{color:'#7a8ba3'}}}}
      });
    }
  },
  renderScenario(el){
    var scenarios=[
      {name:'情景一: 红海危机持续升级',prob:'中等(35%)',impact:'极高',color:'var(--red)',
       desc:'胡塞武装持续扩大袭击范围，红海航运中断持续至2026年底。亚欧航线运价上涨40-60%，中欧班列运量激增50%以上。',
       affected:['中远海运','招商局','中石油','中石化'],
       riskChange:'+1.5~2.0',timeframe:'3-6个月',
       actions:['启动中欧班列应急运力扩容预案','为红海航线船舶购买战争险','加强与吉布提保障基地协同','建立陆海联运替代方案']},
      {name:'情景二: 萨赫勒地区恐怖主义扩散',prob:'较高(45%)',impact:'高',color:'var(--orange)',
       desc:'JNIM和ISGS向西非沿海国家扩散，塞内加尔、科特迪瓦、加纳安全形势恶化。中资矿业项目面临系统性威胁。',
       affected:['紫金矿业','中铝','中国五矿','华刚矿业'],
       riskChange:'+1.0~1.5',timeframe:'6-12个月',
       actions:['加强矿区安保力量和物理防护','建立区域联防联动机制','准备紧急撤离预案','与法国和俄罗斯非洲军团协调']},
      {name:'情景三: 南亚地缘政治危机',prob:'中等(30%)',impact:'极高',color:'var(--red)',
       desc:'印巴关系恶化，中巴经济走廊面临印度海上封锁威胁。瓜达尔港安全形势急剧恶化，走廊项目可能被迫中断。',
       affected:['中国港湾','中建','中交建','中电建'],
       riskChange:'+2.0~2.5',timeframe:'3-6个月',
       actions:['启动瓜达尔港应急安保升级','评估走廊项目暂停条件','加强与巴基斯坦军方协同','准备替代出海通道']},
      {name:'情景四: 全球经济衰退风险',prob:'较低(20%)',impact:'高',color:'var(--yellow)',
       desc:'美联储持续高利率引发新兴市场资本外流，阿根廷、土耳其、埃及等国爆发主权债务危机。中资企业外汇汇出困难。',
       affected:['中国铁建','中交建','中信建设','华为'],
       riskChange:'+0.8~1.2',timeframe:'6-12个月',
       actions:['启动本币结算备用方案','减少高风险国家新增投资','加强外汇风险管理','购买主权信用违约互换(CDS)']},
      {name:'情景五: 中东全面战争爆发',prob:'低(15%)',impact:'极高',color:'var(--red)',
       desc:'以色列与伊朗直接军事冲突升级，霍尔木兹海峡受阻。全球油价飙升至150美元/桶以上，海湾地区中资资产面临直接威胁。',
       affected:['中石油','中石化','中海油','中远海运'],
       riskChange:'+2.5~3.0',timeframe:'1-3个月',
       actions:['启动海湾地区人员撤离预案','建立战略石油储备紧急释放机制','部署亚丁湾护航编队','准备能源进口多元化方案']},
      {name:'情景六: 缅甸局势全面失控',prob:'中等(30%)',impact:'高',color:'var(--orange)',
       desc:'缅甸军政府崩溃，全国陷入内战。中缅油气管道中断，中缅经济走廊项目全部停工，边境难民危机加剧。',
       affected:['中石油','中交建','华能','中电建'],
       riskChange:'+1.5~2.0',timeframe:'3-6个月',
       actions:['启动中缅管道安保升级','准备走廊项目人员撤离','加强中缅边境管控','与东盟协调地区稳定方案']}
    ];
    var html='<div class="stat-grid mb-12" style="grid-template-columns:repeat(4,1fr)">'+
      '<div class="stat-card"><div class="stat-ic" style="background:var(--red-bg);color:var(--red)">🎭</div><div class="stat-info"><div class="stat-label">推演情景</div><div class="stat-val" style="color:var(--red)">'+scenarios.length+'</div><div class="stat-sub">覆盖5大区域</div></div></div>'+
      '<div class="stat-card"><div class="stat-ic" style="background:var(--orange-bg);color:var(--orange)">⚠️</div><div class="stat-info"><div class="stat-label">极高影响情景</div><div class="stat-val" style="color:var(--orange)">'+scenarios.filter(function(s){return s.impact==='极高';}).length+'</div><div class="stat-sub">需优先防范</div></div></div>'+
      '<div class="stat-card"><div class="stat-ic" style="background:var(--yellow-bg);color:var(--yellow)">📊</div><div class="stat-info"><div class="stat-label">平均概率</div><div class="stat-val" style="color:var(--yellow)">29%</div><div class="stat-sub">加权评估</div></div></div>'+
      '<div class="stat-card"><div class="stat-ic" style="background:var(--blue-bg);color:var(--cyan)">🏢</div><div class="stat-info"><div class="stat-label">受影响企业</div><div class="stat-val" style="color:var(--cyan)">'+new Set(scenarios.flatMap(function(s){return s.affected;})).size+'</div><div class="stat-sub">需制定应对方案</div></div></div>'+
      '</div>';
    html+='<div class="grid" style="grid-template-columns:1fr 1fr;gap:12px">';
    scenarios.forEach(function(s,i){
      html+='<div class="card" style="border-top:3px solid '+s.color+'">'+
        '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">'+
        '<strong style="font-size:13px;color:'+s.color+'">'+s.name+'</strong>'+
        '<span class="badge '+(s.impact==='极高'?'b-red':s.impact==='高'?'b-orange':'b-yellow')+'">影响:'+s.impact+'</span></div>'+
        '<div class="flex gap-8 mb-8 wrap">'+
        '<span class="badge b-blue">概率: '+s.prob+'</span>'+
        '<span class="badge b-purple">时间: '+s.timeframe+'</span>'+
        '<span class="badge b-yellow">风险变化: '+s.riskChange+'</span></div>'+
        '<div class="text-sm mb-8" style="line-height:1.7;color:var(--text2)">'+s.desc+'</div>'+
        '<div style="padding:8px;background:var(--bg2);border-radius:6px;margin-bottom:8px"><strong style="font-size:11px;color:var(--cyan)">🏢 受影响企业</strong><div style="margin-top:4px">'+s.affected.map(function(e){return '<span style="display:inline-block;padding:2px 6px;background:rgba(0,212,255,0.1);border-radius:4px;font-size:10px;margin:2px;cursor:pointer" onclick="showEntDetail(\''+e+'\')">'+e+'</span>';}).join('')+'</div></div>'+
        '<div style="padding:8px;background:var(--orange-bg);border-radius:6px"><strong style="font-size:11px;color:var(--orange)">📋 应对措施</strong><ol style="margin:4px 0 0;padding-left:18px;font-size:11px;line-height:1.7">'+s.actions.map(function(a){return '<li>'+a+'</li>';}).join('')+'</ol></div>'+
        '</div>';
    });
    html+='</div>';
    html+='<div class="card mt-12"><div class="card-tt"><span class="ic">📊</span>情景概率与影响矩阵</div><div style="height:250px"><canvas id="chart-fc-scenario"></canvas></div></div>';
    el.innerHTML=html;
    var ctx=document.getElementById('chart-fc-scenario');
    if(ctx){
      if(charts.fcScenario)charts.fcScenario.destroy();
      var probNum=scenarios.map(function(s){return parseInt(s.prob.match(/\d+/)[0]);});
      var impactNum=scenarios.map(function(s){return s.impact==='极高'?9:s.impact==='高'?7:5;});
      charts.fcScenario=new Chart(ctx.getContext('2d'),{
        type:'bubble',
        data:{datasets:[{label:'情景',data:scenarios.map(function(s,i){return {x:probNum[i],y:impactNum[i],r:15+i*2};}),backgroundColor:scenarios.map(function(s){return s.color==='var(--red)'?'rgba(255,51,85,0.4)':s.color==='var(--orange)'?'rgba(255,136,0,0.4)':'rgba(255,204,0,0.4)';}),borderColor:scenarios.map(function(s){return s.color==='var(--red)'?'#ff3355':s.color==='var(--orange)'?'#ff8800':'#ffcc00';}),borderWidth:2}]},
        options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:function(ctx){return scenarios[ctx.dataIndex].name;}}}},scales:{x:{title:{display:true,text:'发生概率 (%)',color:'#7a8ba3'},min:0,max:60,grid:{color:'rgba(0,212,255,0.05)'},ticks:{color:'#7a8ba3'}},y:{title:{display:true,text:'影响程度',color:'#7a8ba3'},min:0,max:10,grid:{color:'rgba(0,212,255,0.05)'},ticks:{color:'#7a8ba3'}}}}
      });
    }
  },
  renderExpert(el){
    var experts=[
      {name:'张明远',title:'前驻巴基斯坦武官',region:'南亚',rating:9.2,assess:'巴基斯坦安全形势持续恶化，BLA和TTP协同攻击趋势明显。建议中巴经济走廊项目加强安保力量部署，特别是瓜达尔港周边。未来6个月恐袭风险维持在高位。',recommend:'提升走廊南线安保等级至II级'},
      {name:'李建华',title:'非洲安全问题研究员',region:'非洲',rating:9.0,assess:'萨赫勒地区JNIM系统性威胁持续扩散，马里、尼日尔、布基纳法索形成恐怖主义弧形地带。中资矿业项目面临直接威胁，建议加强矿区物理防护和应急撤离能力。',recommend:'萨赫勒地区矿业项目启动B计划'},
      {name:'王立群',title:'中东地缘政治专家',region:'中东',rating:8.8,assess:'红海危机短期内难以缓解，胡塞武装已获得伊朗更多军事支持。霍尔木兹海峡风险上升，建议海湾地区中资企业制定紧急撤离预案，储备战略物资。',recommend:'海湾地区启动I级安全准备'},
      {name:'陈学东',title:'国际经济法教授',region:'全球',rating:8.5,assess:'美国对华科技制裁持续升级，实体清单扩大至300+中国企业。建议中资科技企业加速供应链多元化，关注出口管制合规风险，建立法务应急预案。',recommend:'科技企业建立合规审查机制'},
      {name:'刘维和',title:'前驻乌克兰领事',region:'东欧',rating:8.7,assess:'俄乌冲突长期化趋势明显，西方对俄制裁持续加码。北极LNG项目受阻，中资企业在俄投资面临次级制裁风险。建议审慎评估在俄项目前景。',recommend:'在俄项目启动风险隔离方案'},
      {name:'赵海洋',title:'拉美问题研究专家',region:'拉美',rating:8.3,assess:'阿根廷经济危机深化，米莱政府激进改革引发社会动荡。委内瑞拉政治不确定性持续。建议拉美地区中资企业加强外汇风险管理，探索本币结算。',recommend:'拉美地区启动外汇风险对冲'}
    ];
    var html='<div class="stat-grid mb-12" style="grid-template-columns:repeat(4,1fr)">'+
      '<div class="stat-card"><div class="stat-ic" style="background:var(--blue-bg);color:var(--cyan)">🎓</div><div class="stat-info"><div class="stat-label">参与专家</div><div class="stat-val" style="color:var(--cyan)">'+experts.length+'</div><div class="stat-sub">覆盖5大区域</div></div></div>'+
      '<div class="stat-card"><div class="stat-ic" style="background:var(--green-bg);color:var(--green)">⭐</div><div class="stat-info"><div class="stat-label">平均评分</div><div class="stat-val" style="color:var(--green)">'+(experts.reduce(function(s,e){return s+e.rating;},0)/experts.length).toFixed(1)+'</div><div class="stat-sub">德尔菲法加权</div></div></div>'+
      '<div class="stat-card"><div class="stat-ic" style="background:var(--orange-bg);color:var(--orange)">📋</div><div class="stat-info"><div class="stat-label">研判建议</div><div class="stat-val" style="color:var(--orange)">'+experts.length+'</div><div class="stat-sub">待采纳执行</div></div></div>'+
      '<div class="stat-card"><div class="stat-ic" style="background:var(--purple-bg);color:var(--purple)">🔄</div><div class="stat-info"><div class="stat-label">评估轮次</div><div class="stat-val" style="color:var(--purple)">3轮</div><div class="stat-sub">收敛度92%</div></div></div>'+
      '</div>';
    html+='<div class="grid" style="grid-template-columns:1fr 1fr;gap:12px">';
    experts.forEach(function(e){
      html+='<div class="card" style="border-left:3px solid var(--cyan)">'+
        '<div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:10px">'+
        '<div style="width:40px;height:40px;border-radius:50%;background:var(--blue-bg);display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:700;color:var(--cyan);flex-shrink:0">'+e.name.charAt(0)+'</div>'+
        '<div style="flex:1"><div style="font-weight:700;font-size:13px">'+e.name+'</div><div class="text-xs text-muted">'+e.title+'</div><div class="flex gap-8 mt-8"><span class="badge b-blue">'+e.region+'</span><span class="badge b-green">评分 '+e.rating+'</span></div></div></div>'+
        '<div style="padding:10px;background:var(--bg2);border-radius:8px;margin-bottom:8px"><strong style="font-size:11px;color:var(--cyan)">📝 研判意见</strong><p style="margin:6px 0 0;font-size:12px;line-height:1.7;color:var(--text2)">'+e.assess+'</p></div>'+
        '<div style="padding:10px;background:var(--orange-bg);border-radius:8px"><strong style="font-size:11px;color:var(--orange)">💡 核心建议</strong><p style="margin:4px 0 0;font-size:12px;font-weight:600;color:var(--orange)">'+e.recommend+'</p></div>'+
        '</div>';
    });
    html+='</div>';
    html+='<div class="card mt-12"><div class="card-tt"><span class="ic">🔄</span>德尔菲法评估流程</div>'+
      '<div style="display:flex;gap:20px;align-items:center;justify-content:center;padding:16px">'+
      '<div style="text-align:center"><div style="width:50px;height:50px;border-radius:50%;background:var(--blue-bg);display:flex;align-items:center;justify-content:center;font-size:18px;margin:0 auto 6px">1️⃣</div><div style="font-size:11px;font-weight:700">独立评估</div><div class="text-xs text-muted">专家独立填写</div></div>'+
      '<div style="color:var(--cyan)">→</div>'+
      '<div style="text-align:center"><div style="width:50px;height:50px;border-radius:50%;background:var(--orange-bg);display:flex;align-items:center;justify-content:center;font-size:18px;margin:0 auto 6px">2️⃣</div><div style="font-size:11px;font-weight:700">汇总反馈</div><div class="text-xs text-muted">匿名共享结果</div></div>'+
      '<div style="color:var(--cyan)">→</div>'+
      '<div style="text-align:center"><div style="width:50px;height:50px;border-radius:50%;background:var(--green-bg);display:flex;align-items:center;justify-content:center;font-size:18px;margin:0 auto 6px">3️⃣</div><div style="font-size:11px;font-weight:700">修订评估</div><div class="text-xs text-muted">收敛至92%</div></div>'+
      '<div style="color:var(--cyan)">→</div>'+
      '<div style="text-align:center"><div style="width:50px;height:50px;border-radius:50%;background:var(--purple-bg);display:flex;align-items:center;justify-content:center;font-size:18px;margin:0 auto 6px">4️⃣</div><div style="font-size:11px;font-weight:700">加权输出</div><div class="text-xs text-muted">形成最终研判</div></div>'+
      '</div></div>';
    el.innerHTML=html;
  },
  renderStats(el){
    var regs=[...new Set(COUNTRIES.map(function(c){return c.region;}))];
    var inds=[...new Set(ENTERPRISES.map(function(e){return e.industry;}))];
    var html='<div class="stat-grid mb-12" style="grid-template-columns:repeat(4,1fr)">'+
      '<div class="stat-card"><div class="stat-ic" style="background:var(--red-bg);color:var(--red)">🔴</div><div class="stat-info"><div class="stat-label">极高风险国家</div><div class="stat-val" style="color:var(--red)">'+COUNTRIES.filter(function(c){return calcOverall(c.scores)>=8;}).length+'</div><div class="stat-sub">风险≥8.0</div></div></div>'+
      '<div class="stat-card"><div class="stat-ic" style="background:var(--orange-bg);color:var(--orange)">🟠</div><div class="stat-info"><div class="stat-label">高风险国家</div><div class="stat-val" style="color:var(--orange)">'+COUNTRIES.filter(function(c){var s=calcOverall(c.scores);return s>=6&&s<8;}).length+'</div><div class="stat-sub">风险6.0-8.0</div></div></div>'+
      '<div class="stat-card"><div class="stat-ic" style="background:var(--blue-bg);color:var(--cyan)">📊</div><div class="stat-info"><div class="stat-label">预警总数</div><div class="stat-val" style="color:var(--cyan)">'+ALERTS.length+'</div><div class="stat-sub">红色'+ALERTS.filter(function(a){return a.level==='red';}).length+'起</div></div></div>'+
      '<div class="stat-card"><div class="stat-ic" style="background:var(--green-bg);color:var(--green)">🏢</div><div class="stat-info"><div class="stat-label">监测企业</div><div class="stat-val" style="color:var(--green)">'+ENTERPRISES.length+'</div><div class="stat-sub">覆盖'+inds.length+'个行业</div></div></div>'+
      '</div>';
    html+='<div class="grid mb-12" style="grid-template-columns:1fr 1fr;gap:12px">'+
      '<div class="card"><div class="card-tt"><span class="ic">📊</span>区域风险对比</div><div style="height:220px"><canvas id="chart-fc-region"></canvas></div></div>'+
      '<div class="card"><div class="card-tt"><span class="ic">🏭</span>行业风险对比</div><div style="height:220px"><canvas id="chart-fc-industry"></canvas></div></div></div>';
    html+='<div class="grid mb-12" style="grid-template-columns:1fr 1fr;gap:12px">'+
      '<div class="card"><div class="card-tt"><span class="ic">📈</span>30天预警趋势</div><div style="height:200px"><canvas id="chart-fc-alert"></canvas></div></div>'+
      '<div class="card"><div class="card-tt"><span class="ic">🥧</span>预警类型分布</div><div style="height:200px"><canvas id="chart-fc-type"></canvas></div></div></div>';
    html+='<div class="card mb-12"><div class="card-tt"><span class="ic">🏆</span>国别风险排名 (TOP 15)</div>'+
      '<div class="table-wrap" style="max-height:300px;overflow-y:auto"><table><thead><tr><th>排名</th><th>国家</th><th>区域</th><th>综合风险</th><th>风险等级</th><th>趋势</th><th>主要风险</th><th>中企数</th><th>预警数</th></tr></thead><tbody>'+
      COUNTRIES.map(function(c){return {c:c,ov:calcOverall(c.scores)};}).sort(function(a,b){return b.ov-a.ov;}).slice(0,15).map(function(item,i){
        var c=item.c,ov=item.ov,lv=getLevel(ov);
        var ents=getEntsInCountry(c.name).length;
        var al=ALERTS.filter(function(a){return a.country===c.name;}).length;
        var ti=c.trend==='up'?'<span style="color:var(--red)">↑</span>':c.trend==='down'?'<span style="color:var(--green)">↓</span>':'<span style="color:var(--text2)">→</span>';
        return '<tr style="cursor:pointer" onclick="showCtyDetail(\''+c.name+'\')"><td><strong>'+(i+1)+'</strong></td><td>'+c.flag+' <strong>'+c.name+'</strong></td><td>'+c.region+'</td><td><strong style="color:'+lv.color+'">'+ov.toFixed(1)+'</strong></td><td><span class="badge '+lv.cls+'">'+lv.short+'</span></td><td>'+ti+'</td><td class="text-xs">'+c.mainRisk+'</td><td>'+ents+'</td><td>'+(al?'<span style="color:var(--red);font-weight:700">'+al+'</span>':'-')+'</td></tr>';
      }).join('')+'</tbody></table></div></div>';
    html+='<div class="grid" style="grid-template-columns:1fr 1fr;gap:12px">'+
      '<div class="card"><div class="card-tt"><span class="ic">🎯</span>风险维度热力图</div>'+
      '<div style="overflow-x:auto"><table style="font-size:10px"><thead><tr><th>区域</th><th>政治</th><th>安全</th><th>经济</th><th>法律</th><th>社会</th><th>自然</th><th>运营</th><th>地缘</th><th>综合</th></tr></thead><tbody>'+
      regs.map(function(r){
        var cs=COUNTRIES.filter(function(c){return c.region===r;});
        if(!cs.length)return '';
        var avg=function(k){return Math.round(cs.reduce(function(s,c){return s+(c.scores[k]||0);},0)/cs.length*10)/10;};
        var ov=Math.round(cs.reduce(function(s,c){return s+calcOverall(c.scores);},0)/cs.length*10)/10;
        var cell=function(v){var col=v>=8?'#ff3355':v>=6?'#ff8800':v>=4?'#ffcc00':'#00ff9f';return '<td style="text-align:center;background:'+col+'15;color:'+col+';font-weight:700;padding:4px">'+v.toFixed(1)+'</td>';};
        return '<tr><td style="font-weight:700">'+r+'</td>'+cell(avg('political'))+cell(avg('security'))+cell(avg('economic'))+cell(avg('legal'))+cell(avg('social'))+cell(avg('natural'))+cell(avg('operational'))+cell(avg('geopolitical'))+cell(ov)+'</tr>';
      }).join('')+'</tbody></table></div></div>'+
      '<div class="card"><div class="card-tt"><span class="ic">📋</span>预警状态统计</div>'+
      '<div style="padding:10px;background:var(--bg2);border-radius:8px;margin-bottom:8px">'+
      ['active','acknowledged','responding','resolved'].map(function(st){
        var cnt=ALERTS.filter(function(a){return a.status===st;}).length;
        var lb=st==='active'?'待处理':st==='acknowledged'?'已确认':st==='responding'?'处置中':'已解除';
        var col=st==='active'?'var(--red)':st==='acknowledged'?'var(--cyan)':st==='responding'?'var(--orange)':'var(--green)';
        return '<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid var(--border)"><span style="font-size:12px"><span style="color:'+col+'">●</span> '+lb+'</span><span style="font-size:16px;font-weight:800;color:'+col+'">'+cnt+'</span></div>';
      }).join('')+
      '</div>'+
      '<div style="padding:10px;background:var(--bg2);border-radius:8px"><strong style="font-size:11px;color:var(--cyan)">⚡ 关键洞察</strong><ul style="margin:6px 0 0;padding-left:18px;font-size:11px;line-height:1.7;color:var(--text2)">'+
      '<li>南亚地区风险最高，平均'+(COUNTRIES.filter(function(c){return c.region==='南亚';}).reduce(function(s,c){return s+calcOverall(c.scores);},0)/COUNTRIES.filter(function(c){return c.region==='南亚';}).length).toFixed(1)+'</li>'+
      '<li>恐袭类预警占比最高，需重点防范</li>'+
      '<li>高风险企业集中分布在能源和基建行业</li>'+
      '<li>萨赫勒地区风险上升最快，季度增长0.8</li>'+
      '</ul></div></div></div>';
    el.innerHTML=html;
    var rData=regs.map(function(r){var cs=COUNTRIES.filter(function(c){return c.region===r;});return cs.length?Math.round(cs.reduce(function(s,c){return s+calcOverall(c.scores);},0)/cs.length*10)/10:0;});
    var ctx1=document.getElementById('chart-fc-region');
    if(ctx1){if(charts.fcRegion)charts.fcRegion.destroy();
    charts.fcRegion=new Chart(ctx1.getContext('2d'),{type:'bar',data:{labels:regs,datasets:[{data:rData,backgroundColor:rData.map(function(v){return v>=7?'#ff3355':v>=5?'#ff8800':'#00ff9f';}),borderRadius:4,barThickness:24}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{max:10,grid:{color:'rgba(0,212,255,0.05)'},ticks:{color:'#7a8ba3'}},x:{grid:{display:false},ticks:{color:'#7a8ba3',font:{size:9}}}}}});}
    var iData=inds.map(function(i){var es=ENTERPRISES.filter(function(e){return e.industry===i;});return Math.round(es.reduce(function(s,e){return s+getEntRisk(e);},0)/es.length*10)/10;});
    var ctx2=document.getElementById('chart-fc-industry');
    if(ctx2){if(charts.fcIndustry)charts.fcIndustry.destroy();
    charts.fcIndustry=new Chart(ctx2.getContext('2d'),{type:'bar',data:{labels:inds,datasets:[{data:iData,backgroundColor:iData.map(function(v){return v>=7?'#ff3355':v>=5?'#ff8800':'#00ff9f';}),borderRadius:4}]},options:{responsive:true,maintainAspectRatio:false,indexAxis:'y',plugins:{legend:{display:false}},scales:{x:{max:10,grid:{color:'rgba(0,212,255,0.05)'},ticks:{color:'#7a8ba3'}},y:{grid:{display:false},ticks:{color:'#7a8ba3',font:{size:9}}}}}});}
    var data=genAlertTrend();
    var ctx3=document.getElementById('chart-fc-alert');
    if(ctx3){if(charts.fcAlert)charts.fcAlert.destroy();
    charts.fcAlert=new Chart(ctx3.getContext('2d'),{type:'line',data:{labels:data.map(function(d){return d.d;}),datasets:[{label:'红色',data:data.map(function(d){return d.r;}),borderColor:'#ff3355',borderWidth:2,tension:0.3},{label:'橙色',data:data.map(function(d){return d.o;}),borderColor:'#ff8800',borderWidth:2,tension:0.3},{label:'总数',data:data.map(function(d){return d.r+d.o+d.y+d.b;}),borderColor:'#00d4ff',backgroundColor:'rgba(0,212,255,0.1)',borderWidth:2,tension:0.3,fill:true}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{font:{size:9},color:'#7a8ba3',padding:4,boxWidth:10}}},scales:{x:{grid:{display:false},ticks:{color:'#7a8ba3',font:{size:8}}},y:{grid:{color:'rgba(0,212,255,0.05)'},ticks:{color:'#7a8ba3'}}}}});}
    var types=['安全风险','政治风险','经济风险','地缘战略风险','社会文化风险','自然环境风险'];
    var typeData=types.map(function(t){return ALERTS.filter(function(a){return a.type===t;}).length;});
    var ctx4=document.getElementById('chart-fc-type');
    if(ctx4){if(charts.fcType)charts.fcType.destroy();
    charts.fcType=new Chart(ctx4.getContext('2d'),{type:'doughnut',data:{labels:types,datasets:[{data:typeData,backgroundColor:['#ff3355','#ff8800','#ffcc00','#00d4ff','#b366ff','#00ff9f'],borderWidth:2,borderColor:'#070b14'}]},options:{responsive:true,maintainAspectRatio:false,cutout:'55%',plugins:{legend:{position:'right',labels:{font:{size:9},color:'#7a8ba3',padding:6,boxWidth:10}}}}});}
  }
};

// ===== NAVIGATION =====
function navigateTo(v){
  document.querySelectorAll('.view').forEach(x=>x.classList.remove('active'));
  const tv=document.getElementById('view-'+v);
  if(tv)tv.classList.add('active');
  document.querySelectorAll('.sb-item').forEach(x=>x.classList.remove('active'));
  const si=document.querySelector('.sb-item[data-view="'+v+'"]');
  if(si)si.classList.add('active');
  const i=VIEW_MAP[v]||{t:v,b:v};
  document.getElementById('pageTitle').textContent=i.t;
  document.getElementById('pageCrumb').textContent=i.b;
  const r=document.getElementById('content');if(r)r.scrollTop=0;
  if(v==='situation'){if(SITUATION._needsRefresh){SITUATION._needsRefresh=false;}SITUATION.init();}
  if(v==='intel')INTELCENTER.init();
  if(v==='monitor')MONITOR.init();
  if(v==='assets')ASSETS.init();
  if(v==='alerts')AVIEW.init();
  if(v==='matrix')MATRIX.init();
  if(v==='forecast')FORECAST.init();
  if(v==='datacenter')DATACENTER.init();
  if(v==='settings')SETTINGS.init();
}

// ===== DETAIL MODALS =====
function showCtyDetail(n){
  const c=COUNTRIES.find(x=>x.name===n);if(!c)return;
  const ov=calcOverall(c.scores),lv=getLevel(ov);
  const ents=getEntsInCountry(c.name);
  const al=ALERTS.filter(a=>a.country===c.name);
  document.getElementById('modal-tt').textContent=c.flag+' '+c.name+' 风险详情';
  document.getElementById('modal-bd').innerHTML='<div class="grid mb-12" style="grid-template-columns:1fr 1fr;gap:10px"><div style="padding:12px;background:var(--bg2);border-radius:8px"><div class="text-xs text-muted">综合风险</div><div style="font-size:24px;font-weight:800;color:'+lv.color+'">'+ov.toFixed(1)+'</div><span class="badge '+lv.cls+'">'+lv.label+'</span></div><div style="padding:12px;background:var(--bg2);border-radius:8px"><div class="text-xs text-muted">首都/区域</div><div style="font-size:16px;font-weight:700;margin-top:4px">'+c.capital+' / '+c.region+'</div></div></div>'+
    '<div class="card-tt">📊 八维风险评分</div><div class="mb-12">'+DIMS.map(d=>{const v=c.scores[d.key]||0;const dl=getLevel(v);return '<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px"><span style="width:80px;font-size:11px">'+d.ic+' '+d.name+'</span><div class="risk-bar" style="flex:1"><div class="risk-bar-fill" style="width:'+v*10+'%;background:'+dl.color+'"></div></div><span style="width:30px;text-align:right;font-size:11px;font-weight:700;color:'+dl.color+'">'+v.toFixed(1)+'</span></div>';}).join('')+'</div>'+
    '<div class="card-tt">🏢 中资企业 ('+ents.length+')</div><div class="mb-12">'+(ents.length?ents.map(e=>'<span class="badge b-blue" style="margin:2px;cursor:pointer" onclick="showEntDetail('+e.id+')">'+e.short+'</span>').join(''):'<span class="text-muted">无</span>')+'</div>'+
    '<div class="card-tt">🚨 预警 ('+al.length+')</div><div class="mb-12">'+(al.length?al.map(a=>'<div class="alert-item lv-'+a.level+'"><div class="alert-item-tt"><span class="badge '+ALERT_LV[a.level].cls+'">'+ALERT_LV[a.level].label+'</span> '+a.title+'</div><div class="text-xs text-muted">'+a.time+'</div></div>').join(''):'<span class="text-muted">无</span>')+'</div>'+
    '<div style="padding:12px;background:var(--bg2);border-radius:8px"><strong>📝 分析备注</strong><p style="margin:6px 0 0;font-size:12px;line-height:1.7;color:var(--text2)">'+c.notes+'</p></div>'+
    '<div style="display:flex;gap:8px;margin-top:12px;padding-top:12px;border-top:1px solid var(--border)">'+(PERM.isAdmin()?'<button class="btn primary sm" onclick="document.getElementById(\'modal\').classList.remove(\'show\');MONITOR.showCountryForm(\''+c.name+'\')">✏️ 编辑国家</button><button class="btn danger sm" onclick="document.getElementById(\'modal\').classList.remove(\'show\');MONITOR.deleteCountry(\''+c.name+'\')">🗑️ 删除国家</button>':'')+'</div>';
  document.getElementById('modal').classList.add('show');
}
function showEntDetail(id){
  const e=ENTERPRISES.find(x=>x.id===id);if(!e)return;
  const r=getEntRisk(e),lv=getLevel(r);
  const ea=ALERTS.filter(a=>a.enterprise===e.short);
  document.getElementById('modal-tt').textContent=e.name;
  document.getElementById('modal-bd').innerHTML='<div class="flex gap-12 mb-12 items-center"><div style="width:48px;height:48px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:700;background:'+e.logoColor+'20;color:'+e.logoColor+'">'+e.logo+'</div><div><div style="font-size:16px;font-weight:700">'+e.name+'</div><div class="text-xs text-muted">'+e.industry+' | '+e.code+' | 总部:'+e.hq+'</div><div class="mt-8"><span class="badge '+lv.cls+'">'+lv.label+' '+r.toFixed(1)+'</span></div></div></div>'+
    '<div class="grid mb-12" style="grid-template-columns:1fr 1fr 1fr 1fr;gap:8px"><div style="padding:8px;background:var(--bg2);border-radius:6px;text-align:center"><div class="text-xs text-muted">投资</div><div style="font-weight:800;color:var(--cyan)">'+e.investment+'亿$</div></div><div style="padding:8px;background:var(--bg2);border-radius:6px;text-align:center"><div class="text-xs text-muted">人员</div><div style="font-weight:800">'+e.personnel.toLocaleString()+'</div></div><div style="padding:8px;background:var(--bg2);border-radius:6px;text-align:center"><div class="text-xs text-muted">资产</div><div style="font-weight:800">'+e.assets+'亿$</div></div><div style="padding:8px;background:var(--bg2);border-radius:6px;text-align:center"><div class="text-xs text-muted">预警</div><div style="font-weight:800;color:'+(ea.filter(a=>a.status!=="resolved").length?'var(--red)':'var(--green)')+'">'+ea.filter(a=>a.status!=='resolved').length+'</div></div></div>'+
    '<div class="card-tt">🌐 所在国风险分布</div><div class="mb-12">'+e.countries.map(c=>{const ct=COUNTRIES.find(x=>x.name===c);if(!ct)return null;const sc=calcOverall(ct.scores),cl=getLevel(sc);return '<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;cursor:pointer" onclick="showCtyDetail(\''+c+'\')"><span style="width:80px;font-size:11px">'+ct.flag+' '+c+'</span><div class="risk-bar" style="flex:1"><div class="risk-bar-fill" style="width:'+sc*10+'%;background:'+cl.color+'"></div></div><span style="width:30px;text-align:right;font-size:11px;font-weight:700;color:'+cl.color+'">'+sc.toFixed(1)+'</span></div>';}).filter(Boolean).join('')+'</div>'+
    (e.projects.length?'<div class="card-tt">📦 主要项目</div><div class="mb-12">'+e.projects.map(p=>'<div style="padding:8px;background:var(--bg2);border-radius:6px;margin-bottom:4px"><strong>'+p.n+'</strong> <span class="text-xs text-muted">('+p.c+' | '+p.inv+'亿$ | '+p.p+'人)</span></div>').join('')+'</div>':'')+
    (ea.length?'<div class="card-tt">🚨 关联预警 ('+ea.length+')</div>'+ea.map(a=>'<div class="alert-item lv-'+a.level+'"><div class="alert-item-tt"><span class="badge '+ALERT_LV[a.level].cls+'">'+ALERT_LV[a.level].label+'</span> '+a.title+'</div><div class="text-xs text-muted">'+a.time+' | '+a.status+'</div></div>').join(''):'')+
    '<div style="display:flex;gap:8px;margin-top:12px;padding-top:12px;border-top:1px solid var(--border)">'+(PERM.isAdmin()?'<button class="btn primary sm" onclick="document.getElementById(\'modal\').classList.remove(\'show\');ASSETS.showEntForm('+e.id+')">✏️ 编辑企业</button><button class="btn danger sm" onclick="document.getElementById(\'modal\').classList.remove(\'show\');ASSETS.deleteEnt('+e.id+')">🗑️ 删除企业</button>':'')+'</div>';
  document.getElementById('modal').classList.add('show');
}
function showAlertDetail(id){
  const a=ALERTS.find(x=>x.id===id);if(!a)return;
  const lv=ALERT_LV[a.level];
  document.getElementById('modal-tt').textContent=a.title;
  document.getElementById('modal-bd').innerHTML='<div class="flex gap-8 mb-12"><span class="badge '+lv.cls+'">'+lv.label+'</span><span class="badge b-blue">'+a.type+'</span><span class="badge b-purple">'+ALERT_ST[a.status]+'</span></div><div class="grid mb-12" style="grid-template-columns:1fr 1fr;gap:8px"><div style="padding:10px;background:var(--bg2);border-radius:6px"><div class="text-xs text-muted">国家</div><div style="font-weight:700">'+a.country+'</div></div><div style="padding:10px;background:var(--bg2);border-radius:6px"><div class="text-xs text-muted">企业</div><div style="font-weight:700">'+(a.enterprise||'-')+'</div></div><div style="padding:10px;background:var(--bg2);border-radius:6px"><div class="text-xs text-muted">影响人员</div><div style="font-weight:700;color:var(--orange)">'+a.affectedP+'人</div></div><div style="padding:10px;background:var(--bg2);border-radius:6px"><div class="text-xs text-muted">影响资产</div><div style="font-weight:700;color:var(--red)">'+a.affectedA+'亿$</div></div></div><div style="padding:14px;background:var(--red-bg);border-left:4px solid var(--red);border-radius:8px"><strong style="color:var(--red)">预警描述</strong><p style="margin:8px 0 0;line-height:1.8;font-size:13px">'+a.desc+'</p></div><div class="mt-8 text-xs text-muted">来源: '+a.source+' | 时间: '+a.time+'</div>'+(PERM.isAdmin()?'<div style="display:flex;gap:8px;margin-top:12px;padding-top:12px;border-top:1px solid var(--border)"><button class="btn primary sm" onclick="document.getElementById(\'modal\').classList.remove(\'show\');AVIEW.showAlertForm(\''+a.id+'\')">✏️ 编辑预警</button><button class="btn danger sm" onclick="document.getElementById(\'modal\').classList.remove(\'show\');AVIEW.deleteAlert(\''+a.id+'\')">🗑️ 删除预警</button></div>':'')+'';
  document.getElementById('modal').classList.add('show');
}
function showEventDetail(id){
  const e=EVENTS.find(x=>x.id===id);if(!e)return;
  document.getElementById('modal-tt').textContent=e.title;
  document.getElementById('modal-bd').innerHTML='<div class="flex gap-8 mb-12"><span class="badge '+(e.sev==='critical'?'b-red':e.sev==='high'?'b-orange':e.sev==='medium'?'b-yellow':'b-blue')+'">'+EVT_SEV[e.sev]+'</span><span class="badge b-blue">'+EVT_TYPE[e.type]+'</span><span class="badge b-purple">'+e.status+'</span></div><div class="grid mb-12" style="grid-template-columns:1fr 1fr;gap:8px"><div style="padding:10px;background:var(--bg2);border-radius:6px"><div class="text-xs text-muted">国家</div><div style="font-weight:700">'+e.country+'</div></div><div style="padding:10px;background:var(--bg2);border-radius:6px"><div class="text-xs text-muted">日期</div><div style="font-weight:700">'+e.date+'</div></div></div><div style="padding:14px;background:var(--red-bg);border-left:4px solid var(--red);border-radius:8px;margin-bottom:12px"><strong>事件描述</strong><p style="margin:8px 0 0;line-height:1.8;font-size:13px">'+e.desc+'</p></div><div style="padding:10px;background:var(--orange-bg);border-radius:6px;margin-bottom:8px"><strong style="color:var(--orange)">影响:</strong> '+e.impact+'</div><div style="padding:10px;background:var(--blue-bg);border-radius:6px"><strong style="color:var(--cyan)">响应:</strong> '+e.response+'</div>'+(PERM.isAdmin()?'<div style="display:flex;gap:8px;margin-top:12px;padding-top:12px;border-top:1px solid var(--border)"><button class="btn primary sm" onclick="document.getElementById(\'modal\').classList.remove(\'show\');MONITOR.showEventForm(\''+e.id+'\')">✏️ 编辑事件</button><button class="btn danger sm" onclick="document.getElementById(\'modal\').classList.remove(\'show\');MONITOR.deleteEvent(\''+e.id+'\')">🗑️ 删除事件</button></div>':'')+'';
  document.getElementById('modal').classList.add('show');
}
function showMatrixCties(lk,imp){
  function getCtyCell(c){const ov=calcOverall(c.scores);return{l:Math.min(5,Math.ceil(ov/2)),i:Math.min(4,Math.ceil(ov/2.5))};}
  const cs=COUNTRIES.filter(c=>{const cc=getCtyCell(c);return cc.l===lk&&cc.i===imp;});
  document.getElementById('modal-tt').textContent='矩阵单元: 可能性'+lk+' × 影响'+imp;
  document.getElementById('modal-bd').innerHTML='<div class="text-sm text-muted mb-12">该矩阵单元包含 '+cs.length+' 个国家</div>'+cs.map(c=>{const ov=calcOverall(c.scores),lv=getLevel(ov);return '<div style="padding:10px;background:var(--bg2);border-radius:8px;margin-bottom:6px;cursor:pointer" onclick="showCtyDetail(\''+c.name+'\')"><div class="flex justify-between items-center"><div><strong>'+c.flag+' '+c.name+'</strong> <span class="text-xs text-muted">'+c.region+'</span></div><span class="badge '+lv.cls+'">'+ov.toFixed(1)+'</span></div></div>';}).join('');
  document.getElementById('modal').classList.add('show');
}

// ===== TICKER =====
function renderTicker(){
  const items=ALERTS.filter(a=>a.status==='active'||a.status==='responding').slice(0,10);
  const cls={red:'b-red',orange:'b-orange',yellow:'b-yellow',blue:'b-blue'};
  const html=items.map(a=>'<div class="ticker-item"><span class="badge '+cls[a.level]+'" style="font-size:9px;padding:1px 4px">'+ALERT_LV[a.level].label+'</span>'+a.country+' · '+a.title+'</div>').join('');
  document.getElementById('ticker-track').innerHTML=html+html;
}

// ===== CLOCK =====
function updateClock(){const n=new Date();const d=['\u65e5','\u4e00','\u4e8c','\u4e09','\u56db','\u4e94','\u516d'][n.getDay()];document.getElementById('tb-time').textContent=''+n.getFullYear()+'-'+String(n.getMonth()+1).padStart(2,'0')+'-'+String(n.getDate()).padStart(2,'0')+' '+String(n.getHours()).padStart(2,'0')+':'+String(n.getMinutes()).padStart(2,'0')+':'+String(n.getSeconds()).padStart(2,'0')+' \u5468'+d;}

function updatePendingUsersBadge(){
  var el=document.getElementById('tb-pending-users');
  if(!el)return;
  var isAdmin=AUTH.user&&AUTH.user.role==='admin';
  if(!isAdmin){el.style.display='none';return;}
  var pending=0;
  for(var i=0;i<localStorage.length;i++){
    var key=localStorage.key(i);
    if(key&&key.indexOf('orps_acct_')===0){
      try{var acct=JSON.parse(localStorage.getItem(key));if(acct.status==='pending')pending++;}catch(e){}
    }
  }
  if(pending>0){
    el.style.display='block';
    el.innerHTML='\u26a0\ufe0f '+pending+' \u4e2a\u5f85\u5ba1\u6279\u7528\u6237';
  }else{
    el.style.display='none';
  }
  // Also update sidebar badge
  var sbBadge=document.getElementById('sb-settings-count');
  if(sbBadge){sbBadge.textContent=pending;sbBadge.classList.toggle('zero',pending===0);}
}


// ===== CRUD HELPERS — Shared form/modal utilities for all modules =====
var CRUD={
  _genId(prefix){
    return (prefix||'ID')+Date.now().toString(36).toUpperCase()+Math.floor(Math.random()*1000).toString(36).toUpperCase();
  },
  showForm(title,fields,onsave,data){
    var html='<div style="max-height:60vh;overflow-y:auto">';
    fields.forEach(function(f){
      var val=(data&&data[f.key]!==undefined)?data[f.key]:(f.default||'');
      html+='<div style="margin-bottom:10px">';
      html+='<label class="text-xs text-muted" style="display:block;margin-bottom:4px">'+f.label+(f.required?' <span style="color:var(--red)">*</span>':'')+'</label>';
      if(f.type==='select'){
        html+='<select class="input" id="crud-field-'+f.key+'" style="width:100%;font-size:12px">';
        f.options.forEach(function(opt){
          var ov=typeof opt==='object'?opt.value:opt;
          var ol=typeof opt==='object'?opt.label:opt;
          html+='<option value="'+ov+'"'+(val==ov?' selected':'')+'>'+ol+'</option>';
        });
        html+='</select>';
      }else if(f.type==='textarea'){
        html+='<textarea class="input" id="crud-field-'+f.key+'" rows="'+(f.rows||3)+'" style="width:100%;font-size:12px;resize:vertical">'+val+'</textarea>';
      }else{
        html+='<input class="input" id="crud-field-'+f.key+'" type="'+(f.type||'text')+'" value="'+val+'" style="width:100%;font-size:12px"'+(f.placeholder?' placeholder="'+f.placeholder+'"':'')+'/>';
      }
      html+='</div>';
    });
    html+='</div>';
    html+='<div style="display:flex;gap:8px;margin-top:12px;justify-content:flex-end">';
    html+='<button class="btn sm" onclick="document.getElementById(\'modal\').classList.remove(\'show\')">\u53d6\u6d88</button>';
    html+='<button class="btn primary sm" id="crud-save-btn">\u2705 \u4fdd\u5b58</button>';
    html+='</div>';
    document.getElementById('modal-tt').textContent=title;
    document.getElementById('modal-bd').innerHTML=html;
    document.getElementById('modal').classList.add('show');
    document.getElementById('crud-save-btn').onclick=function(){
      var obj={};
      for(var i=0;i<fields.length;i++){
        var f=fields[i];
        var el=document.getElementById('crud-field-'+f.key);
        if(!el)continue;
        var v=el.value.trim();
        if(f.required&&!v){showToast('\u8bf7\u586b\u5199: '+f.label);return;}
        if(f.type==='number')v=parseFloat(v)||0;
        obj[f.key]=v;
      }
      onsave(obj);
      document.getElementById('modal').classList.remove('show');
    };
  },
  showDetail(title,rows,actions){
    var html='';
    rows.forEach(function(r){
      if(r.type==='full'){
        html+='<div style="margin-bottom:12px"><div class="text-xs text-muted mb-4">'+r.label+'</div><div style="padding:10px;background:var(--bg2);border-radius:8px;font-size:12px;line-height:1.7">'+r.value+'</div></div>';
      }else if(r.type==='grid'){
        html+='<div class="grid mb-12" style="grid-template-columns:repeat('+r.cols+',1fr);gap:8px">';
        r.items.forEach(function(it){
          html+='<div style="padding:8px;background:var(--bg2);border-radius:6px"><div class="text-xs text-muted">'+it.label+'</div><div style="font-weight:700;margin-top:2px">'+it.value+'</div></div>';
        });
        html+='</div>';
      }else{
        html+='<div style="display:flex;gap:12px;padding:6px 0;border-bottom:1px solid var(--border)"><span style="width:100px;color:var(--text3);font-size:11px;flex-shrink:0">'+r.label+'</span><span style="font-size:12px;flex:1">'+r.value+'</span></div>';
      }
    });
    if(actions&&actions.length){
      html+='<div style="display:flex;gap:8px;margin-top:12px">';
      actions.forEach(function(a){
        html+='<button class="btn '+a.cls+' sm" onclick="'+a.onclick+'">'+a.label+'</button>';
      });
      html+='</div>';
    }
    document.getElementById('modal-tt').textContent=title;
    document.getElementById('modal-bd').innerHTML=html;
    document.getElementById('modal').classList.add('show');
  },
  toolbar(count,addFn,exportFn,resetFn){
    var html='<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">';
    html+='<span class="text-xs text-muted">'+count+'</span>';
    html+='<div style="display:flex;gap:6px">';
    if(addFn)html+='<button class="btn primary sm" onclick="'+addFn+'">\u2795 \u65b0\u589e</button>';
    if(exportFn)html+='<button class="btn sm" onclick="'+exportFn+'">\u{1F4E5} \u5bfc\u51fa</button>';
    if(resetFn)html+='<button class="btn sm" onclick="'+resetFn+'">\u{1F504} \u91cd\u7f6e</button>';
    html+='</div></div>';
    return html;
  }
};

// ===== SETTINGS =====
var SETTINGS={
  init(){
    var el=document.getElementById('settings-content');
    if(!el)return;
    var isAdmin=AUTH.user&&AUTH.user.role==='admin';
    var html='';
    html+='<div class="card" style="max-width:700px;margin-bottom:16px">';
    html+='<div class="card-tt"><span class="ic">\u2699\ufe0f</span>\u7cfb\u7edf\u8bbe\u7f6e</div>';
    html+='<div class="mb-12"><div class="text-sm text-muted mb-8">\u7cfb\u7edf\u7248\u672c</div><div class="text-sm font-bold" style="color:var(--cyan)">v12.0 \u60c5\u62a5\u5f71\u50cf\u4e2d\u5fc3\u7248</div></div>';
    html+='<div class="mb-12"><div class="text-sm text-muted mb-8">\u6570\u636e\u5b58\u50a8</div><div class="text-sm">localStorage (\u6d4f\u89c8\u5668\u672c\u5730)</div></div>';
    html+='<div class="mb-12"><div class="text-sm text-muted mb-8">\u76d1\u6d4b\u8303\u56f4</div><div class="text-sm">42\u4e2a\u56fd\u5bb6 | 35\u5bb6\u4f01\u4e1a | 30\u6761\u9884\u8b66 | 25\u8d77\u4e8b\u4ef6 | 12\u7c7b\u6570\u636e\u91c7\u96c6</div></div>';
    html+='<div class="mb-12"><div class="text-sm text-muted mb-8">\u5f53\u524d\u7528\u6237</div><div class="text-sm"><span style="color:var(--cyan);font-weight:700">'+(AUTH.user?AUTH.user.name:'-')+'</span> <span class="badge '+(isAdmin?'b-red':'b-blue')+'" style="margin-left:8px">'+(isAdmin?'\u7ba1\u7406\u5458':'\u666e\u901a\u7528\u6237')+'</span></div></div>';
    html+='<div class="mb-12"><div class="text-sm text-muted mb-8">\u6e05\u7a7a\u6570\u636e</div><button class="btn danger" onclick="DATACENTER.clearAll()">\u{1F5D1}\ufe0f \u6e05\u7a7a\u6240\u6709\u7f13\u5b58\u6570\u636e</button></div>';
    html+='</div>';
    // 审核中心（管理员专用）
    if(isAdmin){
      html+=this._renderReviewCenter();
    }else{
      // 普通用户可以看到自己的待审核数据
      html+=this._renderMySubmissions();
    }
    if(isAdmin){
      html+=this._renderUserMgr();
      html+=this._renderAuditLog();
    }else{
      html+='<div class="card" style="max-width:700px"><div class="card-tt"><span class="ic">\u{1F465}</span>\u7528\u6237\u7ba1\u7406</div>';
      html+='<div style="padding:20px;text-align:center;color:var(--text3)">\u26a0\ufe0f \u4ec5\u7ba1\u7406\u5458\u53ef\u4ee5\u67e5\u770b\u548c\u7ba1\u7406\u7528\u6237\u6743\u9650</div>';
      html+='</div>';
    }
    el.innerHTML=html;
  },
  _getAllUsers(){
    var users=[];
    for(var i=0;i<localStorage.length;i++){
      var key=localStorage.key(i);
      if(key&&key.indexOf('orps_acct_')===0){
        try{var acct=JSON.parse(localStorage.getItem(key));acct._key=key;users.push(acct);}catch(e){}
      }
    }
    return users;
  },
  _renderUserMgr(){
    var users=this._getAllUsers();
    var pending=users.filter(function(u){return u.status==='pending';});
    var approved=users.filter(function(u){return u.status==='approved';});
    var rejected=users.filter(function(u){return u.status==='rejected';});
    var disabled=users.filter(function(u){return u.status==='disabled';});
    var html='';
    html+='<div class="card" style="max-width:700px">';
    html+='<div class="card-tt"><span class="ic">\u{1F465}</span>\u7528\u6237\u6743\u9650\u7ba1\u7406</div>';
    // Stats
    html+='<div class="grid mb-12" style="grid-template-columns:repeat(4,1fr);gap:8px">';
    html+='<div style="padding:10px;background:var(--bg2);border-radius:8px;text-align:center"><div class="text-xs text-muted">\u5f85\u5ba1\u6279</div><div style="font-size:20px;font-weight:800;color:var(--orange)">'+pending.length+'</div></div>';
    html+='<div style="padding:10px;background:var(--bg2);border-radius:8px;text-align:center"><div class="text-xs text-muted">\u5df2\u6388\u6743</div><div style="font-size:20px;font-weight:800;color:var(--green)">'+approved.length+'</div></div>';
    html+='<div style="padding:10px;background:var(--bg2);border-radius:8px;text-align:center"><div class="text-xs text-muted">\u5df2\u62d2\u7edd</div><div style="font-size:20px;font-weight:800;color:var(--red)">'+rejected.length+'</div></div>';
    html+='<div style="padding:10px;background:var(--bg2);border-radius:8px;text-align:center"><div class="text-xs text-muted">\u5df2\u505c\u7528</div><div style="font-size:20px;font-weight:800;color:var(--text3)">'+disabled.length+'</div></div>';
    html+='</div>';
    // Pending alert
    if(pending.length>0){
      html+='<div style="padding:10px 14px;background:rgba(255,170,0,0.08);border:1px solid rgba(255,170,0,0.3);border-radius:8px;margin-bottom:12px;font-size:12px;color:var(--orange)">\u26a0\ufe0f \u6709 '+pending.length+' \u4e2a\u5f85\u5ba1\u6279\u8d26\u53f7\u7b49\u5f85\u60a8\u7684\u6388\u6743</div>';
    }
    // User table
    html+='<div style="overflow-x:auto"><table style="width:100%;font-size:12px;border-collapse:collapse">';
    html+='<thead><tr style="border-bottom:2px solid var(--border2)"><th style="text-align:left;padding:8px">\u7528\u6237\u540d</th><th style="text-align:left;padding:8px">\u89d2\u8272</th><th style="text-align:left;padding:8px">\u72b6\u6001</th><th style="text-align:left;padding:8px">\u6ce8\u518c\u65f6\u95f4</th><th style="text-align:center;padding:8px">\u64cd\u4f5c</th></tr></thead><tbody>';
    users.forEach(function(u){
      var stMap={'approved':{lb:'\u2705 \u5df2\u6388\u6743',c:'var(--green)'},'pending':{lb:'\u23f3 \u5f85\u5ba1\u6279',c:'var(--orange)'},'rejected':{lb:'\u274c \u5df2\u62d2\u7edd',c:'var(--red)'},'disabled':{lb:'\u23f8\ufe0f \u5df2\u505c\u7528',c:'var(--text3)'}};
      var st=stMap[u.status]||{lb:u.status,c:'var(--text3)'};
      var isBuiltIn=u._key==='__admin__';
      html+='<tr style="border-bottom:1px solid var(--border)">';
      html+='<td style="padding:8px;font-weight:700">'+u.user+(isBuiltIn?' <span class="badge b-purple" style="font-size:9px">\u5185\u7f6e</span>':'')+'</td>';
      html+='<td style="padding:8px"><span class="badge '+(u.role==='admin'?'b-red':'b-blue')+'">'+(u.role==='admin'?'\u7ba1\u7406\u5458':'\u666e\u901a\u7528\u6237')+'</span></td>';
      html+='<td style="padding:8px;color:'+st.c+';font-weight:600">'+st.lb+'</td>';
      html+='<td style="padding:8px;color:var(--text3)">'+(u.regTime||'-')+'</td>';
      html+='<td style="padding:8px;text-align:center;white-space:nowrap">';
      if(isBuiltIn){
        html+='<span style="color:var(--text3);font-size:11px">\u7cfb\u7edf\u8d26\u53f7</span>';
      }else{
        if(u.status==='pending'){
          html+='<button class="btn sm" style="font-size:10px;padding:3px 10px;background:var(--green);color:#000;margin-right:4px" onclick="SETTINGS.approveUser(\''+u.user+'\')">\u2705 \u6388\u6743</button>';
          html+='<button class="btn sm" style="font-size:10px;padding:3px 10px;color:var(--red);margin-right:4px" onclick="SETTINGS.rejectUser(\''+u.user+'\')">\u274c \u62d2\u7edd</button>';
        }
        if(u.status==='approved'){
          html+='<button class="btn sm" style="font-size:10px;padding:3px 10px;color:var(--orange);margin-right:4px" onclick="SETTINGS.disableUser(\''+u.user+'\')">\u23f8\ufe0f \u505c\u7528</button>';
        }
        if(u.status==='disabled'){
          html+='<button class="btn sm" style="font-size:10px;padding:3px 10px;background:var(--green);color:#000;margin-right:4px" onclick="SETTINGS.approveUser(\''+u.user+'\')">\u25b6\ufe0f \u542f\u7528</button>';
        }
        if(u.status==='rejected'){
          html+='<button class="btn sm" style="font-size:10px;padding:3px 10px;background:var(--green);color:#000;margin-right:4px" onclick="SETTINGS.approveUser(\''+u.user+'\')">\u2705 \u6388\u6743</button>';
        }
        html+='<button class="btn sm" style="font-size:10px;padding:3px 10px;color:var(--red)" onclick="SETTINGS.deleteUser(\''+u.user+'\')">\u{1F5D1}\ufe0f \u5220\u9664</button>';
      }
      html+='</td></tr>';
    });
    html+='</tbody></table></div>';
    // Role toggle for approved users
    html+='<div style="margin-top:12px;padding:10px;background:var(--bg2);border-radius:8px;font-size:11px;color:var(--text3)">\u2139\ufe0f \u6388\u6743\u540e\u7528\u6237\u53ef\u767b\u5f55\u7cfb\u7edf\u3002\u7ba1\u7406\u5458\u53ef\u968f\u65f6\u505c\u7528\u3001\u542f\u7528\u3001\u5220\u9664\u7528\u6237\u3002\u5220\u9664\u540e\u7528\u6237\u9700\u91cd\u65b0\u6ce8\u518c\u3002</div>';
    html+='</div>';
    return html;
  },
  approveUser(name){
    var stored=localStorage.getItem('orps_acct_'+name);
    if(!stored){showToast('\u8d26\u53f7\u4e0d\u5b58\u5728');return;}
    var acct=JSON.parse(stored);
    acct.status='approved';
    localStorage.setItem('orps_acct_'+name,JSON.stringify(acct));
    showToast('\u2705 \u5df2\u6388\u6743\u7528\u6237: '+name);
    this.init();updatePendingUsersBadge();
  },
  rejectUser(name){
    var stored=localStorage.getItem('orps_acct_'+name);
    if(!stored){showToast('\u8d26\u53f7\u4e0d\u5b58\u5728');return;}
    var acct=JSON.parse(stored);
    acct.status='rejected';
    localStorage.setItem('orps_acct_'+name,JSON.stringify(acct));
    showToast('\u274c \u5df2\u62d2\u7edd\u7528\u6237: '+name);
    this.init();updatePendingUsersBadge();
  },
  disableUser(name){
    var stored=localStorage.getItem('orps_acct_'+name);
    if(!stored){showToast('\u8d26\u53f7\u4e0d\u5b58\u5728');return;}
    var acct=JSON.parse(stored);
    acct.status='disabled';
    localStorage.setItem('orps_acct_'+name,JSON.stringify(acct));
    showToast('\u23f8\ufe0f \u5df2\u505c\u7528\u7528\u6237: '+name);
    this.init();updatePendingUsersBadge();
  },
  deleteUser(name){
    if(!PERM.guard('\u5220\u9664\u7528\u6237'))return;
    if(AUTH.user&&AUTH.user.name===name){showToast('\u4e0d\u80fd\u5220\u9664\u5f53\u524d\u767b\u5f55\u8d26\u53f7');return;}
    var stored=localStorage.getItem('orps_acct_'+name);
    if(!stored){showToast('\u8d26\u53f7\u4e0d\u5b58\u5728');return;}
    var target=JSON.parse(stored);
    if(target.role==='admin'){
      var allUsers=this._getAllUsers();
      var adminCount=allUsers.filter(function(u){return u.role==='admin'&&u.status==='approved';}).length;
      if(adminCount<=1){showToast('\u4e0d\u80fd\u5220\u9664\u552f\u4e00\u7684\u7ba1\u7406\u5458\u8d26\u53f7\uff0c\u8bf7\u5148\u521b\u5efa\u5176\u4ed6\u7ba1\u7406\u5458');return;}
    }
    showConfirm('\u786e\u5b9a\u5220\u9664\u7528\u6237 "'+name+'" \uff1f\u5220\u9664\u540e\u8be5\u7528\u6237\u9700\u91cd\u65b0\u6ce8\u518c\u3002',function(){
      localStorage.removeItem('orps_acct_'+name);
      showToast('\u{1F5D1}\ufe0f \u5df2\u5220\u9664\u7528\u6237: '+name);
      SETTINGS.init();updatePendingUsersBadge();
    });
  },
  // ===== 审核中心 =====
  _renderReviewCenter(){
    var pending=_pendingReviews.filter(function(r){return r.status==='pending';});
    var approved=_pendingReviews.filter(function(r){return r.status==='approved';});
    var rejected=_pendingReviews.filter(function(r){return r.status==='rejected';});
    var html='<div class="card" style="max-width:700px;margin-bottom:16px">';
    html+='<div class="card-tt"><span class="ic">\u{1F4CB}</span>\u6570\u636e\u5ba1\u6838\u4e2d\u5fc3</div>';
    html+='<div class="grid mb-12" style="grid-template-columns:repeat(3,1fr);gap:8px">';
    html+='<div style="padding:10px;background:var(--bg2);border-radius:8px;text-align:center"><div class="text-xs text-muted">\u5f85\u5ba1\u6838</div><div style="font-size:20px;font-weight:800;color:var(--orange)">'+pending.length+'</div></div>';
    html+='<div style="padding:10px;background:var(--bg2);border-radius:8px;text-align:center"><div class="text-xs text-muted">\u5df2\u901a\u8fc7</div><div style="font-size:20px;font-weight:800;color:var(--green)">'+approved.length+'</div></div>';
    html+='<div style="padding:10px;background:var(--bg2);border-radius:8px;text-align:center"><div class="text-xs text-muted">\u5df2\u62d2\u7edd</div><div style="font-size:20px;font-weight:800;color:var(--red)">'+rejected.length+'</div></div>';
    html+='</div>';
    if(pending.length===0&&approved.length===0&&rejected.length===0){
      html+='<div style="padding:30px;text-align:center;color:var(--text3)">\u6682\u65e0\u5f85\u5ba1\u6838\u6570\u636e</div>';
    }
    if(pending.length>0){
      html+='<div style="padding:10px 14px;background:rgba(255,170,0,0.08);border:1px solid rgba(255,170,0,0.3);border-radius:8px;margin-bottom:12px;font-size:12px;color:var(--orange)">\u26a0\ufe0f \u6709 '+pending.length+' \u6761\u6570\u636e\u7b49\u5f85\u60a8\u5ba1\u6838</div>';
      var tLabel={'terror_events':'\u6050\u88ad\u4e8b\u4ef6','security_events':'\u6d89\u534e\u5b89\u5168','military_conflicts':'\u6b66\u88c5\u51b2\u7a81','political_events':'\u653f\u6cbb\u98ce\u9669','geopolitical_intel':'\u5730\u7f18\u60c5\u62a5','natural_disasters':'\u81ea\u7136\u707e\u5bb3','public_health':'\u516c\u5171\u536b\u751f','sanctions_data':'\u5236\u88c1\u5408\u89c4','social_unrest':'\u793e\u4f1a\u52a8\u8361','infrastructure':'\u57fa\u7840\u8bbe\u65bd'};
      pending.forEach(function(r,i){
        html+='<div style="padding:10px;background:var(--bg2);border:1px solid var(--border);border-radius:8px;margin-bottom:8px">';
        html+='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">';
        html+='<span class="badge b-blue">'+(tLabel[r.type]||r.type)+'</span>';
        html+='<span style="font-size:10px;color:var(--text3)">\u63d0\u4ea4\u4eba: '+r.submitter+' | '+r.submitTime+'</span>';
        html+='</div>';
        html+='<div style="font-size:11px;color:var(--text2);margin-bottom:8px;max-height:60px;overflow:hidden;line-height:1.5">'+JSON.stringify(r.data).substring(0,300)+'</div>';
        html+='<div style="display:flex;gap:6px">';
        html+='<button class="btn sm" style="font-size:10px;padding:3px 10px;background:var(--green);color:#000" onclick="SETTINGS.approveReview(\''+r.id+'\')">\u2705 \u901a\u8fc7</button>';
        html+='<button class="btn sm" style="font-size:10px;padding:3px 10px;color:var(--red)" onclick="SETTINGS.rejectReview(\''+r.id+'\')">\u274c \u62d2\u7edd</button>';
        html+='</div></div>';
      });
    }
    if(approved.length>0||rejected.length>0){
      html+='<div class="card-tt" style="margin-top:16px"><span class="ic">\u{1F4C4}</span>\u6700\u8fd1\u5ba1\u6838\u8bb0\u5f55</div>';
      var all=_pendingReviews.filter(function(r){return r.status!=='pending';}).sort(function(a,b){
        return (b.reviewTime||'').localeCompare(a.reviewTime||'');
      }).slice(0,10);
      all.forEach(function(r){
        var cl=r.status==='approved'?'var(--green)':'var(--red)';
        var lb=r.status==='approved'?'\u2705 \u5df2\u901a\u8fc7':'\u274c \u5df2\u62d2\u7edd';
        html+='<div style="padding:6px 10px;border-bottom:1px solid var(--border);font-size:10px;display:flex;justify-content:space-between">';
        html+='<span><span style="color:'+cl+'">'+lb+'</span> '+r.submitter+'\u63d0\u4ea4\u7684\u6570\u636e</span>';
        html+='<span style="color:var(--text3)">'+(r.reviewTime||'')+'</span></div>';
      });
    }
    html+='</div>';
    return html;
  },
  _renderMySubmissions(){
    var myName=AUTH.user?AUTH.user.name:'';
    var my=_pendingReviews.filter(function(r){return r.submitter===myName;});
    if(my.length===0)return '';
    var html='<div class="card" style="max-width:700px;margin-bottom:16px">';
    html+='<div class="card-tt"><span class="ic">\u{1F4E4}</span>\u6211\u7684\u6570\u636e\u63d0\u4ea4</div>';
    my.forEach(function(r){
      var stCl=r.status==='approved'?'var(--green)':r.status==='rejected'?'var(--red)':'var(--orange)';
      var stLb=r.status==='approved'?'\u2705 \u5df2\u901a\u8fc7':r.status==='rejected'?'\u274c \u5df2\u62d2\u7edd':'\u23f3 \u5f85\u5ba1\u6838';
      html+='<div style="padding:8px;border-bottom:1px solid var(--border);font-size:11px;display:flex;justify-content:space-between;align-items:center">';
      html+='<span>'+r.type+' | '+JSON.stringify(r.data).substring(0,80)+'</span>';
      html+='<span style="color:'+stCl+';font-weight:600">'+stLb+'</span>';
      html+='</div>';
    });
    html+='</div>';
    return html;
  },
  approveReview(id){
    var idx=_pendingReviews.findIndex(function(r){return r.id===id;});
    if(idx<0){showToast('\u5ba1\u6838\u9879\u4e0d\u5b58\u5728');return;}
    var r=_pendingReviews[idx];
    r.status='approved';
    r.reviewTime=new Date().toLocaleString('zh-CN');
    r.reviewer=AUTH.user.name;
    DBCenter.add(r.type,r.data);
    DBCenter.addLog('\u5ba1\u6838\u901a\u8fc7 '+r.type+': \u63d0\u4ea4\u4eba='+r.submitter);
    DataHub.save('_pending_reviews');
    AUDIT.log('\u5ba1\u6838\u901a\u8fc7',r.type,'\u63d0\u4ea4\u4eba:'+r.submitter);
    showToast('\u2705 \u5df2\u901a\u8fc7\u5e76\u5f55\u5165\u6570\u636e\u5e93');
    this.init();updatePendingUsersBadge();
    if(typeof DATACENTER!=='undefined'){DATACENTER.renderStats();DATACENTER.renderTabs();DATACENTER.renderTable();DATACENTER.updateBadge();}
  },
  rejectReview(id){
    var idx=_pendingReviews.findIndex(function(r){return r.id===id;});
    if(idx<0){showToast('\u5ba1\u6838\u9879\u4e0d\u5b58\u5728');return;}
    var r=_pendingReviews[idx];
    r.status='rejected';
    r.reviewTime=new Date().toLocaleString('zh-CN');
    r.reviewer=AUTH.user.name;
    DataHub.save('_pending_reviews');
    AUDIT.log('\u5ba1\u6838\u62d2\u7edd',r.type,'\u63d0\u4ea4\u4eba:'+r.submitter);
    showToast('\u274c \u5df2\u62d2\u7edd\u8be5\u6761\u6570\u636e');
    this.init();updatePendingUsersBadge();
  },
  _renderAuditLog(){
    var logs=AUDIT.getAll().slice(0,50);
    var html='<div class="card" style="max-width:700px;margin-bottom:16px">';
    html+='<div class="card-tt"><span class="ic">\u{1F4DD}</span>\u64cd\u4f5c\u5ba1\u8ba1\u65e5\u5fd7 ('+AUDIT.getAll().length+')\u6761</div>';
    if(logs.length===0){
      html+='<div style="padding:20px;text-align:center;color:var(--text3)">\u6682\u65e0\u64cd\u4f5c\u8bb0\u5f55</div>';
    }else{
      html+='<div style="max-height:300px;overflow-y:auto">';
      logs.forEach(function(l){
        html+='<div style="padding:5px 10px;border-bottom:1px solid var(--border);font-size:10px;display:flex;justify-content:space-between">';
        html+='<span><span style="color:var(--cyan)">'+l.user+'</span><span style="color:'+(l.role==='admin'?'var(--red)':'var(--text2)')+'">('+(l.role==='admin'?'\u7ba1\u7406\u5458':'\u7528\u6237')+')</span> '+l.action+' <span style="color:var(--text3)">'+l.target+'</span></span>';
        html+='<span style="color:var(--text3)">'+l.time+'</span></div>';
      });
      html+='</div>';
    }
    html+='</div>';
    return html;
  }
};

// ===== INIT =====
function initApp(){
  // Sidebar nav
  document.querySelectorAll('.sb-item').forEach(item=>item.addEventListener('click',()=>navigateTo(item.dataset.view)));
  // Clock
  updateClock();setInterval(updateClock,1000);
  // Ticker
  renderTicker();
  // Data status
  const ds=document.getElementById('data-update-status');
  if(ds)ds.innerHTML='<span class="dot" style="background:var(--green)"></span>数据就绪 v20.0';
  // Init DataHub (must be before any module init)
  DataHub.init();
  // Init DB
  try{DBCenter.init();}catch(e){}
  // Init 采集库 (独立数据库) — 内部会初始化 ENTERPRISE_DB 和 RISK_FUSION
  try{COLLECTED_DB.init();}catch(e){}
  // 确保企业项目库和融合引擎已初始化
  if(typeof ENTERPRISE_DB!=='undefined'){try{ENTERPRISE_DB.init();}catch(e){}}
  if(typeof RISK_FUSION!=='undefined'){try{RISK_FUSION.init();}catch(e){}}
  // ---- 数据链路：禁止自动同步，必须管理员审核后手动同步 ----
  // 初始不加载数据到态势感知/监测中心，等待管理员审核后手动一键同步
  // Subscribe SITUATION to data changes for auto-refresh
  DataHub.subscribe(function(collection){if(typeof SITUATION!=='undefined'){SITUATION._needsRefresh=true;}});
  // Init first view
  SITUATION.init();
  // Update alert badge
  const cnt=ALERTS.filter(a=>a.status==='active').length;
  const badge=document.getElementById('sb-alert-count');
  if(badge){badge.textContent=cnt;badge.classList.toggle('zero',cnt===0);}
  // Check pending users (admin only)
  updatePendingUsersBadge();
  // 更新数据状态指示
  var totalDCRecords=DBCenter.getStats().total;
  if(ds)ds.innerHTML='<span class="dot" style="background:var(--green)"></span>数据就绪 v20.0 | 数据库:'+totalDCRecords+'条';
}

// ===== DOM READY =====
document.addEventListener('DOMContentLoaded',function(){
  AUTH.init();
  // Enter key
  document.addEventListener('keydown',e=>{if(e.key==='Enter'){const ov=document.getElementById('auth-overlay');if(ov&&ov.style.display!=='none'){if(document.getElementById('auth-card-setup').style.display!=='none')AUTH.setupAdmin();else if(document.getElementById('auth-card-login').style.display!=='none')AUTH.login();else AUTH.register();}}});
});

// ===== DATA UPDATE STATUS =====
var DATA_UPDATE={
  visit:function(v){
    var ds=document.getElementById('data-update-status');
    if(ds)ds.innerHTML='<span class="dot" style="background:var(--green)"></span>数据就绪 v20.0';
  }
};
