package com.cropconnect.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cropconnect.entities.CartItem;

public interface CartItemRepository extends JpaRepository<CartItem, Integer> {
	
	List<CartItem> findByCartId(Integer cartId);
}
