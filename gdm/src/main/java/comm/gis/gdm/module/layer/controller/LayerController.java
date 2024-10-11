package comm.gis.gdm.module.layer.controller;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import comm.gis.gdm.common.code.UserErrorCode;
import comm.gis.gdm.common.domain.ResponseResult;
import comm.gis.gdm.module.layer.domain.*;
import comm.gis.gdm.module.layer.service.LayerService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Api(tags = "图层信息接口")
@RestController
@RequestMapping("/layer")
public class LayerController {

    @Autowired
    private LayerService layerService;

    @ApiOperation(value = "获取图层标签分类信息")
    @GetMapping("/getLayerBiz")
    public ResponseResult<List<LayerBizEntity>> getLayerBiz() {

        try {
            List<LayerBizEntity> bean = this.layerService.getLayerBiz();
            if (bean != null) {
                return ResponseResult.ok(bean);
            } else {
                return ResponseResult.error(UserErrorCode.DATA_NOT_EXIST, false);
            }
        } catch (Exception e) {
            log.error("获取图层标签分类信息 异常：", e);
            return ResponseResult.error(UserErrorCode.PARAM_ERROR, e.getMessage());
        }
    }

    @ApiOperation(value = "获取图层分组信息")
    @GetMapping("/getLayerGroup")
    public ResponseResult<List<LayerGroupEntity>> getLayerGroup() {

        try {
            List<LayerGroupEntity> bean = this.layerService.getLayerGroup();
            if (bean != null) {
                return ResponseResult.ok(bean);
            } else {
                return ResponseResult.error(UserErrorCode.DATA_NOT_EXIST, false);
            }
        } catch (Exception e) {
            log.error("获取图层分组信息 异常：", e);
            return ResponseResult.error(UserErrorCode.PARAM_ERROR, e.getMessage());
        }
    }

    @ApiOperation(value = "获取图层配置信息")
    @GetMapping("/getLayerInfos")
    public ResponseResult<List<LayerInfoEntity>> getLayerInfos() {

        try {
            List<LayerInfoEntity> bean = this.layerService.getLayerInfos();
            if (bean != null) {
                return ResponseResult.ok(bean);
            } else {
                return ResponseResult.error(UserErrorCode.DATA_NOT_EXIST, false);
            }
        } catch (Exception e) {
            log.error("获取图层配置信息 异常：", e);
            return ResponseResult.error(UserErrorCode.PARAM_ERROR, e.getMessage());
        }
    }

    @ApiOperation(value = "查询周边图层资源列表")
    @PostMapping("/getResources")
    public ResponseResult<List<LayerShowEntity>> getResources(@RequestBody LayerInfoVO param) {
        try {
            List<LayerShowEntity> bean = this.layerService.getResources(param);
            if (bean != null) {
                return ResponseResult.ok(bean);
            } else {
                return ResponseResult.error(UserErrorCode.DATA_NOT_EXIST, false);
            }
        } catch (Exception e) {
            log.error("查询周边图层资源列表 异常：", e);
            return ResponseResult.error(UserErrorCode.PARAM_ERROR, e.getMessage());
        }
    }
}
