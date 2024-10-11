/**
* Author: shenyi
* Email: shenyi@dscomm.com.cn
* Date: 13-4-12
*/
define(['ol'], function (ol) {
    return {

        getBaseLayerTypes: function () {
            return [
                new ol.layer.Tile({
                    imgUrl: '/Content/themes/blue/images/map/switch/TDY.png',
                    baseLayerIndex: 1,
                    source: new ol.source.TileImage({
                        projection: "EPSG:4326",
                        tileGrid: new ol.tilegrid.TileGrid({
                            origin: [-180, -90],
                            resolutions: this.getTDTResolutions()
                        }),
                        tileUrlFunction: function (tileCoord, obj1, obj2) {
                            var origin = this.getTileGrid().getOrigin(tileCoord[0]);
                            var res = this.getTileGrid().getResolution(tileCoord[0]);
                            var tileSize = [256, 256];
                            var minX = origin[0] + tileCoord[1] * tileSize[0] * res;
                            var minY = origin[1] + tileCoord[2] * tileSize[1] * res;
                            var maxX = minX + tileSize[0] * res;
                            var maxY = minY + tileSize[1] * res;
                            var bound = [minX, minY, maxX, maxY];

                            var originTileX = (-180 + (res * 256 / 2));
                            var originTileY = (90 - (res * 256 / 2));

                            var centerX = (bound[0] + bound[2]) / 2;
                            var centerY = (bound[1] + bound[3]) / 2;

                            var x = (Math.round(Math.abs((centerX - originTileX) / (res * 256))));
                            var y = (Math.round(Math.abs((centerY - originTileY) / (res * 256))));
                            var z = tileCoord[0];

                            return 'http://10.123.7.112:7009/PGIS_S_TileMapServer/Maps/TZTDTYX/EzMap?Service=getImage&Type=RGB&ZoomOffset=0&Col=' + x + '&Row=' + y + '&Zoom=' + z + "&V=1.0.0";
                        }
                    })
                })

            //    ,
            //    new ol.layer.Tile({
            //        imgUrl: '/Content/themes/blue/images/map/switch/vector.png',
            //        baseLayerIndex: 4,
            //        source:
            //            new ol.source.TileImage({
            //                projection: "EPSG:4326",
            //                tileGrid: new ol.tilegrid.TileGrid({
            //                    origin: [0, 0],
            //                    resolutions: this.getPGISResolutions()
            //                }),
            //                tileUrlFunction: function (tileCoord, obj1, obj2) {

            //                    var origin = this.getTileGrid().getOrigin(tileCoord[0]);
            //                    var res = this.getTileGrid().getResolution(tileCoord[0]);
            //                    var tileSize = [256, 256];
            //                    var minX = origin[0] + tileCoord[1] * tileSize[0] * res;
            //                    var minY = origin[1] + tileCoord[2] * tileSize[1] * res;
            //                    var maxX = minX + tileSize[0] * res;
            //                    var maxY = minY + tileSize[1] * res;
            //                    var bound = [minX, minY, maxX, maxY];

            //                    //var bound = this.getTileGrid().getTileCoordExtent(xyz);
            //                    //var res = this.getTileGrid().getResolution(xyz[0]);

            //                    var originTileX = (0 + (res * 256 / 2));
            //                    var originTileY = (0 + (res * 256 / 2));

            //                    var centerX = (bound[0] + bound[2]) / 2;
            //                    var centerY = (bound[1] + bound[3]) / 2;

            //                    var x = (Math.round(Math.abs((centerX - originTileX) / (res * 256))));
            //                    var y = (Math.round(Math.abs((centerY - originTileY) / (res * 256))));
            //                    var z = tileCoord[0];

            //                    return 'http://10.123.7.52:7001/PGIS_S_TileMapServer/Maps/default/EzMap?Service=getImage&Type=RGB&Col=' + x + '&Row=' + y + '&Zoom=' + z + '&V=0.3';

            //                }
            //            })
            //    }),

            //   new ol.layer.Tile({
            //       imgUrl: '/Content/themes/blue/images/map/switch/image.png',
            //       baseLayerIndex: 1,
            //       source: new ol.source.TileImage({
            //           projection: "EPSG:4326",
            //           tileGrid: new ol.tilegrid.TileGrid({
            //               origin: [0, 0],
            //               resolutions: this.getPGISResolutions()
            //           }),
            //           tileUrlFunction: function (tileCoord, obj1, obj2) {
            //               var origin = this.getTileGrid().getOrigin(tileCoord[0]);
            //               var res = this.getTileGrid().getResolution(tileCoord[0]);
            //               var tileSize = [256, 256];
            //               var minX = origin[0] + tileCoord[1] * tileSize[0] * res;
            //               var minY = origin[1] + tileCoord[2] * tileSize[1] * res;
            //               var maxX = minX + tileSize[0] * res;
            //               var maxY = minY + tileSize[1] * res;
            //               var bound = [minX, minY, maxX, maxY];

            //               var originTileX = (0 + (res * 256 / 2));
            //               var originTileY = (0 + (res * 256 / 2));

            //               var centerX = (bound[0] + bound[2]) / 2;
            //               var centerY = (bound[1] + bound[3]) / 2;

            //               var x = (Math.round(Math.abs((centerX - originTileX) / (res * 256))));
            //               var y = (Math.round(Math.abs((centerY - originTileY) / (res * 256))));
            //               var z = tileCoord[0];

            //               return 'http://10.123.7.52:7001/PGIS_S_TileMapServer/Maps/YX/EzMap?Service=getImage&Type=RGB&Col=' + x + '&Row=' + y + '&Zoom=' + z + '&V=0.3';

            //           }
            //       })
            //   }),
            //new ol.layer.Tile({
            //    imgUrl: '/Content/themes/blue/images/map/switch/image_vector.png',
            //    baseLayerIndex: 2,
            //    source: new ol.source.TileImage({
            //        projection: "EPSG:4326",
            //        tileGrid: new ol.tilegrid.TileGrid({
            //            origin: [0, 0],
            //            resolutions: this.getPGISResolutions()
            //        }),
            //        tileUrlFunction: function (tileCoord, obj1, obj2) {
            //            var origin = this.getTileGrid().getOrigin(tileCoord[0]);
            //            var res = this.getTileGrid().getResolution(tileCoord[0]);
            //            var tileSize = [256, 256];
            //            var minX = origin[0] + tileCoord[1] * tileSize[0] * res;
            //            var minY = origin[1] + tileCoord[2] * tileSize[1] * res;
            //            var maxX = minX + tileSize[0] * res;
            //            var maxY = minY + tileSize[1] * res;
            //            var bound = [minX, minY, maxX, maxY];

            //            var originTileX = (0 + (res * 256 / 2));
            //            var originTileY = (0 + (res * 256 / 2));

            //            var centerX = (bound[0] + bound[2]) / 2;
            //            var centerY = (bound[1] + bound[3]) / 2;

            //            var x = (Math.round(Math.abs((centerX - originTileX) / (res * 256))));
            //            var y = (Math.round(Math.abs((centerY - originTileY) / (res * 256))));
            //            var z = tileCoord[0];

            //            return 'http://10.123.7.52:7001/PGIS_S_TileMapServer/Maps/SLYX/EzMap?Service=getImage&Type=RGB&Col=' + x + '&Row=' + y + '&Zoom=' + z + '&V=0.3';

            //        }
            //    })
            //})

            ]
        },

        getTDTResolutions: function () {
            return [
                1.40625,
                0.703125,
                0.3515625,
                0.17578125,
                0.087890625,
                0.0439453125,
                0.02197265625,
                0.010986328125,
                0.0054931640625,
                0.00274658203125,
                0.001373291015625,
                0.0006866455078125,
                0.00034332275390625,
                0.000171661376953125,
                8.58306884765629E-05,
                4.29153442382814E-05,
                2.14576721191407E-05,
                1.07288360595703E-05,
                5.36441802978515E-06,
                2.68220901489258E-06
            ];
        },

        getTDTResolutions2: function () {
            return [
                2.958293554545656E8,
                1.479146777272828E8,
                7.39573388636414E7,
                3.69786694318207E7,
                1.848933471591035E7,
                9244667.357955175,
                4622333.678977588,
                2311166.839488794,
                1155583.419744397,
                577791.7098721985,
                288895.85493609926,
                144447.92746804963,
                72223.96373402482,
                36111.98186701241,
                18055.990933506204,
                9027.995466753102,
                4513.997733376551,
                2256.998866688275,
                1128.4994333441375
            ];
        },

        getPGISResolutions: function () {
            return [
                2,
                1,
                0.5,
                0.25,
                0.125,
                0.0625,
                0.03125,
                0.015625,
                0.0078125,
                0.00390625,
                0.001953125,
                0.0009765625,
                0.00048828125,
                0.000244140625,
                0.0001220703125,
                0.00006103515625,
                0.000030517578125,
                0.0000152587890625,
                0.00000762939453125,
                0.000003814697265625,
                0.0000019073486328125,
                0.00000095367431640625,
                0.000000476837158203125
            ];
        },

        getResolutions: function () {
            var resolutions = [];
            for (var i = 0; i < this.layerInfo.tileInfo.lods.length; i++) {
                resolutions.push(this.layerInfo.tileInfo.lods[i].resolution);
            }
            return resolutions;
        },

        getBaseLayers: function () {
            var me = this;

            // return new ol.layer.VectorTile({
            //     source: new ol.source.VectorTile({
            //       projection: "EPSG:4326",
            //       format: new ol.format.MVT(),
            //       url: 'http://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer/tile/{z}/{y}/{x}.pbf',
            //     }),
            //     //style:'https://cdn.arcgis.com/sharing/rest/content/items/3c86f87a8aa848f290737c2e2b65393c/resources/styles/root.json?f=json'
            //     //style : this.getStyleInfo().layers
            //   });

            // return new ol.layer.VectorTile({
            //     imgUrl: '/Content/themes/blue/images/map/switch/TDS.png',
            //     baseLayerIndex: 1,
            //     style: new ol.style.Style({stroke: new ol.style.Stroke({color: 'rgb(163,204,25)',width: 5})}),
            //     source: new ol.source.VectorTile({
            //         format: new ol.format.MVT(),
            //         projection: "EPSG:3857",
            //         //切片格网直接有4326坐标系统的坐标范围与缩放大小指定,因此每一级的都是固定的
            //         tileGrid: ol.tilegrid.createXYZ({extent: ol.proj.get('EPSG:3857').getExtent() , maxZoom: 22}),
            //         tilePixelRatio:1,
            //         tileUrlFunction: function(tileCoord)
            //         {
            //             return 'https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer/tile/'+(tileCoord[0] -1) + '/'+tileCoord[1] + '/' + (Math.pow(2,tileCoord[0] -1)+tileCoord[2]) + '.pbf';
            //         }
            //     })
                
            // });

            return new ol.layer.Tile({
                imgUrl: '/Content/themes/blue/images/map/switch/TDS.png',
                baseLayerIndex: 1,
                source: new ol.source.XYZ({
                    projection: "EPSG:3857",
                    //url:'https://server.arcgisonline.com/arcgis/rest/services/Elevation/World_Hillshade/MapServer/tile/{z}/{y}/{x}'
                    url:'https://map.geoq.cn/arcgis/rest/services/ChinaOnlineCommunity/MapServer/tile/{z}/{y}/{x}'
                })
            });

            return new ol.layer.Group({
                baseLayerIndex: 1,
                imgUrl: '/Content/themes/blue/images/map/switch/TDS.png',
                layers: [

                    new ol.layer.Tile({
                        source: new ol.source.TileImage({
                            projection: "EPSG:4490",
                            tileGrid: new ol.tilegrid.TileGrid({
                                origin: [-180, 90],
                                resolutions: this.getTDTResolutions2()
                            }),
                            tileUrlFunction: function (tileCoord, obj1, obj2) {

                                var origin = this.getTileGrid().getOrigin(tileCoord[0]);
                                var res = this.getTileGrid().getResolution(tileCoord[0]);
                                var tileSize = [256, 256];
                                var minX = origin[0] + tileCoord[1] * tileSize[0] * res;
                                var minY = origin[1] + tileCoord[2] * tileSize[1] * res;
                                var maxX = minX + tileSize[0] * res;
                                var maxY = minY + tileSize[1] * res;
                                var bound = [minX, minY, maxX, maxY];

                                var originTileX = (-180 + (res * 256 / 2));
                                var originTileY = (0 + (res * 256 / 2));

                                var centerX = (bound[0] + bound[2]) / 2;
                                var centerY = (bound[1] + bound[3]) / 2;

                                var x = (Math.round(Math.abs((centerX - originTileX) / (res * 256))));
                                var y = (Math.round(Math.abs((centerY - originTileY) / (res * 256))));
                                var z = tileCoord[0];
                                return 'http://t0.tianditu.gov.cn/vec_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX=' + z + '&TILEROW=' + x + '&TILECOL=' + y + '&tk=7c29acd3a26d5ef8cc55ac650a5eb1fa';
                            }
                        })
                    }),
                    new ol.layer.Tile({
                        source: new ol.source.TileImage({
                            projection: "EPSG:4490",
                            tileGrid: new ol.tilegrid.TileGrid({
                                origin: [-180, 90],
                                resolutions: this.getTDTResolutions2()
                            }),
                            tileUrlFunction: function (tileCoord, obj1, obj2) {

                                var origin = this.getTileGrid().getOrigin(tileCoord[0]);
                                var res = this.getTileGrid().getResolution(tileCoord[0]);
                                var tileSize = [256, 256];
                                var minX = origin[0] + tileCoord[1] * tileSize[0] * res;
                                var minY = origin[1] + tileCoord[2] * tileSize[1] * res;
                                var maxX = minX + tileSize[0] * res;
                                var maxY = minY + tileSize[1] * res;
                                var bound = [minX, minY, maxX, maxY];

                                var originTileX = (-180 + (res * 256 / 2));
                                var originTileY = (0 + (res * 256 / 2));

                                var centerX = (bound[0] + bound[2]) / 2;
                                var centerY = (bound[1] + bound[3]) / 2;

                                var x = (Math.round(Math.abs((centerX - originTileX) / (res * 256))));
                                var y = (Math.round(Math.abs((centerY - originTileY) / (res * 256))));
                                var z = tileCoord[0];
                                
                                return 'http://t0.tianditu.gov.cn/cva_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX=' + z + '&TILEROW=' + x + '&TILECOL=' + y + '&tk=7c29acd3a26d5ef8cc55ac650a5eb1fa';
                            }
                        })
                    })
                ]
            });

        },




        getOverlays: function () {
            return [
        ];
        },

        //此配置必须，由工具栏全图按钮调用，由于消防切图0~5级没有，直接使用上面的fullExtent会导致显示粉色错误底图
        fullExtent: [116.505910016595, 35.2429613245827, 121.364746585879, 38.0819811903214],

        getCenterLonlat: function () {
            return [(this.fullExtent[0] + this.fullExtent[2]) / 2, (this.fullExtent[1] + this.fullExtent[3]) / 2];
        },

        getLayerMaxExtent: function () {
            return new OpenLayers.Bounds(
                this.layerInfo.fullExtent.xmin,
                this.layerInfo.fullExtent.ymin,
                this.layerInfo.fullExtent.xmax,
                this.layerInfo.fullExtent.ymax
            );
        },

        projection: 'EPSG:4326',

        center: [118.573817594034,36.7669445352216],

        minResolution: 2.68220901489258E-06,

        maxResolution: 0.17578125,

        resolution: 0.00274658203125,

        //minZoom: 10,

        //maxZoom: 20,

        //locateZoom: 12

        getStyleInfo: function () {
            return {
                "version": 8,
                "sprite": "https://cdn.arcgis.com/sharing/rest/content/items/3c86f87a8aa848f290737c2e2b65393c/resources/styles/../sprites/sprite",
                "glyphs": "https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer/resources/fonts/{fontstack}/{range}.pbf",
                "sources": {
                    "esri": {
                        "type": "vector",
                        "url": "https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer"
                    }
                },
                "layers": [
                    {
                        "id": "Land/Not ice",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Land",
                        "filter": [
                            "==",
                            "_symbol",
                            0
                        ],
                        "minzoom": 0,
                        "layout": {},
                        "paint": {
                            "fill-opacity": {
                                "stops": [
                                    [
                                        0,
                                        0.1
                                    ],
                                    [
                                        8,
                                        0.2
                                    ],
                                    [
                                        14,
                                        0.32
                                    ],
                                    [
                                        15,
                                        0.6
                                    ],
                                    [
                                        17,
                                        0.8
                                    ]
                                ]
                            },
                            "fill-color": {
                                "stops": [
                                    [
                                        0,
                                        "#e1e3d0"
                                    ],
                                    [
                                        8,
                                        "#e1e3d0"
                                    ],
                                    [
                                        14,
                                        "#E1E3D0"
                                    ],
                                    [
                                        15,
                                        "#ecede3"
                                    ],
                                    [
                                        17,
                                        "#f1f2ea"
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Land/Ice",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Land",
                        "filter": [
                            "==",
                            "_symbol",
                            1
                        ],
                        "minzoom": 0,
                        "layout": {},
                        "paint": {
                            "fill-color": "#FFFFFF",
                            "fill-opacity": 0.8
                        }
                    },
                    {
                        "id": "Parcel/fill",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Parcel",
                        "minzoom": 17,
                        "layout": {},
                        "paint": {
                            "fill-color": "#eeefe8"
                        }
                    },
                    {
                        "id": "Urban area",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Urban area",
                        "minzoom": 5,
                        "maxzoom": 15,
                        "layout": {},
                        "paint": {
                            "fill-opacity": 0.2,
                            "fill-color": {
                                "stops": [
                                    [
                                        5,
                                        "#B3AB80"
                                    ],
                                    [
                                        10,
                                        "#D9D1BA"
                                    ],
                                    [
                                        12,
                                        "#EBE6D8"
                                    ]
                                ]
                            },
                            "fill-antialias": false
                        }
                    },
                    {
                        "id": "Vegetation small scale/High density",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Vegetation small scale",
                        "filter": [
                            "==",
                            "_symbol",
                            0
                        ],
                        "maxzoom": 11,
                        "layout": {},
                        "paint": {
                            "fill-color": "#c2e699",
                            "fill-opacity": {
                                "stops": [
                                    [
                                        0,
                                        0.28
                                    ],
                                    [
                                        5,
                                        0.25
                                    ],
                                    [
                                        7,
                                        0.15
                                    ],
                                    [
                                        10,
                                        0.05
                                    ]
                                ]
                            },
                            "fill-antialias": false
                        }
                    },
                    {
                        "id": "Vegetation small scale/Low density",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Vegetation small scale",
                        "filter": [
                            "==",
                            "_symbol",
                            1
                        ],
                        "maxzoom": 11,
                        "layout": {},
                        "paint": {
                            "fill-color": "#9ad666",
                            "fill-opacity": {
                                "stops": [
                                    [
                                        0,
                                        0.28
                                    ],
                                    [
                                        5,
                                        0.25
                                    ],
                                    [
                                        7,
                                        0.15
                                    ],
                                    [
                                        10,
                                        0.05
                                    ]
                                ]
                            },
                            "fill-antialias": false
                        }
                    },
                    {
                        "id": "Indigenous",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Indigenous",
                        "minzoom": 6,
                        "layout": {},
                        "paint": {
                            "fill-color": "#dbd5bd",
                            "fill-antialias": false,
                            "fill-opacity": 0.2
                        }
                    },
                    {
                        "id": "Openspace or forest",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Openspace or forest",
                        "minzoom": 9,
                        "layout": {},
                        "paint": {
                            "fill-color": "#599507",
                            "fill-opacity": 0.12,
                            "fill-antialias": false
                        }
                    },
                    {
                        "id": "Admin0 forest or park",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Admin0 forest or park",
                        "minzoom": 6,
                        "layout": {},
                        "paint": {
                            "fill-color": "#599507",
                            "fill-antialias": false,
                            "fill-opacity": {
                                "stops": [
                                    [
                                        6,
                                        0.09
                                    ],
                                    [
                                        9,
                                        0.12
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Admin1 forest or park",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Admin1 forest or park",
                        "minzoom": 7,
                        "layout": {},
                        "paint": {
                            "fill-color": "#599507",
                            "fill-antialias": false,
                            "fill-opacity": {
                                "stops": [
                                    [
                                        6,
                                        0.09
                                    ],
                                    [
                                        9,
                                        0.12
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Zoo",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Zoo",
                        "minzoom": 11,
                        "layout": {},
                        "paint": {
                            "fill-color": "#7eb71f",
                            "fill-opacity": 0.2
                        }
                    },
                    {
                        "id": "Military",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Military",
                        "minzoom": 6,
                        "layout": {},
                        "paint": {
                            "fill-color": {
                                "stops": [
                                    [
                                        6,
                                        "#806e55"
                                    ],
                                    [
                                        15,
                                        "#ccc4b8"
                                    ]
                                ]
                            },
                            "fill-antialias": false,
                            "fill-opacity": 0.2
                        }
                    },
                    {
                        "id": "Port",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Port",
                        "minzoom": 12,
                        "layout": {},
                        "paint": {
                            "fill-color": "#D1C9BE",
                            "fill-opacity": 0.2
                        }
                    },
                    {
                        "id": "Transportation",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Transportation",
                        "minzoom": 13,
                        "layout": {},
                        "paint": {
                            "fill-color": {
                                "stops": [
                                    [
                                        10,
                                        "#CCC4B8"
                                    ],
                                    [
                                        15,
                                        "#dbd5cd"
                                    ]
                                ]
                            },
                            "fill-opacity": 0.6
                        }
                    },
                    {
                        "id": "Industry",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Industry",
                        "minzoom": 12,
                        "layout": {},
                        "paint": {
                            "fill-color": "#D1C9BE",
                            "fill-opacity": 0.2
                        }
                    },
                    {
                        "id": "Golf course",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Golf course",
                        "minzoom": 11,
                        "layout": {},
                        "paint": {
                            "fill-color": "#D6E6C3",
                            "fill-outline-color": "#D6E6C3",
                            "fill-opacity": 0.6
                        }
                    },
                    {
                        "id": "Airport/Airport property",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Airport",
                        "filter": [
                            "==",
                            "_symbol",
                            1
                        ],
                        "minzoom": 9,
                        "layout": {},
                        "paint": {
                            "fill-color": {
                                "stops": [
                                    [
                                        11,
                                        "#ebe9e1"
                                    ],
                                    [
                                        15,
                                        "#efede7"
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Airport/Airport runway",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Airport",
                        "filter": [
                            "==",
                            "_symbol",
                            0
                        ],
                        "minzoom": 11,
                        "layout": {},
                        "paint": {
                            "fill-color": "#e3e0d3"
                        }
                    },
                    {
                        "id": "Retail",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Retail",
                        "minzoom": 13,
                        "layout": {},
                        "paint": {
                            "fill-color": {
                                "stops": [
                                    [
                                        11,
                                        "#E6D0CF"
                                    ],
                                    [
                                        15,
                                        "#eededd"
                                    ]
                                ]
                            },
                            "fill-opacity": 0.6
                        }
                    },
                    {
                        "id": "Water and wastewater",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Water and wastewater",
                        "minzoom": 13,
                        "layout": {},
                        "paint": {
                            "fill-color": {
                                "stops": [
                                    [
                                        10,
                                        "#CCC4B8"
                                    ],
                                    [
                                        15,
                                        "#dbd5cd"
                                    ]
                                ]
                            },
                            "fill-opacity": 0.6
                        }
                    },
                    {
                        "id": "Freight",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Freight",
                        "minzoom": 12,
                        "layout": {},
                        "paint": {
                            "fill-color": "#D1C9BE",
                            "fill-opacity": 0.2
                        }
                    },
                    {
                        "id": "Cemetery",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Cemetery",
                        "minzoom": 13,
                        "layout": {},
                        "paint": {
                            "fill-color": "#EDEDBE",
                            "fill-opacity": 0.6
                        }
                    },
                    {
                        "id": "Finance",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Finance",
                        "minzoom": 13,
                        "layout": {},
                        "paint": {
                            "fill-color": {
                                "stops": [
                                    [
                                        11,
                                        "#E6D0CF"
                                    ],
                                    [
                                        15,
                                        "#eededd"
                                    ]
                                ]
                            },
                            "fill-opacity": 0.6
                        }
                    },
                    {
                        "id": "Government",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Government",
                        "minzoom": 13,
                        "layout": {},
                        "paint": {
                            "fill-color": {
                                "stops": [
                                    [
                                        10,
                                        "#CCC4B8"
                                    ],
                                    [
                                        15,
                                        "#dbd5cd"
                                    ]
                                ]
                            },
                            "fill-opacity": 0.6
                        }
                    },
                    {
                        "id": "Emergency",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Emergency",
                        "minzoom": 13,
                        "layout": {},
                        "paint": {
                            "fill-color": "#eeefe8",
                            "fill-opacity": 0.6
                        }
                    },
                    {
                        "id": "Landmark",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Landmark",
                        "minzoom": 13,
                        "layout": {},
                        "paint": {
                            "fill-color": "#DBF2DA",
                            "fill-opacity": 0.6
                        }
                    },
                    {
                        "id": "Pedestrian",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Pedestrian",
                        "minzoom": 13,
                        "layout": {},
                        "paint": {
                            "fill-color": "#eeefe8",
                            "fill-outline-color": "#d9d9d1",
                            "fill-opacity": 0.6
                        }
                    },
                    {
                        "id": "Education",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Education",
                        "minzoom": 11,
                        "layout": {},
                        "paint": {
                            "fill-color": {
                                "stops": [
                                    [
                                        11,
                                        "#E6DBED"
                                    ],
                                    [
                                        15,
                                        "#eee6f3"
                                    ]
                                ]
                            },
                            "fill-opacity": 0.6
                        }
                    },
                    {
                        "id": "Medical",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Medical",
                        "minzoom": 11,
                        "layout": {},
                        "paint": {
                            "fill-color": {
                                "stops": [
                                    [
                                        11,
                                        "#D8DDF0"
                                    ],
                                    [
                                        15,
                                        "#e4e7f5"
                                    ]
                                ]
                            },
                            "fill-opacity": 0.6
                        }
                    },
                    {
                        "id": "Park or farming",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Park or farming",
                        "minzoom": 11,
                        "layout": {},
                        "paint": {
                            "fill-color": "#7eb71f",
                            "fill-opacity": 0.2
                        }
                    },
                    {
                        "id": "Beach",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Beach",
                        "minzoom": 13,
                        "layout": {},
                        "paint": {
                            "fill-pattern": "Special area of interest/Sand"
                        }
                    },
                    {
                        "id": "Special area of interest/Garden path",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Special area of interest",
                        "filter": [
                            "==",
                            "_symbol",
                            12
                        ],
                        "minzoom": 14,
                        "layout": {
                            "visibility": "none"
                        },
                        "paint": {
                            "fill-color": "#f5f5f1",
                            "fill-outline-color": "#EBE8E8"
                        }
                    },
                    {
                        "id": "Parcel/line",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Parcel",
                        "minzoom": 17,
                        "layout": {
                            "line-cap": "round",
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": "#E0E0E0",
                            "line-width": 1
                        }
                    },
                    {
                        "id": "Special area of interest/Green openspace",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Special area of interest",
                        "filter": [
                            "==",
                            "_symbol",
                            11
                        ],
                        "minzoom": 14,
                        "layout": {},
                        "paint": {
                            "fill-color": "#DEEEC4",
                            "fill-opacity": 0.5
                        }
                    },
                    {
                        "id": "Special area of interest/Grass",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Special area of interest",
                        "filter": [
                            "==",
                            "_symbol",
                            8
                        ],
                        "minzoom": 14,
                        "layout": {},
                        "paint": {
                            "fill-color": "#CCE3AF",
                            "fill-opacity": 0.5
                        }
                    },
                    {
                        "id": "Special area of interest/Baseball field or other grounds",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Special area of interest",
                        "filter": [
                            "==",
                            "_symbol",
                            1
                        ],
                        "minzoom": 14,
                        "layout": {},
                        "paint": {
                            "fill-color": "#C4D4B5"
                        }
                    },
                    {
                        "id": "Special area of interest/Groundcover",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Special area of interest",
                        "filter": [
                            "==",
                            "_symbol",
                            13
                        ],
                        "minzoom": 14,
                        "layout": {},
                        "paint": {
                            "fill-pattern": "Special area of interest/Groundcover",
                            "fill-opacity": 0.5
                        }
                    },
                    {
                        "id": "Special area of interest/Field or court exterior",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Special area of interest",
                        "filter": [
                            "==",
                            "_symbol",
                            5
                        ],
                        "minzoom": 14,
                        "layout": {},
                        "paint": {
                            "fill-color": "#D6E8C7"
                        }
                    },
                    {
                        "id": "Special area of interest/Football field or court",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Special area of interest",
                        "filter": [
                            "==",
                            "_symbol",
                            4
                        ],
                        "minzoom": 14,
                        "layout": {},
                        "paint": {
                            "fill-color": "#C4D4B5",
                            "fill-outline-color": "#FFFFFF"
                        }
                    },
                    {
                        "id": "Special area of interest/Hardcourt",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Special area of interest",
                        "filter": [
                            "==",
                            "_symbol",
                            10
                        ],
                        "minzoom": 14,
                        "layout": {},
                        "paint": {
                            "fill-color": "#B4B4B4",
                            "fill-outline-color": "#FFFFFF"
                        }
                    },
                    {
                        "id": "Special area of interest/Parking",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Special area of interest",
                        "filter": [
                            "==",
                            "_symbol",
                            15
                        ],
                        "minzoom": 15,
                        "layout": {},
                        "paint": {
                            "fill-color": "#eeefe8",
                            "fill-outline-color": "#d9d9d1"
                        }
                    },
                    {
                        "id": "Special area of interest/Mulch or dirt",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Special area of interest",
                        "filter": [
                            "==",
                            "_symbol",
                            14
                        ],
                        "minzoom": 14,
                        "layout": {},
                        "paint": {
                            "fill-color": "#E8E3D6"
                        }
                    },
                    {
                        "id": "Special area of interest/Athletic track",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Special area of interest",
                        "filter": [
                            "==",
                            "_symbol",
                            0
                        ],
                        "minzoom": 14,
                        "layout": {},
                        "paint": {
                            "fill-color": "#E0B8B8",
                            "fill-outline-color": "#EEE6D6"
                        }
                    },
                    {
                        "id": "Special area of interest/Sand",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Special area of interest",
                        "filter": [
                            "==",
                            "_symbol",
                            6
                        ],
                        "minzoom": 14,
                        "layout": {},
                        "paint": {
                            "fill-pattern": "Special area of interest/Sand"
                        }
                    },
                    {
                        "id": "Special area of interest/Rock or gravel",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Special area of interest",
                        "filter": [
                            "==",
                            "_symbol",
                            16
                        ],
                        "minzoom": 14,
                        "layout": {},
                        "paint": {
                            "fill-pattern": "Special area of interest/Rock or gravel"
                        }
                    },
                    {
                        "id": "Water line small scale",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Water line small scale",
                        "minzoom": 1,
                        "maxzoom": 5,
                        "layout": {
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": "#AFDEED",
                            "line-width": {
                                "base": 1.2,
                                "stops": [
                                    [
                                        1,
                                        0.5
                                    ],
                                    [
                                        5,
                                        0.5
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Water line medium scale",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Water line medium scale",
                        "minzoom": 5,
                        "maxzoom": 7,
                        "layout": {
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": "#AFDEED",
                            "line-width": {
                                "base": 1.2,
                                "stops": [
                                    [
                                        5,
                                        0.5
                                    ],
                                    [
                                        7,
                                        0.7
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Water line large scale",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Water line large scale",
                        "minzoom": 7,
                        "maxzoom": 11,
                        "layout": {
                            "line-cap": "round",
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": "#8CCFD9",
                            "line-width": {
                                "base": 1.2,
                                "stops": [
                                    [
                                        7,
                                        0.5
                                    ],
                                    [
                                        11,
                                        0.7
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Water line/Waterfall",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Water line",
                        "filter": [
                            "==",
                            "_symbol",
                            5
                        ],
                        "minzoom": 11,
                        "layout": {
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": "#8CCFD9",
                            "line-width": 0.8,
                            "line-dasharray": [
                                5,
                                5
                            ]
                        }
                    },
                    {
                        "id": "Water line/Dam or weir",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Water line",
                        "filter": [
                            "==",
                            "_symbol",
                            2
                        ],
                        "minzoom": 11,
                        "layout": {
                            "line-cap": "round",
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": "#c3c3c3",
                            "line-width": {
                                "base": 1.2,
                                "stops": [
                                    [
                                        11,
                                        0.7
                                    ],
                                    [
                                        14,
                                        0.7
                                    ],
                                    [
                                        17,
                                        2
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Water line/Levee/1",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Water line",
                        "filter": [
                            "==",
                            "_symbol",
                            3
                        ],
                        "minzoom": 11,
                        "layout": {
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": "#c3c3c3",
                            "line-width": {
                                "base": 1.2,
                                "stops": [
                                    [
                                        11,
                                        0.7
                                    ],
                                    [
                                        14,
                                        0.7
                                    ],
                                    [
                                        17,
                                        2
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Water line/Levee/0",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Water line",
                        "filter": [
                            "==",
                            "_symbol",
                            3
                        ],
                        "minzoom": 13,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-avoid-edges": true,
                            "icon-image": "Water line/Levee/0",
                            "symbol-spacing": 13.3,
                            "icon-rotation-alignment": "map",
                            "icon-allow-overlap": true,
                            "icon-padding": 1
                        },
                        "paint": {}
                    },
                    {
                        "id": "Water line/Canal or ditch",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Water line",
                        "filter": [
                            "==",
                            "_symbol",
                            1
                        ],
                        "minzoom": 11,
                        "layout": {
                            "line-cap": "round"
                        },
                        "paint": {
                            "line-color": "#8ccfd9",
                            "line-width": {
                                "base": 1.2,
                                "stops": [
                                    [
                                        11,
                                        0.7
                                    ],
                                    [
                                        14,
                                        0.7
                                    ],
                                    [
                                        17,
                                        2
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Water line/Stream or river intermittent",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Water line",
                        "filter": [
                            "==",
                            "_symbol",
                            4
                        ],
                        "minzoom": 11,
                        "layout": {},
                        "paint": {
                            "line-color": "#8ccfd9",
                            "line-dasharray": [
                                7,
                                3
                            ],
                            "line-width": {
                                "base": 1.2,
                                "stops": [
                                    [
                                        11,
                                        0.7
                                    ],
                                    [
                                        14,
                                        0.7
                                    ],
                                    [
                                        17,
                                        2
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Water line/Stream or river",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Water line",
                        "filter": [
                            "==",
                            "_symbol",
                            0
                        ],
                        "minzoom": 11,
                        "layout": {
                            "line-cap": "round"
                        },
                        "paint": {
                            "line-color": "#8ccfd9",
                            "line-width": {
                                "base": 1.2,
                                "stops": [
                                    [
                                        11,
                                        0.7
                                    ],
                                    [
                                        14,
                                        0.7
                                    ],
                                    [
                                        17,
                                        2
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Marine area/bathymetry depth 1",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Marine area",
                        "minzoom": 0,
                        "layout": {},
                        "paint": {
                            "fill-color": {
                                "stops": [
                                    [
                                        2,
                                        "#e7f9ff"
                                    ],
                                    [
                                        10.6,
                                        "#b8e6ff"
                                    ]
                                ]
                            },
                            "fill-antialias": false
                        }
                    },
                    {
                        "id": "Bathymetry/depth 2 (shallow water)",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Bathymetry",
                        "filter": [
                            "==",
                            "_symbol",
                            0
                        ],
                        "maxzoom": 11,
                        "layout": {},
                        "paint": {
                            "fill-color": {
                                "stops": [
                                    [
                                        2,
                                        "#d6f4ff"
                                    ],
                                    [
                                        10.6,
                                        "#b8e6ff"
                                    ]
                                ]
                            },
                            "fill-antialias": false
                        }
                    },
                    {
                        "id": "Bathymetry/depth 3",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Bathymetry",
                        "filter": [
                            "==",
                            "_symbol",
                            1
                        ],
                        "maxzoom": 11,
                        "layout": {},
                        "paint": {
                            "fill-color": {
                                "stops": [
                                    [
                                        2,
                                        "#CCF0FF"
                                    ],
                                    [
                                        10.6,
                                        "#b8e6ff"
                                    ]
                                ]
                            },
                            "fill-antialias": false
                        }
                    },
                    {
                        "id": "Bathymetry/depth 4",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Bathymetry",
                        "filter": [
                            "==",
                            "_symbol",
                            2
                        ],
                        "maxzoom": 11,
                        "layout": {},
                        "paint": {
                            "fill-color": {
                                "stops": [
                                    [
                                        2,
                                        "#C2ECFF"
                                    ],
                                    [
                                        10.6,
                                        "#b8e6ff"
                                    ]
                                ]
                            },
                            "fill-antialias": false
                        }
                    },
                    {
                        "id": "Bathymetry/depth 5",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Bathymetry",
                        "filter": [
                            "==",
                            "_symbol",
                            3
                        ],
                        "maxzoom": 11,
                        "layout": {},
                        "paint": {
                            "fill-color": "#B8E6FF",
                            "fill-antialias": false
                        }
                    },
                    {
                        "id": "Bathymetry/depth 6",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Bathymetry",
                        "filter": [
                            "==",
                            "_symbol",
                            4
                        ],
                        "maxzoom": 11,
                        "layout": {},
                        "paint": {
                            "fill-color": {
                                "stops": [
                                    [
                                        2,
                                        "#ADE0FF"
                                    ],
                                    [
                                        10.6,
                                        "#b8e6ff"
                                    ]
                                ]
                            },
                            "fill-antialias": false
                        }
                    },
                    {
                        "id": "Bathymetry/depth 7 (deep water)",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Bathymetry",
                        "filter": [
                            "==",
                            "_symbol",
                            5
                        ],
                        "maxzoom": 11,
                        "layout": {},
                        "paint": {
                            "fill-color": {
                                "stops": [
                                    [
                                        2,
                                        "#A3D9FF"
                                    ],
                                    [
                                        10.6,
                                        "#b8e6ff"
                                    ]
                                ]
                            },
                            "fill-antialias": false
                        }
                    },
                    {
                        "id": "Water area small scale",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Water area small scale",
                        "minzoom": 1,
                        "maxzoom": 5,
                        "layout": {},
                        "paint": {
                            "fill-color": {
                                "stops": [
                                    [
                                        2,
                                        "#e7f9ff"
                                    ],
                                    [
                                        5,
                                        "#D7F2FF"
                                    ]
                                ]
                            },
                            "fill-outline-color": "#B9DFEC"
                        }
                    },
                    {
                        "id": "Water area medium scale/Lake intermittent",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Water area medium scale",
                        "filter": [
                            "==",
                            "_symbol",
                            1
                        ],
                        "minzoom": 5,
                        "maxzoom": 7,
                        "layout": {},
                        "paint": {
                            "fill-pattern": "Water area/Lake or river intermittent"
                        }
                    },
                    {
                        "id": "Water area medium scale/Lake or river",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Water area medium scale",
                        "filter": [
                            "==",
                            "_symbol",
                            0
                        ],
                        "minzoom": 5,
                        "maxzoom": 7,
                        "layout": {},
                        "paint": {
                            "fill-color": {
                                "stops": [
                                    [
                                        5,
                                        "#D7F2FF"
                                    ],
                                    [
                                        7,
                                        "#CCEEFF"
                                    ]
                                ]
                            },
                            "fill-outline-color": "#B9DFEC"
                        }
                    },
                    {
                        "id": "Water area large scale/Lake intermittent",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Water area large scale",
                        "filter": [
                            "==",
                            "_symbol",
                            1
                        ],
                        "minzoom": 7,
                        "maxzoom": 11,
                        "layout": {},
                        "paint": {
                            "fill-pattern": "Water area/Lake or river intermittent"
                        }
                    },
                    {
                        "id": "Water area large scale/Lake or river",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Water area large scale",
                        "filter": [
                            "==",
                            "_symbol",
                            0
                        ],
                        "minzoom": 7,
                        "maxzoom": 11,
                        "layout": {},
                        "paint": {
                            "fill-color": {
                                "stops": [
                                    [
                                        7,
                                        "#CCEEFF"
                                    ],
                                    [
                                        10.6,
                                        "#b8e6ff"
                                    ]
                                ]
                            },
                            "fill-outline-color": {
                                "stops": [
                                    [
                                        8,
                                        "#B9DFEC"
                                    ],
                                    [
                                        9,
                                        "#b8e6ff"
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Water area/Lake, river or bay",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Water area",
                        "filter": [
                            "==",
                            "_symbol",
                            7
                        ],
                        "minzoom": 11,
                        "layout": {},
                        "paint": {
                            "fill-color": "#b8e6ff",
                            "fill-outline-color": "#b8e6ff"
                        }
                    },
                    {
                        "id": "Water area/Lake or river intermittent",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Water area",
                        "filter": [
                            "==",
                            "_symbol",
                            6
                        ],
                        "minzoom": 11,
                        "layout": {},
                        "paint": {
                            "fill-pattern": "Water area/Lake or river intermittent"
                        }
                    },
                    {
                        "id": "Water area/Inundated area",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Water area",
                        "filter": [
                            "==",
                            "_symbol",
                            4
                        ],
                        "minzoom": 11,
                        "layout": {},
                        "paint": {
                            "fill-pattern": "Water area/Inundated area"
                        }
                    },
                    {
                        "id": "Water area/Swamp or marsh",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Water area",
                        "filter": [
                            "==",
                            "_symbol",
                            3
                        ],
                        "minzoom": 11,
                        "layout": {},
                        "paint": {
                            "fill-pattern": "Water area/Swamp or marsh"
                        }
                    },
                    {
                        "id": "Water area/Playa",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Water area",
                        "filter": [
                            "==",
                            "_symbol",
                            1
                        ],
                        "minzoom": 11,
                        "layout": {},
                        "paint": {
                            "fill-pattern": "Water area/Playa"
                        }
                    },
                    {
                        "id": "Water area/Ice mass",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Water area",
                        "filter": [
                            "==",
                            "_symbol",
                            2
                        ],
                        "minzoom": 11,
                        "layout": {},
                        "paint": {
                            "fill-pattern": "Water area/Ice mass",
                            "fill-opacity": 0.5
                        }
                    },
                    {
                        "id": "Water area/Dam or weir",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Water area",
                        "filter": [
                            "==",
                            "_symbol",
                            5
                        ],
                        "minzoom": 11,
                        "layout": {},
                        "paint": {
                            "fill-color": "#e5e5dd",
                            "fill-outline-color": "#d9d9d1"
                        }
                    },
                    {
                        "id": "Special area of interest/Bike, walk or pedestrian",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Special area of interest",
                        "filter": [
                            "==",
                            "_symbol",
                            2
                        ],
                        "minzoom": 15,
                        "layout": {},
                        "paint": {
                            "fill-color": "#eeefe8",
                            "fill-outline-color": "#d9d9d1"
                        }
                    },
                    {
                        "id": "Special area of interest/Water",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Special area of interest",
                        "filter": [
                            "==",
                            "_symbol",
                            7
                        ],
                        "minzoom": 14,
                        "layout": {},
                        "paint": {
                            "fill-color": "#b8e6ff"
                        }
                    },
                    {
                        "id": "Ferry/Ferry",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Ferry",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_symbol",
                                0
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 11,
                        "layout": {
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": "#f7fdff",
                            "line-opacity": 0.8,
                            "line-width": {
                                "base": 1.2,
                                "stops": [
                                    [
                                        11,
                                        1.3
                                    ],
                                    [
                                        14,
                                        1.5
                                    ],
                                    [
                                        17,
                                        1.5
                                    ]
                                ]
                            },
                            "line-dasharray": [
                                6,
                                3
                            ]
                        }
                    },
                    {
                        "id": "Railroad/2",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Railroad",
                        "minzoom": 11,
                        "layout": {
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": "#e6e6e3",
                            "line-width": {
                                "base": 1.2,
                                "stops": [
                                    [
                                        11,
                                        2.5
                                    ],
                                    [
                                        14,
                                        2.5
                                    ],
                                    [
                                        17,
                                        4
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Railroad/1",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Railroad",
                        "minzoom": 11,
                        "layout": {
                            "line-join": "round"
                        },
                        "paint": {
                            "line-dasharray": [
                                8,
                                9.3
                            ],
                            "line-color": "#d4cfc6",
                            "line-width": {
                                "base": 1.2,
                                "stops": [
                                    [
                                        11,
                                        0.75
                                    ],
                                    [
                                        14,
                                        0.75
                                    ],
                                    [
                                        17,
                                        2
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Ferry/Rail ferry/2",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Ferry",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_symbol",
                                1
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 11,
                        "layout": {
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": "#e6e6e3",
                            "line-width": {
                                "base": 1.2,
                                "stops": [
                                    [
                                        11,
                                        2.5
                                    ],
                                    [
                                        14,
                                        2.5
                                    ],
                                    [
                                        17,
                                        4
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Ferry/Rail ferry/1",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Ferry",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_symbol",
                                1
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 11,
                        "layout": {
                            "line-join": "round"
                        },
                        "paint": {
                            "line-dasharray": [
                                8,
                                9.3
                            ],
                            "line-color": "#d4cfc6",
                            "line-width": {
                                "base": 1.2,
                                "stops": [
                                    [
                                        11,
                                        0.75
                                    ],
                                    [
                                        14,
                                        0.75
                                    ],
                                    [
                                        17,
                                        2
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Special area of interest line/Dock or pier",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Special area of interest line",
                        "filter": [
                            "==",
                            "_symbol",
                            0
                        ],
                        "minzoom": 15,
                        "layout": {
                            "line-cap": "round",
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": "#FFFFFF",
                            "line-width": {
                                "base": 1.2,
                                "stops": [
                                    [
                                        15,
                                        0.5
                                    ],
                                    [
                                        17,
                                        1.2
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Special area of interest line/Fence (chain link)/1",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Special area of interest line",
                        "filter": [
                            "==",
                            "_symbol",
                            1
                        ],
                        "minzoom": 16,
                        "layout": {
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": "#cecdc6",
                            "line-width": {
                                "base": 1.2,
                                "stops": [
                                    [
                                        15,
                                        1
                                    ],
                                    [
                                        17,
                                        1.2
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Special area of interest line/Fence (chain link)/0",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Special area of interest line",
                        "filter": [
                            "==",
                            "_symbol",
                            1
                        ],
                        "minzoom": 16,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-avoid-edges": true,
                            "icon-image": "Special area of interest line/Fence (chain link)/0",
                            "symbol-spacing": 20,
                            "icon-rotation-alignment": "map",
                            "icon-allow-overlap": true,
                            "icon-padding": 1
                        },
                        "paint": {}
                    },
                    {
                        "id": "Special area of interest line/Fence (metal)/1",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Special area of interest line",
                        "filter": [
                            "==",
                            "_symbol",
                            2
                        ],
                        "minzoom": 16,
                        "layout": {
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": "#cecdc6",
                            "line-width": {
                                "base": 1.2,
                                "stops": [
                                    [
                                        15,
                                        1
                                    ],
                                    [
                                        17,
                                        1.2
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Special area of interest line/Fence (metal)/0",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Special area of interest line",
                        "filter": [
                            "==",
                            "_symbol",
                            2
                        ],
                        "minzoom": 16,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-avoid-edges": true,
                            "icon-image": "Special area of interest line/Fence (metal)/0",
                            "symbol-spacing": 14.5,
                            "icon-rotation-alignment": "map",
                            "icon-allow-overlap": true,
                            "icon-padding": 1
                        },
                        "paint": {}
                    },
                    {
                        "id": "Special area of interest line/Fence (wood)/1",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Special area of interest line",
                        "filter": [
                            "==",
                            "_symbol",
                            3
                        ],
                        "minzoom": 16,
                        "layout": {
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": "#ded3c6",
                            "line-width": {
                                "base": 1.2,
                                "stops": [
                                    [
                                        15,
                                        1
                                    ],
                                    [
                                        17,
                                        1.2
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Special area of interest line/Fence (wood)/0",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Special area of interest line",
                        "filter": [
                            "==",
                            "_symbol",
                            3
                        ],
                        "minzoom": 16,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-avoid-edges": true,
                            "icon-image": "Special area of interest line/Fence (wood)/0",
                            "symbol-spacing": 12,
                            "icon-rotation-alignment": "map",
                            "icon-allow-overlap": true,
                            "icon-padding": 1
                        },
                        "paint": {}
                    },
                    {
                        "id": "Special area of interest line/Gate/1",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Special area of interest line",
                        "filter": [
                            "==",
                            "_symbol",
                            4
                        ],
                        "minzoom": 16,
                        "layout": {
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": "#B2B2B2",
                            "line-width": 4
                        }
                    },
                    {
                        "id": "Special area of interest line/Gate/0",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Special area of interest line",
                        "filter": [
                            "==",
                            "_symbol",
                            4
                        ],
                        "minzoom": 16,
                        "layout": {
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": "#F5F9EC",
                            "line-width": 2
                        }
                    },
                    {
                        "id": "Special area of interest line/Wall/3",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Special area of interest line",
                        "filter": [
                            "==",
                            "_symbol",
                            7
                        ],
                        "minzoom": 16,
                        "layout": {
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": "#cecdc6",
                            "line-width": 4
                        }
                    },
                    {
                        "id": "Special area of interest line/Wall/2",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Special area of interest line",
                        "filter": [
                            "==",
                            "_symbol",
                            7
                        ],
                        "minzoom": 16,
                        "layout": {
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": "#F9F6E6",
                            "line-width": 2
                        }
                    },
                    {
                        "id": "Special area of interest line/Sports field",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Special area of interest line",
                        "filter": [
                            "==",
                            "_symbol",
                            6
                        ],
                        "minzoom": 15,
                        "layout": {
                            "line-cap": "round",
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": "#FFFFFF",
                            "line-width": {
                                "base": 1.2,
                                "stops": [
                                    [
                                        15,
                                        0.5
                                    ],
                                    [
                                        17,
                                        1.2
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Building/2",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Building",
                        "minzoom": 16,
                        "layout": {},
                        "paint": {
                            "fill-color": "#A6A697",
                            "fill-opacity": 0.2,
                            "fill-translate": {
                                "stops": [
                                    [
                                        15,
                                        [
                                            0,
                                            0
                                        ]
                                    ],
                                    [
                                        18,
                                        [
                                            4,
                                            4
                                        ]
                                    ]
                                ]
                            },
                            "fill-translate-anchor": "viewport"
                        }
                    },
                    {
                        "id": "Building/1",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Building",
                        "minzoom": 16,
                        "layout": {},
                        "paint": {
                            "fill-color": "#A6A697",
                            "fill-opacity": 0.13,
                            "fill-translate": {
                                "stops": [
                                    [
                                        15,
                                        [
                                            0,
                                            0
                                        ]
                                    ],
                                    [
                                        18,
                                        [
                                            -2,
                                            2
                                        ]
                                    ]
                                ]
                            },
                            "fill-translate-anchor": "viewport"
                        }
                    },
                    {
                        "id": "Building/General",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Building",
                        "filter": [
                            "==",
                            "_symbol",
                            1
                        ],
                        "minzoom": 15,
                        "layout": {},
                        "paint": {
                            "fill-color": "#e5e5dd",
                            "fill-outline-color": "#d9d9d1"
                        }
                    },
                    {
                        "id": "Building/Government",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Building",
                        "filter": [
                            "==",
                            "_symbol",
                            2
                        ],
                        "minzoom": 15,
                        "layout": {},
                        "paint": {
                            "fill-color": "#F0E7D8",
                            "fill-outline-color": "#D0D0D0"
                        }
                    },
                    {
                        "id": "Building/Medical",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Building",
                        "filter": [
                            "==",
                            "_symbol",
                            3
                        ],
                        "minzoom": 15,
                        "layout": {},
                        "paint": {
                            "fill-color": "#e4e7f5",
                            "fill-outline-color": "#D0D0D0"
                        }
                    },
                    {
                        "id": "Building/Education",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Building",
                        "filter": [
                            "==",
                            "_symbol",
                            4
                        ],
                        "minzoom": 15,
                        "layout": {},
                        "paint": {
                            "fill-color": "#eee6f3",
                            "fill-outline-color": "#D0D0D0"
                        }
                    },
                    {
                        "id": "Building/Transportation",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Building",
                        "filter": [
                            "==",
                            "_symbol",
                            5
                        ],
                        "minzoom": 15,
                        "layout": {},
                        "paint": {
                            "fill-color": "#F0E6CC",
                            "fill-outline-color": "#D0D0D0"
                        }
                    },
                    {
                        "id": "Building/Commercial",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Building",
                        "filter": [
                            "==",
                            "_symbol",
                            6
                        ],
                        "minzoom": 15,
                        "layout": {},
                        "paint": {
                            "fill-color": "#eededd",
                            "fill-outline-color": "#D0D0D0"
                        }
                    },
                    {
                        "id": "Building/Religious",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Building",
                        "filter": [
                            "==",
                            "_symbol",
                            7
                        ],
                        "minzoom": 15,
                        "layout": {},
                        "paint": {
                            "fill-color": "#F0F0D8",
                            "fill-outline-color": "#D0D0D0"
                        }
                    },
                    {
                        "id": "Building/Recreation",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Building",
                        "filter": [
                            "==",
                            "_symbol",
                            8
                        ],
                        "minzoom": 15,
                        "layout": {},
                        "paint": {
                            "fill-color": "#DFF0DF",
                            "fill-outline-color": "#D0D0D0"
                        }
                    },
                    {
                        "id": "Building/Cultural",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Building",
                        "filter": [
                            "==",
                            "_symbol",
                            9
                        ],
                        "minzoom": 15,
                        "layout": {},
                        "paint": {
                            "fill-color": "#F0DFD8",
                            "fill-outline-color": "#D0D0D0"
                        }
                    },
                    {
                        "id": "Building/Hotel",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Building",
                        "filter": [
                            "==",
                            "_symbol",
                            10
                        ],
                        "minzoom": 15,
                        "layout": {},
                        "paint": {
                            "fill-color": "#d9ede6",
                            "fill-outline-color": "#D0D0D0"
                        }
                    },
                    {
                        "id": "Building/Airport",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Building",
                        "filter": [
                            "==",
                            "_symbol",
                            11
                        ],
                        "minzoom": 15,
                        "layout": {},
                        "paint": {
                            "fill-color": "#F0E7D8",
                            "fill-outline-color": "#D0D0D0"
                        }
                    },
                    {
                        "id": "Building/Industrial",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Building",
                        "filter": [
                            "==",
                            "_symbol",
                            12
                        ],
                        "minzoom": 15,
                        "layout": {},
                        "paint": {
                            "fill-color": "#F0E7DF",
                            "fill-outline-color": "#D0D0D0"
                        }
                    },
                    {
                        "id": "Building/Community",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Building",
                        "filter": [
                            "==",
                            "_symbol",
                            13
                        ],
                        "minzoom": 15,
                        "layout": {},
                        "paint": {
                            "fill-color": "#DFE1F0",
                            "fill-outline-color": "#D0D0D0"
                        }
                    },
                    {
                        "id": "Special area of interest line/Parking lot",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Special area of interest line",
                        "filter": [
                            "==",
                            "_symbol",
                            5
                        ],
                        "minzoom": 15,
                        "layout": {
                            "line-cap": "round",
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": "#FFFFFF",
                            "line-width": {
                                "base": 1.2,
                                "stops": [
                                    [
                                        15,
                                        0.5
                                    ],
                                    [
                                        17,
                                        1.2
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Road/4WD/1",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Road",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_symbol",
                                10
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 13,
                        "layout": {
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": "#dbdbce",
                            "line-dasharray": [
                                2.0,
                                1.0
                            ],
                            "line-width": {
                                "base": 1.2,
                                "stops": [
                                    [
                                        11,
                                        1.5
                                    ],
                                    [
                                        14,
                                        3.3
                                    ],
                                    [
                                        18,
                                        8.3
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Road/Service/1",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Road",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_symbol",
                                8
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 16,
                        "layout": {
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": "#efefe6",
                            "line-width": {
                                "base": 1.2,
                                "stops": [
                                    [
                                        13,
                                        1.5
                                    ],
                                    [
                                        14,
                                        3.3
                                    ],
                                    [
                                        18,
                                        5.3
                                    ],
                                    [
                                        22,
                                        12
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Road/Local/1",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Road",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_symbol",
                                7
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 12,
                        "layout": {
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": {
                                "stops": [
                                    [
                                        12,
                                        "#e6e6da"
                                    ],
                                    [
                                        13,
                                        "#efefe6"
                                    ]
                                ]
                            },
                            "line-width": {
                                "base": 1.4,
                                "stops": [
                                    [
                                        11,
                                        2
                                    ],
                                    [
                                        14,
                                        4
                                    ],
                                    [
                                        16,
                                        6
                                    ],
                                    [
                                        18,
                                        17.3
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Road/Minor, ramp or traffic circle/1",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Road",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_symbol",
                                6
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 9,
                        "layout": {
                            "line-cap": "round",
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": {
                                "stops": [
                                    [
                                        9,
                                        "#E2DFD6"
                                    ],
                                    [
                                        10,
                                        "#dedbd1"
                                    ],
                                    [
                                        12,
                                        "#efefe6"
                                    ]
                                ]
                            },
                            "line-width": {
                                "base": 1.2,
                                "stops": [
                                    [
                                        9.9,
                                        1
                                    ],
                                    [
                                        14,
                                        4
                                    ],
                                    [
                                        16,
                                        9.5
                                    ],
                                    [
                                        18,
                                        17.3
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Road/Minor/1",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Road",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_symbol",
                                5
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 9,
                        "layout": {
                            "line-cap": "round",
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": {
                                "stops": [
                                    [
                                        9,
                                        "#E2DFD6"
                                    ],
                                    [
                                        10,
                                        "#dedbd1"
                                    ],
                                    [
                                        12,
                                        "#efefe6"
                                    ]
                                ]
                            },
                            "line-width": {
                                "base": 1.2,
                                "stops": [
                                    [
                                        9.9,
                                        1
                                    ],
                                    [
                                        10,
                                        3.3
                                    ],
                                    [
                                        14,
                                        5.5
                                    ],
                                    [
                                        16,
                                        9.5
                                    ],
                                    [
                                        18,
                                        17.3
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Road/Major, ramp or traffic circle/1",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Road",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_symbol",
                                4
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 9,
                        "layout": {
                            "line-cap": "round",
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": {
                                "stops": [
                                    [
                                        9,
                                        "#dedbd1"
                                    ],
                                    [
                                        12,
                                        "#efefe6"
                                    ]
                                ]
                            },
                            "line-width": {
                                "base": 1.2,
                                "stops": [
                                    [
                                        9,
                                        3.3
                                    ],
                                    [
                                        14,
                                        7.3
                                    ],
                                    [
                                        16,
                                        10.3
                                    ],
                                    [
                                        18,
                                        18
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Road/Major/1",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Road",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_symbol",
                                3
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 8,
                        "layout": {
                            "line-cap": "round",
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": {
                                "stops": [
                                    [
                                        8,
                                        "#dedbd1"
                                    ],
                                    [
                                        12,
                                        "#efefe6"
                                    ]
                                ]
                            },
                            "line-width": {
                                "base": 1.0,
                                "stops": [
                                    [
                                        8,
                                        3.3
                                    ],
                                    [
                                        14,
                                        7.3
                                    ],
                                    [
                                        16,
                                        10.3
                                    ],
                                    [
                                        18,
                                        18
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Road/Pedestrian/1",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Road",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_symbol",
                                9
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 15,
                        "layout": {
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": "#efefe6",
                            "line-width": {
                                "base": 1.2,
                                "stops": [
                                    [
                                        15,
                                        3.6
                                    ],
                                    [
                                        17,
                                        4
                                    ],
                                    [
                                        22,
                                        8
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Trail or path/1",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Trail or path",
                        "minzoom": 15,
                        "layout": {
                            "line-cap": "round",
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": "#efefe6",
                            "line-width": {
                                "base": 1.2,
                                "stops": [
                                    [
                                        15,
                                        3.6
                                    ],
                                    [
                                        17,
                                        4
                                    ],
                                    [
                                        22,
                                        8
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Trail or path/0",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Trail or path",
                        "minzoom": 15,
                        "layout": {
                            "line-cap": "round",
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": "#FFFFFF",
                            "line-dasharray": {
                                "stops": [
                                    [
                                        15,
                                        [
                                            3,
                                            3
                                        ]
                                    ],
                                    [
                                        17,
                                        [
                                            2,
                                            2
                                        ]
                                    ]
                                ]
                            },
                            "line-width": {
                                "base": 1.2,
                                "stops": [
                                    [
                                        15,
                                        1.3
                                    ],
                                    [
                                        17,
                                        3
                                    ],
                                    [
                                        22,
                                        6
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Road/Pedestrian/0",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Road",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_symbol",
                                9
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 15,
                        "layout": {
                            "line-cap": "round",
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": "#FFFFFF",
                            "line-dasharray": {
                                "stops": [
                                    [
                                        15,
                                        [
                                            3,
                                            3
                                        ]
                                    ],
                                    [
                                        17,
                                        [
                                            2,
                                            2
                                        ]
                                    ]
                                ]
                            },
                            "line-width": {
                                "base": 1.2,
                                "stops": [
                                    [
                                        15,
                                        1.3
                                    ],
                                    [
                                        17,
                                        3
                                    ],
                                    [
                                        22,
                                        6
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Road/4WD/0",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Road",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_symbol",
                                10
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 13,
                        "layout": {
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": "#FFFFFF",
                            "line-width": {
                                "base": 1.2,
                                "stops": [
                                    [
                                        11,
                                        0.75
                                    ],
                                    [
                                        14,
                                        1.3
                                    ],
                                    [
                                        18,
                                        6.3
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Road/Service/0",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Road",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_symbol",
                                8
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 13,
                        "layout": {
                            "line-cap": "round",
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": "#FFFFFF",
                            "line-width": {
                                "base": 1.2,
                                "stops": [
                                    [
                                        13,
                                        0.75
                                    ],
                                    [
                                        14,
                                        1.3
                                    ],
                                    [
                                        18,
                                        3.3
                                    ],
                                    [
                                        22,
                                        10
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Road/Local/0",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Road",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_symbol",
                                7
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 12,
                        "layout": {
                            "line-cap": "round",
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": {
                                "stops": [
                                    [
                                        12,
                                        "#fcfbf9"
                                    ],
                                    [
                                        13,
                                        "#ffffff"
                                    ]
                                ]
                            },
                            "line-width": {
                                "base": 1.4,
                                "stops": [
                                    [
                                        11,
                                        1.1
                                    ],
                                    [
                                        14,
                                        2
                                    ],
                                    [
                                        16,
                                        4
                                    ],
                                    [
                                        18,
                                        15.3
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Road/Minor, ramp or traffic circle/0",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Road",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_symbol",
                                6
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 9,
                        "layout": {
                            "line-cap": "round",
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": "#FFFFFF",
                            "line-width": {
                                "base": 1.2,
                                "stops": [
                                    [
                                        9.9,
                                        0.75
                                    ],
                                    [
                                        14,
                                        2
                                    ],
                                    [
                                        16,
                                        7.5
                                    ],
                                    [
                                        18,
                                        15.3
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Road/Minor/0",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Road",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_symbol",
                                5
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 10,
                        "layout": {
                            "line-cap": "round",
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": "#FFFFFF",
                            "line-width": {
                                "base": 1.2,
                                "stops": [
                                    [
                                        10,
                                        1.3
                                    ],
                                    [
                                        14,
                                        3.5
                                    ],
                                    [
                                        16,
                                        7.5
                                    ],
                                    [
                                        18,
                                        15.3
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Road/Major, ramp or traffic circle/0",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Road",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_symbol",
                                4
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 9,
                        "layout": {
                            "line-cap": "round",
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": "#ffffff",
                            "line-width": {
                                "base": 1.2,
                                "stops": [
                                    [
                                        9,
                                        1.3
                                    ],
                                    [
                                        14,
                                        5.3
                                    ],
                                    [
                                        16,
                                        8.3
                                    ],
                                    [
                                        18,
                                        16
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Road/Major/0",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Road",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_symbol",
                                3
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 8,
                        "layout": {
                            "line-cap": "round",
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": "#FFFFFF",
                            "line-width": {
                                "base": 1.2,
                                "stops": [
                                    [
                                        8,
                                        1.3
                                    ],
                                    [
                                        14,
                                        5.3
                                    ],
                                    [
                                        16,
                                        8.3
                                    ],
                                    [
                                        18,
                                        16
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Road/Freeway Motorway, ramp or traffic circle/2",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Road",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_symbol",
                                2
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 6,
                        "layout": {
                            "line-join": "round",
                            "line-cap": "round"
                        },
                        "paint": {
                            "line-color": "#ffffff",
                            "line-width": {
                                "base": 1.2,
                                "stops": [
                                    [
                                        9,
                                        0.3
                                    ],
                                    [
                                        14,
                                        8.3
                                    ],
                                    [
                                        16,
                                        14.3
                                    ],
                                    [
                                        18,
                                        30
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Road/Highway/2",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Road",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_symbol",
                                1
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 6,
                        "layout": {
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": "#ffffff",
                            "line-width": {
                                "base": 1.2,
                                "stops": [
                                    [
                                        6,
                                        0.3
                                    ],
                                    [
                                        14,
                                        8.3
                                    ],
                                    [
                                        16,
                                        14.3
                                    ],
                                    [
                                        18,
                                        30
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Road/Freeway Motorway/2",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Road",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_symbol",
                                0
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 5,
                        "layout": {
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": "#ffffff",
                            "line-width": {
                                "base": 1.2,
                                "stops": [
                                    [
                                        5,
                                        0.3
                                    ],
                                    [
                                        14,
                                        8.3
                                    ],
                                    [
                                        16,
                                        14.3
                                    ],
                                    [
                                        18,
                                        30
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Road/Freeway Motorway, ramp or traffic circle/1",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Road",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_symbol",
                                2
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 6,
                        "layout": {
                            "line-join": "round",
                            "line-cap": "round"
                        },
                        "paint": {
                            "line-color": {
                                "stops": [
                                    [
                                        6,
                                        "#DBDBDB"
                                    ],
                                    [
                                        8,
                                        "#D1D1CF"
                                    ],
                                    [
                                        12,
                                        "#bfbfba"
                                    ]
                                ]
                            },
                            "line-width": {
                                "base": 1.2,
                                "stops": [
                                    [
                                        9,
                                        0.3
                                    ],
                                    [
                                        14,
                                        6.3
                                    ],
                                    [
                                        16,
                                        12.3
                                    ],
                                    [
                                        18,
                                        28
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Road/Highway/1",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Road",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_symbol",
                                1
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 6,
                        "layout": {
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": {
                                "stops": [
                                    [
                                        6,
                                        "#DBDBDB"
                                    ],
                                    [
                                        8,
                                        "#D1D1CF"
                                    ],
                                    [
                                        12,
                                        "#bfbfba"
                                    ]
                                ]
                            },
                            "line-width": {
                                "base": 1.2,
                                "stops": [
                                    [
                                        6,
                                        0.3
                                    ],
                                    [
                                        14,
                                        6.3
                                    ],
                                    [
                                        16,
                                        12.3
                                    ],
                                    [
                                        18,
                                        28
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Road/Freeway Motorway/1",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Road",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_symbol",
                                0
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 5,
                        "layout": {
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": {
                                "stops": [
                                    [
                                        6,
                                        "#DBDBDB"
                                    ],
                                    [
                                        8,
                                        "#C2C2BE"
                                    ],
                                    [
                                        12,
                                        "#bfbfba"
                                    ]
                                ]
                            },
                            "line-width": {
                                "base": 1.2,
                                "stops": [
                                    [
                                        5,
                                        0.3
                                    ],
                                    [
                                        14,
                                        6.3
                                    ],
                                    [
                                        16,
                                        12.3
                                    ],
                                    [
                                        18,
                                        28
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Road/Freeway Motorway, ramp or traffic circle/0",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Road",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_symbol",
                                2
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 6,
                        "layout": {
                            "line-join": "round",
                            "line-cap": "round"
                        },
                        "paint": {
                            "line-color": "#DBDBDB",
                            "line-blur": {
                                "stops": [
                                    [
                                        11,
                                        0.5
                                    ],
                                    [
                                        18,
                                        5
                                    ]
                                ]
                            },
                            "line-width": {
                                "base": 1.2,
                                "stops": [
                                    [
                                        11,
                                        0.5
                                    ],
                                    [
                                        12,
                                        2
                                    ],
                                    [
                                        14,
                                        5
                                    ],
                                    [
                                        16,
                                        11
                                    ],
                                    [
                                        18,
                                        26
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Road/Highway/0",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Road",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_symbol",
                                1
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 6,
                        "layout": {
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": "#DBDBDB",
                            "line-blur": {
                                "stops": [
                                    [
                                        11,
                                        0.5
                                    ],
                                    [
                                        18,
                                        5
                                    ]
                                ]
                            },
                            "line-width": {
                                "base": 1.2,
                                "stops": [
                                    [
                                        11,
                                        0.5
                                    ],
                                    [
                                        12,
                                        2
                                    ],
                                    [
                                        14,
                                        5
                                    ],
                                    [
                                        16,
                                        11
                                    ],
                                    [
                                        18,
                                        26
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Road/Freeway Motorway/0",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Road",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_symbol",
                                0
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 5,
                        "layout": {
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": "#DBDBDB",
                            "line-blur": {
                                "stops": [
                                    [
                                        11,
                                        0.5
                                    ],
                                    [
                                        18,
                                        5
                                    ]
                                ]
                            },
                            "line-width": {
                                "base": 1.2,
                                "stops": [
                                    [
                                        11,
                                        0.5
                                    ],
                                    [
                                        12,
                                        2
                                    ],
                                    [
                                        14,
                                        5
                                    ],
                                    [
                                        16,
                                        11
                                    ],
                                    [
                                        18,
                                        26
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Building/Special area of interest",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Building",
                        "filter": [
                            "==",
                            "_symbol",
                            0
                        ],
                        "minzoom": 15,
                        "layout": {},
                        "paint": {
                            "fill-color": "#e5e5dd",
                            "fill-outline-color": "#d9d9d1"
                        }
                    },
                    {
                        "id": "Road tunnel/4WD/1",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Road tunnel",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_symbol",
                                10
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 13,
                        "layout": {
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": "#dbdbce",
                            "line-opacity": 0.5,
                            "line-dasharray": [
                                2.0,
                                1.0
                            ],
                            "line-width": {
                                "base": 1.2,
                                "stops": [
                                    [
                                        11,
                                        1.5
                                    ],
                                    [
                                        14,
                                        3.3
                                    ],
                                    [
                                        18,
                                        8.3
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Road tunnel/Service/1",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Road tunnel",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_symbol",
                                8
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 16,
                        "layout": {
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": "#efefe6",
                            "line-opacity": 0.5,
                            "line-width": {
                                "base": 1.2,
                                "stops": [
                                    [
                                        13,
                                        1.5
                                    ],
                                    [
                                        14,
                                        3.3
                                    ],
                                    [
                                        18,
                                        5.3
                                    ],
                                    [
                                        22,
                                        12
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Road tunnel/Local/1",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Road tunnel",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_symbol",
                                7
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 12,
                        "layout": {
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": {
                                "stops": [
                                    [
                                        12,
                                        "#e6e6da"
                                    ],
                                    [
                                        13,
                                        "#efefe6"
                                    ]
                                ]
                            },
                            "line-opacity": 0.5,
                            "line-width": {
                                "base": 1.4,
                                "stops": [
                                    [
                                        11,
                                        2
                                    ],
                                    [
                                        14,
                                        4
                                    ],
                                    [
                                        16,
                                        6
                                    ],
                                    [
                                        18,
                                        17.3
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Road tunnel/Pedestrian/1",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Road tunnel",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_symbol",
                                9
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 15,
                        "layout": {
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": "#efefe6",
                            "line-opacity": 0.5,
                            "line-width": {
                                "base": 1.2,
                                "stops": [
                                    [
                                        14,
                                        3.6
                                    ],
                                    [
                                        16,
                                        4
                                    ],
                                    [
                                        18,
                                        8
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Road tunnel/Minor, ramp or traffic circle/1",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Road tunnel",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_symbol",
                                6
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 9,
                        "layout": {
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": {
                                "stops": [
                                    [
                                        9,
                                        "#E2DFD6"
                                    ],
                                    [
                                        10,
                                        "#dedbd1"
                                    ],
                                    [
                                        12,
                                        "#efefe6"
                                    ]
                                ]
                            },
                            "line-opacity": 0.5,
                            "line-width": {
                                "base": 1.2,
                                "stops": [
                                    [
                                        9.9,
                                        1
                                    ],
                                    [
                                        14,
                                        4
                                    ],
                                    [
                                        16,
                                        9.5
                                    ],
                                    [
                                        18,
                                        17.3
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Road tunnel/Minor/1",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Road tunnel",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_symbol",
                                5
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 9,
                        "layout": {
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": {
                                "stops": [
                                    [
                                        9,
                                        "#E2DFD6"
                                    ],
                                    [
                                        10,
                                        "#dedbd1"
                                    ],
                                    [
                                        12,
                                        "#efefe6"
                                    ]
                                ]
                            },
                            "line-opacity": 0.5,
                            "line-width": {
                                "base": 1.2,
                                "stops": [
                                    [
                                        9.9,
                                        1
                                    ],
                                    [
                                        10,
                                        3.3
                                    ],
                                    [
                                        14,
                                        5.5
                                    ],
                                    [
                                        16,
                                        9.5
                                    ],
                                    [
                                        18,
                                        17.3
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Road tunnel/Major, ramp or traffic circle/1",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Road tunnel",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_symbol",
                                4
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 9,
                        "layout": {
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": {
                                "stops": [
                                    [
                                        9,
                                        "#e6e4de"
                                    ],
                                    [
                                        12,
                                        "#efefe6"
                                    ]
                                ]
                            },
                            "line-opacity": 0.5,
                            "line-width": {
                                "base": 1.2,
                                "stops": [
                                    [
                                        9,
                                        3.3
                                    ],
                                    [
                                        14,
                                        7.3
                                    ],
                                    [
                                        16,
                                        10.3
                                    ],
                                    [
                                        18,
                                        18
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Road tunnel/Major/1",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Road tunnel",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_symbol",
                                3
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 8,
                        "layout": {
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": {
                                "stops": [
                                    [
                                        8,
                                        "#e6e6da"
                                    ],
                                    [
                                        12,
                                        "#efefe6"
                                    ]
                                ]
                            },
                            "line-opacity": 0.5,
                            "line-width": {
                                "base": 1.0,
                                "stops": [
                                    [
                                        8,
                                        3.3
                                    ],
                                    [
                                        14,
                                        7.3
                                    ],
                                    [
                                        16,
                                        10.3
                                    ],
                                    [
                                        18,
                                        18
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Road tunnel/Pedestrian/0",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Road tunnel",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_symbol",
                                9
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 15,
                        "layout": {
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": "#FFFFFF",
                            "line-opacity": 0.5,
                            "line-dasharray": {
                                "stops": [
                                    [
                                        15,
                                        [
                                            3,
                                            3
                                        ]
                                    ],
                                    [
                                        17,
                                        [
                                            2,
                                            2
                                        ]
                                    ]
                                ]
                            },
                            "line-width": {
                                "base": 1.2,
                                "stops": [
                                    [
                                        15,
                                        1.3
                                    ],
                                    [
                                        17,
                                        3
                                    ],
                                    [
                                        22,
                                        6
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Road tunnel/4WD/0",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Road tunnel",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_symbol",
                                10
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 13,
                        "layout": {
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": "#FFFFFF",
                            "line-opacity": 0.5,
                            "line-width": {
                                "base": 1.2,
                                "stops": [
                                    [
                                        11,
                                        0.75
                                    ],
                                    [
                                        14,
                                        1.3
                                    ],
                                    [
                                        18,
                                        6.3
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Road tunnel/Service/0",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Road tunnel",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_symbol",
                                8
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 13,
                        "layout": {
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": "#FFFFFF",
                            "line-opacity": 0.5,
                            "line-width": {
                                "base": 1.2,
                                "stops": [
                                    [
                                        13,
                                        0.75
                                    ],
                                    [
                                        14,
                                        1.3
                                    ],
                                    [
                                        18,
                                        3.3
                                    ],
                                    [
                                        22,
                                        10
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Road tunnel/Local/0",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Road tunnel",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_symbol",
                                7
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 12,
                        "layout": {
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": "#FFFFFF",
                            "line-opacity": 0.5,
                            "line-width": {
                                "base": 1.4,
                                "stops": [
                                    [
                                        11,
                                        1.1
                                    ],
                                    [
                                        14,
                                        2
                                    ],
                                    [
                                        16,
                                        4
                                    ],
                                    [
                                        18,
                                        15.3
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Road tunnel/Minor, ramp or traffic circle/0",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Road tunnel",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_symbol",
                                6
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 9,
                        "layout": {
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": "#FFFFFF",
                            "line-opacity": 0.5,
                            "line-width": {
                                "base": 1.2,
                                "stops": [
                                    [
                                        9.9,
                                        0.75
                                    ],
                                    [
                                        14,
                                        2
                                    ],
                                    [
                                        16,
                                        7.5
                                    ],
                                    [
                                        18,
                                        15.3
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Road tunnel/Minor/0",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Road tunnel",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_symbol",
                                5
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 10,
                        "layout": {
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": "#FFFFFF",
                            "line-opacity": 0.5,
                            "line-width": {
                                "base": 1.2,
                                "stops": [
                                    [
                                        10,
                                        1.3
                                    ],
                                    [
                                        14,
                                        3.5
                                    ],
                                    [
                                        16,
                                        7.5
                                    ],
                                    [
                                        18,
                                        15.3
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Road tunnel/Major, ramp or traffic circle/0",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Road tunnel",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_symbol",
                                4
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 9,
                        "layout": {
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": "#ffffff",
                            "line-opacity": 0.5,
                            "line-width": {
                                "base": 1.2,
                                "stops": [
                                    [
                                        9,
                                        1.3
                                    ],
                                    [
                                        14,
                                        5.3
                                    ],
                                    [
                                        16,
                                        8.3
                                    ],
                                    [
                                        18,
                                        16
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Road tunnel/Major/0",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Road tunnel",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_symbol",
                                3
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 8,
                        "layout": {
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": "#ffffff",
                            "line-opacity": 0.5,
                            "line-width": {
                                "base": 1.2,
                                "stops": [
                                    [
                                        8,
                                        1.3
                                    ],
                                    [
                                        14,
                                        5.3
                                    ],
                                    [
                                        16,
                                        8.3
                                    ],
                                    [
                                        18,
                                        16
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Road tunnel/Freeway Motorway, ramp or traffic circle/1",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Road tunnel",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_symbol",
                                2
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 6,
                        "layout": {
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": "#C2C2BE",
                            "line-opacity": 0.5,
                            "line-width": {
                                "base": 1.2,
                                "stops": [
                                    [
                                        9,
                                        0.3
                                    ],
                                    [
                                        14,
                                        6.3
                                    ],
                                    [
                                        16,
                                        12.3
                                    ],
                                    [
                                        18,
                                        28
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Road tunnel/Highway/1",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Road tunnel",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_symbol",
                                1
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 6,
                        "layout": {
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": "#C2C2BE",
                            "line-opacity": 0.5,
                            "line-width": {
                                "base": 1.2,
                                "stops": [
                                    [
                                        6,
                                        0.3
                                    ],
                                    [
                                        14,
                                        6.3
                                    ],
                                    [
                                        16,
                                        12.3
                                    ],
                                    [
                                        18,
                                        28
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Road tunnel/Freeway Motorway/1",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Road tunnel",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_symbol",
                                0
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 6,
                        "layout": {
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": "#C2C2BE",
                            "line-opacity": 0.5,
                            "line-width": {
                                "base": 1.2,
                                "stops": [
                                    [
                                        6,
                                        0.3
                                    ],
                                    [
                                        14,
                                        6.3
                                    ],
                                    [
                                        16,
                                        12.3
                                    ],
                                    [
                                        18,
                                        28
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Special area of interest/Gutter",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Special area of interest",
                        "filter": [
                            "==",
                            "_symbol",
                            9
                        ],
                        "minzoom": 14,
                        "layout": {},
                        "paint": {
                            "fill-color": "#eeefe8",
                            "fill-outline-color": "#E8E8E8"
                        }
                    },
                    {
                        "id": "Special area of interest/Curb",
                        "type": "fill",
                        "source": "esri",
                        "source-layer": "Special area of interest",
                        "filter": [
                            "==",
                            "_symbol",
                            3
                        ],
                        "minzoom": 14,
                        "layout": {},
                        "paint": {
                            "fill-color": "#eeefe8",
                            "fill-outline-color": "#CCCCCC"
                        }
                    },
                    {
                        "id": "Boundary line/Disputed admin2",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Boundary line",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_symbol",
                                8
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 9,
                        "layout": {
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": {
                                "stops": [
                                    [
                                        1,
                                        "#c8c8c8"
                                    ],
                                    [
                                        3,
                                        "#9C9C9C"
                                    ],
                                    [
                                        9,
                                        "#bf94bf"
                                    ]
                                ]
                            },
                            "line-width": {
                                "base": 1.2,
                                "stops": [
                                    [
                                        1,
                                        0.65
                                    ],
                                    [
                                        14,
                                        1.3
                                    ],
                                    [
                                        17,
                                        2.5
                                    ]
                                ]
                            },
                            "line-dasharray": [
                                6.0,
                                3.0
                            ]
                        }
                    },
                    {
                        "id": "Boundary line/Disputed admin1/1",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Boundary line",
                        "minzoom": 3,
                        "filter": [
                            "all",
                            [
                                "==",
                                "_symbol",
                                7
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "layout": {
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": "#FFFFFF",
                            "line-opacity": 0.95,
                            "line-width": {
                                "base": 1.0,
                                "stops": [
                                    [
                                        4,
                                        0.5
                                    ],
                                    [
                                        14,
                                        7
                                    ],
                                    [
                                        17,
                                        7
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Boundary line/Disputed admin0/1",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Boundary line",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_symbol",
                                6
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ],
                            [
                                "!in",
                                "DisputeID",
                                8,
                                16,
                                90,
                                96,
                                0
                            ]
                        ],
                        "minzoom": 1,
                        "layout": {
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": "#FFFFFF",
                            "line-opacity": 0.95,
                            "line-width": {
                                "base": 1.0,
                                "stops": [
                                    [
                                        1,
                                        0.5
                                    ],
                                    [
                                        14,
                                        9.3
                                    ],
                                    [
                                        17,
                                        9.3
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Boundary line/Disputed admin1/0",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Boundary line",
                        "minzoom": 3,
                        "filter": [
                            "all",
                            [
                                "==",
                                "_symbol",
                                7
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "layout": {
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": {
                                "stops": [
                                    [
                                        1,
                                        "#c8c8c8"
                                    ],
                                    [
                                        3,
                                        "#9C9C9C"
                                    ],
                                    [
                                        9,
                                        "#bf94bf"
                                    ]
                                ]
                            },
                            "line-width": {
                                "base": 1.2,
                                "stops": [
                                    [
                                        1,
                                        0.65
                                    ],
                                    [
                                        14,
                                        1.3
                                    ],
                                    [
                                        17,
                                        2.5
                                    ]
                                ]
                            },
                            "line-dasharray": [
                                7.0,
                                5.0
                            ]
                        }
                    },
                    {
                        "id": "Boundary line/Disputed admin0/0",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Boundary line",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_symbol",
                                6
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ],
                            [
                                "!in",
                                "DisputeID",
                                8,
                                16,
                                90,
                                96,
                                0
                            ]
                        ],
                        "minzoom": 1,
                        "layout": {
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": {
                                "stops": [
                                    [
                                        1,
                                        "#c8c8c8"
                                    ],
                                    [
                                        3,
                                        "#9C9C9C"
                                    ],
                                    [
                                        9,
                                        "#bf94bf"
                                    ]
                                ]
                            },
                            "line-width": {
                                "base": 1.2,
                                "stops": [
                                    [
                                        1,
                                        0.65
                                    ],
                                    [
                                        14,
                                        1.3
                                    ],
                                    [
                                        17,
                                        2.5
                                    ]
                                ]
                            },
                            "line-dasharray": [
                                7.0,
                                5.0
                            ]
                        }
                    },
                    {
                        "id": "Boundary line/Admin2/1",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Boundary line",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_symbol",
                                2
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 10,
                        "layout": {
                            "line-cap": "round",
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": "#f0ede5",
                            "line-opacity": 0.6,
                            "line-width": {
                                "base": 1.2,
                                "stops": [
                                    [
                                        8,
                                        1.3
                                    ],
                                    [
                                        14,
                                        2.5
                                    ],
                                    [
                                        17,
                                        2.5
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Boundary line/Admin1/1",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Boundary line",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_symbol",
                                1
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 3,
                        "layout": {
                            "line-cap": "round",
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": "#E3DBE3",
                            "line-width": {
                                "base": 1.0,
                                "stops": [
                                    [
                                        4,
                                        0.5
                                    ],
                                    [
                                        14,
                                        7
                                    ],
                                    [
                                        17,
                                        7
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Boundary line/Admin0/1",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Boundary line",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_symbol",
                                0
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 1,
                        "layout": {
                            "line-cap": "round",
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": "#DBCCDB",
                            "line-width": {
                                "base": 1.0,
                                "stops": [
                                    [
                                        1,
                                        0.5
                                    ],
                                    [
                                        14,
                                        9.3
                                    ],
                                    [
                                        17,
                                        9.3
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Boundary line/Admin5",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Boundary line",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_symbol",
                                5
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 16,
                        "layout": {
                            "line-cap": "round",
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": "#9C9C9C",
                            "line-width": {
                                "base": 1.2,
                                "stops": [
                                    [
                                        14,
                                        1
                                    ],
                                    [
                                        17,
                                        1
                                    ]
                                ]
                            },
                            "line-dasharray": [
                                6.5,
                                4
                            ]
                        }
                    },
                    {
                        "id": "Boundary line/Admin4",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Boundary line",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_symbol",
                                4
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 16,
                        "layout": {
                            "line-cap": "round",
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": "#9C9C9C",
                            "line-width": {
                                "base": 1.2,
                                "stops": [
                                    [
                                        14,
                                        1
                                    ],
                                    [
                                        17,
                                        1
                                    ]
                                ]
                            },
                            "line-dasharray": [
                                6.5,
                                4
                            ]
                        }
                    },
                    {
                        "id": "Boundary line/Admin3",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Boundary line",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_symbol",
                                3
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 16,
                        "layout": {
                            "line-cap": "round",
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": "#9C9C9C",
                            "line-width": {
                                "base": 1.2,
                                "stops": [
                                    [
                                        14,
                                        1
                                    ],
                                    [
                                        17,
                                        1
                                    ]
                                ]
                            },
                            "line-dasharray": [
                                6.5,
                                4
                            ]
                        }
                    },
                    {
                        "id": "Boundary line/Admin2/0",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Boundary line",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_symbol",
                                2
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 9,
                        "layout": {
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": "#717170",
                            "line-dasharray": [
                                9.3,
                                6.3
                            ],
                            "line-width": {
                                "base": 1.2,
                                "stops": [
                                    [
                                        8,
                                        0.5
                                    ],
                                    [
                                        14,
                                        1
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Boundary line/Admin1/0",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Boundary line",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_symbol",
                                1
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 3,
                        "layout": {
                            "line-cap": "round",
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": {
                                "stops": [
                                    [
                                        3,
                                        "#c8c8c8"
                                    ],
                                    [
                                        4,
                                        "#9C9C9C"
                                    ]
                                ]
                            },
                            "line-dasharray": [
                                7,
                                5.3
                            ],
                            "line-width": {
                                "base": 1.0,
                                "stops": [
                                    [
                                        4,
                                        0.3
                                    ],
                                    [
                                        14,
                                        1.3
                                    ],
                                    [
                                        17,
                                        1.3
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Boundary line/Admin0/0",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Boundary line",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_symbol",
                                0
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 1,
                        "layout": {
                            "line-cap": "round",
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": {
                                "stops": [
                                    [
                                        1,
                                        "#cccccc"
                                    ],
                                    [
                                        7,
                                        "#4e4e4e"
                                    ]
                                ]
                            },
                            "line-dasharray": [
                                7,
                                5.3
                            ],
                            "line-width": {
                                "base": 1.2,
                                "stops": [
                                    [
                                        1,
                                        0.5
                                    ],
                                    [
                                        14,
                                        1.3
                                    ],
                                    [
                                        17,
                                        1.3
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Coastline",
                        "type": "line",
                        "source": "esri",
                        "source-layer": "Coastline",
                        "maxzoom": 9,
                        "layout": {
                            "line-cap": "round",
                            "line-join": "round"
                        },
                        "paint": {
                            "line-color": {
                                "stops": [
                                    [
                                        0,
                                        "#afd9e8"
                                    ],
                                    [
                                        7,
                                        "#B9DFEC"
                                    ],
                                    [
                                        9,
                                        "#C6ECFF"
                                    ]
                                ]
                            },
                            "line-width": {
                                "base": 1.2,
                                "stops": [
                                    [
                                        0,
                                        0.5
                                    ],
                                    [
                                        9,
                                        1.3
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Tree/Elm",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Tree",
                        "filter": [
                            "==",
                            "_symbol",
                            0
                        ],
                        "minzoom": 16,
                        "layout": {
                            "symbol-avoid-edges": true,
                            "icon-image": "Tree/Elm",
                            "icon-allow-overlap": true,
                            "icon-padding": 1,
                            "icon-size": {
                                "stops": [
                                    [
                                        16,
                                        0.5
                                    ],
                                    [
                                        17,
                                        0.8
                                    ],
                                    [
                                        18,
                                        1
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "icon-opacity": {
                                "stops": [
                                    [
                                        16,
                                        0.25
                                    ],
                                    [
                                        18,
                                        0.5
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Tree/Eucalyptus",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Tree",
                        "filter": [
                            "==",
                            "_symbol",
                            1
                        ],
                        "minzoom": 16,
                        "layout": {
                            "symbol-avoid-edges": true,
                            "icon-image": "Tree/Eucalyptus",
                            "icon-allow-overlap": true,
                            "icon-padding": 1,
                            "icon-size": {
                                "stops": [
                                    [
                                        16,
                                        0.5
                                    ],
                                    [
                                        17,
                                        0.8
                                    ],
                                    [
                                        18,
                                        1
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "icon-opacity": 0.5
                        }
                    },
                    {
                        "id": "Tree/Maple",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Tree",
                        "filter": [
                            "==",
                            "_symbol",
                            2
                        ],
                        "minzoom": 16,
                        "layout": {
                            "symbol-avoid-edges": true,
                            "icon-image": "Tree/Maple",
                            "icon-allow-overlap": true,
                            "icon-padding": 1,
                            "icon-size": {
                                "stops": [
                                    [
                                        16,
                                        0.5
                                    ],
                                    [
                                        17,
                                        0.8
                                    ],
                                    [
                                        18,
                                        1
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "icon-opacity": {
                                "stops": [
                                    [
                                        16,
                                        0.25
                                    ],
                                    [
                                        18,
                                        0.5
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Tree/Oak",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Tree",
                        "filter": [
                            "==",
                            "_symbol",
                            3
                        ],
                        "minzoom": 16,
                        "layout": {
                            "symbol-avoid-edges": true,
                            "icon-image": "Tree/Oak",
                            "icon-allow-overlap": true,
                            "icon-padding": 1,
                            "icon-size": {
                                "stops": [
                                    [
                                        16,
                                        0.5
                                    ],
                                    [
                                        17,
                                        0.8
                                    ],
                                    [
                                        18,
                                        1
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "icon-opacity": {
                                "stops": [
                                    [
                                        16,
                                        0.25
                                    ],
                                    [
                                        18,
                                        0.5
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Tree/Orange",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Tree",
                        "filter": [
                            "==",
                            "_symbol",
                            4
                        ],
                        "minzoom": 16,
                        "layout": {
                            "symbol-avoid-edges": true,
                            "icon-image": "Tree/Orange",
                            "icon-allow-overlap": true,
                            "icon-padding": 1,
                            "icon-size": {
                                "stops": [
                                    [
                                        16,
                                        0.5
                                    ],
                                    [
                                        17,
                                        0.8
                                    ],
                                    [
                                        18,
                                        1
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "icon-opacity": {
                                "stops": [
                                    [
                                        16,
                                        0.25
                                    ],
                                    [
                                        18,
                                        0.5
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Tree/Palm",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Tree",
                        "filter": [
                            "==",
                            "_symbol",
                            5
                        ],
                        "minzoom": 16,
                        "layout": {
                            "symbol-avoid-edges": true,
                            "icon-image": "Tree/Palm",
                            "icon-allow-overlap": true,
                            "icon-padding": 1,
                            "icon-size": {
                                "stops": [
                                    [
                                        16,
                                        0.5
                                    ],
                                    [
                                        17,
                                        0.8
                                    ],
                                    [
                                        18,
                                        1
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "icon-opacity": {
                                "stops": [
                                    [
                                        16,
                                        0.25
                                    ],
                                    [
                                        18,
                                        0.5
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Tree/Pine",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Tree",
                        "filter": [
                            "==",
                            "_symbol",
                            6
                        ],
                        "minzoom": 16,
                        "layout": {
                            "symbol-avoid-edges": true,
                            "icon-image": "Tree/Pine",
                            "icon-allow-overlap": true,
                            "icon-padding": 1,
                            "icon-size": {
                                "stops": [
                                    [
                                        16,
                                        0.5
                                    ],
                                    [
                                        17,
                                        0.8
                                    ],
                                    [
                                        18,
                                        1
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "icon-opacity": {
                                "stops": [
                                    [
                                        16,
                                        0.25
                                    ],
                                    [
                                        18,
                                        0.5
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Tree/Spruce",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Tree",
                        "filter": [
                            "==",
                            "_symbol",
                            7
                        ],
                        "minzoom": 16,
                        "layout": {
                            "symbol-avoid-edges": true,
                            "icon-image": "Tree/Spruce",
                            "icon-allow-overlap": true,
                            "icon-padding": 1,
                            "icon-size": {
                                "stops": [
                                    [
                                        16,
                                        0.5
                                    ],
                                    [
                                        17,
                                        0.8
                                    ],
                                    [
                                        18,
                                        1
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "icon-opacity": {
                                "stops": [
                                    [
                                        16,
                                        0.25
                                    ],
                                    [
                                        18,
                                        0.5
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Shrub",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Shrub",
                        "minzoom": 16,
                        "layout": {
                            "symbol-avoid-edges": true,
                            "icon-image": "Shrub",
                            "icon-allow-overlap": true,
                            "icon-padding": 1,
                            "icon-size": {
                                "stops": [
                                    [
                                        16,
                                        0.5
                                    ],
                                    [
                                        17,
                                        1
                                    ],
                                    [
                                        18,
                                        1.5
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "icon-opacity": {
                                "stops": [
                                    [
                                        16,
                                        0.25
                                    ],
                                    [
                                        18,
                                        0.5
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Pavement marking/Arrow",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Pavement marking",
                        "minzoom": 17,
                        "filter": [
                            "==",
                            "_symbol",
                            0
                        ],
                        "layout": {
                            "icon-rotation-alignment": "map",
                            "icon-image": "Pavement marking/Arrow",
                            "icon-size": {
                                "stops": [
                                    [
                                        17,
                                        0.5
                                    ],
                                    [
                                        22,
                                        1
                                    ]
                                ]
                            },
                            "icon-rotate": {
                                "type": "identity",
                                "property": "angle",
                                "default": 0
                            },
                            "icon-allow-overlap": true
                        },
                        "paint": {
                            "icon-color": "#B2B2B2"
                        }
                    },
                    {
                        "id": "Pavement marking/Handicap",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Pavement marking",
                        "minzoom": 18,
                        "filter": [
                            "==",
                            "_symbol",
                            1
                        ],
                        "layout": {
                            "icon-rotation-alignment": "map",
                            "icon-image": "Pavement marking/Handicap",
                            "icon-size": {
                                "stops": [
                                    [
                                        18,
                                        0.5
                                    ],
                                    [
                                        20,
                                        1
                                    ],
                                    [
                                        22,
                                        1.25
                                    ]
                                ]
                            },
                            "icon-rotate": {
                                "type": "identity",
                                "property": "angle",
                                "default": 0
                            },
                            "icon-allow-overlap": true
                        },
                        "paint": {
                            "icon-color": "#296AA3",
                            "icon-opacity": {
                                "stops": [
                                    [
                                        18,
                                        0.65
                                    ],
                                    [
                                        20,
                                        1
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        "id": "Pavement marking/Left turn",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Pavement marking",
                        "minzoom": 17,
                        "filter": [
                            "==",
                            "_symbol",
                            2
                        ],
                        "layout": {
                            "icon-rotation-alignment": "map",
                            "icon-image": "Pavement marking/Left turn",
                            "icon-size": {
                                "stops": [
                                    [
                                        17,
                                        0.5
                                    ],
                                    [
                                        22,
                                        1
                                    ]
                                ]
                            },
                            "icon-rotate": {
                                "type": "identity",
                                "property": "angle",
                                "default": 0
                            },
                            "icon-allow-overlap": true
                        },
                        "paint": {
                            "icon-color": "#B2B2B2"
                        }
                    },
                    {
                        "id": "Pavement marking/Right turn",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Pavement marking",
                        "minzoom": 17,
                        "filter": [
                            "==",
                            "_symbol",
                            3
                        ],
                        "layout": {
                            "icon-rotation-alignment": "map",
                            "icon-image": "Pavement marking/Right turn",
                            "icon-size": {
                                "stops": [
                                    [
                                        17,
                                        0.5
                                    ],
                                    [
                                        22,
                                        1
                                    ]
                                ]
                            },
                            "icon-rotate": {
                                "type": "identity",
                                "property": "angle",
                                "default": 0
                            },
                            "icon-allow-overlap": true
                        },
                        "paint": {
                            "icon-color": "#B2B2B2"
                        }
                    },
                    {
                        "id": "Pavement marking/Two-way left turn",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Pavement marking",
                        "minzoom": 17,
                        "filter": [
                            "==",
                            "_symbol",
                            4
                        ],
                        "layout": {
                            "icon-rotation-alignment": "map",
                            "icon-image": "Pavement marking/Two-way left turn",
                            "icon-size": {
                                "stops": [
                                    [
                                        17,
                                        0.5
                                    ],
                                    [
                                        22,
                                        1
                                    ]
                                ]
                            },
                            "icon-rotate": {
                                "type": "identity",
                                "property": "angle",
                                "default": 0
                            },
                            "icon-allow-overlap": true
                        },
                        "paint": {
                            "icon-color": "#B2B2B2"
                        }
                    },
                    {
                        "id": "Pavement marking/U-turn",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Pavement marking",
                        "minzoom": 17,
                        "filter": [
                            "==",
                            "_symbol",
                            5
                        ],
                        "layout": {
                            "icon-rotation-alignment": "map",
                            "icon-image": "Pavement marking/U-turn",
                            "icon-size": {
                                "stops": [
                                    [
                                        17,
                                        0.5
                                    ],
                                    [
                                        22,
                                        1
                                    ]
                                ]
                            },
                            "icon-rotate": {
                                "type": "identity",
                                "property": "angle",
                                "default": 0
                            },
                            "icon-allow-overlap": true
                        },
                        "paint": {
                            "icon-color": "#B2B2B2"
                        }
                    },
                    {
                        "id": "Spot elevation",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Spot elevation",
                        "minzoom": 0,
                        "layout": {
                            "icon-image": "Spotheight",
                            "icon-padding": 1,
                            "icon-allow-overlap": true,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 9.5,
                            "text-anchor": "bottom-left",
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "text-allow-overlap": false,
                            "text-padding": 1,
                            "text-offset": [
                                0.31,
                                -0.2
                            ],
                            "text-justify": "left"
                        },
                        "paint": {
                            "text-color": "#4d4321",
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 1,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "Water point/Sea or ocean",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Water point",
                        "filter": [
                            "==",
                            "_label_class",
                            0
                        ],
                        "minzoom": 9,
                        "layout": {
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": {
                                "stops": [
                                    [
                                        9,
                                        8.5
                                    ],
                                    [
                                        15,
                                        15.5
                                    ]
                                ]
                            },
                            "text-anchor": "center",
                            "text-letter-spacing": 0.3,
                            "text-line-height": 1.6,
                            "text-max-width": 4,
                            "text-field": "{_name_zh_s}",
                            "text-allow-overlap": false,
                            "text-padding": 15
                        },
                        "paint": {
                            "text-color": "#00668C",
                            "text-halo-blur": 1,
                            "text-halo-color": "#FFFFFF",
                            "text-halo-width": 1
                        }
                    },
                    {
                        "id": "Water point/Island",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Water point",
                        "filter": [
                            "==",
                            "_label_class",
                            7
                        ],
                        "minzoom": 9,
                        "layout": {
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": {
                                "stops": [
                                    [
                                        9,
                                        8.5
                                    ],
                                    [
                                        15,
                                        10
                                    ]
                                ]
                            },
                            "text-anchor": "center",
                            "text-letter-spacing": 0.1,
                            "text-max-width": 4,
                            "text-field": "{_name_zh_s}",
                            "text-allow-overlap": false,
                            "text-padding": 15
                        },
                        "paint": {
                            "text-color": "#595959",
                            "text-halo-blur": 1,
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 1
                        }
                    },
                    {
                        "id": "Water point/Dam or weir",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Water point",
                        "filter": [
                            "==",
                            "_label_class",
                            5
                        ],
                        "minzoom": 9,
                        "layout": {
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": {
                                "stops": [
                                    [
                                        9,
                                        8.5
                                    ],
                                    [
                                        15,
                                        10
                                    ]
                                ]
                            },
                            "text-anchor": "center",
                            "text-letter-spacing": 0.1,
                            "text-max-width": 4,
                            "text-field": "{_name_zh_s}",
                            "text-allow-overlap": false,
                            "text-padding": 15
                        },
                        "paint": {
                            "text-color": "#262317",
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 0.7,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "Water point/Playa",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Water point",
                        "filter": [
                            "==",
                            "_label_class",
                            6
                        ],
                        "minzoom": 9,
                        "layout": {
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": {
                                "stops": [
                                    [
                                        9,
                                        8.5
                                    ],
                                    [
                                        15,
                                        10
                                    ]
                                ]
                            },
                            "text-anchor": "center",
                            "text-letter-spacing": 0.1,
                            "text-max-width": 4,
                            "text-field": "{_name_zh_s}",
                            "text-allow-overlap": false,
                            "text-padding": 15
                        },
                        "paint": {
                            "text-color": "#262317",
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 0.7,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "Water point/Canal or ditch",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Water point",
                        "filter": [
                            "==",
                            "_label_class",
                            4
                        ],
                        "minzoom": 9,
                        "layout": {
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": {
                                "stops": [
                                    [
                                        9,
                                        8.5
                                    ],
                                    [
                                        15,
                                        10
                                    ]
                                ]
                            },
                            "text-anchor": "center",
                            "text-letter-spacing": 0.13,
                            "text-max-width": 4,
                            "text-field": "{_name_zh_s}",
                            "text-allow-overlap": false,
                            "text-padding": 15
                        },
                        "paint": {
                            "text-color": "#00668C",
                            "text-halo-blur": 1,
                            "text-halo-color": "#FFFFFF",
                            "text-halo-width": 1
                        }
                    },
                    {
                        "id": "Water point/Stream or river",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Water point",
                        "filter": [
                            "==",
                            "_label_class",
                            3
                        ],
                        "minzoom": 9,
                        "layout": {
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": {
                                "stops": [
                                    [
                                        9,
                                        8.5
                                    ],
                                    [
                                        15,
                                        10
                                    ]
                                ]
                            },
                            "text-anchor": "center",
                            "text-letter-spacing": 0.1,
                            "text-max-width": 4,
                            "text-field": "{_name_zh_s}",
                            "text-allow-overlap": false,
                            "text-padding": 15
                        },
                        "paint": {
                            "text-color": "#3F88A7",
                            "text-halo-blur": 1,
                            "text-halo-color": "#FFFFFF",
                            "text-halo-width": 0.5
                        }
                    },
                    {
                        "id": "Water point/Lake or reservoir",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Water point",
                        "filter": [
                            "==",
                            "_label_class",
                            2
                        ],
                        "minzoom": 9,
                        "layout": {
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": {
                                "stops": [
                                    [
                                        9,
                                        8.5
                                    ],
                                    [
                                        15,
                                        10
                                    ]
                                ]
                            },
                            "text-anchor": "center",
                            "text-letter-spacing": 0.1,
                            "text-max-width": 4,
                            "text-field": "{_name_zh_s}",
                            "text-allow-overlap": false,
                            "text-padding": 15
                        },
                        "paint": {
                            "text-color": "#3F88A7",
                            "text-halo-blur": 1,
                            "text-halo-color": "#FFFFFF",
                            "text-halo-width": 0.5
                        }
                    },
                    {
                        "id": "Water point/Bay or inlet",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Water point",
                        "filter": [
                            "==",
                            "_label_class",
                            1
                        ],
                        "minzoom": 9,
                        "layout": {
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": {
                                "stops": [
                                    [
                                        9,
                                        8.5
                                    ],
                                    [
                                        15,
                                        10
                                    ]
                                ]
                            },
                            "text-anchor": "center",
                            "text-letter-spacing": 0.1,
                            "text-max-width": 4,
                            "text-field": "{_name_zh_s}",
                            "text-allow-overlap": false,
                            "text-padding": 15
                        },
                        "paint": {
                            "text-color": "#00668C",
                            "text-halo-blur": 1,
                            "text-halo-color": "#FFFFFF",
                            "text-halo-width": 1
                        }
                    },
                    {
                        "id": "Ferry/label/Ferry",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Ferry/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                0
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 12,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 9,
                            "text-letter-spacing": 0.05,
                            "text-max-width": 8,
                            "text-field": "{_name_local}",
                            "text-padding": 30
                        },
                        "paint": {
                            "text-color": "#34707e",
                            "text-halo-width": 1.2,
                            "text-halo-color": "#ffffff",
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "Water line/label/Default",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Water line/label",
                        "minzoom": 11,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 9.5,
                            "text-letter-spacing": 0.07,
                            "text-max-width": 8,
                            "text-max-angle": 35,
                            "text-field": "{_name_zh_s}",
                            "text-padding": 1,
                            "text-offset": [
                                0,
                                -0.5
                            ],
                            "symbol-spacing": 800
                        },
                        "paint": {
                            "text-color": "#3F88A7",
                            "text-halo-blur": 1,
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 0.5
                        }
                    },
                    {
                        "id": "Water line large scale/label/Default",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Water line large scale/label",
                        "minzoom": 7,
                        "maxzoom": 11,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 9.3,
                            "text-letter-spacing": 0.01,
                            "text-max-width": 8,
                            "text-max-angle": {
                                "stops": [
                                    [
                                        7,
                                        25
                                    ],
                                    [
                                        11,
                                        35
                                    ]
                                ]
                            },
                            "text-field": "{_name_zh_s}",
                            "text-padding": 1,
                            "text-offset": [
                                0,
                                -0.5
                            ],
                            "symbol-spacing": 800
                        },
                        "paint": {
                            "text-color": "#3F88A7",
                            "text-halo-blur": 1,
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 0.5
                        }
                    },
                    {
                        "id": "Water line medium scale/label/Default",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Water line medium scale/label",
                        "minzoom": 5,
                        "maxzoom": 7,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 9.3,
                            "text-letter-spacing": 0.1,
                            "text-max-width": 8,
                            "text-max-angle": {
                                "stops": [
                                    [
                                        5,
                                        15
                                    ],
                                    [
                                        6,
                                        25
                                    ]
                                ]
                            },
                            "text-field": "{_name_zh_s}",
                            "text-padding": 1,
                            "text-offset": [
                                0,
                                -0.5
                            ],
                            "symbol-spacing": 800
                        },
                        "paint": {
                            "text-color": "#3F88A7",
                            "text-halo-blur": 1,
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 1
                        }
                    },
                    {
                        "id": "Water line small scale/label/Default",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Water line small scale/label",
                        "minzoom": 4,
                        "maxzoom": 5,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 8.5,
                            "text-letter-spacing": 0.1,
                            "text-max-width": 8,
                            "text-max-angle": 18,
                            "text-field": "{_name_zh_s}",
                            "text-padding": 1,
                            "text-offset": [
                                0,
                                -0.5
                            ],
                            "symbol-spacing": 800
                        },
                        "paint": {
                            "text-color": "#3F88A7",
                            "text-halo-blur": 1,
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 1
                        }
                    },
                    {
                        "id": "Marine park/label/Default",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Marine park/label",
                        "minzoom": 11,
                        "layout": {
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 9.5,
                            "text-letter-spacing": 0.05,
                            "text-max-width": 8,
                            "text-field": "{_name_local}",
                            "text-allow-overlap": false,
                            "text-padding": 15,
                            "symbol-avoid-edges": true
                        },
                        "paint": {
                            "text-color": "#73AFBF"
                        }
                    },
                    {
                        "id": "Water area/label/Dam or weir",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Water area/label",
                        "filter": [
                            "==",
                            "_label_class",
                            8
                        ],
                        "minzoom": 11,
                        "layout": {
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 9.5,
                            "text-letter-spacing": 0.08,
                            "text-max-width": 8,
                            "text-field": "{_name_zh_s}",
                            "text-allow-overlap": false,
                            "text-padding": 15,
                            "symbol-avoid-edges": true
                        },
                        "paint": {
                            "text-color": "#262317",
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 0.7,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "Water area/label/Playa",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Water area/label",
                        "filter": [
                            "==",
                            "_label_class",
                            9
                        ],
                        "minzoom": 11,
                        "layout": {
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 9.5,
                            "text-letter-spacing": 0.08,
                            "text-max-width": 8,
                            "text-field": "{_name_zh_s}",
                            "text-allow-overlap": false,
                            "text-padding": 15,
                            "symbol-avoid-edges": true
                        },
                        "paint": {
                            "text-color": "#262317",
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 0.7,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "Water area/label/Canal or ditch",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Water area/label",
                        "filter": [
                            "==",
                            "_label_class",
                            2
                        ],
                        "minzoom": 11,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 1000,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 10.5,
                            "text-letter-spacing": 0.13,
                            "text-field": "{_name_zh_s}",
                            "text-padding": 15,
                            "symbol-avoid-edges": true,
                            "text-allow-overlap": false,
                            "text-max-width": 5
                        },
                        "paint": {
                            "text-color": "#00668C",
                            "text-halo-blur": 1,
                            "text-halo-color": "#FFFFFF",
                            "text-halo-width": 1
                        }
                    },
                    {
                        "id": "Water area/label/Small river",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Water area/label",
                        "filter": [
                            "==",
                            "_label_class",
                            7
                        ],
                        "minzoom": 11,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 1000,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 10.5,
                            "text-letter-spacing": 0.13,
                            "text-field": "{_name_zh_s}",
                            "text-padding": 15,
                            "symbol-avoid-edges": true,
                            "text-allow-overlap": false,
                            "text-max-width": 8
                        },
                        "paint": {
                            "text-color": "#00668C",
                            "text-halo-blur": 1,
                            "text-halo-color": "#FFFFFF",
                            "text-halo-width": 1
                        }
                    },
                    {
                        "id": "Water area/label/Large river",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Water area/label",
                        "filter": [
                            "==",
                            "_label_class",
                            4
                        ],
                        "minzoom": 11,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 1000,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 10.5,
                            "text-letter-spacing": 0.13,
                            "text-field": "{_name_zh_s}",
                            "text-padding": 15,
                            "symbol-avoid-edges": true,
                            "text-allow-overlap": false,
                            "text-max-width": 8
                        },
                        "paint": {
                            "text-color": "#00668C",
                            "text-halo-blur": 1,
                            "text-halo-color": "#FFFFFF",
                            "text-halo-width": 1
                        }
                    },
                    {
                        "id": "Water area/label/Small lake or reservoir",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Water area/label",
                        "filter": [
                            "==",
                            "_label_class",
                            6
                        ],
                        "minzoom": 11,
                        "layout": {
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 10.5,
                            "text-letter-spacing": 0.13,
                            "text-line-height": 1,
                            "text-max-width": 4,
                            "text-field": "{_name_zh_s}",
                            "text-allow-overlap": false,
                            "text-padding": 15,
                            "symbol-avoid-edges": true
                        },
                        "paint": {
                            "text-color": "#00668C",
                            "text-halo-blur": 1,
                            "text-halo-color": "#FFFFFF",
                            "text-halo-width": 1
                        }
                    },
                    {
                        "id": "Water area/label/Large lake or reservoir",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Water area/label",
                        "filter": [
                            "==",
                            "_label_class",
                            3
                        ],
                        "minzoom": 11,
                        "layout": {
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 10.5,
                            "text-letter-spacing": 0.13,
                            "text-line-height": 1.5,
                            "text-max-width": 4,
                            "text-field": "{_name_zh_s}",
                            "text-allow-overlap": false,
                            "text-padding": 15,
                            "symbol-avoid-edges": true
                        },
                        "paint": {
                            "text-color": "#00668C",
                            "text-halo-blur": 1,
                            "text-halo-color": "#FFFFFF",
                            "text-halo-width": 1
                        }
                    },
                    {
                        "id": "Water area/label/Bay or inlet",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Water area/label",
                        "filter": [
                            "==",
                            "_label_class",
                            1
                        ],
                        "minzoom": 11,
                        "layout": {
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 10.5,
                            "text-letter-spacing": 0.13,
                            "text-line-height": 1.5,
                            "text-max-width": 4,
                            "text-field": "{_name_zh_s}",
                            "text-allow-overlap": false,
                            "text-padding": 15,
                            "symbol-avoid-edges": true
                        },
                        "paint": {
                            "text-color": "#00668C",
                            "text-halo-blur": 1,
                            "text-halo-color": "#FFFFFF",
                            "text-halo-width": 1
                        }
                    },
                    {
                        "id": "Water area/label/Small island",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Water area/label",
                        "filter": [
                            "==",
                            "_label_class",
                            0
                        ],
                        "minzoom": 11,
                        "layout": {
                            "text-size": 10.5,
                            "text-letter-spacing": 0.1,
                            "text-max-width": 4,
                            "text-field": "{_name_zh_s}",
                            "text-allow-overlap": false,
                            "text-padding": 15,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ]
                        },
                        "paint": {
                            "text-color": "#595959",
                            "text-halo-blur": 1,
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 1
                        }
                    },
                    {
                        "id": "Water area/label/Large island",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Water area/label",
                        "filter": [
                            "==",
                            "_label_class",
                            5
                        ],
                        "minzoom": 11,
                        "layout": {
                            "text-size": 10.5,
                            "text-letter-spacing": 0.13,
                            "text-line-height": 1.5,
                            "text-max-width": 4,
                            "text-field": "{_name_zh_s}",
                            "text-allow-overlap": false,
                            "text-padding": 15,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ]
                        },
                        "paint": {
                            "text-color": "#595959",
                            "text-halo-blur": 1,
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 1
                        }
                    },
                    {
                        "id": "Water area large scale/label/River",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Water area large scale/label",
                        "filter": [
                            "==",
                            "_label_class",
                            1
                        ],
                        "minzoom": 7,
                        "maxzoom": 11,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 1000,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 9.3,
                            "text-letter-spacing": 0.1,
                            "text-field": "{_name_zh_s}",
                            "text-padding": 15,
                            "symbol-avoid-edges": true,
                            "text-allow-overlap": false,
                            "text-max-width": 4
                        },
                        "paint": {
                            "text-color": "#00668C",
                            "text-halo-blur": 1,
                            "text-halo-color": "#FFFFFF",
                            "text-halo-width": 1
                        }
                    },
                    {
                        "id": "Water area large scale/label/Lake or lake intermittent",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Water area large scale/label",
                        "filter": [
                            "==",
                            "_label_class",
                            0
                        ],
                        "minzoom": 7,
                        "maxzoom": 11,
                        "layout": {
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 9.3,
                            "text-letter-spacing": 0.1,
                            "text-max-width": 4,
                            "text-field": "{_name_zh_s}",
                            "text-allow-overlap": false,
                            "text-padding": 15,
                            "symbol-avoid-edges": true
                        },
                        "paint": {
                            "text-color": "#00668C",
                            "text-halo-blur": 1,
                            "text-halo-color": "#FFFFFF",
                            "text-halo-width": 1
                        }
                    },
                    {
                        "id": "Water area medium scale/label/Default",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Water area medium scale/label",
                        "minzoom": 5,
                        "maxzoom": 7,
                        "layout": {
                            "text-max-width": 4,
                            "text-field": "{_name_zh_s}",
                            "text-allow-overlap": false,
                            "text-padding": 15,
                            "symbol-avoid-edges": true,
                            "text-letter-spacing": 0.08,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 9.3
                        },
                        "paint": {
                            "text-color": "#00668C",
                            "text-halo-blur": 1,
                            "text-halo-color": "#FFFFFF",
                            "text-halo-width": 1
                        }
                    },
                    {
                        "id": "Water area small scale/label/Default",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Water area small scale/label",
                        "minzoom": 1,
                        "maxzoom": 5,
                        "layout": {
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 9.3,
                            "text-letter-spacing": 0.08,
                            "text-max-width": 4,
                            "text-field": "{_name_zh_s}",
                            "text-allow-overlap": false,
                            "text-padding": 15,
                            "symbol-avoid-edges": true
                        },
                        "paint": {
                            "text-color": "#00668C",
                            "text-halo-blur": 1,
                            "text-halo-color": "#FFFFFF",
                            "text-halo-width": 1
                        }
                    },
                    {
                        "id": "Marine area/label/Default",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Marine area/label",
                        "minzoom": 11,
                        "layout": {
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 10.5,
                            "text-letter-spacing": 0.13,
                            "text-line-height": 1.5,
                            "text-max-width": 4,
                            "text-field": "{_name_local}",
                            "text-allow-overlap": false,
                            "text-padding": 15,
                            "symbol-avoid-edges": true
                        },
                        "paint": {
                            "text-color": "#00668C",
                            "text-halo-blur": 1,
                            "text-halo-color": "#f2fcff",
                            "text-halo-width": 1
                        }
                    },
                    {
                        "id": "Marine waterbody/label/small",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Marine waterbody/label",
                        "filter": [
                            "==",
                            "_label_class",
                            4
                        ],
                        "minzoom": 1,
                        "maxzoom": 10,
                        "layout": {
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-letter-spacing": 0.12,
                            "text-line-height": 1.5,
                            "text-max-width": 6,
                            "text-field": "{_name_zh_s}",
                            "text-allow-overlap": false,
                            "text-padding": 15,
                            "symbol-avoid-edges": true,
                            "text-size": {
                                "stops": [
                                    [
                                        1,
                                        8
                                    ],
                                    [
                                        6,
                                        9.3
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": {
                                "stops": [
                                    [
                                        1,
                                        "#3385A3"
                                    ],
                                    [
                                        6,
                                        "#00668C"
                                    ]
                                ]
                            },
                            "text-halo-blur": 1,
                            "text-halo-color": "#f2fcff",
                            "text-halo-width": 0.5
                        }
                    },
                    {
                        "id": "Marine waterbody/label/medium",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Marine waterbody/label",
                        "filter": [
                            "==",
                            "_label_class",
                            3
                        ],
                        "minzoom": 1,
                        "maxzoom": 10,
                        "layout": {
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-letter-spacing": 0.15,
                            "text-line-height": 1.5,
                            "text-max-width": 6,
                            "text-field": "{_name_zh_s}",
                            "text-allow-overlap": false,
                            "text-padding": 15,
                            "symbol-avoid-edges": true,
                            "text-size": {
                                "stops": [
                                    [
                                        1,
                                        8
                                    ],
                                    [
                                        6,
                                        9.3
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": {
                                "stops": [
                                    [
                                        1,
                                        "#3385A3"
                                    ],
                                    [
                                        6,
                                        "#00668C"
                                    ]
                                ]
                            },
                            "text-halo-blur": 1,
                            "text-halo-color": "#f2fcff",
                            "text-halo-width": 0.5
                        }
                    },
                    {
                        "id": "Marine waterbody/label/large",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Marine waterbody/label",
                        "filter": [
                            "==",
                            "_label_class",
                            2
                        ],
                        "minzoom": 1,
                        "maxzoom": 10,
                        "layout": {
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-letter-spacing": 0.18,
                            "text-line-height": 1.5,
                            "text-max-width": 6,
                            "text-field": "{_name_zh_s}",
                            "text-allow-overlap": false,
                            "text-padding": 15,
                            "symbol-avoid-edges": true,
                            "text-size": {
                                "stops": [
                                    [
                                        1,
                                        8
                                    ],
                                    [
                                        6,
                                        10
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": {
                                "stops": [
                                    [
                                        1,
                                        "#3385A3"
                                    ],
                                    [
                                        6,
                                        "#00668C"
                                    ]
                                ]
                            },
                            "text-halo-blur": 1,
                            "text-halo-color": "#f2fcff",
                            "text-halo-width": 0.5
                        }
                    },
                    {
                        "id": "Marine waterbody/label/x large",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Marine waterbody/label",
                        "filter": [
                            "==",
                            "_label_class",
                            1
                        ],
                        "minzoom": 1,
                        "maxzoom": 10,
                        "layout": {
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-letter-spacing": 0.2,
                            "text-line-height": 1.5,
                            "text-max-width": 6,
                            "text-field": "{_name_zh_s}",
                            "text-allow-overlap": false,
                            "text-padding": 15,
                            "symbol-avoid-edges": true,
                            "text-size": {
                                "stops": [
                                    [
                                        1,
                                        8
                                    ],
                                    [
                                        6,
                                        11
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": {
                                "stops": [
                                    [
                                        1,
                                        "#3385A3"
                                    ],
                                    [
                                        6,
                                        "#00668C"
                                    ]
                                ]
                            },
                            "text-halo-blur": 1,
                            "text-halo-color": "#f2fcff",
                            "text-halo-width": 0.5
                        }
                    },
                    {
                        "id": "Marine waterbody/label/2x large",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Marine waterbody/label",
                        "filter": [
                            "==",
                            "_label_class",
                            0
                        ],
                        "minzoom": 1,
                        "maxzoom": 10,
                        "layout": {
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-letter-spacing": 0.3,
                            "text-line-height": 1.6,
                            "text-max-width": 6,
                            "text-field": "{_name_zh_s}",
                            "text-allow-overlap": false,
                            "text-padding": 15,
                            "symbol-avoid-edges": true,
                            "text-size": {
                                "stops": [
                                    [
                                        1,
                                        9.3
                                    ],
                                    [
                                        4,
                                        12
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#00668C",
                            "text-halo-blur": 1,
                            "text-halo-color": "#f2fcff",
                            "text-halo-width": 0.5
                        }
                    },
                    {
                        "id": "Ferry/label/Rail ferry",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Ferry/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                1
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 12,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 9,
                            "text-letter-spacing": 0.1,
                            "text-max-width": 8,
                            "text-field": "{_name_local}",
                            "text-padding": 5,
                            "text-offset": [
                                0,
                                -0.6
                            ],
                            "symbol-spacing": 1000
                        },
                        "paint": {
                            "text-color": "#4E4E4E",
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 1
                        }
                    },
                    {
                        "id": "Railroad/label/Default",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Railroad/label",
                        "minzoom": 14,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 9,
                            "text-letter-spacing": 0.1,
                            "text-max-width": 8,
                            "text-field": "{_name_local}",
                            "text-padding": 5,
                            "text-offset": [
                                0,
                                -0.6
                            ],
                            "symbol-spacing": 1000
                        },
                        "paint": {
                            "text-color": "#4E4E4E",
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 1
                        }
                    },
                    {
                        "id": "Trail or path/label/Default",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Trail or path/label",
                        "minzoom": 15,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-avoid-edges": true,
                            "symbol-spacing": 400,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 9.3,
                            "text-letter-spacing": 0.05,
                            "text-max-width": 8,
                            "text-field": "{_name_local}",
                            "text-padding": 5
                        },
                        "paint": {
                            "text-color": "#595959",
                            "text-halo-color": "#FFFFFF",
                            "text-halo-width": 1
                        }
                    },
                    {
                        "id": "Road tunnel/label/Pedestrian",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road tunnel/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                6
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 15,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-avoid-edges": true,
                            "symbol-spacing": 400,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 9.3,
                            "text-letter-spacing": 0.05,
                            "text-max-width": 8,
                            "text-field": "{_name_local}",
                            "text-padding": 5
                        },
                        "paint": {
                            "text-color": "#595959",
                            "text-halo-color": "#FFFFFF",
                            "text-halo-width": 1,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "Road tunnel/label/Local, service, 4WD",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road tunnel/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                5
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 12,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-avoid-edges": true,
                            "symbol-spacing": 400,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 9.5,
                            "text-letter-spacing": 0.09,
                            "text-max-width": 8,
                            "text-field": "{_name_local}",
                            "text-padding": {
                                "stops": [
                                    [
                                        12,
                                        5
                                    ],
                                    [
                                        15,
                                        5
                                    ],
                                    [
                                        16,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#595959",
                            "text-halo-color": "#FFFFFF",
                            "text-halo-width": 1,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "Road tunnel/label/Minor",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road tunnel/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                4
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 10,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-avoid-edges": true,
                            "symbol-spacing": 400,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 9.5,
                            "text-letter-spacing": 0.09,
                            "text-max-width": 8,
                            "text-field": "{_name_local}",
                            "text-padding": {
                                "stops": [
                                    [
                                        10,
                                        5
                                    ],
                                    [
                                        15,
                                        5
                                    ],
                                    [
                                        16,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#595959",
                            "text-halo-color": "#FFFFFF",
                            "text-halo-width": 1,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "Road tunnel/label/Major, alt name",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road tunnel/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                3
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 10,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-avoid-edges": true,
                            "symbol-spacing": 400,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": {
                                "stops": [
                                    [
                                        10,
                                        9.5
                                    ],
                                    [
                                        14,
                                        10.5
                                    ]
                                ]
                            },
                            "text-letter-spacing": 0.09,
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "text-padding": {
                                "stops": [
                                    [
                                        10,
                                        5
                                    ],
                                    [
                                        15,
                                        5
                                    ],
                                    [
                                        16,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#4e4e4e",
                            "text-halo-color": "#FFFFFF",
                            "text-halo-width": 1,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "Road tunnel/label/Major",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road tunnel/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                2
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 10,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-avoid-edges": true,
                            "symbol-spacing": 400,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": {
                                "stops": [
                                    [
                                        10,
                                        9.5
                                    ],
                                    [
                                        14,
                                        10.5
                                    ]
                                ]
                            },
                            "text-letter-spacing": 0.09,
                            "text-max-width": 8,
                            "text-field": "{_name_local}",
                            "text-padding": {
                                "stops": [
                                    [
                                        10,
                                        5
                                    ],
                                    [
                                        15,
                                        5
                                    ],
                                    [
                                        16,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#4E4E4E",
                            "text-halo-color": "#FFFFFF",
                            "text-halo-width": 1,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "Road tunnel/label/Highway",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road tunnel/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                7
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 10,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-avoid-edges": true,
                            "symbol-spacing": 400,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": {
                                "stops": [
                                    [
                                        10,
                                        9.5
                                    ],
                                    [
                                        14,
                                        10.5
                                    ]
                                ]
                            },
                            "text-letter-spacing": 0.09,
                            "text-max-width": 8,
                            "text-field": "{_name_local}",
                            "text-padding": {
                                "stops": [
                                    [
                                        10,
                                        5
                                    ],
                                    [
                                        15,
                                        5
                                    ],
                                    [
                                        16,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#4E4E4E",
                            "text-halo-color": "#FFFFFF",
                            "text-halo-width": 1,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "Road tunnel/label/Freeway Motorway, alt name",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road tunnel/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                1
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 10,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-avoid-edges": true,
                            "symbol-spacing": 400,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": {
                                "stops": [
                                    [
                                        10,
                                        9.5
                                    ],
                                    [
                                        14,
                                        10.5
                                    ]
                                ]
                            },
                            "text-letter-spacing": 0.09,
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "text-padding": {
                                "stops": [
                                    [
                                        10,
                                        5
                                    ],
                                    [
                                        15,
                                        5
                                    ],
                                    [
                                        16,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#4E4E4E",
                            "text-halo-color": "#FFFFFF",
                            "text-halo-width": 1,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "Road tunnel/label/Freeway Motorway",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road tunnel/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                0
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 10,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-avoid-edges": true,
                            "symbol-spacing": 400,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": {
                                "stops": [
                                    [
                                        10,
                                        9.5
                                    ],
                                    [
                                        14,
                                        10.5
                                    ]
                                ]
                            },
                            "text-letter-spacing": 0.09,
                            "text-max-width": 8,
                            "text-field": "{_name_local}",
                            "text-padding": {
                                "stops": [
                                    [
                                        10,
                                        5
                                    ],
                                    [
                                        15,
                                        5
                                    ],
                                    [
                                        16,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#4E4E4E",
                            "text-halo-color": "#FFFFFF",
                            "text-halo-width": 1,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "Road/label/Major, alt name",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                3
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 10,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-avoid-edges": true,
                            "symbol-spacing": 400,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": {
                                "stops": [
                                    [
                                        10,
                                        9.5
                                    ],
                                    [
                                        14,
                                        10.5
                                    ]
                                ]
                            },
                            "text-letter-spacing": 0.09,
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "text-padding": {
                                "stops": [
                                    [
                                        10,
                                        5
                                    ],
                                    [
                                        15,
                                        5
                                    ],
                                    [
                                        16,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#4E4E4E",
                            "text-halo-color": "#FFFFFF",
                            "text-halo-width": 1
                        }
                    },
                    {
                        "id": "Road/label/Major",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                2
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 10,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-avoid-edges": true,
                            "symbol-spacing": 400,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": {
                                "stops": [
                                    [
                                        10,
                                        9.5
                                    ],
                                    [
                                        14,
                                        10.5
                                    ]
                                ]
                            },
                            "text-letter-spacing": 0.09,
                            "text-max-width": 8,
                            "text-field": "{_name_local}",
                            "text-padding": {
                                "stops": [
                                    [
                                        10,
                                        5
                                    ],
                                    [
                                        15,
                                        5
                                    ],
                                    [
                                        16,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#4E4E4E",
                            "text-halo-color": "#FFFFFF",
                            "text-halo-width": 1
                        }
                    },
                    {
                        "id": "Road/label/Highway",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                75
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 10,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-avoid-edges": true,
                            "symbol-spacing": 400,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": {
                                "stops": [
                                    [
                                        10,
                                        9.5
                                    ],
                                    [
                                        14,
                                        10.5
                                    ]
                                ]
                            },
                            "text-letter-spacing": 0.09,
                            "text-max-width": 8,
                            "text-field": "{_name_local}",
                            "text-padding": {
                                "stops": [
                                    [
                                        10,
                                        5
                                    ],
                                    [
                                        15,
                                        5
                                    ],
                                    [
                                        16,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#4E4E4E",
                            "text-halo-color": "#FFFFFF",
                            "text-halo-width": 1
                        }
                    },
                    {
                        "id": "Road/label/Freeway Motorway, alt name",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                1
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 10,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-avoid-edges": true,
                            "symbol-spacing": 400,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": {
                                "stops": [
                                    [
                                        10,
                                        9.5
                                    ],
                                    [
                                        14,
                                        10.5
                                    ]
                                ]
                            },
                            "text-letter-spacing": 0.09,
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "text-padding": {
                                "stops": [
                                    [
                                        10,
                                        5
                                    ],
                                    [
                                        15,
                                        5
                                    ],
                                    [
                                        16,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#4E4E4E",
                            "text-halo-color": "#FFFFFF",
                            "text-halo-width": 1
                        }
                    },
                    {
                        "id": "Road/label/Freeway Motorway",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                0
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 10,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-avoid-edges": true,
                            "symbol-spacing": 400,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": {
                                "stops": [
                                    [
                                        10,
                                        9.5
                                    ],
                                    [
                                        14,
                                        10.5
                                    ]
                                ]
                            },
                            "text-letter-spacing": 0.09,
                            "text-max-width": 8,
                            "text-field": "{_name_local}",
                            "text-padding": {
                                "stops": [
                                    [
                                        10,
                                        5
                                    ],
                                    [
                                        15,
                                        5
                                    ],
                                    [
                                        16,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#4E4E4E",
                            "text-halo-color": "#FFFFFF",
                            "text-halo-width": 1
                        }
                    },
                    {
                        "id": "Road/label/Rectangle white black (Alt)",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                32
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 7,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 400,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 9.3,
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "icon-image": "Road/Rectangle white black (Alt)/{_len}",
                            "icon-rotation-alignment": "viewport",
                            "text-rotation-alignment": "viewport",
                            "text-offset": [
                                0,
                                0
                            ],
                            "text-padding": {
                                "stops": [
                                    [
                                        7,
                                        50
                                    ],
                                    [
                                        10,
                                        50
                                    ],
                                    [
                                        11,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000"
                        }
                    },
                    {
                        "id": "Road/label/Rectangle white black",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                31
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 7,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 400,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 9.3,
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "icon-image": "Road/Rectangle white black/{_len}",
                            "icon-rotation-alignment": "viewport",
                            "text-rotation-alignment": "viewport",
                            "text-offset": [
                                0,
                                0
                            ],
                            "text-padding": {
                                "stops": [
                                    [
                                        7,
                                        50
                                    ],
                                    [
                                        10,
                                        50
                                    ],
                                    [
                                        11,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000"
                        }
                    },
                    {
                        "id": "Road/label/Secondary Hwy red white (Alt)",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                16
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 7,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 400,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 8.5,
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "icon-image": "Road/Secondary Hwy red white (Alt)/{_len}",
                            "icon-rotation-alignment": "viewport",
                            "text-rotation-alignment": "viewport",
                            "text-offset": [
                                0,
                                0
                            ],
                            "text-padding": {
                                "stops": [
                                    [
                                        7,
                                        50
                                    ],
                                    [
                                        10,
                                        50
                                    ],
                                    [
                                        11,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000"
                        }
                    },
                    {
                        "id": "Road/label/Secondary Hwy red white",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                15
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 7,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 400,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 8.5,
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "icon-image": "Road/Secondary Hwy red white/{_len}",
                            "icon-rotation-alignment": "viewport",
                            "text-rotation-alignment": "viewport",
                            "text-offset": [
                                0,
                                0
                            ],
                            "text-padding": {
                                "stops": [
                                    [
                                        7,
                                        50
                                    ],
                                    [
                                        10,
                                        50
                                    ],
                                    [
                                        11,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000"
                        }
                    },
                    {
                        "id": "Road/label/U-shaped yellow black (Alt)",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                24
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 7,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 400,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 8.5,
                            "text-letter-spacing": 0.05,
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "icon-image": "Road/U-shaped yellow black (Alt)/{_len}",
                            "icon-rotation-alignment": "viewport",
                            "text-rotation-alignment": "viewport",
                            "text-offset": [
                                0,
                                0
                            ],
                            "text-padding": {
                                "stops": [
                                    [
                                        7,
                                        50
                                    ],
                                    [
                                        10,
                                        50
                                    ],
                                    [
                                        11,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000"
                        }
                    },
                    {
                        "id": "Road/label/U-shaped yellow black",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                23
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 7,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 400,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 8.5,
                            "text-letter-spacing": 0.05,
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "icon-image": "Road/U-shaped yellow black/{_len}",
                            "icon-rotation-alignment": "viewport",
                            "text-rotation-alignment": "viewport",
                            "text-offset": [
                                0,
                                0
                            ],
                            "text-padding": {
                                "stops": [
                                    [
                                        7,
                                        50
                                    ],
                                    [
                                        10,
                                        50
                                    ],
                                    [
                                        11,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000"
                        }
                    },
                    {
                        "id": "Road/label/U-shaped red white (Alt)",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                26
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 7,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 400,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 8.5,
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "icon-image": "Road/U-shaped red white (Alt)/{_len}",
                            "icon-rotation-alignment": "viewport",
                            "text-rotation-alignment": "viewport",
                            "text-offset": [
                                0,
                                0
                            ],
                            "text-padding": {
                                "stops": [
                                    [
                                        7,
                                        50
                                    ],
                                    [
                                        10,
                                        50
                                    ],
                                    [
                                        11,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000"
                        }
                    },
                    {
                        "id": "Road/label/U-shaped red white",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                25
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 7,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 400,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 8.5,
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "icon-image": "Road/U-shaped red white/{_len}",
                            "icon-rotation-alignment": "viewport",
                            "text-rotation-alignment": "viewport",
                            "text-offset": [
                                0,
                                0
                            ],
                            "text-padding": {
                                "stops": [
                                    [
                                        7,
                                        50
                                    ],
                                    [
                                        10,
                                        50
                                    ],
                                    [
                                        11,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000"
                        }
                    },
                    {
                        "id": "Road/label/U-shaped blue white (Alt)",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                28
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 7,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 400,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 8.5,
                            "text-letter-spacing": 0.05,
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "icon-image": "Road/U-shaped blue white (Alt)/{_len}",
                            "icon-rotation-alignment": "viewport",
                            "text-rotation-alignment": "viewport",
                            "text-offset": [
                                0,
                                0
                            ],
                            "text-padding": {
                                "stops": [
                                    [
                                        7,
                                        50
                                    ],
                                    [
                                        10,
                                        50
                                    ],
                                    [
                                        11,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000"
                        }
                    },
                    {
                        "id": "Road/label/U-shaped blue white",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                27
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 7,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 400,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 8.5,
                            "text-letter-spacing": 0.05,
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "icon-image": "Road/U-shaped blue white/{_len}",
                            "icon-rotation-alignment": "viewport",
                            "text-rotation-alignment": "viewport",
                            "text-offset": [
                                0,
                                0
                            ],
                            "text-padding": {
                                "stops": [
                                    [
                                        7,
                                        50
                                    ],
                                    [
                                        10,
                                        50
                                    ],
                                    [
                                        11,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000"
                        }
                    },
                    {
                        "id": "Road/label/V-shaped white black (Alt)",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                30
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 7,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 400,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 8.5,
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "icon-image": "Road/V-shaped white black (Alt)/{_len}",
                            "icon-rotation-alignment": "viewport",
                            "text-rotation-alignment": "viewport",
                            "text-offset": [
                                0,
                                0
                            ],
                            "text-padding": {
                                "stops": [
                                    [
                                        7,
                                        50
                                    ],
                                    [
                                        10,
                                        50
                                    ],
                                    [
                                        11,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000"
                        }
                    },
                    {
                        "id": "Road/label/V-shaped white black",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                29
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 7,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 400,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 8.5,
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "icon-image": "Road/V-shaped white black/{_len}",
                            "icon-rotation-alignment": "viewport",
                            "text-rotation-alignment": "viewport",
                            "text-offset": [
                                0,
                                0
                            ],
                            "text-padding": {
                                "stops": [
                                    [
                                        7,
                                        50
                                    ],
                                    [
                                        10,
                                        50
                                    ],
                                    [
                                        11,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000"
                        }
                    },
                    {
                        "id": "Road/label/U-shaped white black (Alt)",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                18
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 7,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 400,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 8.5,
                            "text-letter-spacing": 0.05,
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "icon-image": "Road/U-shaped white black (Alt)/{_len}",
                            "icon-rotation-alignment": "viewport",
                            "text-rotation-alignment": "viewport",
                            "text-offset": [
                                0,
                                0
                            ],
                            "text-padding": {
                                "stops": [
                                    [
                                        7,
                                        50
                                    ],
                                    [
                                        10,
                                        50
                                    ],
                                    [
                                        11,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000"
                        }
                    },
                    {
                        "id": "Road/label/U-shaped white black",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                17
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 7,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 400,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 8.5,
                            "text-letter-spacing": 0.05,
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "icon-image": "Road/U-shaped white black/{_len}",
                            "icon-rotation-alignment": "viewport",
                            "text-rotation-alignment": "viewport",
                            "text-offset": [
                                0,
                                0
                            ],
                            "text-padding": {
                                "stops": [
                                    [
                                        7,
                                        50
                                    ],
                                    [
                                        10,
                                        50
                                    ],
                                    [
                                        11,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000"
                        }
                    },
                    {
                        "id": "Road/label/U-shaped white green (Alt)",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                20
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 7,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 400,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 8.5,
                            "text-letter-spacing": 0.05,
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "icon-image": "Road/U-shaped white green (Alt)/{_len}",
                            "icon-rotation-alignment": "viewport",
                            "text-rotation-alignment": "viewport",
                            "text-offset": [
                                0,
                                0
                            ],
                            "text-padding": {
                                "stops": [
                                    [
                                        7,
                                        50
                                    ],
                                    [
                                        10,
                                        50
                                    ],
                                    [
                                        11,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000"
                        }
                    },
                    {
                        "id": "Road/label/U-shaped white green",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                19
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 7,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 400,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 8.5,
                            "text-letter-spacing": 0.05,
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "icon-image": "Road/U-shaped white green/{_len}",
                            "icon-rotation-alignment": "viewport",
                            "text-rotation-alignment": "viewport",
                            "text-offset": [
                                0,
                                0
                            ],
                            "text-padding": {
                                "stops": [
                                    [
                                        7,
                                        50
                                    ],
                                    [
                                        10,
                                        50
                                    ],
                                    [
                                        11,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000"
                        }
                    },
                    {
                        "id": "Road/label/U-shaped green leaf (Alt)",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                22
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 7,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 400,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 8.5,
                            "text-letter-spacing": 0.05,
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "icon-image": "Road/U-shaped green leaf (Alt)/{_len}",
                            "icon-rotation-alignment": "viewport",
                            "text-rotation-alignment": "viewport",
                            "text-offset": [
                                0,
                                0
                            ],
                            "text-padding": {
                                "stops": [
                                    [
                                        7,
                                        50
                                    ],
                                    [
                                        10,
                                        50
                                    ],
                                    [
                                        11,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000"
                        }
                    },
                    {
                        "id": "Road/label/U-shaped green leaf",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                21
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 7,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 400,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 8.5,
                            "text-letter-spacing": 0.05,
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "icon-image": "Road/U-shaped green leaf/{_len}",
                            "icon-rotation-alignment": "viewport",
                            "text-rotation-alignment": "viewport",
                            "text-offset": [
                                0,
                                0
                            ],
                            "text-padding": {
                                "stops": [
                                    [
                                        7,
                                        50
                                    ],
                                    [
                                        10,
                                        50
                                    ],
                                    [
                                        11,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000"
                        }
                    },
                    {
                        "id": "Road/label/Rectangle yellow black (Alt)",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                38
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 7,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 400,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 8.5,
                            "text-letter-spacing": 0.05,
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "icon-image": "Road/Rectangle yellow black (Alt)/{_len}",
                            "icon-rotation-alignment": "viewport",
                            "text-rotation-alignment": "viewport",
                            "text-offset": [
                                0,
                                0
                            ],
                            "text-padding": {
                                "stops": [
                                    [
                                        7,
                                        50
                                    ],
                                    [
                                        10,
                                        50
                                    ],
                                    [
                                        11,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000"
                        }
                    },
                    {
                        "id": "Road/label/Rectangle yellow black",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                37
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 7,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 400,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 8.5,
                            "text-letter-spacing": 0.05,
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "icon-image": "Road/Rectangle yellow black/{_len}",
                            "icon-rotation-alignment": "viewport",
                            "text-rotation-alignment": "viewport",
                            "text-offset": [
                                0,
                                0
                            ],
                            "text-padding": {
                                "stops": [
                                    [
                                        7,
                                        50
                                    ],
                                    [
                                        10,
                                        50
                                    ],
                                    [
                                        11,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000"
                        }
                    },
                    {
                        "id": "Road/label/Rectangle red white (Alt)",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                36
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 7,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 400,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 8.5,
                            "text-letter-spacing": 0.05,
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "icon-image": "Road/Rectangle red white (Alt)/{_len}",
                            "icon-rotation-alignment": "viewport",
                            "text-rotation-alignment": "viewport",
                            "text-offset": [
                                0,
                                0
                            ],
                            "text-padding": {
                                "stops": [
                                    [
                                        7,
                                        50
                                    ],
                                    [
                                        10,
                                        50
                                    ],
                                    [
                                        11,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000"
                        }
                    },
                    {
                        "id": "Road/label/Rectangle red white",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                35
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 7,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 400,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 8.5,
                            "text-letter-spacing": 0.05,
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "icon-image": "Road/Rectangle red white/{_len}",
                            "icon-rotation-alignment": "viewport",
                            "text-rotation-alignment": "viewport",
                            "text-offset": [
                                0,
                                0
                            ],
                            "text-padding": {
                                "stops": [
                                    [
                                        7,
                                        50
                                    ],
                                    [
                                        10,
                                        50
                                    ],
                                    [
                                        11,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000"
                        }
                    },
                    {
                        "id": "Road/label/Rectangle blue white (Alt)",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                34
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 7,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 400,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 8.5,
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "icon-image": "Road/Rectangle blue white (Alt)/{_len}",
                            "icon-rotation-alignment": "viewport",
                            "text-rotation-alignment": "viewport",
                            "text-offset": [
                                0,
                                0
                            ],
                            "text-padding": {
                                "stops": [
                                    [
                                        7,
                                        50
                                    ],
                                    [
                                        10,
                                        50
                                    ],
                                    [
                                        11,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000"
                        }
                    },
                    {
                        "id": "Road/label/Rectangle blue white",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                33
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 7,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 400,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 8.5,
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "icon-image": "Road/Rectangle blue white/{_len}",
                            "icon-rotation-alignment": "viewport",
                            "text-rotation-alignment": "viewport",
                            "text-offset": [
                                0,
                                0
                            ],
                            "text-padding": {
                                "stops": [
                                    [
                                        7,
                                        50
                                    ],
                                    [
                                        10,
                                        50
                                    ],
                                    [
                                        11,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000"
                        }
                    },
                    {
                        "id": "Road/label/Rectangle green white (Alt)",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                40
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 7,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 400,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 8.5,
                            "text-letter-spacing": 0.05,
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "icon-image": "Road/Rectangle green white (Alt)/{_len}",
                            "icon-rotation-alignment": "viewport",
                            "text-rotation-alignment": "viewport",
                            "text-offset": [
                                0,
                                0
                            ],
                            "text-padding": {
                                "stops": [
                                    [
                                        7,
                                        50
                                    ],
                                    [
                                        10,
                                        50
                                    ],
                                    [
                                        11,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000"
                        }
                    },
                    {
                        "id": "Road/label/Rectangle green white",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                39
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 7,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 400,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 8.5,
                            "text-letter-spacing": 0.05,
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "icon-image": "Road/Rectangle green white/{_len}",
                            "icon-rotation-alignment": "viewport",
                            "text-rotation-alignment": "viewport",
                            "text-offset": [
                                0,
                                0
                            ],
                            "text-padding": {
                                "stops": [
                                    [
                                        7,
                                        50
                                    ],
                                    [
                                        10,
                                        50
                                    ],
                                    [
                                        11,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000"
                        }
                    },
                    {
                        "id": "Road/label/Rectangle green yellow (Alt)",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                42
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 7,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 400,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 8.5,
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "icon-image": "Road/Rectangle green yellow (Alt)/{_len}",
                            "icon-rotation-alignment": "viewport",
                            "text-rotation-alignment": "viewport",
                            "text-offset": [
                                0,
                                0
                            ],
                            "text-padding": {
                                "stops": [
                                    [
                                        7,
                                        50
                                    ],
                                    [
                                        10,
                                        50
                                    ],
                                    [
                                        11,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000"
                        }
                    },
                    {
                        "id": "Road/label/Rectangle green yellow",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                41
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 7,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 400,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 8.5,
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "icon-image": "Road/Rectangle green yellow/{_len}",
                            "icon-rotation-alignment": "viewport",
                            "text-rotation-alignment": "viewport",
                            "text-offset": [
                                0,
                                0
                            ],
                            "text-padding": {
                                "stops": [
                                    [
                                        7,
                                        50
                                    ],
                                    [
                                        10,
                                        50
                                    ],
                                    [
                                        11,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000"
                        }
                    },
                    {
                        "id": "Road/label/Pentagon inverse white black (Alt)",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                44
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 7,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 400,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 9.3,
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "icon-image": "Road/Pentagon inverse white black/{_len}",
                            "icon-rotation-alignment": "viewport",
                            "text-rotation-alignment": "viewport",
                            "text-offset": [
                                0,
                                0
                            ],
                            "text-padding": {
                                "stops": [
                                    [
                                        7,
                                        50
                                    ],
                                    [
                                        10,
                                        50
                                    ],
                                    [
                                        11,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000"
                        }
                    },
                    {
                        "id": "Road/label/Pentagon inverse white black",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                43
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 7,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 400,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 9.3,
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "icon-image": "Road/Pentagon inverse white black (Alt)/{_len}",
                            "icon-rotation-alignment": "viewport",
                            "text-rotation-alignment": "viewport",
                            "text-offset": [
                                0,
                                0
                            ],
                            "text-padding": {
                                "stops": [
                                    [
                                        7,
                                        50
                                    ],
                                    [
                                        10,
                                        50
                                    ],
                                    [
                                        11,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000"
                        }
                    },
                    {
                        "id": "Road/label/Pentagon white black (Alt)",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                46
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 7,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 400,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 8.5,
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "icon-image": "Road/Pentagon white black (Alt)/{_len}",
                            "icon-rotation-alignment": "viewport",
                            "text-rotation-alignment": "viewport",
                            "text-offset": [
                                0,
                                0
                            ],
                            "text-padding": {
                                "stops": [
                                    [
                                        7,
                                        50
                                    ],
                                    [
                                        10,
                                        50
                                    ],
                                    [
                                        11,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000"
                        }
                    },
                    {
                        "id": "Road/label/Pentagon white black",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                45
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 7,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 400,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 8.5,
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "icon-image": "Road/Pentagon white black/{_len}",
                            "icon-rotation-alignment": "viewport",
                            "text-rotation-alignment": "viewport",
                            "text-offset": [
                                0,
                                0
                            ],
                            "text-padding": {
                                "stops": [
                                    [
                                        7,
                                        50
                                    ],
                                    [
                                        10,
                                        50
                                    ],
                                    [
                                        11,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000"
                        }
                    },
                    {
                        "id": "Road/label/Pentagon yellow black (Alt)",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                50
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 7,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 400,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 8.5,
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "icon-image": "Road/Pentagon yellow black (Alt)/{_len}",
                            "icon-rotation-alignment": "viewport",
                            "text-rotation-alignment": "viewport",
                            "text-offset": [
                                0,
                                0
                            ],
                            "text-padding": {
                                "stops": [
                                    [
                                        7,
                                        50
                                    ],
                                    [
                                        10,
                                        50
                                    ],
                                    [
                                        11,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000"
                        }
                    },
                    {
                        "id": "Road/label/Pentagon yellow black",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                49
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 7,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 400,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 8.5,
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "icon-image": "Road/Pentagon yellow black/{_len}",
                            "icon-rotation-alignment": "viewport",
                            "text-rotation-alignment": "viewport",
                            "text-offset": [
                                0,
                                0
                            ],
                            "text-padding": {
                                "stops": [
                                    [
                                        7,
                                        50
                                    ],
                                    [
                                        10,
                                        50
                                    ],
                                    [
                                        11,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000"
                        }
                    },
                    {
                        "id": "Road/label/Pentagon green white",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                51
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 7,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 400,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 8.5,
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "icon-image": "Road/Pentagon green white/{_len}",
                            "icon-rotation-alignment": "viewport",
                            "text-rotation-alignment": "viewport",
                            "text-offset": [
                                0,
                                0
                            ],
                            "text-padding": {
                                "stops": [
                                    [
                                        7,
                                        50
                                    ],
                                    [
                                        10,
                                        50
                                    ],
                                    [
                                        11,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000"
                        }
                    },
                    {
                        "id": "Road/label/Pentagon green white (Alt)",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                52
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 7,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 400,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 8.5,
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "icon-image": "Road/Pentagon green white (Alt)/{_len}",
                            "icon-rotation-alignment": "viewport",
                            "text-rotation-alignment": "viewport",
                            "text-offset": [
                                0,
                                0
                            ],
                            "text-padding": {
                                "stops": [
                                    [
                                        7,
                                        50
                                    ],
                                    [
                                        10,
                                        50
                                    ],
                                    [
                                        11,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000"
                        }
                    },
                    {
                        "id": "Road/label/Pentagon green yellow",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                53
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 7,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 400,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 8.5,
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "icon-image": "Road/Pentagon green yellow/{_len}",
                            "icon-rotation-alignment": "viewport",
                            "text-rotation-alignment": "viewport",
                            "text-offset": [
                                0,
                                0
                            ],
                            "text-padding": {
                                "stops": [
                                    [
                                        7,
                                        50
                                    ],
                                    [
                                        10,
                                        50
                                    ],
                                    [
                                        11,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000"
                        }
                    },
                    {
                        "id": "Road/label/Pentagon green yellow (Alt)",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                54
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 7,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 400,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 8.5,
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "icon-image": "Road/Pentagon green yellow (Alt)/{_len}",
                            "icon-rotation-alignment": "viewport",
                            "text-rotation-alignment": "viewport",
                            "text-offset": [
                                0,
                                0
                            ],
                            "text-padding": {
                                "stops": [
                                    [
                                        7,
                                        50
                                    ],
                                    [
                                        10,
                                        50
                                    ],
                                    [
                                        11,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000"
                        }
                    },
                    {
                        "id": "Road/label/Pentagon blue white (Alt)",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                48
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 7,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 400,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 9.3,
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "icon-image": "Road/Pentagon blue white (Alt)/{_len}",
                            "icon-rotation-alignment": "viewport",
                            "text-rotation-alignment": "viewport",
                            "text-offset": [
                                0,
                                0
                            ],
                            "text-padding": {
                                "stops": [
                                    [
                                        7,
                                        50
                                    ],
                                    [
                                        10,
                                        50
                                    ],
                                    [
                                        11,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000"
                        }
                    },
                    {
                        "id": "Road/label/Pentagon blue white",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                47
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 7,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 400,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 9.3,
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "icon-image": "Road/Pentagon blue white/{_len}",
                            "icon-rotation-alignment": "viewport",
                            "text-rotation-alignment": "viewport",
                            "text-offset": [
                                0,
                                0
                            ],
                            "text-padding": {
                                "stops": [
                                    [
                                        7,
                                        50
                                    ],
                                    [
                                        10,
                                        50
                                    ],
                                    [
                                        11,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000"
                        }
                    },
                    {
                        "id": "Road/label/Hexagon white black (Alt)",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                56
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 7,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 400,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 8.5,
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "icon-image": "Road/Hexagon white black (Alt)/{_len}",
                            "icon-rotation-alignment": "viewport",
                            "text-rotation-alignment": "viewport",
                            "text-offset": [
                                0,
                                0
                            ],
                            "text-padding": {
                                "stops": [
                                    [
                                        7,
                                        50
                                    ],
                                    [
                                        10,
                                        50
                                    ],
                                    [
                                        11,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000"
                        }
                    },
                    {
                        "id": "Road/label/Hexagon white black",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                55
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 7,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 400,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 8.5,
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "icon-image": "Road/Hexagon white black/{_len}",
                            "icon-rotation-alignment": "viewport",
                            "text-rotation-alignment": "viewport",
                            "text-offset": [
                                0,
                                0
                            ],
                            "text-padding": {
                                "stops": [
                                    [
                                        7,
                                        50
                                    ],
                                    [
                                        10,
                                        50
                                    ],
                                    [
                                        11,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000"
                        }
                    },
                    {
                        "id": "Road/label/Hexagon blue white",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                57
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 7,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 400,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 8.5,
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "icon-image": "Road/Hexagon blue white/{_len}",
                            "icon-rotation-alignment": "viewport",
                            "text-rotation-alignment": "viewport",
                            "text-offset": [
                                0,
                                0
                            ],
                            "text-padding": {
                                "stops": [
                                    [
                                        7,
                                        50
                                    ],
                                    [
                                        10,
                                        50
                                    ],
                                    [
                                        11,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000"
                        }
                    },
                    {
                        "id": "Road/label/Hexagon blue white (Alt)",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                58
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 7,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 400,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 8.5,
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "icon-image": "Road/Hexagon blue white (Alt)/{_len}",
                            "icon-rotation-alignment": "viewport",
                            "text-rotation-alignment": "viewport",
                            "text-offset": [
                                0,
                                0
                            ],
                            "text-padding": {
                                "stops": [
                                    [
                                        7,
                                        50
                                    ],
                                    [
                                        10,
                                        50
                                    ],
                                    [
                                        11,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000"
                        }
                    },
                    {
                        "id": "Road/label/Hexagon red white",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                59
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 7,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 400,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 8.5,
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "icon-image": "Road/Hexagon red white/{_len}",
                            "icon-rotation-alignment": "viewport",
                            "text-rotation-alignment": "viewport",
                            "text-offset": [
                                0,
                                0
                            ],
                            "text-padding": {
                                "stops": [
                                    [
                                        7,
                                        50
                                    ],
                                    [
                                        10,
                                        50
                                    ],
                                    [
                                        11,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000"
                        }
                    },
                    {
                        "id": "Road/label/Hexagon red white (Alt)",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                60
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 7,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 400,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 8.5,
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "icon-image": "Road/Hexagon red white (Alt)/{_len}",
                            "icon-rotation-alignment": "viewport",
                            "text-rotation-alignment": "viewport",
                            "text-offset": [
                                0,
                                0
                            ],
                            "text-padding": {
                                "stops": [
                                    [
                                        7,
                                        50
                                    ],
                                    [
                                        10,
                                        50
                                    ],
                                    [
                                        11,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000"
                        }
                    },
                    {
                        "id": "Road/label/Hexagon green white (Alt)",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                62
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 7,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 400,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 8.5,
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "icon-image": "Road/Hexagon green white (Alt)/{_len}",
                            "icon-rotation-alignment": "viewport",
                            "text-rotation-alignment": "viewport",
                            "text-offset": [
                                0,
                                0
                            ],
                            "text-padding": {
                                "stops": [
                                    [
                                        7,
                                        50
                                    ],
                                    [
                                        10,
                                        50
                                    ],
                                    [
                                        11,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000"
                        }
                    },
                    {
                        "id": "Road/label/Hexagon green white",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                61
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 7,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 400,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 8.5,
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "icon-image": "Road/Hexagon green white/{_len}",
                            "icon-rotation-alignment": "viewport",
                            "text-rotation-alignment": "viewport",
                            "text-offset": [
                                0,
                                0
                            ],
                            "text-padding": {
                                "stops": [
                                    [
                                        7,
                                        50
                                    ],
                                    [
                                        10,
                                        50
                                    ],
                                    [
                                        11,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000"
                        }
                    },
                    {
                        "id": "Road/label/Hexagon orange black",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                63
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 7,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 400,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 8.5,
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "icon-image": "Road/Hexagon orange black/{_len}",
                            "icon-rotation-alignment": "viewport",
                            "text-rotation-alignment": "viewport",
                            "text-offset": [
                                0,
                                0
                            ],
                            "text-padding": {
                                "stops": [
                                    [
                                        7,
                                        50
                                    ],
                                    [
                                        10,
                                        50
                                    ],
                                    [
                                        11,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000"
                        }
                    },
                    {
                        "id": "Road/label/Hexagon orange black (Alt)",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                64
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 7,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 400,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 8.5,
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "icon-image": "Road/Hexagon orange black (Alt)/{_len}",
                            "icon-rotation-alignment": "viewport",
                            "text-rotation-alignment": "viewport",
                            "text-offset": [
                                0,
                                0
                            ],
                            "text-padding": {
                                "stops": [
                                    [
                                        7,
                                        50
                                    ],
                                    [
                                        10,
                                        50
                                    ],
                                    [
                                        11,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000"
                        }
                    },
                    {
                        "id": "Road/label/Rectangle hexagon brown white (Alt)",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                72
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 7,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 400,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 8.5,
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "icon-image": "Road/Rectangle hexagon brown white (Alt)/{_len}",
                            "icon-rotation-alignment": "viewport",
                            "text-rotation-alignment": "viewport",
                            "text-offset": [
                                0,
                                0
                            ],
                            "text-padding": {
                                "stops": [
                                    [
                                        7,
                                        50
                                    ],
                                    [
                                        10,
                                        50
                                    ],
                                    [
                                        11,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000"
                        }
                    },
                    {
                        "id": "Road/label/Rectangle hexagon brown white",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                71
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 7,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 400,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 8.5,
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "icon-image": "Road/Rectangle hexagon brown white/{_len}",
                            "icon-rotation-alignment": "viewport",
                            "text-rotation-alignment": "viewport",
                            "text-offset": [
                                0,
                                0
                            ],
                            "text-padding": {
                                "stops": [
                                    [
                                        7,
                                        50
                                    ],
                                    [
                                        10,
                                        50
                                    ],
                                    [
                                        11,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000"
                        }
                    },
                    {
                        "id": "Road/label/Rectangle hexagon green white (Alt)",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                70
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 7,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 400,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 8.5,
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "icon-image": "Road/Rectangle hexagon green white (Alt)/{_len}",
                            "icon-rotation-alignment": "viewport",
                            "text-rotation-alignment": "viewport",
                            "text-offset": [
                                0,
                                0
                            ],
                            "text-padding": {
                                "stops": [
                                    [
                                        7,
                                        50
                                    ],
                                    [
                                        10,
                                        50
                                    ],
                                    [
                                        11,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000"
                        }
                    },
                    {
                        "id": "Road/label/Rectangle hexagon green white",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                69
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 7,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 400,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 8.5,
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "icon-image": "Road/Rectangle hexagon green white/{_len}",
                            "icon-rotation-alignment": "viewport",
                            "text-rotation-alignment": "viewport",
                            "text-offset": [
                                0,
                                0
                            ],
                            "text-padding": {
                                "stops": [
                                    [
                                        7,
                                        50
                                    ],
                                    [
                                        10,
                                        50
                                    ],
                                    [
                                        11,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000"
                        }
                    },
                    {
                        "id": "Road/label/Rectangle hexagon red white (Alt)",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                68
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 7,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 400,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 8.5,
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "icon-image": "Road/Rectangle hexagon red white (Alt)/{_len}",
                            "icon-rotation-alignment": "viewport",
                            "text-rotation-alignment": "viewport",
                            "text-offset": [
                                0,
                                0
                            ],
                            "text-padding": {
                                "stops": [
                                    [
                                        7,
                                        50
                                    ],
                                    [
                                        10,
                                        50
                                    ],
                                    [
                                        11,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000"
                        }
                    },
                    {
                        "id": "Road/label/Rectangle hexagon red white",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                67
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 7,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 400,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 8.5,
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "icon-image": "Road/Rectangle hexagon red white/{_len}",
                            "icon-rotation-alignment": "viewport",
                            "text-rotation-alignment": "viewport",
                            "text-offset": [
                                0,
                                0
                            ],
                            "text-padding": {
                                "stops": [
                                    [
                                        7,
                                        50
                                    ],
                                    [
                                        10,
                                        50
                                    ],
                                    [
                                        11,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000"
                        }
                    },
                    {
                        "id": "Road/label/Rectangle hexagon blue white (Alt)",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                66
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 7,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 400,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 8.5,
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "icon-image": "Road/Rectangle hexagon blue white (Alt)/{_len}",
                            "icon-rotation-alignment": "viewport",
                            "text-rotation-alignment": "viewport",
                            "text-offset": [
                                0,
                                0
                            ],
                            "text-padding": {
                                "stops": [
                                    [
                                        7,
                                        50
                                    ],
                                    [
                                        10,
                                        50
                                    ],
                                    [
                                        11,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000"
                        }
                    },
                    {
                        "id": "Road/label/Rectangle hexagon blue white",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                65
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 7,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 400,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 8.5,
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "icon-image": "Road/Rectangle hexagon blue white/{_len}",
                            "icon-rotation-alignment": "viewport",
                            "text-rotation-alignment": "viewport",
                            "text-offset": [
                                0,
                                0
                            ],
                            "text-padding": {
                                "stops": [
                                    [
                                        7,
                                        50
                                    ],
                                    [
                                        10,
                                        50
                                    ],
                                    [
                                        11,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000"
                        }
                    },
                    {
                        "id": "Road/label/Octagon green white (Alt)",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                74
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 7,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 400,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 8.5,
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "icon-image": "Road/Octagon green white (Alt)/{_len}",
                            "icon-rotation-alignment": "viewport",
                            "text-rotation-alignment": "viewport",
                            "text-offset": [
                                0,
                                0
                            ],
                            "text-padding": {
                                "stops": [
                                    [
                                        7,
                                        50
                                    ],
                                    [
                                        10,
                                        50
                                    ],
                                    [
                                        11,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000"
                        }
                    },
                    {
                        "id": "Road/label/Octagon green white",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                73
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 7,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 400,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 8.5,
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "icon-image": "Road/Octagon green white/{_len}",
                            "icon-rotation-alignment": "viewport",
                            "text-rotation-alignment": "viewport",
                            "text-offset": [
                                0,
                                0
                            ],
                            "text-padding": {
                                "stops": [
                                    [
                                        7,
                                        50
                                    ],
                                    [
                                        10,
                                        50
                                    ],
                                    [
                                        11,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000"
                        }
                    },
                    {
                        "id": "Road/label/Shield white black (Alt)",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                10
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 7,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 400,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 9.3,
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "icon-image": "Road/Shield white black (Alt)/{_len}",
                            "icon-rotation-alignment": "viewport",
                            "text-rotation-alignment": "viewport",
                            "text-offset": [
                                -0.15,
                                -0.12
                            ],
                            "text-padding": {
                                "stops": [
                                    [
                                        7,
                                        50
                                    ],
                                    [
                                        10,
                                        50
                                    ],
                                    [
                                        11,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000"
                        }
                    },
                    {
                        "id": "Road/label/Shield white black",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                9
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 7,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 400,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 9.3,
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "icon-image": "Road/Shield white black/{_len}",
                            "icon-rotation-alignment": "viewport",
                            "text-rotation-alignment": "viewport",
                            "text-offset": [
                                -0.15,
                                -0.12
                            ],
                            "text-padding": {
                                "stops": [
                                    [
                                        7,
                                        50
                                    ],
                                    [
                                        10,
                                        50
                                    ],
                                    [
                                        11,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000"
                        }
                    },
                    {
                        "id": "Road/label/Secondary Hwy green white (Alt)",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                14
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 7,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 400,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 9.3,
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "icon-image": "Road/Secondary Hwy green white (Alt)/{_len}",
                            "icon-rotation-alignment": "viewport",
                            "text-rotation-alignment": "viewport",
                            "text-offset": [
                                0,
                                0
                            ],
                            "text-padding": {
                                "stops": [
                                    [
                                        7,
                                        50
                                    ],
                                    [
                                        10,
                                        50
                                    ],
                                    [
                                        11,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000"
                        }
                    },
                    {
                        "id": "Road/label/Secondary Hwy green white",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                13
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 7,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 400,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 9.3,
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "icon-image": "Road/Secondary Hwy green white/{_len}",
                            "icon-rotation-alignment": "viewport",
                            "text-rotation-alignment": "viewport",
                            "text-offset": [
                                0,
                                0
                            ],
                            "text-padding": {
                                "stops": [
                                    [
                                        7,
                                        50
                                    ],
                                    [
                                        10,
                                        50
                                    ],
                                    [
                                        11,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000"
                        }
                    },
                    {
                        "id": "Road/label/Secondary Hwy white black (Alt)",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                12
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 7,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 400,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 8.5,
                            "text-letter-spacing": 0.05,
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "icon-image": "Road/Secondary Hwy white black (Alt)/{_len}",
                            "icon-rotation-alignment": "viewport",
                            "text-rotation-alignment": "viewport",
                            "text-offset": [
                                0,
                                0
                            ],
                            "text-padding": {
                                "stops": [
                                    [
                                        7,
                                        50
                                    ],
                                    [
                                        10,
                                        50
                                    ],
                                    [
                                        11,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000"
                        }
                    },
                    {
                        "id": "Road/label/Secondary Hwy white black",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                11
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 7,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 400,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 8.5,
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "icon-image": "Road/Secondary Hwy white black/{_len}",
                            "icon-rotation-alignment": "viewport",
                            "text-rotation-alignment": "viewport",
                            "text-offset": [
                                0,
                                0
                            ],
                            "text-padding": {
                                "stops": [
                                    [
                                        7,
                                        50
                                    ],
                                    [
                                        10,
                                        50
                                    ],
                                    [
                                        11,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000"
                        }
                    },
                    {
                        "id": "Road/label/Shield blue white (Alt)",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                8
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 7,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 400,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 8.5,
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "icon-image": "Road/Shield blue white (Alt)/{_len}",
                            "icon-rotation-alignment": "viewport",
                            "text-rotation-alignment": "viewport",
                            "text-offset": [
                                -0.15,
                                -0.12
                            ],
                            "text-padding": {
                                "stops": [
                                    [
                                        7,
                                        50
                                    ],
                                    [
                                        10,
                                        50
                                    ],
                                    [
                                        11,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000"
                        }
                    },
                    {
                        "id": "Road/label/Shield blue white",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                7
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 7,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 400,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 8.5,
                            "text-max-width": 8,
                            "text-field": "{_name}",
                            "icon-image": "Road/Shield blue white/{_len}",
                            "icon-rotation-alignment": "viewport",
                            "text-rotation-alignment": "viewport",
                            "text-offset": [
                                -0.15,
                                -0.12
                            ],
                            "text-padding": {
                                "stops": [
                                    [
                                        7,
                                        50
                                    ],
                                    [
                                        10,
                                        50
                                    ],
                                    [
                                        11,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000"
                        }
                    },
                    {
                        "id": "Road/label/Pedestrian",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                6
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 15,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-avoid-edges": true,
                            "symbol-spacing": 400,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 9.3,
                            "text-letter-spacing": 0.05,
                            "text-max-width": 8,
                            "text-field": "{_name_local}",
                            "text-padding": 5
                        },
                        "paint": {
                            "text-color": "#595959",
                            "text-halo-color": "#FFFFFF",
                            "text-halo-width": 1
                        }
                    },
                    {
                        "id": "Building/label/Default",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Building/label",
                        "minzoom": 15,
                        "layout": {
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 9.5,
                            "text-letter-spacing": 0.08,
                            "text-max-width": 8,
                            "text-field": "{_name_local}",
                            "text-allow-overlap": false,
                            "text-padding": 15,
                            "symbol-avoid-edges": true
                        },
                        "paint": {
                            "text-color": "#262317",
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 0.7,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "Road/label/Local",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                5
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 12,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-avoid-edges": true,
                            "symbol-spacing": 400,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 9.5,
                            "text-letter-spacing": 0.09,
                            "text-max-width": 8,
                            "text-field": "{_name_local}",
                            "text-padding": {
                                "stops": [
                                    [
                                        12,
                                        5
                                    ],
                                    [
                                        15,
                                        5
                                    ],
                                    [
                                        16,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#595959",
                            "text-halo-color": "#FFFFFF",
                            "text-halo-width": 1
                        }
                    },
                    {
                        "id": "Road/label/Minor",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Road/label",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                4
                            ],
                            [
                                "!in",
                                "Viz",
                                2
                            ]
                        ],
                        "minzoom": 10,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-avoid-edges": true,
                            "symbol-spacing": 400,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 9.5,
                            "text-letter-spacing": 0.09,
                            "text-max-width": 8,
                            "text-field": "{_name_local}",
                            "text-padding": {
                                "stops": [
                                    [
                                        10,
                                        5
                                    ],
                                    [
                                        15,
                                        5
                                    ],
                                    [
                                        16,
                                        15
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#595959",
                            "text-halo-color": "#FFFFFF",
                            "text-halo-width": 1
                        }
                    },
                    {
                        "id": "Cemetery/label/Default",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Cemetery/label",
                        "minzoom": 13,
                        "layout": {
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 9.5,
                            "text-letter-spacing": 0.05,
                            "text-max-width": 8,
                            "text-field": "{_name_local}",
                            "text-allow-overlap": false,
                            "text-padding": 15,
                            "symbol-avoid-edges": true
                        },
                        "paint": {
                            "text-color": "#404040",
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 1,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "Freight/label/Default",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Freight/label",
                        "minzoom": 12,
                        "layout": {
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 9.5,
                            "text-letter-spacing": 0.05,
                            "text-max-width": 8,
                            "text-field": "{_name_local}",
                            "text-allow-overlap": false,
                            "text-padding": 15,
                            "symbol-avoid-edges": true
                        },
                        "paint": {
                            "text-color": "#404040",
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 1,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "Water and wastewater/label/Default",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Water and wastewater/label",
                        "minzoom": 13,
                        "layout": {
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 9.5,
                            "text-letter-spacing": 0.05,
                            "text-max-width": 8,
                            "text-field": "{_name_local}",
                            "text-allow-overlap": false,
                            "text-padding": 15,
                            "symbol-avoid-edges": true
                        },
                        "paint": {
                            "text-color": "#404040",
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 1,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "Port/label/Default",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Port/label",
                        "minzoom": 12,
                        "layout": {
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 9.5,
                            "text-letter-spacing": 0.05,
                            "text-max-width": 8,
                            "text-field": "{_name_local}",
                            "text-allow-overlap": false,
                            "text-padding": 15,
                            "symbol-avoid-edges": true
                        },
                        "paint": {
                            "text-color": "#404040",
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 1,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "Industry/label/Default",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Industry/label",
                        "minzoom": 12,
                        "layout": {
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 9.5,
                            "text-letter-spacing": 0.05,
                            "text-max-width": 8,
                            "text-field": "{_name_local}",
                            "text-allow-overlap": false,
                            "text-padding": 15,
                            "symbol-avoid-edges": true
                        },
                        "paint": {
                            "text-color": "#404040",
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 1,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "Government/label/Default",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Government/label",
                        "minzoom": 13,
                        "layout": {
                            "symbol-avoid-edges": false,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 9.5,
                            "text-letter-spacing": 0.05,
                            "text-max-width": 8,
                            "text-field": "{_name_local}",
                            "text-allow-overlap": false,
                            "text-padding": 15
                        },
                        "paint": {
                            "text-color": "#404040",
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 1,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "Finance/label/Default",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Finance/label",
                        "minzoom": 13,
                        "layout": {
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 9.5,
                            "text-letter-spacing": 0.05,
                            "text-max-width": 8,
                            "text-field": "{_name_local}",
                            "text-allow-overlap": false,
                            "text-padding": 15,
                            "symbol-avoid-edges": true
                        },
                        "paint": {
                            "text-color": "#404040",
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 1,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "Emergency/label/Default",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Emergency/label",
                        "minzoom": 13,
                        "layout": {
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 9.5,
                            "text-letter-spacing": 0.05,
                            "text-max-width": 8,
                            "text-field": "{_name_local}",
                            "text-allow-overlap": false,
                            "text-padding": 15,
                            "symbol-avoid-edges": true
                        },
                        "paint": {
                            "text-color": "#404040",
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 1,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "Indigenous/label/Default",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Indigenous/label",
                        "minzoom": 7,
                        "layout": {
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": {
                                "stops": [
                                    [
                                        6,
                                        8.5
                                    ],
                                    [
                                        10,
                                        9.5
                                    ]
                                ]
                            },
                            "text-letter-spacing": 0.05,
                            "text-max-width": 8,
                            "text-field": "{_name_zh_s}",
                            "text-allow-overlap": false,
                            "text-padding": 15,
                            "symbol-avoid-edges": true
                        },
                        "paint": {
                            "text-color": "#404040",
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 1,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "Military/label/Default",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Military/label",
                        "minzoom": 6,
                        "layout": {
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": {
                                "stops": [
                                    [
                                        6,
                                        8.5
                                    ],
                                    [
                                        10,
                                        9.5
                                    ]
                                ]
                            },
                            "text-letter-spacing": 0.05,
                            "text-max-width": 8,
                            "text-field": "{_name_zh_s}",
                            "text-allow-overlap": false,
                            "text-padding": 25,
                            "symbol-avoid-edges": true
                        },
                        "paint": {
                            "text-color": "#404040",
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 1,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "Transportation/label/Default",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Transportation/label",
                        "minzoom": 13,
                        "layout": {
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 9.5,
                            "text-letter-spacing": 0.05,
                            "text-max-width": 8,
                            "text-field": "{_name_local}",
                            "text-allow-overlap": false,
                            "text-padding": 15,
                            "symbol-avoid-edges": true
                        },
                        "paint": {
                            "text-color": "#404040",
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 1,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "Pedestrian/label/Default",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Pedestrian/label",
                        "minzoom": 13,
                        "layout": {
                            "symbol-avoid-edges": false,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 9.5,
                            "text-letter-spacing": 0.05,
                            "text-max-width": 8,
                            "text-field": "{_name_local}",
                            "text-allow-overlap": false,
                            "text-padding": 15
                        },
                        "paint": {
                            "text-color": "#404040",
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 1,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "Beach/label/Default",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Beach/label",
                        "minzoom": 13,
                        "layout": {
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 9.3,
                            "text-letter-spacing": 0.08,
                            "text-max-width": 8,
                            "text-field": "{_name_local}",
                            "text-allow-overlap": false,
                            "text-padding": 15,
                            "symbol-avoid-edges": true
                        },
                        "paint": {
                            "text-color": "#404040",
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 1,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "Golf course/label/Default",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Golf course/label",
                        "minzoom": 11,
                        "layout": {
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 9.5,
                            "text-letter-spacing": 0.05,
                            "text-max-width": 8,
                            "text-field": "{_name_local}",
                            "text-allow-overlap": false,
                            "text-padding": 15,
                            "symbol-avoid-edges": true
                        },
                        "paint": {
                            "text-color": "#404040",
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 1,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "Zoo/label/Default",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Zoo/label",
                        "minzoom": 11,
                        "layout": {
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 9.5,
                            "text-letter-spacing": 0.05,
                            "text-max-width": 8,
                            "text-field": "{_name_local}",
                            "text-allow-overlap": false,
                            "text-padding": 15,
                            "symbol-avoid-edges": true
                        },
                        "paint": {
                            "text-color": "#404040",
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 1,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "Retail/label/Default",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Retail/label",
                        "minzoom": 13,
                        "layout": {
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 9.5,
                            "text-letter-spacing": 0.05,
                            "text-max-width": 8,
                            "text-field": "{_name_local}",
                            "text-allow-overlap": false,
                            "text-padding": 15,
                            "symbol-avoid-edges": true
                        },
                        "paint": {
                            "text-color": "#404040",
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 1,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "Landmark/label/Default",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Landmark/label",
                        "minzoom": 13,
                        "layout": {
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 9.5,
                            "text-letter-spacing": 0.05,
                            "text-max-width": 8,
                            "text-field": "{_name_local}",
                            "text-allow-overlap": false,
                            "text-padding": 15,
                            "symbol-avoid-edges": true
                        },
                        "paint": {
                            "text-color": "#404040",
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 1,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "Openspace or forest/label/Default",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Openspace or forest/label",
                        "minzoom": 10,
                        "layout": {
                            "symbol-avoid-edges": false,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 9.5,
                            "text-letter-spacing": 0.05,
                            "text-max-width": 8,
                            "text-field": "{_name_local}",
                            "text-allow-overlap": false,
                            "text-padding": 25
                        },
                        "paint": {
                            "text-color": "#1c3c04",
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 1.5,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "Park or farming/label/Default",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Park or farming/label",
                        "minzoom": 11,
                        "layout": {
                            "symbol-avoid-edges": false,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 9.5,
                            "text-letter-spacing": 0.05,
                            "text-max-width": 8,
                            "text-field": "{_name_local}",
                            "text-allow-overlap": false,
                            "text-padding": 25
                        },
                        "paint": {
                            "text-color": "#2E8008",
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 1,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "Point of interest/Park",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Point of interest",
                        "filter": [
                            "==",
                            "_label_class",
                            1
                        ],
                        "minzoom": 9,
                        "layout": {
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": {
                                "stops": [
                                    [
                                        9,
                                        8.5
                                    ],
                                    [
                                        17,
                                        9.5
                                    ]
                                ]
                            },
                            "text-anchor": "center",
                            "text-letter-spacing": 0.08,
                            "text-max-width": 8,
                            "text-field": "{_name_local}",
                            "text-allow-overlap": false,
                            "text-padding": 15
                        },
                        "paint": {
                            "text-color": "#2E8008",
                            "text-halo-width": 1.5,
                            "text-halo-color": "#f0f0e9",
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "Education/label/Default",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Education/label",
                        "minzoom": 11,
                        "layout": {
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 9.5,
                            "text-letter-spacing": 0.05,
                            "text-max-width": 8,
                            "text-field": "{_name_local}",
                            "text-allow-overlap": false,
                            "text-padding": 15,
                            "symbol-avoid-edges": true
                        },
                        "paint": {
                            "text-color": "#404040",
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 1,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "Medical/label/Default",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Medical/label",
                        "minzoom": 11,
                        "layout": {
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 9.5,
                            "text-letter-spacing": 0.05,
                            "text-max-width": 8,
                            "text-field": "{_name_local}",
                            "text-allow-overlap": false,
                            "text-padding": 15,
                            "symbol-avoid-edges": true
                        },
                        "paint": {
                            "text-color": "#404040",
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 1,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "Admin1 forest or park/label/Default",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Admin1 forest or park/label",
                        "minzoom": 7,
                        "layout": {
                            "symbol-avoid-edges": false,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": {
                                "stops": [
                                    [
                                        6,
                                        8.5
                                    ],
                                    [
                                        10,
                                        9.5
                                    ]
                                ]
                            },
                            "text-letter-spacing": 0.05,
                            "text-max-width": 8,
                            "text-field": "{_name_zh_s}",
                            "text-allow-overlap": false,
                            "text-padding": 25
                        },
                        "paint": {
                            "text-color": "#1c3c04",
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 1.5,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "Admin0 forest or park/label/Default",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Admin0 forest or park/label",
                        "minzoom": 6,
                        "layout": {
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": {
                                "stops": [
                                    [
                                        6,
                                        8.5
                                    ],
                                    [
                                        10,
                                        9.5
                                    ]
                                ]
                            },
                            "text-letter-spacing": 0.05,
                            "text-max-width": 8,
                            "text-field": "{_name_zh_s}",
                            "text-allow-overlap": false,
                            "text-padding": 25,
                            "symbol-avoid-edges": true
                        },
                        "paint": {
                            "text-color": "#1c3c04",
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 1.5,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "Airport/label/Airport property",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Airport/label",
                        "minzoom": 9,
                        "layout": {
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": {
                                "stops": [
                                    [
                                        9,
                                        8.5
                                    ],
                                    [
                                        11,
                                        9.5
                                    ]
                                ]
                            },
                            "text-letter-spacing": 0.05,
                            "text-max-width": 8,
                            "text-field": "{_name_local}",
                            "text-allow-overlap": false,
                            "text-padding": 15,
                            "symbol-avoid-edges": true
                        },
                        "paint": {
                            "text-color": "#686868",
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 1,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "Admin2 area/label/small",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Admin2 area/label",
                        "filter": [
                            "==",
                            "_label_class",
                            1
                        ],
                        "minzoom": 9,
                        "maxzoom": 11,
                        "layout": {
                            "text-letter-spacing": 0.2,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 11.0,
                            "text-max-width": 8,
                            "text-field": "{_name_local}",
                            "text-allow-overlap": false,
                            "text-padding": 1,
                            "symbol-avoid-edges": true
                        },
                        "paint": {
                            "text-color": "#80755f",
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 1.5,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "Admin2 area/label/large",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Admin2 area/label",
                        "filter": [
                            "==",
                            "_label_class",
                            0
                        ],
                        "minzoom": 9,
                        "maxzoom": 11,
                        "layout": {
                            "text-letter-spacing": 0.2,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 12.3,
                            "text-max-width": 8,
                            "text-field": "{_name_local}",
                            "text-allow-overlap": false,
                            "text-padding": 1,
                            "symbol-avoid-edges": true
                        },
                        "paint": {
                            "text-color": "#80755f",
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 1.5,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "Admin1 area/label/x small",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Admin1 area/label",
                        "filter": [
                            "==",
                            "_label_class",
                            5
                        ],
                        "minzoom": 4,
                        "maxzoom": 10,
                        "layout": {
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-max-width": 8,
                            "text-field": "{_name_zh_s}",
                            "text-allow-overlap": false,
                            "text-padding": 1,
                            "symbol-avoid-edges": true,
                            "text-size": {
                                "stops": [
                                    [
                                        4,
                                        8.5
                                    ],
                                    [
                                        5,
                                        8.5
                                    ],
                                    [
                                        6,
                                        9.3
                                    ],
                                    [
                                        9,
                                        10
                                    ]
                                ]
                            },
                            "text-letter-spacing": {
                                "stops": [
                                    [
                                        4,
                                        0.1
                                    ],
                                    [
                                        8,
                                        0.18
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": {
                                "stops": [
                                    [
                                        3,
                                        "#6f666f"
                                    ],
                                    [
                                        5,
                                        "#4d324d"
                                    ]
                                ]
                            },
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 1.5,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "Admin1 area/label/small",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Admin1 area/label",
                        "filter": [
                            "==",
                            "_label_class",
                            4
                        ],
                        "minzoom": 4,
                        "maxzoom": 10,
                        "layout": {
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-max-width": 8,
                            "text-field": "{_name_zh_s}",
                            "text-allow-overlap": false,
                            "text-padding": 1,
                            "symbol-avoid-edges": true,
                            "text-size": {
                                "stops": [
                                    [
                                        4,
                                        8.5
                                    ],
                                    [
                                        5,
                                        8.5
                                    ],
                                    [
                                        6,
                                        9.5
                                    ],
                                    [
                                        9,
                                        10.5
                                    ]
                                ]
                            },
                            "text-letter-spacing": {
                                "stops": [
                                    [
                                        4,
                                        0.1
                                    ],
                                    [
                                        8,
                                        0.18
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": {
                                "stops": [
                                    [
                                        4,
                                        "#6f666f"
                                    ],
                                    [
                                        5,
                                        "#4d324d"
                                    ]
                                ]
                            },
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 1.5,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "Admin1 area/label/medium",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Admin1 area/label",
                        "filter": [
                            "==",
                            "_label_class",
                            3
                        ],
                        "minzoom": 4,
                        "maxzoom": 10,
                        "layout": {
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-max-width": 8,
                            "text-field": "{_name_zh_s}",
                            "text-allow-overlap": false,
                            "text-padding": 1,
                            "symbol-avoid-edges": true,
                            "text-size": {
                                "stops": [
                                    [
                                        4,
                                        9.5
                                    ],
                                    [
                                        5,
                                        9.5
                                    ],
                                    [
                                        6,
                                        10.3
                                    ],
                                    [
                                        9,
                                        11
                                    ]
                                ]
                            },
                            "text-letter-spacing": {
                                "stops": [
                                    [
                                        4,
                                        0.1
                                    ],
                                    [
                                        8,
                                        0.18
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": {
                                "stops": [
                                    [
                                        4,
                                        "#6f666f"
                                    ],
                                    [
                                        5,
                                        "#4d324d"
                                    ]
                                ]
                            },
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 1.5,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "Admin1 area/label/large",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Admin1 area/label",
                        "filter": [
                            "==",
                            "_label_class",
                            2
                        ],
                        "minzoom": 4,
                        "maxzoom": 10,
                        "layout": {
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-max-width": 8,
                            "text-field": "{_name_zh_s}",
                            "text-allow-overlap": false,
                            "text-padding": 1,
                            "symbol-avoid-edges": true,
                            "text-size": {
                                "stops": [
                                    [
                                        4,
                                        9.5
                                    ],
                                    [
                                        5,
                                        10.3
                                    ],
                                    [
                                        6,
                                        11
                                    ],
                                    [
                                        9,
                                        14
                                    ]
                                ]
                            },
                            "text-letter-spacing": {
                                "stops": [
                                    [
                                        4,
                                        0.1
                                    ],
                                    [
                                        8,
                                        0.18
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": {
                                "stops": [
                                    [
                                        4,
                                        "#6f666f"
                                    ],
                                    [
                                        5,
                                        "#4d324d"
                                    ]
                                ]
                            },
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 1.5,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "Admin1 area/label/x large",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Admin1 area/label",
                        "filter": [
                            "==",
                            "_label_class",
                            1
                        ],
                        "minzoom": 4,
                        "maxzoom": 10,
                        "layout": {
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-max-width": 8,
                            "text-field": "{_name_zh_s}",
                            "text-allow-overlap": false,
                            "text-padding": 1,
                            "symbol-avoid-edges": true,
                            "text-size": {
                                "stops": [
                                    [
                                        4,
                                        10.3
                                    ],
                                    [
                                        5,
                                        11
                                    ],
                                    [
                                        6,
                                        11.5
                                    ],
                                    [
                                        9,
                                        16
                                    ]
                                ]
                            },
                            "text-letter-spacing": {
                                "stops": [
                                    [
                                        4,
                                        0.13
                                    ],
                                    [
                                        8,
                                        0.25
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": {
                                "stops": [
                                    [
                                        3,
                                        "#6f666f"
                                    ],
                                    [
                                        5,
                                        "#4d324d"
                                    ]
                                ]
                            },
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 1.5,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "Admin1 area/label/2x large",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Admin1 area/label",
                        "filter": [
                            "==",
                            "_label_class",
                            0
                        ],
                        "minzoom": 4,
                        "maxzoom": 10,
                        "layout": {
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-max-width": 8,
                            "text-field": "{_name_zh_s}",
                            "text-allow-overlap": false,
                            "text-padding": 1,
                            "symbol-avoid-edges": true,
                            "text-size": {
                                "stops": [
                                    [
                                        4,
                                        10.5
                                    ],
                                    [
                                        5,
                                        11.3
                                    ],
                                    [
                                        6,
                                        12
                                    ],
                                    [
                                        9,
                                        16
                                    ]
                                ]
                            },
                            "text-letter-spacing": {
                                "stops": [
                                    [
                                        4,
                                        0.13
                                    ],
                                    [
                                        8,
                                        0.35
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": {
                                "stops": [
                                    [
                                        4,
                                        "#6f666f"
                                    ],
                                    [
                                        6,
                                        "#4d324d"
                                    ]
                                ]
                            },
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 1.5,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "Point of interest/General",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Point of interest",
                        "filter": [
                            "==",
                            "_label_class",
                            0
                        ],
                        "minzoom": 9,
                        "layout": {
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": {
                                "stops": [
                                    [
                                        9,
                                        8.5
                                    ],
                                    [
                                        15,
                                        9.5
                                    ]
                                ]
                            },
                            "text-anchor": "center",
                            "text-letter-spacing": 0.08,
                            "text-max-width": 8,
                            "text-field": "{_name_local}",
                            "text-allow-overlap": false,
                            "text-padding": 15
                        },
                        "paint": {
                            "text-color": {
                                "stops": [
                                    [
                                        9,
                                        "#241e07"
                                    ],
                                    [
                                        11,
                                        "#262317"
                                    ]
                                ]
                            },
                            "text-halo-width": 1.5,
                            "text-halo-color": "#f0f0e9",
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "Point of interest/Bus station",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Point of interest",
                        "filter": [
                            "==",
                            "_symbol",
                            2
                        ],
                        "minzoom": 11,
                        "layout": {
                            "symbol-avoid-edges": true,
                            "icon-image": "Point of interest/Bus station",
                            "icon-padding": 2,
                            "icon-allow-overlap": false,
                            "icon-size": {
                                "stops": [
                                    [
                                        9,
                                        0.28
                                    ],
                                    [
                                        16,
                                        0.9
                                    ]
                                ]
                            },
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": {
                                "stops": [
                                    [
                                        12.9,
                                        0
                                    ],
                                    [
                                        13,
                                        7.5
                                    ],
                                    [
                                        17,
                                        9
                                    ]
                                ]
                            },
                            "text-anchor": "bottom",
                            "text-letter-spacing": 0.04,
                            "text-max-width": 8,
                            "text-field": "{_name_local}",
                            "text-allow-overlap": false,
                            "text-padding": 5,
                            "text-offset": [
                                0,
                                -0.9
                            ],
                            "text-optional": {
                                "stops": [
                                    [
                                        9,
                                        false
                                    ],
                                    [
                                        14,
                                        true
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "icon-opacity": {
                                "stops": [
                                    [
                                        11,
                                        0.65
                                    ],
                                    [
                                        15,
                                        1
                                    ]
                                ]
                            },
                            "text-color": {
                                "stops": [
                                    [
                                        9,
                                        "#241e07"
                                    ],
                                    [
                                        11,
                                        "#413c27"
                                    ]
                                ]
                            },
                            "text-halo-width": 1.5,
                            "text-halo-color": "#f0f0e9",
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "Point of interest/Rail station",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Point of interest",
                        "filter": [
                            "==",
                            "_symbol",
                            3
                        ],
                        "minzoom": 11,
                        "layout": {
                            "symbol-avoid-edges": true,
                            "icon-image": "Point of interest/Rail station",
                            "icon-padding": 2,
                            "icon-allow-overlap": false,
                            "icon-size": {
                                "stops": [
                                    [
                                        9,
                                        0.28
                                    ],
                                    [
                                        16,
                                        0.9
                                    ]
                                ]
                            },
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": {
                                "stops": [
                                    [
                                        12.9,
                                        0
                                    ],
                                    [
                                        13,
                                        7.5
                                    ],
                                    [
                                        17,
                                        9
                                    ]
                                ]
                            },
                            "text-anchor": "bottom",
                            "text-letter-spacing": 0.04,
                            "text-max-width": 8,
                            "text-field": "{_name_local}",
                            "text-allow-overlap": false,
                            "text-padding": 5,
                            "text-offset": [
                                0,
                                -0.9
                            ],
                            "text-optional": {
                                "stops": [
                                    [
                                        9,
                                        false
                                    ],
                                    [
                                        14,
                                        true
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "icon-opacity": {
                                "stops": [
                                    [
                                        11,
                                        0.65
                                    ],
                                    [
                                        15,
                                        1
                                    ]
                                ]
                            },
                            "text-color": {
                                "stops": [
                                    [
                                        9,
                                        "#081340"
                                    ],
                                    [
                                        11,
                                        "#2c345a"
                                    ]
                                ]
                            },
                            "text-halo-width": 1.5,
                            "text-halo-color": "#f0f0e9",
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "Neighborhood",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Neighborhood",
                        "minzoom": 14,
                        "maxzoom": 17,
                        "layout": {
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": {
                                "stops": [
                                    [
                                        10,
                                        8
                                    ],
                                    [
                                        16,
                                        11
                                    ]
                                ]
                            },
                            "text-letter-spacing": 0.08,
                            "text-max-width": 8,
                            "text-field": "{_name_local}",
                            "text-allow-overlap": false,
                            "text-padding": 1
                        },
                        "paint": {
                            "text-color": "#000000",
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 1,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "City large scale/town small",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "City large scale",
                        "filter": [
                            "==",
                            "_label_class",
                            5
                        ],
                        "minzoom": 10,
                        "maxzoom": 17,
                        "layout": {
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": {
                                "stops": [
                                    [
                                        10,
                                        10
                                    ],
                                    [
                                        16,
                                        13
                                    ]
                                ]
                            },
                            "text-letter-spacing": 0.08,
                            "text-max-width": 8,
                            "text-field": "{_name_zh_s}",
                            "text-allow-overlap": false,
                            "text-padding": 15
                        },
                        "paint": {
                            "text-color": "#000000",
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 1,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "City large scale/town large",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "City large scale",
                        "filter": [
                            "==",
                            "_label_class",
                            4
                        ],
                        "minzoom": 10,
                        "maxzoom": 17,
                        "layout": {
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": {
                                "stops": [
                                    [
                                        10,
                                        10
                                    ],
                                    [
                                        16,
                                        15
                                    ]
                                ]
                            },
                            "text-letter-spacing": 0.09,
                            "text-max-width": 8,
                            "text-field": "{_name_zh_s}",
                            "text-allow-overlap": false,
                            "text-padding": 1
                        },
                        "paint": {
                            "text-halo-color": "#f0f0e9",
                            "text-color": "#000000",
                            "text-halo-width": 1,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "City large scale/small",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "City large scale",
                        "filter": [
                            "==",
                            "_label_class",
                            3
                        ],
                        "minzoom": 10,
                        "maxzoom": 17,
                        "layout": {
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-letter-spacing": 0.1,
                            "text-max-width": 8,
                            "text-field": "{_name_zh_s}",
                            "text-allow-overlap": false,
                            "text-padding": 1,
                            "text-size": {
                                "stops": [
                                    [
                                        10,
                                        11
                                    ],
                                    [
                                        16,
                                        15.5
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-halo-color": "#f0f0e9",
                            "text-color": "#000000",
                            "text-halo-width": 1,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "City large scale/medium",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "City large scale",
                        "filter": [
                            "==",
                            "_label_class",
                            2
                        ],
                        "minzoom": 10,
                        "maxzoom": 17,
                        "layout": {
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-letter-spacing": 0.1,
                            "text-max-width": 8,
                            "text-field": "{_name_zh_s}",
                            "text-allow-overlap": false,
                            "text-padding": 1,
                            "text-size": {
                                "stops": [
                                    [
                                        10,
                                        12
                                    ],
                                    [
                                        16,
                                        17.5
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-halo-color": "#f0f0e9",
                            "text-color": "#000000",
                            "text-halo-width": 1,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "City large scale/large",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "City large scale",
                        "filter": [
                            "==",
                            "_label_class",
                            1
                        ],
                        "minzoom": 10,
                        "maxzoom": 17,
                        "layout": {
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-letter-spacing": 0.1,
                            "text-max-width": 8,
                            "text-field": "{_name_zh_s}",
                            "text-allow-overlap": false,
                            "text-padding": 1,
                            "text-size": {
                                "stops": [
                                    [
                                        10,
                                        13
                                    ],
                                    [
                                        16,
                                        20
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000",
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 1,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "City large scale/x large",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "City large scale",
                        "filter": [
                            "==",
                            "_label_class",
                            0
                        ],
                        "minzoom": 10,
                        "maxzoom": 17,
                        "layout": {
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-letter-spacing": 0.1,
                            "text-max-width": 8,
                            "text-field": "{_name_zh_s}",
                            "text-allow-overlap": false,
                            "text-padding": 1,
                            "text-size": {
                                "stops": [
                                    [
                                        10,
                                        13.5
                                    ],
                                    [
                                        16,
                                        22
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000",
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 1,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "City small scale/town small non capital",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "City small scale",
                        "filter": [
                            "==",
                            "_symbol",
                            17
                        ],
                        "minzoom": 3,
                        "maxzoom": 10,
                        "layout": {
                            "symbol-avoid-edges": true,
                            "icon-image": "City small scale/town small non capital",
                            "icon-padding": 1,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 10,
                            "text-anchor": "bottom-left",
                            "text-max-width": 8,
                            "text-field": "{_name_zh_s}",
                            "text-allow-overlap": false,
                            "text-padding": 1,
                            "text-offset": [
                                0.31,
                                -0.2
                            ],
                            "text-justify": "left"
                        },
                        "paint": {
                            "text-color": "#000000",
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 1,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "City small scale/town large non capital",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "City small scale",
                        "filter": [
                            "==",
                            "_symbol",
                            15
                        ],
                        "minzoom": 3,
                        "maxzoom": 10,
                        "layout": {
                            "symbol-avoid-edges": true,
                            "icon-image": "City small scale/town large non capital",
                            "icon-padding": 1,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 10,
                            "text-anchor": "bottom-left",
                            "text-max-width": 8,
                            "text-field": "{_name_zh_s}",
                            "text-allow-overlap": false,
                            "text-padding": 1,
                            "text-offset": [
                                0.31,
                                -0.2
                            ],
                            "text-justify": "left"
                        },
                        "paint": {
                            "text-color": "#000000",
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 1,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "City small scale/small non capital",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "City small scale",
                        "filter": [
                            "==",
                            "_symbol",
                            12
                        ],
                        "minzoom": 3,
                        "maxzoom": 10,
                        "layout": {
                            "symbol-avoid-edges": true,
                            "icon-image": "City small scale/small non capital",
                            "icon-padding": 1,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 10.5,
                            "text-anchor": "bottom-left",
                            "text-max-width": 8,
                            "text-field": "{_name_zh_s}",
                            "text-allow-overlap": false,
                            "text-padding": 1,
                            "text-offset": [
                                0.31,
                                -0.2
                            ],
                            "text-justify": "left"
                        },
                        "paint": {
                            "text-color": "#000000",
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 1,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "City small scale/medium non capital",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "City small scale",
                        "filter": [
                            "==",
                            "_symbol",
                            9
                        ],
                        "minzoom": 3,
                        "maxzoom": 10,
                        "layout": {
                            "symbol-avoid-edges": true,
                            "icon-image": "City small scale/medium non capital",
                            "icon-padding": 1,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-anchor": "bottom-left",
                            "text-max-width": 8,
                            "text-field": "{_name_zh_s}",
                            "text-allow-overlap": false,
                            "text-padding": 1,
                            "text-offset": [
                                0.31,
                                -0.2
                            ],
                            "text-justify": "left",
                            "text-size": {
                                "stops": [
                                    [
                                        4,
                                        11.3
                                    ],
                                    [
                                        6,
                                        11.3
                                    ],
                                    [
                                        8,
                                        12
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000",
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 1,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "City small scale/other capital",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "City small scale",
                        "filter": [
                            "==",
                            "_symbol",
                            18
                        ],
                        "minzoom": 3,
                        "maxzoom": 10,
                        "layout": {
                            "symbol-avoid-edges": true,
                            "icon-image": "City small scale/other capital",
                            "icon-padding": 1,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 10.5,
                            "text-anchor": "bottom-left",
                            "text-max-width": 8,
                            "text-field": "{_name_zh_s}",
                            "text-allow-overlap": false,
                            "text-padding": 1,
                            "text-offset": [
                                0.31,
                                -0.2
                            ],
                            "text-justify": "left"
                        },
                        "paint": {
                            "text-color": "#000000",
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 1,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "City small scale/town large other capital",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "City small scale",
                        "filter": [
                            "==",
                            "_symbol",
                            14
                        ],
                        "minzoom": 3,
                        "maxzoom": 10,
                        "layout": {
                            "symbol-avoid-edges": true,
                            "icon-image": "City small scale/town large other capital",
                            "icon-padding": 1,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 10.5,
                            "text-anchor": "bottom-left",
                            "text-max-width": 8,
                            "text-field": "{_name_zh_s}",
                            "text-allow-overlap": false,
                            "text-padding": 1,
                            "text-offset": [
                                0.31,
                                -0.2
                            ],
                            "text-justify": "left"
                        },
                        "paint": {
                            "text-color": "#000000",
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 1,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "City small scale/small other capital",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "City small scale",
                        "filter": [
                            "==",
                            "_symbol",
                            11
                        ],
                        "minzoom": 3,
                        "maxzoom": 10,
                        "layout": {
                            "symbol-avoid-edges": true,
                            "icon-image": "City small scale/small other capital",
                            "icon-padding": 1,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": 10.5,
                            "text-anchor": "bottom-left",
                            "text-max-width": 8,
                            "text-field": "{_name_zh_s}",
                            "text-allow-overlap": false,
                            "text-padding": 1,
                            "text-offset": [
                                0.31,
                                -0.2
                            ],
                            "text-justify": "left"
                        },
                        "paint": {
                            "text-color": "#000000",
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 1,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "City small scale/medium other capital",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "City small scale",
                        "filter": [
                            "==",
                            "_symbol",
                            8
                        ],
                        "minzoom": 3,
                        "maxzoom": 10,
                        "layout": {
                            "symbol-avoid-edges": true,
                            "icon-image": "City small scale/medium other capital",
                            "icon-padding": 1,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-anchor": "bottom-left",
                            "text-max-width": 8,
                            "text-field": "{_name_zh_s}",
                            "text-allow-overlap": false,
                            "text-padding": 1,
                            "text-offset": [
                                0.31,
                                -0.2
                            ],
                            "text-justify": "left",
                            "text-size": {
                                "stops": [
                                    [
                                        4,
                                        11.3
                                    ],
                                    [
                                        6,
                                        11.3
                                    ],
                                    [
                                        8,
                                        12
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000",
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 1,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "Admin0 point/x small",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Admin0 point",
                        "filter": [
                            "==",
                            "_label_class",
                            5
                        ],
                        "minzoom": 5,
                        "maxzoom": 10,
                        "layout": {
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-max-width": 8,
                            "text-field": "{_name_zh_s}",
                            "text-allow-overlap": false,
                            "text-padding": 1,
                            "symbol-avoid-edges": true,
                            "text-letter-spacing": {
                                "stops": [
                                    [
                                        5,
                                        0.13
                                    ],
                                    [
                                        8,
                                        0.5
                                    ]
                                ]
                            },
                            "text-size": {
                                "stops": [
                                    [
                                        5,
                                        10
                                    ],
                                    [
                                        10,
                                        12.5
                                    ]
                                ]
                            },
                            "text-transform": "uppercase"
                        },
                        "paint": {
                            "text-color": "#0f010f",
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 2,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "Admin0 point/small",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Admin0 point",
                        "filter": [
                            "==",
                            "_label_class",
                            4
                        ],
                        "minzoom": 4,
                        "maxzoom": 10,
                        "layout": {
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-max-width": 8,
                            "text-field": "{_name_zh_s}",
                            "text-allow-overlap": false,
                            "text-padding": 1,
                            "symbol-avoid-edges": true,
                            "text-letter-spacing": {
                                "stops": [
                                    [
                                        4,
                                        0.13
                                    ],
                                    [
                                        8,
                                        0.5
                                    ]
                                ]
                            },
                            "text-size": {
                                "stops": [
                                    [
                                        4,
                                        10
                                    ],
                                    [
                                        10,
                                        12.5
                                    ]
                                ]
                            },
                            "text-transform": "uppercase"
                        },
                        "paint": {
                            "text-color": "#0f010f",
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 2,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "Admin0 point/medium",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Admin0 point",
                        "filter": [
                            "==",
                            "_label_class",
                            3
                        ],
                        "minzoom": 2,
                        "maxzoom": 10,
                        "layout": {
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-max-width": 8,
                            "text-field": "{_name_zh_s}",
                            "text-allow-overlap": false,
                            "text-padding": 1,
                            "symbol-avoid-edges": true,
                            "text-letter-spacing": {
                                "stops": [
                                    [
                                        2,
                                        0.13
                                    ],
                                    [
                                        8,
                                        0.5
                                    ]
                                ]
                            },
                            "text-size": {
                                "stops": [
                                    [
                                        2,
                                        8
                                    ],
                                    [
                                        4,
                                        10
                                    ],
                                    [
                                        10,
                                        16
                                    ]
                                ]
                            },
                            "text-transform": "uppercase"
                        },
                        "paint": {
                            "text-color": "#0f010f",
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 2,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "Admin0 point/large",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Admin0 point",
                        "filter": [
                            "==",
                            "_label_class",
                            2
                        ],
                        "minzoom": 2,
                        "maxzoom": 10,
                        "layout": {
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-max-width": 8,
                            "text-field": "{_name_zh_s}",
                            "text-allow-overlap": false,
                            "text-padding": 1,
                            "symbol-avoid-edges": true,
                            "text-letter-spacing": {
                                "stops": [
                                    [
                                        2,
                                        0.13
                                    ],
                                    [
                                        8,
                                        0.5
                                    ]
                                ]
                            },
                            "text-size": {
                                "stops": [
                                    [
                                        2,
                                        8.5
                                    ],
                                    [
                                        4,
                                        10
                                    ],
                                    [
                                        6,
                                        16
                                    ]
                                ]
                            },
                            "text-transform": "uppercase"
                        },
                        "paint": {
                            "text-color": "#0f010f",
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 2,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "Admin0 point/x large",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Admin0 point",
                        "filter": [
                            "==",
                            "_label_class",
                            1
                        ],
                        "minzoom": 2,
                        "maxzoom": 8,
                        "layout": {
                            "text-max-width": 8,
                            "text-field": "{_name_zh_s}",
                            "text-allow-overlap": false,
                            "text-padding": 1,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-line-height": 1.5,
                            "text-letter-spacing": {
                                "stops": [
                                    [
                                        2,
                                        0.15
                                    ],
                                    [
                                        6,
                                        0.5
                                    ]
                                ]
                            },
                            "text-size": {
                                "stops": [
                                    [
                                        2,
                                        8.5
                                    ],
                                    [
                                        4,
                                        10
                                    ],
                                    [
                                        6,
                                        16
                                    ]
                                ]
                            },
                            "text-transform": "uppercase"
                        },
                        "paint": {
                            "text-color": "#0f010f",
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 2,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "City small scale/town small admin0 capital",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "City small scale",
                        "filter": [
                            "==",
                            "_symbol",
                            16
                        ],
                        "minzoom": 3,
                        "maxzoom": 10,
                        "layout": {
                            "symbol-avoid-edges": true,
                            "icon-image": "City small scale/town small admin0 capital",
                            "icon-padding": 1,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-anchor": "bottom-left",
                            "text-max-width": 8,
                            "text-field": "{_name_zh_s}",
                            "text-allow-overlap": false,
                            "text-padding": 1,
                            "text-offset": [
                                0.31,
                                -0.2
                            ],
                            "text-justify": "left",
                            "text-size": {
                                "stops": [
                                    [
                                        4,
                                        11.3
                                    ],
                                    [
                                        6,
                                        12.5
                                    ],
                                    [
                                        8,
                                        13.3
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000",
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 1,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "City small scale/town large admin0 capital",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "City small scale",
                        "filter": [
                            "==",
                            "_symbol",
                            13
                        ],
                        "minzoom": 3,
                        "maxzoom": 10,
                        "layout": {
                            "symbol-avoid-edges": true,
                            "icon-image": "City small scale/town large admin0 capital",
                            "icon-padding": 1,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-anchor": "bottom-left",
                            "text-max-width": 8,
                            "text-field": "{_name_zh_s}",
                            "text-allow-overlap": false,
                            "text-padding": 1,
                            "text-offset": [
                                0.31,
                                -0.2
                            ],
                            "text-justify": "left",
                            "text-size": {
                                "stops": [
                                    [
                                        4,
                                        11.3
                                    ],
                                    [
                                        6,
                                        12.5
                                    ],
                                    [
                                        8,
                                        13.3
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000",
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 1,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "City small scale/small admin0 capital",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "City small scale",
                        "filter": [
                            "==",
                            "_symbol",
                            10
                        ],
                        "minzoom": 3,
                        "maxzoom": 10,
                        "layout": {
                            "symbol-avoid-edges": true,
                            "icon-image": "City small scale/small admin0 capital",
                            "icon-padding": 1,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-anchor": "bottom-left",
                            "text-max-width": 8,
                            "text-field": "{_name_zh_s}",
                            "text-allow-overlap": false,
                            "text-padding": 1,
                            "text-offset": [
                                0.31,
                                -0.2
                            ],
                            "text-justify": "left",
                            "text-size": {
                                "stops": [
                                    [
                                        4,
                                        11.3
                                    ],
                                    [
                                        6,
                                        12.5
                                    ],
                                    [
                                        8,
                                        13.3
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#000000",
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 1,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "City small scale/medium admin0 capital",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "City small scale",
                        "filter": [
                            "==",
                            "_symbol",
                            7
                        ],
                        "minzoom": 3,
                        "maxzoom": 10,
                        "layout": {
                            "symbol-avoid-edges": true,
                            "icon-image": "City small scale/medium admin0 capital",
                            "icon-padding": 1,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-anchor": "bottom-left",
                            "text-max-width": 8,
                            "text-field": "{_name_zh_s}",
                            "text-allow-overlap": false,
                            "text-padding": 1,
                            "text-offset": [
                                0.31,
                                -0.2
                            ],
                            "text-justify": "left",
                            "text-size": {
                                "stops": [
                                    [
                                        4,
                                        11.3
                                    ],
                                    [
                                        6,
                                        12.5
                                    ],
                                    [
                                        8,
                                        13.3
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": "#343434",
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 1,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "City small scale/large other capital",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "City small scale",
                        "filter": [
                            "==",
                            "_symbol",
                            5
                        ],
                        "minzoom": 3,
                        "maxzoom": 10,
                        "layout": {
                            "symbol-avoid-edges": true,
                            "icon-image": "City small scale/large other capital",
                            "icon-padding": 1,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-anchor": "bottom-left",
                            "text-max-width": 8,
                            "text-field": "{_name_zh_s}",
                            "text-allow-overlap": false,
                            "text-padding": 1,
                            "text-offset": [
                                0.31,
                                -0.2
                            ],
                            "text-justify": "left",
                            "text-size": {
                                "stops": [
                                    [
                                        4,
                                        11.3
                                    ],
                                    [
                                        6,
                                        11.3
                                    ],
                                    [
                                        8,
                                        12
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": {
                                "stops": [
                                    [
                                        2,
                                        "#343434"
                                    ],
                                    [
                                        3,
                                        "#000000"
                                    ]
                                ]
                            },
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 1,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "City small scale/x large admin2 capital",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "City small scale",
                        "filter": [
                            "==",
                            "_symbol",
                            2
                        ],
                        "minzoom": 3,
                        "maxzoom": 10,
                        "layout": {
                            "symbol-avoid-edges": true,
                            "icon-image": "City small scale/x large admin2 capital",
                            "icon-padding": 1,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-anchor": "bottom-left",
                            "text-max-width": 8,
                            "text-field": "{_name_zh_s}",
                            "text-allow-overlap": false,
                            "text-padding": 1,
                            "text-offset": [
                                0.31,
                                -0.2
                            ],
                            "text-justify": "left",
                            "text-size": {
                                "stops": [
                                    [
                                        4,
                                        11.3
                                    ],
                                    [
                                        6,
                                        12.5
                                    ],
                                    [
                                        8,
                                        13.3
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": {
                                "stops": [
                                    [
                                        2,
                                        "#343434"
                                    ],
                                    [
                                        3,
                                        "#000000"
                                    ]
                                ]
                            },
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 1,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "City small scale/large non capital",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "City small scale",
                        "filter": [
                            "==",
                            "_symbol",
                            6
                        ],
                        "minzoom": 3,
                        "maxzoom": 10,
                        "layout": {
                            "symbol-avoid-edges": true,
                            "icon-image": "City small scale/large non capital",
                            "icon-padding": 1,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-anchor": "bottom-left",
                            "text-max-width": 8,
                            "text-field": "{_name_zh_s}",
                            "text-allow-overlap": false,
                            "text-padding": 1,
                            "text-offset": [
                                0.31,
                                -0.2
                            ],
                            "text-justify": "left",
                            "text-size": {
                                "stops": [
                                    [
                                        4,
                                        11.3
                                    ],
                                    [
                                        6,
                                        11.3
                                    ],
                                    [
                                        8,
                                        12
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": {
                                "stops": [
                                    [
                                        2,
                                        "#343434"
                                    ],
                                    [
                                        3,
                                        "#000000"
                                    ]
                                ]
                            },
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 1,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "City small scale/large admin0 capital",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "City small scale",
                        "filter": [
                            "==",
                            "_symbol",
                            4
                        ],
                        "minzoom": 3,
                        "maxzoom": 10,
                        "layout": {
                            "symbol-avoid-edges": true,
                            "icon-image": "City small scale/large admin0 capital",
                            "icon-padding": 1,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-anchor": "bottom-left",
                            "text-max-width": 8,
                            "text-field": "{_name_zh_s}",
                            "text-allow-overlap": false,
                            "text-padding": 1,
                            "text-offset": [
                                0.31,
                                -0.2
                            ],
                            "text-justify": "left",
                            "text-size": {
                                "stops": [
                                    [
                                        4,
                                        11.3
                                    ],
                                    [
                                        6,
                                        12.5
                                    ],
                                    [
                                        8,
                                        13.3
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": {
                                "stops": [
                                    [
                                        2,
                                        "#2d2d2d"
                                    ],
                                    [
                                        3,
                                        "#000000"
                                    ]
                                ]
                            },
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 1,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "City small scale/x large non capital",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "City small scale",
                        "filter": [
                            "==",
                            "_symbol",
                            3
                        ],
                        "minzoom": 3,
                        "maxzoom": 10,
                        "layout": {
                            "symbol-avoid-edges": true,
                            "icon-image": "City small scale/x large non capital",
                            "icon-padding": 1,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-anchor": "bottom-left",
                            "text-max-width": 8,
                            "text-field": "{_name_zh_s}",
                            "text-allow-overlap": false,
                            "text-padding": 1,
                            "text-offset": [
                                0.31,
                                -0.2
                            ],
                            "text-justify": "left",
                            "text-size": {
                                "stops": [
                                    [
                                        4,
                                        11.3
                                    ],
                                    [
                                        6,
                                        12.5
                                    ],
                                    [
                                        8,
                                        13.3
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": {
                                "stops": [
                                    [
                                        2,
                                        "#343434"
                                    ],
                                    [
                                        3,
                                        "#000000"
                                    ]
                                ]
                            },
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 1,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "City small scale/x large admin1 capital",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "City small scale",
                        "filter": [
                            "==",
                            "_symbol",
                            1
                        ],
                        "minzoom": 3,
                        "maxzoom": 10,
                        "layout": {
                            "symbol-avoid-edges": true,
                            "icon-image": "City small scale/x large admin1 capital",
                            "icon-padding": 1,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-anchor": "bottom-left",
                            "text-max-width": 8,
                            "text-field": "{_name_zh_s}",
                            "text-allow-overlap": false,
                            "text-padding": 1,
                            "text-offset": [
                                0.31,
                                -0.2
                            ],
                            "text-justify": "left",
                            "text-size": {
                                "stops": [
                                    [
                                        4,
                                        11.3
                                    ],
                                    [
                                        6,
                                        12.5
                                    ],
                                    [
                                        8,
                                        13.3
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": {
                                "stops": [
                                    [
                                        2,
                                        "#343434"
                                    ],
                                    [
                                        3,
                                        "#000000"
                                    ]
                                ]
                            },
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 1,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "City small scale/x large admin0 capital",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "City small scale",
                        "filter": [
                            "==",
                            "_symbol",
                            0
                        ],
                        "minzoom": 3,
                        "maxzoom": 10,
                        "layout": {
                            "symbol-avoid-edges": true,
                            "icon-image": "City small scale/x large admin0 capital",
                            "icon-padding": 1,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-anchor": "bottom-left",
                            "text-max-width": 8,
                            "text-field": "{_name_zh_s}",
                            "text-allow-overlap": false,
                            "text-padding": 1,
                            "text-offset": [
                                0.31,
                                -0.2
                            ],
                            "text-justify": "left",
                            "text-size": {
                                "stops": [
                                    [
                                        4,
                                        11.3
                                    ],
                                    [
                                        6,
                                        12.5
                                    ],
                                    [
                                        8,
                                        13.3
                                    ]
                                ]
                            }
                        },
                        "paint": {
                            "text-color": {
                                "stops": [
                                    [
                                        2,
                                        "#2d2d2d"
                                    ],
                                    [
                                        3,
                                        "#000000"
                                    ]
                                ]
                            },
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 1,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "Admin0 point/2x large",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Admin0 point",
                        "filter": [
                            "==",
                            "_label_class",
                            0
                        ],
                        "minzoom": 2,
                        "maxzoom": 6,
                        "layout": {
                            "text-max-width": 8,
                            "text-field": "{_name_zh_s}",
                            "text-allow-overlap": false,
                            "text-padding": 1,
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-line-height": 1.7,
                            "text-letter-spacing": {
                                "stops": [
                                    [
                                        2,
                                        0.3
                                    ],
                                    [
                                        5,
                                        0.5
                                    ]
                                ]
                            },
                            "text-size": {
                                "stops": [
                                    [
                                        2,
                                        10
                                    ],
                                    [
                                        4,
                                        15.5
                                    ],
                                    [
                                        5,
                                        18
                                    ]
                                ]
                            },
                            "text-transform": "uppercase"
                        },
                        "paint": {
                            "text-color": "#0f010f",
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 2,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "Continent",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Continent",
                        "maxzoom": 2,
                        "layout": {
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": {
                                "stops": [
                                    [
                                        0,
                                        7.3
                                    ],
                                    [
                                        1,
                                        9.3
                                    ]
                                ]
                            },
                            "text-anchor": "center",
                            "text-letter-spacing": 0.35,
                            "text-max-width": 8,
                            "text-line-height": 1.75,
                            "text-field": "{_name_zh_s}",
                            "text-allow-overlap": false,
                            "text-padding": 1,
                            "text-transform": "uppercase"
                        },
                        "paint": {
                            "text-color": "#363636",
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 2,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "Disputed label point/Island",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Disputed label point",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                1
                            ],
                            [
                                "in",
                                "DisputeID",
                                0
                            ]
                        ],
                        "minzoom": 6,
                        "layout": {
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": {
                                "stops": [
                                    [
                                        6,
                                        7
                                    ],
                                    [
                                        15,
                                        10
                                    ]
                                ]
                            },
                            "text-anchor": "center",
                            "text-letter-spacing": 0.13,
                            "text-line-height": 1.5,
                            "text-max-width": 4,
                            "text-field": "{_name_zh_s}",
                            "text-padding": 1
                        },
                        "paint": {
                            "text-color": "#595959",
                            "text-halo-blur": 1,
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 1
                        }
                    },
                    {
                        "id": "Disputed label point/Waterbody",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Disputed label point",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                0
                            ],
                            [
                                "in",
                                "DisputeID",
                                1006
                            ]
                        ],
                        "minzoom": 2,
                        "maxzoom": 10,
                        "layout": {
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": {
                                "stops": [
                                    [
                                        2,
                                        8
                                    ],
                                    [
                                        6,
                                        9.3
                                    ]
                                ]
                            },
                            "text-anchor": "center",
                            "text-letter-spacing": 0.1,
                            "text-max-width": 6,
                            "text-field": "{_name_zh_s}",
                            "text-padding": 1
                        },
                        "paint": {
                            "text-color": {
                                "stops": [
                                    [
                                        1,
                                        "#3385A3"
                                    ],
                                    [
                                        6,
                                        "#00668C"
                                    ]
                                ]
                            },
                            "text-halo-blur": 1,
                            "text-halo-color": "#f2fcff",
                            "text-halo-width": 0.5
                        }
                    },
                    {
                        "id": "Landform/label/Round small",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Landform/label",
                        "filter": [
                            "==",
                            "_label_class",
                            0
                        ],
                        "layout": {
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-max-width": 6,
                            "text-size": {
                                "stops": [
                                    [
                                        0,
                                        8
                                    ],
                                    [
                                        10,
                                        12
                                    ]
                                ]
                            },
                            "text-letter-spacing": {
                                "stops": [
                                    [
                                        4,
                                        0.1
                                    ],
                                    [
                                        8,
                                        0.18
                                    ]
                                ]
                            },
                            "text-field": "{_name_zh_s}",
                            "text-optional": true
                        },
                        "paint": {
                            "text-color": {
                                "stops": [
                                    [
                                        1,
                                        "#2c2e24"
                                    ],
                                    [
                                        11,
                                        "#030302"
                                    ]
                                ]
                            },
                            "text-halo-color": "#eff0ea",
                            "text-halo-width": 1,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "Landform/label/Round medium",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Landform/label",
                        "filter": [
                            "==",
                            "_label_class",
                            1
                        ],
                        "layout": {
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-max-width": 6,
                            "text-size": {
                                "stops": [
                                    [
                                        0,
                                        8
                                    ],
                                    [
                                        4,
                                        8.5
                                    ],
                                    [
                                        10,
                                        12
                                    ]
                                ]
                            },
                            "text-letter-spacing": {
                                "stops": [
                                    [
                                        4,
                                        0.1
                                    ],
                                    [
                                        8,
                                        0.18
                                    ]
                                ]
                            },
                            "text-field": "{_name_zh_s}",
                            "text-optional": true
                        },
                        "paint": {
                            "text-color": {
                                "stops": [
                                    [
                                        1,
                                        "#28291f"
                                    ],
                                    [
                                        11,
                                        "#030302"
                                    ]
                                ]
                            },
                            "text-halo-color": "#eff0ea",
                            "text-halo-width": 1,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "Landform/label/Round large",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Landform/label",
                        "filter": [
                            "==",
                            "_label_class",
                            2
                        ],
                        "maxzoom": 10,
                        "layout": {
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-max-width": 6,
                            "text-size": {
                                "stops": [
                                    [
                                        0,
                                        8
                                    ],
                                    [
                                        4,
                                        9
                                    ],
                                    [
                                        6,
                                        13
                                    ]
                                ]
                            },
                            "text-letter-spacing": {
                                "stops": [
                                    [
                                        4,
                                        0.1
                                    ],
                                    [
                                        8,
                                        0.18
                                    ]
                                ]
                            },
                            "text-field": "{_name_zh_s}",
                            "text-optional": true
                        },
                        "paint": {
                            "text-color": {
                                "stops": [
                                    [
                                        1,
                                        "#28291f"
                                    ],
                                    [
                                        11,
                                        "#030302"
                                    ]
                                ]
                            },
                            "text-halo-color": "#eff0ea",
                            "text-halo-width": 1,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "Landform/label/Round x large",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Landform/label",
                        "filter": [
                            "==",
                            "_label_class",
                            3
                        ],
                        "maxzoom": 7,
                        "layout": {
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-max-width": 15,
                            "text-size": {
                                "stops": [
                                    [
                                        2,
                                        9.5
                                    ],
                                    [
                                        4,
                                        13
                                    ],
                                    [
                                        6,
                                        20
                                    ]
                                ]
                            },
                            "text-letter-spacing": {
                                "stops": [
                                    [
                                        4,
                                        0.13
                                    ],
                                    [
                                        8,
                                        0.25
                                    ]
                                ]
                            },
                            "text-field": "{_name_zh_s}",
                            "text-optional": true
                        },
                        "paint": {
                            "text-color": {
                                "stops": [
                                    [
                                        1,
                                        "#28291f"
                                    ],
                                    [
                                        11,
                                        "#030302"
                                    ]
                                ]
                            },
                            "text-halo-color": "#eff0ea",
                            "text-halo-width": 1,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "Landform/label/Oblong small",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Landform/label",
                        "filter": [
                            "==",
                            "_label_class",
                            4
                        ],
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 1000,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-max-width": 8,
                            "text-size": {
                                "stops": [
                                    [
                                        0,
                                        8
                                    ],
                                    [
                                        10,
                                        12
                                    ]
                                ]
                            },
                            "text-letter-spacing": {
                                "stops": [
                                    [
                                        4,
                                        0.1
                                    ],
                                    [
                                        8,
                                        0.18
                                    ]
                                ]
                            },
                            "text-field": "{_name_zh_s}",
                            "text-optional": true
                        },
                        "paint": {
                            "text-color": {
                                "stops": [
                                    [
                                        1,
                                        "#28291f"
                                    ],
                                    [
                                        11,
                                        "#030302"
                                    ]
                                ]
                            },
                            "text-halo-color": "#eff0ea",
                            "text-halo-width": 1,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "Landform/label/Oblong small point",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Landform/label",
                        "filter": [
                            "==",
                            "_label_class",
                            1004
                        ],
                        "layout": {
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-max-width": 6,
                            "text-size": {
                                "stops": [
                                    [
                                        0,
                                        8
                                    ],
                                    [
                                        10,
                                        12
                                    ]
                                ]
                            },
                            "text-letter-spacing": {
                                "stops": [
                                    [
                                        4,
                                        0.1
                                    ],
                                    [
                                        8,
                                        0.18
                                    ]
                                ]
                            },
                            "text-field": "{_name_zh_s}",
                            "text-optional": true
                        },
                        "paint": {
                            "text-color": {
                                "stops": [
                                    [
                                        1,
                                        "#28291f"
                                    ],
                                    [
                                        11,
                                        "#030302"
                                    ]
                                ]
                            },
                            "text-halo-color": "#eff0ea",
                            "text-halo-width": 1,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "Landform/label/Oblong medium",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Landform/label",
                        "filter": [
                            "==",
                            "_label_class",
                            5
                        ],
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 1000,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-max-width": 8,
                            "text-size": {
                                "stops": [
                                    [
                                        0,
                                        8
                                    ],
                                    [
                                        4,
                                        8.5
                                    ],
                                    [
                                        10,
                                        12
                                    ]
                                ]
                            },
                            "text-letter-spacing": {
                                "stops": [
                                    [
                                        4,
                                        0.1
                                    ],
                                    [
                                        8,
                                        0.18
                                    ]
                                ]
                            },
                            "text-field": "{_name_zh_s}",
                            "text-optional": true
                        },
                        "paint": {
                            "text-color": {
                                "stops": [
                                    [
                                        1,
                                        "#28291f"
                                    ],
                                    [
                                        11,
                                        "#030302"
                                    ]
                                ]
                            },
                            "text-halo-color": "#eff0ea",
                            "text-halo-width": 1,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "Landform/label/Oblong medium point",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Landform/label",
                        "filter": [
                            "==",
                            "_label_class",
                            1005
                        ],
                        "layout": {
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-max-width": 6,
                            "text-size": {
                                "stops": [
                                    [
                                        0,
                                        8
                                    ],
                                    [
                                        4,
                                        8.5
                                    ],
                                    [
                                        10,
                                        12
                                    ]
                                ]
                            },
                            "text-letter-spacing": {
                                "stops": [
                                    [
                                        4,
                                        0.1
                                    ],
                                    [
                                        8,
                                        0.18
                                    ]
                                ]
                            },
                            "text-field": "{_name_zh_s}",
                            "text-optional": true
                        },
                        "paint": {
                            "text-color": {
                                "stops": [
                                    [
                                        1,
                                        "#28291f"
                                    ],
                                    [
                                        11,
                                        "#030302"
                                    ]
                                ]
                            },
                            "text-halo-color": "#eff0ea",
                            "text-halo-width": 1,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "Landform/label/Oblong large",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Landform/label",
                        "filter": [
                            "==",
                            "_label_class",
                            6
                        ],
                        "maxzoom": 9,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 1000,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-max-width": 8,
                            "text-size": {
                                "stops": [
                                    [
                                        0,
                                        8
                                    ],
                                    [
                                        4,
                                        9
                                    ],
                                    [
                                        6,
                                        13
                                    ]
                                ]
                            },
                            "text-letter-spacing": {
                                "stops": [
                                    [
                                        4,
                                        0.1
                                    ],
                                    [
                                        8,
                                        0.18
                                    ]
                                ]
                            },
                            "text-field": "{_name_zh_s}",
                            "text-optional": true
                        },
                        "paint": {
                            "text-color": {
                                "stops": [
                                    [
                                        1,
                                        "#28291f"
                                    ],
                                    [
                                        11,
                                        "#030302"
                                    ]
                                ]
                            },
                            "text-halo-color": "#eff0ea",
                            "text-halo-width": 1,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "Landform/label/Oblong large point",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Landform/label",
                        "filter": [
                            "==",
                            "_label_class",
                            1006
                        ],
                        "maxzoom": 10,
                        "layout": {
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-max-width": 6,
                            "text-size": {
                                "stops": [
                                    [
                                        0,
                                        8
                                    ],
                                    [
                                        4,
                                        9
                                    ],
                                    [
                                        6,
                                        13
                                    ]
                                ]
                            },
                            "text-letter-spacing": {
                                "stops": [
                                    [
                                        4,
                                        0.1
                                    ],
                                    [
                                        8,
                                        0.18
                                    ]
                                ]
                            },
                            "text-field": "{_name_zh_s}",
                            "text-optional": true
                        },
                        "paint": {
                            "text-color": {
                                "stops": [
                                    [
                                        1,
                                        "#28291f"
                                    ],
                                    [
                                        11,
                                        "#030302"
                                    ]
                                ]
                            },
                            "text-halo-color": "#eff0ea",
                            "text-halo-width": 1,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "Landform/label/Oblong x large",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Landform/label",
                        "filter": [
                            "==",
                            "_label_class",
                            7
                        ],
                        "maxzoom": 6,
                        "layout": {
                            "symbol-placement": "line",
                            "symbol-spacing": 1000,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-max-width": 8,
                            "text-size": {
                                "stops": [
                                    [
                                        0,
                                        9.5
                                    ],
                                    [
                                        4,
                                        13
                                    ],
                                    [
                                        6,
                                        17
                                    ]
                                ]
                            },
                            "text-letter-spacing": {
                                "stops": [
                                    [
                                        4,
                                        0.13
                                    ],
                                    [
                                        8,
                                        0.25
                                    ]
                                ]
                            },
                            "text-field": "{_name_zh_s}",
                            "text-optional": true
                        },
                        "paint": {
                            "text-color": {
                                "stops": [
                                    [
                                        1,
                                        "#28291f"
                                    ],
                                    [
                                        11,
                                        "#030302"
                                    ]
                                ]
                            },
                            "text-halo-color": "#eff0ea",
                            "text-halo-width": 1,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "Landform/label/Oblong x large point",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Landform/label",
                        "filter": [
                            "==",
                            "_label_class",
                            1007
                        ],
                        "maxzoom": 6,
                        "layout": {
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-max-width": 15,
                            "text-size": {
                                "stops": [
                                    [
                                        0,
                                        9.5
                                    ],
                                    [
                                        4,
                                        13
                                    ],
                                    [
                                        6,
                                        17
                                    ]
                                ]
                            },
                            "text-letter-spacing": {
                                "stops": [
                                    [
                                        4,
                                        0.13
                                    ],
                                    [
                                        8,
                                        0.25
                                    ]
                                ]
                            },
                            "text-field": "{_name_zh_s}",
                            "text-optional": true
                        },
                        "paint": {
                            "text-color": {
                                "stops": [
                                    [
                                        1,
                                        "#28291f"
                                    ],
                                    [
                                        11,
                                        "#030302"
                                    ]
                                ]
                            },
                            "text-halo-color": "#eff0ea",
                            "text-halo-width": 1,
                            "text-halo-blur": 1
                        }
                    },
                    {
                        "id": "Disputed label point/Admin0",
                        "type": "symbol",
                        "source": "esri",
                        "source-layer": "Disputed label point",
                        "filter": [
                            "all",
                            [
                                "==",
                                "_label_class",
                                2
                            ],
                            [
                                "in",
                                "DisputeID",
                                1021
                            ]
                        ],
                        "minzoom": 2,
                        "layout": {
                            "symbol-avoid-edges": true,
                            "text-font": [
                                "Arial Unicode MS Regular"
                            ],
                            "text-size": {
                                "stops": [
                                    [
                                        2,
                                        8
                                    ],
                                    [
                                        4,
                                        10
                                    ],
                                    [
                                        10,
                                        16
                                    ]
                                ]
                            },
                            "text-transform": "uppercase",
                            "text-letter-spacing": {
                                "stops": [
                                    [
                                        2,
                                        0.13
                                    ],
                                    [
                                        8,
                                        0.5
                                    ]
                                ]
                            },
                            "text-anchor": "center",
                            "text-max-width": 8,
                            "text-field": "{_name_zh_s}",
                            "text-padding": 1
                        },
                        "paint": {
                            "text-color": "#1f1d1f",
                            "text-halo-color": "#f0f0e9",
                            "text-halo-width": 2,
                            "text-halo-blur": 1
                        }
                    }
                ]
            };
        },

    };
});