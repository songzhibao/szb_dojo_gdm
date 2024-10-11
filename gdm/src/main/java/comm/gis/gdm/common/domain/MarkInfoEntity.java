package comm.gis.gdm.common.domain;

import com.baomidou.mybatisplus.annotation.TableField;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class MarkInfoEntity {

    @ApiModelProperty("标记编号")
    @TableField(exist = false)
    private String code;

    @ApiModelProperty("标记名称")
    @TableField(exist = false)
    private String showText;

    @ApiModelProperty("资源类型")
    @TableField(exist = false)
    private String deviceType;

    @ApiModelProperty("经度")
    @TableField(exist = false)
    private Double lon;

    @ApiModelProperty("维度")
    @TableField(exist = false)
    private Double lat;

    @ApiModelProperty("标记图标")
    @TableField(exist = false)
    private String imgUrl;

}
