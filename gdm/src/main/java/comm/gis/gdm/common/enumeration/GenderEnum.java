package comm.gis.gdm.common.enumeration;

import lombok.Getter;

@Getter
public enum GenderEnum {

    MALE(0, "男"),
    FEMALE(1, "女"),
    UNKNOWN(2, "未知");

    private final Integer code;
    private final String desc;

    GenderEnum(Integer code, String desc) {
        this.code = code;
        this.desc = desc;
    }

    /**
     * 单个枚举的展示
     */
    @Override
    public String toString() {
        return code + "-" + desc;
    }
}
