package comm.gis.gdm.module.caseinfo.controller;

import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;

import comm.gis.gdm.common.code.UserErrorCode;
import comm.gis.gdm.common.domain.ResponseResult;
import comm.gis.gdm.module.caseinfo.domain.*;
import comm.gis.gdm.module.caseinfo.service.CaseInfoService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import io.swagger.v3.oas.annotations.Operation;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Api(tags = "警情信息接口")
@RestController
@RequestMapping("/caseinfo")
public class CaseInfoController {

    @Autowired
    private CaseInfoService caseInfoService;

    @Operation(summary = "获取警情统计信息")
    @PostMapping("/getCaseInfoStat")
    public ResponseResult<CaseStatEntity> getCaseInfoStat(@RequestBody CaseStatVO queryVO) {

        try {
            CaseStatEntity result = this.caseInfoService.getCaseInfoStat(queryVO);
            if (result != null) {
                return ResponseResult.ok(result);
            } else {
                return ResponseResult.okMsg("查询无数据");
            }
        } catch (Exception e) {
            log.error("获取警情统计信息 参数：" + JSON.toJSONString(queryVO) + " 异常：", e);
            return ResponseResult.error(UserErrorCode.PARAM_ERROR, e.getMessage());
        }
    }

    @Operation(summary = "获取警情24小时统计信息")
    @PostMapping("/getCaseFor24Line")
    public ResponseResult<CaseStatEntity> getCaseFor24Line(@RequestBody CaseStatVO queryVO) {

        try {
            CaseStatEntity result = this.caseInfoService.getCaseFor24Line(queryVO);
            if (result != null) {
                return ResponseResult.ok(result);
            } else {
                return ResponseResult.okMsg("查询无数据");
            }
        } catch (Exception e) {
            log.error("获取警情24小时统计信息 参数：" + JSON.toJSONString(queryVO) + " 异常：", e);
            return ResponseResult.error(UserErrorCode.PARAM_ERROR, e.getMessage());
        }
    }

    @Operation(summary = "获取警情列表")
    @PostMapping("/getCaseInfoList")
    public ResponseResult<List<CaseInfoEntity>> getCaseInfoList(@RequestBody QueryVO queryVO) {

        try {
            List<CaseInfoEntity> result = this.caseInfoService.getCaseInfoList(
                    queryVO.getStartTime(),
                    queryVO.getEndTime(),
                    queryVO.getCaseTypes(),
                    queryVO.getOrgCodes(),
                    queryVO.getGisQueryType(),
                    queryVO.getGisQueryValue(),
                    queryVO.getCaseCode(),
                    queryVO.getLimit());
            if (result != null && result.size() > 0) {
                return ResponseResult.ok(result);
            } else {
                return ResponseResult.okMsg("查询无数据");
            }
        } catch (Exception e) {
            log.error("获取警情列表" + " 参数：" + JSON.toJSONString(queryVO) + " 异常：", e);
            return ResponseResult.error(UserErrorCode.PARAM_ERROR, e.getMessage());
        }
    }

    @ApiImplicitParams({
            @ApiImplicitParam(name = "caseCode", value = "警情ID", paramType = "path", required = true, dataTypeClass = String.class),
    })
    @ApiOperation(value = "获取某警情的详细信息", tags = "警情信息接口")
    @GetMapping("/getCaseDetailInfo/{caseCode}")
    public ResponseResult<CaseInfoEntity> getCaseDetailInfo(@PathVariable("caseCode") String caseCode) {

        try {
            CaseInfoEntity bean = this.caseInfoService.getCaseDetailInfo(caseCode);
            if (bean != null) {
                return ResponseResult.ok(bean);
            } else {
                return ResponseResult.error(UserErrorCode.DATA_NOT_EXIST, false);
            }
        } catch (Exception e) {
            log.error("获取某警情的详细信息" + " 参数：" + caseCode + " 异常：", e);
            return ResponseResult.error(UserErrorCode.PARAM_ERROR, e.getMessage());
        }
    }

    @ApiImplicitParams({
            @ApiImplicitParam(name = "startTime", value = "开始时间", required = true, dataTypeClass = String.class),
            @ApiImplicitParam(name = "endTime", value = "结束时间", required = true, dataTypeClass = String.class),
    })
    @ApiOperation(value = "获取警情同环比统计", tags = "警情信息接口")
    @PostMapping("/getCaseTypeCount")
    public ResponseResult<List<CaseSumEntity>> getCaseTypeCount(@RequestParam String startTime,
            @RequestParam String endTime) {

        try {
            List<CaseSumEntity> bean = this.caseInfoService.getCaseTypeCount(startTime, endTime);
            if (bean != null) {
                return ResponseResult.ok(bean);
            } else {
                return ResponseResult.error(UserErrorCode.DATA_NOT_EXIST, false);
            }
        } catch (Exception e) {
            log.error("获取警情同环比统计 异常：", e);
            return ResponseResult.error(UserErrorCode.PARAM_ERROR, e.getMessage());
        }
    }

    @ApiImplicitParams({
            @ApiImplicitParam(name = "startTime", value = "开始时间", required = true, dataTypeClass = String.class),
            @ApiImplicitParam(name = "endTime", value = "结束时间", required = true, dataTypeClass = String.class),
            @ApiImplicitParam(name = "orgCodes", value = "单位编号", required = true, dataTypeClass = String.class),
            @ApiImplicitParam(name = "caseTypes", value = "案由编号", required = true, dataTypeClass = String.class),
    })
    @ApiOperation(value = "获取警情同环比统计详情", tags = "警情信息接口")
    @PostMapping("/getCaseTypeCountDetail")
    public ResponseResult<JSONObject> getCaseTypeCountDetail(@RequestParam String startTime,
            @RequestParam String endTime, @RequestParam List<String> orgCodes, @RequestParam List<Integer> caseTypes) {

        try {
            JSONObject bean = this.caseInfoService.getCaseTypeCountDetail(startTime, endTime, orgCodes, caseTypes);
            if (bean != null) {
                return ResponseResult.ok(bean);
            } else {
                return ResponseResult.error(UserErrorCode.DATA_NOT_EXIST, false);
            }
        } catch (Exception e) {
            log.error("获取警情同环比统计详情 异常：", e);
            return ResponseResult.error(UserErrorCode.PARAM_ERROR, e.getMessage());
        }
    }
}
