
//kml基准对象
function skObject()
{
   this.ID = "";
   this.TargetID = "";
   //KML 对象的内容
   this.Content = "";
}
;

function skVec2()
{
   this.x = 0;
   this.u = 0;
   this.xunits = "";
   this.yunits = "";
}
;

//skColorStyle
function skColorStyle()
{
   skObject.call(this);
   this.Color = null;
   this.ColorMode = "normal";

   if (typeof skColorStyle._initialized == "undefined")
   {
       skColorStyle.prototype.ConvertToHtmlColorString = function(mySelf) {
           if (mySelf.Color != null)
           {
               var array = new Array();
               for (var i = 0; i < mySelf.Color.length / 2;
            i++)
               {
                   array.push(mySelf.Color.substring(i * 2, i * 2 + 2));
               }

               var alpha = array[0];
               var blue = array[1];
               var green = array[2];
               var red = array[3];

               //释放零时变量
               array = null;

               return "#" + red + green + blue;
           }
           return "#ffffff";
       }
      ;
   }
   skColorStyle._initialized = true;
}
;
skColorStyle.prototype = new skObject();
//继承于skColorStyle
///////////////////////////////
//skIconStyle
function skIconStyle()
{
   skColorStyle.call(this);
   this.Icon = null;
   this.Scale = 1;
   this.Width = 16;
   this.Height = 16;
   this.HotSpot;
}
;
skIconStyle.prototype = new skColorStyle();

//skLabelStyle
function skLabelStyle()
{
   skColorStyle.call(this);
   this.Scale = 1;
}
;
skLabelStyle.prototype = new skColorStyle();

//skLineStyle
function skLineStyle()
{
   skColorStyle.call(this);
   this.Width = 1;
}
;
skLineStyle.prototype = new skColorStyle();

//skPolyStyle
function skPolyStyle()
{
   skColorStyle.call(this);
   this.Fill = true;
   this.Outline = true;
}
;
skPolyStyle.prototype = new skColorStyle();
///////////////////////////////


//skStyleSelector 样式选取器
function skStyleSelector()
{
   skObject.call(this);
}
;
skStyleSelector.prototype = new skObject();
//继承于skStyleSelector
///////////////////////////////
//skStyle
function skStyle()
{
   skStyleSelector.call(this);
   this.IconStyle = null;
   this.LabelStyle = null;
   this.LineStyle = null;
   this.PolyStyle = null;
   this.BaloonStyle = null;
   this.ListStyle = null;
}
;
skStyle.prototype = new skStyleSelector();

//skPair
function skPair()
{
   skObject.call(this);
   this.Key = "normal";
   this.StyleUrl = "#";
};

skPair.prototype = new skPair();

//skStyleMap
function skStyleMap()
{
   skStyleSelector.call(this);
   this.Pairs = new Array();
}
;
skStyleMap.prototype = new skStyleSelector();
///////////////////////////////

//skSchema
function skSchema(name)
{
   skObject.call(this);
   this.Parent = "Placemark";
   this.Name = name;
}
;
skSchema.prototype = new skObject();

//skIcon
function skIcon(href)
{
   skObject.call(this);
   this.Href = href;
   this.RefreshInterval = 4;
   this.RefreshMode = "onChange";
   this.ViewBoundScale = 1;
   this.ViewFormat = "";
   this.ViewRefreshMode = "never";
   this.ViewRefreshTime = 4;
   this.HttpQuery = "";
}
;
skIcon.prototype = new skObject();


function skLookAt(longitude, latitude, range) {
    skObject.call(this);
    this.Longitude = longitude;
    this.Latitude = latitude;
    this.Range = range;
    this.AltitudeMode = "clampToGround";
    this.Tilt = 0;
    this.Heading = 0;
    this.altitude = 0;
}
;
skLookAt.prototype = new skObject();

//skLatLonBox
function skLatLonBox(north, south, east, west, rotation)
{
   skObject.call(this);
   this.North = north;
   this.South = south;
   this.East = east;
   this.West = west;
   this.Rotation = rotation;
}
;
skLatLonBox.prototype = new skObject();

//skCoordinates
function skCoordinates(latitude, longitude, altitude)
{
   skObject.call(this);
   this.Longitude = latitude;
   this.Latitude = longitude;
   this.Altitude = altitude;
}
;
skCoordinates.prototype = new skObject();

//////////////////////////////////
//skLatLonAltBox
function skLatLonAltBox(north, south, east, west)
{
   skObject.call(this);
   this.North = north;
   this.South = south;
   this.East = east;
   this.West = west;
   this.MinAltitude = 0;
   this.MaxAltitude = 0;
   this.AltitudeMode = "clampToGround";
}
;
skLatLonAltBox.prototype = new skObject();

//skLod
function skLod()
{
   skObject.call(this);
   this.MinLodPixels = 0;
   this.MaxLodPixels = -1;
   this.MinFadeExtent = 0;
   this.MaxFadeExtent = 0;
}
;
skLod.prototype = new skObject();

//skRegion
function skRegion(latLonAltBox)
{
   skObject.call(this);
   this.LatLonAltBox = latLonAltBox;
   this.Lod = null;
};
skRegion.prototype = new skObject();


//skBoundaryIs
function skBoundaryIs(linearRing)
{
   skObject.call(this);
   this.LinearRing = linearRing;
};
skBoundaryIs.prototype = new skObject();


function skOuterBoundaryIs(linearRing)
{
   skObject.call(this);
   this.LinearRing = linearRing;
};
skOuterBoundaryIs.prototype = new skObject();


function skInnerBoundaryIs(linearRing)
{
   skObject.call(this);
   this.LinearRing = linearRing;
};
skInnerBoundaryIs.prototype = new skObject();
//////////////////////////////////

//自动更新对象 小宋自创
function skUpdater() {
    skObject.call(this);
    this.UpdateCondition = "";
    this.Change = null;
    this.Create = null;
    this.Delete = null;
}
skUpdater.prototype = new skObject();

function skChange() {
    skObject.call(this);

    this.targetId = "";
    this.Feature = null;
};
skChange.prototype = new skObject();

/////////////////////////////////////////////////////////////
//skFeature  绘制对象基类
function skFeature()
{
   skObject.call(this);
   this.Name = "";
   this.Visibility = true;
   this.Open = true;
   this.Address = "";
   this.AddressDetails = "";
   this.PhoneNumber = "";
   this.Snippet = "";
   this.Description = "";
   this.StyleUrl = "";
   this.StyleSelectors = new Object();
   this.Region = null;

   //song add
   this.BelongDocument = null;
   this.KMLObjectPath = "";
   this.ParentKmlObjectPath = "";



   if (typeof skFeature._initialized == "undefined")
   {
      skFeature.prototype.ToDraw = function(mySelf,param)
      {
      }
      ;

      skFeature.prototype.ViewChange = function(mySelf,param)
      {
      }
      ;

      skFeature.prototype.ZoomChange = function(mySelf, param) {
      }
      ;

      skFeature.prototype.ToAsynchronousDraw = function(mySelf,param)
      {

      }
      ;

      skFeature.prototype.GetObjectByLocate = function(mySelf,param)
      {
      }
      ;
   }
   skFeature._initialized = true;
}
;
skFeature.prototype = new skObject();


//skTimePrimitive
function skTimePrimitive() {
    skObject.call(this);
    this.id = "";

}
;
skTimePrimitive.prototype = new skObject();


//skTimeSpan 代表由开始和结束“dateTimes”限定的时间范围
function skTimeSpan() {
    skTimePrimitive.call(this);
    this.begin = "";
    this.end = "";
}
;
skTimeSpan.prototype = new skTimePrimitive();

//表示时间长河中的某个瞬间
function skTimeStamp() {
    skTimePrimitive.call(this);
    this.when = "";
};
skTimeStamp.prototype = new skTimePrimitive();



//skContainer
function skContainer()
{
   skFeature.call(this);
};
skContainer.prototype = new skFeature();

//继承skContainer
/////////////////////////////////////////////
//skFolder
function skFolder()
{
   skContainer.call(this);
   this.Features = new Array();

   //var mySelf = this; 为什么好像老是获取数组第一指针
   if (typeof skFolder._initialized == "undefined")
   {
      //绘制方法
       skFolder.prototype.ToDraw = function(mySelf, param) {

           var folderNode = null
           if (param.BelongDocument.DrawObject != null)
           {
               folderNode = param.BelongDocument.DrawObject.VirtualAddFolder(param.BelongDocument.DrawObject, mySelf, param.BelongDocument, param.RootNode);
           }

           for (var num = 0; num < mySelf.Features.length; num++)
           {
               var feature = mySelf.Features[num];
               if (feature != null)
               {
                   feature.ToDraw(feature, param);
               }
               feature = null;
           }
       }
      ;

      //异步绘制方法
       skFolder.prototype.ToAsynchronousDraw = function(mySelf, param) {
           for (var num = 0; num < mySelf.Features.length; num++)
           {
               var feature = mySelf.Features[num];
               if (feature != null)
               {
                   feature.ToDraw(feature, param);
               }
               feature = null;
           }
       }
      ;

      //响应屏幕的变化
      skFolder.prototype.ViewChange = function(mySelf, param) {
          for (var num = 0; num < mySelf.Features.length; num++)
          {
              var feature = mySelf.Features[num];
              if (feature != null)
              {
                  feature.ViewChange(feature, param);
              }
              feature = null;
          }
      }
      ;

      //响应缩放级别的变化
      skFolder.prototype.ZoomChange = function(mySelf, param) {
          for (var num = 0; num < mySelf.Features.length; num++)
          {
              var feature = mySelf.Features[num];
              if (feature != null)
              {
                  feature.ZoomChange(feature, param);
              }
              feature = null;
          }
      }
      ;

      skFolder.prototype.ToRemove = function(mySelf, param) {
          for (var num = 0; num < mySelf.Features.length; num++)
          {
              var feature = mySelf.Features[num];
              if (feature != null)
              {
                  feature.ToRemove(feature, param);
                  delete feature;
                  feature = null;
              }
          }
          delete mySelf.Features;
          mySelf.Features = null;
      }
      ;

      skFolder.prototype.GetObjectByLocate = function(mySelf, param) {
          for (var num = 0; num < mySelf.Features.length; num++)
          {
              var feature = mySelf.Features[num];
              if (feature != null)
              {
                  var returnObj = feature.GetObjectByLocate(feature, param);
                  if (returnObj != null)
                  {
                      return returnObj;
                  }
              }
              feature = null;
          }
          return null;
      };
   }
   skFolder._initialized = true;
}
;
skFolder.prototype = new skContainer();

//skDocument
function skDocument()
{
   skContainer.call(this);
   this.Features = new Array();
   this.Schemas = new Array();
   this.DrawObject = null;
   //存放文档有ID的对象
   this.IDFeatures = new Object();
   this.UpdaterList = new Array();
   //var mySelf = this;
   if (typeof skDocument._initialized == "undefined")
   {
      //绘制方法
       skDocument.prototype.ToDraw = function(mySelf, param) {
           for (var num = 0; num < mySelf.Features.length; num++)
           {
               var feature = mySelf.Features[num];
               if (feature != null)
               {
                   feature.ToDraw(feature, param);
               }
               feature = null;
           }
       };


       skDocument.prototype.UpdateView = function(mySelf, updater, param, isBack) {
           var oldPM = mySelf.IDFeatures[updater.Change.targetId];
           if (oldPM != null)
           {
               if (oldPM.Pointlay != null)
               {
                   if (isBack)
                   {
                       if (oldPM.Pointlay.PlaceMarkID == oldPM.ID)
                       {
                           return;
                       }
                   }
                   else
                   {
                       if (oldPM.Pointlay.PlaceMarkID == updater.Change.Feature.ID)
                       {
                           return;
                       }
                   }

                   if (currentLayerManager != null)
                   {
                       var layer = currentLayerManager.GetKmlLayer(currentLayerManager, param.BelongDocument.Name, oldPM.Geometry.Coordinates);
                       if (layer != null)
                       {
                           layer.removeAllListener();
                           param.map.removeOverlay(layer, false);
                           currentLayerManager.RemoveKmlLayerByID(currentLayerManager, param.BelongDocument.Name, oldPM.Geometry.Coordinates);

                           delete layer;
                           layer = null;
                       }
                   }

                   if (isBack)
                   {
                       oldPM.ToDraw(oldPM, param);
                   }
                   else
                   {
                       var pPoint = new Point(parseFloat(updater.Change.Feature.Geometry.x), parseFloat(updater.Change.Feature.Geometry.y));
                       var icon = icon = new Icon();
                       var title = null;
                       var style = updater.Change.Feature.GetMyStyle(updater.Change.Feature, param);
                       if (style != null)
                       {
                           icon.image = style.IconStyle.Icon.Href;
                           icon.width = 20 * style.IconStyle.Scale;
                           icon.height = 20 * style.IconStyle.Scale;
                       }
                       if (style.LabelStyle != null)
                       {
                           var htmlTextColor = style.LabelStyle.ConvertToHtmlColorString(style.LabelStyle);
                           var htmlColor = "white";
                           var isTransparent = false;
                           title = new Title(updater.Change.Feature.Name, 12, 7, "宋体", htmlColor, htmlTextColor, htmlTextColor, 0);
                           title.bIsTransparent = isTransparent;
                       }
                       oldPM.Pointlay = new Marker(pPoint, icon, title);

                       if (!Ext.isEmpty(updater.Change.Feature.Description))
                       {
                           if (updater.Change.Feature.Description.indexOf("cmd:") >= 0)
                           {
                               var cmdArray = updater.Change.Feature.Description.split('d:');
                               if (cmdArray != null && cmdArray.length == 2)
                               {
                                   DoClickCmd(oldPM.Pointlay, cmdArray[1], cmdArray[0]);
                               }
                           }
                           else if (updater.Change.Feature.Description.indexOf("run:") >= 0)
                           {
                               var cmdArray = updater.Change.Feature.Description.split('n:');
                               if (cmdArray != null && cmdArray.length == 2)
                               {
                                   DoClickCmd(oldPM.Pointlay, cmdArray[1], cmdArray[0]);
                               }
                           }
                           else
                           {
                               DoTips(oldPM.Pointlay, updater.Change.Feature.Description);
                           }
                       }                       
                       
                       if (updater.Change.Feature.ID != "")
                       {
                           oldPM.Pointlay.PlaceMarkID = updater.Change.Feature.ID;
                       }
                       if (currentLayerManager != null)
                       {
                           var isHave = currentLayerManager.IsHaveKmlLayer(currentLayerManager, param.BelongDocument.Name, updater.Change.Feature.Geometry.Coordinates);
                           if (!isHave)
                           {
                               param.map.addOverlay(oldPM.Pointlay, false);
                               currentLayerManager.AddNewKmlLayer(currentLayerManager, param.BelongDocument.Name, updater.Change.Feature.Geometry.Coordinates, oldPM.Pointlay);
                           }
                       }
                   }
               }
           }
       };


      
      //响应缩放级别的变化
       skDocument.prototype.ZoomChange = function(mySelf, param) {

           if (mySelf.UpdaterList != null && mySelf.UpdaterList.length > 0)
           {

               for (var num = 0; num < mySelf.UpdaterList.length; num++)
               {
                   var feature = mySelf.UpdaterList[num];
                   if (feature != null)
                   {
                       if (feature instanceof skPlacemark)
                       {
                       }
                       else if (feature instanceof skUpdater)
                       {
                           if (feature.UpdateCondition != "")
                           {
                               var itemArray = feature.UpdateCondition.split(' ');
                               if (itemArray != null && itemArray.length == 3)
                               {
                                   var level = 0;
                                   if (param.map != null)
                                   {
                                       level = param.map.getZoomLevel();
                                   }
                                   if (itemArray[1] == ">=" && itemArray[0] == "zoom")
                                   {
                                       if (level >= parseInt(itemArray[2]))
                                       {
                                           mySelf.UpdateView(mySelf, feature, param, false);
                                       }
                                       else
                                       {
                                           mySelf.UpdateView(mySelf, feature, param, true);
                                       }
                                   }
                                   else if (itemArray[1] == "<=" && itemArray[0] == "zoom")
                                   {
                                       if (level <= parseInt(itemArray[2]))
                                       {
                                           mySelf.UpdateView(mySelf, feature, param,false);
                                       }
                                       else
                                       {
                                           mySelf.UpdateView(mySelf, feature, param, true);
                                       }
                                   }
                                   else if (itemArray[1] == ">" && itemArray[0] == "zoom")
                                   {
                                       if (level > parseInt(itemArray[2]))
                                       {
                                           mySelf.UpdateView(mySelf, feature, param,false);
                                       }
                                       else
                                       {
                                           mySelf.UpdateView(mySelf, feature, param, true);
                                       }
                                   }
                                   else if (itemArray[1] == "<" && itemArray[0] == "zoom")
                                   {
                                       if (level < parseInt(itemArray[2]))
                                       {
                                           mySelf.UpdateView(mySelf, feature, param,false);
                                       }
                                       else
                                       {
                                           mySelf.UpdateView(mySelf, feature, param, true);
                                       }
                                   }
                                   else if (itemArray[1] == "==" && itemArray[0] == "zoom")
                                   {
                                       if (level == parseInt(itemArray[2]))
                                       {
                                           mySelf.UpdateView(mySelf, feature, param,false);
                                       }
                                       else
                                       {
                                           mySelf.UpdateView(mySelf, feature, param, true);
                                       }
                                   }
                               }
                           }

                       }
                   }
                   feature = null;
               }
           }

           for (var num = 0; num < mySelf.Features.length; num++)
           {
               var feature = mySelf.Features[num];
               if (feature != null)
               {
                   feature.ZoomChange(feature, param);
               }
               feature = null;
           }
       }
      ;

      //响应屏幕的变化
      skDocument.prototype.ViewChange = function(mySelf, param) {
          for (var num = 0; num < mySelf.Features.length; num++)
          {
              var feature = mySelf.Features[num];
              if (feature != null)
              {
                  feature.ViewChange(feature, param);
              }
              feature = null;
          }
      };
      
      //异步绘制方法
      skDocument.prototype.ToAsynchronousDraw = function(mySelf, param) {
          for (var num = 0; num < mySelf.Features.length; num++)
          {
              var feature = mySelf.Features[num];
              if (feature != null)
              {
                  feature.ToAsynchronousDraw(feature, param);
              }
              feature = null;
          }
      }
      ;

      skDocument.prototype.ToRemove = function(mySelf, param) {
          for (var num = 0; num < mySelf.Features.length; num++)
          {
              var feature = mySelf.Features[num];
              if (feature != null)
              {
                  feature.ToRemove(feature, param);
                  delete feature;
                  feature = null;
              }
          }

          delete mySelf.Schemas;
          mySelf.Schemas = null;

          mySelf.DrawObject.ClearAll();

//          delete mySelf.DrawObject;
//          mySelf.DrawObject = null;

          delete mySelf.IDFeatures;
          mySelf.IDFeatures = null;
      }
      ;

      skDocument.prototype.GetObjectByLocate = function(mySelf, param)
      {
         for (var num = 0; num < mySelf.Features.length;
         num++)
         {
            var feature = mySelf.Features[num];
            if (feature != null)
            {
               var returnObj = feature.GetObjectByLocate(feature, param);
               if (returnObj != null)
               {
                  return returnObj;
               }
            }
         }
         return null;
      }
      ;
   }
   skDocument._initialized = true;
}
;
skContainer.prototype = new skContainer();
/////////////////////////////////////////////

///////////////
//skColor
function skColor()
{

}

///////////////
//skOverlay
function skOverlay()
{
   skFeature.call(this);
   this.SysColor = null;
   this.DrawOrder = 0;
   this.Icon = null;
}
;
skOverlay.prototype = new skFeature();

//继承skOverlay
/////////////////////////////////////////////
//skGroundOverlay
function skGroundOverlay(latLonBox)
{
   skOverlay.call(this);
   this.Altitude = 0;
   this.AltitudeMode = "clampToGround";
   this.LatLonBox = latLonBox;

   if (typeof skGroundOverlay._initialized == "undefined")
   {
      skGroundOverlay.prototype.ToDraw = function(mySelf,param)
      {
         if(param.BelongDocument.DrawObject != null && param.BelongDocument != null)
         {
            param.BelongDocument.DrawObject.VirtualDrawGroundOverlay(param.BelongDocument.DrawObject,param);
         }
      }
      ;

      //响应屏幕的变化
      skGroundOverlay.prototype.ViewChange = function(mySelf,param)
      {

      }
      ;

      //响应缩放级别的变化
      skGroundOverlay.prototype.ZoomChange = function(mySelf, param) {

      }
      ;


      skGroundOverlay.prototype.ToAsynchronousDraw = function(mySelf,param)
      {

      }
      ;

      skGroundOverlay.prototype.GetObjectByLocate = function(mySelf,param)
      {

      }
      ;
   }
   skGroundOverlay._initialized = true;
}
;
skGroundOverlay.prototype = new skOverlay();

function skScreenOverlay()
{
   skOverlay.call(this);
   this.Rotation = 0;
   this.OverlayXY = null;
   this.ScreenXY = null;
   this.RotationXY = null;
   this.Size = null;

   if (typeof skScreenOverlay._initialized == "undefined")
   {
      skScreenOverlay.prototype.ToDraw = function(mySelf,param)
      {
         if(param.BelongDocument.DrawObject != null && param.BelongDocument != null)
         {
            param.BelongDocument.DrawObject.VirtualDrawScreenOverlay(param.BelongDocument.DrawObject,param);
         }
      }
      ;

      //响应屏幕的变化
      skScreenOverlay.prototype.ViewChange = function(mySelf,param)
      {

      }
      ;

      //响应缩放级别的变化
      skScreenOverlay.prototype.ZoomChange = function(mySelf, param) {

      }
      ;

      skScreenOverlay.prototype.ToAsynchronousDraw = function(mySelf,param)
      {

      }
      ;

      skScreenOverlay.prototype.GetObjectByLocate = function(mySelf,param)
      {

      }
      ;
   }
   skScreenOverlay._initialized = true;
}
;
skScreenOverlay.prototype = new skOverlay();

/////////////////////////////////////////////



//几何形状Geometry
function skLink()
{
   skObject.call(this);
   this.RefreshMode = "onChange";
   this.Href = "";
   this.RefreshInterval = 4;
   this.ViewRefreshMode = "onStop";
   this.ViewRefreshTime = 4;
   this.ViewBoundScale = 1;
   this.ViewFormat = "BBOX=[bboxWest],[bboxSouth],[bboxEast],[bboxNorth]";
   this.HttpQuery = "";
   this.PostParam = "";

   //内部需要
   this.isChangeViewUsed = false;
   this.ChangeTimeId;
   this.IntervalTimeId;
   this.KMLDocument = null;

   if (typeof skLink._initialized == "undefined")
   {
      //绘制方法
      skLink.prototype.ToDraw = function(mySelf, param)
      {
         if (mySelf.RefreshMode == "onInterval")
         {
             mySelf.IntervalTimeId = skLink.prototype.IntervalRun.defer(mySelf.RefreshInterval, skLink.prototype.IntervalRun, [mySelf, {BelongDocument : param.BelongDocument}]);
         }
      }
      ;

      //响应屏幕的变化
      //GIS界面改变时候调用 param 必须是数组
      skLink.prototype.ViewChange = function(mySelf, param)
      {
          mySelf.isChangeViewUsed = true;
          mySelf.HttpQuery = param.Args.GetViewFormat(mySelf.ViewFormat);
          if (mySelf.ViewRefreshMode == "onStop") {
              if (mySelf.ChangeTimeId != null) {
                  window.clearTimeout(mySelf.ChangeTimeId);
              }
              mySelf.ChangeTimeId = skLink.prototype.ViewChangeRun.defer(mySelf.ViewRefreshTime * 1000, skLink.prototype.ViewChangeRun, param);
          }
      }
      ;


      //响应缩放级别的变化
      skLink.prototype.ZoomChange = function(mySelf, param) {

      }
      ;

      skLink.prototype.ViewChangeRun = function(mySelf, param)
      {
         mySelf.GetLinkContent(mySelf, param);
         mySelf.isChangeViewUsed = false;
      }
      ;

      skLink.prototype.IntervalRun = function(mySelf,param)
      {
          if (mySelf.IntervalTimeId != null) {
              window.clearTimeout(mySelf.IntervalTimeId);
          }
         //如果有移动刷新正在用，则定时刷新则避让
         if (mySelf.isChangeViewUsed)
         {
            mySelf.IntervalTimeId = skLink.prototype.IntervalRun.defer(mySelf.RefreshInterval * 1000, skLink.prototype.IntervalRun, [mySelf, { BelongDocument: param.BelongDocument}]);
            return;
         }
         if (param.BelongDocument != null && param.BelongDocument.DrawObject != null) {
             mySelf.HttpQuery = param.BelongDocument.DrawObject.ViewArgsDelegate(param.BelongDocument.DrawObject,mySelf);
         }
         mySelf.GetLinkContent(mySelf,param);
         mySelf.IntervalTimeId = skLink.prototype.IntervalRun.defer(mySelf.RefreshInterval * 1000, skLink.prototype.IntervalRun, [mySelf, { BelongDocument: param.BelongDocument}]);
      }
      ;

      skLink.prototype.GetLinkCallBack = function(param, success, response) {
          if (success)
          {
              if (response.responseText == "cmd:stop")
              {
                  return;
              }
              if (param.params.MySelf.KMLDocument != null)
              {
//                  if (param.params.MySelf.KMLDocument.Content == response.responseText)
//                  {
//                      return;
//                  }
                  param.params.MySelf.KMLDocument.ToRemove(param.params.MySelf.KMLDocument,
                   {
                       BelongDocument: param.params.BelongDocument
                   }
               );
                  delete param.params.MySelf.KMLDocument;
                  param.params.MySelf.KMLDocument = null;
              }

              if (response.responseText == "")
              {
                  return;
              }
              var kmlParse = new skKmlParse();
              param.params.MySelf.KMLDocument = kmlParse.ParseKmlString(kmlParse, response.responseText);
              param.params.MySelf.KMLDocument.Name = param.params.BelongDocument.Name;
              param.params.MySelf.KMLDocument.DrawObject = param.params.BelongDocument.DrawObject;
              param.params.MySelf.KMLDocument.ToDraw(param.params.MySelf.KMLDocument,
                {
                    BelongDocument: param.params.MySelf.KMLDocument
                }
            );

              delete kmlParse;
              kmlParse = null;
          }
          else
          {

          }
      }
      ;

      skLink.prototype.GetLinkContent = function(mySelf, param)
      {
         try
         {
            if (param.BelongDocument != null && param.BelongDocument.DrawObject != null)
            {
               param.BelongDocument.DrawObject.FreshLinkState(mySelf.ParentKmlObjectPath, "beginRequest");
            }

            var url = mySelf.Href;
            if (url.indexOf("?") >= 0)
            {
                url += "&" + mySelf.HttpQuery;
            }
            else
            {
                url += "?" + mySelf.HttpQuery;
            }
            
            
            //这个执行需要引入 ExtJS
            Ext.Ajax.request(
            {
               url: url,
               callback : skLink.prototype.GetLinkCallBack,
               method: mySelf.PostParam == "" ? "GET" : "POST",
               params:
               {
                  MySelf : mySelf , BelongDocument : param.BelongDocument,PostParam : mySelf.PostParam
               }
            }
            );

         }
         catch (ex)
         {
            if (param.BelongDocument != null && param.BelongDocument.DrawObject != null)
            {
               param.BelongDocument.DrawObject.FreshLinkState(mySelf.ParentKmlObjectPath, "badRequest");
            }
         }
      }
      ;

      //异步绘制方法
      skLink.prototype.ToAsynchronousDraw = function (mySelf, param)
      {

      }
      ;

      skLink.prototype.ToRemove = function (mySelf,param)
      {

          if (mySelf.IntervalTimeId != null) {
              window.clearTimeout(mySelf.IntervalTimeId);
          }
         if (mySelf.KMLDocument != null)
         {
            mySelf.KMLDocument.ToRemove(mySelf.KMLDocument,
            {
               BelongDocument : param.BelongDocument
            }
            );
            delete mySelf.KMLDocument;
            mySelf.KMLDocument = null;
         }
      }
      ;
   }
   skLink._initialized = true;
}
skLink.prototype = new skObject();







//skPlacemark
function skNetworkLink()
{
   skFeature.call(this);
   this.Link = null;
   this.Open = true;
   this.Name = "";
   this.RefreshVisibility = false;
   this.FlyToView = false;

   //var mySelf = this;
   if (typeof skNetworkLink._initialized == "undefined")
   {
      //绘制方法
      skNetworkLink.prototype.ToDraw = function (mySelf,param)
      {
         if (mySelf.Link != null)
         {
            mySelf.Link.ToDraw(mySelf.Link, param);
         }
      }
      ;

      //异步绘制方法
      skNetworkLink.prototype.ToAsynchronousDraw = function (mySelf, param)
      {

      }
      ;


      //响应屏幕的变化
      skNetworkLink.prototype.ViewChange = function(mySelf, param) {

      }
      ;

      //响应缩放级别的变化
      skNetworkLink.prototype.ZoomChange = function(mySelf, param) {

      }
      ;

      skNetworkLink.prototype.ToRemove = function(mySelf, param) {
          if (mySelf.Link != null)
          {
              mySelf.Link.ToRemove(mySelf.Link, param);
              delete mySelf.Link;
              mySelf.Link = null;
          }
          if (mySelf.StyleSelectors != null)
          {
              delete mySelf.StyleSelectors;
              mySelf.StyleSelectors = null;
          }
      }
      ;
   }
   skNetworkLink._initialized = true;
}
;
skNetworkLink.prototype = new skFeature();




//skPlacemark
function skPlacemark()
{
   skFeature.call(this);
   this.Geometry = null;
   this.Name = "";
   this.TimePrimitive = null;
   this.LookAt = null;
   
   //暂存点层的指针
   this.Pointlay = null;
   this.Linelay = null;
   
   if (typeof skPlacemark._initialized == "undefined")
   {
      //绘制方法
       skPlacemark.prototype.ToDraw = function(mySelf, param) {
           if (mySelf.Geometry != null)
           {
               //获取样式信息
               var style = mySelf.GetMyStyle(mySelf, param);

               //画点
               if (mySelf.Geometry instanceof skPoint)
               {
                   //获取点信息
                   var point = mySelf.Geometry;

                   if (param.BelongDocument.DrawObject != null)
                   {
                       param.BelongDocument.DrawObject.VirtualDrawPoint(param.BelongDocument.DrawObject,
                  {
                      PlaceMark: mySelf, Style: style, Point: point, BelongDocument: param.BelongDocument
                  }
                  );
                   }

                   //释放零时变量
                   point = null;
               }
               //画线
               if (mySelf.Geometry instanceof skLineString)
               {

                   //获取线信息
                   var line = mySelf.Geometry;

                   if (param.BelongDocument.DrawObject != null)
                   {
                       param.BelongDocument.DrawObject.VirtualDrawLine(param.BelongDocument.DrawObject,
                  {
                      PlaceMark: mySelf, Style: style, Line: line, BelongDocument: param.BelongDocument
                  }
                  );
                   }
                   //释放零时变量
                   line = null;
               }
               //画多边形
               if (mySelf.Geometry instanceof skPolygon)
               {

                   //获取多边信息
                   var polygon = mySelf.Geometry;

                   if (param.BelongDocument.DrawObject != null)
                   {
                       param.BelongDocument.DrawObject.VirtualDrawPolygon(param.BelongDocument.DrawObject,
                  {
                      PlaceMark: mySelf, Style: style, Polygon: polygon, BelongDocument: param.BelongDocument
                  }
                  );
                   }
                   //释放零时变量
                   polygon = null;
               }
           }
       }
      ;


      //异步绘制方法
      skPlacemark.prototype.ToAsynchronousDraw = function(mySelf, param)
      {
         if (param.KeepList != null && mySelf.Geometry != null && mySelf.Geometry.Coordinates != null)
         {
            var keepObj = param.KeepList[mySelf.Geometry.Coordinates]
            if (keepObj != null)
            {
               return;
            }
         }

         if (threadRunner != null)
         {
            threadRunner.startNewTask(function()
            {
               mySelf.ToDraw(param.IMap, mySelf, param.BelongDocument, null);

            }
            );
            if (threadRunner.getAction() < 10)
            {
               threadRunner.addAction();
            }
         }
      }
      ;


      //响应屏幕的变化
      skPlacemark.prototype.ViewChange = function(mySelf, param) {

      }
      ;

      //响应缩放级别的变化
      skPlacemark.prototype.ZoomChange = function(mySelf, param) {

      }
      ;

      skPlacemark.prototype.GetObjectByLocate = function(mySelf, param)
      {
         if (mySelf.Geometry != null)
         {
            if (mySelf.Geometry.Coordinates == param.locate)
            {
               return mySelf;
            }
         }
         return null;
      }
      ;

      skPlacemark.prototype.GetMyStyle = function(mySelf, param) {

          var style = null;
          if (mySelf.StyleUrl != "")
          {
              style = mySelf.GetStyle(param.BelongDocument, mySelf.StyleUrl);
              if (style != null)
              {
                  if (style instanceof skStyle)
                  {

                  }
                  else if (style instanceof skStyleMap)
                  {
                      if (style != null)
                      {
                          for (var i = 0; i < style.Pairs.length; i++)
                          {
                              if (style.Pairs[i].Key == "normal")
                              {
                                  var oneStyle = mySelf.GetStyle(param.BelongDocument, style.Pairs[i].StyleUrl);
                                  if (oneStyle != null)
                                  {
                                      style = oneStyle;
                                  }
                              }
                          }
                      }
                  }
              }
          }
          else if (mySelf.StyleSelectors != null)
          {
              for (var key in mySelf.StyleSelectors)
              {
                  var st = mySelf.StyleSelectors[key];
                  if (st != null)
                  {
                      style = st;
                  }
                  key = null;
              }
          }
          return style;
      };

      skPlacemark.prototype.GetStyle = function(belongDocument, styleUrl)
      {
         if (styleUrl.indexOf("#") == 0)
         {
            var styleId = styleUrl.substring(1, styleUrl.length);
            var style = belongDocument.StyleSelectors[styleId];
            if (style != null)
            {
               return style;
            }
         }
         else
         {
            var styleId = styleUrl;
            var style = belongDocument.StyleSelectors[styleId];
            if (style != null)
            {
               return style;
            }
         }
         return null;
      }
      ;

      skPlacemark.prototype.ToRemove = function(mySelf, param) {
          if (param.BelongDocument.DrawObject != null && mySelf.Geometry != null)
          {
              param.BelongDocument.DrawObject.RemoveOverlay(param.BelongDocument.DrawObject, param, mySelf.Geometry.Coordinates);
          }

          mySelf.Pointlay = null;
          mySelf.Linelay = null;
          delete mySelf.Geometry;
          mySelf.Geometry = null;

          if (mySelf.StyleSelectors != null)
          {
              delete mySelf.StyleSelectors;
              mySelf.StyleSelectors = null;
          }
      }
      ;
   }
   skPlacemark._initialized = true;
}
;
skPlacemark.prototype = new skFeature();


//几何形状Geometry
function skGeometry()
{
   skObject.call(this);

}
skGeometry.prototype = new skObject();

//继承于skGeometry
function skPoint(x,y)
{
   skGeometry.call(this);
   this.Extrude = false;
   this.Tessellate = false;
   this.AltitudeMode = "clampToGround";
   this.Coordinates = "";
   this.x=x;
   this.y=y;
}
;
skPoint.prototype = new skGeometry();

//skLineString
function skLineString(coordinatesArray)
{
   skGeometry.call(this);
   this.Extrude = false;
   this.Tessellate = false;
   this.AltitudeMode = "clampToGround";
   this.CoordinatesArray = coordinatesArray;
   this.Points = null;
}
;
skLineString.prototype = new skGeometry();


function skLinearRing(coordinatesArray)
{
   skGeometry.call(this);
   this.Extrude = false;
   this.Tessellate = false;
   this.AltitudeMode = "clampToGround";
   this.CoordinatesArray = coordinatesArray;
}
;
skLinearRing.prototype = new skGeometry();


function skPolygon()
{
   skGeometry.call(this);
   this.Extrude = false;
   this.Tessellate = false;
   this.AltitudeMode = "clampToGround";
   this.InnerBoundaries = new Array();
   this.OuterBoundaryIs = new Array();
}
;
skPolygon.prototype = new skGeometry();
////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////
var PlayerEvents = new Object();
//播放器播放帧事件
PlayerEvents.PlayStep = "MSG.Events.Player.PlayStep";
//播放器重播事件
PlayerEvents.PlayAgain = "MSG.Events.Player.PlayAgain";
//播放器开始播放事件
PlayerEvents.PlayBegin = "MSG.Events.Player.PlayBegin";
//播放器停播事件
PlayerEvents.PlayStop = "MSG.Events.Player.PlayStop";
//播放器调快事件
PlayerEvents.MakeQuickly = "MSG.Events.Player.MakeQuickly";
//播放器调慢事件
PlayerEvents.MakeSlowly = "MSG.Events.Player.MakeSlowly";
//播放器暂停
PlayerEvents.PlayPause = "MSG.Events.Player.PlayPause";


var KmlParserEvents = new Object();
//KML解析器需要播放事件
KmlParserEvents.NeedPlay = "MSG.Events.KmlParser.NeedPlay";



//小宋定义的事件机制
/**
* 加入监听器支持，所有需要被监听的模型对象要继承它
* 或者拷贝它的属性(ListenerSupport.apply(this))
* 
* 
*/
function ListenerSupport() {

    //~ Field
    /** 监听者集合 An array [params] of listener */
    this.listeners = new Array();

    /** 参数值集合 An array [params] of values.*/
    this.values = new Array();

    //~ Method
    /**
    * 增加一个监听者
    *
    * @param param 监听者关注参数
    * @param listener 监听者
    */
    this.addListener = function (param, listener) {
        if (!this.listeners[param]) {
            this.listeners[param] = new Array();
        }
        // 移除旧的
        this.removeListener(param, listener);
        // 加入新的
        this.listeners[param].push(listener);
    };

    /**
    * 增加一个监听者到监听队列首位
    */
    this.addFirstListener = function (param, listener) {
        if (!this.listeners[param]) {
            this.listeners[param] = new Array();
        }
        this.removeListener(param, listener);
        this.listeners[param].unshift(listener);
    };

    /**
    * 移除一个监听器
    *
    * @param param
    * @param listener
    */
    this.removeListener = function (param, listener) {
        if (this.listeners[param]) {
            for (var i = 0; i < this.listeners[param].length; i++) {
                if (this.listeners[param][i] == listener) {
                    for (var j = i; i < this.listeners[param].length - 1; i++) {
                        this.listeners[param][j] = this.listeners[param][j + 1];
                    }
                    this.listeners[param].pop();
                    return;
                }
            }
        }
    };

    /**
    * 通知某参数的所有监听者参数改变
    *
    * @param param 监听者关注参数
    * @param value 参数新的值
    */
    this.notifyListeners = function (param, newValue) {
        if (this.listeners[param]) {
            var count = this.listeners[param].length;
            for (var i = 0; i < count; i++) {
                if (this.listeners[param][i]) {
                    // 执行监听者的方法
                    this.listeners[param][i].propertyChange(param, newValue);
                }
            }
        }
    };

    /**
    * 改变某关注参数的值
    *
    * @param param 要改变的参数
    * @parma value 参数新的值
    */
    this.firePropertyChange = function (param, newValue) {
        this.values[param] = newValue;
        this.notifyListeners(param, newValue);
    };

    /**
    * 获得某关注参数的值
    */
    this.getParamValue = function (param) {
        return this.values[param];
    };
};






//以上是kml对象
///////////////


//kml解析对象
function skKmlParse() {

    var me = this;
    /** 加入监听器支持 */
    ListenerSupport.apply(this);

    /** KML解析器事件集合 */
    this.events = new Object();
    //判断此文档是否需要绘制
    this.IsNeedDraw = true;
    this.PlayList = new Array();

    this.IsChrome = false;

    /** 构造方法 */
    {
        this.addListener(KmlParserEvents.NeedPlay, this);

        this.events[KmlParserEvents.NeedPlay] = new Object();
    }


    this.propertyChange = function(param, newValue) {

        if (param == KmlParserEvents.NeedPlay)
        {
            me.fireEvents(param);
        }
    };

    this.fireEvents = function(param) {
        //响应事件
        var someEvents = me.events[param];
        if (someEvents != null)
        {
            for (eventName in someEvents)
            {
                someEvents[eventName](me, param);
            }
        }
    };


    //增加播放帧事件
    this.AddNeedPlayEvent = function(fnName, fn) {
        var events = me.events[KmlParserEvents.NeedPlay];
        if (events == null)
        {
            events = new Object();
        }
        events[fnName] = fn;
    };


   this.ParsedDocument = null;
   this.LastPlacemark = null;

   if (typeof skKmlParse._initialized == "undefined")
   {
      //绘制方法
       skKmlParse.prototype.ParseKmlString = function(mySelf, kmlString, kmlName) {
           var xmlDoc = mySelf.LoadXml(kmlString);
           if (xmlDoc == null)
           {
               alert('您的浏览器不支持xml文件读取,于是本页面禁止您的操作,推荐使用IE5.0以上可以解决此问题!');
           }
           else
           {
               var parseKmlString = mySelf.ParseKmlDocument(mySelf, xmlDoc, kmlName);
               if (parseKmlString != null)
               {
                   parseKmlString.Content = kmlString;
                   parseKmlString.UpdaterList = mySelf.PlayList;
               }
               xmlDoc = null;
               return parseKmlString;
           }
           return null;
       }
      ;

       skKmlParse.prototype.ParseKmlDocument = function(mySelf, kmlDocument, kmlName) {
           if (!kmlDocument.hasChildNodes())
           {
               return null;
           }
           var kmlDoc = null;
           var nodelist = kmlDocument.documentElement.childNodes;
           for (var i = 0; i < nodelist.length; i++)
           {
               if (nodelist[i].nodeName.toLowerCase() == "document" || nodelist[i].nodeName.toLowerCase() == "kml")
               {
                   kmlDoc = mySelf.ParseDocumentElement(mySelf, nodelist[i], kmlName);
               }
               else if (nodelist[i].nodeName.toLowerCase() == "networklink")
               {
                   kmlDoc = mySelf.ParseNetworkLinkElement(mySelf, nodelist[i]);
               }
           }
           mySelf.ParsedDocument = kmlDoc;
           if (mySelf.PlayList != null && mySelf.PlayList.length > 0)
           {
               mySelf.notifyListeners(KmlParserEvents.NeedPlay, mySelf);
           }

           //释放零时变量
           nodelist = null;
           return kmlDoc;
       }
      ;


      skKmlParse.prototype.ParseNetworkLinkElement = function(mySelf, networkLinkElement,parentObjectPath,pathNum)
      {
         if (!networkLinkElement.hasChildNodes())
         {
            return null;
         }
         var network = new skNetworkLink();
         network.ParentKmlObjectPath = parentObjectPath;
         network.KMLObjectPath = parentObjectPath + "/" + pathNum.toString() + "_networklink";
         var nodelist = networkLinkElement.childNodes;
         for (var i = 0; i < nodelist.length; i++)
         {
            if (nodelist[i].nodeName.toLowerCase() == "open")
            {
                var openVal = "";
                if (mySelf.IsChrome) {
                    openVal = nodelist[i].textContent;
                }
                else {
                    openVal = nodelist[i].text;
                }
                if (openVal == "0") {
                    network.Open = false;
                }
                else {
                    network.Open = true;
                }
            }
            else if (nodelist[i].nodeName.toLowerCase() == "name")
            {
                if (mySelf.IsChrome) {
                    network.Name = nodelist[i].textContent;
                }
                else {
                    network.Name = nodelist[i].text;
                }
            }
            else if (nodelist[i].nodeName.toLowerCase() == "link" || nodelist[i].nodeName.toLowerCase() == "url")
            {
               network.Link = this.ParseLinkElement(mySelf, nodelist[i]);
            }
            else if (nodelist[i].nodeName.toLowerCase() == "flytoview")
            {
                var flytoviewVal = "";
                if (mySelf.IsChrome) {
                    flytoviewVal = nodelist[i].textContent;
                }
                else {
                    flytoviewVal = nodelist[i].text;
                }
                if (flytoviewVal == "1")
               {
                  network.FlyToView = true;
               }
               else
               {
                  network.FlyToView = false;
               }
            }
        }
        //释放零时变量
        nodelist = null;
         return network;
      };

       
      skKmlParse.prototype.GetElementContent = function (mySelf,contentElement) {

          if (mySelf.IsChrome) {
                return contentElement.textContent;
            }
            else {
                return contentElement.text;
            }

      };

      skKmlParse.prototype.GetSonElement = function (mySelf, contentElement,nodeName) {

          if (mySelf.IsChrome) {
              return contentElement.getElementsByTagName(nodeName)[0];
          }
          else {
              return contentElement.selectSingleNode(nodeName);
          }
      };

      skKmlParse.prototype.ParseLinkElement = function (mySelf, linkElement)
      {
         if (!linkElement.hasChildNodes())
         {
            return null;
         }
         var link = new skLink();
         var nodelist = linkElement.childNodes;
         for (var i = 0; i < nodelist.length; i++)
         {
            if (nodelist[i].nodeName.toLowerCase() == "href")
            {
                link.Href = mySelf.GetElementContent(mySelf,nodelist[i]);
            }
            else if (nodelist[i].nodeName.toLowerCase() == "viewrefreshmode")
            {
                link.ViewRefreshMode = mySelf.GetElementContent(mySelf,nodelist[i]);
            }
            else if (nodelist[i].nodeName.toLowerCase() == "viewrefreshtime")
            {
                link.ViewRefreshTime = mySelf.GetElementContent(mySelf,nodelist[i]);
            }
            else if (nodelist[i].nodeName.toLowerCase() == "refreshmode")
            {
                link.RefreshMode = mySelf.GetElementContent(mySelf,nodelist[i]);
            }
            else if (nodelist[i].nodeName.toLowerCase() == "refreshinterval")
            {
                link.RefreshInterval = mySelf.GetElementContent(mySelf,nodelist[i]) * 1;
            }
            else if (nodelist[i].nodeName.toLowerCase() == "viewformat")
            {
                link.ViewFormat = mySelf.GetElementContent(mySelf,nodelist[i]);
            }
            else if (nodelist[i].nodeName.toLowerCase() == "postparam") {
                link.PostParam = mySelf.GetElementContent(mySelf,nodelist[i]);
            }
        }
        //释放零时变量
        nodelist = null;
         return link;
      }
      ;

      skKmlParse.prototype.ParseDocumentElement = function(mySelf, documentElement, kmlName) {
          if (!documentElement.hasChildNodes())
          {
              return null;
          }
          var doc = new skDocument();
          doc.KMLObjectPath = kmlName;
          doc.ParentKmlObjectPath = kmlName;
          var pathNum = 0;

          var nodelist = documentElement.childNodes;
          for (var i = 0; i < nodelist.length; i++)
          {
              if (nodelist[i].nodeName.toLowerCase() == "placemark")
              {
                  var placemarkObject = mySelf.ParsePlaceMarkElement(mySelf, nodelist[i], doc.KMLObjectPath, pathNum);
                  if (placemarkObject != null)
                  {
                      pathNum++;
                      placemarkObject.BelongDocument = doc;
                      placemarkObject.Content = mySelf.GetElementContent(mySelf,nodelist[i]);
                      doc.Features.push(placemarkObject);
                      //收集播放对象
                      if (placemarkObject.TimePrimitive != null)
                      {
                          mySelf.PlayList.push(placemarkObject);
                      }
                      //存放有ID的对象
                      if (placemarkObject.ID != null && placemarkObject.ID != "")
                      {
                          doc.IDFeatures[placemarkObject.ID] = placemarkObject;
                      }
                  }
              }
              else if (nodelist[i].nodeName.toLowerCase() == "update")
              {
                  var updateObject = mySelf.ParseUpdaterElement(mySelf, nodelist[i], doc.KMLObjectPath, pathNum);
                  if (updateObject != null)
                  {
                      mySelf.PlayList.push(updateObject);
                      updateObject = null;
                  }
              }
              else if (nodelist[i].nodeName.toLowerCase() == "style")
              {
                  var styleurlObject = mySelf.ParseStyleUrlElement(mySelf, nodelist[i]);
                  if (styleurlObject != null)
                  {
                      doc.StyleSelectors[styleurlObject.ID] = styleurlObject;
                      styleurlObject = null;
                  }
              }
              else if (nodelist[i].nodeName.toLowerCase() == "stylemap")
              {
                  var styleselectorObject = mySelf.ParseStyleSelectorElement(mySelf, nodelist[i]);
                  if (styleselectorObject != null)
                  {
                      doc.StyleSelectors[styleselectorObject.ID] = styleselectorObject;
                      styleselectorObject = null;
                  }
              }
              else if (nodelist[i].nodeName.toLowerCase() == "folder")
              {
                  var folderObject = mySelf.ParseFolderElement(mySelf, nodelist[i], doc.KMLObjectPath, pathNum);
                  if (folderObject != null)
                  {
                      doc.Features.push(folderObject);
                      folderObject = null;
                  }
              }
              else if (nodelist[i].nodeName.toLowerCase() == "document")
              {
                  doc = mySelf.ParseDocumentElement(mySelf, nodelist[i], kmlName);
              }
              else if (nodelist[i].nodeName.toLowerCase() == "groundoverlay")
              {
                  var groundOverlayObject = mySelf.ParseGroundOverlayElement(mySelf, nodelist[i], doc.KMLObjectPath, pathNum);
                  if (groundOverlayObject != null)
                  {
                      pathNum++;
                      groundOverlayObject.BelongDocument = doc;
                      groundOverlayObject.Content = nodelist[i].text;
                      doc.Features.push(groundOverlayObject);
                      groundOverlayObject = null;
                  }
              }
              else if (nodelist[i].nodeName.toLowerCase() == "screenoverlay")
              {
                  var screenOverlayObject = mySelf.ParseScreenOverlayElement(mySelf, nodelist[i], doc.KMLObjectPath, pathNum);
                  if (screenOverlayObject != null)
                  {
                      pathNum++;
                      screenOverlayObject.BelongDocument = doc;
                      screenOverlayObject.Content = mySelf.GetElementContent(mySelf,nodelist[i]);
                      doc.Features.push(screenOverlayObject);
                      screenOverlayObject = null;
                  }
              }
              else if (nodelist[i].nodeName.toLowerCase() == "networklink")
              {
                  var networkLink = mySelf.ParseNetworkLinkElement(mySelf, nodelist[i], doc.KMLObjectPath, pathNum);
                  if (networkLink != null)
                  {
                      pathNum++;
                      networkLink.BelongDocument = doc;
                      networkLink.Content = mySelf.GetElementContent(mySelf,nodelist[i]);
                      doc.Features.push(networkLink);
                      networkLink = null;
                  }
              }
          }
          //释放零时变量
          nodelist = null;
          return doc;
      }
      ;

      skKmlParse.prototype.ParseStyleUrlElement = function (mySelf, styleUrlElement)
      {
         if (!styleUrlElement.hasChildNodes())
         {
            return null;
         }
         var style = new skStyle();
         var idAttribute = styleUrlElement.getAttribute("id");
         if (idAttribute != null)
         {
            style.ID = idAttribute;
         }
         var nodelist = styleUrlElement.childNodes;
         for (var i = 0; i < nodelist.length; i++)
         {
            if (nodelist[i].nodeName.toLowerCase() == "iconstyle")
            {
               style.IconStyle = mySelf.ParseIconStyleElement(mySelf, nodelist[i]);
            }
            else if (nodelist[i].nodeName.toLowerCase() == "labelstyle")
            {
               style.LabelStyle = mySelf.ParseLabelStyleElement(mySelf, nodelist[i]);
            }
            else if (nodelist[i].nodeName.toLowerCase() == "linestyle")
            {
               style.LineStyle = mySelf.ParseLineStyleElement(mySelf, nodelist[i]);
            }
            else if (nodelist[i].nodeName.toLowerCase() == "polystyle")
            {
               style.PolyStyle = mySelf.ParsePolyStyleElement(mySelf, nodelist[i]);
            }
        }
        //释放零时变量
        nodelist = null;
         return style;
      }
      ;

      skKmlParse.prototype.ParsePolyStyleElement = function (mySelf, polyStyleElement)
      {
         if (!polyStyleElement.hasChildNodes())
         {
            return null;
         }
         var polyStyle = new skPolyStyle();
         var colorNode = mySelf.GetSonElement(mySelf,polyStyleElement,"color");
         if (colorNode != null)
         {
             polyStyle.Color = mySelf.GetElementContent(mySelf,colorNode); 
         }
         var colorModeNode = mySelf.GetSonElement(mySelf,polyStyleElement,"colorMode");
         if (colorModeNode != null)
         {
             polyStyle.ColorMode = mySelf.GetElementContent(mySelf,colorModeNode);
         }
         return polyStyle;
      };

      skKmlParse.prototype.ParseLineStyleElement = function (mySelf, lineStyleElement)
      {
         if (!lineStyleElement.hasChildNodes())
         {
            return null;
         }
         var lineStyle = new skLineStyle();
         var colorNode = mySelf.GetSonElement(mySelf,lineStyleElement,"color");
         if (colorNode != null)
         {
             lineStyle.Color = mySelf.GetElementContent(mySelf,colorNode);
         }
         var widthNode = mySelf.GetSonElement(mySelf,lineStyleElement,"width");
         if (widthNode != null)
         {
             lineStyle.Width = mySelf.GetElementContent(mySelf,widthNode); 
         }
         //释放零时变量
         nodelist = null;
         return lineStyle;
      }
      ;

      skKmlParse.prototype.ParseLabelStyleElement = function(mySelf, labelStyleElement) {
          if (!labelStyleElement.hasChildNodes())
          {
              return null;
          }
          var labelStyle = new skLabelStyle();
          var colorNode = mySelf.GetSonElement(mySelf,labelStyleElement,"color");
          if (colorNode != null)
          {
              labelStyle.Color = mySelf.GetElementContent(mySelf,colorNode);
          }
          colorNode = null;
          var scaleNode = mySelf.GetSonElement(mySelf,labelStyleElement,"scale");
          if (scaleNode != null)
          {
              labelStyle.Scale = mySelf.GetElementContent(mySelf,scaleNode); 
          }
          scaleNode = null;
          return labelStyle;
      }
      ;

      skKmlParse.prototype.ParseIconStyleElement = function(mySelf, iconStyleElement) {
          if (!iconStyleElement.hasChildNodes())
          {
              return null;
          }
          var iconStyle = new skIconStyle();
          var colorNode = mySelf.GetSonElement(mySelf,iconStyleElement,"color");
          if (colorNode != null)
          {
              iconStyle.Color = mySelf.GetElementContent(mySelf,colorNode);
          }
          colorNode = null;
          var scaleNode = mySelf.GetSonElement(mySelf,iconStyleElement,"scale");
          if (scaleNode != null)
          {
              iconStyle.Scale = parseFloat(mySelf.GetElementContent(mySelf,scaleNode));
          }
          scaleNode = null;

          var heightNode = mySelf.GetSonElement(mySelf,iconStyleElement,"height");
          if (heightNode != null) {
              iconStyle.Height = parseInt(mySelf.GetElementContent(mySelf,heightNode));
          }
          heightNode = null;

          var widthNode = mySelf.GetSonElement(mySelf,iconStyleElement,"width");
          if (widthNode != null) {
              iconStyle.Width = parseInt(mySelf.GetElementContent(mySelf,widthNode));
          }
          widthNode = null;
          var iconNode = mySelf.GetSonElement(mySelf,iconStyleElement,"Icon");
          if (iconNode != null)
          {
              var hrefNode = mySelf.GetSonElement(mySelf, iconNode, "href");
              if (hrefNode != null) {
                  var icon = new skIcon(mySelf.GetElementContent(mySelf, hrefNode))
                  iconStyle.Icon = icon;
              }
          }
          iconNode = null;
          return iconStyle;
      }
      ;

      skKmlParse.prototype.ParseStyleSelectorElement = function(mySelf, styleMapElement) {
          if (!styleMapElement.hasChildNodes())
          {
              return null;
          }
          var styleMap = new skStyleMap();
          var idAttribute = styleMapElement.getAttribute("id");
          if (idAttribute != null)
          {
              styleMap.ID = idAttribute;
          }
          var nodelist = styleMapElement.childNodes;
          for (var i = 0; i < nodelist.length; i++)
          {
              if (nodelist[i].nodeName.toLowerCase() == "pair")
              {
                  var pair = new skPair();
                  var keyNode = mySelf.GetSonElement(mySelf,nodelist[i],"key");
                  if (keyNode != null)
                  {
                      pair.Key = mySelf.GetElementContent(mySelf,keyNode);
                  }
                  keyNode = null;
                  var styleUrlNode = mySelf.GetSonElement(mySelf,nodelist[i],"styleUrl");
                  if (styleUrlNode != null)
                  {
                      pair.StyleUrl = mySelf.GetElementContent(mySelf,styleUrlNode);
                  }
                  styleUrlNode = null;
                  styleMap.Pairs.push(pair);
              }
          }

          return styleMap;
      }
      ;

      skKmlParse.prototype.ParseFolderElement = function(mySelf, folderElement, parentObjectPath, pathNum, belongDocument) {
          if (!folderElement.hasChildNodes())
          {
              return null;
          }
          var folder = new skFolder();
          folder.ParentKmlObjectPath = parentObjectPath;
          folder.KMLObjectPath = parentObjectPath + "/" + pathNum.toString() + "_folder";
          var openNode = mySelf.GetSonElement(mySelf,folderElement,"open");
          if (openNode != null && mySelf.GetElementContent(mySelf,openNode) == "0")
          {
              folder.Open = false;
          }
          var nameNode = mySelf.GetSonElement(mySelf,folderElement,"name");
          if (nameNode != null)
          {
              folder.Name = mySelf.GetElementContent(mySelf,nameNode);
          }

          var folderNum = 0;
          var nodelist = folderElement.childNodes;
          for (var i = 0; i < nodelist.length; i++)
          {
              if (nodelist[i].nodeName.toLowerCase() == "placemark")
              {
                  var placeMarkObject = mySelf.ParsePlaceMarkElement(mySelf, nodelist[i], folder.KMLObjectPath, folderNum);
                  if (placeMarkObject != null)
                  {
                      folderNum++;
                      placeMarkObject.BelongDocument = belongDocument;
                      placeMarkObject.Content = mySelf.GetElementContent(mySelf,nodelist[i]);
                      folder.Features.push(placeMarkObject);
                      //收集播放对象
                      if (placemarkObject.TimePrimitive != null)
                      {
                          mySelf.PlayList.push(placemarkObject);
                      }
                      //存放有ID的对象
                      if (placeMarkObject.ID != null && placeMarkObject.ID != "")
                      {
                          belongDocument.IDFeatures[placeMarkObject.ID] = placeMarkObject;
                      }
                      placeMarkObject = null;
                  }
              }
              else if (nodelist[i].nodeName.toLowerCase() == "folder")
              {
                  var folderObject = mySelf.ParseFolderElement(mySelf, nodelist[i], folder.KMLObjectPath, folderNum, belongDocument);
                  if (folderObject != null)
                  {
                      folderNum++;
                      folderObject.BelongDocument = belongDocument;
                      folder.Features.push(folderObject);
                  }
                  folderObject = null;
              }
              else if (nodelist[i].nodeName.toLowerCase() == "update")
              {
                  var updateObject = mySelf.ParseUpdaterElement(mySelf, nodelist[i], folder.KMLObjectPath, folderNum);
                  if (updateObject != null)
                  {
                      mySelf.PlayList.push(updateObject);
                  }
                  updateObject = null;
              }
              else if (nodelist[i].nodeName.toLowerCase() == "groundoverlay")
              {
                  var groundOverlayObject = mySelf.ParseGroundOverlayElement(mySelf, nodelist[i], folder.KMLObjectPath, folderNum);
                  if (groundOverlayObject != null)
                  {
                      folderNum++;
                      groundOverlayObject.BelongDocument = belongDocument;
                      groundOverlayObject.Content = mySelf.GetElementContent(mySelf,nodelist[i]);
                      folder.Features.push(groundOverlayObject);
                  }
                  groundOverlayObject = null;
              }
              else if (nodelist[i].nodeName.toLowerCase() == "screenoverlay")
              {
                  var screenOverlayObject = mySelf.ParseScreenOverlayElement(mySelf, nodelist[i], folder.KMLObjectPath, folderNum);
                  if (screenOverlayObject != null)
                  {
                      folderNum++;
                      screenOverlayObject.BelongDocument = belongDocument;
                      screenOverlayObject.Content = mySelf.GetElementContent(mySelf,nodelist[i]);
                      folder.Features.push(screenOverlayObject);
                  }
                  screenOverlayObject = null;
              }
              else if (nodelist[i].nodeName.toLowerCase() == "networklink")
              {
                  var networkLink = mySelf.ParseNetworkLinkElement(mySelf, nodelist[i], folder.KMLObjectPath, folderNum);
                  if (networkLink != null)
                  {
                      folderNum++;
                      networkLink.BelongDocument = belongDocument;
                      networkLink.Content = mySelf.GetElementContent(mySelf,nodelist[i]);
                      folder.Features.push(networkLink);
                  }
                  networkLink = null;
              }
          }

          return folder;
      }
      ;


      skKmlParse.prototype.ParseUpdaterElement = function(mySelf, updaterElement, parentObjectPath, pathNum) {
          if (!updaterElement.hasChildNodes())
          {
              return null;
          }
          var uper = new skUpdater();

          var updateConditionAttribute = updaterElement.getAttribute("UpdateCondition");
          if (updateConditionAttribute != null)
          {
              uper.UpdateCondition = updateConditionAttribute;
          }

          var nodelist = updaterElement.childNodes;
          for (var i = 0; i < nodelist.length; i++)
          {
              if (nodelist[i].nodeName.toLowerCase() == "change")
              {
                  var changeObject = mySelf.ParseChangeElement(mySelf, nodelist[i], parentObjectPath, pathNum);
                  if (changeObject != null)
                  {
                      uper.Change = changeObject;
                  }
                  changeObject = null;
              }
              else if (nodelist[i].nodeName.toLowerCase() == "create")
              {
              }
              else if (nodelist[i].nodeName.toLowerCase() == "delete")
              {
              }
          }

          return uper;
      };


      skKmlParse.prototype.ParseChangeElement = function(mySelf, changeElement, parentObjectPath, pathNum) {
          if (!changeElement.hasChildNodes())
          {
              return null;
          }
          var ch = new skChange();

          var idAttribute = changeElement.getAttribute("targetId");
          if (idAttribute != null)
          {
              ch.targetId = idAttribute;
          }

          var nodelist = changeElement.childNodes;
          for (var i = 0; i < nodelist.length; i++)
          {
              if (nodelist[i].nodeName.toLowerCase() == "placemark")
              {
                  var placeMarkObject = mySelf.ParsePlaceMarkElement(mySelf, nodelist[i], parentObjectPath, pathNum);
                  if (placeMarkObject != null)
                  {
                      ch.Feature = placeMarkObject;
                  }
                  placeMarkObject = null;
              }
          }
          nodelist = null;
          return ch;
      };


      skKmlParse.prototype.ParsePlaceMarkElement = function(mySelf, placeMarkElement, parentObjectPath, pathNum) {
          if (!placeMarkElement.hasChildNodes())
          {
              return null;
          }
          var placeMark = new skPlacemark();
          placeMark.ParentKmlObjectPath = parentObjectPath;
          placeMark.KMLObjectPath = parentObjectPath + "/" + pathNum.toString() + "_placemark";

          var idAttribute = placeMarkElement.getAttribute("id");
          if (idAttribute != null)
          {
              placeMark.ID = idAttribute;
          }

          var nodelist = placeMarkElement.childNodes;
          for (var i = 0; i < nodelist.length; i++)
          {
              if (nodelist[i].nodeName.toLowerCase() == "open" &&  mySelf.GetElementContent(mySelf,nodelist[i]) == "0")
              {
                  placeMark.Open = false;
              }
              else if (nodelist[i].nodeName.toLowerCase() == "name")
              {
                  placeMark.Name = mySelf.GetElementContent(mySelf,nodelist[i]);
              }
              else if (nodelist[i].nodeName.toLowerCase() == "snippet")
              {
                  placeMark.Snippet = mySelf.GetElementContent(mySelf,nodelist[i]);
              }
              else if (nodelist[i].nodeName.toLowerCase() == "description")
              {
                  placeMark.Description = mySelf.GetElementContent(mySelf,nodelist[i]);
              }
              else if (nodelist[i].nodeName.toLowerCase() == "styleurl")
              {
                  placeMark.StyleUrl = mySelf.GetElementContent(mySelf,nodelist[i]);
              }
              else if (nodelist[i].nodeName.toLowerCase() == "style")
              {
                  var styleurlObject = mySelf.ParseStyleUrlElement(mySelf, nodelist[i]);
                  if (styleurlObject != null)
                  {
                      placeMark.StyleSelectors[styleurlObject.ID] = styleurlObject;
                      styleurlObject = null;
                  }
              }
              else if (nodelist[i].nodeName.toLowerCase() == "stylemap")
              {
                  var styleselectorObject = mySelf.ParseStyleSelectorElement(mySelf, nodelist[i]);
                  if (styleselectorObject != null)
                  {
                      placeMark.StyleSelectors[styleselectorObject.ID] = styleselectorObject;
                      styleselectorObject = null;
                  }
              }
              else if (nodelist[i].nodeName.toLowerCase() == "styleselector")
              {
                  placeMark.StyleSelectors = mySelf.GetElementContent(mySelf,nodelist[i]);
              }
              else if (nodelist[i].nodeName.toLowerCase() == "timespan")
              {
                  var timeSpanObject = mySelf.ParseTimeSpanElement(mySelf, nodelist[i]);
                  if (timeSpanObject != null)
                  {
                      placeMark.TimePrimitive = timeSpanObject;
                      timeSpanObject = null;
                  }
              }
              else if (nodelist[i].nodeName.toLowerCase() == "timestamp")
              {
                  var timeStampObject = mySelf.ParseTimeStampElement(mySelf, nodelist[i]);
                  if (timeStampObject != null)
                  {
                      placeMark.TimePrimitive = timeStampObject;
                      timeStampObject = null;
                  }
              }
              else if (nodelist[i].nodeName.toLowerCase() == "point")
              {
                  placeMark.Geometry = mySelf.ParsePointElement(mySelf, nodelist[i]);
                  if (placeMark.Geometry == null)
                  {
                      var oo = placeMark.Geometry;
                  }
              }
              else if (nodelist[i].nodeName.toLowerCase() == "linestring")
              {
                  placeMark.Geometry = mySelf.ParseLineStringElement(mySelf, nodelist[i]);
              }
              else if (nodelist[i].nodeName.toLowerCase() == "polygon")
              {
                  placeMark.Geometry = mySelf.ParsePolygonElement(mySelf, nodelist[i]);
              }
              else if (nodelist[i].nodeName.toLowerCase() == "lookat")
              {
                  placeMark.LookAt = mySelf.ParseLookAtElement(mySelf, nodelist[i]);
              }              
          }
          nodelist = null;
          mySelf.LastPlacemark = placeMark;

          return placeMark;
      }
      ;

      skKmlParse.prototype.ParseLookAtElement = function(mySelf, lookAtElement) {
          if (!lookAtElement.hasChildNodes())
          {
              return null;
          }
          var lookAt = new skLookAt();

          var nodelist = lookAtElement.childNodes;
          for (var i = 0; i < nodelist.length; i++)
          {
              if (nodelist[i].nodeName.toLowerCase() == "longitude")
              {
                  lookAt.Longitude = mySelf.GetElementContent(mySelf,nodelist[i]);
              }
              else if (nodelist[i].nodeName.toLowerCase() == "latitude")
              {
                  lookAt.Latitude = mySelf.GetElementContent(mySelf,nodelist[i]);
              }
              else if (nodelist[i].nodeName.toLowerCase() == "range")
              {
                  lookAt.Range = mySelf.GetElementContent(mySelf,nodelist[i]);
              }
              else if (nodelist[i].nodeName.toLowerCase() == "altitude")
              {
                  lookAt.altitude = mySelf.GetElementContent(mySelf,nodelist[i]);
              }
              else if (nodelist[i].nodeName.toLowerCase() == "altitudemode")
              {
                  lookAt.AltitudeMode = mySelf.GetElementContent(mySelf,nodelist[i]);
              }
              else if (nodelist[i].nodeName.toLowerCase() == "tilt")
              {
                  lookAt.Tilt = mySelf.GetElementContent(mySelf,nodelist[i]);
              }                                        
          }
          nodelist = null;
          return lookAt;
      }
      ;      
      

      skKmlParse.prototype.ParsePointElement = function(mySelf, pointElement) {
          if (!pointElement.hasChildNodes())
          {
              return null;
          }
          var point = new skPoint();

          var nodelist = pointElement.childNodes;
          for (var i = 0; i < nodelist.length; i++)
          {
              if (nodelist[i].nodeName.toLowerCase() == "extrude" &&  mySelf.GetElementContent(mySelf,nodelist[i]) == "0")
              {
                  point.Open = false;
              }
              else if (nodelist[i].nodeName.toLowerCase() == "altitudemode")
              {
                  point.AltitudeMode = mySelf.GetElementContent(mySelf,nodelist[i]);
              }
              else if (nodelist[i].nodeName.toLowerCase() == "coordinates")
              {
                  point.Coordinates = mySelf.GetElementContent(mySelf,nodelist[i]);
                  var arrayXY = point.Coordinates.split(',');
                  point.x = parseFloat(arrayXY[0]);
                  point.y = parseFloat(arrayXY[1]);
                  arrayXY = null;
              }
          }
          nodelist = null;
          return point;
      }
      ;


      skKmlParse.prototype.ParseTimeStampElement = function(mySelf, timeStampElement) {
          if (!timeStampElement.hasChildNodes())
          {
              return null;
          }
          var timeStamp = new skTimeStamp();

          var nodelist = timeStampElement.childNodes;
          for (var i = 0; i < nodelist.length; i++)
          {
              if (nodelist[i].nodeName.toLowerCase() == "when")
              {
                  timeStamp.when = mySelf.GetElementContent(mySelf,nodelist[i]);
              }
          }
          nodelist = null;
          return timeStamp;
      }
      ;


      skKmlParse.prototype.ParseTimeSpanElement = function(mySelf, timeSpanElement) {
          if (!timeSpanElement.hasChildNodes())
          {
              return null;
          }
          var timeSpan = new skTimeSpan();

          var nodelist = timeSpanElement.childNodes;
          for (var i = 0; i < nodelist.length; i++)
          {
              if (nodelist[i].nodeName.toLowerCase() == "begin")
              {
                  timeSpan.begin = mySelf.GetElementContent(mySelf,nodelist[i]);
              }
              else if (nodelist[i].nodeName.toLowerCase() == "end")
              {
                  timeSpan.end = mySelf.GetElementContent(mySelf,nodelist[i]);
              }
          }
          nodelist = null;
          return timeSpan;
      }
      ;

      skKmlParse.prototype.ParseCoordinatesElement = function (mySelf, coordinatesElement)
      {

      }
      ;

      //解析屏幕贴层元素
      skKmlParse.prototype.ParseScreenOverlayElement = function(mySelf, screenOverlayElement, parentObjectPath, pathNum) {

          if (!screenOverlayElement.hasChildNodes())
          {
              return null;
          }
          var screenOverlay = new skScreenOverlay();
          screenOverlay.ParentKmlObjectPath = parentObjectPath;
          screenOverlay.KMLObjectPath = parentObjectPath + "/" + pathNum.toString() + "_screenoverlay";
          var nodelist = screenOverlayElement.childNodes;
          for (var i = 0; i < nodelist.length; i++)
          {
              if (nodelist[i].nodeName.toLowerCase() == "name")
              {
                  screenOverlay.Name = mySelf.GetElementContent(mySelf,nodelist[i]);
              }
              else if (nodelist[i].nodeName.toLowerCase() == "icon")
              {
                  screenOverlay.Icon = new skIcon(mySelf.GetElementContent(mySelf,nodelist[i]));
              }
              else if (nodelist[i].nodeName.toLowerCase() == "rotation")
              {
                  screenOverlay.Rotation = mySelf.GetElementContent(mySelf,nodelist[i]);
              }
              else if (nodelist[i].nodeName.toLowerCase() == "overlayxy")
              {
                  var vec = new skVec2();
                  var xAttribute = nodelist[i].getAttribute("x");
                  if (xAttribute != null)
                  {
                      vec.x = xAttribute;
                  }
                  var yAttribute = nodelist[i].getAttribute("y");
                  if (yAttribute != null)
                  {
                      vec.y = yAttribute;
                  }
                  var xunitsAttribute = nodelist[i].getAttribute("xunits");
                  if (xunitsAttribute != null)
                  {
                      vec.xunits = xunitsAttribute;
                  }
                  var yunitsAttribute = nodelist[i].getAttribute("yunits");
                  if (yunitsAttribute != null)
                  {
                      vec.yunits = xunitsAttribute;
                  }
                  screenOverlay.OverlayXY = vec;
              }
              else if (nodelist[i].nodeName.toLowerCase() == "screenxy")
              {
                  var vec = new skVec2();
                  var xAttribute = nodelist[i].getAttribute("x");
                  if (xAttribute != null)
                  {
                      vec.x = xAttribute;
                  }
                  var yAttribute = nodelist[i].getAttribute("y");
                  if (yAttribute != null)
                  {
                      vec.y = yAttribute;
                  }
                  var xunitsAttribute = nodelist[i].getAttribute("xunits");
                  if (xunitsAttribute != null)
                  {
                      vec.xunits = xunitsAttribute;
                  }
                  var yunitsAttribute = nodelist[i].getAttribute("yunits");
                  if (yunitsAttribute != null)
                  {
                      vec.yunits = xunitsAttribute;
                  }
                  screenOverlay.ScreenXY = vec;
              }
              else if (nodelist[i].nodeName.toLowerCase() == "screenxy")
              {
                  var vec = new skVec2();
                  var xAttribute = nodelist[i].getAttribute("x");
                  if (xAttribute != null)
                  {
                      vec.x = xAttribute;
                  }
                  var yAttribute = nodelist[i].getAttribute("y");
                  if (yAttribute != null)
                  {
                      vec.y = yAttribute;
                  }
                  var xunitsAttribute = nodelist[i].getAttribute("xunits");
                  if (xunitsAttribute != null)
                  {
                      vec.xunits = xunitsAttribute;
                  }
                  var yunitsAttribute = nodelist[i].getAttribute("yunits");
                  if (yunitsAttribute != null)
                  {
                      vec.yunits = xunitsAttribute;
                  }
                  screenOverlay.Size = vec;
              }
          }
          nodelist = null;
          return screenOverlay;
      }
      ;


      skKmlParse.prototype.ParseGroundOverlayElement = function(mySelf, groundOverlayElement, parentObjectPath, pathNum) {

          if (!groundOverlayElement.hasChildNodes())
          {
              return null;
          }
          var groundOverlay = new skGroundOverlay();
          groundOverlay.ParentKmlObjectPath = parentObjectPath;
          groundOverlay.KMLObjectPath = parentObjectPath + "/" + pathNum.toString() + "_groundoverlay";
          var nodelist = groundOverlayElement.childNodes;
          for (var i = 0; i < nodelist.length; i++)
          {
              if (nodelist[i].nodeName.toLowerCase() == "name")
              {
                  groundOverlay.Name = mySelf.GetElementContent(mySelf,nodelist[i]);
              }
              else if (nodelist[i].nodeName.toLowerCase() == "icon")
              {
                  groundOverlay.Icon = new skIcon( mySelf.GetElementContent(mySelf,nodelist[i]));
              }
              else if (nodelist[i].nodeName.toLowerCase() == "latlonbox")
              {
                  var north, south, east, west;
                  var nodelistSon = nodelist[i].childNodes;
                  for (var ii = 0; ii < nodelistSon.length; ii++)
                  {
                      if (nodelistSon(i).nodeName.toLowerCase() == "north")
                      {
                          north.Value = mySelf.GetElementContent(mySelf,nodelistSon(i)); 
                      }
                      if (nodelistSon(i).nodeName.toLowerCase() == "south")
                      {
                          south.Value = mySelf.GetElementContent(mySelf,nodelistSon(i)); 
                      }
                      if (nodelistSon(i).nodeName.toLowerCase() == "east")
                      {
                          east.Value = mySelf.GetElementContent(mySelf,nodelistSon(i)); 
                      }
                      if (nodelistSon(i).nodeName.toLowerCase() == "west")
                      {
                          west.Value = mySelf.GetElementContent(mySelf,nodelistSon(i)); 
                      }
                  }
                  nodelistSon = null;
                  groundOverlay.LatLonBox = new skLatLonBox(north, south, east, west);
              }
              nodelist = null;
          }
          return groundOverlay;
      }
      ;


      skKmlParse.prototype.ParseLinearRingElement = function(mySelf, linearRingElement) {
          try
          {
              if (!linearRingElement.hasChildNodes())
              {
                  return null;
              }
              var linearRing = new skLinearRing();

              var nodelist = linearRingElement.childNodes;
              for (var i = 0; i < nodelist.length; i++)
              {
                  if (nodelist[i].nodeName.toLowerCase() == "extrude" && mySelf.GetElementContent(mySelf,nodelist[i]) == "0")
                  {
                      linearRing.Open = false;
                  }
                  else if (nodelist[i].nodeName.toLowerCase() == "altitudemode")
                  {
                      linearRing.AltitudeMode = mySelf.GetElementContent(mySelf,nodelist[i]);
                  }
                  else if (nodelist[i].nodeName.toLowerCase() == "coordinates")
                  {
                      linearRing.Coordinates = mySelf.GetElementContent(mySelf,nodelist[i]);
                  }
              }
              nodelist = null;
              return linearRing;
          }
          catch (ex)
          {
              return null;
          }
      }
      ;

      skKmlParse.prototype.ParseOuterBoundaryIsElement = function(mySelf, outerBoundaryIsElement) {
          try
          {
              if (!outerBoundaryIsElement.hasChildNodes())
              {
                  return null;
              }
              var outerBoundaryIs = null;

              var nodelist = outerBoundaryIsElement.childNodes;
              for (var i = 0; i < nodelist.length; i++)
              {
                  if (nodelist[i].nodeName.toLowerCase() == "linearring")
                  {
                      var linearRing = mySelf.ParseLinearRingElement(mySelf, nodelist[i]);
                      if (linearRing != null)
                      {
                          outerBoundaryIs = new skOuterBoundaryIs(linearRing);
                      }
                  }
              }
              nodelist = null;
              return outerBoundaryIs;
          }
          catch (ex)
          {
              return null;
          }

      }
      ;


      skKmlParse.prototype.ParseInnerBoundaryIsElement = function(mySelf, innerBoundaryIsElement) {
          try
          {
              if (!innerBoundaryIsElement.hasChildNodes())
              {
                  return null;
              }
              var innerBoundaryIs = null;

              var nodelist = innerBoundaryIsElement.childNodes;
              for (var i = 0; i < nodelist.length; i++)
              {
                  if (nodelist[i].nodeName.toLowerCase() == "linearring")
                  {
                      var linearRing = mySelf.ParseLinearRingElement(mySelf, nodelist[i]);
                      if (linearRing != null)
                      {
                          innerBoundaryIs = new skInnerBoundaryIs(linearRing);
                      }
                  }
              }
              nodelist = null;
              return innerBoundaryIs;
          }
          catch (ex)
          {
              return null;
          }

      }
      ;


      skKmlParse.prototype.ParsePolygonElement = function(mySelf, polygonElement) {

          if (!polygonElement.hasChildNodes())
          {
              return null;
          }
          var polygon = new skPolygon();

          var nodelist = polygonElement.childNodes;
          for (var i = 0; i < nodelist.length; i++)
          {
              if (nodelist[i].nodeName.toLowerCase() == "extrude" && mySelf.GetElementContent(mySelf,nodelist[i]) == "0")
              {
                  polygon.Extrude = false;
              }
              else if (nodelist[i].nodeName.toLowerCase() == "altitudemode")
              {
                  switch (mySelf.GetElementContent(mySelf,nodelist[i]))
                  {
                      case "clampToGround":
                          polygon.AltitudeMode = "clampToGround";
                          break;
                      case "relativeToGround":
                          polygon.AltitudeMode = "relativeToGround";
                          break;
                      case "absolute":
                          polygon.AltitudeMode = "absolute";
                          break;
                  }
              }
              else if (nodelist[i].nodeName.toLowerCase() == "outerboundaryis")
              {
                  var outerboundaryis = mySelf.ParseOuterBoundaryIsElement(mySelf,nodelist[i]);
                  if (outerboundaryis != null)
                  {
                      polygon.OuterBoundaryIs = outerboundaryis;
                  }
              }
              else if (nodelist[i].nodeName.toLowerCase() == "innerboundaryis")
              {
                  var innerboundaryis = mySelf.ParseInnerBoundaryIsElement(mySelf,nodelist[i]);
                  if (innerboundaryis != null)
                  {
                      polygon.InnerBoundaries.push(innerboundaryis);
                  }
              }
          }
          nodelist = null;
          return polygon;
      }
      ;

      skKmlParse.prototype.ParseLineStringElement = function(mySelf, lineStringElement) {
          if (!lineStringElement.hasChildNodes())
          {
              return null;
          }
          var line = new skLineString();

          var nodelist = lineStringElement.childNodes;
          for (var i = 0; i < nodelist.length; i++)
          {
              if (nodelist[i].nodeName.toLowerCase() == "extrude" && mySelf.GetElementContent(mySelf,nodelist[i]) == "0")
              {
                  line.Open = false;
              }
              else if (nodelist[i].nodeName.toLowerCase() == "altitudemode")
              {
                  line.AltitudeMode = mySelf.GetElementContent(mySelf,nodelist[i]);
              }
              else if (nodelist[i].nodeName.toLowerCase() == "coordinates")
              {
                  line.Coordinates = mySelf.GetElementContent(mySelf,nodelist[i]);
                  line.Points = new Array();
                  var pointArray = line.Coordinates.split(' ');
                  for (var pointNum = 0; pointNum < pointArray.length; pointNum++)
                  {
                      var arrayXY = pointArray[pointNum].split(',');
                      if (arrayXY.length == 2) {
                          line.Points.push(new skPoint(parseFloat(arrayXY[0]), parseFloat(arrayXY[1])));
                      }
                  }
              }
          }
          nodelist = null;
          return line;
      }
      ;

      skKmlParse.prototype.LoadXml = function (kmlString)
      {
          var xmlDoc = null;
          if (window.ActiveXObject) {
              xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
              xmlDoc.async = false;
              xmlDoc.loadXML(kmlString);
              this.IsChrome = false;
          }
          else if (window.DOMParser && document.implementation && document.implementation.createDocument) {
              var domParser = new DOMParser();
              xmlDoc = domParser.parseFromString(kmlString, "text/xml");
              this.IsChrome = true;
          }
          return xmlDoc;
      }
      ;
   skKmlParse._initialized = true;
}
}
