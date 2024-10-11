/**
* Created with JetBrains WebStorm.
* User: chengbin
* Date: 13-4-1
* To change this template use File | Settings | File Templates.
*/
define([
    "dojo/_base/declare",

    "dijit/tree/dndSource"
], function (declare, dndSource) {

    return declare([dndSource], {

        /*
        *	重写
        */
        onDndDrop: function (source, nodes, copy) {
            //console.debug("onDndDrop");

            if (!this.targetAnchor) {
                this.inherited(arguments);
                return;
            }

            var isSuccess = false;
            var results = [];
            var parentOrgId = this.targetAnchor.item.orgId ? this.targetAnchor.item.orgId + "" : "0";
            dojo.forEach(nodes, function (node, index) {
                var sourceItem = source.getItem(node.id);
                var orgId = sourceItem.data.item.orgId + "";
                var treeType = sourceItem.data.item.treeType + "";
                var org = {
                    orgId: orgId,
                    treeType: treeType,
                    parentOrgId: parentOrgId
                };
                results.push(org);
            });

            // 转换成字符串
            var resultsStr = dojo.toJson(results);
            console.debug(resultsStr);
            var xhrArgs = {
                url: "/OrgInfo/UpdateOrgTree",
                // 同步执行
                sync: true,
                content: {
                    newOrgStruct: resultsStr
                },
                preventCache: true,
                handleAs: "json",
                load: function (data) {
                    isSuccess = (data.success == "success") ? true : false;
                },
                error: function (error) {
                    isSuccess = false;
                    console.debug(error);
                }
            };
            var deferred = dojo.xhrPost(xhrArgs);

            // 入库失败则取消拖拽
            if (!isSuccess) {
                this.onDndCancel();
                alert("移动失败，请检查数据库！");
                return;
            }

            this.inherited(arguments);
        },

        /*
        *	重写
        */
        checkAcceptance: function () {
            //console.debug("checkAcceptance");
            return true;
        },

        /*
        *	重写
        */
        checkItemAcceptance: function (target, source, position) {
            //console.debug("checkItemAcceptance");
            var flag = true;
            source.forInSelectedItems(function (item) {
                if (!item.data.item) {
                    flag = false;
                }
            })
            return flag;
        }

    });
});

