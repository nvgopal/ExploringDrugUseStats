// Global constants
const DEBUG = true;

// Helpers
const log = msg => (DEBUG ? console.log(msg) : '');

async function loadJSON(path) {
	let response = await fetch(path);
	let dataset = await response.json(); // Now available in global scope
	return dataset;
}

function scrollToNext(next) {
    el = document.getElementById(next);
    el.scrollIntoView({
		block: "start",
		behavior: "smooth"
	});
}

function scrollToTop() {
    /*el = document.getElementById("top");
    el.scrollIntoView({
		block: "start",
		behavior: "smooth"
    });
    */
   window.scroll({
    top: 0, 
    left: 0, 
    behavior: 'smooth'
  });
}

// Apply the grid theme
Highcharts.setOptions({					  
    colors: ['#058DC7', "#FF4500", '#4B0082', '#64E572', '#FF9655', '#F6EF11', '#6AF9C4', '#8B0000', 
    '#DDA0DD', '#008000', '#663d00'],
        title: {
            style: { 
                color: '#000000',
                font: 'bold 16px Georgia, serif'
            }
        },
        subtitle: {
            style: { 
                color: '#6D869F',
                font: 'bold 12px Lucida Sans Unicode sans-serif'
            }
        },
        xAxis: {
            labels: {
                style: {
                    color: '#666',
                    fontWeight: 'bold'
                }
            },
            title: {
                style: {
                    color: '#626262',
                    font: 'bold 14px Merriweather, serif'
                }				
            }
        },
        yAxis: {
            labels: {
                style: {
                    color: '#666',
                    fontWeight: 'bold'
                }
            },
            title: {
                style: {
                    color: '#626262',
                    font: 'bold 14px Merriweather, serif'
                }				
            }
        },
        caption: {
            style: {
                font: 'bold 14px Lucida Sans Unicode sans-serif'
            }
        }
    });

function plotBubble(dataDeaths) {
    let worldDeaths = [];
    let contData = [];
    let contin = 'Africa';

    let color = ['#F6EF11', '#6AF9C4', '#8B0000', '#4B0082', '#008000', '#663d00'];
    let count = 0;

    for (datum of dataDeaths) {
        log(datum);
        if(contin == datum['Continent']){
            contData.push({
                name: datum['Entity'],
                value: parseInt(datum['Deaths - Drug use - Sex: Both - Age: All Ages (Number)'])
            });
        }
        else{
            worldDeaths.push({
                name: contin,
                data: contData,
                color: color[count],
            });
            contin = datum['Continent'];
            contData = [];
            count = count + 1;
        }
    }

    worldDeaths.push({name: contin, data: contData, color: color[count]});

	
	const chartBubble = Highcharts.chart('highcharts-Bubble', {
        chart: {
            backgroundColor: '#f5f5f5',
            type: 'packedbubble'
            //height: (7.5 / 16 * 100) + '%'
        },
        title: {
            text: 'Deaths Due To Drug Use'
        },
        subtitle: {
            text: 'Source: Seattle, United States: Institute for Health Metrics and Evaluation (IHME), 2018'
        },
        tooltip: {
            useHTML: true,
            pointFormat: '<b>{point.name}:</b> {point.value} deaths in 2017</sub>'
        },
        plotOptions: {
            packedbubble: {
                minSize: '20%',
                maxSize: '200%',
                layoutAlgorithm: {
                    gravitationalConstant: 0.05,
                    splitSeries: true,
                    seriesInteraction: false,
                    dragBetweenSeries: true,
                    parentNodeLimit: true
                },
                dataLabels: {
                    enabled: true,
                    format: '{point.name}',
                    filter: {
                        property: 'y',
                        operator: '>',
                        value: 1000
                    },
                    style: {
                        color: 'black',
                        textOutline: 'none',
                        fontWeight: 'normal'
                    }
                }
            }
        },
        series: worldDeaths,
        caption: {
            text: '<em>Data can be found at https://ourworldindata.org/illicit-drug-use</em>'
        }
    });
}

function plotMap(usDeaths) {
    let usOverdoseDeaths = [];

	for (datum of usDeaths) {
		log(datum);
		usOverdoseDeaths.push({
            "hc-a2" : datum['hc-a2'],
            name: datum['name'],
            x: datum['x'],
            y: datum['y'],
            value: datum['actVal']
        })
    }

    const chartMap = Highcharts.chart('highcharts-Map', {
        chart: {
            backgroundColor: '#f5f5f5',
            type: 'tilemap',
            inverted: true
            //height: (7.5 / 16 * 100) + '%'
        },
    
        accessibility: {
            description: 'A tile map represents the states of the USA by population in 2016. The hexagonal tiles are positioned to geographically echo the map of the USA. A color-coded legend states the population levels as below 1 million (beige), 1 to 5 million (orange), 5 to 20 million (pink) and above 20 million (hot pink). The chart is interactive, and the individual state data points are displayed upon hovering. Three states have a population of above 20 million: California (39.3 million), Texas (27.9 million) and Florida (20.6 million). The northern US region from Massachusetts in the Northwest to Illinois in the Midwest contains the highest concentration of states with a population of 5 to 20 million people. The southern US region from South Carolina in the Southeast to New Mexico in the Southwest contains the highest concentration of states with a population of 1 to 5 million people. 6 states have a population of less than 1 million people; these include Alaska, Delaware, Wyoming, North Dakota, South Dakota and Vermont. The state with the lowest population is Wyoming in the Northwest with 584,153 people.',
            screenReaderSection: {
                beforeChartFormat:
                    '<h5>{chartTitle}</h5>' +
                    '<div>{chartSubtitle}</div>' +
                    '<div>{chartLongdesc}</div>' +
                    '<div>{viewTableButton}</div>'
            },
            point: {
                valueDescriptionFormat: '{index}. {xDescription}, {point.value}.'
            }
        },
    
        title: {
            text: 'The Highs and Lows of Drug Overdose in the United States'
        },
    
        subtitle: {
            text: 'Source: Atlanta, GA: US Department of Health and Human Services, CDC; 2018</a>'
        },
    
        xAxis: {
            visible: false
        },
    
        yAxis: {
            visible: false
        },
        colorAxis: {
            dataClasses: [{
                from: 0,
                to: 500,
                color: '#ffebcc',
                name: '< 500'
            }, {
                from: 500,
                to: 1500,
                color: '#FFC680',
                name: '500 - 1.5k'
            }, {
                from: 1500,
                to: 2500,
                color: '#ffad33',
                name: '1.5k-2.5k'
            }, {
                from: 2500,
                to: 3500,
                color: '#e68a00',
                name: '2.5k-3.5k'
            },{
                from: 3500,
                to: 4500,
                color: '#995c00',
                name: '3.5k-4.5k'
            },{
                from: 4500,
                color: '#663d00',
                name: '> 4.5k'
            }]
        },
    
        tooltip: {
            headerFormat: '',
            pointFormat: 'Drug Overdose Deaths in {point.name}</b> during 2018 is <b>{point.value}</b>'
        },
    
        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true,
                    format: '{point.hc-a2}',
                    color: '#000000',
                    style: {
                        textOutline: false
                    }
                }
            }
        },
        series: [{
            data: usOverdoseDeaths
        }],
        caption: {
            text: '<em>Data can be found at https://www.cdc.gov/drugoverdose/data/index.html</em>'
        }
    });
    
}

function plotPolar (drugUseData){

    let drugChange = [];

	for (datum of drugUseData) {
        log(datum);
        drugChange.push([datum['Entity'],datum['value']]);
    }
    
    const chartPyramid = Highcharts.chart('highcharts-Polar', {
        chart: {
            backgroundColor: '#f5f5f5',
            type: 'columnpyramid',
            inverted: true
        },
        title: {
            text: 'Relative Change in Drug Use from 1990 to 2017'
        },
        subtitle: {
            text: 'Source: Seattle, United States: Institute for Health Metrics and Evaluation (IHME), 2018'
        },
        xAxis: {
            crosshair: true,
            labels: {
                style: {
                    fontSize: '9px'
                }
            },
            type: 'category'
        },
        scrollbar: {
                enabled: true
        },
        yAxis: {
            min: -25,
            max: 55, 
            title: {
                text: 'Relative Change Percentage (%)',
                rotation: 0
            },
            plotLines: [{
                color: '#000000',
                width: 2,
                value: 0
            }]
        }, 
        colorAxis: {
            dataClasses: [{
                from: -25,
                to: 0,
                color: 'rgb(58, 204, 188)',
                name: '< 0'
            }, {
                from: 0,
                color: 'rgb(247, 106, 1)',
                name:'> 0'
            }]
        },
        tooltip: {
            valueSuffix: ' %'
        },
        legend: {
            enabled: false
        },
        series: [{
            name: 'Relative Change Percentage',
            data: drugChange,
            showInLegend: false,
            borderColor: '#000000',
            borderWidth: 0.5,
        }],
        caption: {
            text: '<em>Data can be found at https://ourworldindata.org/illicit-drug-use</em>'
        }
    });
}

function showSeries(e) {
    if (this.visible) {
        this.hide();
        e.target.innerHTML = 'Show series';
    } else {
        this.show();
        e.target.innerHTML = 'Hide series';
    }
}

function plotBar(drugUse) {
    let ages = []
    let alc = []
    let mar = []
    let coc =[]
    let cra = []
    let her = []
    let hal = []
    let inh = []
    let pai = []
    let oxy = []
    let tra = []
    let sti = []
    let met = []
    let sed = []
	for (datum of drugUse) {
        ages.push(datum['age']);
        alc.push(datum['alcohol-use']);
        mar.push(datum['marijuana-use']);
        coc.push(datum['cocaine-use']);
        cra.push(datum['crack-use']);
        her.push(datum['heroin-use']);
        hal.push(datum['hallucinogen-use']);
        inh.push(datum['inhalant-use']);
        pai.push(datum['pain-releiver-use']);
        oxy.push(datum['oxycontin-use']);
        tra.push(datum['tranquilizer-use']);
        sti.push(datum['stimulant-use']);
        met.push(datum['meth-use']);
        sed.push(datum['sedative-use']);
	}
	bchart = Highcharts.chart('drugUse', {
		chart: {
            backgroundColor: '#f5f5f5',
            type: 'bar'
            //height: (7.5 / 16 * 100) + '%'
		},
		title: {
			text: '<b>Percentage of Each Age Group that Used Each Drug</b>'
        },
        subtitle: {
            text: 'Source: National Survey on Drug Use and Health from the Substance Abuse and Mental Health Data Archive'
        },
		xAxis: {
			categories: ages,
			title: {
                text: 'Age <br>Group',
                rotation: 0,
                offset: 90
			}
		},
		yAxis: {
			min: 0,
			title: {
				text: 'Percentage that used the drug'
			},
		},
		legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            x: 0,
            y: 50,
			reversed: true,
			itemStyle: {
				color: '#000000',
				fontSize: '12px',
				padding: 20
			}
		},
		plotOptions: {
			column: {
                borderWidth: 0,
                groupPadding: 1,
                pointPadding: 1,
				shadow: false
            }
		},
		plotOptions: {
			series: {showInLegend: false,
                name: 'Series',
                data: [],
                stacking: 'normal',
				lineColor: '#ccc',
				showCheckbox:true,
				height: 33,
				shadow:false,
                lineWidth:3,
                pointWidth: 15,
				marker:{
					symbol:'circle',
					radius:0,
					states:{
						hover:{
							radius:3
						}
					}
				},
				events: {
					checkboxClick:showSeries
				}
			}
		},
		series: [{
            name: 'crack-use',
            showInLegend: true,
			data: cra,
			selected: true,
			events: {
        		legendItemClick: function(e) {
            		e.preventDefault()
            }
        }
        },{
            name: 'meth-use',
            showInLegend: true,
			data: met,
			selected: true,
			events: {
        		legendItemClick: function(e) {
            		e.preventDefault()
            }
        }
        },{
            name: 'heroin-use',
            showInLegend: true,
			data: her,
			selected: true,
			events: {
        		legendItemClick: function(e) {
            		e.preventDefault()
            }
        }
        },{
            name: 'oxycontin-use',
            showInLegend: true,
			data: oxy,
			selected: true,
			events: {
        		legendItemClick: function(e) {
            		e.preventDefault()
            }
        }
        },{
            name: 'inhalant-use',
            showInLegend: true,
			data: inh,
			selected: true,
			events: {
        		legendItemClick: function(e) {
            		e.preventDefault()
            }
        }
        },{
            name: 'stimulant-use',
            showInLegend: true,
			data: sti,
			selected: true,
			events: {
        		legendItemClick: function(e) {
            		e.preventDefault()
            }
        }
        },{
            name: 'cocaine-use',
            showInLegend: true,
			data: coc,
			selected: true,
			events: {
        		legendItemClick: function(e) {
            		e.preventDefault()
            }
        }
        },{
            name: 'hallucinogen-use',
            showInLegend: true,
			data: hal,
			selected: true,
			events: {
        		legendItemClick: function(e) {
            		e.preventDefault()
            }
        }
        },{
            name: 'pain-releiver-use',
            showInLegend: true,
			data: pai,
			selected: true,
			events: {
        		legendItemClick: function(e) {
            		e.preventDefault()
            }
        }
        },{
            name: 'marijuana-use',
            showInLegend: true,
			data: mar,
			selected: true,
			events: {
        		legendItemClick: function(e) {
            		e.preventDefault()
            }
        }
        },{
            name: 'alcohol-use',
            showInLegend: true,
			data: alc,
			selected: true,
			events: {
        		legendItemClick: function(e) {
            		e.preventDefault()
            }
        }
		}
    ],
    caption: {
        text: '<em>Data can be found at https://github.com/fivethirtyeight/data/tree/master/drug-use-by-age</em>'
    }
	});
}

function changePie(age) {
    drugUse = loadJSON('./data/drug-use-by-age.json')
    drugUse.then(function (drugUse) {
        plotPie(drugUse, age);
    })
}

function plotPie(drugUse, age) {
    let data = drugUse[0];
	for (datum of drugUse) {
        if(datum['age'] == age){
            data = datum;
        }
    }
    let alc = (data['alcohol-use'] * data['n']);
    let mar = (data['marijuana-use'] * data['n']);
    let coc = (data['cocaine-use'] * data['n']);
    let cra = (data['crack-use'] * data['n']);
    let her = (data['heroin-use'] * data['n']);
    let hal = (data['hallucinogen-use'] * data['n']);
    let inh = (data['inhalant-use'] * data['n']);
    let pai = (data['pain-releiver-use'] * data['n']);
    let oxy = (data['oxycontin-use'] * data['n']);
    let sti = (data['stimulant-use'] * data['n']);
    let met = (data['meth-use'] * data['n']);
	pchart = Highcharts.chart('drugsByAge', {
		chart: {
            backgroundColor: '#f5f5f5',
			plotBackgroundColor: null,
			plotBorderWidth: null,
			plotShadow: false,
            type: 'pie'
            //height: (12 / 16 * 100) + '%'
		  },
		  title: {
			text: "<b>Percentage of Drug Usage Out of All Drugs Used in Age Group</b>"
		  },
		  tooltip: {
			pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
		  },
		  accessibility: {
			point: {
			  valueSuffix: '%'
			}
		  },
		  plotOptions: {
			pie: {
			  allowPointSelect: true,
			  cursor: 'pointer',
			  dataLabels: {
                formatter: function() {
                    if (this.y > 10000) {
                        return this.point.name + ': ' + Highcharts.numberFormat(this.point.percentage, 1) + ' %'
                    }
                },
				enabled: true
			  }
			}
		  },
		  series: [{
            name: 'Drugs',
            colorByPoint: true,
            dataSorting: {
                enabled: true,
                sortKey: 'custom.value'
            },
            data: [
                {
                    name: 'crack-use',
                    y: cra,
                    custom: { value: cra },
                    selected: true,
                },{
                    name: 'meth-use',
                    y: met,
                    custom: { value: met },
                    selected: true,
                },{
                    name: 'heroin-use',
                    y: her,
                    custom: { value: her },
                    selected: true
                },{
                    name: 'oxycontin-use',
                    y: oxy,
                    custom: { value: oxy },
                    selected: true
                },{
                    name: 'inhalant-use',
                    y: inh,
                    custom: { value: inh },
                    selected: true
                },{
                    name: 'stimulant-use',
                    y: sti,
                    custom: { value: sti },
                    selected: true
                },{
                    name: 'cocaine-use',
                    y: coc,
                    custom: { value: coc },
                    selected: true
                },{
                    name: 'hallucinogen-use',
                    y: hal,
                    custom: { value: hal },
                    selected: true
                },{
                    name: 'pain-releiver-use',
                    y: pai,
                    custom: { value: 999999 },
                    selected: true
                },{
                    name: 'marijuana-use',
                    y: mar,
                    custom: { value: mar },
                    selected: true
                },{
                    name: 'alcohol-use',
                    y: alc,
                    custom: { value: alc },
                    selected: true
                }
            ]
	}]
})
}

function plotArea(drugUse) {
    let year = []
    let male = []
    let female = []
	for (datum of drugUse) {
        year.push(datum['Year']);
        male.push(datum['Prevalence - Drug use disorders - Sex: Male - Age: Age-standardized (Percent)']);
        female.push(datum['Prevalence - Drug use disorders - Sex: Female - Age: Age-standardized (Percent)']);
	}
	Highcharts.chart('drugsByGender', {
        chart: {
            backgroundColor: '#f5f5f5',
            type: 'area'
            //height: (6 / 16 * 100) + '%'
        },
        accessibility: {
            description: 'Image description'
        },
        title: {
            text: 'Percentage of Drug Disorders by Gender in the United States'
        },
        subtitle: {
            text: 'Source: Seattle, United States: Institute for Health Metrics and Evaluation (IHME), 2018'
        },
        xAxis: {
            labels: {
                formatter: function () {
                    return this.value; // clean, unformatted number for year
                }
            },
            accessibility: {
                rangeDescription: 'Range: 1990 to 2017.'
            }
        },
        yAxis: {
            title: {
                text: 'Percentage of Americans<br>with Drug Disorders',
                rotation: 0,
                offset: 110
            }
        },
        tooltip: {
            valueDecimals: 2,
            pointFormat: '<b>{point.y}</b>% of {series.name} reported having a drug disorder in {point.x}'
        },
        plotOptions: {
            area: {
                pointStart: 1990,
                marker: {
                    enabled: false,
                    symbol: 'circle',
                    radius: 2,
                    states: {
                        hover: {
                            enabled: true
                        }
                    }
                }
            }
        },
        series: [{
            name: 'males',
            data: male,
            fillColor: {
                linearGradient: {x1: 0, y1: 0, x2: 0, y2: 1},
                stops: [
                    [0, 'rgba(58, 204, 188, 1)'],
                    [1, 'rgba(255,255,255,.25)']
                ]
            }
        }, {
            name: 'females',
            data: female,
            fillColor: {
                linearGradient: {x1: 0, y1: 0, x2: 0, y2: 1},
                stops: [
                    [0, 'rgba(247, 106, 1, 1)'],
                    [1, 'rgba(255,255,255,.25)']
                ]
            }
        }],
        caption: {
            text: '<em>Data can be found at https://ourworldindata.org/illicit-drug-use</em>'
        }
    });
}

function init() {
    drugsWorldDeaths = loadJSON('./data/new-drug-use-data.json');
    overdoseUS = loadJSON('./data/overdoseUS.json');
    drugChange = loadJSON('./data/relativeChange.json');
    
	drugsWorldDeaths.then(function (dataDeaths) {
		plotBubble(dataDeaths);
    });
    
	overdoseUS.then(function (overdoseData) {
		plotMap(overdoseData);
    });
    
    drugChange.then(function (drugUseData) {
		plotPolar(drugUseData);
    });

	drugsWorldDeaths = loadJSON('./data/deaths-illicit-drugs.json');

    drugUse = loadJSON('./data/drug-use-by-age.json')
    drugUse.then(function (drugUse) {
        plotBar(drugUse);
    });
    drugUse.then(function (drugUse) {
        plotPie(drugUse, "12-13");
    });
    drugGender = loadJSON('./data/drugs-by-gender.json')
    drugGender.then(function (drugGender) {
        plotArea(drugGender);
    });
    window.scrollTo(0,0);
}

document.addEventListener('DOMContentLoaded', init, false);
