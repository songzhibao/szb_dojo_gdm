package comm.gis.gdm.module.duty.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;

import com.alibaba.fastjson.JSON;

import comm.gis.gdm.common.code.UserErrorCode;
import comm.gis.gdm.common.domain.ResponseResult;
import comm.gis.gdm.module.duty.domain.*;
import comm.gis.gdm.module.duty.service.DutyService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import io.swagger.v3.oas.annotations.Operation;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Api(tags = "勤务网格接口")
@RestController
@RequestMapping("/duty")
public class DutyController {

    @Autowired
    private DutyService dutyService;

    @ApiImplicitParams({
            @ApiImplicitParam(name = "id", value = "编号", required = true, dataType = "String", dataTypeClass = String.class)
    })
    @ApiOperation(value = "删除图形")
    @PostMapping("/deleteRegion")
    public ResponseResult<Boolean> deleteRegion(@RequestParam Long id) {

        try {
            Boolean isSave = this.dutyService.deleteRegion(id);
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
            @ApiImplicitParam(name = "orgIds", value = "单位编码数组", required = true, dataTypeClass = String.class),
            @ApiImplicitParam(name = "typeIds", value = "类型编码数组", required = false, dataTypeClass = String.class),
    })
    @Operation(summary = "获取勤务网格列表")
    @PostMapping("/getDutyRegionList")
    public ResponseResult<List<DutyRegionEntity>> getDutyRegionList(@RequestParam List<String> orgIds,
            @RequestParam(required = false) List<Integer> typeIds) {

        try {
            List<DutyRegionEntity> result = this.dutyService.getDutyRegionList(orgIds, typeIds);
            if (result != null && result.size() > 0) {
                return ResponseResult.ok(result);
            } else {
                return ResponseResult.okMsg("查询无数据");
            }
        } catch (Exception e) {
            log.error("获取勤务网格列表 异常：", e);
            return ResponseResult.error(UserErrorCode.PARAM_ERROR, e.getMessage());
        }
    }

    @ApiOperation(value = "保存图形修改")
    @PostMapping("/saveRegionInfo")
    public ResponseResult<Boolean> saveRegionInfo(@RequestBody DutyRegionEntity param) {

        try {
            Boolean isSave = this.dutyService.saveRegionInfo(param);
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
            @ApiImplicitParam(name = "content", value = "图形内容", required = true, dataTypeClass = String.class),
    })
    @ApiOperation(value = "保存图形修改")
    @PostMapping("/saveRegionEdit")
    public ResponseResult<Boolean> saveRegionEdit(@RequestParam Long regionId, @RequestParam String content) {

        try {
            Boolean isSave = this.dutyService.saveRegionEdit(regionId, content);
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

}
