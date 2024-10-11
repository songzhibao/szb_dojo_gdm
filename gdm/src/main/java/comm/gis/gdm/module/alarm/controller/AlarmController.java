package comm.gis.gdm.module.alarm.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;

import com.alibaba.fastjson.JSON;
import comm.gis.gdm.common.code.UserErrorCode;
import comm.gis.gdm.common.domain.ResponseResult;
import comm.gis.gdm.module.alarm.domain.*;
import comm.gis.gdm.module.alarm.service.AlarmService;
import io.swagger.annotations.Api;
import io.swagger.v3.oas.annotations.Operation;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Api(tags = "展示信息接口")
@RestController
@RequestMapping("/alarm")
public class AlarmController {

    @Autowired
    private AlarmService alarmService;

    @Operation(summary = "获取视频列表")
    @PostMapping("/getVideoList")
    public ResponseResult<List<VideoInfoEntity>> getVideoList(@RequestBody AlarmVO queryVO) {

        try {
            List<VideoInfoEntity> result = this.alarmService.getVideoList(queryVO);
            if (result != null && result.size() > 0) {
                return ResponseResult.ok(result);
            } else {
                return ResponseResult.okMsg("查询无数据");
            }
        } catch (Exception e) {
            log.error("获取视频列表 参数：" + JSON.toJSONString(queryVO) + " 异常：", e);
            return ResponseResult.error(UserErrorCode.PARAM_ERROR, e.getMessage());
        }
    }
}
