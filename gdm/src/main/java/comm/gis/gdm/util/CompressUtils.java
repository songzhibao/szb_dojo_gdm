package comm.gis.gdm.util;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.zip.GZIPInputStream;
import java.util.zip.GZIPOutputStream;

public class CompressUtils {

    public static String compress(String str) {
        if (str == null || str.length() == 0) {
            return str;
        }
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        GZIPOutputStream gzip = null;
        try {
            gzip = new GZIPOutputStream(out);
            gzip.write(str.getBytes("UTF-8"));
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (gzip != null) {
                try {
                    gzip.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }

        return Base64.getEncoder().encodeToString(out.toByteArray());
    }

    public static String uncompress(String compressedStr) {
        if (compressedStr == null) {
            return null;
        }

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        ByteArrayInputStream in = null;
        GZIPInputStream ginzip = null;
        byte[] compressed = null;
        String decompressed = null;
        try {
            compressed = Base64.getDecoder().decode(compressedStr);
            in = new ByteArrayInputStream(compressed);
            ginzip = new GZIPInputStream(in);
            byte[] buffer = new byte[1024];
            int offset = -1;
            while ((offset = ginzip.read(buffer)) != -1) {
                out.write(buffer, 0, offset);
            }
            decompressed = out.toString();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (ginzip != null) {
                try {
                    ginzip.close();
                } catch (IOException e) {
                }
            }
            if (in != null) {
                try {
                    in.close();
                } catch (IOException e) {
                }
            }
            if (out != null) {
                try {
                    out.close();
                } catch (IOException e) {
                }
            }
        }
        return decompressed;
    }

    public String encodePolygon(Double[][] coordinate) {
        String result = "";
        Double[] encodeOffsets = new Double[0];
        Double prevX = this.quantize(coordinate[0][0]);
        Double prevY = this.quantize(coordinate[0][1]);
        // Store the origin offset
        encodeOffsets[0] = prevX;
        encodeOffsets[1] = prevY;

        for (int i = 0; i < coordinate.length; i++) {
            Double[] point = coordinate[i];
            result += this.encode(point[0], prevX);
            result += this.encode(point[1], prevY);

            prevX = this.quantize(point[0]);
            prevY = this.quantize(point[1]);
        }

        return result;
    }

    private String encode(Double val, Double prev) {
        // Quantization
        val = this.quantize(val);
        // var tmp = val;
        // Delta
        val = val - prev;

        if (((Integer.parseInt(val.toString()) << 1) ^ (((Integer.parseInt(val.toString()) >> 15)) + 64)) == 8232) {
            // WTF, 8232 will get syntax error in js code
            val--;
        }
        // ZigZag
        val = Double.valueOf((Integer.parseInt(val.toString()) << 1) ^ (Integer.parseInt(val.toString()) >> 15));
        // add offset and get unicode
        return String.valueOf(val + 64);
        // var tmp = {'tmp' : str};
        // try{
        // eval("(" + JSON.stringify(tmp) + ")");
        // }catch(e) {
        // console.log(val + 64);
        // }
    }

    private Double quantize(double val) {
        return Math.ceil(val * 1024);
    }

}
