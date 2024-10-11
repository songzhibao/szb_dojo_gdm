package comm.gis.gdm.module.alarm.domain;

import java.sql.Timestamp;

import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@TableName("gdm_video_device")
public class VideoInfoEntity {

    @ApiModelProperty("ID")
    private Integer id;

    @ApiModelProperty("编号")
    private String code;

    @ApiModelProperty("名称")
    private String name;

    @ApiModelProperty("类型")
    private Integer type;

    @ApiModelProperty("状态")
    private Integer status;

    @ApiModelProperty("地址")
    private String address;

    @ApiModelProperty("经度")
    private Double lon;

    @ApiModelProperty("维度")
    private Double lat;

    @ApiModelProperty(value = "创建时间", example = "2018-10-01 12:18:48")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Timestamp createTime;

    @ApiModelProperty(value = "创建时间", example = "2018-10-01 12:18:48")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Timestamp updateTime;

}
