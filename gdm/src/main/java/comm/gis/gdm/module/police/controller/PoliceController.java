package comm.gis.gdm.module.police.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;

import comm.gis.gdm.common.code.UserErrorCode;
import comm.gis.gdm.common.domain.*;
import comm.gis.gdm.module.police.domain.*;
import comm.gis.gdm.module.police.service.PoliceService;
import io.swagger.annotations.*;
import io.swagger.v3.oas.annotations.Operation;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Api(tags = "警力信息接口")
@RestController
@RequestMapping("/police")
public class PoliceController {

    @Autowired
    private PoliceService indexPoliceService;

    @ApiImplicitParams({
            @ApiImplicitParam(name = "operator", value = "人员编号", required = true, dataType = "String", dataTypeClass = String.class),
            @ApiImplicitParam(name = "operatorOrg", value = "单位编号", required = true, dataType = "String", dataTypeClass = String.class)
    })
    @Operation(summary = "获取调度呼叫组列表")
    @PostMapping("/getCallGroupList")
    public ResponseResult<List<CallGroupEntity>> getCallGroupList(
            @RequestParam String operator, @RequestParam String operatorOrg) {

        try {
            List<CallGroupEntity> result = this.indexPoliceService.getCallGroupList(operator,
                    operatorOrg);
            if (result != null) {
                return ResponseResult.ok(result);
            } else {
                return ResponseResult.okMsg("查询无数据");
            }
        } catch (Exception e) {
            log.error("获取调度呼叫组列表" + " 参数：" + operator + "," + operatorOrg + " 异常：", e);
            return ResponseResult.error(UserErrorCode.PARAM_ERROR, e.getMessage());
        }
    }

    @ApiImplicitParams({
            @ApiImplicitParam(name = "groupId", value = "组编号", required = true, dataType = "String", dataTypeClass = String.class),
            @ApiImplicitParam(name = "operator", value = "人员编号", required = true, dataType = "String", dataTypeClass = String.class),
            @ApiImplicitParam(name = "operatorOrg", value = "单位编号", required = true, dataType = "String", dataTypeClass = String.class)
    })
    @ApiOperation(value = "删除调度呼叫组")
    @PostMapping("/deleteCallGroup")
    public ResponseResult<Boolean> deleteCallGroup(@RequestParam String operator,
            @RequestParam String operatorOrg,
            @RequestParam String groupId) {

        try {
            Boolean isSave = this.indexPoliceService.deleteCallGroup(operator, operatorOrg, groupId);
            if (isSave) {
                return ResponseResult.ok(isSave);
            } else {
                return ResponseResult.error(UserErrorCode.DATA_NOT_EXIST, false);
            }
        } catch (Exception e) {
            log.error("删除调度呼叫组 异常：", e);
            return ResponseResult.error(UserErrorCode.PARAM_ERROR, e.getMessage());
        }
    }

    @ApiOperation(value = "保存调度分组信息")
    @PostMapping("/saveCallGroup")
    public ResponseResult<Boolean> saveCallGroup(@RequestBody CallGroupEntity param) {

        try {
            Boolean isSave = this.indexPoliceService.saveCallGroup(param);
            if (isSave) {
                return ResponseResult.ok(isSave);
            } else {
                return ResponseResult.error(UserErrorCode.DATA_NOT_EXIST, false);
            }
        } catch (Exception e) {
            log.error("保存调度分组信息 异常：", e);
            return ResponseResult.error(UserErrorCode.PARAM_ERROR, e.getMessage());
        }
    }

    @ApiImplicitParams({
            @ApiImplicitParam(name = "orgCodes", value = "单位编号数组", required = true, dataType = "List<String>", dataTypeClass = String.class),
            @ApiImplicitParam(name = "keyWord", value = "模糊名字查询", allowEmptyValue = true, dataType = "String", dataTypeClass = String.class)
    })
    @Operation(summary = "获取单位树形警力数据")
    @PostMapping("/getPolicesWithOrgTree")
    public ResponseResult<List<OrgInfoWithPolicesEntity>> getPolicesWithOrgTree(
            @RequestParam List<String> orgCodes, @RequestParam(required = false) String keyWord) {

        try {
            List<OrgInfoWithPolicesEntity> result = this.indexPoliceService.getPolicesWithOrgTree(orgCodes,
                    keyWord);
            if (result != null) {
                return ResponseResult.ok(result);
            } else {
                return ResponseResult.okMsg("查询无数据");
            }
        } catch (Exception e) {
            log.error("获取单位树形警力数据" + " 参数：" + JSON.toJSONString(orgCodes) + "," + keyWord + " 异常：", e);
            return ResponseResult.error(UserErrorCode.PARAM_ERROR, e.getMessage());
        }
    }

    @ApiImplicitParams({
            @ApiImplicitParam(name = "orgCodes", value = "单位编号数组", required = true, dataType = "List<String>", dataTypeClass = String.class),
            @ApiImplicitParam(name = "keyWord", value = "模糊名字查询", allowEmptyValue = true, dataType = "String", dataTypeClass = String.class)
    })
    @Operation(summary = "获取单位和警力数据")
    @PostMapping("/getPolicesWithOrg")
    public ResponseResult<List<JSONObject>> getPolicesWithOrg(
            @RequestParam List<String> orgCodes, @RequestParam(required = false) String keyWord) {

        try {
            List<JSONObject> result = this.indexPoliceService.getPolicesWithOrg(orgCodes,
                    keyWord);
            if (result != null) {
                return ResponseResult.ok(result);
            } else {
                return ResponseResult.okMsg("查询无数据");
            }
        } catch (Exception e) {
            log.error("获取单位和警力数据 参数：" + JSON.toJSONString(orgCodes) + "," + keyWord + " 异常：", e);
            return ResponseResult.error(UserErrorCode.PARAM_ERROR, e.getMessage());
        }
    }

    @Operation(summary = "获取警力单位统计数据")
    @PostMapping("/getPoliceOrgStatInfo")
    public ResponseResult<List<PoliceStatOrgEntity>> getPoliceOrgStatInfo(
            @RequestBody PoliceQueryVO query) {

        try {
            List<PoliceStatOrgEntity> result = this.indexPoliceService.getPoliceOrgStatInfo(query.getOrgCodes(),
                    query.getPoliceStatus(),
                    query.getPoliceTypes());
            if (result != null) {
                return ResponseResult.ok(result);
            } else {
                return ResponseResult.okMsg("查询无数据");
            }
        } catch (Exception e) {
            log.error("获取警力单位统计数据" + " 参数：" + JSON.toJSONString(query) + " 异常：", e);
            return ResponseResult.error(UserErrorCode.PARAM_ERROR, e.getMessage());
        }
    }

    @Operation(summary = "获取警力列表数据")
    @PostMapping("/getPoliceInfos")
    public ResponseResult<List<PoliceInfoEntity>> getPoliceInfos(
            @RequestBody PoliceQueryVO query) {

        try {
            List<PoliceInfoEntity> result = this.indexPoliceService.getPoliceInfos(query.getOrgCodes(),
                    query.getPoliceStatus(),
                    query.getPoliceTypes());
            if (result != null) {
                return ResponseResult.ok(result);
            } else {
                return ResponseResult.okMsg("查询无数据");
            }
        } catch (Exception e) {
            log.error("获取警力列表数据" + " 参数：" + JSON.toJSONString(query) + " 异常：", e);
            return ResponseResult.error(UserErrorCode.PARAM_ERROR, e.getMessage());
        }
    }

    @Operation(summary = "获取警力状态统计数据")
    @PostMapping("/getPoliceStatusStatInfo")
    public ResponseResult<List<PoliceStatStatusEntity>> getPoliceStatusStatInfo(
            @RequestBody PoliceQueryVO query) {

        try {
            List<PoliceStatStatusEntity> result = this.indexPoliceService.getPoliceStatusStatInfo(query.getOrgCodes(),
                    query.getPoliceStatus(),
                    query.getPoliceTypes());
            if (result != null) {
                return ResponseResult.ok(result);
            } else {
                return ResponseResult.okMsg("查询无数据");
            }
        } catch (Exception e) {
            log.error("获取警力状态统计数据" + " 参数：" + JSON.toJSONString(query) + " 异常：", e);
            return ResponseResult.error(UserErrorCode.PARAM_ERROR, e.getMessage());
        }
    }

    @Operation(summary = "获取警力类型统计数据")
    @PostMapping("/getPoliceTypeStatInfo")
    public ResponseResult<List<PoliceStatTypeEntity>> getPoliceTypeStatInfo(
            @RequestBody PoliceQueryVO query) {

        try {
            List<PoliceStatTypeEntity> result = this.indexPoliceService.getPoliceTypeStatInfo(query.getOrgCodes(),
                    query.getPoliceStatus(),
                    query.getPoliceTypes());
            if (result != null) {
                return ResponseResult.ok(result);
            } else {
                return ResponseResult.okMsg("查询无数据");
            }
        } catch (Exception e) {
            log.error("获取警力类型统计数据" + " 参数：" + JSON.toJSONString(query) + " 异常：", e);
            return ResponseResult.error(UserErrorCode.PARAM_ERROR, e.getMessage());
        }
    }

    @ApiImplicitParams({
            @ApiImplicitParam(name = "orgCodes", value = "单位编号数组", required = true, dataType = "List<String>", dataTypeClass = String.class),
            @ApiImplicitParam(name = "keyWord", value = "模糊名字查询", required = false, dataType = "String", dataTypeClass = String.class)
    })
    @Operation(summary = "获取创建人警力列表")
    @PostMapping("/getPoliceInfosByCreator")
    public ResponseResult<List<PoliceInfoEntity>> getPoliceInfosByCreator(
            @RequestParam List<String> orgCodes, @RequestParam(required = false) String keyWord) {

        try {
            List<PoliceInfoEntity> result = this.indexPoliceService.getPoliceInfosByCreator(orgCodes,
                    keyWord);
            if (result != null) {
                return ResponseResult.ok(result);
            } else {
                return ResponseResult.okMsg("查询无数据");
            }
        } catch (Exception e) {
            log.error("获取创建人警力列表" + " 参数：" + JSON.toJSONString(orgCodes) + "," + keyWord + " 异常：", e);
            return ResponseResult.error(UserErrorCode.PARAM_ERROR, e.getMessage());
        }
    }

}
