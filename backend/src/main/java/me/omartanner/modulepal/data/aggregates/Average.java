package me.omartanner.modulepal.data.aggregates;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.HashMap;
import java.util.Map;

@Data
@AllArgsConstructor
public class Average {  
    private Double value;
    private Integer sampleSize;
    private Map<Integer, Integer> valueFrequencies;

    public Average() {
        value = 0d;
        sampleSize = 0;
        valueFrequencies = new HashMap<>();
    }

    public void update(int sampleValue, boolean add) {
        if (add) {
            add(sampleValue);
        }
        else {
            remove(sampleValue);
        }
    }

    public void add(int newSampleValue) {
        sampleSize++;
        value = value + ((newSampleValue - value) / Float.valueOf(sampleSize));
        int freq = valueFrequencies.containsKey(newSampleValue) ? valueFrequencies.get(newSampleValue) : 0;
        freq += 1 ;
        valueFrequencies.put(newSampleValue, freq);

    }

    public void remove(int removeSampleValue) {
        sampleSize--;
        if (sampleSize == 0) {
            value = 0d;
        }
        else {
            value = value + ((value - removeSampleValue) / Float.valueOf(sampleSize));
        }
        if (valueFrequencies.containsKey(removeSampleValue)) {
            int freq = valueFrequencies.get(removeSampleValue);
            freq--;
            if (freq == 0) {
                valueFrequencies.remove(removeSampleValue);
            }
            else {
                valueFrequencies.put(removeSampleValue, freq);
            }
        }
    }
}
