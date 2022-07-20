package me.omartanner.modulepal.api.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Map;

@Data
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Average {
    private Integer value;
    private Integer sampleSize;
    private Map<Integer, Integer> valueFrequencies;

    public Average(me.omartanner.modulepal.data.aggregates.Average average) {
        value = (int) Math.round(average.getValue());
        sampleSize = average.getSampleSize();
        valueFrequencies = average.getValueFrequencies();
    }
}
