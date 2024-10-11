package comm.gis.gdm.module.file.domain;

import java.sql.Timestamp;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@TableName("gdm_event_attachment")
public class FileInfoEntity {

    @ApiModelProperty("id")
    private String id;

    @ApiModelProperty("编号")
    @TableField(exist = false)
    private String code;

    @ApiModelProperty("名称")
    private String name;

    @ApiModelProperty("类型")
    private String type;

    @ApiModelProperty("链接地址")
    private String url;

    @ApiModelProperty("相对地址")
    private String relativePath;

    @ApiModelProperty("文件大小")
    @TableField("file_size")
    private String fileSize;

    @ApiModelProperty("是否有效")
    private Integer valid;

    @ApiModelProperty("操作人")
    private String creator;

    @ApiModelProperty("创建时间")
    @TableField(value = "create_time")
    private Timestamp createTime;

    @ApiModelProperty("关联id")
    @TableField(value = "relation_id")
    private String relationId;
}
