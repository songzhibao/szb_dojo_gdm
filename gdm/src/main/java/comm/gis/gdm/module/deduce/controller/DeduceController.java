package comm.gis.gdm.module.deduce.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.alibaba.fastjson.*;
import comm.gis.gdm.common.code.UserErrorCode;
import comm.gis.gdm.common.domain.*;
import comm.gis.gdm.module.deduce.domain.*;
import comm.gis.gdm.module.deduce.service.DeduceService;
import io.swagger.annotations.*;
import io.swagger.v3.oas.annotations.Operation;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Api(tags = "推演信息接口")
@RestController
@RequestMapping("/deduce")
public class DeduceController {

    @Autowired
    private DeduceService deduceService;

    @ApiImplicitParams({
            @ApiImplicitParam(name = "id", value = "编号", required = true, dataType = "String", dataTypeClass = String.class)
    })
    @ApiOperation(value = "删除图形")
    @PostMapping("/deleteDeduceRegion")
    public ResponseResult<Boolean> deleteDeduceRegion(@RequestParam String id) {

        try {
            Boolean isSave = this.deduceService.deleteDeduceRegion(id);
            if (isSave) {
                return ResponseResult.ok(isSave);
            } else {
                return ResponseResult.error(UserErrorCode.DATA_NOT_EXIST, false);
            }
        } catch (Exception e) {
            log.error("删除图形 异常：", e);
            return ResponseResult.error(UserErrorCode.PARAM_ERROR, e.getMessage());
        }
    }

    @ApiImplicitParams({
            @ApiImplicitParam(name = "id", value = "编号", required = true, dataType = "String", dataTypeClass = String.class)
    })
    @ApiOperation(value = "删除保障点")
    @PostMapping("/deleteDeducePoint")
    public ResponseResult<Boolean> deleteDeducePoint(@RequestParam String id) {

        try {
            Boolean isSave = this.deduceService.deleteDeducePoint(id);
            if (isSave) {
                return ResponseResult.ok(isSave);
            } else {
                return ResponseResult.error(UserErrorCode.DATA_NOT_EXIST, false);
            }
        } catch (Exception e) {
            log.error("删除保障点 异常：", e);
            return ResponseResult.error(UserErrorCode.PARAM_ERROR, e.getMessage());
        }
    }

    @ApiImplicitParams({
            @ApiImplicitParam(name = "taskId", value = "任务编号", required = true, dataType = "String", dataTypeClass = String.class)
    })
    @ApiOperation(value = "删除推演任务")
    @PostMapping("/deleteDeduceTask")
    public ResponseResult<Boolean> deleteDeduceTask(@RequestParam String taskId) {

        try {
            Boolean isSave = this.deduceService.deleteDeduceTask(taskId);
            if (isSave) {
                return ResponseResult.ok(isSave);
            } else {
                return ResponseResult.error(UserErrorCode.DATA_NOT_EXIST, false);
            }
        } catch (Exception e) {
            log.error("删除推演任务 异常：", e);
            return ResponseResult.error(UserErrorCode.PARAM_ERROR, e.getMessage());
        }
    }

    @ApiOperation(value = "保存推演任务")
    @PostMapping("/saveTaskInfo")
    public ResponseResult<Boolean> saveTaskInfo(@RequestBody DeduceTaskEntity param) {

        try {
            Boolean isSave = this.deduceService.saveTaskInfo(param);
            if (isSave != null) {
                return ResponseResult.ok(isSave);
            } else {
                return ResponseResult.error(UserErrorCode.DATA_NOT_EXIST, false);
            }
        } catch (Exception e) {
            log.error("保存推演任务 参数：" + JSON.toJSONString(param) + " 异常：", e);
            return ResponseResult.error(UserErrorCode.PARAM_ERROR, e.getMessage());
        }
    }

    @ApiOperation(value = "保存保障点信息")
    @PostMapping("/savePointInfo")
    public ResponseResult<Boolean> savePointInfo(@RequestBody DeducePointEntity param) {

        try {
            Boolean isSave = this.deduceService.savePointInfo(param);
            if (isSave != null) {
                return ResponseResult.ok(isSave);
            } else {
                return ResponseResult.error(UserErrorCode.DATA_NOT_EXIST, false);
            }
        } catch (Exception e) {
            log.error("保存保障点信息 参数：" + JSON.toJSONString(param) + " 异常：", e);
            return ResponseResult.error(UserErrorCode.PARAM_ERROR, e.getMessage());
        }
    }

    @ApiOperation(value = "保存图形修改")
    @PostMapping("/saveRegionInfo")
    public ResponseResult<Boolean> saveRegionInfo(@RequestBody DeduceRegionEntity param) {

        try {
            Boolean isSave = this.deduceService.saveRegionInfo(param);
            if (isSave != null) {
                return ResponseResult.ok(isSave);
            } else {
                return ResponseResult.error(UserErrorCode.DATA_NOT_EXIST, false);
            }
        } catch (Exception e) {
            log.error("保存图形修改 参数：" + JSON.toJSONString(param) + " 异常：", e);
            return ResponseResult.error(UserErrorCode.PARAM_ERROR, e.getMessage());
        }
    }

    @ApiImplicitParams({
            @ApiImplicitParam(name = "regionId", value = "图形ID", required = true, dataTypeClass = Long.class),
            @ApiImplicitParam(name = "taskId", value = "任务ID", required = true, dataTypeClass = Long.class),
            @ApiImplicitParam(name = "content", value = "图形内容", required = true, dataTypeClass = String.class),
    })
    @ApiOperation(value = "保存图形修改")
    @PostMapping("/saveRegionEdit")
    public ResponseResult<Boolean> saveRegionEdit(@RequestParam Long regionId, @RequestParam String taskId,
            @RequestParam String content) {

        try {
            Boolean isSave = this.deduceService.saveRegionEdit(regionId, taskId, content);
            if (isSave != null) {
                return ResponseResult.ok(isSave);
            } else {
                return ResponseResult.error(UserErrorCode.DATA_NOT_EXIST, false);
            }
        } catch (Exception e) {
            log.error("保存图形修改  异常：", e);
            return ResponseResult.error(UserErrorCode.PARAM_ERROR, e.getMessage());
        }
    }

    @Operation(summary = "获取任务列表")
    @PostMapping("/getDeduceTasks")
    public ResponseResult<List<DeduceTaskEntity>> getDeduceTasks() {

        try {
            List<DeduceTaskEntity> result = this.deduceService.getDeduceTasks();
            if (result != null) {
                return ResponseResult.ok(result);
            } else {
                return ResponseResult.okMsg("查询无数据");
            }
        } catch (Exception e) {
            log.error("获取任务列表  异常：", e);
            return ResponseResult.error(UserErrorCode.PARAM_ERROR, e.getMessage());
        }
    }

    @ApiImplicitParams({
            @ApiImplicitParam(name = "taskId", value = "任务编号", required = true, dataType = "String", dataTypeClass = String.class)
    })
    @Operation(summary = "获取保障点")
    @PostMapping("/getDeducePoints")
    public ResponseResult<List<DeducePointEntity>> getDeducePoints(
            @RequestParam String taskId) {

        try {
            List<DeducePointEntity> result = this.deduceService.getDeducePoints(taskId);
            if (result != null) {
                return ResponseResult.ok(result);
            } else {
                return ResponseResult.okMsg("查询无数据");
            }
        } catch (Exception e) {
            log.error("获取保障点 参数：" + taskId + " 异常：", e);
            return ResponseResult.error(UserErrorCode.PARAM_ERROR, e.getMessage());
        }
    }

    @ApiImplicitParams({
            @ApiImplicitParam(name = "taskId", value = "任务编号", required = true, dataType = "String", dataTypeClass = String.class)
    })
    @Operation(summary = "获取推演线路图形")
    @PostMapping("/getDeduceRegoions")
    public ResponseResult<List<DeduceRegionEntity>> getDeduceRegoions(
            @RequestParam String taskId) {

        try {
            List<DeduceRegionEntity> result = this.deduceService.getDeduceRegoions(taskId);
            if (result != null) {
                return ResponseResult.ok(result);
            } else {
                return ResponseResult.okMsg("查询无数据");
            }
        } catch (Exception e) {
            log.error("获取推演线路图形" + " 参数：" + taskId + " 异常：", e);
            return ResponseResult.error(UserErrorCode.PARAM_ERROR, e.getMessage());
        }
    }

    @ApiImplicitParams({
            @ApiImplicitParam(name = "taskId", value = "任务编号", required = true, dataType = "String", dataTypeClass = String.class),
            @ApiImplicitParam(name = "stageList", value = "章节列表", required = true, dataType = "String", dataTypeClass = String.class)
    })
    @Operation(summary = "获取播放元素")
    @PostMapping("/getDeducePlayInfo")
    public ResponseResult<DeduceTaskEntity> getDeducePlayInfo(
            @RequestParam String taskId, @RequestParam String stageList) {

        try {
            DeduceTaskEntity result = this.deduceService.getDeducePlayInfo(taskId,
                    stageList);
            if (result != null) {
                return ResponseResult.ok(result);
            } else {
                return ResponseResult.okMsg("查询无数据");
            }
        } catch (Exception e) {
            log.error("获取播放元素" + " 参数：" + taskId + "," + stageList + " 异常：", e);
            return ResponseResult.error(UserErrorCode.PARAM_ERROR, e.getMessage());
        }
    }

    @ApiImplicitParams({
            @ApiImplicitParam(name = "taskId", value = "任务编号", required = true, dataType = "String", dataTypeClass = String.class),
            @ApiImplicitParam(name = "isCheck", value = "是否勾选", required = true, dataType = "Boolean", dataTypeClass = Boolean.class)
    })
    @ApiOperation(value = "获取推演点树")
    @PostMapping("/getDeducePointTree")
    public ResponseResult<JSONArray> getDeducePointTree(@RequestParam String taskId,
            @RequestParam Boolean isCheck) {

        try {
            JSONArray result = this.deduceService.getDeducePointTree(taskId, isCheck);
            if (result != null) {
                return ResponseResult.ok(result);
            } else {
                return ResponseResult.error(UserErrorCode.DATA_NOT_EXIST, false);
            }
        } catch (Exception e) {
            log.error("获取推演点树 异常：", e);
            return ResponseResult.error(UserErrorCode.PARAM_ERROR, e.getMessage());
        }
    }

}
