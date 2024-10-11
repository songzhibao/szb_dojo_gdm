/**
* User: chengbin
* Date: 13-5-2
*/
define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'egis/Share/MSG/msgBodyContent',
    'egis/Share/MSG/msgBodyFail',
    'egis/Share/MSG/msgBodyLocate',
    'egis/Share/MSG/msgBodyLocateData',
    'egis/Share/MSG/msgBodyMark',
    'egis/Share/MSG/msgBodyMarkList',
    'egis/Share/MSG/msgBodyResponseLoc',
    'egis/Share/MSG/msgBodyResponseLoc1',
    'egis/Share/MSG/msgBodyResponseLoc1Addition',
    'egis/Share/MSG/msgHead',
    'egis/Share/MSG/msgHeadDst',
    'egis/Share/MSG/msgHeadMsg',
    'egis/Share/MSG/msgHeadSrc',
    'egis/Share/MSG/msgMain'

], function (declare, lang, msgBodyContent, msgBodyFail, msgBodyLocate, msgBodyLocateData, msgBodyMark, msgBodyMarkList, msgBodyResponseLoc, msgBodyResponseLoc1, msgBodyResponseLoc1Addition, msgHead, msgHeadDst, msgHeadMsg, msgHeadSrc, msgMain) {

    return declare([], {

        constructor: function (args) {
            declare.safeMixin(this, args || {});
        },

        IsChrome : false,

        ParseMsgXmlString : function(kmlString,param) {
            var xmlDoc = this.LoadXml(kmlString);
            if (xmlDoc == null)
            {
                alert('您的浏览器不支持xml文件读取,于是本页面禁止您的操作,推荐使用IE5.0以上可以解决此问题!');
            }
            else
            {
                var parsedMsgObject = this.ParseMsgDocument(xmlDoc, param);
                if (parsedMsgObject != null)
                {
                    parsedMsgObject.Content = kmlString;
                }
                xmlDoc = null;
                return parsedMsgObject;
            }
            return null;
        },

        ParseMsgDocument : function(msgDocument, param) {
            if (!msgDocument.hasChildNodes())
            {
                return null;
            }
            var kmlDoc = null;
            if (msgDocument.documentElement.nodeName.toLowerCase() == "mainmsg")
            {
                kmlDoc = this.ParseDocumentElement(msgDocument.documentElement, param);
            }
            this.ParsedDocument = kmlDoc;
            //释放零时变量
            nodelist = null;
            return kmlDoc;
        },

        ParseDocumentElement : function(documentElement, param) {
            if (!documentElement.hasChildNodes())
            {
                return null;
            }
            var doc = new msgMain();
            var nodelist = documentElement.childNodes;
            for (var i = 0; i < nodelist.length; i++)
            {
                if (nodelist[i].nodeName.toLowerCase() == "head")
                {
                    var headObject = this.ParseHeadElement(nodelist[i], param);
                    if (headObject != null)
                    {
                        doc.Head = headObject;
                        headObject = null;
                    }
                }
                else if (nodelist[i].nodeName.toLowerCase() == "body")
                {
                    var bodyObject = this.ParseBodyElement(nodelist[i], param);
                    if (bodyObject != null)
                    {
                        doc.Body = bodyObject;
                        bodyObject = null;
                    }
                }
            }
            //释放零时变量
            nodelist = null;
            return doc;
        },


        ParseHeadElement : function(headElement, param) {
            if (!headElement.hasChildNodes())
            {
                return null;
            }
            var head = new msgHead();
            var nodelist = headElement.childNodes;
            for (var i = 0; i < nodelist.length; i++)
            {
                if (nodelist[i].nodeName.toLowerCase() == "dst")
                {
                    head.Dst = this.ParseHeadDSTElement(nodelist[i], param);
                }
                else if (nodelist[i].nodeName.toLowerCase() == "src")
                {
                    head.Src = this.ParseHeadSRCElement(nodelist[i], param);
                }
                else if (nodelist[i].nodeName.toLowerCase() == "msg")
                {
                    head.Msg = this.ParseHeadMSGElement(nodelist[i], param);
                }
            }
            //释放零时变量
            nodelist = null;
            return head;
        },


        ParseHeadMSGElement : function(headMSGElement, param) {
            //            if (!headMSGElement.hasChildNodes())
            //            {
            //                return null;
            //            }
            var msg = new msgHeadMsg();
            var codeAttribute = headMSGElement.getAttribute("Code");
            if (codeAttribute != null)
            {
                msg.Code = codeAttribute;
                codeAttribute = null;
            }
            var sendTimeAttribute = headMSGElement.getAttribute("SendTime");
            if (sendTimeAttribute != null)
            {
                msg.SendTime = sendTimeAttribute;
                sendTimeAttribute = null;
            }
            var transTypeAttribute = headMSGElement.getAttribute("TransType");
            if (transTypeAttribute != null)
            {
                msg.TransType = transTypeAttribute;
                transTypeAttribute = null;
            }
            var verAttribute = headMSGElement.getAttribute("Ver");
            if (verAttribute != null)
            {
                msg.Ver = verAttribute;
                verAttribute = null;
            }
            return msg;
        },

        ParseHeadSRCElement : function(headSRCElement, param) {
            //            if (!headSRCElement.hasChildNodes())
            //            {
            //                return null;
            //            }
            var src = new msgHeadSrc();
            var idAttribute = headSRCElement.getAttribute("Id");
            if (idAttribute != null)
            {
                src.Id = idAttribute;
                idAttribute = null;
            }
            var typeAttribute = headSRCElement.getAttribute("Type");
            if (typeAttribute != null)
            {
                src.Type = typeAttribute;
                typeAttribute = null;
            }
            var addrAttribute = headSRCElement.getAttribute("Addr");
            if (addrAttribute != null)
            {
                src.Addr = addrAttribute;
                addrAttribute = null;
            }

            return src;
        },


        ParseHeadDSTElement : function(headDSTElement, param) {
            //            if (!headDSTElement.hasChildNodes())
            //            {
            //                return null;
            //            }
            var dst = new msgHeadDst();
            var idAttribute = headDSTElement.getAttribute("Id");
            if (idAttribute != null)
            {
                dst.Id = idAttribute;
                idAttribute = null;
            }
            var typeAttribute = headDSTElement.getAttribute("Type");
            if (typeAttribute != null)
            {
                dst.Type = typeAttribute;
                typeAttribute = null;
            }
            var addrAttribute = headDSTElement.getAttribute("Addr");
            if (addrAttribute != null)
            {
                dst.Addr = addrAttribute;
                addrAttribute = null;
            }

            return dst;
        },


        ParseBodyElement : function(bodyElement, param) {
            if (!bodyElement.hasChildNodes())
            {
                return null;
            }
            var body = null;
            var nodelist = bodyElement.childNodes;
            for (var i = 0; i < nodelist.length; i++)
            {
                if (nodelist[i].nodeName.toLowerCase() == "locate")
                {
                    body = this.ParseBodyLocateElement(nodelist[i], param);
                }
                else if (nodelist[i].nodeName.toLowerCase() == "requestpath")
                {
                    body = this.ParseBodyRequestPathElement(nodelist[i], param);
                }
                else if (nodelist[i].nodeName.toLowerCase() == "mark")
                {
                    if (body == null)
                    {
                        body = new msgBodyMarkList();
                    }
                    body.MarkList.push(this.ParseBodyMarkElement(nodelist[i], param));
                }
                else if (nodelist[i].nodeName.toLowerCase() == "responseloc")
                {
                    body = this.ParseBodyResponseLocElement(nodelist[i], param);
                }
                else if (nodelist[i].nodeName.toLowerCase() == "responseloc1")
                {
                    body = this.ParseBodyResponseLoc1Element(nodelist[i], param);
                }
                else if (nodelist[i].nodeName.toLowerCase() == "fail")
                {
                    body = this.ParseBodyFailElement(nodelist[i], param);
                }
                else if (nodelist[i].nodeName.toLowerCase() == "msgbodycontent")
                {
                    body = this.ParseBodyContentElement(nodelist[i], param);
                }
                
            }
            //释放零时变量
            nodelist = null;
            return body;
        },


        ParseBodyContentElement : function(bodyContentElement, param) {

            var content = new msgBodyContent();
            if (bodyContentElement != null)
            {
                if (this.IsChrome) {
                    content.Content = bodyContentElement.textContent;
                }
                else {
                    content.Content = bodyContentElement.text;
                }
            }
            return content;
        },


        ParseBodyFailElement : function(bodyFailElement, param) {
            //            if (!bodyFailElement.hasChildNodes())
            //            {
            //                return null;
            //            }
            var fail = new msgBodyFail();
            var idAttribute = bodyFailElement.getAttribute("Id");
            if (idAttribute != null)
            {
                fail.Id = idAttribute;
                idAttribute = null;
            }
            var posNameAttribute = bodyFailElement.getAttribute("PosName");
            if (posNameAttribute != null)
            {
                fail.PosName = posNameAttribute;
                posNameAttribute = null;
            }            
            var alarmTypeAttribute = bodyFailElement.getAttribute("AlarmType");
            if (alarmTypeAttribute != null)
            {
                fail.AlarmType = alarmTypeAttribute;
                alarmTypeAttribute = null;
            }
            var locateTypeAttribute = bodyFailElement.getAttribute("LocateType");
            if (locateTypeAttribute != null)
            {
                fail.LocateType = locateTypeAttribute;
                locateTypeAttribute = null;
            }
            var alarmTimeAttribute = bodyFailElement.getAttribute("AlarmTime");
            if (alarmTimeAttribute != null)
            {
                fail.AlarmTime = alarmTimeAttribute;
                alarmTimeAttribute = null;
            }

            return fail;
        },


        ParseBodyResponseLoc1AdditionElement : function(bodyResponseLoc1AdditionElement, param) {
            //            if (!bodyResponseLoc1AdditionElement.hasChildNodes())
            //            {
            //                return null;
            //            }
            var addition = new msgBodyResponseLoc1Addition();
            var nameAttribute = bodyResponseLoc1AdditionElement.getAttribute("Name");
            if (nameAttribute != null)
            {
                addition.Name = nameAttribute;
                nameAttribute = null;
            }
            var telephoneAttribute = bodyResponseLoc1AdditionElement.getAttribute("Telephone");
            if (telephoneAttribute != null)
            {
                addition.Telephone = telephoneAttribute;
                telephoneAttribute = null;
            }
            var addrAttribute = bodyResponseLoc1AdditionElement.getAttribute("Addr");
            if (addrAttribute != null)
            {
                addition.Addr = addrAttribute;
                addrAttribute = null;
            }
            var typeAttribute = bodyResponseLoc1AdditionElement.getAttribute("Type");
            if (typeAttribute != null)
            {
                addition.Type = typeAttribute;
                typeAttribute = null;
            }

            var idAttribute = bodyResponseLoc1AdditionElement.getAttribute("Id");
            if (idAttribute != null)
            {
                addition.Id = idAttribute;
                idAttribute = null;
            }
            var streetAttribute = bodyResponseLoc1AdditionElement.getAttribute("Street");
            if (streetAttribute != null)
            {
                addition.Street = streetAttribute;
                streetAttribute = null;
            }
            var locationAttribute = bodyResponseLoc1AdditionElement.getAttribute("Location");
            if (locationAttribute != null)
            {
                addition.Location = locationAttribute;
                locationAttribute = null;
            }
            var pressureAttribute = bodyResponseLoc1AdditionElement.getAttribute("Pressure");
            if (pressureAttribute != null)
            {
                addition.Pressure = pressureAttribute;
                pressureAttribute = null;
            }
            var flowAttribute = bodyResponseLoc1AdditionElement.getAttribute("Flow");
            if (flowAttribute != null)
            {
                addition.Flow = flowAttribute;
                flowAttribute = null;
            }
            var diameterAttribute = bodyResponseLoc1AdditionElement.getAttribute("Diameter");
            if (diameterAttribute != null)
            {
                addition.Diameter = diameterAttribute;
                diameterAttribute = null;
            }
            var shapeAttribute = bodyResponseLoc1AdditionElement.getAttribute("Shape");
            if (shapeAttribute != null)
            {
                addition.Shape = shapeAttribute;
                shapeAttribute = null;
            }
            
            return addition;
        },


        ParseBodyResponseLoc1Element : function(bodyResponseLoc1Element, param) {
            if (!bodyResponseLoc1Element.hasChildNodes())
            {
                return null;
            }
            var responseLoc1 = new msgBodyResponseLoc1();
            var idAttribute = bodyResponseLoc1Element.getAttribute("Id");
            if (idAttribute != null)
            {
                responseLoc1.Id = idAttribute;
                idAttribute = null;
            }
            var alarmTypeAttribute = bodyResponseLoc1Element.getAttribute("AlarmType");
            if (alarmTypeAttribute != null)
            {
                responseLoc1.AlarmType = alarmTypeAttribute;
                alarmTypeAttribute = null;
            }
            var locateTypeAttribute = bodyResponseLoc1Element.getAttribute("LocateType");
            if (locateTypeAttribute != null)
            {
                responseLoc1.LocateType = locateTypeAttribute;
                locateTypeAttribute = null;
            }
            var responseTypeAttribute = bodyResponseLoc1Element.getAttribute("ResponseType");
            if (responseTypeAttribute != null)
            {
                responseLoc1.ResponseType = responseTypeAttribute;
                responseTypeAttribute = null;
            }

            var nodelist = bodyResponseLoc1Element.childNodes;
            for (var i = 0; i < nodelist.length; i++)
            {
                if (nodelist[i].nodeName.toLowerCase() == "addition")
                {
                    responseLoc1.AdditionList.push(this.ParseBodyResponseLoc1AdditionElement(nodelist[i], param));
                }
            }
            //释放零时变量
            nodelist = null;
            return responseLoc1;
        },


        ParseBodyResponseLocElement : function(bodyResponseLocElement, param) {
            //            if (!bodyResponseLocElement.hasChildNodes())
            //            {
            //                return null;
            //            }
            var responseLoc = new msgBodyResponseLoc();
            var alarmTypeAttribute = bodyResponseLocElement.getAttribute("AlarmType");
            if (alarmTypeAttribute != null)
            {
                responseLoc.AlarmType = alarmTypeAttribute;
                alarmTypeAttribute = null;
            }
            var locateTypeAttribute = bodyResponseLocElement.getAttribute("LocateType");
            if (locateTypeAttribute != null)
            {
                responseLoc.LocateType = locateTypeAttribute;
                locateTypeAttribute = null;
            }
            var jurisdictionAttribute = bodyResponseLocElement.getAttribute("Jurisdiction");
            if (jurisdictionAttribute != null)
            {
                responseLoc.Jurisdiction = jurisdictionAttribute;
                jurisdictionAttribute = null;
            }
            var idAttribute = bodyResponseLocElement.getAttribute("Id");
            if (idAttribute != null)
            {
                //responseLoc.LocateType = idAttribute; //HH 2012-10-31 14:47:13
                responseLoc.Id = idAttribute;
                idAttribute = null;
            }
            var posXAttribute = bodyResponseLocElement.getAttribute("PosX");
            if (posXAttribute != null)
            {
                responseLoc.PosX = posXAttribute;
                posXAttribute = null;
            }
            var posYAttribute = bodyResponseLocElement.getAttribute("PosY");
            if (posYAttribute != null)
            {
                responseLoc.PosY = posYAttribute;
                posYAttribute = null;
            }
            var posNameAttribute = bodyResponseLocElement.getAttribute("PosName");
            if (posNameAttribute != null)
            {
                responseLoc.PosName = posNameAttribute;
                posNameAttribute = null;
            }
            var caseAddressAttribute = bodyResponseLocElement.getAttribute("CaseAddress");
            if (caseAddressAttribute != null)
            {
                responseLoc.CaseAddress = caseAddressAttribute;
                caseAddressAttribute = null;
            }
            var alarmTimeAttribute = bodyResponseLocElement.getAttribute("AlarmTime");
            if (alarmTimeAttribute != null)
            {
                responseLoc.AlarmTime = alarmTimeAttribute;
                alarmTimeAttribute = null;
            }
            var carCodeAttribute = bodyResponseLocElement.getAttribute("CarCode");
            if (carCodeAttribute != null) {
                responseLoc.CarCode = carCodeAttribute;
                carCodeAttribute = null;
            }           
            
            return responseLoc;
        },


        ParseBodyMarkElement : function(bodyMarkElement, param) {
            //            if (!bodyMarkElement.hasChildNodes())
            //            {
            //                return null;
            //            }
            var mark = new msgBodyMark();
            var typeAttribute = bodyMarkElement.getAttribute("Type");
            if (typeAttribute != null)
            {
                mark.Type = typeAttribute;
                typeAttribute = null;
            }
            var captionAttribute = bodyMarkElement.getAttribute("Caption");
            if (captionAttribute != null)
            {
                mark.Caption = captionAttribute;
                captionAttribute = null;
            }
            var posXAttribute = bodyMarkElement.getAttribute("PosX");
            if (posXAttribute != null)
            {
                mark.PosX = posXAttribute;
                posXAttribute = null;
            }
            var posYAttribute = bodyMarkElement.getAttribute("PosY");
            if (posYAttribute != null)
            {
                mark.PosY = posYAttribute;
                posYAttribute = null;
            }
            return mark;
        },


        ParseBodyLocateElement : function(bodyLocateElement, param) {
            if (!bodyLocateElement.hasChildNodes())
            {
                return null;
            }
            var locate = new msgBodyLocate();
            var idAttribute = bodyLocateElement.getAttribute("Id");
            if (idAttribute != null)
            {
                locate.Id = idAttribute;
                idAttribute = null;
            }
            var alarmTypeAttribute = bodyLocateElement.getAttribute("AlarmType");
            if (alarmTypeAttribute != null)
            {
                locate.AlarmType = alarmTypeAttribute;
                alarmTypeAttribute = null;
            }
            var locateTypeAttribute = bodyLocateElement.getAttribute("LocateType");
            if (locateTypeAttribute != null)
            {
                locate.LocateType = locateTypeAttribute;
                locateTypeAttribute = null;
            }
            var additionAttribute = bodyLocateElement.getAttribute("Addition");
            if (additionAttribute != null)
            {
                locate.Addition = additionAttribute;
                additionAttribute = null;
            }

            var nodelist = bodyLocateElement.childNodes;
            for (var i = 0; i < nodelist.length; i++)
            {
                if (nodelist[i].nodeName.toLowerCase() == "data")
                {
                    locate.Data = this.ParseBodyLocateDataElement(nodelist[i], param);
                }
            }
            //释放零时变量
            nodelist = null;
            return locate;
        },


        ParseBodyLocateDataElement : function(bodyLocateDataElement, param) {
            //            if (!bodyLocateDataElement.hasChildNodes())
            //            {
            //                return null;
            //            }
            var data = new msgBodyLocateData();
            var ownerAttribute = bodyLocateDataElement.getAttribute("Owner");
            if (ownerAttribute != null)
            {
                data.Owner = ownerAttribute;
                ownerAttribute = null;
            }
            var ownerAddrAttribute = bodyLocateDataElement.getAttribute("OwnerAddr");
            if (ownerAddrAttribute != null)
            {
                data.OwnerAddr = ownerAddrAttribute;
                ownerAddrAttribute = null;
            }
            var telephoneAttribute = bodyLocateDataElement.getAttribute("Telephone");
            if (telephoneAttribute != null)
            {
                data.Telephone = telephoneAttribute;
                telephoneAttribute = null;
            }
            var alarmAddrAttribute = bodyLocateDataElement.getAttribute("AlarmAddr");
            if (alarmAddrAttribute != null)
            {
                data.AlarmAddr = alarmAddrAttribute;
                alarmAddrAttribute = null;
            }
            var mobileAttribute = bodyLocateDataElement.getAttribute("Mobile");
            if (mobileAttribute != null)
            {
                data.Mobile = mobileAttribute;
                mobileAttribute = null;
            }
            var baseStationAttribute = bodyLocateDataElement.getAttribute("BaseStation");
            if (baseStationAttribute != null)
            {
                data.BaseStation = baseStationAttribute;
                baseStationAttribute = null;
            }
            var stationIdAttribute = bodyLocateDataElement.getAttribute("StationId");
            if (stationIdAttribute != null)
            {
                data.StationId = stationIdAttribute;
                stationIdAttribute = null;
            }
            var longitudeAttribute = bodyLocateDataElement.getAttribute("Longitude");
            if (longitudeAttribute != null)
            {
                data.Longitude = longitudeAttribute;
                longitudeAttribute = null;
            }
            var latitudeAttribute = bodyLocateDataElement.getAttribute("Latitude");
            if (latitudeAttribute != null)
            {
                data.Latitude = latitudeAttribute;
                latitudeAttribute = null;
            }
            var poleNoAttribute = bodyLocateDataElement.getAttribute("PoleNo");
            if (poleNoAttribute != null)
            {
                data.PoleNo = poleNoAttribute;
                poleNoAttribute = null;
            }
            var posXAttribute = bodyLocateDataElement.getAttribute("PosX");
            if (posXAttribute != null)
            {
                data.PosX = posXAttribute;
                posXAttribute = null;
            }
            var posYAttribute = bodyLocateDataElement.getAttribute("PosY");
            if (posYAttribute != null)
            {
                data.PosY = posYAttribute;
                posYAttribute = null;
            }
            var IdAttribute = bodyLocateDataElement.getAttribute("Id");
            if (IdAttribute != null) {
                data.ID = IdAttribute;
                IdAttribute = null;
            }
            var nameAttribute = bodyLocateDataElement.getAttribute("Name");
            if (nameAttribute != null) {
                data.Name = nameAttribute;
                nameAttribute = null;
            }
            return data;
        },


        LoadXml : function(msgXMLString) {
            var xmlDoc = null;
            if (window.ActiveXObject)
            {
                xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
                xmlDoc.async = false;
                xmlDoc.loadXML(msgXMLString);
                this.IsChrome = false;
            }
            else if (window.DOMParser && document.implementation && document.implementation.createDocument)
            {
                var domParser = new DOMParser();
                xmlDoc = domParser.parseFromString(msgXMLString,"text/xml");
                this.IsChrome = true;
            }
            return xmlDoc;
        }

    });


});