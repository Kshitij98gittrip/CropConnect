package com.cropconnect.dto;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.cropconnect.entities.User;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MerchantDTO {
	
	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Integer id;
	
    @Size(max = 50)
    @NotNull
    private String firstName;
    
    @Size(max = 50)
    @NotNull
    private String lastName;
    
    @Max(value = 12)
    @Min(value = 12)
    private String aadhaarNo;
    
    
//    private Integer rating;
    private AddressDTO addressDTO;
    private UserDTO userDTO;
}

