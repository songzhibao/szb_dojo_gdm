define([
    "dojo/_base/declare",
    "dojo/request/xhr"
], function (declare, xhr) {

    var JsonData = declare([], {

        constructor: function () {
        },

        getCarType: function () {
            var carType;

            xhr.post('/Config/GetCarTypes', {
                sync: true,
                handleAs: "json"
            }).then(
                function (data) {
                    carType = data;
                },
                function (error) {
                    console.debug(error);
                }
            );

            return carType;
        },

        getManType: function () {

            var manType;

            xhr.post('/Config/GetManTypes', {
                sync: true,
                handleAs: "json"
            }).then(
                function (data) {
                    manType = data;
                },
                function (error) {
                    console.debug(error);
                }
            );

            return manType;
        },

        getOrgLevelByType: function (type) {

            var orgLevel  = {
                identifier: 'id',
                label: 'name',
                items: [
	                { id: '1', name: '1级' },
	                { id: '2', name: '2级' },
	                { id: '3', name: '3级' }
                ]
            };

            return orgLevel;
        },

        getPoliceType: function () {

            var policeType = null;
            xhr.post('/system/getOrgTypeDic', {
                sync: true,
                handleAs: "json"
            }).then(
                function (data) {
                    policeType = {identifier:"id",label:"name",items:data.data};
                },
                function (error) {
                    console.debug(error);
                }
            );
            return policeType;
        },

        getOrgTree: function () {
            var orgTree = [
                { value: '', label: '全部', selected: true },
                { value: 'police_tree', label: '公安组织结构树' },
                { value: 'fire_tree', label: '消防组织结构树' }
            ];
            return orgTree;
        }

    });

    return new JsonData();
});