
function skGisLayerManager()
{
   this.LayerList = new Object();
   this.KmlLayerList = new Object();
   this.KmlLayerKeyList = new Object();

   if (typeof skGisLayerManager._initialized == "undefined")
   {
      skGisLayerManager.prototype.IsHaveLayer = function(mySelf, layerId)
      {
         var layer = mySelf.LayerList[layerId]
         if (layer != null)
         {
            return layer;
         }
         else
         {
            return null;
         }
      }
      ;

      skGisLayerManager.prototype.IsHaveKmlLayer = function(mySelf,kmlName, layerId)
      {
         var layer = mySelf.KmlLayerList[kmlName + ":" + layerId]
         if (layer != null)
         {
            return true;
         }
         else
         {
            return false;
         }
      }
      ;


      skGisLayerManager.prototype.GetKmlLayersByKmlName = function(mySelf, kmlName) {

          var array = new Array();
          for (var key in mySelf.KmlLayerList)
          {
              if (key.toString().indexOf(kmlName + ":") == 0)
              {
                  var layer = mySelf.KmlLayerList[key];
                  if (layer != null)
                  {
                      array.push(layer);
                  }
              }
              key = null;
          }
          return array;
      };

      skGisLayerManager.prototype.GetKmlLayer = function(mySelf,kmlName, layerId)
      {
         var layer = mySelf.KmlLayerList[kmlName + ":" + layerId]
         if (layer != null)
         {
            return layer;
         }
         else
         {
            return null;
         }
      }
      ;

      skGisLayerManager.prototype.AddNewLayer = function(mySelf, layerId, newLayer)
      {
         if (mySelf.LayerList != null)
         {
            mySelf.LayerList[layerId] = newLayer;
         }
      }
      ;

      skGisLayerManager.prototype.AddNewKmlLayer = function(mySelf,kmlName, layerId, newLayer)
      {
         if (mySelf.KmlLayerList != null)
         {
            mySelf.KmlLayerList[kmlName + ":" + layerId] = newLayer;
         }
      }
      ;


      skGisLayerManager.prototype.RemoveKmlAll = function(mySelf)
      {
         for (var key in mySelf.KmlLayerList)
         {
            var layer = mySelf.KmlLayerList[key];
            if (layer != null)
            {
               delete mySelf.LayerList[key];
               delete mySelf.KmlLayerList[key];
               layer = null;
            }
            key = null;
         }
      }
      ;


      skGisLayerManager.prototype.HiddenAllKmlTitle = function(mySelf) {
          for (var key in mySelf.KmlLayerList) {
              var layer = mySelf.KmlLayerList[key];
              if (layer != null && layer instanceof Marker) {
                  layer.hideTitle();
              }
              key = null;
          }
      }
      ;

      skGisLayerManager.prototype.ShowAllKmlTitle = function(mySelf) {
          for (var key in mySelf.KmlLayerList) {
              var layer = mySelf.KmlLayerList[key];
              if (layer != null && layer instanceof Marker) {
                  layer.showTitle();
              }
              key = null;
          }
      }
      ;

      skGisLayerManager.prototype.RemoveKmlLayerByKmlName = function(mySelf, kmlName)
      {
         for (var key in mySelf.KmlLayerList)
         {
            if (key.toString().indexOf(kmlName + ":") == 0)
            {
               var layer = mySelf.KmlLayerList[key];
               if (layer != null)
               {
                  delete mySelf.LayerList[key];
                  delete mySelf.KmlLayerList[key];
                  layer = null;
               }
            }
            key = null;
         }
      }
      ;


      skGisLayerManager.prototype.RemoveKmlLayerByID = function(mySelf, kmlName, layerId) {
          var key = kmlName + ":" + layerId;
          var layer = mySelf.KmlLayerList[key];
          if (layer != null)
          {
              delete mySelf.LayerList[key];
              delete mySelf.KmlLayerList[key];
              layer = null;
          }
          key = null;
      }
      ;



      skGisLayerManager.prototype.RemoveUnViewReturnKeepList = function(mySelf, iMap, newKmlDocument)
      {
         var keepList = new Object();
         var deleteList = Array();
         for (var key in mySelf.LayerList)
         {
            var drawObj = newKmlDocument.GetObjectByLocate(newKmlDocument, key);
            if (drawObj == null)
            {
               var layer = mySelf.LayerList[key];
               if (layer != null)
               {
                  iMap.removeOverlay(layer);
                  layer = null;
               }
            }
            else
            {
               var layer = mySelf.LayerList[key];
               if (layer != null)
               {
                  keepList[key] = layer;
               }
            }
            drawObj = null;
         }

         mySelf.LayerList = null;
         mySelf.LayerList = keepList;
         return keepList;
      }
      ;



      skGisLayerManager.prototype.Remove = function(mySelf, layerId)
      {
         var layer = mySelf.LayerList[layerId];
         if (layer != null)
         {
            delete mySelf.LayerList[layerId];
         }
      }
      ;
   }
   skGisLayerManager._initialized = true;
}
;


var currentLayerManager = new skGisLayerManager();

var pIconArray = new Array();
var pPointArray = new Array();
var pTitleArray = new Array();
var pMakerArray = new Array();

var pLinePointArray = new Array();
var pLineArray = new Array();

var pPolygonArray = new Array();


function MapDrawByWebGis(map) {

   this.iMap = map;

   if (typeof MapDrawByWebGis._initialized == "undefined")
   {

       MapDrawByWebGis.prototype.VirtualDrawPoint = function (mySelf, param) {
           if (typeof ServerApplicationType != 'undefined' && ServerApplicationType.indexOf('pgis') >= 0)
           {
               mySelf.DrawPointByPGIS(mySelf, param);
           }
           else
           {
               mySelf.DrawPointByDSGIS(mySelf, param);
           }
       }
      ;

        MapDrawByWebGis.prototype.DrawPointByDSGIS = function(mySelf, param) {
            try
            {

                var imgUrl = param.Style.IconStyle.Icon.Href;
                var scale = param.Style.IconStyle.Scale;
                var htmlTextColor = null;
                var htmlColor = "darkBlue";
                var isTransparent = true;
                if (param.Style.LabelStyle != null) {
                    isTransparent = false;
                    htmlColor = "white";
                    htmlTextColor = param.Style.LabelStyle.ConvertToHtmlColorString(param.Style.LabelStyle);
                }
                var markName = param.PlaceMark.Name;
                var lonX = parseFloat(param.Point.x);
                var latY = parseFloat(param.Point.y);

                var param = { LayerGroup: "播放轨迹", LayerId: ServerCodeId, ImgUrl: imgUrl, ShowText: markName, LonLat: [lonX, latY], Code: param.PlaceMark.ID, Scale: scale };
                window.parent.parent.window.dojo.publish("egis/Map/AddMarker", param);
            }
            catch (ex)
            {
                alert(ex);
            }
        };

        MapDrawByWebGis.prototype.DrawPointByPGIS = function (mySelf, param) {
            try {

                if (param.Point == null || param.PlaceMark == null || param.Style == null || param.Style.IconStyle == null || param.Style.IconStyle.Icon == null) {
                    return;
                }

                var imgUrl = param.Style.IconStyle.Icon.Href + "?" + param.PlaceMark.ID + "," + param.PlaceMark.Name + "," + param.PlaceMark.Snippet;
                var width = param.Style.IconStyle.Width * param.Style.IconStyle.Scale;
                var height = param.Style.IconStyle.Height * param.Style.IconStyle.Scale;

                var htmlTextColor = null;
                var htmlColor = "darkBlue";
                var isTransparent = true;
                if (param.Style.LabelStyle != null) {
                    isTransparent = false;
                    htmlColor = "white";
                    htmlTextColor = param.Style.LabelStyle.ConvertToHtmlColorString(param.Style.LabelStyle);
                }
                var markName = param.PlaceMark.Name;
                if (markName.indexOf("GetCarVideoState:") >= 0) {
                    if (typeof g_bOCXCreate != 'undefined' && g_bOCXCreate == true) {
                        var getArray = markName.split('GetCarVideoState:');
                        var lng = document.all('webcudev').GetDeviceStatus(getArray[1], 0);
                        if (lng == 0) {
                            markName = "*" + getArray[0];
                        }
                        else {
                            markName = getArray[0];
                        }
                    }
                }

                param.PlaceMark.Pointlay = window.parent.window.addSearchMaker(param.PlaceMark.ID, parseFloat(param.Point.x), parseFloat(param.Point.y), markName, "", imgUrl, width, height, "轨迹播放:" + ServerCodeId);
                if (param.PlaceMark.ID != "") {
                    param.PlaceMark.Pointlay.PlaceMarkID = param.PlaceMark.ID;
                }


                htmlTextColor = null;
                htmlColor = null;
                isTransparent = null;

            }
            catch (ex) {
                alert("绘制标记点时候报错：" + ex.Message);
            }
        };

        MapDrawByWebGis.prototype.VirtualDrawLine = function (myself, param) {
            try {

                if (param.Line == null || param.PlaceMark == null || param.Style == null || param.Style.LineStyle == null) {
                    return;
                }
                var regionContent = "";
                var LinePoints = param.Line.Points;
                for (var i = 0; i < LinePoints.length; i++) {
                    if (regionContent != "")
                    {
                        regionContent += ",";
                    }
                    regionContent += LinePoints[i].x + "," +  LinePoints[i].y;
                }

                var htmlColor = param.Style.LineStyle.ConvertToHtmlColorString(param.Style.LineStyle);
                var info = { LayerGroup: "播放轨迹", LayerId: ServerCodeId, Color: htmlColor, LineWidth: param.Style.LineStyle.Width, ShowText: "", RegionContent: regionContent};
                window.parent.parent.window.dojo.publish("egis/Map/DrawLine", info);

                htmlColor = null;
            }
            catch (ex) {
                alert("绘制线路时候报错：" + ex.Message);
            }

        }
      ;

        MapDrawByWebGis.prototype.ClearAll = function (carCode) {

           var removeObject = { LayerGroup: "播放轨迹", LayerId: carCode, RemoveType: "ID" };
           window.parent.parent.window.dojo.publish("egis/Map/Remove", removeObject);

           if (pMakerArray != null)
           {
               for (var num = 0; num < pMakerArray.length; )
               {
                   delete pMakerArray[num];
                   pMakerArray[num] = null;
                   pMakerArray.shift();                   
               }
           }

           if (pIconArray != null)
           {
               for (var num = 0; num < pIconArray.length; )
               {
                   delete pIconArray[num];
                   pIconArray[num] = null;
                   pIconArray.shift();
               }
           }

           if (pPointArray != null)
           {
               for (var num = 0; num < pPointArray.length; )
               {
                   delete pPointArray[num];
                   pPointArray[num] = null;
                   pPointArray.shift();
               }
           }

           if (pTitleArray != null)
           {
               for (var num = 0; num < pTitleArray.length; )
               {
                   delete pTitleArray[num];
                   pTitleArray[num] = null;
                   pTitleArray.shift();
               }
           }


           if (pLineArray != null)
           {
               for (var num = 0; num < pLineArray.length; )
               {
                   delete pLineArray[num];
                   pLineArray[num] = null;
                   pLineArray.shift();

               }
           }

           if (pLinePointArray != null)
           {
               for (var num = 0; num < pLinePointArray.length; )
               {
                   delete pLinePointArray[num];
                   pLinePointArray[num] = null;
                   pLinePointArray.shift();

               }
           }

           if (pPolygonArray != null)
           {
               for (var num = 0; num < pPolygonArray.length; )
               {
                   delete pPolygonArray[num];
                   pPolygonArray[num] = null;
                   pPolygonArray.shift();
               }
           }
       }
      ;

      MapDrawByWebGis.prototype.ViewArgsDelegate = function(myself, linkMark)
      {
          if (this.iMap != null) {
              var viewBoand = this.iMap.getBoundsLatLng();
              if (viewBoand != null) {
                  var url = linkMark.ViewFormat;
                  return url.replace("[bboxWest]", viewBoand.minX).replace("[bboxSouth]", viewBoand.minY).replace("[bboxEast]", viewBoand.maxX).replace("[bboxNorth]", viewBoand.maxY);
              }
          }
          return "";
      }
      ;

      MapDrawByWebGis.prototype.UpdateGpsAndName = function (targetId, lon, lat, showText)
      {

          window.parent.parent.window.dojo.publish("egis/gps/updategps", { GPSId: targetId, Lon: lon, Lat: lat, ChangeInfo: "ShowText", ChangeValue: showText });

      }
      ;

      MapDrawByWebGis.prototype.VirtualDrawPolygon = function(mySelf, param) {
          try
          {
              if (param.Polygon == null || param.PlaceMark == null || param.Style == null || param.Style.PolyStyle == null)
              {
                  return;
              }

              var codStr =param.Polygon.OuterBoundaryIs.LinearRing.Coordinates;
              if(param.Polygon.InnerBoundaries != null)
              {
                  for(nn =0; nn < param.Polygon.InnerBoundaries.length;nn++)
                  {
                       codStr += ";" + param.Polygon.InnerBoundaries[nn].LinearRing.Coordinates.replace(' ', ',');
                  }
              }
              while(codStr.indexOf(' ') >= 0)
              {
                  codStr = codStr.replace(' ', ',')
              }
              var htmlColor = param.Style.PolyStyle.ConvertToHtmlColorString(param.Style.PolyStyle);
              pPolygonArray.push(new Polygon(codStr, 'blue', 4, 0.2, htmlColor));
              var len = pPolygonArray.length - 1;

              if (currentLayerManager != null)
              {
                  var isHave = currentLayerManager.IsHaveKmlLayer(currentLayerManager, param.BelongDocument.Name, param.PlaceMark.Geometry.Coordinates);
                  if (!isHave)
                  {
                        if(param.BelongDocument.Name == "不可删除图层")
                        {
                            this.iMap.addOverlay(pPolygonArray[len], true);
                        }
                        else
                        {
                            this.iMap.addOverlay(pPolygonArray[len], false);
                        }
                      currentLayerManager.AddNewKmlLayer(currentLayerManager, param.BelongDocument.Name, param.PlaceMark.Geometry.Coordinates, pLineArray[len]);
                  }
              }

              htmlColor = null;
              len = null;
          }
          catch (ex)
          {
              alert("绘制面时候报错：" + ex.Message);
          }

      }
      ;

      MapDrawByWebGis.prototype.VirtualAddFolder = function(myself,param)
      {


      }
      ;

      MapDrawByWebGis.prototype.RemoveOverlay = function(myself, param, id) {
          if (currentLayerManager != null)
          {
              var layer = currentLayerManager.GetKmlLayer(currentLayerManager, param.BelongDocument.Name, id);
              if (layer != null)
              {
                  layer.removeAllListener();
                  this.iMap.removeOverlay(layer, false);
                  currentLayerManager.RemoveKmlLayerByID(currentLayerManager, param.BelongDocument.Name, id);

                  delete layer;
                  layer = null;
              }
          }
      }
      ;

      MapDrawByWebGis.prototype.VirtualDrawGroundOverlay = function(myself, param)
      {


      }
      ;

      MapDrawByWebGis.prototype.VirtualDrawScreenOverlay = function(myself, param)
      {


      }
      ;

   }
   MapDrawByWebGis._initialized = true;
}
;


