package comm.gis.gdm.module.file.controller;

import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import comm.gis.gdm.common.code.UserErrorCode;
import comm.gis.gdm.common.domain.ResponseResult;
import comm.gis.gdm.module.file.domain.*;
import comm.gis.gdm.module.file.service.FileService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Api(tags = "文件信息接口")
@RestController
@RequestMapping("/file")
public class FileController {

    @Autowired
    private FileService fileService;

    @ApiImplicitParam(name = "ids", value = "编号数组", required = true, dataType = "List<String>", dataTypeClass = String.class)
    @ApiOperation(value = "根据附件ids获取附件列表")
    @PostMapping("/getAttachmentListByIds")
    public ResponseResult<List<FileInfoEntity>> getAttachmentListByIds(@RequestParam List<String> ids) {

        try {
            List<FileInfoEntity> bean = this.fileService.getAttachmentListByIds(ids);
            if (bean != null) {
                return ResponseResult.ok(bean);
            } else {
                return ResponseResult.error(UserErrorCode.DATA_NOT_EXIST, false);
            }
        } catch (Exception e) {
            log.error("根据附件ids获取附件列表 异常：", e);
            return ResponseResult.error(UserErrorCode.PARAM_ERROR, e.getMessage());
        }
    }

    @ApiImplicitParam(name = "relationId", value = "关联ID", required = true, dataType = "String", dataTypeClass = String.class)
    @ApiOperation(value = "根据关联id获取附件列表")
    @PostMapping("/getAttachmentListByRelationId")
    public ResponseResult<List<FileInfoEntity>> getAttachmentListByRelationId(@RequestParam String relationId) {

        try {
            List<FileInfoEntity> bean = this.fileService.getAttachmentListByRelationId(relationId);
            if (bean != null) {
                return ResponseResult.ok(bean);
            } else {
                return ResponseResult.error(UserErrorCode.DATA_NOT_EXIST, false);
            }
        } catch (Exception e) {
            log.error("根据关联id获取附件列表 异常：", e);
            return ResponseResult.error(UserErrorCode.PARAM_ERROR, e.getMessage());
        }
    }

    @ApiImplicitParam(name = "fileId", value = "文件ID", required = true, dataType = "String", dataTypeClass = String.class)
    @ApiOperation(value = "根据文件ID删除文件")
    @GetMapping("deleteFile/{id}")
    public ResponseResult<Boolean> deleteFileById(@PathVariable("fileId") String fileId) {
        try {
            Boolean isOK = this.fileService.deleteFileById(fileId);
            if (isOK) {
                return ResponseResult.ok(isOK);
            } else {
                return ResponseResult.error(UserErrorCode.NO_PERMISSION, false);
            }
        } catch (Exception e) {
            log.error("根据文件ID删除文件 异常：", e);
            return ResponseResult.error(UserErrorCode.PARAM_ERROR, e.getMessage());
        }
    }

    @ApiOperation(value = "保存附件信息")
    @GetMapping("/saveAttachmentInfo")
    public ResponseResult<Boolean> saveAttachmentInfo(@RequestBody FileInfoEntity param) {
        try {
            Boolean isOK = this.fileService.saveAttachmentInfo(param);
            if (isOK) {
                return ResponseResult.ok(isOK);
            } else {
                return ResponseResult.error(UserErrorCode.NO_PERMISSION, false);
            }
        } catch (Exception e) {
            log.error("保存附件信息 异常：", e);
            return ResponseResult.error(UserErrorCode.PARAM_ERROR, e.getMessage());
        }
    }
}
