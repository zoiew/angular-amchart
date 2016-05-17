'use strict';
angular.module('AngularAmChart', [])
        .directive('amchart', function () {
            return {
                replace: true,
                scope: {
                    options: '=ngModel',
                    returnChart : '='
                },
                template: "<div class='amchart' style='width: 100%; height: 400px;'></div>",
                link: function (scope, $el, controller) {
                    //Gerando um uid para colocar no elemento
                    var guid = function guid() {
                        function s4() {
                            return Math.floor((1 + Math.random()) * 0x10000)
                                    .toString(16)
                                    .substring(1);
                        }
                        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                                s4() + '-' + s4() + s4() + s4();
                    };

                    var id = guid();
                    $el.attr('id', id);
                    scope.chart;

                    //Função que renderiza o gráfico na tela
                    var renderChart = function (amChartOptions) {
                        var option = amChartOptions || scope.options;
                        if (scope.options) {

                            //verificando qual tipo é o gráfico
                            switch (option.type) {
                                case "serial":
                                    scope.chart = new AmCharts.AmSerialChart();
                                    scope.chart = option.theme ? new AmCharts.AmSerialChart(AmCharts.themes[option.theme]) : new AmCharts.AmSerialChart();
                                    break;
                                case "pie":
                                    scope.chart = new AmCharts.AmPieChart();
                                    scope.chart = option.theme ? new AmCharts.AmPieChart(AmCharts.themes[option.theme]) : new AmCharts.AmPieChart();
                                    break;
                                case "funnel":
                                    scope.chart = new AmCharts.AmFunnelChart();
                                    scope.chart = option.theme ? new AmCharts.AmFunnelChart(AmCharts.themes[option.theme]) : new AmCharts.AmFunnelChart();
                                    break;
                                case "gauge":
                                    scope.chart = new AmCharts.AmAngularGauge();
                                    scope.chart = option.theme ? new AmCharts.AmAngularGauge(AmCharts.themes[option.theme]) : new AmCharts.AmAngularGauge();
                                    break;
                                case "radar":
                                    scope.chart = new AmCharts.AmRadarChart();
                                    scope.chart = option.theme ? new AmCharts.AmRadarChart(AmCharts.themes[option.theme]) : new AmCharts.AmRadarChart();
                                    break;
                                case "xy":
                                    scope.chart = new AmCharts.AmXYChart();
                                    scope.chart = option.theme ? new AmCharts.AmXYChart(AmCharts.themes[option.theme]) : new AmCharts.AmXYChart();
                                    break;
                            }

                            scope.chart.dataProvider = option.data;

                            //Colocando no objeto chart todos as propriedades que vierem no option
                            var chartKeys = Object.keys(option);
                            for (var i = 0; i < chartKeys.length; i++) {
                                if (chartKeys[i] !== "theme") {
                                    if (typeof option[chartKeys[i]] !== 'object' && typeof option[chartKeys[i]] !== 'function') {
                                        scope.chart[chartKeys[i]] = option[chartKeys[i]];
                                    } else {
                                        scope.chart[chartKeys[i]] = angular.copy(option[chartKeys[i]]);
                                    }
                                }
                            }
                            //Método do objeto Amchart para rendererizar o gráfico
                            scope.chart.write(id);

                            //Caso você queira utilizar o objeto de chart para criar algum evento
                            if(scope.returnChart){
                                scope.$parent.setChart(scope.chart);
                            }
                        }
                    };

                    renderChart(scope.options);
                    scope.$watch('options', function (newValue, oldValue) {
                        if (id === $el[0].id || !id) {
                            renderChart(newValue);
                        }
                    }, true);

                }
            };
        });
