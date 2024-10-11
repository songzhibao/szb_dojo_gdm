define([
    "dojo/_base/declare",
    "dojo/data/ItemFileWriteStore",
    "dojo/topic",

    "dijit/registry",
    "dijit/layout/ContentPane",

    "dojox/widget/Standby",
    "dojox/grid/EnhancedGrid",
    "dojox/grid/enhanced/plugins/Filter",
    "dojox/grid/enhanced/plugins/Pagination",
    "dojox/grid/enhanced/plugins/IndirectSelection",
    "egis/Share/component/Dialog/Dialog"

], function (declare, ItemFileWriteStore, topic, registry, ContentPane, Standby, EnhancedGrid,Filter,Pagination,IndirectSelection, Dialog) {

    return declare([], {

        gridWidget: null,

        /*
        * 表格实例
        */
        grid: null,

        /*
        * 列表表头
        */
        gridHeader: null,

        /*
        * 右键菜单
        */
        gridContextMenu: null,

        /*
        * 等待提示
        */
        standby: null,

        constructor: function (args) {
            declare.safeMixin(this, args || {});

            this.gridHeader = [{
                name: 'default',
                field: 'default',
                width: '96%',
                styles: "text-align: center;"
            }];

            this.buildGrid();
            this.buildStandby();
        },

        buildGrid: function () {
            var self = this;

            self.grid = new EnhancedGrid({
                store: null,
                structure: self.gridHeader,
                style: 'width:100%; height:100%; border:0px;',
                plugins: {
                    indirectSelection: {
                        headerSelector: true,
                        width: "4%",
                        styles: "text-align: center;"
                    },
                    pagination: {
                        pageSizes: ["20", "50", "100", "All"],
                        description: true,
                        sizeSwitch: true,
                        pageStepper: true,
                        gotoButton: true,
                        maxPageStep: 5,
                        defaultPageSize: 20,
                        position: "bottom"
                    }
                }
            }, document.createElement('div'));

            // 单击选中
            dojo.connect(self.grid, "onCellClick", function (e) {
                if (e.cellIndex != 0) {
                    self.grid.selection.select(e.rowIndex);
                }

                var item = (self.grid.selection.getSelected())[0];
                if (e.cell.field == "gatherXY") {
                    if (item.videoId) {
                        topic.publish("gatherXY", {
                            item: item
                        });
                        return;
                    }
                }
                if (e.cell.field == "edit") {
                    if (item.orgId) {
                        topic.publish("editOrgInfo", {
                            item: item
                        });
                        return;
                    }
                    if (item.id) {
                        topic.publish("editRole", {
                            item: item
                        });
                        return;
                    }
                    if (item.policeCarId) {
                        topic.publish("editPoliceCar", {
                            item: item
                        });
                        return;
                    }
                    if (item.policemanId) {
                        topic.publish("editPoliceman", {
                            item: item
                        });
                        return;
                    }
                    if (item.videoId) {
                        topic.publish("editVideo", {
                            item: item
                        });
                        return;
                    }
                    if (item.detectorId) {
                        topic.publish("editDetector", {
                            item: item
                        });
                        return;
                    }
                } else if(e.cell.field.indexOf("edit") >= 0) {
                    topic.publish(e.cell.field, {
                        item: item
                    });
                    return;
                }
                if (e.cell.field == "delete") {
                    var dialog;
                    if (item.orgId) {
                        dialog = new Dialog({
                            title: '提示',
                            message: {
                                type: 'warn',
                                text: '确定删除组织？'
                            }
                        });
                        dialog.show();

                        dialog.okButton.on('click', function () {
                            topic.publish("deleteOrgs", {
                                items: [item]
                            });

                            dialog.hide();
                        });

                        return;
                    }
                    if (item.id) {
                        dialog = new Dialog({
                            title: '提示',
                            message: {
                                type: 'warn',
                                text: '确定删除角色？'
                            }
                        });
                        dialog.show();

                        dialog.okButton.on('click', function () {
                            topic.publish("deleteRoles", {
                                items: [item]
                            });

                            dialog.hide();
                        });
                        return;
                    }
                    if (item.policeCarId) {
                        dialog = new Dialog({
                            title: '提示',
                            message: {
                                type: 'warn',
                                text: '确定删除警车？'
                            }
                        });
                        dialog.show();

                        dialog.okButton.on('click', function () {
                            topic.publish("deletePoliceCars", {
                                items: [item]
                            });

                            dialog.hide();
                        });
                        return;
                    }
                    if (item.policemanId) {                        
                        dialog = new Dialog({
                            title: '提示',
                            message: {
                                type: 'warn',
                                text: '确定删除警员？'
                            }
                        });
                        dialog.show();

                        dialog.okButton.on('click', function () {
                            topic.publish("deletePolicemen", {
                                items: [item]
                            });

                            dialog.hide();
                        });
                        return;
                    }
                    if (item.videoId) {                        
                        dialog = new Dialog({
                            title: '提示',
                            message: {
                                type: 'warn',
                                text: '确定删除视频？'
                            }
                        });
                        dialog.show();

                        dialog.okButton.on('click', function () {
                            topic.publish("deleteVideos", {
                                items: [item]
                            });

                            dialog.hide();
                        });
                        return;
                    }
                    if (item.detectorId) {                        
                        dialog = new Dialog({
                            title: '提示',
                            message: {
                                type: 'warn',
                                text: '确定删除卡口？'
                            }
                        });
                        dialog.show();

                        dialog.okButton.on('click', function () {
                            topic.publish("deleteDetectors", {
                                items: [item]
                            });

                            dialog.hide();
                        });
                        return;
                    }
                } else if(e.cell.field.indexOf("delete") >= 0) {
                    var dialog;
                    if (item.id) {
                        dialog = new Dialog({
                            title: '提示',
                            message: {
                                type: 'warn',
                                text: '确定删除？'
                            }
                        });
                        dialog.show();
                        dialog.okButton.on('click', function () {
                            topic.publish(e.cell.field, {
                                items: [item]
                            });

                            dialog.hide();
                        });
                        return;
                    }
                }
            });

            dojo.connect(self.grid, "onSelected", function (e) {
                self.updateToolbarStatus();
            });

            dojo.connect(self.grid, "onDeselected", function (e) {
                self.updateToolbarStatus();
            });

            if (self.gridWidget) {
                self.gridWidget.addChild(self.grid);
            }
        },

        buildStandby: function () {
            // 创建等待提示
            this.standby = new Standby({
                target: this.gridWidget.domNode
            });
            document.body.appendChild(this.standby.domNode);
            this.standby.startup();
        },

        update: function (gridHeader, store) {
            var self = this;

            self.grid.setStructure(null);
            self.grid.setStructure(gridHeader);

            self.grid.setStore(null);
            self.grid.setStore(store);

            self.grid.selection.deselectAll();

            self.updateToolbarStatus();
        },

        updateToolbarStatus: function () {
            var selected = this.grid.selection.getSelected();
            var count = selected.length;
            // dojox/grid/EnhancedGrid中selection.getSelected的BUG修复
            if (selected && selected.length == 1 && selected[0] == null) {
                count = 0;
            }
            //console.debug("updateToolbarStatus selectedCount:" + count);
            topic.publish("onSelectedCount", {
                count: count
            });
        },

        deleteSelectedRows: function () {
            this.grid.removeSelectedRows();
        }

    });
});